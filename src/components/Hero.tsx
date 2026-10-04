import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, UserRound } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Video source - local path as requested
  const videoSrc = '/videos/hero/home-hero.mp4';

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
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video/Fallback */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: videoScale }}>
        {/* Cinematic Background Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-40'
          }`}
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Premium Dark Overlay - ~50% opacity with subtle gradient (45-60%) */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/50 to-black/60" />

        {/* Left/Right edge fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

        {/* Subtle vignette effect */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 0%, transparent 40%, #000000 100%)',
          }}
        />
      </motion.div>

      {/* Floating ambient particles - subtle luxury elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <motion.div
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-[10%] w-80 h-80 bg-champagne-400/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            opacity: [0.15, 0.3, 0.15],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Content with Parallax */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center min-h-screen flex flex-col items-center justify-center py-24"
      >


        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.4,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-ivory-50 tracking-wide leading-tight text-shadow-elegant">
            Perfect blend with
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="block mt-3 text-gradient-gold"
            >
              Extensive selection.
            </motion.span>
          </h1>
        </motion.div>

        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-champagne-400/40 to-transparent mb-6"
        />



        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary Button */}
          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: '0 0 50px rgba(212, 175, 55, 0.35), 0 0 100px rgba(212, 175, 55, 0.15)',
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('services')}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 overflow-hidden rounded-full"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-champagne-500 via-gold-500 to-champagne-500 transition-all duration-500" />
            <span className="absolute inset-0 bg-gradient-to-r from-gold-400 via-champagne-400 to-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative font-body font-semibold text-matte-black tracking-wider text-xs uppercase">
              Learn More
            </span>
            <ArrowRight className="relative w-4 h-4 text-matte-black transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>

          {/* Secondary Button */}
          <motion.button
            whileHover={{
              scale: 1.02,
              borderColor: 'rgba(212, 175, 55, 0.4)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('contact')}
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-matte-black/30 backdrop-blur-md border border-ivory-400/20 rounded-full transition-all duration-300"
          >
            <UserRound className="w-4 h-4 text-champagne-400" />
            <span className="font-body font-semibold text-ivory-350 text-xs uppercase tracking-wider group-hover:text-ivory-50 transition-colors">
              Connect with a Property Consultant
            </span>
          </motion.button>
        </motion.div>


      </motion.div>

      {/* Scroll Indicator — outer div fades in but does NOT bounce;
          only the inner dot animates so the gesture reads as singular. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <div
          className="flex flex-col items-center gap-3 cursor-pointer"
          onClick={() => {
            const nextSection = document.getElementById('stats');
            nextSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="font-body text-ivory-400/50 text-[11px] tracking-[0.3em] uppercase">
            Scroll to Explore
          </span>

          <div className="relative w-6 h-10 rounded-full border border-ivory-400/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 14, 0], opacity: [0.9, 0.2, 0.9] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: [0.45, 0, 0.55, 1],
              }}
              className="w-1 h-2 bg-champagne-400/80 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Corner Decorations — scaled for mobile vs desktop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 w-8 h-8 sm:w-16 sm:h-16 border-l border-t border-champagne-400/20 pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 w-8 h-8 sm:w-16 sm:h-16 border-r border-t border-champagne-400/20 pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-8 h-8 sm:w-16 sm:h-16 border-l border-b border-champagne-400/20 pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-8 h-8 sm:w-16 sm:h-16 border-r border-b border-champagne-400/20 pointer-events-none"
      />
    </section>
  );
}
