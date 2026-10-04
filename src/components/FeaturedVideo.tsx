import { motion, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface FeaturedVideoProps {
  onNavigate: (section: string) => void;
}

export default function FeaturedVideo({ onNavigate }: FeaturedVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Pause video when offscreen
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.unobserve(video);
  }, []);

  return (
    <section ref={containerRef} className="relative py-24 md:py-32 overflow-hidden bg-matte-black">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Video */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-ivory-400/10 group bg-charcoal-900/40"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            >
              <source src="/videos/hero/construction-loop.mp4" type="video/mp4" />
            </video>
            
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            
            {/* Subtle Gold Accent border on hover */}
            <div className="absolute inset-0 border border-gold-500/0 group-hover:border-gold-500/20 transition-colors duration-700 pointer-events-none rounded-2xl" />
          </motion.div>

          {/* Right Column: Typography & Button */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="flex flex-col items-start text-left"
          >
            <span className="font-body text-champagne-400 text-sm tracking-widest uppercase mb-4 block">
              The Art of Building
            </span>
            
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50 tracking-wide mb-6 leading-tight">
              Designed Around <span className="text-gradient-gold font-medium">Life.</span>
            </h2>
            
            <p className="font-body text-ivory-300 text-base md:text-lg font-light leading-relaxed mb-10 max-w-xl">
              Every Lokah Builders development is thoughtfully designed to balance timeless architecture, premium materials, and exceptional living experiences.
            </p>

            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: '0 0 30px rgba(212, 175, 55, 0.15)',
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('properties')}
              className="group relative inline-flex items-center gap-4 px-10 py-5 overflow-hidden rounded-full border border-gold-500/30"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-charcoal-900 to-matte-950 rounded-full" />
              <span className="absolute inset-0 bg-gradient-to-br from-gold-950/20 to-matte-950 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative font-body text-ivory-200 group-hover:text-gold-300 transition-colors duration-300 font-medium tracking-widest text-sm uppercase">
                View Projects
              </span>
              <motion.svg
                className="relative w-5 h-5 text-gold-400 group-hover:text-gold-300 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
