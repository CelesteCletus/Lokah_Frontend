import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export default function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      <div className="relative pt-40 pb-16 border-b border-ivory-400/10 bg-gradient-dark">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 block font-medium">
            Legal
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-ivory-50 tracking-wide mb-4">
            {title}
          </h1>
          <p className="font-body text-ivory-400/70 text-xs">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="glass-card p-8 md:p-12 space-y-8 font-body text-ivory-300 text-sm leading-relaxed font-light">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
