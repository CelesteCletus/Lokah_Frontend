import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import ContactMarquee from './ContactMarquee';
import {
  Menu, X, ChevronDown,
  Building2, FileDown, Network, UserCheck, FileCheck2,
  LayoutGrid, Key, Home as HomeIcon, Paintbrush, Hammer,
  LandPlot, MessageSquare, ClipboardList,
  Construction, CheckCircle2, Milestone,
} from 'lucide-react';

interface NavbarProps {
  activeSection?: string;
  onNavigate?: (section: string) => void;
  onOpenConcierge?: () => void;
  onOpenBooking?: () => void;
}

// A soft "ease-out" curve — this is what makes motion feel expensive
// instead of mechanical. Used everywhere instead of the default linear ease.
const LUXE_EASE = [0.16, 1, 0.3, 1] as const;

interface DropdownItem {
  label: string;
  path: string;
  icon: any;
  group?: string;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const navStructure = [
    { label: 'Home', path: '/' },
    {
      label: 'Explore Us',
      dropdown: [
        { label: 'About Company', path: '/explore-us/about-company', icon: Building2 },
        { label: 'Construction Standards', path: '/explore-us/construction-standards', icon: FileCheck2 },
        { label: 'Download Brochure', path: '/explore-us/brochure', icon: FileDown },
        { label: 'Organisation Chart', path: '/explore-us/organisation-chart', icon: Network },
        { label: 'Our Team', path: '/explore-us/our-team', icon: UserCheck },
      ] as DropdownItem[],
    },
    {
      label: 'What We Do',
      dropdown: [
        { label: 'View All Services', path: '/services', icon: LayoutGrid, group: 'Overview' },
        { label: 'Turnkey Projects', path: '/services/turnkey-projects', icon: Key, group: 'Core Services' },
        { label: 'Residential Projects', path: '/services/residential-projects', icon: HomeIcon, group: 'Core Services' },
        { label: 'Commercial Projects', path: '/services/commercial-projects', icon: Building2, group: 'Core Services' },
        { label: 'Interior & Exterior', path: '/services/interior-exterior', icon: Paintbrush, group: 'Design & Growth' },
        { label: 'Remodelling', path: '/services/remodelling', icon: Hammer, group: 'Design & Growth' },
        { label: 'Property Development', path: '/services/property-development', icon: LandPlot, group: 'Design & Growth' },
        { label: 'Consultancy', path: '/services/consultancy', icon: MessageSquare, group: 'Design & Growth' },
        { label: 'Project Planning', path: '/services/project-planning', icon: ClipboardList, group: 'Design & Growth' },
      ] as DropdownItem[],
    },
    {
      label: 'Our Projects',
      dropdown: [
        { label: 'Ongoing Projects', path: '/projects/ongoing', icon: Construction },
        { label: 'Completed Projects', path: '/projects/completed', icon: CheckCircle2 },
      ] as DropdownItem[],
    },
    { label: 'Blog', path: '/blog' },
    { label: 'Careers', path: '/careers' },
    { label: 'Reach Us', path: '/reach-us' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: LUXE_EASE }}
      style={{ willChange: 'transform' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || mobileMenuOpen
          ? 'bg-matte-black/85 backdrop-blur-xl border-b border-ivory-400/10'
          : 'bg-black/10 backdrop-blur-lg border-b border-white/5'
      }`}
    >
      <ContactMarquee />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 relative ${
          scrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-20'
        }`}>

          {/* Logo — prominent, elegant branding */}
          <Link to="/" className="flex items-center group py-0.5" aria-label="Lokah Builders Home">
            <motion.img
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4, ease: LUXE_EASE }}
              src="/logo.png"
              alt="Lokah Builders & Developers - Villas & Apartments"
              className={`w-auto object-contain transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                scrolled
                  ? 'h-[46px] sm:h-[54px] lg:h-[60px] max-w-[200px] lg:max-w-[280px]'
                  : 'h-[58px] sm:h-[70px] lg:h-[78px] max-w-[260px] lg:max-w-[380px]'
              }`}
            />
          </Link>

          {/* Desktop Right Navigation + CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              {navStructure.map((item) => {
                if (item.dropdown) {
                  const isDropdownActive = item.dropdown.some(sub => location.pathname === sub.path);

                  // Group sub-items by their optional "group" label so related
                  // items (e.g. "Core Services" vs "Design & Growth") sit together.
                  const groups: { label: string | null; items: typeof item.dropdown }[] = [];
                  item.dropdown.forEach((sub) => {
                    const groupLabel = sub.group ?? null;
                    const last = groups[groups.length - 1];
                    if (last && last.label === groupLabel) {
                      last.items.push(sub);
                    } else {
                      groups.push({ label: groupLabel, items: [sub] });
                    }
                  });

                  return (
                    <div
                      key={item.label}
                      className="relative py-2 group/nav"
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        type="button"
                        className={`relative flex items-center gap-1 px-2.5 py-2 font-body text-sm font-medium transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-luxury ${
                          isDropdownActive ? 'text-champagne-400' : 'text-ivory-300 hover:text-ivory-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                        {/* Underline that grows from the center outward on hover */}
                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-px w-[calc(100%-1.25rem)] bg-gradient-to-r from-champagne-400 to-gold-400 scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center" />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.35, ease: LUXE_EASE }}
                            className="absolute top-full left-1/2 -translate-x-1/2 min-w-[230px] rounded-xl border border-gold-500/20 bg-[#111111] p-2.5 shadow-2xl z-50"
                          >
                            {groups.map((grp, gi) => (
                              <div key={gi} className={gi > 0 ? 'mt-2.5 pt-2.5 border-t border-ivory-400/10' : ''}>
                                {grp.label && (
                                  <p className="px-4 pb-1.5 font-body text-[10px] tracking-[0.15em] uppercase text-champagne-400/60">
                                    {grp.label}
                                  </p>
                                )}
                                <div className="space-y-1">
                                  {grp.items.map((subItem) => {
                                    const Icon = subItem.icon;
                                    return (
                                      <NavLink
                                        key={subItem.path}
                                        to={subItem.path}
                                        end
                                        className={({ isActive }) =>
                                          `flex items-center gap-2.5 px-4 py-2.5 rounded-lg font-body text-xs tracking-wide transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                            isActive
                                              ? 'bg-gold-500/10 text-champagne-400 font-medium border-l-2 border-gold-500'
                                              : 'text-ivory-300 hover:text-ivory-50 hover:bg-white/5 hover:pl-5'
                                          }`
                                        }
                                      >
                                        {Icon && <Icon className="w-3.5 h-3.5 shrink-0 opacity-70" />}
                                        <span>{subItem.label}</span>
                                      </NavLink>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end
                    className={({ isActive }) =>
                      `group relative px-3 py-2 font-body text-sm transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive ? 'text-champagne-400 font-medium' : 'text-ivory-300 hover:text-ivory-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {/* Underline that grows from the center outward on hover */}
                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-px w-[calc(100%-1rem)] bg-gradient-to-r from-champagne-400 to-gold-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center" />
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-champagne-400"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* CTA & Actions */}
            <div className="flex items-center gap-4 border-l border-ivory-400/10 pl-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3, ease: LUXE_EASE }}
                onClick={onOpenBooking}
                className="focus-luxury px-5 py-2.5 bg-gradient-to-r from-champagne-500 to-gold-500 text-matte-black font-body text-xs font-semibold tracking-wider rounded-full hover:shadow-gold transition-shadow duration-300 whitespace-nowrap"
              >
                Book a Site Visit
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            className="focus-luxury lg:hidden p-2 text-ivory-200 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: mobileMenuOpen ? 'auto' : 0, opacity: mobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: LUXE_EASE }}
        className="lg:hidden overflow-y-auto max-h-[85vh] bg-matte-black/98 backdrop-blur-xl border-t border-ivory-400/10"
      >
        <div className="px-6 py-6 space-y-4">
          {navStructure.map((item) => {
            if (item.dropdown) {
              const isDropdownActive = item.dropdown.some(sub => location.pathname === sub.path);
              return (
                <div key={item.label} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                    className={`focus-luxury flex items-center justify-between w-full px-4 py-3 rounded-lg font-body text-base transition-colors duration-300 ${
                      isDropdownActive ? 'text-champagne-400 font-medium' : 'text-ivory-300'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: LUXE_EASE }}
                        className="pl-6 border-l border-gold-500/20 space-y-1 mt-1 overflow-hidden"
                      >
                        {item.dropdown.map((subItem) => {
                          const Icon = subItem.icon;
                          return (
                            <NavLink
                              key={subItem.path}
                              to={subItem.path}
                              end
                              onClick={() => setMobileMenuOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center gap-2.5 px-4 py-2 rounded-lg font-body text-sm transition-colors duration-300 ${
                                  isActive ? 'text-champagne-400 font-medium bg-gold-500/5' : 'text-ivory-450'
                                }`
                              }
                            >
                              {Icon && <Icon className="w-3.5 h-3.5 shrink-0 opacity-70" />}
                              <span>{subItem.label}</span>
                            </NavLink>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg font-body text-base transition-colors duration-300 ${
                    isActive ? 'text-champagne-400 bg-champagne-400/10 font-medium' : 'text-ivory-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}

          <div className="pt-4 border-t border-ivory-400/10 space-y-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (onOpenBooking) onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="focus-luxury w-full px-6 py-4 bg-gradient-to-r from-champagne-500 to-gold-500 text-matte-black font-body font-semibold tracking-wider rounded-full"
            >
              Book a Site Visit
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
