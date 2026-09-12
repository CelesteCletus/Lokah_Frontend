import { motion } from 'framer-motion';

// A luxury cubic-bezier — consistent with all other page animations.
const LUXE_EASE = [0.16, 1, 0.3, 1] as const;

interface PageHeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  category?: string;
  // Optional: pass the portion of the title that should receive gold treatment.
  // If omitted, the last word is highlighted (previous behaviour).
  // Passing an empty string disables gold treatment entirely.
  goldWord?: string;
}

export default function PageHero({ title, subtitle, imageSrc, category, goldWord }: PageHeroProps) {
  // Split title into plain portion and the gold-highlighted word.
  // If goldWord is explicitly provided, use it; otherwise fall back to last word.
  const lastWord = goldWord !== undefined ? goldWord : title.split(' ').slice(-1)[0];
  const plainPart = lastWord
    ? title.slice(0, title.lastIndexOf(lastWord)).trim()
    : title;

  return (
    <div className="relative h-[40vh] sm:h-[50vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-matte-black" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center mt-12">
        {category && (
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: LUXE_EASE }}
            className="font-body text-champagne-400 text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 block font-medium"
          >
            {category}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: LUXE_EASE }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-ivory-50 tracking-wide mb-6 leading-tight"
        >
          {plainPart && <span>{plainPart} </span>}
          {lastWord && <span className="text-gradient-gold font-medium">{lastWord}</span>}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: LUXE_EASE }}
          className="font-body text-ivory-300 text-sm sm:text-base font-light tracking-wide max-w-2xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Decorative Border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-ivory-400/20 to-transparent" />
    </div>
  );
}
