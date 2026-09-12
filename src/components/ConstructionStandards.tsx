import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ShieldCheck, Cpu, Sparkles, ChevronDown, FileCheck2, Info } from 'lucide-react';

interface SpecificationItem {
  name: string;
  summary: string;
  details?: string[];
}

interface SpecCategory {
  id: string;
  title: string;
  icon: any;
  description: string;
  items: SpecificationItem[];
}

const CATEGORIES: SpecCategory[] = [
  {
    id: 'structural',
    title: 'Structural Work',
    icon: Layers,
    description: 'Engineering practices for earthwork, foundation systems, and reinforced concrete framework.',
    items: [
      {
        name: 'Earth Excavation',
        summary: 'Site excavation executed to required engineering depths based on soil strata bearing capacity tests.',
      },
      {
        name: 'Foundation & Rubble Base',
        summary: 'Random rubble masonry foundation laid with cement mortar over compacted hard strata for load stability.',
      },
      {
        name: 'RCC Footing & Columns',
        summary: 'Reinforced cement concrete isolated or raft footings with engineered column starter bars for load distribution.',
      },
      {
        name: 'RCC Beams & Slabs',
        summary: 'Monolithic RCC beam casting and slab pours adhering to structural structural calculations and curing timelines.',
      },
      {
        name: 'RCC Lintel, Sunshades & Belt',
        summary: 'Continuous lintel beams over masonry openings with integrated weather sunshades and seismic tie belts.',
      },
      {
        name: 'Basement Filling & Parapet',
        summary: 'Compacted gravel basement backfill and reinforced masonry parapet walls with coping plastering.',
      },
      {
        name: 'Reinforcement Steel',
        summary: 'High-yield TMT steel bars (Fe 500 / 550) tied with anti-corrosive binding wire according to structural bar schedules.',
      },
    ],
  },
  {
    id: 'materials',
    title: 'Standard Materials',
    icon: ShieldCheck,
    description: 'Commonly selected raw materials and structural inputs for strength and longevity.',
    items: [
      {
        name: 'Concrete Mix',
        summary: 'Controlled concrete mix design (typically M20 grade or project-specified) mixed for optimal compressive strength.',
      },
      {
        name: 'Cement',
        summary: 'Brand-grade Portland Pozzolana Cement (PPC) or Ordinary Portland Cement (OPC) sourced from trusted manufacturers.',
      },
      {
        name: 'Fine & Coarse Sand',
        summary: 'Washed manufactured sand (M-Sand / P-Sand) conforming to IS standards for masonry, concreting, and plastering.',
      },
      {
        name: 'Blocks & Bricks',
        summary: 'First-quality wire-cut red clay bricks or solid concrete blocks tested for compressive strength and low absorption.',
      },
      {
        name: 'Mortar & Plastering',
        summary: 'Cement mortar mixes (1:4 / 1:6 ratio) with smooth trowel interior finish and weather-resistant exterior plastering.',
      },
      {
        name: 'Anti-Termite Treatment',
        summary: 'Multi-stage subterranean chemical barrier treatment applied at foundation, soil surface, and plinth perimeter levels.',
      },
    ],
  },
  {
    id: 'finishes',
    title: 'Interior & Finishes',
    icon: Sparkles,
    description: 'Architectural joinery, surface treatments, tile layouts, and decorative coatings.',
    items: [
      {
        name: 'Painting & Wall Finish',
        summary: 'Interior acrylic emulsion over cement putty primer coats; weather-shield acrylic exterior paint applications.',
      },
      {
        name: 'Wood Polish & Fittings',
        summary: 'Melamine or PU polish for main timber elements with brushed brass or stainless steel architectural hardware.',
      },
      {
        name: 'Kitchen Countertop',
        summary: 'Polished granite or engineered quartz slab countertop with edge molding, sink cutout, and dado wall tiling.',
      },
      {
        name: 'Flooring & Wall Tiling',
        summary: 'Vitrified floor tiles for living spaces; anti-skid ceramic tiles and glazed dado wall tiles for bathrooms.',
      },
      {
        name: 'Doors, Windows & Joinery',
        summary: 'Seasoned hardwood / UPVC frames with molded panel shutters, aluminum sliding windows, and clear glass panes.',
      },
      {
        name: 'Ceiling Finish',
        summary: 'Smooth ceiling plastering with option for decorative gypsumbased false ceiling work and cove lighting profiles.',
      },
    ],
  },
  {
    id: 'utilities',
    title: 'Infrastructure & Utilities',
    icon: Cpu,
    description: 'Concealed electrical distribution, plumbing networks, and water management systems.',
    items: [
      {
        name: 'Electrical Accessories & Wiring',
        summary: 'Concealed ISI-marked copper wiring in PVC conduits with modular switchboards and MCB protection boxes.',
      },
      {
        name: 'Sanitary & Plumbing Lines',
        summary: 'Concealed CPVC/UPVC water supply lines with premium sanitaryware fixtures, CP fittings, and health faucets.',
      },
      {
        name: 'Water Drainage & Septic Tank',
        summary: 'Sloped PVC waste lines connecting to dual-chamber septic tank system with soak pit or drainage outlet.',
      },
      {
        name: 'Water Storage Provisions',
        summary: 'Underground RCC water sump and overhead PVC/RCC storage tank with pump piping connections.',
      },
    ],
  },
];

export default function ConstructionStandards() {
  const [activeTab, setActiveTab] = useState<string>('structural');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const activeCategory = CATEGORIES.find((c) => c.id === activeTab) || CATEGORIES[0];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-matte-black">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full mb-6"
          >
            <FileCheck2 className="w-4 h-4 text-gold-400" />
            <span className="font-body text-gold-400 text-xs sm:text-sm tracking-wider font-medium">
              Quality Benchmarks
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50 tracking-wide mb-6"
          >
            Construction <span className="text-gradient-gold font-medium">Standards & Practices</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body text-ivory-300 text-sm md:text-base leading-relaxed font-light"
          >
            Our baseline engineering methodologies, structural considerations, and material guidelines engineered for enduring structural integrity.
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 bg-matte-950/80 border border-ivory-400/10 rounded-2xl max-w-full">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-body text-xs sm:text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-500/20 to-gold-600/10 border border-gold-500/40 text-gold-300 shadow-gold'
                      : 'text-ivory-300 hover:text-ivory-100 hover:bg-ivory-400/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-ivory-400/70'}`} />
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Header Note */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="mb-10 max-w-4xl mx-auto"
          >
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-gold-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-xl sm:text-2xl text-ivory-50 font-medium mb-1">
                  {activeCategory.title}
                </h3>
                <p className="font-body text-ivory-300 text-xs sm:text-sm font-light">
                  {activeCategory.description}
                </p>
              </div>
              <span className="shrink-0 px-3.5 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full font-body text-[11px] text-gold-400">
                {activeCategory.items.length} Considerations
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Items Grid / Accordion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id + '-grid'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto"
          >
            {activeCategory.items.map((item) => {
              const isExpanded = expandedItem === item.name;
              return (
                <div
                  key={item.name}
                  onClick={() => setExpandedItem(isExpanded ? null : item.name)}
                  className={`glass-card p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isExpanded
                      ? 'border-gold-500/40 bg-matte-900/60 shadow-gold'
                      : 'border-ivory-400/10 hover:border-gold-500/25 hover:bg-matte-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-gold-400" />
                      </div>
                      <h4 className="font-display text-base sm:text-lg text-ivory-50 font-medium">
                        {item.name}
                      </h4>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gold-400 shrink-0 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  <p className="font-body text-ivory-300 text-xs sm:text-sm leading-relaxed font-light mt-3.5">
                    {item.summary}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Transparent General Disclaimer Note */}
        <div className="mt-16 max-w-3xl mx-auto p-4 sm:p-5 rounded-xl bg-matte-950/90 border border-gold-500/15 flex items-start gap-3.5">
          <Info className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
          <p className="font-body text-xs text-ivory-300/80 leading-relaxed font-light">
            <strong className="text-gold-300 font-normal">Note on Specifications:</strong> Items listed above represent typical construction standards and material benchmarks. Specific choices and structural parameters are customized according to individual client agreements, structural engineering designs, and project scope.
          </p>
        </div>
      </div>
    </section>
  );
}
