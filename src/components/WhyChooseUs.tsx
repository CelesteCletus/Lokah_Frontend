import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Building2, Sparkles, ShieldCheck, Headset } from 'lucide-react';

const features = [
  {
    icon: Building2,
    title: 'Experienced Engineering Team',
    description: 'Projects planned and coordinated with dedicated focus on structural quality and craftsmanship.',
  },
  {
    icon: Sparkles,
    title: 'Architectural Layout Planning',
    description: 'Thoughtfully designed spaces that balance functionality, aesthetics, and everyday living.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality-Focused Execution',
    description: 'Equipped with systematic processes and material standards tailored to project requirements.',
  },
  {
    icon: Headset,
    title: 'Dedicated Project Coordination',
    description: 'Clear, responsive communication and regular updates throughout every stage of construction.',
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden bg-matte-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-body text-champagne-400 text-sm tracking-widest uppercase mb-4 block">
            Why Choose Us
          </span>
          <h2 className="section-heading mb-4">
            Why Choose <span className="text-gradient-gold">Lokah</span>
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card-hover p-8 h-full">
                <div className="w-14 h-14 flex items-center justify-center bg-champagne-500/10 rounded-xl border border-champagne-500/20 mb-6 group-hover:bg-champagne-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-champagne-400" />
                </div>
                <h3 className="font-display text-xl text-ivory-50 mb-3">{feature.title}</h3>
                <p className="font-body text-ivory-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
