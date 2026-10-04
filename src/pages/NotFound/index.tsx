import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const LUXE_EASE = [0.16, 1, 0.3, 1] as const;

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-matte-black relative px-6 overflow-hidden">
      {/* Background radial glow, matching AdminLogin's treatment */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: LUXE_EASE }}
        className="relative max-w-lg w-full text-center"
      >
        <p className="font-display text-[7rem] leading-none font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-gold-400 to-gold-600/40 mb-2">
          404
        </p>
        <h1 className="font-display text-2xl md:text-3xl font-light tracking-wide text-ivory-50 mb-4">
          This page has wandered off-site
        </h1>
        <p className="font-body text-sm text-ivory-400 mb-10 leading-relaxed">
          The page you're looking for doesn't exist, may have moved, or the link may be broken.
          Let's get you back to solid ground.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-primary px-6 py-3 text-xs tracking-wider uppercase font-semibold flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 text-xs tracking-wider uppercase font-semibold text-ivory-300 border border-ivory-500/20 rounded-full flex items-center gap-2 hover:border-gold-500/40 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
