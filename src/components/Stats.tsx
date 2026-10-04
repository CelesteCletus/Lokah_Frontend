import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Layers, Users } from 'lucide-react';

/* ─── Non-numerical Credibility Cards ───────────────────────────────────── */
const CARDS = [
  {
    id: 'trusted-partner',
    title: 'Building With Purpose',
    description: 'A trusted partner from concept to completion, backed by strong project management and construction techniques.',
    Icon: Calendar,
    delay: 0.10,
  },
  {
    id: 'end-to-end',
    title: 'End-to-End Expertise',
    description: 'From project planning and construction to interiors, renovation and maintenance.',
    Icon: Layers,
    delay: 0.22,
  },
  {
    id: 'built-around-needs',
    title: 'Built Around Your Needs',
    description: 'A client-focused approach to planning, coordination and execution.',
    Icon: Users,
    delay: 0.34,
  },
];

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function Stats() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <section ref={containerRef} className="relative py-24 md:py-32 overflow-hidden bg-matte-black">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(212,175,55,0.08) 0%, transparent 55%), radial-gradient(circle at 80% 50%, rgba(212,175,55,0.08) 0%, transparent 55%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-6"
        >
          <h2 className="section-heading">
            Built On <span className="text-gradient-gold">Credibility</span>
          </h2>
        </motion.div>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="text-center font-body text-ivory-400 text-sm md:text-base max-w-xl mx-auto mb-16 leading-relaxed tracking-wide"
        >
          The principles that guide our project management and construction practices.
        </motion.p>

        {/* ── 3-Card Grid: Desktop 3 cols, Tablet responsive ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {CARDS.map(({ id, title, description, Icon, delay }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 36 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              {/* Card */}
              <div
                className="relative glass-card p-8 md:p-10 flex flex-col items-center text-center h-full overflow-hidden
                  transition-all duration-500 ease-out
                  hover:-translate-y-1.5 hover:shadow-[0_8px_40px_rgba(212,175,55,0.12)]"
                style={{
                  borderColor: 'rgba(212,175,55,0.12)',
                  transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s cubic-bezier(0.16,1,0.3,1), border-color 0.45s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,175,55,0.32)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,175,55,0.12)';
                }}
              >
                {/* Subtle corner accents */}
                <span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-champagne-400/0 group-hover:border-champagne-400/40 transition-all duration-500" />
                <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-champagne-400/0 group-hover:border-champagne-400/40 transition-all duration-500" />

                {/* Soft glow behind icon */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-champagne-400/0 group-hover:bg-champagne-400/6 blur-2xl transition-all duration-700 pointer-events-none" />

                {/* Icon container */}
                <div
                  className="relative mb-7 w-14 h-14 flex items-center justify-center rounded-full
                    bg-champagne-400/8 border border-champagne-400/20
                    group-hover:bg-champagne-400/14 group-hover:border-champagne-400/40
                    transition-all duration-500 shrink-0"
                >
                  <Icon
                    className="w-7 h-7 text-champagne-400
                      group-hover:scale-110 group-hover:text-champagne-300
                      transition-all duration-500"
                  />
                </div>

                {/* Gold divider */}
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-champagne-400/60 to-transparent mb-5 group-hover:w-14 transition-all duration-500" />

                {/* Prominent Card Title */}
                <h3 className="font-display text-xl sm:text-2xl text-ivory-50 font-light mb-3 tracking-wide leading-tight group-hover:text-gold-300 transition-colors">
                  {title}
                </h3>

                {/* Description */}
                <p className="font-body text-ivory-300 text-sm leading-relaxed font-light">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decoration line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-champagne-400/25 to-transparent"
        />
      </div>
    </section>
  );
}
