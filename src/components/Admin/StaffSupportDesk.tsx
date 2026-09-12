import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, RefreshCw, User, Clock, CheckCircle, XCircle, Circle, ChevronLeft } from 'lucide-react';
import {
  fetchAdminSupportConversations,
  fetchAdminSupportConversation,
  sendAdminSupportReply,
  updateSupportConversationStatus,
  sendSupportHeartbeat,
  sendAgentOffline,
  type SupportConversation,
  type SupportMessage,
} from '../../lib/db';

// ── Constants ─────────────────────────────────────────────────────────────────
const POLL_INTERVAL_MS = 4000;
const HEARTBEAT_INTERVAL_MS = 30000;

const STATUS_COLORS: Record<string, string> = {
  waiting: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  resolved: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  closed: 'text-ivory-400/40 bg-ivory-400/5 border-ivory-400/20',
};

const STATUS_LABEL: Record<string, string> = {
  waiting: 'Waiting',
  active: 'Active',
  resolved: 'Resolved',
  closed: 'Closed',
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  waiting: <Clock className="w-3 h-3" />,
  active: <Circle className="w-3 h-3 fill-current" />,
  resolved: <CheckCircle className="w-3 h-3" />,
  closed: <XCircle className="w-3 h-3" />,
};

function parseUtcTimestamp(iso: string): Date {
  // MySQL TIMESTAMP columns return strings like "2026-09-12 07:05:00" with no
  // timezone indicator. Without a suffix the browser treats them as *local* time,
  // so the time displayed is 5½ hours behind for IST users. Appending 'Z' (or
  // replacing the space separator with 'T') tells the engine the value is UTC.
  if (!iso) return new Date(NaN);
  const normalized = iso.includes('T') ? iso : iso.replace(' ', 'T');
  const withTz = normalized.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(normalized)
    ? normalized
    : normalized + 'Z';
  return new Date(withTz);
}

function formatTime(iso: string) {
  const d = parseUtcTimestamp(iso);
  const now = new Date();
  const diffH = (now.getTime() - d.getTime()) / 3600000;
  if (diffH < 24) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// ── Conversation List Item ─────────────────────────────────────────────────────
function ConvListItem({
  conv,
  selected,
  onClick,
}: {
  conv: SupportConversation;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-ivory-400/10 transition-all ${
        selected
          ? 'bg-gold-500/10 border-l-2 border-l-gold-500'
          : 'hover:bg-ivory-400/5 border-l-2 border-l-transparent'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-ivory-100 font-display text-sm font-semibold truncate pr-2">{conv.visitor_name}</span>
        <div className="flex items-center gap-1.5">
          {conv.unread_count > 0 && (
            <span className="text-[10px] bg-gold-500 text-matte-black rounded-full px-1.5 py-0.5 font-bold leading-none">
              {conv.unread_count}
            </span>
          )}
          <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border font-body ${STATUS_COLORS[conv.status] || STATUS_COLORS.waiting}`}>
            {STATUS_ICON[conv.status]}
            {STATUS_LABEL[conv.status]}
          </span>
        </div>
      </div>
      {conv.property_context && (
        <p className="text-ivory-400/60 text-[11px] font-body truncate">{conv.property_context}</p>
      )}
      <p className="text-ivory-400/40 text-[10px] font-body mt-0.5">{formatTime(conv.updated_at)}</p>
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function StaffSupportDesk() {
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeConv, setActiveConv] = useState<SupportConversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingConv, setLoadingConv] = useState(false);
  const [agentIsOnline, setAgentIsOnline] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevMessagesLenRef = useRef<number>(0);

  // Only auto-scroll when a genuinely NEW message arrives, not on every poll refresh
  useEffect(() => {
    if (messages.length > prevMessagesLenRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    prevMessagesLenRef.current = messages.length;
  }, [messages]);

  // Load conversation list
  const refreshList = useCallback(async () => {
    try {
      const convs = await fetchAdminSupportConversations();
      setConversations(convs);
    } catch { /* silent */ }
  }, []);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await refreshList();
      setLoading(false);
    };
    init();
  }, [refreshList]);

  // Heartbeat to stay online
  useEffect(() => {
    if (!agentIsOnline) return;
    sendSupportHeartbeat(); // immediate first ping
    heartbeatRef.current = setInterval(sendSupportHeartbeat, HEARTBEAT_INTERVAL_MS);
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [agentIsOnline]);

  // Mark offline on unmount
  useEffect(() => {
    return () => {
      sendAgentOffline();
    };
  }, []);

  // Keep the inbox itself live — without this, a brand-new visitor
  // conversation only ever appears after a manual refresh or once some
  // other conversation happens to be selected (which also refreshes the
  // list as a side effect). This interval runs independently of selection.
  useEffect(() => {
    const listPollRef = setInterval(refreshList, POLL_INTERVAL_MS);
    return () => clearInterval(listPollRef);
  }, [refreshList]);

  // Poll active conversation for new messages
  const pollActiveConv = useCallback(async () => {
    if (!selectedId) return;
    try {
      const { conversation: conv, messages: msgs } = await fetchAdminSupportConversation(selectedId);
      setActiveConv(conv);
      setMessages(msgs);
    } catch { /* silent */ }
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    // Load immediately on selection
    const loadConv = async () => {
      setLoadingConv(true);
      try {
        const { conversation: conv, messages: msgs } = await fetchAdminSupportConversation(selectedId);
        setActiveConv(conv);
        setMessages(msgs);
        await refreshList();
      } catch { /* silent */ }
      setLoadingConv(false);
    };
    loadConv();
    pollRef.current = setInterval(pollActiveConv, POLL_INTERVAL_MS);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selectedId, pollActiveConv, refreshList]);

  const handleSelectConv = (id: string) => {
    setSelectedId(id);
    setMobileView('chat');
    setReply('');
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedId || sending) return;
    const content = reply.trim();
    setReply('');
    setSending(true);
    try {
      const msg = await sendAdminSupportReply(selectedId, content);
      setMessages(prev => [...prev, msg]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to send reply.');
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (status: 'active' | 'waiting' | 'resolved' | 'closed') => {
    if (!selectedId) return;
    await updateSupportConversationStatus(selectedId, status);
    setActiveConv(prev => prev ? { ...prev, status } : null);
    setConversations(prev => prev.map(c => c.id === selectedId ? { ...c, status } : c));
  };

  const handleTogglePresence = async () => {
    if (agentIsOnline) {
      await sendAgentOffline();
      setAgentIsOnline(false);
    } else {
      setAgentIsOnline(true);
      sendSupportHeartbeat();
    }
  };

  // Filtered conversations
  const filteredConvs = conversations.filter(c => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  const unreadCount = conversations.filter(c => c.unread_count > 0).length;

  // ── Sidebar / Conversation List ────────────────────────────────────────────
  const sidebar = (
    <div className={`w-full md:w-72 lg:w-80 flex-shrink-0 border-r border-ivory-400/10 flex flex-col ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-ivory-400/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gold-400" />
            <h2 className="text-ivory-100 font-display text-sm font-semibold">
              Support Inbox
              {unreadCount > 0 && (
                <span className="ml-2 text-[10px] bg-gold-500 text-matte-black rounded-full px-1.5 py-0.5 font-bold">
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={refreshList}
            title="Refresh"
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-ivory-400/10 text-ivory-400/60 hover:text-ivory-200 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Presence toggle */}
        <button
          onClick={handleTogglePresence}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all text-xs font-body ${
            agentIsOnline
              ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400'
              : 'bg-ivory-400/5 border-ivory-400/15 text-ivory-400/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${agentIsOnline ? 'bg-emerald-400 animate-pulse' : 'bg-ivory-400/30'}`} />
            <span>{agentIsOnline ? 'You are Online' : 'You are Offline'}</span>
          </div>
          <span className="text-[10px] opacity-60">{agentIsOnline ? 'Click to go offline' : 'Click to go online'}</span>
        </button>

        {/* Status filter tabs */}
        <div className="flex gap-1 mt-3 flex-wrap">
          {['all', 'waiting', 'active', 'resolved'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-[10px] font-body capitalize px-2 py-1 rounded-full border transition-all ${
                statusFilter === s
                  ? 'bg-gold-500/20 border-gold-500/40 text-gold-400'
                  : 'border-ivory-400/15 text-ivory-400/50 hover:text-ivory-200'
              }`}
            >
              {s === 'all' ? `All (${conversations.length})` : s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center text-ivory-400/40 text-xs font-body">Loading conversations…</div>
        ) : filteredConvs.length === 0 ? (
          <div className="p-6 text-center">
            <MessageSquare className="w-8 h-8 text-ivory-400/20 mx-auto mb-2" />
            <p className="text-ivory-400/40 text-xs font-body">No conversations yet.</p>
          </div>
        ) : (
          filteredConvs.map(conv => (
            <ConvListItem
              key={conv.id}
              conv={conv}
              selected={selectedId === conv.id}
              onClick={() => handleSelectConv(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );

  // ── Chat Panel ─────────────────────────────────────────────────────────────
  const chatPanel = (
    <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
      {!selectedId ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
          <MessageSquare className="w-10 h-10 text-ivory-400/20" />
          <p className="text-ivory-400/40 text-sm font-body">Select a conversation to view messages</p>
        </div>
      ) : loadingConv ? (
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-gold-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* Conversation header */}
          <div className="px-4 py-3.5 border-b border-ivory-400/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile back */}
              <button
                onClick={() => setMobileView('list')}
                className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg hover:bg-ivory-400/10 text-ivory-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
                <User className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <p className="text-ivory-100 font-display text-sm font-semibold">{activeConv?.visitor_name}</p>
                <p className="text-ivory-400/50 text-[11px] font-body">
                  {activeConv?.visitor_phone && `${activeConv.visitor_phone} · `}
                  {activeConv?.visitor_email || ''}
                </p>
              </div>
            </div>

            {/* Status picker */}
            <div className="flex items-center gap-1.5">
              {(['active', 'resolved', 'closed'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => handleUpdateStatus(s)}
                  title={`Mark as ${STATUS_LABEL[s]}`}
                  className={`text-[10px] font-body px-2 py-1 rounded-full border transition-all capitalize ${
                    activeConv?.status === s
                      ? STATUS_COLORS[s]
                      : 'border-ivory-400/10 text-ivory-400/40 hover:border-ivory-400/30'
                  }`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Property context pill */}
          {activeConv?.property_context && (
            <div className="px-4 py-2 border-b border-ivory-400/5">
              <span className="text-[10px] font-body text-gold-400/70 bg-gold-500/5 border border-gold-500/15 px-2 py-0.5 rounded-full">
                📍 {activeConv.property_context}
              </span>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
            <AnimatePresence>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'visitor' && (
                    <div className="w-6 h-6 rounded-full bg-ivory-400/10 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                      <User className="w-3 h-3 text-ivory-400/60" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl ${
                      msg.sender === 'agent'
                        ? 'bg-gold-500/10 border border-gold-500/30 text-gold-300 rounded-br-sm'
                        : 'bg-charcoal-900/60 border border-ivory-400/10 text-ivory-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.sender_name && (
                      <p className="text-[9px] font-body opacity-50 mb-0.5">{msg.sender_name}</p>
                    )}
                    <p className="font-body text-sm leading-relaxed">{msg.content}</p>
                    <p className="text-[10px] opacity-30 mt-1 text-right font-body">
                      {parseUtcTimestamp(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Reply form */}
          {activeConv?.status !== 'closed' ? (
            <form onSubmit={handleSendReply} className="p-4 border-t border-ivory-400/10 flex gap-2">
              <input
                type="text"
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type your reply…"
                className="flex-1 bg-charcoal-900/40 border border-ivory-400/10 rounded-xl px-4 py-3 text-ivory-100 placeholder:text-ivory-400/40 focus:outline-none focus:border-gold-500/30 transition-all font-body text-sm"
              />
              <button
                type="submit"
                disabled={!reply.trim() || sending}
                className="w-11 h-11 flex items-center justify-center bg-gold-500 hover:bg-gold-400 text-matte-black rounded-xl disabled:opacity-40 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-4 border-t border-ivory-400/10 text-center">
              <p className="text-ivory-400/40 text-xs font-body">Conversation closed.</p>
              <button
                onClick={() => handleUpdateStatus('active')}
                className="mt-2 text-xs text-gold-400 hover:text-gold-300 font-body underline"
              >
                Reopen
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="flex h-full bg-[#141414]/50 rounded-xl border border-ivory-400/10 overflow-hidden">
      {sidebar}
      {chatPanel}
    </div>
  );
}
