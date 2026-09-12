import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import IntroBackgroundSlideshow from './IntroBackgroundSlideshow';

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [stage, setStage] = useState<1 | 2>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartRef = useRef<number | null>(null);

  // Handle transitions with a lock to prevent multiple triggers
  const transitionTo = (nextStage: 1 | 2) => {
    if (isTransitioning || stage === nextStage) return;
    setIsTransitioning(true);
    setStage(nextStage);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); // match transition duration
  };

  // Scroll wheel intercept
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 20) return; // threshold

      if (e.deltaY > 0) {
        // Scroll down
        if (stage === 1) {
          transitionTo(2);
        }
      } else {
        // Scroll up
        if (stage === 2) {
          transitionTo(1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [stage, isTransitioning]);

  // Touch intercept for mobile devices
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartRef.current === null) return;
      
      const touchEnd = e.touches[0].clientY;
      const diff = touchStartRef.current - touchEnd;

      if (Math.abs(diff) < 30) return; // threshold

      if (diff > 0) {
        // Swipe up (scroll down)
        if (stage === 1) {
          e.preventDefault();
          transitionTo(2);
        }
      } else {
        // Swipe down (scroll up)
        if (stage === 2) {
          e.preventDefault();
          transitionTo(1);
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [stage, isTransitioning]);

  return (
    <div className="fixed inset-0 z-50 h-screen w-screen bg-matte-black select-none overflow-hidden flex items-center justify-center">
      {/* Subtle background pattern with slight zoom animation depending on the stage */}
      <motion.div
        animate={{
          scale: stage === 1 ? 1 : 1.08,
          opacity: stage === 1 ? 0.05 : 0.03,
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Golden-outline 3D construction renders — fades in right after the opening beat, cycles behind the copy */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.4, ease: 'easeInOut' }}
        className="absolute inset-0"
      >
        <IntroBackgroundSlideshow />
      </motion.div>



      {/* STAGE 1: Welcome Section */}
      <AnimatePresence>
        {stage === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: -50,
              transition: { duration: 0.8, ease: 'easeInOut' },
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto"
          >
            {/* Branding - Logo */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <img
                src="/logo.png"
                alt="Lokah Builders & Developers - Villas & Apartments"
                className="h-24 md:h-32 w-auto object-contain drop-shadow-[0_6px_24px_rgba(0,0,0,0.95)]"
              />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-ivory-50 tracking-wide leading-tight mb-6"
              style={{
                textShadow: '0 4px 28px rgba(0, 0, 0, 0.95), 0 2px 10px rgba(0, 0, 0, 0.9)',
              }}
            >
              Crafting Extraordinary
              <span
                className="block mt-1 text-gradient-gold font-semibold"
                style={{
                  filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.95))',
                }}
              >
                Living.
              </span>
            </motion.h1>



            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mb-12"
            >
              <button
                onClick={onComplete}
                className="group relative inline-flex items-center gap-4 px-10 py-4 overflow-hidden rounded-full border border-gold-500/40 bg-matte-950/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.8)] hover:border-gold-400 transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-gold-500/10 via-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative font-body text-ivory-100 group-hover:text-gold-300 transition-colors duration-300 font-medium tracking-widest text-xs md:text-sm uppercase">
                  Explore Lokah
                </span>
                <motion.svg
                  className="relative w-4 h-4 text-gold-400 group-hover:text-gold-300 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.2, duration: 1 }}
              onClick={() => transitionTo(2)}
              className="absolute bottom-8 flex flex-col items-center gap-2.5 cursor-pointer group"
            >
              <span
                className="text-ivory-200 group-hover:text-gold-400 transition-colors text-[10px] tracking-[0.4em] font-body uppercase font-medium"
                style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.95)' }}
              >
                Scroll Down
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg
                  className="w-4 h-4 text-gold-500/80 group-hover:text-gold-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2: Brand Signature & Philosophy */}
      <AnimatePresence>
        {stage === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -30,
              transition: { duration: 0.6 },
            }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 max-w-5xl mx-auto py-12"
          >
            {/* Brand Subtitle Line */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-500/50" />
              <span className="font-body text-[10px] md:text-xs tracking-[0.35em] text-gold-400/90 font-medium uppercase" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
                Building With Purpose
              </span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold-500/50" />
            </motion.div>

            {/* Main Editorial Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.9 }}
              className="mb-8 md:mb-10 max-w-3xl"
            >
              <h2
                className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50 tracking-wide leading-tight"
                style={{
                  textShadow: '0 4px 28px rgba(0, 0, 0, 0.95), 0 2px 10px rgba(0, 0, 0, 0.9)',
                }}
              >
                "Luxury isn't measured in <span className="text-gradient-gold font-normal">square feet</span>."
              </h2>
              <p
                className="font-body text-ivory-200/90 text-xs sm:text-base md:text-lg font-light tracking-wide mt-3 md:mt-4 leading-relaxed max-w-2xl mx-auto"
                style={{
                  textShadow: '0 2px 16px rgba(0, 0, 0, 0.95)',
                }}
              >
                It is measured in thoughtful design, precise planning, and focused turnkey execution.
              </p>
            </motion.div>



            {/* Integrated CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
            >
              <button
                onClick={onComplete}
                className="group relative inline-flex items-center gap-4 px-10 py-4 overflow-hidden rounded-full border border-gold-500/40 bg-matte-950/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.8)] hover:border-gold-400 transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-gold-500/10 via-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative font-body text-ivory-100 group-hover:text-gold-300 transition-colors duration-300 font-medium tracking-widest text-xs md:text-sm uppercase">
                  Explore Lokah
                </span>
                <motion.svg
                  className="relative w-4 h-4 text-gold-400 group-hover:text-gold-300 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </button>
            </motion.div>

            {/* Scroll Back Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              onClick={() => transitionTo(1)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer group"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg
                  className="w-3.5 h-3.5 text-gold-500/80 group-hover:text-gold-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </motion.div>
              <span className="text-ivory-400/70 group-hover:text-gold-400 transition-colors text-[9px] tracking-[0.35em] font-body uppercase font-medium">
                Scroll Up
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
