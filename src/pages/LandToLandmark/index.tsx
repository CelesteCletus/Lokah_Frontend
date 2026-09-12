import { motion } from 'framer-motion';
import { useOutletContext, useNavigate } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';
import { slugify } from '../../lib/propertyContent';
import { Landmark, Compass, ShieldCheck, Hammer } from 'lucide-react';

export default function LandToLandmark() {
  const { onOpenBooking, properties } = useOutletContext<LayoutContextType>();
  const navigate = useNavigate();
  const goToProperty = (name: string) => navigate(`/properties/${slugify(name)}`);
  
  // Show projects with Land to Landmark type or status
  const customBuilds = properties.filter((p) => p.type === 'Land to Landmark' || p.status === 'Land to Landmark');

  const jvStages = [
    {
      title: 'Site Analysis & Vetting',
      description: 'Analyzing soil stability, solar orientation, wind flow vectors, and municipal clearances of your land.',
      icon: Compass,
    },
    {
      title: 'Bespoke Architecture',
      description: 'Designing custom architectural layouts and 3D elevations matching your specific preferences.',
      icon: Landmark,
    },
    {
      title: 'Technical Budgeting',
      description: 'Providing comprehensive estimates with fixed-price contracts and zero cost escalations.',
      icon: ShieldCheck,
    },
    {
      title: 'Turnkey Construction',
      description: 'Supervising civil execution, layout formatting, concrete quality testing, and final key delivery.',
      icon: Hammer,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      <FullScreenHero
        title="Land to Landmark"
        subtitle="We build premium custom villas and luxury homes on your own land. Complete turnkey construction from initial layout to key handover."
        videoSrc="/videos/hero/land to landscape.mp4"
        category="Custom Home Building"
        ctaText="Build On Your Plot"
        onCtaClick={onOpenBooking}
      />

      {/* JV Process Showcase Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-widest uppercase font-semibold block mb-3">
            Our Building System
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            How We Build on <span className="text-gradient-gold font-medium">Your Land</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {jvStages.map((stage, idx) => (
            <RevealOnScroll
              key={stage.title}
              delay={idx * 0.1}
              className="glass-card p-8 flex flex-col items-center text-center hover:border-champagne-400/35 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-6 text-gold-400 group-hover:bg-gold-500 group-hover:text-matte-black transition-all duration-500">
                <stage.icon className="w-8 h-8" />
              </div>
              <h3 className="font-display text-lg text-ivory-50 mb-3">{stage.title}</h3>
              <p className="font-body text-xs text-ivory-400 leading-relaxed font-light">{stage.description}</p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Custom Builds Portfolio Section */}
      <section className="py-16 bg-matte-950 border-t border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12 text-center lg:text-left">
            <span className="font-body text-champagne-400 text-xs tracking-widest uppercase font-semibold block mb-3">
              Delivered Custom Homes
            </span>
            <h2 className="font-display text-3xl font-light text-ivory-50 mb-4">
              Custom Designs built on <span className="text-gradient-gold font-medium">Clients’ Land</span>
            </h2>
            <p className="font-body text-xs sm:text-sm text-ivory-400 max-w-xl font-light">
              Explore our portfolio of bespoke luxury villas designed and executed on our clients' private plots.
            </p>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customBuilds.map((project, index) => (
              <RevealOnScroll
                key={project.id}
                delay={index * 0.08}
              >
                <PropertyCard
                  key={project.id}
                  property={project}
                  index={index}
                  onClick={() => goToProperty(project.name)}
                />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
