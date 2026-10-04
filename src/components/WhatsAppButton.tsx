import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

// Replaced the jarring animate-ping (1s, default) with a bespoke
// keyframe-based pulse at 3s — communicates availability without
// visual urgency, which is more aligned with a luxury brand.
export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919946302222"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-40 w-14 h-14 flex items-center justify-center bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30 group focus-luxury"
      aria-label="Chat with Lokah Builders on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" fill="white" />

      {/* Tooltip */}
      <span className="absolute left-full ml-3 px-3 py-2 bg-charcoal-800 text-ivory-200 text-sm font-body rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-ivory-400/10">
        Chat with us
      </span>

      {/* Slow luxury pulse — 3s duration, understated */}
      <span
        className="absolute inset-0 rounded-full bg-emerald-500 opacity-0"
        style={{
          animation: 'whatsapp-pulse 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        }}
      />

      <style>{`
        @keyframes whatsapp-pulse {
          0% { transform: scale(1); opacity: 0.4; }
          70% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .whatsapp-pulse { animation: none !important; }
        }
      `}</style>
    </motion.a>
  );
}
