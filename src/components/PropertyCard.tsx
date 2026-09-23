import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { MapPin, BedDouble, Maximize, ArrowUpRight } from 'lucide-react';
import type { Property } from '../data/sampleData';
import { formatPropertyDisplayLocation } from '../lib/propertyContent';

interface PropertyCardProps {
  property: Property;
  index: number;
  onClick: () => void;
}

export default function PropertyCard({ property, index, onClick }: PropertyCardProps) {
  const statusColors: Record<Property['status'], string> = {
    'Ongoing': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Completed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Land to Landmark': 'bg-gold-500/20 text-gold-400 border-gold-500/30',
  };

  // Mouse-tracked tilt — a subtle 3D "held in your hand" feel on hover.
  // Kept intentionally understated (max ~4deg) so it reads as premium, not gimmicky.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 250, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 250, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Alternate the entrance direction so a grid of cards doesn't reveal in identical lockstep.
  const fromLeft = index % 2 === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: fromLeft ? -24 : 24, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
      className="group"
    >
      <motion.div
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
        role="button"
        tabIndex={0}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative glass-card-hover cursor-pointer overflow-hidden focus-luxury"
      >
        {/* Image Container — shared with PropertyDetailsModal via layoutId for a seamless
            "morph into detail view" transition instead of a plain modal fade-in. */}
        <motion.div
          layoutId={`property-image-${property.id}`}
          className="relative aspect-[4/3] overflow-hidden rounded-t-2xl"
        >
          <img
            src={property.image}
            alt={property.name}
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('/images/hero/projects-hero.jpg')) {
                target.src = '/images/hero/projects-hero.jpg';
              }
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-transparent opacity-60" />

          {/* Editorial index number */}
          <span className="absolute bottom-4 left-4 font-display text-4xl font-light text-ivory-50/25 select-none">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex px-3 py-1.5 text-xs font-body font-medium rounded-full border backdrop-blur-sm ${statusColors[property.status]}`}
            >
              {property.status}
            </span>
          </div>

          {/* Type Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-matte-black/60 backdrop-blur-sm text-ivory-200 text-xs font-body font-medium rounded-full border border-ivory-400/20">
              {property.type}
            </span>
          </div>

          {/* Price Overlay */}
          <div className="absolute bottom-4 right-4 flex items-end justify-between">
            <div className="font-display text-2xl md:text-3xl font-bold text-ivory-50 text-shadow-elegant">
              {property.priceDisplay}
            </div>
          </div>

          {/* Hover overlay — unified to group-hover only (no conflicting whileHover) */}
          <div className="absolute inset-0 bg-gradient-to-t from-champagne-500/20 to-transparent flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="flex items-center gap-2 text-ivory-50 font-body font-medium">
              View Details
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </motion.div>

        {/* Content */}
        <div className="p-6" style={{ transform: 'translateZ(20px)' }}>
          <h3 className="font-display text-xl md:text-2xl font-semibold text-ivory-50 mb-2 group-hover:text-champagne-400 transition-colors duration-300">
            {property.name}
          </h3>

          <div className="flex items-center gap-1.5 mb-4">
            <MapPin className="w-4 h-4 text-champagne-400" />
            <span className="font-body text-ivory-400 text-sm">{formatPropertyDisplayLocation(property)}</span>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-ivory-400/10">
            {property.bhk !== 'NA' && (
              <div className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-ivory-400/60" />
                <span className="font-body text-ivory-300 text-sm">{property.bhk}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4 text-ivory-400/60" />
              <span className="font-body text-ivory-300 text-sm">
                {property.sqft > 0 ? `${property.sqft.toLocaleString()} sqft` : property.landArea}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-champagne-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </motion.div>
  );
}
