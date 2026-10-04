import { ReactNode } from 'react';
import { motion } from 'framer-motion';

// The luxury cubic-bezier — a strong initial velocity that decelerates to a
// soft stop. Used consistently across every motion in the codebase so all
// scroll reveals feel like one cohesive design language.
const LUXE_EASE = [0.16, 1, 0.3, 1] as const;

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  onClick?: () => void;
}

export default function RevealOnScroll({
  children,
  delay = 0,
  duration = 0.8,
  yOffset = 30,
  className = '',
  onClick,
}: RevealOnScrollProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: LUXE_EASE }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
