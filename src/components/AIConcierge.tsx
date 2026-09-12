import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, X, PhoneCall, Wifi, WifiOff, User, ChevronLeft, MessageSquarePlus, Calendar, Calculator, Building2 } from 'lucide-react';
import { properties as staticProperties } from '../data/sampleData';
import type { Property } from '../data/sampleData';
import PropertyCard from './PropertyCard';
import {
  checkAgentPresence,
  getOrCreateSupportConversation,
  fetchSupportMessages,
  sendVisitorMessage,
  type SupportConversation,
  type SupportMessage,
} from '../lib/db';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** MySQL TIMESTAMP columns have no timezone suffix — treat them as UTC. */
function parseUtcTimestamp(iso: string): Date {
  if (!iso) return new Date(NaN);
  const normalized = iso.includes('T') ? iso : iso.replace(' ', 'T');
  const withTz = normalized.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(normalized)
    ? normalized
    : normalized + 'Z';
  return new Date(withTz);
}


// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  properties?: Property[];
  actions?: { label: string; action: string }[];
}

interface AIConciergeProps {
  properties?: Property[];
  onPropertyClick: (property: Property) => void;
  onOpenEmiCalculator?: () => void;
  onOpenBooking?: (type?: 'visit' | 'consultation') => void;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

// ─── Live Chat sub-view ───────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 4000;
const CONV_KEY = 'lokah_support_conv_id';

interface LiveChatProps {
  agentOnline: boolean;
  onBack: () => void;
}

function LiveChat({ agentOnline: initialOnline, onBack }: LiveChatProps) {
  // Visitor info state
  const [stage, setStage] = useState<'info' | 'chat'>('info');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [propertyContext, setPropertyContext] = useState('');
  const [infoError, setInfoError] = useState('');
  const [startingConv, setStartingConv] = useState(false);

  // Chat state
  const [conversation, setConversation] = useState<SupportConversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [agentOnline, setAgentOnline] = useState(initialOnline);
  const [lastTimestamp, setLastTimestamp] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Resume existing conversation on mount
  useEffect(() => {
    const existingId = sessionStorage.getItem(CONV_KEY);
    if (existingId) {
      fetchSupportMessages(existingId).then(({ messages: msgs, conversation: conv, agentOnline: ao }) => {
        setConversation(conv);
        setMessages(msgs);
        setAgentOnline(ao);
        if (msgs.length > 0) setLastTimestamp(msgs[msgs.length - 1].created_at);
        setStage('chat');
        setVisitorName(conv.visitor_name);
      }).catch(() => {
        sessionStorage.removeItem(CONV_KEY);
      });
    }
  }, []);

  // Long-polling for new messages
  const pollMessages = useCallback(async () => {
    if (!conversation) return;
    try {
      const { messages: newMsgs, agentOnline: ao } = await fetchSupportMessages(conversation.id, lastTimestamp);
      setAgentOnline(ao);
      if (newMsgs.length > 0) {
        setMessages(prev => [...prev, ...newMsgs]);
        setLastTimestamp(newMsgs[newMsgs.length - 1].created_at);
      }
    } catch { /* silent */ }
  }, [conversation, lastTimestamp]);

  useEffect(() => {
    if (stage !== 'chat' || !conversation) return;
    pollRef.current = setInterval(pollMessages, POLL_INTERVAL_MS);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [stage, conversation, pollMessages]);

  // Start conversation
  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) { setInfoError('Please enter your name.'); return; }
    setInfoError('');
    setStartingConv(true);
    try {
      const conv = await getOrCreateSupportConversation({
        visitor_name: visitorName.trim(),
        visitor_phone: visitorPhone.trim(),
        visitor_email: visitorEmail.trim(),
        property_context: propertyContext.trim(),
      });
      sessionStorage.setItem(CONV_KEY, conv.id);
      // Load initial messages (greeting)
      const { messages: msgs } = await fetchSupportMessages(conv.id);
      setConversation(conv);
      setMessages(msgs);
      if (msgs.length > 0) setLastTimestamp(msgs[msgs.length - 1].created_at);
      setStage('chat');
    } catch (err: unknown) {
      setInfoError(err instanceof Error ? err.message : 'Failed to connect. Please try again.');
    } finally {
      setStartingConv(false);
    }
  };

  // Start a brand-new conversation
  const handleNewChat = () => {
    sessionStorage.removeItem(CONV_KEY);
    setConversation(null);
    setMessages([]);
    setInput('');
    setSendError('');
    setLastTimestamp(undefined);
    setVisitorName('');
    setVisitorPhone('');
    setVisitorEmail('');
    setPropertyContext('');
    setInfoError('');
    setStage('info');
  };

  // Send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversation || sending) return;
    const content = input.trim();
    setInput('');
    setSendError('');
    setSending(true);
    // Optimistic UI
    const optimisticMsg: SupportMessage = {
      id: `optimistic-${Date.now()}`,
      conversation_id: conversation.id,
      sender: 'visitor',
      sender_name: visitorName,
      content,
      is_read: 0,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);
    try {
      const msg = await sendVisitorMessage(conversation.id, content);
      // Replace optimistic with real
      setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? msg : m));
      setLastTimestamp(msg.created_at);
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : 'Failed to send. Please try again.');
      // Remove optimistic
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
    } finally {
      setSending(false);
    }
  };

  // ── Offline form (when no agent is available) ──────────────────────────
  const offlineForm = (
    <form onSubmit={handleStartChat} className="flex flex-col gap-3 p-4">
      <p className="text-xs text-ivory-400/70 font-body leading-relaxed">
        Our team is currently offline. Leave your details and we'll get back to you shortly.
      </p>

      <input
        type="text"
        placeholder="Your Name *"
        value={visitorName}
        onChange={e => setVisitorName(e.target.value)}
        className="bg-charcoal-900/40 border border-ivory-400/10 rounded-xl px-3 py-2.5 text-ivory-100 placeholder:text-ivory-400/40 focus:outline-none focus:border-gold-500/30 transition-all font-body text-xs"
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={visitorPhone}
        onChange={e => setVisitorPhone(e.target.value)}
        className="bg-charcoal-900/40 border border-ivory-400/10 rounded-xl px-3 py-2.5 text-ivory-100 placeholder:text-ivory-400/40 focus:outline-none focus:border-gold-500/30 transition-all font-body text-xs"
      />
      <input
        type="email"
        placeholder="Email Address"
        value={visitorEmail}
        onChange={e => setVisitorEmail(e.target.value)}
        className="bg-charcoal-900/40 border border-ivory-400/10 rounded-xl px-3 py-2.5 text-ivory-100 placeholder:text-ivory-400/40 focus:outline-none focus:border-gold-500/30 transition-all font-body text-xs"
      />
      <input
        type="text"
        placeholder="Property you're interested in (optional)"
        value={propertyContext}
        onChange={e => setPropertyContext(e.target.value)}
        className="bg-charcoal-900/40 border border-ivory-400/10 rounded-xl px-3 py-2.5 text-ivory-100 placeholder:text-ivory-400/40 focus:outline-none focus:border-gold-500/30 transition-all font-body text-xs"
      />

      {infoError && <p className="text-red-400 text-xs font-body">{infoError}</p>}

      <button
        type="submit"
        disabled={startingConv}
        className="bg-gold-500 hover:bg-gold-400 text-matte-black font-display font-semibold text-sm py-2.5 rounded-xl transition-all disabled:opacity-50"
      >
        {startingConv ? 'Sending…' : 'Leave Message'}
      </button>
    </form>
  );

  // ── Online chat start form ─────────────────────────────────────────────
  const onlineInfoForm = (
    <form onSubmit={handleStartChat} className="flex flex-col gap-3 p-4">
      <p className="text-xs text-ivory-400/70 font-body leading-relaxed">
        A team member is online. Introduce yourself to begin.
      </p>

      <input
        type="text"
        placeholder="Your Name *"
        value={visitorName}
        onChange={e => setVisitorName(e.target.value)}
        className="bg-charcoal-900/40 border border-ivory-400/10 rounded-xl px-3 py-2.5 text-ivory-100 placeholder:text-ivory-400/40 focus:outline-none focus:border-gold-500/30 transition-all font-body text-xs"
      />
      <input
        type="tel"
        placeholder="Phone Number (optional)"
        value={visitorPhone}
        onChange={e => setVisitorPhone(e.target.value)}
        className="bg-charcoal-900/40 border border-ivory-400/10 rounded-xl px-3 py-2.5 text-ivory-100 placeholder:text-ivory-400/40 focus:outline-none focus:border-gold-500/30 transition-all font-body text-xs"
      />
      <input
        type="text"
        placeholder="Property you're interested in (optional)"
        value={propertyContext}
        onChange={e => setPropertyContext(e.target.value)}
        className="bg-charcoal-900/40 border border-ivory-400/10 rounded-xl px-3 py-2.5 text-ivory-100 placeholder:text-ivory-400/40 focus:outline-none focus:border-gold-500/30 transition-all font-body text-xs"
      />

      {infoError && <p className="text-red-400 text-xs font-body">{infoError}</p>}

      <button
        type="submit"
        disabled={startingConv}
        className="bg-gold-500 hover:bg-gold-400 text-matte-black font-display font-semibold text-sm py-2.5 rounded-xl transition-all disabled:opacity-50"
      >
        {startingConv ? 'Connecting…' : 'Start Chat'}
      </button>
    </form>
  );

  // ── Active chat UI ─────────────────────────────────────────────────────
  const chatUI = (
    <>
      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        {messages.map(msg => {
          const isVisitor = msg.sender === 'visitor';
          const isAgent = msg.sender === 'agent';
          const senderLabel = isVisitor
            ? (visitorName || 'You')
            : isAgent
              ? (msg.sender_name || 'Lokah Team')
              : 'Lokah';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isVisitor ? 'items-end' : 'items-start'}`}
            >
              {/* Sender name label */}
              <span className={`text-[10px] font-body mb-1 px-1 ${isVisitor ? 'text-gold-400/60' : 'text-ivory-400/50'}`}>
                {senderLabel}
              </span>

              <div className={`flex items-end gap-2 ${isVisitor ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mb-1 ${
                  isVisitor
                    ? 'bg-gold-500/30 border border-gold-500/40'
                    : 'bg-ivory-400/10 border border-ivory-400/20'
                }`}>
                  <User className={`w-3 h-3 ${isVisitor ? 'text-gold-400' : 'text-ivory-300'}`} />
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl ${
                    isVisitor
                      ? 'bg-gold-500/15 border border-gold-500/30 text-gold-200 rounded-br-sm'
                      : 'bg-charcoal-900/60 border border-ivory-400/10 text-ivory-200 rounded-bl-sm'
                  }`}
                >
                  <p className="font-body text-xs leading-relaxed">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isVisitor ? 'text-gold-400/40 text-right' : 'text-ivory-400/30 text-left'}`}>
                    {parseUtcTimestamp(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {/* Waiting state */}
        {agentOnline && conversation?.status === 'waiting' && (
          <div className="flex justify-start">
            <div className="bg-charcoal-900/60 border border-ivory-400/10 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 bg-gold-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Send error */}
      {sendError && (
        <p className="text-red-400 text-xs font-body px-4 pb-1">{sendError}</p>
      )}

      {/* Input / Closed footer */}
      {conversation?.status !== 'closed' ? (
        <form onSubmit={handleSend} className="p-3 border-t border-ivory-400/10 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 bg-charcoal-900/40 border border-ivory-400/10 rounded-xl px-3 py-2.5 text-ivory-100 placeholder:text-ivory-400/40 focus:outline-none focus:border-gold-500/30 transition-all font-body text-xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="w-9 h-9 flex items-center justify-center bg-gold-500 hover:bg-gold-400 text-matte-black rounded-xl disabled:opacity-40 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <div className="border-t border-ivory-400/10 p-3 flex flex-col items-center gap-2">
          <p className="text-center text-ivory-400/50 text-xs font-body">
            This conversation has been closed.
          </p>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 hover:border-gold-500/50 text-gold-300 hover:text-gold-200 rounded-xl font-body text-xs font-semibold transition-all"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            Start New Chat
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Live chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-ivory-400/10">
        <button
          onClick={onBack}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-ivory-400/10 transition-colors text-ivory-300"
          title="Back to concierge"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className={`w-2 h-2 rounded-full ${agentOnline ? 'bg-emerald-400' : 'bg-ivory-400/30'} ${agentOnline ? 'shadow-[0_0_6px_rgba(52,211,153,0.6)]' : ''}`} />
          <span className="text-ivory-200 font-display text-sm font-semibold">Live Support</span>
        </div>
        <span className={`text-[10px] font-body ${agentOnline ? 'text-emerald-400' : 'text-ivory-400/50'}`}>
          {agentOnline ? 'Team Online' : 'Leave a Message'}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-h-0">
        {stage === 'info'
          ? (agentOnline ? onlineInfoForm : offlineForm)
          : chatUI
        }
      </div>
    </>
  );
}

// ─── Main Concierge Component ─────────────────────────────────────────────────

export default function AIConcierge({
  properties = staticProperties,
  onPropertyClick,
  onOpenEmiCalculator,
  onOpenBooking,
  isOpen: controlledIsOpen,
  onOpen,
  onClose,
}: AIConciergeProps) {
  const navigate = useNavigate();
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : localIsOpen;

  const setIsOpenState = (val: boolean) => {
    if (val) {
      if (onOpen) onOpen();
      else setLocalIsOpen(true);
    } else {
      if (onClose) onClose();
      else setLocalIsOpen(false);
    }
  };

  const [showLiveChat, setShowLiveChat] = useState(false);
  const [agentOnline, setAgentOnline] = useState(false);

  // Poll agent presence when widget is open
  useEffect(() => {
    if (!isOpen) return;
    checkAgentPresence().then(setAgentOnline);
    const id = setInterval(() => checkAgentPresence().then(setAgentOnline), 30000);
    return () => clearInterval(id);
  }, [isOpen]);

  return (
    <>
      {/* FAB — Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpenState(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-600 text-matte-black rounded-full shadow-lg shadow-gold-500/30 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
            aria-label="Open property concierge"
          >
            <Sparkles className="w-6 h-6" />
            {agentOnline && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-matte-black" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Widget Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-6 right-6 left-6 sm:left-auto z-50 w-auto sm:w-[360px] max-w-[360px] flex flex-col bg-[#141414]/95 backdrop-blur-xl border border-ivory-400/15 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
          >
            {showLiveChat ? (
              // ── Live Chat View (Only active when Live Support is selected) ──
              <>
                <div className="flex items-center justify-between px-4 py-3 bg-charcoal-900/50 border-b border-ivory-400/10">
                  <button
                    onClick={() => setShowLiveChat(false)}
                    className="flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 transition-colors font-body font-medium cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Menu</span>
                  </button>
                  <button
                    onClick={() => setIsOpenState(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-ivory-400/10 transition-colors text-ivory-300 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <LiveChat
                  agentOnline={agentOnline}
                  onBack={() => setShowLiveChat(false)}
                />
              </>
            ) : (
              // ── Property Concierge Menu Hub ────────────────────────────────
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3 bg-charcoal-900/50 border-b border-ivory-400/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-gold-400" />
                    </div>
                    <div>
                      <p className="text-ivory-100 font-display text-sm font-semibold leading-tight">Property Concierge</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {agentOnline ? (
                          <><Wifi className="w-2.5 h-2.5 text-emerald-400" /><span className="text-[10px] text-emerald-400 font-body font-medium">Team Online</span></>
                        ) : (
                          <><WifiOff className="w-2.5 h-2.5 text-ivory-400/60" /><span className="text-[10px] text-ivory-400/60 font-body">Support Available</span></>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpenState(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-ivory-400/10 transition-colors text-ivory-300 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Services Menu */}
                <div className="p-5 space-y-4 overflow-y-auto max-h-[500px]">
                  <div className="text-center pb-1">
                    <h4 className="font-display text-base text-ivory-50 font-light">How can we assist you?</h4>
                    <p className="font-body text-xs text-ivory-400 font-light mt-1">
                      Choose an option below to connect with our team or access client services.
                    </p>
                  </div>

                  {/* Primary Option: Live Customer Support */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLiveChat(true)}
                    className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-gold-500/20 via-gold-500/10 to-transparent border border-gold-500/40 hover:border-gold-500/70 transition-all group cursor-pointer shadow-lg shadow-gold-500/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0 group-hover:bg-gold-500 group-hover:text-matte-black transition-all">
                        <MessageSquarePlus className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-display text-sm text-gold-300 font-semibold group-hover:text-gold-200">
                            Live Customer Support
                          </span>
                          {agentOnline ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                              Online
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-gold-500/15 text-gold-400 border border-gold-500/25 font-semibold">
                              Leave Msg
                            </span>
                          )}
                        </div>
                        <p className="font-body text-xs text-ivory-300/80 mt-1 font-light leading-relaxed">
                          Chat directly with a LOKAH sales advisor or support representative in real time.
                        </p>
                      </div>
                    </div>
                  </motion.button>

                  {/* Secondary Options */}
                  <div className="space-y-2.5 pt-1">
                    <button
                      onClick={() => {
                        setIsOpenState(false);
                        if (onOpenBooking) {
                          onOpenBooking('visit');
                        } else {
                          const el = document.getElementById('booking-form') || document.getElementById('site-visit-form');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="w-full text-left p-3.5 rounded-xl bg-charcoal-900/60 hover:bg-gold-500/10 border border-ivory-400/10 hover:border-gold-500/30 transition-all group flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-ivory-400/5 border border-ivory-400/10 flex items-center justify-center text-gold-400 shrink-0 group-hover:border-gold-500/30">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs font-semibold text-ivory-100 group-hover:text-gold-300">
                          Schedule a Site Visit
                        </p>
                        <p className="font-body text-[11px] text-ivory-400/70 font-light truncate">
                          Book a guided tour of our luxury developments
                        </p>
                      </div>
                    </button>

                    {onOpenEmiCalculator && (
                      <button
                        onClick={() => {
                          setIsOpenState(false);
                          onOpenEmiCalculator();
                        }}
                        className="w-full text-left p-3.5 rounded-xl bg-charcoal-900/60 hover:bg-gold-500/10 border border-ivory-400/10 hover:border-gold-500/30 transition-all group flex items-center gap-3 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-ivory-400/5 border border-ivory-400/10 flex items-center justify-center text-gold-400 shrink-0 group-hover:border-gold-500/30">
                          <Calculator className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-xs font-semibold text-ivory-100 group-hover:text-gold-300">
                            Calculate Property EMI
                          </p>
                          <p className="font-body text-[11px] text-ivory-400/70 font-light truncate">
                            Estimate monthly installments &amp; financial terms
                          </p>
                        </div>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsOpenState(false);
                        const el = document.getElementById('properties');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          navigate('/projects/ongoing');
                        }
                      }}
                      className="w-full text-left p-3.5 rounded-xl bg-charcoal-900/60 hover:bg-gold-500/10 border border-ivory-400/10 hover:border-gold-500/30 transition-all group flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-ivory-400/5 border border-ivory-400/10 flex items-center justify-center text-gold-400 shrink-0 group-hover:border-gold-500/30">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs font-semibold text-ivory-100 group-hover:text-gold-300">
                          Explore Our Projects
                        </p>
                        <p className="font-body text-[11px] text-ivory-400/70 font-light truncate">
                          Browse villas, apartments &amp; luxury residences
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
