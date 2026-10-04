import { motion } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Calculator, 
  Calendar, 
  ShieldAlert, 
  Layers, 
  BarChart3, 
  TrendingDown, 
  ShieldCheck, 
  Lock
} from 'lucide-react';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';

export default function ProjectPlanning() {
  const { onOpenBooking } = useOutletContext<LayoutContextType>();

  const pillars = [
    { title: 'Line-Item BOQ Accuracy', desc: 'Itemized material take-offs, labor outputs, and market-benchmarked rate analysis guaranteeing financial transparency.', icon: Calculator },
    { title: 'Critical Path Method (CPM)', desc: 'Gantt scheduling identifying dependency paths, long-lead procurement items, and milestone buffers.', icon: Calendar },
    { title: 'BIM Clash Detection', desc: '3D Building Information Modeling (BIM) eliminating structural, MEP, and plumbing conflicts before ground-breaking.', icon: Layers },
    { title: 'Risk Mitigation Strategy', desc: 'Material inflation hedging, weather delay contingencies, and emergency labor mobilization plans.', icon: ShieldAlert }
  ];

  const roadmapPhases = [
    { phase: '01', title: 'Financial Phasing', detail: 'Cash-flow forecasting matched to construction progress milestones.' },
    { phase: '02', title: 'Procurement Schedule', detail: 'Sequencing material and resource ordering to keep the build on track.' },
    { phase: '03', title: 'Resource Coordination', detail: 'Aligning manpower and site resources with the construction schedule.' },
    { phase: '04', title: 'Progress Oversight', detail: 'Ongoing review of progress against the plan, with adjustments made as needed.' }
  ];

  const riskControls = [
    {
      title: 'Material Rate Hedging',
      desc: 'Locking in supplier pricing early for core commodities like steel and cement to insulate your budget from market inflation.',
      icon: TrendingDown
    },
    {
      title: 'Contingency Allocation',
      desc: 'Structured 5-10% financial reserves earmarked for unmapped site geology or municipal utility adjustments.',
      icon: ShieldCheck
    },
    {
      title: 'Performance Retainage Bonds',
      desc: 'Enforcing subcontractor milestone retainage terms to guarantee delivery speed and quality standards.',
      icon: Lock
    }
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
        title="Project Planning &amp; BOQs"
        subtitle="Predictive construction controls, detailed BOQ auditing, and critical-path scheduling designed to minimize cost volatility and project schedule drift."
        imageSrc="/images/services/project-planning.jpg"
        category="Planning &amp; Coordination"
        ctaText="Plan Your Project"
        onCtaClick={() => onOpenBooking('consultation')}
      />

      {/* 4 PILLARS OF PLANNING */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 border-b border-ivory-400/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
            Pre-Construction Controls
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            Disciplined <span className="text-gradient-gold font-medium">Early Planning</span>
          </h2>
          <p className="font-body text-ivory-400 text-sm sm:text-base font-light leading-relaxed">
            Construction begins long before excavation. Establishing clear cost baselines and scheduling schedules ensures controlled execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pil) => {
            const Icon = pil.icon;
            return (
              <RevealOnScroll key={pil.title} className="glass-card p-8 border border-gold-500/15 flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl text-ivory-50 font-medium">{pil.title}</h3>
                  <p className="font-body text-ivory-400 text-xs sm:text-sm leading-relaxed font-light">{pil.desc}</p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* COST VOLATILITY & RISK BUFFER MANAGEMENT */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 border-b border-ivory-400/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
            Financial &amp; Operational Controls
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            Cost &amp; <span className="text-gradient-gold font-medium">Risk Controls</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {riskControls.map((risk) => {
            const RiskIcon = risk.icon;
            return (
              <RevealOnScroll key={risk.title} className="glass-card p-8 border border-gold-500/15 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450">
                  <RiskIcon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-ivory-50 font-medium">{risk.title}</h3>
                <p className="font-body text-ivory-400 text-xs sm:text-sm font-light leading-relaxed">{risk.desc}</p>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* PLANNING ROADMAP */}
      <section className="py-28 bg-matte-950 border-b border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
              Methodology
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              Planning <span className="text-gradient-gold font-medium">Roadmap</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {roadmapPhases.map((rp) => (
              <RevealOnScroll key={rp.phase} className="glass-card p-6 border border-gold-500/15 space-y-3 border-l-2 border-l-gold-500/40 md:border-l md:border-l-gold-500/15">
                <div className="flex items-center justify-between">
                  <span className="font-accent text-gold-450 text-xs tracking-widest font-semibold block">
                    PHASE {rp.phase}
                  </span>
                  <BarChart3 className="w-4 h-4 text-gold-400/50" />
                </div>
                <h4 className="font-display text-lg text-ivory-50 font-medium">{rp.title}</h4>
                <p className="font-body text-ivory-400 text-xs leading-relaxed font-light">{rp.detail}</p>
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
            <Link to="/services/turnkey-projects" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Turnkey Projects
            </Link>
            <Link to="/services/consultancy" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Consultancy
            </Link>
            <Link to="/services/commercial-projects" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Commercial Projects
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Establish Pre-Construction Controls"
        description="Share your architectural drawings for a line-item BOQ audit and critical path schedule evaluation."
        onOpenBooking={onOpenBooking}
      />
    </motion.div>
  );
}
