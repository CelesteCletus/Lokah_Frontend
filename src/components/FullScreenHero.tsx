import { motion } from 'framer-motion';

interface FullScreenHeroProps {
  title: string;
  subtitle: string;
  imageSrc?: string;
  videoSrc?: string;
  category?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  align?: 'center' | 'left';
  showScrollIndicator?: boolean;
}

export default function FullScreenHero({
  title,
  subtitle,
  imageSrc,
  videoSrc,
  category,
  ctaText,
  onCtaClick,
  align = 'center',
  showScrollIndicator = true,
}: FullScreenHeroProps) {
  const isLeft = align === 'left';

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-matte-black">
      
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {videoSrc ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          imageSrc && (
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover object-center"
            />
          )
        )}
        
        {/* Dark Cinematic Overlays */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-matte-black/40 to-matte-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-matte-black/60 via-transparent to-matte-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className={`max-w-3xl ${isLeft ? 'text-left mr-auto' : 'text-center mx-auto'} space-y-6`}>
          
          {category && (
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`font-body text-champagne-400 text-xs sm:text-sm tracking-[0.35em] uppercase mb-4 block font-semibold ${isLeft ? 'text-left' : 'text-center'}`}
            >
              {category}
            </motion.span>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className={`font-display text-4xl sm:text-5xl md:text-6xl font-light text-ivory-50 tracking-wide leading-tight ${isLeft ? 'text-left' : 'text-center'}`}
          >
            {title.split(' ').map((word, i, arr) => (
              <span key={i} className={i === arr.length - 1 || i === arr.length - 2 ? 'text-gradient-gold font-medium' : ''}>
                {word}{' '}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`font-body text-ivory-300 text-sm sm:text-base md:text-lg font-light tracking-wide leading-relaxed max-w-2xl ${isLeft ? 'text-left' : 'mx-auto text-center'}`}
          >
            {subtitle}
          </motion.p>

          {ctaText && onCtaClick && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className={`pt-4 ${isLeft ? 'text-left' : 'text-center'}`}
            >
              <button
                onClick={() => onCtaClick()}
                className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-full border border-gold-500/35"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-champagne-500 to-gold-500 transition-transform duration-500 transform scale-x-0 group-hover:scale-x-100 origin-left" />
                <span className="absolute inset-0 bg-gradient-gold opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                <span className="relative font-body text-matte-black font-semibold tracking-wider text-xs uppercase transition-colors duration-300">
                  {ctaText}
                </span>
              </button>
            </motion.div>
          )}

        </div>
      </div>

      {/* Scroll cue indicator */}
      {showScrollIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="font-body text-[10px] text-ivory-400 uppercase tracking-widest font-light">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-ivory-400/30 flex justify-center p-1"
          >
            <div className="w-1.5 h-1.5 bg-gold-450 rounded-full" />
          </motion.div>
        </motion.div>
      )}

      {/* Elegant Bottom Edge Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-matte-black to-transparent pointer-events-none" />
    </section>
  );
}
