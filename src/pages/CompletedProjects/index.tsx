import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext, useNavigate } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';
import { slugify } from '../../lib/propertyContent';
import { Calendar, Layers, ShieldCheck } from 'lucide-react';

export default function CompletedProjects() {
  const { onOpenBooking, properties } = useOutletContext<LayoutContextType>();
  const navigate = useNavigate();
  const goToProperty = (name: string) => navigate(`/properties/${slugify(name)}`);
  type FilterTab = 'Villa' | 'Apartment' | 'Land to Landmark';
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Villa');

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'Villa', label: 'Villas' },
    { key: 'Apartment', label: 'Apartments' },
    { key: 'Land to Landmark', label: 'Land to Landmark' },
  ];

  const filteredProjects = properties.filter((project) => {
    return project.status === 'Completed' && project.type === activeFilter;
  });

  const highlights = [
    { value: 'Since 2010', label: 'Building Experience & Foundation', icon: Calendar },
    { value: 'End-to-End', label: 'Project Planning & Construction', icon: Layers },
    { value: 'Client-Focused', label: 'Thoughtful Coordination & Handover', icon: ShieldCheck },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      <FullScreenHero
        title="Completed Masterpieces"
        subtitle="Review our timeless creations and delivered private villa estates and premium corporate locations."
        videoSrc="/videos/hero/completed properties.mp4"
        category="Timeless Creations"
        ctaText="Book a Site Visit"
        onCtaClick={() => onOpenBooking('visit')}
      />

      {/* Achievements highlight section */}
      <section className="py-16 bg-matte-950 border-b border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((h, idx) => (
            <RevealOnScroll
              key={h.label}
              delay={idx * 0.1}
              className="flex items-center gap-6 p-6 glass-card border-gold-500/10"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                <h.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="font-accent text-3xl font-bold text-gold-500 block leading-tight">{h.value}</span>
                <span className="font-body text-ivory-300 text-xs sm:text-sm tracking-wide font-light">{h.label}</span>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Sub-Section Filter Tabs */}
      <section className="py-12 bg-matte-950 border-b border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-wrap justify-center gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-6 py-2.5 rounded-full text-xs font-body font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeFilter === tab.key
                  ? 'bg-gradient-to-r from-champagne-500 to-gold-500 text-matte-black shadow-gold'
                  : 'bg-matte-900 border border-ivory-400/10 text-ivory-300 hover:border-gold-500/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-widest uppercase font-semibold block mb-3">
            Handed Over Portfolio
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            Delivered <span className="text-gradient-gold font-medium">Estates</span>
          </h2>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-ivory-400 text-sm">No completed developments match this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.3 } }}
                >
                  <PropertyCard
                    property={project}
                    index={index}
                    onClick={() => goToProperty(project.name)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
