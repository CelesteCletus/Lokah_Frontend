import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard';
import FullScreenHero from '../../components/FullScreenHero';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';
import { slugify } from '../../lib/propertyContent';

export default function OngoingProjects() {
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
    return project.status === 'Ongoing' && project.type === activeFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      <FullScreenHero
        title="Ongoing Landmarks"
        subtitle="Explore our active architectural sites, luxury high-rises, and turnkey residential projects under construction."
        videoSrc="/videos/hero/ongoing properties.mp4"
        category="Future Landmarks"
        ctaText="Book a Site Visit"
        onCtaClick={onOpenBooking}
      />

      {/* Filter Tabs */}
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

      {/* Listings Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-ivory-400 text-sm">No ongoing projects currently match this filter.</p>
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
