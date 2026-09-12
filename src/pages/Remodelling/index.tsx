import { motion } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Layers, 
  Wrench, 
  Sun, 
  Home
} from 'lucide-react';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';

export default function Remodelling() {
  const { onOpenBooking } = useOutletContext<LayoutContextType>();

  const scopes = [
    { title: 'Full Structural Reconfiguration', desc: 'Selective structural dismantling to RCC frames, enabling complete interior and elevation reconfiguration.', icon: Home },
    { title: 'Additions & Floor Extensions', desc: 'Adding floor plates or structural wings planned to integrate naturally with existing foundations.', icon: Layers },
    { title: 'Facade Elevation Refresh', desc: 'Updating exterior cladding, glazing, and louvers to modernize property presence.', icon: Sun },
    { title: 'MEP Infrastructure Updates', desc: 'Upgrading electrical conduits, plumbing stacks, and HVAC ducting to modern performance standards.', icon: Wrench }
  ];

  const steps = [
    { num: '01', title: 'Structural Assessment', desc: 'Evaluating structural core integrity and load-bearing walls prior to demolition work.' },
    { num: '02', title: 'Site Protection & Isolation', desc: 'Deployment of sealed dust containment barriers, floor armor sheets, and negative-air fans.' },
    { num: '03', title: 'Structural Retrofitting', desc: 'Executing steel column Jacketing, beam reinforcement, and floorplate layout alterations.' },
    { num: '04', title: 'Detailing & Handover', desc: 'Surface finishing, snag list audits, and final client walkthrough before project sign-off.' }
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
        title="Remodelling &amp; Renovation"
        subtitle="Updating existing residential and commercial properties through structural retrofitting, layout reconfigurations, and modern exterior elevations."
        imageSrc="/images/services/remodelling.jpg"
        category="Renewal &amp; Transformation"
        ctaText="Transform Your Space"
        onCtaClick={() => onOpenBooking('consultation')}
      />

      {/* TRANSFORMATION SCOPE */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 border-b border-ivory-400/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
            Structural Renewal
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            Structural <span className="text-gradient-gold font-medium">Re-Imagining</span>
          </h2>
          <p className="font-body text-ivory-400 text-sm sm:text-base font-light leading-relaxed">
            Remodelling updates existing structures while retaining core foundation value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {scopes.map((scope) => {
            const Icon = scope.icon;
            return (
              <RevealOnScroll key={scope.title} className="glass-card p-8 border border-gold-500/15 flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl text-ivory-50 font-medium">{scope.title}</h3>
                  <p className="font-body text-ivory-400 text-xs sm:text-sm leading-relaxed font-light">{scope.desc}</p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* TRANSFORMATION PROCESS */}
      <section className="py-28 bg-matte-950 border-b border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
              Methodology
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              The Renovation <span className="text-gradient-gold font-medium">Sequence</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((stp) => (
              <RevealOnScroll key={stp.num} className="glass-card p-6 border border-gold-500/15 space-y-3 relative overflow-hidden">
                <span className="absolute top-4 right-5 font-display text-6xl font-extrabold text-gold-450/5 pointer-events-none select-none">
                  {stp.num}
                </span>
                <span className="font-body text-xs uppercase tracking-widest text-champagne-400 font-semibold block">
                  Step {stp.num}
                </span>
                <h4 className="font-display text-lg text-ivory-50 font-medium">{stp.title}</h4>
                <p className="font-body text-ivory-400 text-xs leading-relaxed font-light">{stp.desc}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED NAVIGATION LINKS */}
      <section className="py-16 bg-matte-black border-t border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <span className="font-body text-champagne-400 text-xs tracking-widest uppercase font-semibold block">
            Explore Related Services
          </span>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services/interior-exterior" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Interior &amp; Exterior Finishes
            </Link>
            <Link to="/services/turnkey-projects" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Turnkey Projects
            </Link>
            <Link to="/services/consultancy" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Consultancy
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Assess Your Renovation Scope"
        description="Schedule a structural site inspection to evaluate retrofitting parameters and floorplate modifications."
        onOpenBooking={onOpenBooking}
      />
    </motion.div>
  );
}
