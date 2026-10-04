import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';

export default function OrganisationChart() {
  const { onOpenBooking } = useOutletContext<LayoutContextType>();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      <FullScreenHero
        title="Corporate Hierarchy"
        subtitle="Our structured leadership matrix guarantees meticulous execution, absolute transparency, and luxury construction standards."
        imageSrc="/images/explore/about-hero.jpg"
        category="Operational Blueprint"
        ctaText="Request Team Consultation"
        onCtaClick={onOpenBooking}
      />

      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Organization Chart Image - smaller on the left (5 cols of 12) */}
          <RevealOnScroll className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl bg-charcoal-900/40 p-4">
            <img
              src="/images/organization_chart/organization_chart.png"
              alt="LOKAH Builders Organization Chart"
              className="w-full h-auto object-contain rounded-xl"
            />
          </RevealOnScroll>

          {/* Descriptive leadership text beside the image (7 cols of 12) */}
          <RevealOnScroll delay={0.2} className="lg:col-span-7 space-y-6">
            <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-widest uppercase font-semibold">
              Corporate Governance
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50 tracking-wide">
              Our Structured <span className="text-gradient-gold font-medium">Leadership Matrix</span>
            </h2>
            
            <p className="font-body text-ivory-300 text-sm sm:text-base leading-relaxed font-light">
              LOKAH Builders &amp; Developers operates under a highly organized and integrated corporate governance structure. From our visionary Board of Directors to our key execution divisions (Engineering, Architecture, Legal Liaisoning, and Client Relations), every department functions in sync. This structured accountability ensures that every turnkey build and joint-venture project is delivered with compromise-free structural quality, tropical design accuracy, and absolute RERA compliance.
            </p>
            
            <p className="font-body text-ivory-300 text-sm sm:text-base leading-relaxed font-light">
              By consolidating legal permits, architectural blueprints, civil construction, and interior styling under a single unified leadership pipeline, we eliminate structural gaps and client management overhead. Our dedicated team and site supervisors adhere to rigorous daily quality checks, delivering architectural landmarks across Kerala that stand as a testament to operational excellence and client trust.
            </p>
          </RevealOnScroll>

        </div>
      </section>

      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
