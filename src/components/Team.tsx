import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';
import { staffMembers } from '../data/teamData';

export default function Team() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-matte-950">
      {/* Background Gradients */}
      <div className="absolute inset-0 select-none pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-charcoal-900/40 via-matte-950 to-matte-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-body text-gold-400 text-xs sm:text-sm tracking-widest uppercase font-semibold block mb-3"
          >
            THE PEOPLE BEHIND OUR WORK
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-50 tracking-wide mb-6"
          >
            Our <span className="text-gradient-gold font-medium">Team</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body text-ivory-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-light"
          >
            Meet the people whose experience, expertise, and commitment help shape every project and drive our work forward.
          </motion.p>
        </div>

        {/* Staff Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {staffMembers.map((member, index) => (
            <RevealOnScroll
              key={member.id}
              delay={index * 0.1}
              className="glass-card rounded-2xl overflow-hidden border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500 group flex flex-col"
            >
              {/* Photo Area */}
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

              {/* Staff Details (Name, Designation & Subtitle) */}
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
      </div>
    </section>
  );
}
