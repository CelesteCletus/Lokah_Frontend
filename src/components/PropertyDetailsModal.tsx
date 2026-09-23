import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  MapPin,
  BedDouble,
  Maximize,
  Home,
  Download,
  Calendar,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  Building2,
  Compass,
} from 'lucide-react';
import type { Property } from '../data/sampleData';
import { formatPropertyDisplayLocation } from '../lib/propertyContent';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
  onBookVisit: () => void;
}

export default function PropertyDetailsModal({ property, onClose, onBookVisit }: PropertyDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'plans' | 'specs'>('overview');

  if (!property) return null;

  const images = property.images && property.images.length > 0 ? property.images : [property.image];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const isFirstImage = currentImageIndex === 0;
  const isLastImage = currentImageIndex === images.length - 1;
  const hasMultipleImages = images.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl bg-matte-950 border border-gold-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:h-[680px]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-matte-black/80 backdrop-blur-sm rounded-full border border-ivory-400/20 text-ivory-300 hover:text-ivory-50 hover:border-ivory-400/40 transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Panel: Image Gallery */}
          <div className="relative w-full md:w-1/2 h-[32vh] md:h-auto shrink-0 overflow-hidden bg-matte-900 border-b md:border-b-0 md:border-r border-ivory-400/10">
            {/* Shared layout id with PropertyCard's image — this is what makes opening a
                property feel like the card's photo itself expands into the detail view,
                instead of a generic modal fade-in. Only applied while on the cover photo,
                since layoutId should be unique on screen at any moment. */}
            <motion.div layoutId={`property-image-${property.id}`} className="absolute inset-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={images[currentImageIndex]}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </motion.div>

            {/* Navigation Arrows */}
            <button
              disabled={!hasMultipleImages || isFirstImage}
              onClick={(e) => prevImage(e)}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-matte-black/70 backdrop-blur-sm rounded-full border border-ivory-400/10 text-ivory-100 transition-all ${
                !hasMultipleImages || isFirstImage
                  ? 'opacity-25 cursor-not-allowed border-transparent text-ivory-500'
                  : 'hover:bg-matte-black hover:text-gold-450 hover:border-gold-500/30'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              disabled={!hasMultipleImages || isLastImage}
              onClick={(e) => nextImage(e)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-matte-black/70 backdrop-blur-sm rounded-full border border-ivory-400/10 text-ivory-100 transition-all ${
                !hasMultipleImages || isLastImage
                  ? 'opacity-25 cursor-not-allowed border-transparent text-ivory-500'
                  : 'hover:bg-matte-black hover:text-gold-450 hover:border-gold-500/30'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Thumbnails */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  disabled={!hasMultipleImages}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasMultipleImages) {
                      setCurrentImageIndex(index);
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    !hasMultipleImages
                      ? 'opacity-40 bg-ivory-500 cursor-not-allowed'
                      : index === currentImageIndex
                      ? 'bg-gold-500 w-6'
                      : 'bg-ivory-400/40 hover:bg-ivory-400/70'
                  }`}
                />
              ))}
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`inline-flex px-4 py-2 text-xs font-body font-medium rounded-full border backdrop-blur-sm ${
                  property.status === 'Ready to Move'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : property.status === 'Ongoing'
                    ? 'bg-gold-500/20 text-gold-400 border-gold-500/30'
                    : 'bg-champagne-500/20 text-champagne-400 border-champagne-500/30'
                }`}
              >
                {property.status}
              </span>
            </div>
          </div>

          {/* Right Panel: Tabbed Details */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-hidden bg-matte-950/40">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-champagne-400 text-xs font-body uppercase tracking-wider mb-1">
                <Home className="w-3.5 h-3.5" />
                {property.type}
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-ivory-50 mb-2 leading-tight">
                {property.name}
              </h2>
              <div className="flex items-center gap-1.5 text-ivory-400 text-xs md:text-sm">
                <MapPin className="w-4 h-4 text-champagne-400" />
                <span className="font-body">{formatPropertyDisplayLocation(property)}</span>
              </div>

              {/* Tabs Switcher */}
              <div className="flex border-b border-ivory-400/10 mt-6 gap-4 sm:gap-6 overflow-x-auto hide-scrollbar">
                {(['overview', 'amenities', 'plans', 'specs'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-xs font-body uppercase tracking-wider font-semibold transition-all relative shrink-0 ${
                      activeTab === tab ? 'text-gold-450' : 'text-ivory-400 hover:text-ivory-200'
                    }`}
                  >
                    {tab === 'amenities' ? 'Amenities' : tab === 'plans' ? 'Floor Plans' : tab === 'specs' ? 'Specs & Standards' : tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-500"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-grow overflow-y-auto pr-1 my-4 max-h-[30vh] md:max-h-[50vh] hide-scrollbar space-y-6">
              
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="font-display text-base text-ivory-50 mb-2">About this Property</h3>
                    <p className="font-body text-ivory-350 text-xs leading-relaxed font-light">{property.description}</p>
                  </div>

                  {/* Price */}
                  <div className="bg-charcoal-900/40 p-5 rounded-2xl border border-gold-500/10">
                    <div className="font-body text-ivory-450 text-xs mb-1 uppercase tracking-wider">Starting Price</div>
                    <div className="font-display text-3xl font-bold text-gradient-gold">
                      {property.priceDisplay}
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {property.bhk !== 'NA' && (
                      <div className="bg-charcoal-800/20 rounded-xl p-4 border border-ivory-400/5">
                        <div className="flex items-center gap-2 text-ivory-400 text-xs mb-1">
                          <BedDouble className="w-4 h-4 text-champagne-450" />
                          <span className="font-body">Bedrooms</span>
                        </div>
                        <div className="font-display text-lg text-ivory-50">{property.bhk}</div>
                      </div>
                    )}
                    <div className="bg-charcoal-800/20 rounded-xl p-4 border border-ivory-400/5">
                      <div className="flex items-center gap-2 text-ivory-400 text-xs mb-1">
                        <Maximize className="w-4 h-4 text-champagne-450" />
                        <span className="font-body">
                          {property.type === 'Plot' ? 'Land Area' : 'Built Area'}
                        </span>
                      </div>
                      <div className="font-display text-lg text-ivory-50">
                        {property.sqft > 0 ? `${property.sqft.toLocaleString()} sqft` : property.landArea}
                      </div>
                    </div>
                  </div>

                  {/* Nearby Places */}
                  <div>
                    <h3 className="font-display text-base text-ivory-50 mb-3">Nearby Places</h3>
                    <div className="space-y-2">
                      {property.nearby.map((place) => (
                        <div
                          key={place.name}
                          className="flex items-center justify-between p-3 bg-charcoal-800/20 rounded-xl border border-ivory-400/5 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <Compass className="w-3.5 h-3.5 text-champagne-400" />
                            <span className="font-body text-ivory-300 font-light">{place.name}</span>
                          </div>
                          <span className="font-body text-ivory-400 font-light">{place.distance}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'amenities' && (
                <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 p-3 bg-charcoal-800/10 rounded-xl border border-ivory-400/5"
                    >
                      <div className="w-5 h-5 flex items-center justify-center bg-champagne-500/10 rounded-full border border-champagne-500/20 text-champagne-450 shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="font-body text-xs text-ivory-250 font-light">{amenity}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'plans' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.floorPlan ? (
                    <a
                      href={property.floorPlan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-video bg-charcoal-800/20 hover:bg-gold-500/5 border border-ivory-400/5 hover:border-gold-500/20 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer group"
                    >
                      <Building2 className="w-7 h-7 text-gold-450 group-hover:scale-110 transition-transform mb-2" />
                      <span className="font-body text-ivory-100 text-xs font-semibold">Floor Plan</span>
                      <span className="font-body text-[10px] text-gold-400/80 mt-1 uppercase tracking-wider">Click to View</span>
                    </a>
                  ) : (
                    <div className="aspect-video bg-charcoal-800/10 border border-ivory-400/5 rounded-xl flex flex-col items-center justify-center opacity-40 cursor-not-allowed">
                      <Building2 className="w-7 h-7 text-ivory-400/30 mb-2" />
                      <span className="font-body text-ivory-400/50 text-xs">Floor Plan (Not Available)</span>
                    </div>
                  )}

                  {property.coordinates && property.coordinates.lat && property.coordinates.lng ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-video bg-charcoal-800/20 hover:bg-gold-500/5 border border-ivory-400/5 hover:border-gold-500/20 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer group"
                    >
                      <MapPin className="w-7 h-7 text-gold-450 group-hover:scale-110 transition-transform mb-2" />
                      <span className="font-body text-ivory-100 text-xs font-semibold">Map View</span>
                      <span className="font-body text-[10px] text-gold-400/80 mt-1 uppercase tracking-wider">Open Google Maps</span>
                    </a>
                  ) : (
                    <div className="aspect-video bg-charcoal-800/10 border border-ivory-400/5 rounded-xl flex flex-col items-center justify-center opacity-40 cursor-not-allowed">
                      <MapPin className="w-7 h-7 text-ivory-400/30 mb-2" />
                      <span className="font-body text-ivory-400/50 text-xs">Map View (Not Available)</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-4">
                  <h3 className="font-display text-base text-ivory-50 mb-1">Construction Standards & Specifications</h3>
                  <p className="font-body text-xs text-ivory-300 font-light mb-3">
                    General engineering guidelines and material specifications applied to this development.
                  </p>
                  <div className="space-y-2.5 font-body text-xs text-ivory-300">
                    <div className="p-3.5 bg-charcoal-900/50 rounded-xl border border-ivory-400/10">
                      <span className="text-gold-400 font-medium block mb-1">Structural Framework</span>
                      <span className="font-light">M20 Grade Concrete, TMT Fe500 Steel, Earthquake-resistant RCC isolated footings.</span>
                    </div>
                    <div className="p-3.5 bg-charcoal-900/50 rounded-xl border border-ivory-400/10">
                      <span className="text-gold-400 font-medium block mb-1">Finishes & Joinery</span>
                      <span className="font-light">Vitrified tile flooring, premium acrylic emulsions, wire-cut brick masonry.</span>
                    </div>
                    <div className="p-3.5 bg-charcoal-900/50 rounded-xl border border-ivory-400/10">
                      <span className="text-gold-400 font-medium block mb-1">Electrical & Sanitary</span>
                      <span className="font-light">Concealed copper wiring with modular switches, CPVC water lines, branded sanitaryware.</span>
                    </div>
                    <div className="pt-2">
                      <Link
                        to="/explore-us/construction-standards"
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 text-gold-400 hover:text-gold-300 font-medium text-xs transition-colors"
                      >
                        <span>View Full Construction Standards</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Sticky Action Buttons */}
            <div className="pt-4 border-t border-ivory-400/10 space-y-3">
              <div className="flex gap-3">
                
                {/* Primary CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onBookVisit}
                  className="btn-primary flex-grow py-3 px-6 justify-center text-xs md:text-sm font-semibold flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Site Visit</span>
                </motion.button>

                {/* 360 View */}
                {property.virtualTourLink && (
                  <motion.a
                    href={property.virtualTourLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary py-3 px-6 justify-center text-xs md:text-sm border-gold-500/30 hover:bg-gold-500/10 text-gold-450 flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>360' View</span>
                  </motion.a>
                )}
              </div>

              {/* Secondary Communication Actions */}
              <div className="grid grid-cols-3 gap-3">
                <motion.a
                  href={property.brochurePdf || '/documents/lokah builders & developers brochure.pdf'}
                  download={`${property.name ? property.name.toLowerCase().replace(/\s+/g, '-') : 'lokah-builders'}-brochure.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-secondary py-2.5 px-3 justify-center text-xs flex items-center gap-1.5 border-ivory-400/10 text-ivory-300 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Brochure</span>
                </motion.a>

                <motion.a
                  href="tel:+919496975555"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-secondary py-2.5 px-3 justify-center text-xs flex items-center gap-1.5 border-ivory-400/10 text-ivory-300"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </motion.a>

                <motion.a
                  href="https://wa.me/919946302222"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-secondary py-2.5 px-3 justify-center text-xs border-emerald-500/15 hover:bg-emerald-500/10 text-emerald-400 flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </motion.a>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
