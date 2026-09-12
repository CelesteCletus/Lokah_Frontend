import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  FileText, 
  Calculator,
  Compass,
  FileCheck2
} from 'lucide-react';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';

export default function Consultancy() {
  const { onOpenBooking } = useOutletContext<LayoutContextType>();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const pillars = [
    { title: 'Site & Structural Assessments', desc: 'A practical, independent review of a site or existing structure before committing capital.', icon: Activity },
    { title: 'Cost & Scope Review', desc: 'An unbiased look at proposed costs and scope to evaluate contractual parameters.', icon: Calculator },
    { title: 'Planning & Approvals Guidance', desc: 'Professional guidance navigating municipal planning and approval requirements.', icon: FileText },
    { title: 'Layout & Orientation Guidance', desc: 'Architectural advice on layout choices supporting natural light, ventilation, and circulation.', icon: Compass },
  ];

  const reportIndex = [
    { code: 'DOC-STR-01', title: 'Structural Health & Integrity Audit' },
    { code: 'DOC-BOQ-02', title: 'Line-Item Scope & Pricing Audit' },
    { code: 'DOC-ZON-03', title: 'Municipal Permitting & FAR Review' },
    { code: 'DOC-RSK-04', title: 'Contractor Scope & Liability Matrix' },
    { code: 'DOC-MAT-05', title: 'Material Specification & Quality Verification' },
    { code: 'DOC-ENV-06', title: 'Site Orientation & Climate Efficiency Report' }
  ];

  const faqs = [
    {
      q: 'When should I bring LOKAH in as a consultant?',
      a: 'Ideally before signing contractor agreements or finalising drawings. Early guidance prevents scope rework later.'
    },
    {
      q: 'Can LOKAH review a project built by another company?',
      a: 'Yes. We provide an independent audit of ongoing projects managed by external contractors.'
    },
    {
      q: 'What does a cost and scope review involve?',
      a: 'We audit line-item quantities and current material rates against market benchmarks to verify pricing accuracy and eliminate scope overlap.'
    },
    {
      q: 'How is consultancy engaged?',
      a: 'Engagements are scoped based on required deliverables — a one-time audit or ongoing advisory support.'
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
        title="Consultancy"
        subtitle="Independent, practical guidance before you build, buy, or commit — grounding decisions in verified data."
        imageSrc="/images/services/consultancy.jpg"
        category="Expert Guidance"
        ctaText="Speak With Our Experts"
        onCtaClick={() => onOpenBooking('consultation')}
      />

      {/* CORE ADVISORY PILLARS */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 border-b border-ivory-400/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
            Independent Guidance
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            Clarity <span className="text-gradient-gold font-medium">Before Commitment</span>
          </h2>
          <p className="font-body text-ivory-400 text-sm sm:text-base font-light leading-relaxed">
            Whether planning a build or reviewing ongoing work, independent technical audits ensure informed decision-making.
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

      {/* ENGINEERING REPORT INDEX */}
      <section className="py-28 bg-matte-950 border-b border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
              Audit Deliverables
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              Audit Documentation &amp; <span className="text-gradient-gold font-medium">Reports</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto glass-card p-8 sm:p-10 border border-gold-500/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportIndex.map((item) => (
                <div key={item.code} className="flex items-center gap-4 p-4 rounded-xl bg-charcoal-900/40 border border-gold-500/10 hover:border-gold-500/30 transition-colors">
                  <FileCheck2 className="w-5 h-5 text-gold-400 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] text-champagne-400 font-semibold block">{item.code}</span>
                    <span className="font-body text-ivory-200 text-xs sm:text-sm font-light block">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ADVISORY FAQ ACCORDION */}
      <section className="py-28 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
            Common Questions
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            Advisory <span className="text-gradient-gold font-medium">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card border border-gold-500/15 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <span className="font-display text-lg text-ivory-50 font-medium">{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-gold-450 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-ivory-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 pt-2 font-body text-ivory-350 text-sm leading-relaxed font-light border-t border-white/5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* RELATED NAVIGATION LINKS */}
      <section className="py-16 bg-matte-black border-t border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <span className="font-body text-champagne-400 text-xs tracking-widest uppercase font-semibold block">
            Explore Related Services
          </span>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services/project-planning" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Project Planning
            </Link>
            <Link to="/services/turnkey-projects" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Turnkey Projects
            </Link>
            <Link to="/services/property-development" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Property Development
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Have Questions Before You Commit?"
        description="Consult with our technical audit team before finalizing contracts or land purchases."
        onOpenBooking={onOpenBooking}
      />
    </motion.div>
  );
}
