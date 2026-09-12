import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Golden-outline 3D construction/architecture renders — cycled behind the intro copy.
const BLUEPRINT_IMAGES = [
  '/images/intro/blueprint-luxury-villa.png',
  '/images/intro/blueprint-apartment-tower.png',
  '/images/intro/blueprint-house-frame.png',
  '/images/intro/blueprint-residential-block.png',
];

const DISPLAY_DURATION = 4000; // ms each image stays on screen
const FADE_DURATION = 1.4; // seconds for the crossfade

export default function IntroBackgroundSlideshow() {
  const [index, setIndex] = useState(0);

  // Preload every frame up front so the crossfade never stutters on a cold cache.
  useEffect(() => {
    BLUEPRINT_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % BLUEPRINT_IMAGES.length);
    }, DISPLAY_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence mode="sync">
        <motion.div
          key={BLUEPRINT_IMAGES[index]}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1.08 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: FADE_DURATION, ease: 'easeInOut' },
            scale: {
              duration: DISPLAY_DURATION / 1000 + FADE_DURATION,
              ease: 'linear',
            },
          }}
          className="absolute inset-0"
        >
          <img
            src={BLUEPRINT_IMAGES[index]}
            alt=""
            className="w-full h-full object-cover opacity-95"
            style={{ mixBlendMode: 'screen', filter: 'brightness(1.22) contrast(1.08)' }}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Vignette — softened slightly to enhance image clarity while preserving text contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.60) 50%, rgba(10,10,10,0.90) 100%)',
        }}
      />
    </div>
  );
}
