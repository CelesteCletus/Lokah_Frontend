import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageSquare, Search, MapPinned, FileCheck, KeyRound } from 'lucide-react';

const steps = [
  {
    title: 'Consultation',
    description: 'Share your lifestyle, budget, preferred location, and investment goals with our property consultants.',
    icon: MessageSquare,
  },
  {
    title: 'Property Selection',
    description: 'We shortlist residences and plots that match your requirements from the Lokah Builders portfolio.',
    icon: Search,
  },
  {
    title: 'Site Visit',
    description: 'Experience the project in person with a guided visit arranged around your schedule.',
    icon: MapPinned,
  },
  {
    title: 'Documentation',
    description: 'Our team supports the booking, documentation, and financing coordination with clarity and care.',
    icon: FileCheck,
  },
  {
    title: 'Handover',
    description: 'Receive your property with a smooth handover experience and continued relationship support.',
    icon: KeyRound,
  },
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden bg-matte-black">
      <div className="absolute inset-0 opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 25%, rgba(212,175,55,0.10) 0%, transparent 35%), radial-gradient(circle at 85% 70%, rgba(212,175,55,0.08) 0%, transparent 35%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-body text-champagne-400 text-sm tracking-widest uppercase mb-4 block">
            Our Process
          </span>
          <h2 className="section-heading mb-5">
            From First Enquiry to <span className="text-gradient-gold">Final Handover</span>
          </h2>
          <p className="font-body text-ivory-400 max-w-2xl mx-auto leading-relaxed">
            A premium property journey should feel clear, guided, and effortless at every stage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: index * 0.08 }}
                className="relative glass-card-hover p-6 md:p-7 min-h-[250px]"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-champagne-500/10 border border-champagne-400/20 flex items-center justify-center text-champagne-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-accent text-champagne-400/50 text-sm tracking-widest">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-display text-xl text-ivory-50 mb-3 tracking-wide">{step.title}</h3>
                <p className="font-body text-ivory-400 text-sm leading-relaxed">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-2.5 w-5 h-px bg-gradient-to-r from-champagne-400/40 to-transparent z-10" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
