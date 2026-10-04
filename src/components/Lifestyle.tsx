import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { lifestyleImages } from '../data/sampleData';

const lifestyleDetails: Record<string, string> = {
  'Floor Plans': 'We provide clients with the highest possible level of service anywhere in the world. We stand out from all of our competitors, pursuing excellence through delivering quality projects from the very first floor plan.',
  'Interiors': 'Step inside a world of curated refinement. Our interiors feature book-matched Italian marble, customized hand-tufted rugs, premium brass metal accents, and intelligent climate controls. Double-height ceilings and open-plan configurations are meticulously tailored to foster deep connection, visual space, and timeless residential elegance.',
  'Architectures': 'Our architectural philosophy balances sculptural beauty with functional luxury. Every Lokah facade is designed to maximize natural lighting, utilize state-of-the-art materials, and establish a striking landmark presence.',
};

export default function Lifestyle() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeItem, setActiveItem] = useState<{ title: string; image: string; description: string } | null>(null);

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden bg-gradient-dark">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-body text-champagne-400 text-sm tracking-widest uppercase mb-4 block">
            Branded Services
          </span>
          <h2 className="section-heading mb-4">
            We Offer Ideas With <span className="text-gradient-gold">Impressive Details</span>
          </h2>
          <p className="font-body text-ivory-400 max-w-2xl mx-auto">
            We provide clients with the highest possible level of service anywhere in the world. We stand out from all of our competitors, pursuing excellence through delivering quality projects.
          </p>
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lifestyleImages.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveItem(item)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveItem(item); }}
              role="button"
              tabIndex={0}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer focus-luxury"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/40 to-transparent" />

              {/* Content overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                >
                  <h3 className="font-display text-2xl md:text-3xl text-ivory-50 mb-2 group-hover:text-champagne-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-body text-ivory-400 text-sm">{item.description}</p>
                </motion.div>
              </div>

              {/* Hover overlay — reduced to /10 for subtlety */}
              <div className="absolute inset-0 bg-champagne-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Decorative corner */}
              <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-champagne-400/0 group-hover:border-champagne-400/50 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 glass-card">
            <div className="w-1 h-8 bg-gradient-to-b from-champagne-400 to-gold-500" />
            <p className="font-display text-xl text-ivory-50 italic">
              "Where Every Home Tells a Story of Excellence"
            </p>
          </div>
        </motion.div>
      </div>

      {/* Details Popup Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-gold-500/20 bg-matte-950 p-0 shadow-2xl flex flex-col"
            >
              {/* Cover Image */}
              <div className="relative h-60 overflow-hidden bg-charcoal-900">
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-matte-950 to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full border border-ivory-400/20 bg-matte-950/80 hover:border-gold-500/40 hover:text-gold-400 flex items-center justify-center text-ivory-100 transition-all cursor-pointer z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Text Info */}
              <div className="p-8 md:p-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span className="font-body text-gold-400 text-xs tracking-wider">Lifestyle Experience</span>
                </div>
                
                <h3 className="font-display text-3xl text-ivory-50 tracking-wide">
                  {activeItem.title}
                </h3>
                
                <p className="font-body text-base text-gold-400/90 font-medium">
                  {activeItem.description}
                </p>
                
                <p className="font-body text-sm text-ivory-300/80 leading-relaxed pt-2 border-t border-ivory-400/10">
                  {lifestyleDetails[activeItem.title]}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
