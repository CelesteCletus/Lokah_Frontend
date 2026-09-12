import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import WhyChooseUs from '../../components/WhyChooseUs';
import Team from '../../components/Team';
import BrandsWeUse from '../../components/BrandsWeUse';
import Process from '../../components/Process';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';
import { ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';

export default function AboutCompany() {
  const { onOpenBooking } = useOutletContext<LayoutContextType>();

  const corePhilosophy = [
    {
      title: 'Thoughtful Planning',
      desc: 'Architectural designs optimized for spatial efficiency, natural ventilation, lighting vectors, and site ergonomics.',
      icon: Compass,
    },
    {
      title: 'Quality & Reliability',
      desc: 'Rigorous structural engineering standards, premium material curation, and systematic quality assurance checks.',
      icon: ShieldCheck,
    },
    {
      title: 'Transparent Execution',
      desc: 'Clear communication, defined milestones, and dependable project execution build lasting trust with every homeowner.',
      icon: CheckCircle2,
    },
  ];

  // Real 5-stage process from the Lokah Builders company profile (no fabricated dates)
  const milestones = [
    { year: '01', title: 'Understand', desc: 'Project goals, requirements and context.' },
    { year: '02', title: 'Plan', desc: 'Scope, design direction and project strategy.' },
    { year: '03', title: 'Design', desc: 'Architecture, materials and spatial solutions.' },
    { year: '04', title: 'Execute', desc: 'Coordinated project implementation.' },
    { year: '05', title: 'Deliver', desc: 'Final detailing and project completion.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      <FullScreenHero
        title="About Lokah Builders"
        subtitle="Crafting premium living spaces and architectural landmarks across Kerala."
        imageSrc="/images/explore/about-hero.jpg"
        category="Our Legacy"
        ctaText="Build With LOKAH"
        onCtaClick={onOpenBooking}
      />

      {/* Story Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <RevealOnScroll className="space-y-6">
            <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-widest uppercase font-semibold">
              Corporate Overview
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50 tracking-wide">
              Building With <span className="text-gradient-gold font-medium">Purpose</span>
            </h2>
            <p className="font-body text-ivory-300 text-sm leading-relaxed font-light">
              Lokah Builders &amp; Developers Pvt Ltd is a leading building service provider offering a wide range of services across construction, renovation, interiors, and maintenance, using cutting-edge machinery and progressive techniques delivered at a fair price.
            </p>
            <p className="font-body text-ivory-300 text-sm leading-relaxed font-light">
              Our work is guided by a commitment to thoughtful planning, disciplined engineering, and customer satisfaction. By maintaining transparent communication and reliable execution, we ensure every build serves as an enduring asset for generations.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2} className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-gold-500/10 shadow-2xl">
            <img
              src="/images/corporate view/corporate view.png"
              alt="Lokah Builders corporate view"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </RevealOnScroll>
        </div>
      </section>

      {/* Core Philosophy Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-widest uppercase font-semibold block mb-3">
            Company Philosophy
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            Principles of <span className="text-gradient-gold font-medium">Our Practice</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {corePhilosophy.map((v, idx) => (
            <RevealOnScroll
              key={v.title}
              delay={idx * 0.1}
              className="glass-card p-8 border border-gold-500/10 flex flex-col items-center text-center space-y-4 hover:border-gold-500/20 transition-all duration-350"
            >
              <div className="w-14 h-14 rounded-full bg-gold-500/5 border border-gold-500/15 flex items-center justify-center text-gold-400">
                <v.icon className="w-7 h-7" />
              </div>
              <h4 className="font-display text-lg text-ivory-50 font-medium">{v.title}</h4>
              <p className="font-body text-ivory-300 text-xs sm:text-sm leading-relaxed font-light">{v.desc}</p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Why Choose Us & Process (Reused) */}
      <WhyChooseUs />
      <Process />

      {/* Milestones timeline */}
      <section className="py-24 bg-matte-950 border-t border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-widest uppercase font-semibold block mb-3">
              Our Process
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              Clarity At <span className="text-gradient-gold font-medium">Every Stage</span>
            </h2>
          </div>

          <div className="relative border-l border-gold-500/20 max-w-3xl mx-auto pl-8 space-y-12 py-4">
            {milestones.map((m, idx) => (
              <RevealOnScroll
                key={m.year}
                delay={idx * 0.1}
                className="relative"
              >
                <div className="absolute -left-12 top-1 w-8 h-8 rounded-full bg-matte-black border-2 border-gold-500 flex items-center justify-center text-gold-400 font-accent text-xs">
                  {idx + 1}
                </div>
                <div className="space-y-2">
                  <span className="font-accent text-gold-400 text-lg font-bold">{m.year}</span>
                  <h4 className="font-display text-lg text-ivory-50">{m.title}</h4>
                  <p className="font-body text-ivory-300 text-xs sm:text-sm leading-relaxed font-light">{m.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* People Behind Lokah */}
      <Team />

      {/* NEW SECTION: Brands We Use directly below People Behind Lokah */}
      <BrandsWeUse />

      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
