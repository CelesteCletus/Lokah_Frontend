import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  properties: [
    { label: 'Ongoing Projects', href: '#/projects/ongoing' },
    { label: 'Completed Projects', href: '#/projects/completed' },
  ],
  company: [
    { label: 'About Us', href: '#/explore-us/about-company' },
    { label: 'Our Team', href: '#/explore-us/organisation-chart' },
    { label: 'Construction Standards', href: '#/explore-us/construction-standards' },
    { label: 'Brochure', href: '#/explore-us/brochure' },
    { label: 'Careers', href: '#/careers' },
  ],
  support: [
    { label: 'Contact Us', href: '#/reach-us' },
    { label: 'Book Site Visit', href: '#/reach-us' },
    { label: 'Privacy Policy', href: '#/privacy' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/lokahbuilders?rdid=xQSUB0bEHlZWhG3f&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1F94GS8q7g%2F#', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/lokah.builders.developers?stkn=NGt0YTc1dThjMXc%3D', label: 'Instagram' },
  { icon: Youtube, href: 'https://www.youtube.com/@lokahbuilders', label: 'YouTube' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-matte-900 border-t border-ivory-400/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              src="/logo.png"
              alt="Lokah Builders & Developers - Villas & Apartments"
              className="h-16 w-auto object-contain mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-body text-ivory-400 text-sm leading-relaxed max-w-sm mb-6"
            >
              Crafting extraordinary living experiences across Kerala's most sought-after locations. Your dream home awaits at LOKAH BUILDERS.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 flex items-center justify-center bg-charcoal-800/60 border border-ivory-400/10 rounded-lg text-ivory-400 hover:text-champagne-400 hover:border-champagne-400/30 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Properties */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display text-ivory-50 text-lg mb-4">Properties</h4>
            <ul className="space-y-3">
              {footerLinks.properties.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-ivory-400 text-sm hover:text-champagne-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-display text-ivory-50 text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-ivory-400 text-sm hover:text-champagne-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="font-display text-ivory-50 text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-ivory-400 text-sm hover:text-champagne-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Gold accent line above bottom bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

      {/* Bottom Bar */}
      <div className="border-t border-ivory-400/8 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-ivory-400/60 text-xs text-center md:text-left">
              &copy; {currentYear} LOKAH BUILDERS &amp; DEVELOPERS PVT LTD. All rights reserved. Crafted with excellence.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#/terms"
                className="font-body text-ivory-400/60 text-xs hover:text-ivory-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#/privacy"
                className="font-body text-ivory-400/60 text-xs hover:text-ivory-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#/cookies"
                className="font-body text-ivory-400/60 text-xs hover:text-ivory-400 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Auren Studios Credit */}
      <div className="py-6 border-t border-ivory-400/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center justify-center text-center gap-1">
          <a
            href="https://aurenstudios.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center"
          >
            <img
              src="/auren-studios-logo.png"
              alt="Auren Studios"
              className="h-8 md:h-9 w-auto object-contain opacity-75 group-hover:opacity-100 transition-opacity duration-300 mb-1.5"
            />
            <div className="flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.2em] text-ivory-400/60 font-light">
              <span>Crafted by</span>
              <span className="font-display text-xs text-ivory-300 font-medium tracking-[0.18em] group-hover:text-champagne-300 transition-colors">
                Auren Studios
              </span>
            </div>
          </a>

          <a
            href="https://aurenstudios.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[11px] text-ivory-400/50 hover:text-champagne-300 transition-colors inline-flex items-center gap-1 group/link mt-0.5"
          >
            Visit <span className="text-champagne-400/90 font-medium underline underline-offset-4 decoration-champagne-400/30 group-hover/link:decoration-champagne-300">aurenstudios.in</span> for more information
          </a>
        </div>
      </div>
    </footer>
  );
}
