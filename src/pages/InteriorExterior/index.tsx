import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Paintbrush, 
  Palette, 
  Sun, 
  Eye, 
  CheckCircle2, 
  PenTool, 
  Sliders
} from 'lucide-react';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';

export default function InteriorExterior() {
  const { onOpenBooking } = useOutletContext<LayoutContextType>();
  const [activeDomain, setActiveDomain] = useState<'exterior' | 'interior'>('exterior');

  const materials = [
    { name: 'Italian Travertine & Marble', type: 'Natural Stone', desc: 'Sourced from quarries in Tivoli, Italy; sealed with zero-VOC matte protective coatings for floors and wall features.' },
    { name: 'Rare Teak & Oak Veneers', type: 'Woodwork', desc: 'Grade-A seasoned teak with kiln-dried moisture content below 10% and multi-coat matte polyurethane sealing.' },
    { name: 'Brushed Gold & Champagne PVD', type: 'Metal Hardware', desc: 'Physical Vapor Deposition metal trim hardware engineered against corrosion and fingerprint smudging.' },
    { name: 'Acoustic Wall Panels & Fabrics', type: 'Sound & Texture', desc: 'Custom upholstered linen wall panels integrated with high-STC sound absorbing acoustic cores.' }
  ];

  const designStages = [
    {
      num: '01',
      title: 'Concept & Moodboard Curation',
      desc: 'Translating personal aesthetic preferences into spatial color palettes, material samples, and lighting maps.',
      icon: Palette
    },
    {
      num: '02',
      title: '3D Photorealistic Renders',
      desc: 'Creating exact 3D virtual walkthroughs displaying precise ray-traced lighting, furniture placement, and material reflections.',
      icon: Eye
    },
    {
      num: '03',
      title: 'On-Site Execution & Detailing',
      desc: 'Carpenters, stone polishers, and lighting technicians crafting every joint, reveal, and seam.',
      icon: PenTool
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      {/* HERO SECTION */}
      <FullScreenHero
        title="Interior &amp; Exterior Design"
        subtitle="Establishing visual and material harmony between exterior facade elevations and indoor living spaces."
        imageSrc="/images/services/interior-exterior.jpg"
        category="Design &amp; Ambience"
        ctaText="Explore Design Studio"
        onCtaClick={() => onOpenBooking('consultation')}
      />

      {/* DUAL-DOMAIN SPLIT SHOWCASE */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 border-b border-ivory-400/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
            Inside &amp; Out
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            Exterior &amp; <span className="text-gradient-gold font-medium">Interior</span>
          </h2>
          <p className="font-body text-ivory-400 text-sm sm:text-base font-light leading-relaxed">
            Architectural continuity connects street elevation with interior living spaces.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-charcoal-900/80 p-1.5 rounded-2xl border border-gold-500/20 flex gap-2">
            <button
              onClick={() => setActiveDomain('exterior')}
              className={`px-6 py-3 rounded-xl font-body text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeDomain === 'exterior' ? 'bg-gradient-gold text-matte-black shadow-gold' : 'text-ivory-400 hover:text-ivory-100'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Exterior Elevation</span>
            </button>
            <button
              onClick={() => setActiveDomain('interior')}
              className={`px-6 py-3 rounded-xl font-body text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeDomain === 'interior' ? 'bg-gradient-gold text-matte-black shadow-gold' : 'text-ivory-400 hover:text-ivory-100'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
              <span>Interior Detailing</span>
            </button>
          </div>
        </div>

        <div className="glass-card p-8 sm:p-12 border border-gold-500/20 max-w-4xl mx-auto">
          {activeDomain === 'exterior' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="font-body text-xs uppercase tracking-widest text-champagne-400 font-semibold block">
                  Domain 01: Outer Facades
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-light text-ivory-50">
                  Architectural Facades &amp; Exterior Finishes
                </h3>
              </div>
              <p className="font-body text-ivory-300 text-sm leading-relaxed font-light">
                We craft exterior facades using natural stone cladding, double-glazed acoustic curtain walls, weather-resistant louvers, and ambient architectural lighting.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-ivory-300 text-xs sm:text-sm font-light">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>UV &amp; Weather Resistant Stone Cladding</span>
                </div>
                <div className="flex items-center gap-2 text-ivory-300 text-xs sm:text-sm font-light">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Double-Glazed Low-E Thermal Windows</span>
                </div>
                <div className="flex items-center gap-2 text-ivory-300 text-xs sm:text-sm font-light">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Automated Facade Accent Lighting</span>
                </div>
                <div className="flex items-center gap-2 text-ivory-300 text-xs sm:text-sm font-light">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Integrated Landscaping &amp; Water Features</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="font-body text-xs uppercase tracking-widest text-champagne-400 font-semibold block">
                  Domain 02: Inner Living
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-light text-ivory-50">
                  Refined Interior Living
                </h3>
              </div>
              <p className="font-body text-ivory-300 text-sm leading-relaxed font-light">
                Transforming interior volumes into quiet living spaces. Every room is designed around human movement, layering millwork, indirect warm LED coving, and book-matched marble floors.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-ivory-300 text-xs sm:text-sm font-light">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Book-Matched Italian Marble &amp; Hardwood</span>
                </div>
                <div className="flex items-center gap-2 text-ivory-300 text-xs sm:text-sm font-light">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Concealed Architectural Cove Lighting</span>
                </div>
                <div className="flex items-center gap-2 text-ivory-300 text-xs sm:text-sm font-light">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Integrated Millwork &amp; Wood Wall Panels</span>
                </div>
                <div className="flex items-center gap-2 text-ivory-300 text-xs sm:text-sm font-light">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Acoustically Tuned Living Spaces</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MATERIAL PALETTE */}
      <section className="py-28 bg-matte-950 border-b border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
              Material Palette
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              Material <span className="text-gradient-gold font-medium">Palette</span>
            </h2>
            <p className="font-body text-ivory-400 text-sm max-w-xl mx-auto font-light">
              Selecting materials based on durability, origin, and weathering characteristics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {materials.map((mat) => (
              <RevealOnScroll key={mat.name} className="glass-card p-8 border border-gold-500/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-body text-[10px] uppercase tracking-widest text-champagne-400 font-semibold px-2.5 py-1 rounded bg-gold-500/10 border border-gold-500/20">
                    {mat.type}
                  </span>
                  <Sliders className="w-4 h-4 text-gold-400/60" />
                </div>
                <h3 className="font-display text-xl text-ivory-50 font-medium">{mat.name}</h3>
                <p className="font-body text-ivory-400 text-xs sm:text-sm leading-relaxed font-light">{mat.desc}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* DESIGN PROCESS */}
      <section className="py-28 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
            Design Journey
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            The Execution <span className="text-gradient-gold font-medium">Process</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {designStages.map((stg) => {
            const Icon = stg.icon;
            return (
              <RevealOnScroll key={stg.num} className="glass-card p-8 border border-gold-500/15 space-y-4 relative overflow-hidden">
                <span className="absolute top-4 right-5 font-display text-6xl font-extrabold text-gold-450/5 pointer-events-none select-none">
                  {stg.num}
                </span>
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-ivory-50 font-medium">{stg.title}</h3>
                <p className="font-body text-ivory-400 text-xs sm:text-sm leading-relaxed font-light">{stg.desc}</p>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* RELATED NAVIGATION LINKS */}
      <section className="py-16 bg-matte-black border-t border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <span className="font-body text-champagne-400 text-xs tracking-widest uppercase font-semibold block">
            Explore Related Services
          </span>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services/remodelling" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Property Remodelling
            </Link>
            <Link to="/services/residential-projects" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Residential Projects
            </Link>
            <Link to="/services/turnkey-projects" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Turnkey Projects
            </Link>
          </div>
        </div>
      </section>

      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
