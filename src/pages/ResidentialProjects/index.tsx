import { motion } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Home,
  Sparkles,
  Compass,
  Hammer,
  KeyRound,
  Maximize2,
  Sun,
  Users,
  CheckCircle2
} from 'lucide-react';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';
import PropertyCard from '../../components/PropertyCard';
import type { LayoutContextType } from '../../layouts/RootLayout';

export default function ResidentialProjects() {
  const { onOpenBooking, properties, handlePropertyClick } = useOutletContext<LayoutContextType>();
  const residential = properties.filter((p) => p.type === 'Villa' || p.type === 'Apartment');

  const livingMoments = [
    { title: 'Shared Living Spaces', desc: 'Open, light-filled rooms designed for everyday family gathering.', icon: Maximize2 },
    { title: 'Private Retreats', desc: 'Bedrooms and personal spaces planned for privacy, quiet, and comfort.', icon: Home },
    { title: 'Outdoor & Terrace Areas', desc: 'Balconies and terraces extending everyday living into the open air.', icon: Sun },
    { title: 'Practical Utility Zones', desc: 'Storage and utility areas planned for efficient daily routines.', icon: Users },
  ];

  const standards = [
    'Seismic Zone III RCC Frame Certification',
    'Double-Glazed Low-E Acoustic Glass',
    'VRV Climate Control Integration',
    'Italian Travertine & Marble Surfaces'
  ];

  const journeySteps = [
    { num: '01', title: 'Understanding Your Vision', desc: 'Listening to your lifestyle parameters, family space needs, and site priorities.', icon: Sparkles },
    { num: '02', title: 'Planning & Design', desc: 'Translating requirements into layouts that optimize natural light and circulation.', icon: Compass },
    { num: '03', title: 'Building With Care', desc: 'Supervised structural execution adhering to certified material standards.', icon: Hammer },
    { num: '04', title: 'Welcome Home', desc: 'A thorough snagging audit precedes final key handover.', icon: KeyRound },
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
        title="Residential Projects"
        subtitle="Designing and constructing private residences, duplex villas, and family estates aligned with your lifestyle and site orientation."
        imageSrc="/images/services/residential.jpg"
        category="Homes &amp; Living"
        ctaText="Schedule a Private Residence Consultation"
        onCtaClick={() => onOpenBooking('consultation')}
        align="left"
      />

      {/* EDITORIAL INTRO */}
      <section className="py-24 max-w-4xl mx-auto px-6 lg:px-8 text-center border-b border-ivory-400/10">
        <RevealOnScroll className="space-y-6">
          <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
            Residential Architecture
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50 leading-tight">
            Architectural Layouts <span className="text-gradient-gold font-medium">for Living</span>
          </h2>
          <p className="font-body text-ivory-300 text-sm sm:text-base leading-relaxed font-light">
            At LOKAH Builders, residential planning begins with site orientation and everyday routines.
            From those parameters, we construct residences engineered for spatial efficiency and enduring quality.
          </p>
        </RevealOnScroll>
      </section>

      {/* HORIZONTAL SPECIFICATION STRIP */}
      <section className="py-16 bg-matte-950 border-b border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
              Enduring Standards
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gold-500/15 border-y border-gold-500/15 py-6">
            {standards.map((std, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                <span className="font-body text-ivory-200 text-xs sm:text-sm font-light">{std}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVING MOMENTS GRID */}
      <section className="py-28 bg-matte-black border-b border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
              Everyday Function
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              Spaces for <span className="text-gradient-gold font-medium">Living</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {livingMoments.map((zone) => {
              const Icon = zone.icon;
              return (
                <RevealOnScroll key={zone.title} className="glass-card p-8 border border-gold-500/15 flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-xl text-ivory-50 font-medium">{zone.title}</h3>
                    <p className="font-body text-ivory-400 text-xs sm:text-sm leading-relaxed font-light">{zone.desc}</p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOMEOWNER JOURNEY TIMELINE */}
      <section className="py-28 max-w-7xl mx-auto px-6 lg:px-8 relative overflow-hidden">
        <div className="text-center mb-20 space-y-3">
          <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
            Execution Sequence
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            The Construction <span className="text-gradient-gold font-medium">Journey</span>
          </h2>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-px bg-gradient-to-r from-gold-500/0 via-gold-500/30 to-gold-500/0 z-0 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {journeySteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <RevealOnScroll key={step.num} delay={idx * 0.1} className="glass-card p-7 border border-gold-500/15 space-y-4 relative overflow-hidden">
                  <span className="absolute top-4 right-5 font-display text-6xl font-extrabold text-gold-450/5 pointer-events-none select-none">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450">
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <span className="font-body text-[10px] uppercase tracking-widest text-champagne-400 font-semibold block">Step {step.num}</span>
                    <h4 className="font-display text-xl text-ivory-50 font-medium">{step.title}</h4>
                    <p className="font-body text-ivory-400 text-xs leading-relaxed font-light">{step.desc}</p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* RELATED NAVIGATION LINKS */}
      <section className="py-16 bg-matte-black border-t border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <span className="font-body text-champagne-400 text-xs tracking-widest uppercase font-semibold block">
            Explore Related Capabilities
          </span>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services/turnkey-projects" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Turnkey Execution
            </Link>
            <Link to="/services/interior-exterior" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Interior &amp; Exterior Finishes
            </Link>
            <Link to="/services/remodelling" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Home Remodelling
            </Link>
          </div>
        </div>
      </section>

      {/* RESIDENTIAL SHOWCASE GRID */}
      {residential.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-ivory-400/10">
          <div className="text-center mb-16 space-y-3">
            <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
              Residential Landmarks
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              Featured Homes <span className="text-gradient-gold font-medium">&amp; Estates</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {residential.slice(0, 3).map((project, index) => (
              <PropertyCard
                key={project.id}
                property={project}
                index={index}
                onClick={() => handlePropertyClick(project)}
              />
            ))}
          </div>
        </section>
      )}

      <CTASection
        title="Schedule a Private Residence Consultation"
        description="Share your plot parameters and space requirements with our architectural team."
        onOpenBooking={onOpenBooking}
      />
    </motion.div>
  );
}
