import { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import {
  ArrowDown,
  ArrowLeft,
  MapPin,
  BedDouble,
  Maximize,
  Home as HomeIcon,
  Compass,
  Download,
  ChevronLeft,
  ChevronRight,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Phone,
  MessageCircle,
} from 'lucide-react';
import type { LayoutContextType } from '../../layouts/RootLayout';
import {
  findPropertyBySlug,
  getTagline,
  getStoryOpening,
  getLifestyleMoments,
  getLifestyleGroups,
  getLocationNarrative,
  formatPropertyDisplayLocation,
  CONSTRUCTION_PHILOSOPHY,
} from '../../lib/propertyContent';
import NotFound from '../NotFound';
import Testimonials from '../../components/Testimonials';
import CTASection from '../../components/CTASection';

// Soft ease for luxury feel
const LUXE_EASE = [0.16, 1, 0.3, 1] as const;
const MOMENT_ICONS: Record<string, typeof Sun> = {
  Morning: Sunrise,
  Afternoon: Sun,
  Evening: Sunset,
  Night: Moon,
};

const getYouTubeEmbedUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

const parseInlineFormatting = (text: string) => {
  const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
  const splitParts = text.split(regex);
  
  return splitParts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-gold-450">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-ivory-100">{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

const renderFormattedDescription = (text: string | null | undefined) => {
  if (!text) return null;
  
  const paragraphs = text.split(/\n\s*\n/);
  
  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto font-body text-ivory-300 text-base sm:text-lg leading-relaxed font-light">
      {paragraphs.map((p, idx) => {
        const trimmed = p.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split(/\n[-*]\s+/).map(item => item.replace(/^[-*]\s+/, '').trim());
          return (
            <ul key={idx} className="list-disc pl-6 space-y-2 my-4">
              {items.map((item, i) => (
                <li key={i}>{parseInlineFormatting(item)}</li>
              ))}
            </ul>
          );
        }
        
        const lines = trimmed.split('\n');
        return (
          <p key={idx}>
            {lines.map((line, lIdx) => (
              <span key={lIdx}>
                {parseInlineFormatting(line)}
                {lIdx < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
};

export default function PropertyExperience() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { properties, onOpenBooking } = useOutletContext<LayoutContextType>();

  const property = slug ? findPropertyBySlug(properties, slug) : undefined;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const [galleryIndex, setGalleryIndex] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!mapRef.current || !property || !property.coordinates?.lat || !property.coordinates?.lng) return;

    const goldIcon = L.divIcon({
      className: 'custom-gold-marker-public',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #d4af37 0%, #aa7c11 100%);
          border: 2px solid #fff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: #0d0d0d;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    const map = L.map(mapRef.current, {
      center: [property.coordinates.lat, property.coordinates.lng],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 20
    }).addTo(map);

    L.marker([property.coordinates.lat, property.coordinates.lng], { icon: goldIcon }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [property?.coordinates?.lat, property?.coordinates?.lng]);

  if (properties.length > 0 && !property) {
    return <NotFound />;
  }

  if (!property) {
    // Properties are still loading (async fetch on first paint) — avoid flashing a 404.
    return <div className="min-h-screen bg-matte-black" />;
  }

  const isPlaceholderImage = (url: string) => {
    if (!url) return true;
    return (
      url.includes('/images/projects/completed-1.jpg') ||
      url.includes('/images/projects/completed-2.jpg') ||
      url.includes('/images/services/interior-exterior.jpg') ||
      url.includes('/images/services/property-development.jpg') ||
      url.includes('/images/hero/projects-hero.jpg') ||
      url.includes('/images/hero/home-hero.jpg') ||
      url.includes('/images/hero/about-hero.jpg') ||
      url.includes('/images/hero/services-hero.jpg')
    );
  };

  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // If real user/admin photos exist, exclude sample placeholder assets
  const rawList = property.images && property.images.length > 0 ? property.images : [property.image];
  const userList = rawList.filter(img => Boolean(img) && !isPlaceholderImage(img));
  const candidateImages = userList.length > 0 ? userList : rawList.filter(Boolean);
  const images = candidateImages.filter(img => !failedImages.has(img));
  const displayImages = images.length > 0 ? images : [property.image || '/images/hero/projects-hero.jpg'];

  const safeGalleryIndex = Math.min(galleryIndex, Math.max(0, displayImages.length - 1));
  const nextGalleryImage = () => setGalleryIndex((i) => (i + 1) % displayImages.length);
  const prevGalleryImage = () => setGalleryIndex((i) => (i - 1 + displayImages.length) % displayImages.length);

  const tagline = getTagline(property);
  const storyOpening = getStoryOpening(property);
  const moments = getLifestyleMoments(property);
  const lifestyleGroups = getLifestyleGroups(property);
  const locationNarrative = getLocationNarrative(property);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-matte-black text-ivory-100"
    >
      {/* Back to portfolio */}
      <button
        onClick={() => navigate('/projects/all')}
        className="fixed top-24 left-6 z-40 hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-matte-black/60 backdrop-blur-sm border border-ivory-400/15 text-ivory-300 text-xs font-body uppercase tracking-wider hover:border-gold-500/40 hover:text-gold-400 transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All Residences
      </button>

      {/* ===================== SECTION 1 — Cinematic Hero ===================== */}
      <section ref={heroRef} className="relative h-screen flex items-end overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <img
            src={property.image}
            alt={property.name}
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('/images/hero/projects-hero.jpg')) {
                target.src = '/images/hero/projects-hero.jpg';
              }
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-matte-black/50 via-transparent to-matte-black/50" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 pb-24 md:pb-32 text-center w-full"
        >
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body text-champagne-400 text-xs sm:text-sm tracking-[0.35em] uppercase font-semibold mb-5 block"
          >
            {formatPropertyDisplayLocation(property)}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: LUXE_EASE }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-light text-ivory-50 tracking-wide leading-[1.05] mb-6"
          >
            {property.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            className="font-display italic text-ivory-300 text-lg sm:text-xl md:text-2xl font-light max-w-2xl mx-auto"
          >
            "{tagline}"
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="mt-10"
          >
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight * 0.95, behavior: 'smooth' })}
              className="group inline-flex flex-col items-center gap-3 text-ivory-200 hover:text-gold-400 transition-colors"
            >
              <span className="font-body text-xs uppercase tracking-[0.25em] font-medium">Explore The Residence</span>
              <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
                <ArrowDown className="w-4 h-4" />
              </motion.span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ===================== SECTION 2 — The Story ===================== */}
      <section className="py-24 md:py-36 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="font-body text-champagne-400 text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-8 block"
        >
          The Story
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: LUXE_EASE }}
          className="font-display text-2xl sm:text-3xl md:text-4xl font-light leading-relaxed text-ivory-50 mb-8"
        >
          {storyOpening}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {renderFormattedDescription(property.description)}
        </motion.div>
      </section>

      {/* ===================== SECTION 3 — Picture Your Life Here ===================== */}
      <section className="py-20 md:py-28 bg-matte-950 border-y border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-3 block">
              A Day In The Life
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50">
              Picture Your Life <span className="text-gradient-gold font-medium">Here</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {moments.map((moment, idx) => {
              const Icon = MOMENT_ICONS[moment.time] ?? Sun;
              return (
                <motion.div
                  key={moment.time}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: idx * 0.12, ease: LUXE_EASE }}
                  className="glass-card p-8 border-gold-500/10 flex flex-col items-start"
                >
                  <div className="w-11 h-11 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-body text-champagne-400 text-[11px] uppercase tracking-[0.25em] font-semibold mb-2">
                    {moment.time}
                  </span>
                  <h3 className="font-display text-lg text-ivory-50 font-medium mb-3">{moment.title}</h3>
                  <p className="font-body text-ivory-300 text-sm leading-relaxed">{moment.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== SECTION 4 — The Lifestyle ===================== */}
      {lifestyleGroups.length > 0 && (
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-3 block">
              The Lifestyle
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50">
              More Than <span className="text-gradient-gold font-medium">Lifestyle</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lifestyleGroups.map((group, idx) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: (idx % 4) * 0.1, ease: LUXE_EASE }}
                className="glass-card p-7 border-ivory-400/10"
              >
                <h3 className="font-display text-lg text-ivory-50 font-semibold mb-4 tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-champagne-400 to-gold-500" />
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((item) => (
                    <div
                      key={item}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-charcoal-900/60 border border-gold-500/15 text-ivory-100 text-xs font-body hover:border-gold-500/40 hover:bg-gold-500/5 transition-all shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                      <span className="font-light tracking-wide">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ===================== SECTION 5 — Image Gallery Experience ===================== */}
      <section className="relative bg-matte-950 border-y border-ivory-400/10 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10 text-center">
          <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-3 block">
            Immersive Gallery
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50">
            Walk Through <span className="text-gradient-gold font-medium">Every Detail</span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: LUXE_EASE }}
          className="relative max-w-6xl mx-auto px-6 lg:px-8"
        >
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-gold-500/15 shadow-elegant">
            <AnimatePresence mode="wait">
              <motion.img
                key={safeGalleryIndex}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: LUXE_EASE }}
                src={displayImages[safeGalleryIndex]}
                alt={`${property.name} — Gallery Image ${safeGalleryIndex + 1}`}
                onError={() => {
                  const currentSrc = displayImages[safeGalleryIndex];
                  if (currentSrc && !failedImages.has(currentSrc)) {
                    setFailedImages(prev => new Set(prev).add(currentSrc));
                    setGalleryIndex(prev => Math.max(0, Math.min(prev, displayImages.length - 2)));
                  }
                }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-matte-black/60 via-transparent to-transparent pointer-events-none" />

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prevGalleryImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-matte-black/60 backdrop-blur-sm rounded-full border border-ivory-400/15 text-ivory-100 hover:border-gold-500/40 hover:text-gold-400 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextGalleryImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-matte-black/60 backdrop-blur-sm rounded-full border border-ivory-400/15 text-ivory-100 hover:border-gold-500/40 hover:text-gold-400 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {displayImages.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {displayImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === safeGalleryIndex ? 'bg-gold-500 w-8' : 'bg-ivory-400/30 w-1.5 hover:bg-ivory-400/60'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* ===================== SECTION 6 — The Residence (facts, kept minimal) ===================== */}
      <section className="py-20 md:py-28 max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-3 block">
            The Residence
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50">
            The <span className="text-gradient-gold font-medium">Essentials</span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: LUXE_EASE }}
          className="flex flex-wrap items-stretch justify-center divide-y md:divide-y-0 md:divide-x divide-ivory-400/10 border-y border-ivory-400/10 max-w-4xl mx-auto"
        >
          {[
            { icon: HomeIcon, label: 'Type', value: property.type },
            ...(property.bhk && property.bhk !== 'NA' ? [{ icon: BedDouble, label: 'Configuration', value: property.bhk }] : []),
            {
              icon: Maximize,
              label: property.type === 'Plot' ? 'Land Area' : 'Built Area',
              value: property.sqft > 0 ? `${property.sqft.toLocaleString()} sqft` : property.landArea ?? '—',
            },
            { icon: MapPin, label: 'Status', value: property.status },
          ].map((fact) => (
            <div key={fact.label} className="flex-1 min-w-[140px] sm:min-w-[180px] p-6 md:p-8 text-center flex flex-col items-center justify-center gap-2">
              <fact.icon className="w-5 h-5 text-gold-450 mb-1" />
              <span className="font-body text-[11px] uppercase tracking-widest text-ivory-400">{fact.label}</span>
              <span className="font-display text-lg text-ivory-50">{fact.value}</span>
            </div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <span className="font-display text-3xl md:text-4xl font-bold text-gold-450">{property.priceDisplay}</span>
        </div>
      </section>

      {/* ===================== SECTION 7 — Location Experience ===================== */}
      <section className="py-20 md:py-28 bg-matte-950 border-y border-ivory-400/10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-3 block">
            Location Experience
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50 mb-6">
            {property.area || property.location.split(',')[0]}, <span className="text-gradient-gold font-medium">Kerala</span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-body text-ivory-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-12"
          >
            {locationNarrative}
          </motion.p>

          {property.nearby && property.nearby.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {property.nearby.map((place, idx) => (
                <motion.div
                  key={place.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="glass-card p-5 border-ivory-400/10 flex items-center gap-3 text-left"
                >
                  <Compass className="w-4 h-4 text-champagne-400 shrink-0" />
                  <div>
                    <div className="font-body text-ivory-100 text-sm font-medium">{place.name}</div>
                    <div className="font-body text-ivory-400 text-xs">{place.distance}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {property.coordinates?.lat && property.coordinates?.lng && (
            <>
              <div className="mt-12 max-w-4xl mx-auto rounded-3xl overflow-hidden border border-gold-500/15 shadow-elegant bg-matte-900 z-0 relative">
                <div ref={mapRef} className="h-72 w-full dark-leaflet-map" />
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-10 px-6 py-3 rounded-full border border-gold-500/30 text-gold-450 text-xs font-body uppercase tracking-wider font-semibold hover:bg-gold-500/10 transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                View On Map
              </a>
            </>
          )}
        </div>
      </section>

      {/* ===================== SECTION 8 — Built For Generations ===================== */}
      <section className="py-20 md:py-28 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-3 block">
          Craftsmanship
        </span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: LUXE_EASE }}
          className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50 mb-8"
        >
          {CONSTRUCTION_PHILOSOPHY.title}
        </motion.h2>
        <div className="space-y-5">
          {CONSTRUCTION_PHILOSOPHY.paragraphs.map((para, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              className="font-body text-ivory-300 text-base sm:text-lg leading-relaxed"
            >
              {para}
            </motion.p>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-6"
          >
            <Link
              to="/explore-us/construction-standards"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 text-xs font-body uppercase tracking-wider font-semibold transition-all"
            >
              <span>Explore Construction Standards & Materials</span>
              <span>→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===================== SECTION 8.5 — Floor Plan Layout ===================== */}
      {property.floorPlan && (
        <section className="py-20 md:py-28 max-w-5xl mx-auto px-6 lg:px-8 border-t border-ivory-400/10">
          <div className="text-center mb-14">
            <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-3 block">
              Architectural Layout
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50">
              Floor Plan <span className="text-gradient-gold font-medium">Design</span>
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: LUXE_EASE }}
            className="relative rounded-3xl overflow-hidden border border-gold-500/15 shadow-elegant bg-matte-950 p-4 md:p-8 flex items-center justify-center"
          >
            {property.floorPlan.startsWith('data:application/pdf') || property.floorPlan.endsWith('.pdf') ? (
              <a
                href={property.floorPlan}
                target="_blank"
                rel="noreferrer"
                className="py-4 px-8 border border-gold-500/30 text-gold-450 hover:bg-gold-500/10 rounded-full font-semibold uppercase tracking-wider text-xs flex items-center gap-2 transition-all my-12"
              >
                <Download className="w-4 h-4" /> Preview Floor Plan PDF
              </a>
            ) : (
              <img
                src={property.floorPlan}
                alt={`${property.name} Floor Plan`}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('/images/hero/projects-hero.jpg')) {
                    target.src = '/images/hero/projects-hero.jpg';
                  }
                }}
                className="max-h-[500px] w-auto object-contain rounded-2xl"
              />
            )}
          </motion.div>
        </section>
      )}

      {/* ===================== SECTION 9 — Testimonials (Client Stories) ===================== */}
      <Testimonials />

      {/* ===================== SECTION 10.5 — 360° YouTube Embed Preview ===================== */}
      {property.virtualTourLink && getYouTubeEmbedUrl(property.virtualTourLink) && (
        <section className="py-20 md:py-28 max-w-5xl mx-auto px-6 lg:px-8 border-t border-ivory-400/10">
          <div className="text-center mb-14">
            <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-3 block">
              360° Virtual Experience
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50">
              Immersive <span className="text-gradient-gold font-medium">Walkthrough</span>
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: LUXE_EASE }}
            className="relative aspect-[16/9] w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-gold-500/15 shadow-elegant bg-matte-950"
          >
            <iframe
              src={getYouTubeEmbedUrl(property.virtualTourLink)!}
              title="360° Virtual Tour"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </motion.div>
        </section>
      )}

      {/* ===================== SECTION 10 & 11 — Dossier + Virtual Tour Buttons ===================== */}
      {(property.brochurePdf || (property.virtualTourLink && !getYouTubeEmbedUrl(property.virtualTourLink))) && (
        <section className="py-20 md:py-28 bg-matte-950 border-y border-ivory-400/10">
          <div className={`max-w-4xl mx-auto px-6 lg:px-8 grid grid-cols-1 ${property.brochurePdf && property.virtualTourLink && !getYouTubeEmbedUrl(property.virtualTourLink) ? 'sm:grid-cols-2' : ''} gap-6`}>
            {property.brochurePdf && (
              <motion.a
                href={property.brochurePdf}
                download={`${property.name.toLowerCase().replace(/\s+/g, '-')}-dossier.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="glass-card-hover p-8 border-gold-500/15 flex flex-col items-center text-center gap-4 cursor-pointer"
              >
                <Download className="w-7 h-7 text-gold-450" />
                <span className="font-display text-lg text-ivory-50">Explore The Property Dossier</span>
                <span className="font-body text-ivory-400 text-xs uppercase tracking-wider">Download The Digital Brochure</span>
              </motion.a>
            )}

            {property.virtualTourLink && !getYouTubeEmbedUrl(property.virtualTourLink) && (
              <motion.a
                href={property.virtualTourLink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="glass-card-hover p-8 border-gold-500/15 flex flex-col items-center text-center gap-4 cursor-pointer"
              >
                <Compass className="w-7 h-7 text-gold-450" />
                <span className="font-display text-lg text-ivory-50">Take A Virtual Walkthrough</span>
                <span className="font-body text-ivory-400 text-xs uppercase tracking-wider">360&deg; Immersive Tour</span>
              </motion.a>
            )}
          </div>

          {/* Quick contact row */}
          <div className="max-w-4xl mx-auto px-6 lg:px-8 grid grid-cols-2 gap-4 mt-6">
            <a
              href="tel:+919496975555"
              className="flex items-center justify-center gap-2 py-3.5 rounded-full border border-ivory-400/15 text-ivory-300 text-xs font-body uppercase tracking-wider hover:border-gold-500/30 hover:text-gold-400 transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Us
            </a>
            <a
              href="https://wa.me/919946302222"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 rounded-full border border-emerald-500/20 text-emerald-400 text-xs font-body uppercase tracking-wider hover:bg-emerald-500/10 transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>
        </section>
      )}

      {/* Fallback Contact row if Dossier section is hidden */}
      {!property.brochurePdf && (!property.virtualTourLink || getYouTubeEmbedUrl(property.virtualTourLink)) && (
        <section className="py-10 bg-matte-black border-y border-ivory-400/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 grid grid-cols-2 gap-4">
            <a
              href="tel:+919496975555"
              className="flex items-center justify-center gap-2 py-3.5 rounded-full border border-ivory-400/15 text-ivory-300 text-xs font-body uppercase tracking-wider hover:border-gold-500/30 hover:text-gold-400 transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Us
            </a>
            <a
              href="https://wa.me/919946302222"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 rounded-full border border-emerald-500/20 text-emerald-400 text-xs font-body uppercase tracking-wider hover:bg-emerald-500/10 transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>
        </section>
      )}

      {/* ===================== SECTION 12 — Final Emotional CTA ===================== */}
      <CTASection
        title="More Than A Home"
        description="A place where children grow, where families gather, and where memories are built for generations."
        onOpenBooking={onOpenBooking}
      />
    </motion.div>
  );
}
