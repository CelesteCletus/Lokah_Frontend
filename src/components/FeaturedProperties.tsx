import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { properties as staticProperties } from '../data/sampleData';
import type { Property } from '../data/sampleData';

interface FeaturedPropertiesProps {
  properties?: Property[];
  onPropertyClick: (property: Property) => void;
  onViewAll: () => void;
}

export default function FeaturedProperties({ properties = staticProperties, onPropertyClick, onViewAll }: FeaturedPropertiesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const featured = properties.filter((p) => p.featured).slice(0, 4);

  return (
    <section id="properties" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-matte-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <span className="font-body text-champagne-400 text-sm tracking-widest uppercase mb-4 block">
              Handpicked Collection
            </span>
            <h2 className="section-heading">
              Featured <span className="text-gradient-gold">Properties</span>
            </h2>
            <p className="font-body text-ivory-400 mt-4 max-w-xl">
              Discover our exclusive selection of premium properties, each chosen for its exceptional quality and investment potential.
            </p>
          </div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ x: 5 }}
            onClick={onViewAll}
            className="hidden md:flex items-center gap-2 text-champagne-400 font-body font-medium mt-6 md:mt-0 group"
          >
            View All Properties
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {featured.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              index={index}
              onClick={() => onPropertyClick(property)}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex md:hidden justify-center mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewAll}
            className="btn-secondary"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
