import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, Facebook, Instagram, Share2, Youtube } from 'lucide-react';

export default function Contact() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-dark">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 40%), radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 40%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-body text-champagne-400 text-sm tracking-widest uppercase mb-4 block">
            Get In Touch
          </span>
          <h2 className="section-heading mb-4">
            Let Us <span className="text-gradient-gold">Connect</span>
          </h2>
          <p className="font-body text-ivory-400 max-w-2xl mx-auto">
            Our team of luxury property experts is ready to assist you in finding your dream home.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card-hover p-8 group flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-champagne-500/10 rounded-xl border border-champagne-500/20 group-hover:bg-champagne-500/20 transition-colors shrink-0">
                <MapPin className="w-5 h-5 text-champagne-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-ivory-50 mb-2">Visit Us</h3>
                <p className="font-body text-ivory-400 text-xs sm:text-sm leading-relaxed">
                  2nd Floor, BDS Fortune Center
                  <br />
                  Paruthelipalam, Marottichuvadu
                  <br />
                  Edappally, Ernakulam - 682024, Kerala
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-ivory-400/10">
              <a
                href="https://www.google.com/maps/place/Lokah+Builders+%26+Developers+Pvt+Ltd/@10.025249,76.3126151,17z/data=!4m15!1m8!3m7!1s0x3b080dd24cccee45:0x317665fe36057a56!2sLokah+Builders+%26+Developers+Pvt+Ltd!8m2!3d10.0252728!4d76.3127523!10e5!16s%2Fg%2F11z4qtyc71!3m5!1s0x3b080dd24cccee45:0x317665fe36057a56!8m2!3d10.0252728!4d76.3127523!16s%2Fg%2F11z4qtyc71?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-champagne-400 text-sm font-body group-hover:text-champagne-300 transition-colors"
              >
                View on Map
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Phone Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card-hover p-8 group flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-champagne-500/10 rounded-xl border border-champagne-500/20 group-hover:bg-champagne-500/20 transition-colors shrink-0">
                <Phone className="w-5 h-5 text-champagne-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-ivory-50 mb-2">Call Us</h3>
                <p className="font-body text-ivory-400 text-xs sm:text-sm leading-relaxed">
                  <a href="tel:+914842556655" className="hover:text-champagne-400 transition-colors block">
                    +91 484 255 6655
                  </a>
                  <a href="tel:+919496975555" className="hover:text-champagne-400 transition-colors block">
                    +91 94969 75555
                  </a>
                  <a href="tel:+919946302222" className="hover:text-champagne-400 transition-colors block">
                    +91 99463 02222
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-ivory-400/10">
              <a
                href="https://wa.me/919946302222"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-400 text-sm font-body hover:text-emerald-300 transition-colors"
              >
                WhatsApp Chat
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card-hover p-8 group flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-champagne-500/10 rounded-xl border border-champagne-500/20 group-hover:bg-champagne-500/20 transition-colors shrink-0">
                <Mail className="w-5 h-5 text-champagne-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-ivory-50 mb-2">Email Us</h3>
                <p className="font-body text-ivory-400 text-xs sm:text-sm leading-relaxed">
                  <a
                    href="mailto:info@lokahbuilders.com"
                    className="hover:text-champagne-400 transition-colors truncate block"
                  >
                    info@lokahbuilders.com
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-ivory-400/10 flex items-center gap-3">
              <Clock className="w-4 h-4 text-ivory-400/60 shrink-0" />
              <span className="font-body text-ivory-400/60 text-xs">Mon - Sat: 9AM - 7PM</span>
            </div>
          </motion.div>

          {/* Follow Us Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card-hover p-8 group flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-champagne-500/10 rounded-xl border border-champagne-500/20 group-hover:bg-champagne-500/20 transition-colors shrink-0">
                <Share2 className="w-5 h-5 text-champagne-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-ivory-50 mb-2">Follow Us</h3>
                <p className="font-body text-ivory-400 text-xs sm:text-sm leading-relaxed">
                  Stay updated with site progress &amp; new projects.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-ivory-400/10 flex flex-wrap items-center gap-2">
              <a
                href="https://www.facebook.com/lokahbuilders?rdid=xQSUB0bEHlZWhG3f&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1F94GS8q7g%2F#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-charcoal-800/80 border border-ivory-400/10 rounded-lg text-ivory-300 hover:text-champagne-300 hover:border-champagne-400/30 transition-all text-xs font-body"
              >
                <Facebook className="w-3.5 h-3.5 text-blue-400" />
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/lokah.builders.developers?stkn=NGt0YTc1dThjMXc%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-charcoal-800/80 border border-ivory-400/10 rounded-lg text-ivory-300 hover:text-champagne-300 hover:border-champagne-400/30 transition-all text-xs font-body"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram</span>
              </a>
              <a
                href="https://www.youtube.com/@lokahbuilders"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-charcoal-800/80 border border-ivory-400/10 rounded-lg text-ivory-300 hover:text-champagne-300 hover:border-champagne-400/30 transition-all text-xs font-body"
              >
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>YouTube</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* YouTube Channel Banner Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 glass-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-red-500/20 bg-gradient-to-r from-charcoal-900/90 via-matte-900/90 to-charcoal-900/90"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center shrink-0">
              <Youtube className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <h3 className="font-display text-lg text-ivory-50 mb-1 flex items-center gap-2">
                Watch On YouTube
              </h3>
              <p className="font-body text-ivory-300 text-xs sm:text-sm leading-relaxed">
                Explore virtual site walkthroughs, architectural design reveals, and site progress videos on our official channel.
              </p>
            </div>
          </div>
          <a
            href="https://www.youtube.com/@lokahbuilders"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-body font-semibold uppercase tracking-wider transition-all shadow-glass shrink-0"
          >
            <Youtube className="w-4 h-4" />
            <span>Visit YouTube Channel</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="font-body text-ivory-400 mb-4">
            Ready to discover your dream property?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="tel:+919496975555"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
            >
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </motion.a>
            <motion.a
              href="https://wa.me/919946302222"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20"
            >
              <span className="text-emerald-400">WhatsApp Enquiry</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
