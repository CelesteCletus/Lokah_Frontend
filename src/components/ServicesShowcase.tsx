import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Construction, Home, Building2, Paintbrush, PaintBucket,
  Hammer, Landmark, Compass, CalendarRange,
} from 'lucide-react';

const homeServices = [
  { title: 'Turnkey Projects', path: '/services/turnkey-projects', icon: Construction, desc: 'The entire construction or remodeling is done by us from start to finish.' },
  { title: 'Residential Projects', path: '/services/residential-projects', icon: Home, desc: 'Amazing interiors reflecting your ideas in any theme and style.' },
  { title: 'Commercial Projects', path: '/services/commercial-projects', icon: Building2, desc: 'Commercial environments as a strategic tool to achieve organizational goals.' },
  { title: 'Interior Designing', path: '/services/interior-exterior', icon: Paintbrush, desc: 'Highly innovative designing to suit clients\u2019 needs and meet expectations.' },
  { title: 'Exterior Designing', path: '/services/interior-exterior', icon: PaintBucket, desc: 'Unique design services specialising in residential & commercial exterior.' },
  { title: 'Remodelling', path: '/services/remodelling', icon: Hammer, desc: 'We offer proficient remodelling and extension services.' },
  { title: 'Property Development', path: '/services/property-development', icon: Landmark, desc: 'We ensure progressive techniques in executing projects.' },
  { title: 'Consultancy', path: '/services/consultancy', icon: Compass, desc: 'We provide value driven solutions based on client requirements.' },
  { title: 'Project Planning', path: '/services/project-planning', icon: CalendarRange, desc: 'Projects with sophisticated integration of sustainable design measures.' },
];

export default function ServicesShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden bg-gradient-dark">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-body text-champagne-400 text-sm tracking-widest uppercase mb-4 block">
            What We Do
          </span>
          <h2 className="section-heading">
            Our <span className="text-gradient-gold">Services</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {homeServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => navigate(service.path)}
                className="glass-card-hover p-8 cursor-pointer group"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-champagne-500/10 rounded-xl border border-champagne-500/20 mb-6 group-hover:bg-champagne-500/20 group-hover:border-champagne-500/40 transition-all duration-300">
                  <Icon className="w-6 h-6 text-champagne-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-display text-xl text-ivory-50 mb-3 group-hover:text-champagne-400 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="font-body text-ivory-400 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
