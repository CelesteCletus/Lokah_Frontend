import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Building2, 
  Store, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  Flame, 
  Wind, 
  Check, 
  Briefcase
} from 'lucide-react';
import FullScreenHero from '../../components/FullScreenHero';
import RevealOnScroll from '../../components/RevealOnScroll';
import CTASection from '../../components/CTASection';
import PropertyCard from '../../components/PropertyCard';
import type { LayoutContextType } from '../../layouts/RootLayout';

export default function CommercialProjects() {
  const { onOpenBooking, properties, handlePropertyClick } = useOutletContext<LayoutContextType>();
  const commercial = properties.filter((p) => p.type === 'Commercial');
  const [activeAssetTab, setActiveAssetTab] = useState('office');

  const assetTypes = [
    {
      id: 'office',
      label: 'Corporate Office Towers',
      icon: Building2,
      desc: 'High-density corporate headquarters engineered for productivity, flexible floorplates, high-speed elevator shafts, and sound isolation.',
      features: ['Flexible column-free floorplates', 'VRV / HVAC central climate zones', 'High-speed passenger & service lifts', 'Acoustic glass facades']
    },
    {
      id: 'retail',
      label: 'Retail & Experience Hubs',
      icon: Store,
      desc: 'High-visibility retail centers featuring double-height display storefronts, foot-traffic optimized corridors, and heavy floor loading capacity.',
      features: ['High double-height storefront glass', 'High foot-traffic structural floor loads', 'Dedicated loading bays & logistics docks', 'Architectural facade display lighting']
    },
    {
      id: 'tech',
      label: 'Tech Parks & R&D Hubs',
      icon: Cpu,
      desc: 'Mission-critical infrastructure with dual-grid power backup, server room cooling insulation, fiber trunking, and access control.',
      features: ['100% Dual-generator power redundancy', 'Dedicated server room thermal insulation', 'Tier-III IT fiber conduit backbones', 'Biometric & RFID perimeter security']
    },
    {
      id: 'mixed',
      label: 'Mixed-Use Developments',
      icon: Layers,
      desc: 'Integrated urban structures combining ground-level retail, middle-tier corporate suites, and top-tier hospitality or executive suites.',
      features: ['Integrated pedestrian & vehicle flow', 'Multi-level basement parking management', 'Zoned acoustics & privacy separation', 'Unified facility management infrastructure']
    }
  ];

  const complianceStandards = [
    {
      title: 'Municipal & Zoning Approvals',
      desc: 'Complete handling of KBR, local corporation permits, FAR/FSI optimization, and height NOC clearances.',
      icon: ShieldCheck
    },
    {
      title: 'Fire & Life Safety Compliance',
      desc: 'Sprinkler networks, pressurized stairwells, smoke evacuation, and Fire Department NOC certifications.',
      icon: Flame
    },
    {
      title: 'HVAC & Climate Systems',
      desc: 'Energy-efficient VRV/VRF central cooling, fresh air ventilation, and IAQ air filtration systems.',
      icon: Wind
    },
    {
      title: 'Structural Seismic Rating',
      desc: 'Seismic Zone III certified RCC frame designs with wind load analysis for high-rise commercial structures.',
      icon: Layers
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
        title="Commercial Projects"
        subtitle="Engineering corporate headquarters, retail hubs, and tech parks built for scalability, compliance, and enterprise growth."
        imageSrc="/images/services/commercial.jpg"
        category="Enterprise Infrastructure"
        ctaText="Discuss Commercial Project"
        onCtaClick={() => onOpenBooking('consultation')}
      />

      {/* VALUE PILLARS FOR ENTERPRISES */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 border-b border-ivory-400/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
            Commercial Built Value
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            Infrastructure Built for <span className="text-gradient-gold font-medium">Business</span>
          </h2>
          <p className="font-body text-ivory-400 text-sm sm:text-base font-light leading-relaxed">
            We deliver commercial assets that balance operational efficiency, structural longevity, and corporate presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <RevealOnScroll className="glass-card p-8 border border-gold-500/15 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-ivory-50 font-medium">Occupancy Efficiency</h3>
            <p className="font-body text-ivory-400 text-xs sm:text-sm font-light leading-relaxed">
              Floorplate planning maximizing usable carpet area, flexible seating configurations, and efficient utility cores.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="glass-card p-8 border border-gold-500/15 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-ivory-50 font-medium">Statutory Integrity</h3>
            <p className="font-body text-ivory-400 text-xs sm:text-sm font-light leading-relaxed">
              Compliance with corporation building bylaws, Fire NOCs, pollution clearances, and occupancy certificates.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2} className="glass-card p-8 border border-gold-500/15 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-ivory-50 font-medium">Corporate Stature</h3>
            <p className="font-body text-ivory-400 text-xs sm:text-sm font-light leading-relaxed">
              Glass curtain wall facades and double-height entrance lobbies that communicate enterprise stability.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* COMMERCIAL ASSET TYPES SELECTOR (TABS) */}
      <section className="py-28 bg-matte-950 border-b border-ivory-400/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
              Commercial Portfolio Categories
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              Commercial Asset <span className="text-gradient-gold font-medium">Types</span>
            </h2>
            <p className="font-body text-ivory-400 text-sm max-w-xl mx-auto font-light">
              Engineering focus structured for specific enterprise sectors.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {assetTypes.map((asset) => {
              const TabIcon = asset.icon;
              return (
                <button
                  key={asset.id}
                  onClick={() => setActiveAssetTab(asset.id)}
                  className={`px-6 py-3 rounded-xl font-body text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2.5 cursor-pointer ${
                    activeAssetTab === asset.id
                      ? 'bg-gradient-gold text-matte-black shadow-gold scale-105'
                      : 'bg-charcoal-900/60 border border-ivory-400/10 text-ivory-350 hover:text-ivory-50 hover:border-gold-500/30'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{asset.label}</span>
                </button>
              );
            })}
          </div>

          {(() => {
            const currentAsset = assetTypes.find(a => a.id === activeAssetTab) || assetTypes[0];
            const Icon = currentAsset.icon;
            return (
              <div className="max-w-4xl mx-auto glass-card p-8 sm:p-12 border border-gold-500/25">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-450 shrink-0">
                    <Icon className="w-8 h-8" />
                  </div>

                  <div className="space-y-6 flex-grow">
                    <div className="space-y-2">
                      <span className="font-body text-xs uppercase tracking-widest text-champagne-400 font-semibold block">
                        Commercial Engineering Focus
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-light text-ivory-50">
                        {currentAsset.label}
                      </h3>
                    </div>

                    <p className="font-body text-ivory-300 text-sm sm:text-base leading-relaxed font-light">
                      {currentAsset.desc}
                    </p>

                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <h4 className="font-body text-xs uppercase tracking-wider text-gold-450 font-semibold">
                        Key Structural Specifications:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentAsset.features.map((feat) => (
                          <div key={feat} className="flex items-center gap-2 text-ivory-300 text-xs sm:text-sm font-light">
                            <Check className="w-4 h-4 text-gold-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* COMMERCIAL PERFORMANCE METRICS BAR */}
      <section className="py-16 bg-matte-black border-b border-ivory-400/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center border border-gold-500/20 rounded-2xl p-8 bg-gold-500/5">
            <div className="space-y-2 border-b md:border-b-0 md:border-r border-gold-500/15 pb-6 md:pb-0">
              <span className="font-display text-2xl sm:text-3xl text-gradient-gold font-light">Planned</span>
              <p className="font-body text-ivory-350 text-xs uppercase tracking-widest font-medium">Coordinated Milestone Execution</p>
            </div>
            <div className="space-y-2 border-b md:border-b-0 md:border-r border-gold-500/15 pb-6 md:pb-0">
              <span className="font-display text-2xl sm:text-3xl text-gradient-gold font-light">Safety</span>
              <p className="font-body text-ivory-350 text-xs uppercase tracking-widest font-medium">Site Safety & Compliance Focus</p>
            </div>
            <div className="space-y-2">
              <span className="font-display text-2xl sm:text-3xl text-gradient-gold font-light">Durable</span>
              <p className="font-body text-ivory-350 text-xs uppercase tracking-widest font-medium">Built For Long-Term Performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* ENGINEERING & COMPLIANCE MATRIX */}
      <section className="py-28 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
            Quality &amp; Standards
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
            Statutory &amp; <span className="text-gradient-gold font-medium">Municipal Integrity</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {complianceStandards.map((item) => {
            const CompIcon = item.icon;
            return (
              <RevealOnScroll key={item.title} className="glass-card p-8 border border-gold-500/15 flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450 shrink-0">
                  <CompIcon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl text-ivory-50 font-medium">{item.title}</h3>
                  <p className="font-body text-ivory-400 text-xs sm:text-sm leading-relaxed font-light">{item.desc}</p>
                </div>
              </RevealOnScroll>
            );
          })}
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
            <Link to="/services/property-development" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Property Development JV
            </Link>
            <Link to="/services/project-planning" className="px-6 py-3 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-300 hover:text-champagne-400 text-xs font-body font-medium transition-all">
              Project Planning &amp; BOQs
            </Link>
          </div>
        </div>
      </section>

      {/* COMMERCIAL SHOWCASE GRID */}
      {commercial.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-ivory-400/10">
          <div className="text-center mb-16 space-y-3">
            <span className="font-body text-champagne-400 text-xs tracking-[0.2em] uppercase font-semibold block">
              Enterprise Portfolio
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              Commercial Landmarks <span className="text-gradient-gold font-medium">&amp; Retail Hubs</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {commercial.slice(0, 3).map((project, index) => (
              <PropertyCard
                key={project.id}
                property={project}
                index={index}
                onClick={() => handlePropertyClick(project)}
              />
            ))}
          </div>
        </section>
      )}

      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
