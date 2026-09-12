import { motion } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Construction, Home, Building2, Paintbrush, Hammer, Landmark, Compass, CalendarRange, ArrowRight } from 'lucide-react';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';

export default function Services() {
  const navigate = useNavigate();
  const { onOpenBooking } = useOutletContext<LayoutContextType>();

  const services = [
    { title: 'Turnkey Projects', path: '/services/turnkey-projects', icon: Construction, desc: 'Complete construction oversight from drafting board approvals to finishing key handover.' },
    { title: 'Residential Projects', path: '/services/residential-projects', icon: Home, desc: 'Curated premium private villa estates and luxury residential apartment complexes.' },
    { title: 'Commercial Projects', path: '/services/commercial-projects', icon: Building2, desc: 'Corporate headquarters, boutique business centers, and luxury retail malls.' },
    { title: 'Interior & Exterior', path: '/services/interior-exterior', icon: Paintbrush, desc: 'Bespoke high-end custom interior designs and visual landscaping.' },
    { title: 'Remodelling', path: '/services/remodelling', icon: Hammer, desc: 'Elite structural enhancements, extension additions, and historic restorations.' },
    { title: 'Property Development', path: '/services/property-development', icon: Landmark, desc: 'Strategic residential layouts and luxury gated community developments.' },
    { title: 'Consultancy', path: '/services/consultancy', icon: Compass, desc: 'Pre-construction feasibility surveys, cost estimation, and legal vetting.' },
    { title: 'Project Planning', path: '/services/project-planning', icon: CalendarRange, desc: 'Sophisticated schedule execution mapping, engineering drafting, and CAD design.' },
  ];

  const executionSteps = [
    { number: '01', title: 'Consultation & Feasibility', desc: 'Understanding your vision, evaluating land zoning, and drafting soil & legal surveys.' },
    { number: '02', title: 'Concept Architecture', desc: 'Creating 3D renders, layout plans, and material checklists matching luxury profiles.' },
    { number: '03', title: 'Turnkey Construction', desc: 'Laying the foundation, structural RCC pouring, civil detailing under strict QA inspections.' },
    { number: '04', title: 'Bespoke Handovers', desc: 'Installing premium marbles, automated home controls, and handing over the final keys.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      <FullScreenHero
        title="Our Engineering &amp; Design Services"
        subtitle="LOKAH Builders &amp; Developers provides unified planning, civil engineering, and styling workflows for private and corporate partners."
        videoSrc="/videos/services/construction-loop.mp4"
        category="What We Do"
        ctaText="Discuss Your Project"
        onCtaClick={onOpenBooking}
      />

      {/* Services Grid Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <RevealOnScroll
                key={service.title}
                delay={index * 0.08}
                onClick={() => navigate(service.path)}
                className="glass-card p-8 border border-gold-500/10 hover:border-gold-500/35 hover:scale-[1.02] hover:shadow-gold transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-6 group-hover:bg-gold-500 group-hover:text-matte-black transition-all duration-500">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl text-ivory-50 mb-3 group-hover:text-champagne-400 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="font-body text-ivory-350 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                    {service.desc}
                  </p>
                </div>
                
                <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-body font-semibold tracking-wider uppercase group-hover:text-gold-300 transition-colors mt-4">
                  <span>Explore Service</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* Execution Timeline Flow */}
      <section className="py-24 bg-matte-950 border-y border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-widest uppercase font-semibold block mb-3">
              How We Deliver
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              The Execution <span className="text-gradient-gold font-medium">Flow</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {executionSteps.map((step, idx) => (
              <RevealOnScroll
                key={step.number}
                delay={idx * 0.1}
                className="relative p-6 border-l border-gold-500/20 space-y-3"
              >
                <span className="font-accent text-3xl font-bold text-gold-500/30 group-hover:text-gold-550 transition-colors">
                  {step.number}
                </span>
                <h4 className="font-display text-lg text-ivory-50">{step.title}</h4>
                <p className="font-body text-ivory-400 text-xs leading-relaxed font-light">{step.desc}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
