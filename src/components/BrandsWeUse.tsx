import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';

export interface Brand {
  name: string;
  category: string;
  group: 'Cement & Concrete' | 'Steel & TMT' | 'Tiles & Bathware' | 'Paints & Coatings' | 'Electrical & Plumbing';
  logo: string;
}

const BRANDS: Brand[] = [
  // CEMENT & CONCRETE
  { name: 'UltraTech', category: 'Cement & Concrete', group: 'Cement & Concrete', logo: '/images/brands/ultratech.png' },
  { name: 'ACC', category: 'Cement', group: 'Cement & Concrete', logo: '/images/brands/acc.png' },
  { name: 'JSW Cement', category: 'Cement & Concrete', group: 'Cement & Concrete', logo: '/images/brands/jsw-cement.png' },
  { name: 'Ramco', category: 'Cement', group: 'Cement & Concrete', logo: '/images/brands/ramco.png' },
  { name: 'Zuari', category: 'Cement', group: 'Cement & Concrete', logo: '/images/brands/zuari.png' },

  // STEEL & TMT REINFORCEMENT
  { name: 'Tata Steel', category: 'Structural Steel', group: 'Steel & TMT', logo: '/images/brands/tata_steel.png' },
  { name: 'JSW Steel', category: 'Reinforcement TMT', group: 'Steel & TMT', logo: '/images/brands/jsw.png' },
  { name: 'Vyzakh Steel', category: 'TMT Bars', group: 'Steel & TMT', logo: '/images/brands/vyzakh.png' },
  { name: 'Kairali TMT', category: 'Steel Bars', group: 'Steel & TMT', logo: '/images/brands/kairali-tmt.png' },
  { name: 'Metcon TMT', category: 'Structural Steel', group: 'Steel & TMT', logo: '/images/brands/metcon-tmt.png' },
  { name: 'Tulsyan Steel', category: 'TMT Reinforcement', group: 'Steel & TMT', logo: '/images/brands/tulsyan-steel.png' },

  // TILES, CERAMICS & BATHWARE
  { name: 'Kajaria', category: 'Tiles & Ceramics', group: 'Tiles & Bathware', logo: '/images/brands/kajaria.png' },
  { name: 'RAK Ceramics', category: 'Tiles & Bathware', group: 'Tiles & Bathware', logo: '/images/brands/rak.png' },
  { name: 'Somany', category: 'Ceramics & Sanitaryware', group: 'Tiles & Bathware', logo: '/images/brands/somany.png' },
  { name: 'CERA', category: 'Sanitaryware & Faucets', group: 'Tiles & Bathware', logo: '/images/brands/cera.png' },
  { name: 'Jaquar', category: 'Bath & Lighting', group: 'Tiles & Bathware', logo: '/images/brands/jaquar.png' },
  { name: 'Hindware', category: 'Sanitaryware', group: 'Tiles & Bathware', logo: '/images/brands/hindware.png' },
  { name: 'TOTO', category: 'Premium Bathware', group: 'Tiles & Bathware', logo: '/images/brands/toto.png' },
  { name: 'Astral', category: 'Sanitaryware & Pipes', group: 'Tiles & Bathware', logo: '/images/brands/astral.png' },

  // PAINTS & COATINGS
  { name: 'Asian Paints', category: 'Paints & Coatings', group: 'Paints & Coatings', logo: '/images/brands/asian-paints.png' },
  { name: 'Berger Paints', category: 'Coatings & Emulsions', group: 'Paints & Coatings', logo: '/images/brands/berger-paints.png' },
  { name: 'Nippon Paint', category: 'Paints & Finishes', group: 'Paints & Coatings', logo: '/images/brands/nippon-paint.png' },

  // ELECTRICAL, LIGHTING & PLUMBING
  { name: 'Polycab', category: 'Cables & Wires', group: 'Electrical & Plumbing', logo: '/images/brands/polycab.png' },
  { name: 'RR Kabel', category: 'Cables & Wires', group: 'Electrical & Plumbing', logo: '/images/brands/rr-kabel.png' },
  { name: 'Finolex', category: 'Cables & Pipes', group: 'Electrical & Plumbing', logo: '/images/brands/finolex.png' },
  { name: 'Supreme', category: 'Piping & Drainage', group: 'Electrical & Plumbing', logo: '/images/brands/supreme.png' },
  { name: 'Legrand', category: 'Switches & Automation', group: 'Electrical & Plumbing', logo: '/images/brands/legrand.png' },
  { name: 'Crabtree', category: 'Electrical Accessories', group: 'Electrical & Plumbing', logo: '/images/brands/crabtree.png' },
  { name: 'Philips', category: 'Architectural Lighting', group: 'Electrical & Plumbing', logo: '/images/brands/philips.png' },
  { name: 'Havells', category: 'Electrical Systems', group: 'Electrical & Plumbing', logo: '/images/brands/havells.png' },
  { name: 'Thompson', category: 'Electrical & Cable', group: 'Electrical & Plumbing', logo: '/images/brands/thompson.png' },
  { name: 'V Guard', category: 'Electrical & Solar', group: 'Electrical & Plumbing', logo: '/images/brands/v-guard.png' },
];

const CATEGORY_GROUPS = [
  'All',
  'Cement & Concrete',
  'Steel & TMT',
  'Tiles & Bathware',
  'Paints & Coatings',
  'Electrical & Plumbing',
] as const;

function BrandLogo({ name, logo }: { name: string; logo: string }) {
  const [failed, setFailed] = useState(false);

  if (failed || !logo) {
    return (
      <div className="w-full h-full flex items-center justify-center font-display text-xs font-bold text-matte-950 tracking-wider uppercase bg-white/95 rounded p-1 text-center select-none">
        {name}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      className="max-h-full max-w-full w-auto object-contain transition-all duration-300"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function BrandsWeUse() {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const displayedGroups = activeFilter === 'All'
    ? CATEGORY_GROUPS.filter((g) => g !== 'All')
    : [activeFilter];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-matte-950 border-t border-ivory-400/10">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full mb-6"
          >
            <Award className="w-4 h-4 text-gold-400" />
            <span className="font-body text-gold-400 text-xs sm:text-sm tracking-wider font-medium">
              Material Excellence
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50 tracking-wide mb-6"
          >
            Brands <span className="text-gradient-gold font-medium">We Use</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body text-ivory-300 text-sm md:text-base leading-relaxed font-light"
          >
            We work with carefully selected manufacturers and suppliers whose products are commonly used across our residential, commercial and interior projects.
          </motion.p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {CATEGORY_GROUPS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-body transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-gold-500 text-matte-black font-semibold shadow-gold'
                  : 'bg-charcoal-900/80 text-ivory-300 border border-ivory-400/10 hover:border-gold-500/30 hover:text-ivory-50'
              }`}
            >
              {cat === 'All' ? 'All Brands' : cat}
            </button>
          ))}
        </div>

        {/* Categorized Brand Sections */}
        <div className="space-y-12">
          <AnimatePresence mode="wait">
            {displayedGroups.map((groupName) => {
              const groupBrands = BRANDS.filter((b) => b.group === groupName);
              if (groupBrands.length === 0) return null;

              return (
                <motion.div
                  key={groupName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {/* Category Sub-Header */}
                  <div className="flex items-center gap-3 pb-2 border-b border-ivory-400/10">
                    <div className="w-2 h-2 rounded-full bg-gold-400" />
                    <h3 className="font-display text-base sm:text-lg text-ivory-100 font-medium tracking-wide">
                      {groupName}
                    </h3>
                    <span className="font-body text-xs text-gold-400/80 font-medium">
                      ({groupBrands.length})
                    </span>
                  </div>

                  {/* Brand Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {groupBrands.map((brand, idx) => (
                      <motion.div
                        key={brand.name}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                        className="group relative bg-charcoal-900/90 p-3.5 flex flex-col items-center justify-between text-center h-36 rounded-xl border border-ivory-400/10 hover:border-gold-500/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-gold-500/10 cursor-default overflow-hidden"
                      >
                        {/* Top accent line on hover */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Logo Container */}
                        <div className="h-20 w-full flex items-center justify-center bg-white/95 rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-[1.02]">
                          <BrandLogo name={brand.name} logo={brand.logo} />
                        </div>

                        {/* Brand Name & Category */}
                        <div className="w-full pt-1.5 flex flex-col items-center">
                          <span className="font-display text-xs text-ivory-100 group-hover:text-gold-300 transition-colors font-medium truncate max-w-full">
                            {brand.name}
                          </span>
                          <span className="font-body text-[9px] text-ivory-400/70 tracking-wider uppercase font-light truncate max-w-full">
                            {brand.category}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
