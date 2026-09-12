import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface CTASectionProps {
  title?: string;
  description?: string;
  onOpenBooking: (type?: 'visit' | 'consultation') => void;
}

export default function CTASection({
  title = "Ready to Build Your Vision?",
  description = "Connect with LOKAH Builders & Developers to discuss custom designs, architectural proposals, or partner on joint ventures.",
  onOpenBooking,
}: CTASectionProps) {
  return (
    <section className="relative py-24 overflow-hidden bg-matte-950 border-t border-ivory-400/10">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-gold-950/10 via-transparent to-transparent opacity-60 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-[0.25em] uppercase font-semibold block">
            Begin the Journey
          </span>
          
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50 tracking-wide max-w-3xl mx-auto leading-tight">
            {title}
          </h2>

          <p className="font-body text-ivory-400 text-sm sm:text-base font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* Single clean gradient button — no conflicting span layering */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, boxShadow: '0 4px 24px rgba(212, 175, 55, 0.35)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenBooking('consultation')}
            className="focus-luxury mt-4 inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-gold text-matte-black font-body font-semibold tracking-wider text-xs uppercase transition-all duration-300"
          >
            <Calendar className="w-5 h-5" />
            <span>Talk to Our Experts</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
