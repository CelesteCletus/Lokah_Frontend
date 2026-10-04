import { motion } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShieldCheck, 
  PieChart, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';

export default function PropertyDevelopment() {
  const { onOpenBooking } = useOutletContext<LayoutContextType>();

  const jvModels = [
    {
      title: 'Joint Development Agreement (JDA)',
      badge: 'Landowner Partnership',
      desc: 'You provide the land; LOKAH manages the development. Outcomes are shared according to a jointly agreed arrangement.',
      highlights: ['A shared-outcome partnership structure', 'LOKAH manages design, approvals & construction', 'Terms agreed and documented upfront']
    },
    {
      title: 'Development Management (DM)',
      badge: 'Owner-Funded',
      desc: 'You retain ownership and fund the project; LOKAH manages design, approvals, and construction on your behalf for a fee.',
      highlights: ['You retain full ownership', 'LOKAH manages the development process', 'A clear, agreed management fee']
    },
    {
      title: 'Outright Land Acquisition',
      badge: 'Direct Purchase',
      desc: 'LOKAH purchases land directly, with legal verification and a straightforward transfer process.',
      highlights: ['A direct purchase arrangement', 'Legal title verification', 'A transparent transfer process']
    }
  ];

  const feasibilitySteps = [
    { num: '01', title: 'Zoning & FSI Analysis', desc: 'Evaluating maximum permissable Floor Space Index (FSI), height limits, road widths, and municipal setbacks.' },
    { num: '02', title: 'Title & Legal Clearance', desc: 'Comprehensive 30-year title verification, encumbrance certificate audits, and revenue record validation.' },
    { num: '03', title: 'Architectural Yield Design', desc: 'Creating optimal residential or commercial layouts to maximize salable/usable area yield.' },
    { num: '04', title: 'Financial Modeling & ROI', desc: 'Projecting gross development value (GDV), construction cash-flow phasing, and internal rate of return (IRR).' }
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
        title="Property Development"
        subtitle="Unlocking land value through strategic joint ventures, master planning, and disciplined property development."
        imageSrc="/images/services/property-development.jpg"
        category="Land &amp; Long-Term Value"
        ctaText="Discuss Land Partnership"
        onCtaClick={() => onOpenBooking('consultation')}
      />

      {/* VALUE PROPOSITION FOR LANDOWNERS */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 border-b border-ivory-400/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
            Land Monetization
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            Strategic Land <span className="text-gradient-gold font-medium">Development</span>
          </h2>
          <p className="font-body text-ivory-400 text-sm sm:text-base font-light leading-relaxed">
            Partner with LOKAH Builders to convert unutilized land parcels into residential apartments, gated villa communities, or commercial hubs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <RevealOnScroll className="glass-card p-8 border border-gold-500/15 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-ivory-50 font-medium">FSI &amp; Density Maximization</h3>
            <p className="font-body text-ivory-400 text-xs sm:text-sm font-light leading-relaxed">
              Leveraging statutory bylaws to unlock maximum built-up square footage and optimize asset yield.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="glass-card p-8 border border-gold-500/15 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-ivory-50 font-medium">Transparent Profit Ratios</h3>
            <p className="font-body text-ivory-400 text-xs sm:text-sm font-light leading-relaxed">
              Equitable revenue sharing models backed by escrow accounts, clear milestones, and audited books.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2} className="glass-card p-8 border border-gold-500/15 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-ivory-50 font-medium">Rigorous Title &amp; Encumbrance Audits</h3>
            <p className="font-body text-ivory-400 text-xs sm:text-sm font-light leading-relaxed">
              Title clearance and corporation approvals protecting landowner interests at every phase.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* JOINT VENTURE MODELS GRID */}
      <section className="py-28 bg-matte-950 border-b border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
              Partnership Options
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              Partnership <span className="text-gradient-gold font-medium">Models</span>
            </h2>
            <p className="font-body text-ivory-400 text-sm max-w-xl mx-auto font-light">
              Structured investment and joint development frameworks aligned with landowner goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {jvModels.map((model) => (
              <RevealOnScroll key={model.title} className="glass-card p-8 border border-gold-500/15 flex flex-col justify-between space-y-6 relative">
                <div className="space-y-4">
                  <span className="font-body text-[10px] uppercase tracking-widest text-champagne-400 font-semibold px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 inline-block">
                    {model.badge}
                  </span>
                  <h3 className="font-display text-xl text-ivory-50 font-medium">{model.title}</h3>
                  <p className="font-body text-ivory-400 text-xs sm:text-sm leading-relaxed font-light">{model.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2.5">
                  {model.highlights.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-ivory-300 text-xs font-light">
                      <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* LANDOWNER PROTECTION BANNER */}
          <RevealOnScroll className="max-w-4xl mx-auto glass-card p-6 sm:p-8 border border-gold-500/20 bg-gold-500/5 text-center flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-450 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <p className="font-body text-ivory-300 text-xs sm:text-sm leading-relaxed font-light text-left">
              <strong className="text-gold-400 font-medium block mb-0.5">Capital &amp; Equity Security:</strong>
              All joint venture partnerships utilize dedicated bank escrow accounts, joint signatory approvals, and scheduled milestone releases to ensure capital protection.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* FEASIBILITY & EVALUATION FRAMEWORK */}
      <section className="py-28 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
            Due Diligence Protocol
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            Site Feasibility <span className="text-gradient-gold font-medium">Protocol</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {feasibilitySteps.map((step) => (
            <RevealOnScroll key={step.num} className="glass-card p-6 border border-gold-500/15 space-y-3 relative">
              <span className="font-accent text-gold-450/40 text-xs tracking-widest font-semibold block">
                PHASE {step.num}
              </span>
              <h4 className="font-display text-lg text-ivory-50 font-medium">{step.title}</h4>
              <p className="font-body text-ivory-400 text-xs leading-relaxed font-light">{step.desc}</p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* RELATED NAVIGATION LINKS */}
      <section className="py-16 bg-matte-black border-t border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <span className="font-body text-champagne-400 text-xs tracking-widest uppercase font-semibold block">
            Explore Related Capabilities
          </span>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services/commercial-projects" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Commercial Projects
            </Link>
            <Link to="/services/turnkey-projects" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Turnkey Projects
            </Link>
            <Link to="/services/consultancy" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Technical Consultancy
            </Link>
          </div>
        </div>
      </section>

      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
