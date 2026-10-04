import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Compass, 
  FileCheck, 
  Truck, 
  Hammer, 
  KeyRound
} from 'lucide-react';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';

export default function TurnkeyProjects() {
  const { onOpenBooking } = useOutletContext<LayoutContextType>();
  const [activeStep, setActiveStep] = useState(0);

  const pipelineSteps = [
    {
      num: '01',
      title: 'Site Feasibility',
      icon: Compass,
      desc: 'Topographical analysis, soil testing, zoning clearances, and budget boundaries established before design begins.',
      deliverable: 'Feasibility Report & Zoning Clearance'
    },
    {
      num: '02',
      title: 'Sanctions & Permits',
      icon: FileCheck,
      desc: '3D spatial design, structural engineering blueprints, and municipal corporation permits.',
      deliverable: 'Approved Blueprints & Municipal NOCs'
    },
    {
      num: '03',
      title: 'Procurement & BOQ',
      icon: Truck,
      desc: 'Fixed-cost Bill of Quantities with factory-direct procurement of certified steel, cement, marble, and fixtures.',
      deliverable: 'Locked BOQ & Procurement Schedule'
    },
    {
      num: '04',
      title: 'Construction Management',
      icon: Hammer,
      desc: 'Supervised structural execution, daily quality audits, concrete cube testing, and milestone tracking.',
      deliverable: 'Weekly Progress Audits & Quality Logs'
    },
    {
      num: '05',
      title: 'Handover & Care',
      icon: KeyRound,
      desc: 'Zero-defect snagging checklist audit, key handover, structural warranty issuance, and 1-year maintenance support.',
      deliverable: '10-Year Warranty & Building Manual'
    }
  ];

  const comparisonRows = [
    {
      feature: 'Point of Contact',
      turnkey: 'Single master partner (LOKAH)',
      traditional: 'Multiple separate contractors & designers'
    },
    {
      feature: 'Budget Control',
      turnkey: 'Fixed BOQ contract with zero overruns',
      traditional: 'Frequent cost escalation & scope creep'
    },
    {
      feature: 'Timeline Commitment',
      turnkey: 'Guaranteed completion date backed by terms',
      traditional: 'Unpredictable delays & vendor gaps'
    },
    {
      feature: 'Quality Assurance',
      turnkey: 'Lab tested concrete & certified steel',
      traditional: 'Self-policed contractor checks'
    },
    {
      feature: 'Warranty & Support',
      turnkey: '10-Year Structural Warranty & portal access',
      traditional: 'No single party taking long-term liability'
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
        title="Turnkey Projects"
        subtitle="Single-source accountability from plot evaluation to key handover. Managing architectural design, municipal approvals, procurement, and construction under one fixed-budget contract."
        imageSrc="/images/services/turnkey.jpg"
        category="End-To-End Execution"
        ctaText="Start Your Project"
        onCtaClick={() => onOpenBooking('consultation')}
      />

      {/* INTRO — EDITORIAL SPLIT */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 border-b border-ivory-400/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <RevealOnScroll className="space-y-6">
            <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
              The Turnkey Approach
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50 leading-tight">
              Single-Contract <span className="text-gradient-gold font-medium">Project Governance</span>
            </h2>
            <p className="font-body text-ivory-400 text-sm sm:text-base font-light leading-relaxed">
              Building a property usually means coordinating designers, contractors, and vendors separately. With a turnkey
              engagement, LOKAH Builders assumes total ownership of planning, construction, and handover under a single contract.
            </p>
            <div className="space-y-3 pt-2">
              {[
                'Single entity responsible for the full build',
                'Clear communication from planning through handover',
                'Coordinated scheduling across every phase',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-ivory-300 text-sm font-light">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15} className="relative">
            <div className="glass-card p-10 border border-gold-500/20 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl text-ivory-50 font-medium">Why Clients Choose Turnkey</h3>
              <p className="font-body text-ivory-400 text-sm leading-relaxed font-light">
                When one team carries the project from start to finish, decisions move faster and responsibility remains clear. It is a disciplined, structured way to build.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* INTERACTIVE STAGE WALKTHROUGH */}
      <section className="py-28 bg-matte-950 border-b border-ivory-400/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
              How It Unfolds
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              From Inquiry <span className="text-gradient-gold font-medium">to Handover</span>
            </h2>
            <p className="font-body text-ivory-400 text-sm max-w-xl mx-auto font-light">
              The five operational phases of our turnkey delivery framework.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {pipelineSteps.map((step, idx) => (
              <button
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`px-5 py-3 rounded-xl font-body text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeStep === idx
                    ? 'bg-gradient-gold text-matte-black shadow-gold scale-105'
                    : 'bg-charcoal-900/60 border border-ivory-400/10 text-ivory-350 hover:text-ivory-50 hover:border-gold-500/30'
                }`}
              >
                <span>{step.num}</span>
                <span>{step.title}</span>
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto glass-card p-8 sm:p-12 border border-gold-500/25 relative overflow-hidden">
            <div className="absolute top-4 right-6 font-display text-7xl font-extrabold text-gold-450/5 pointer-events-none select-none">
              {pipelineSteps[activeStep].num}
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-450 shrink-0">
                {(() => {
                  const StepIcon = pipelineSteps[activeStep].icon;
                  return <StepIcon className="w-8 h-8" />;
                })()}
              </div>

              <div className="space-y-4">
                <span className="font-body text-xs uppercase tracking-widest text-champagne-400 font-semibold block">
                  Stage {pipelineSteps[activeStep].num}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-light text-ivory-50">
                  {pipelineSteps[activeStep].title}
                </h3>
                <p className="font-body text-ivory-300 text-sm sm:text-base leading-relaxed font-light">
                  {pipelineSteps[activeStep].desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURAL PHILOSOPHY QUOTE BLOCK */}
      <section className="py-16 bg-matte-black border-b border-ivory-400/10">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <div className="w-12 h-px bg-gold-500/40 mx-auto" />
          <blockquote className="font-display text-xl sm:text-2xl font-light text-ivory-100 italic leading-relaxed">
            &ldquo;When a single entity holds structural, financial, and municipal responsibility, project delays and budget scope creep are eliminated.&rdquo;
          </blockquote>
          <div className="w-12 h-px bg-gold-500/40 mx-auto" />
        </div>
      </section>

      {/* COMPARISON MATRIX */}
      <section className="py-28 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
            Model Comparison
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            Turnkey <span className="text-gradient-gold font-medium">vs. Multi-Vendor</span>
          </h2>
          <p className="font-body text-ivory-400 text-xs sm:text-sm block sm:hidden pt-2 italic">
            Swipe horizontally to compare models &rarr;
          </p>
        </div>

        <div className="relative overflow-x-auto after:pointer-events-none after:absolute after:top-0 after:right-0 after:bottom-0 after:w-8 after:bg-gradient-to-l after:from-matte-black after:to-transparent sm:after:hidden">
          <table className="w-full text-left border-collapse font-body text-xs sm:text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gold-500/20 text-gold-450 uppercase tracking-widest text-[11px]">
                <th className="py-5 px-6">Evaluation Criteria</th>
                <th className="py-5 px-6 bg-gold-500/10 border-x border-gold-500/20 text-gold-400">LOKAH Turnkey Model</th>
                <th className="py-5 px-6 text-ivory-400">Traditional Multi-Vendor Model</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="border-b border-ivory-400/10 hover:bg-white/5 transition-all">
                  <td className="py-5 px-6 font-semibold text-ivory-100">{row.feature}</td>
                  <td className="py-5 px-6 bg-gold-500/5 border-x border-gold-500/15 text-ivory-100 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                      <span>{row.turnkey}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-ivory-400 font-light">
                    <div className="flex items-center gap-2 opacity-75">
                      <XCircle className="w-4 h-4 text-red-400/80 shrink-0" />
                      <span>{row.traditional}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* RELATED NAVIGATION LINKS */}
      <section className="py-16 bg-matte-black border-t border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <span className="font-body text-champagne-400 text-xs tracking-widest uppercase font-semibold block">
            Explore Related Capabilities
          </span>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services/residential-projects" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Residential Construction
            </Link>
            <Link to="/services/project-planning" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Project Planning
            </Link>
            <Link to="/services/interior-exterior" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Interior &amp; Exterior Finishes
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Start Building?"
        description="Share your plot parameters and project goals for a structured turnkey evaluation."
        onOpenBooking={onOpenBooking}
      />
    </motion.div>
  );
}
