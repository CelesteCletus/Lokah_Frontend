import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, MapPin, Home, IndianRupee, Calendar, SortAsc } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { properties as staticProperties, locations } from '../data/sampleData';
import type { Property } from '../data/sampleData';

interface PropertyFiltersProps {
  onPropertyClick: (property: Property) => void;
  properties?: Property[];
}

const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK+', 'NA'];
const budgetRanges = [
  { label: 'Under ₹50 Lakhs', min: 0, max: 5000000 },
  { label: '₹50 Lakhs - ₹1 Cr', min: 5000000, max: 10000000 },
  { label: '₹1 Cr - ₹2 Cr', min: 10000000, max: 20000000 },
  { label: 'Above ₹2 Cr', min: 20000000, max: Infinity },
];
const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Area: Large to Small', value: 'sqft_desc' },
];

export default function PropertyFilters({ onPropertyClick, properties = staticProperties }: PropertyFiltersProps) {
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    budget: '',
    bhk: '',
    status: '',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let result = [...properties];

    // Type filter
    if (filters.type) {
      result = result.filter((p) => p.type === filters.type);
    }

    // Location filter
    if (filters.location) {
      result = result.filter((p) => p.location === filters.location);
    }

    // Budget filter
    if (filters.budget) {
      const range = budgetRanges.find((r) => r.label === filters.budget);
      if (range) {
        result = result.filter((p) => p.price >= range.min && p.price <= range.max);
      }
    }

    // BHK filter
    if (filters.bhk) {
      result = result.filter((p) => p.bhk === filters.bhk);
    }

    // Status filter
    if (filters.status) {
      result = result.filter((p) => p.status === filters.status);
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'sqft_desc':
        result.sort((a, b) => b.sqft - a.sqft);
        break;
      default:
        result.sort((a, b) => b.id - a.id);
    }

    setFilteredProperties(result);
  }, [filters, sortBy, properties]);

  const clearFilters = () => {
    setFilters({
      type: '',
      location: '',
      budget: '',
      bhk: '',
      status: '',
    });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden bg-gradient-dark">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="font-body text-champagne-400 text-sm tracking-widest uppercase mb-4 block">
            Explore Our Collection
          </span>
          <h2 className="section-heading">
            Find Your Perfect <span className="text-gradient-gold">Property</span>
          </h2>
        </motion.div>

        {/* Filter Toggle Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8"
        >
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 ${
              showFilters
                ? 'bg-champagne-500/20 border-champagne-500/30 text-champagne-400'
                : 'bg-charcoal-800/60 border-ivory-400/20 text-ivory-300 hover:border-champagne-400/50'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-body font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 bg-champagne-500 text-matte-black text-xs font-bold rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-4">
            <span className="text-ivory-400 font-body text-sm">{filteredProperties.length} Properties Found</span>
            <div ref={sortRef} className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-charcoal-800/60 border border-ivory-400/20 rounded-xl text-ivory-300 hover:border-champagne-400/50 transition-all"
              >
                <SortAsc className="w-4 h-4 text-champagne-400" />
                <span className="font-body text-sm">
                  {sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-52 bg-charcoal-900/95 backdrop-blur-xl border border-gold-500/20 rounded-xl py-2 shadow-2xl z-50 overflow-hidden"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs md:text-sm transition-colors font-body ${
                          sortBy === opt.value
                            ? 'text-gold-400 bg-gold-500/10 font-medium'
                            : 'text-ivory-300 hover:bg-gold-500/5 hover:text-gold-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden mb-8"
            >
              <div className="glass-card p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                  {/* Type Filter */}
                  <div>
                    <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-2">
                      <Home className="w-4 h-4" />
                      Property Type
                    </label>
                    <div className="relative">
                      <select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        className="select-luxury"
                      >
                        <option value="">All Types</option>
                        <option value="Villa">Villa</option>
                        <option value="Apartment">Apartment</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </label>
                    <div className="relative">
                      <select
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        className="select-luxury"
                      >
                        <option value="">All Locations</option>
                        {locations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Budget Filter */}
                  <div>
                    <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-2">
                      <IndianRupee className="w-4 h-4" />
                      Budget
                    </label>
                    <div className="relative">
                      <select
                        value={filters.budget}
                        onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                        className="select-luxury"
                      >
                        <option value="">Any Budget</option>
                        {budgetRanges.map((range) => (
                          <option key={range.label} value={range.label}>
                            {range.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* BHK Filter */}
                  <div>
                    <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-2">
                      <Home className="w-4 h-4" />
                      BHK
                    </label>
                    <div className="relative">
                      <select
                        value={filters.bhk}
                        onChange={(e) => setFilters({ ...filters, bhk: e.target.value })}
                        className="select-luxury"
                      >
                        <option value="">Any BHK</option>
                        {bhkOptions.map((bhk) => (
                          <option key={bhk} value={bhk}>
                            {bhk === 'NA' ? 'Plot/Land' : bhk}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-2">
                      <Calendar className="w-4 h-4" />
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="select-luxury"
                      >
                        <option value="">Any Status</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Land to Landmark">Land to Landmark</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="flex items-center justify-end mt-6 pt-6 border-t border-ivory-400/10">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 text-ivory-400 hover:text-champagne-400 font-body text-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProperties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={index}
                onClick={() => onPropertyClick(property)}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <Search className="w-16 h-16 text-ivory-400/30 mx-auto mb-4" />
            <h3 className="font-display text-2xl text-ivory-50 mb-2">No Properties Found</h3>
            <p className="font-body text-ivory-400 mb-6">Try adjusting your filters to discover more properties.</p>
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
