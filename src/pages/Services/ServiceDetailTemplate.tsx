import { motion } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Compass, Hammer, Sparkles, KeyRound } from 'lucide-react';
import type { LayoutContextType } from '../../layouts/RootLayout';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';

interface ServiceDetailProps {
  title: string;
  subtitle: string;
  description?: string;
  benefits?: string[];
  specs?: string[];
  bannerImage?: string;
}

export default function ServiceDetailTemplate({
  title,
  subtitle,
  description,
  benefits,
  specs,
  bannerImage = '/images/services/turnkey.jpg',
}: ServiceDetailProps) {
  const { onOpenBooking } = useOutletContext<LayoutContextType>();

  const mainDescription = description || "At Lokah Builders, we create thoughtfully designed homes that combine modern architecture, quality craftsmanship, and lasting value. Every project is planned with attention to detail, ensuring comfort, functionality, and timeless appeal for generations to come.";

  const benefitsList = benefits && benefits.length > 0 ? benefits : [
    'Premium Residential Construction',
    'Luxury Interior & Exterior Finishes',
    'Smart Space Planning',
    'Quality Materials & Craftsmanship',
    'Modern Architectural Design',
    'Timely Project Execution'
  ];

  const specsList = specs && specs.length > 0 ? specs : [
    'Quality construction from foundation to finish',
    'Efficient layouts designed for modern living',
    'Premium fixtures and finishing materials',
    'Attention to detail at every stage'
  ];

  const journeySteps = [
    {
      num: '01',
      title: 'Understanding Your Vision',
      desc: 'We begin by understanding your lifestyle, aspirations, and project goals to create a home that truly reflects you.',
      icon: Sparkles,
    },
    {
      num: '02',
      title: 'Planning & Design',
      desc: 'Our architects carefully transform your vision into thoughtfully planned spaces that combine beauty, comfort, and functionality.',
      icon: Compass,
    },
    {
      num: '03',
      title: 'Building With Excellence',
      desc: 'Every stage of construction is carried out with precision, quality craftsmanship, and close attention to every detail.',
      icon: Hammer,
    },
    {
      num: '04',
      title: 'Welcome Home',
      desc: "After comprehensive quality checks, we proudly hand over a home that is ready for your family's next chapter.",
      icon: KeyRound,
    },
  ];

  const relatedLinks = [
    { label: 'Turnkey Solutions', path: '/services/turnkey-projects' },
    { label: 'Residential Construction', path: '/services/residential-projects' },
    { label: 'Commercial Engineering', path: '/services/commercial-projects' },
    { label: 'Land development JV', path: '/projects/land-to-landmark' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      <FullScreenHero
        title={title}
        subtitle={subtitle}
        imageSrc={bannerImage}
        category="Service Details"
        ctaText="Discuss Project Details"
        onCtaClick={onOpenBooking}
      />

      {/* Main Details Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left 2 Columns: Description & Features */}
        <div className="lg:col-span-2 space-y-12">
          <RevealOnScroll className="space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              Overview &amp; <span className="text-gradient-gold font-medium">Execution Scope</span>
            </h2>
            <p className="font-body text-ivory-300 text-sm md:text-base leading-relaxed font-light whitespace-pre-line">
              {mainDescription}
            </p>
          </RevealOnScroll>

          <RevealOnScroll className="border-t border-ivory-400/10 pt-10 space-y-6">
            <h3 className="font-display text-2xl font-light text-ivory-50">Expertise &amp; Deliverables</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefitsList.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 p-3 rounded-xl bg-charcoal-900/30 border border-gold-500/5 hover:border-gold-500/20 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-gold-500 mt-0.5 shrink-0" />
                  <span className="font-body text-ivory-300 text-xs sm:text-sm font-light leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>

        {/* Right Column: Specifications & Sidebar Card */}
        <div className="space-y-8">
          <RevealOnScroll className="glass-card p-8 border border-gold-500/15">
            <h3 className="font-display text-xl text-ivory-50 mb-6 pb-2 border-b border-ivory-400/10">
              Built With Excellence
            </h3>
            <ul className="space-y-4">
              {specsList.map((spec) => (
                <li key={spec} className="flex items-start gap-3 text-ivory-350 text-xs sm:text-sm font-body font-light">
                  <CheckCircle2 className="w-4.5 h-4.5 text-gold-400 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </RevealOnScroll>

          <RevealOnScroll className="glass-card p-8 border border-gold-500/20 bg-gold-500/5 text-center space-y-4">
            <h3 className="font-display text-2xl text-ivory-50 font-light">Request Consultation</h3>
            <p className="font-body text-ivory-400 text-xs leading-relaxed font-light">
              Connect with our construction advisory team to discuss specific estimates, zoning, or blueprints for your project.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenBooking('consultation')}
              className="btn-primary w-full justify-center"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Appointment</span>
            </motion.button>
          </RevealOnScroll>
        </div>
      </div>

      {/* Service Process Timeline Block */}
      <section className="py-28 bg-matte-950 border-t border-ivory-400/10 relative overflow-hidden">
        {/* Subtle radial ambient background glow */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 60%)',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 space-y-3">
            <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold block">
              The Journey
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50">
              Service Execution <span className="text-gradient-gold font-medium">Timeline</span>
            </h2>
            <p className="font-body text-ivory-400 text-sm max-w-xl mx-auto font-light">
              From initial conception to handing over the keys, experience a transparent and thoughtful building journey.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Golden Timeline Line across desktop */}
            <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-px bg-gradient-to-r from-gold-500/0 via-gold-500/30 to-gold-500/0 z-0 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 relative z-10">
              {journeySteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <RevealOnScroll
                    key={step.num}
                    delay={idx * 0.1}
                    className="group relative bg-gradient-to-b from-charcoal-900/60 via-matte-950 to-matte-950 border border-gold-500/10 hover:border-gold-500/35 rounded-2xl p-7 lg:p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gold-500/5 flex flex-col justify-between"
                  >
                    {/* Oversized background number */}
                    <span className="absolute top-4 right-5 font-display text-6xl font-extrabold text-gold-450/5 group-hover:text-gold-450/10 transition-colors duration-500 pointer-events-none select-none">
                      {step.num}
                    </span>

                    <div>
                      {/* Icon Container with subtle glow */}
                      <div className="w-13 h-13 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450 mb-6 group-hover:bg-gold-500/20 group-hover:text-gold-400 group-hover:scale-110 transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="space-y-2">
                        <span className="font-body text-[10px] uppercase tracking-widest text-champagne-400 font-semibold block">
                          Step {step.num}
                        </span>
                        <h4 className="font-display text-xl font-medium text-ivory-50 group-hover:text-champagne-400 transition-colors duration-300">
                          {step.title}
                        </h4>
                        <p className="font-body text-ivory-350 text-xs sm:text-sm leading-relaxed font-light pt-1">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Related Services Links section */}
      <section className="py-16 bg-matte-black border-t border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-8">
          <span className="font-body text-champagne-400 text-xs tracking-widest uppercase font-semibold block">
            Navigate Further
          </span>
          <div className="flex flex-wrap justify-center gap-4">
            {relatedLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
