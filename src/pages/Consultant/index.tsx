import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { User } from 'lucide-react';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';
import { staffMembers } from '../../data/teamData';

export default function Consultant() {
  const { onOpenBooking } = useOutletContext<LayoutContextType>();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      <FullScreenHero
        title="Our Team"
        subtitle="Meet the people whose experience, expertise, and commitment help shape every project and drive our work forward."
        imageSrc="/images/explore/about-hero.jpg"
        category="THE PEOPLE BEHIND OUR WORK"
        ctaText="Connect With Us"
        onCtaClick={onOpenBooking}
      />

      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-widest uppercase font-semibold block mb-3">
            THE PEOPLE BEHIND OUR WORK
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50 tracking-wide mb-6">
            Our <span className="text-gradient-gold font-medium">Team</span>
          </h2>
          <p className="font-body text-ivory-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-light">
            Meet the people whose experience, expertise, and commitment help shape every project and drive our work forward.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {staffMembers.map((member, index) => (
            <RevealOnScroll
              key={member.id}
              delay={index * 0.1}
              className="glass-card rounded-2xl overflow-hidden border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500 group flex flex-col"
            >
              {/* Professional Photograph */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal-900">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-charcoal-900 via-charcoal-950 to-matte-950 p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400/60 mb-3 group-hover:text-gold-400 group-hover:border-gold-500/40 transition-colors">
                      <User className="w-8 h-8" />
                    </div>
                    <span className="font-body text-[10px] text-ivory-400/60 uppercase tracking-widest font-medium">
                      To Be Announced
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-matte-950 via-matte-950/20 to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Full Name & Job Designation */}
              <div className="p-6 bg-matte-900/60 flex-grow flex flex-col justify-end border-t border-white/5">
                <h3 className="font-display text-lg md:text-xl text-ivory-50 font-medium tracking-wide group-hover:text-gold-400 transition-colors">
                  {member.name}
                </h3>
                <p className="font-body text-champagne-400 text-xs tracking-wider uppercase font-medium mt-1">
                  {member.designation}
                </p>
                {member.subTitle && (
                  <p className="font-body text-ivory-400 text-xs font-light mt-0.5">
                    {member.subTitle}
                  </p>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
