import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Key, ArrowRight, ShieldCheck, Check, Wifi } from 'lucide-react';
import { loginAdmin, checkAdminSession, requestPasswordReset } from '../../lib/db';
import { API_URL } from '../../lib/apiUrl';

const LUXE_EASE = [0.16, 1, 0.3, 1] as const;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotOverlay, setShowForgotOverlay] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiConnected, setApiConnected] = useState(true); // default true, checked on mount

  // Load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem('lokah_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Check if Express backend is online on page load
  useEffect(() => {
    fetch(`${API_URL}/health`, { credentials: 'include' })
      .then(res => setApiConnected(res.ok))
      .catch(() => setApiConnected(false));
  }, []);

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    if (apiConnected) {
      checkAdminSession()
        .then(() => navigate('/admin/dashboard'))
        .catch(() => {});
    }
  }, [apiConnected, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password.');
      }

      // No backend connection: fail closed. There is no offline/local admin access.
      if (!apiConnected) {
        throw new Error('Cannot reach the server. Please try again once the connection is restored.');
      }

      // Live database authentication
      await loginAdmin(email, password);
      if (rememberMe) {
        localStorage.setItem('lokah_remember_email', email);
      } else {
        localStorage.removeItem('lokah_remember_email');
      }
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSubmitting(true);
    try {
      const res = await requestPasswordReset(forgotEmail);
      setForgotMessage(res.message || 'If an account exists for this email address, a password reset link has been sent.');
    } catch {
      // Still show the generic message — never reveal whether the request failed
      // because the account doesn't exist vs. a transient error.
      setForgotMessage('If an account exists for this email address, a password reset link has been sent.');
    } finally {
      setForgotSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-matte-black relative px-6 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: LUXE_EASE }}
        className="relative max-w-md w-full bg-matte-900/60 backdrop-blur-xl border border-gold-500/20 rounded-3xl p-8 md:p-10 shadow-elegant"
      >
        <div className="flex flex-col items-center text-center">
          {/* Brand Logo Header */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: LUXE_EASE }}
            className="flex justify-center mb-5"
          >
            <img src="/logo.png" alt="Lokah Builders & Developers - Villas & Apartments" className="h-16 md:h-20 w-auto object-contain" />
          </motion.div>
          
          <p className="font-body text-[10px] text-champagne-400 uppercase tracking-[0.2em] font-semibold mb-6">
            Management Console Portal
          </p>

          {/* Backend offline notice */}
          {!apiConnected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl mb-6 text-[11px] font-body text-left leading-relaxed text-red-300"
            >
              <Wifi className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>Unable to reach the server. Login is unavailable until the connection is restored.</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-5 text-left">
            {/* Email Input */}
            <div>
              <label className="font-body text-[10px] tracking-wider uppercase text-ivory-400 font-semibold mb-1.5 block">
                Security Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ivory-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="admin@lokahbuilders.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-luxury pl-10 py-3 text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-body text-[10px] tracking-wider uppercase text-ivory-400 font-semibold block">
                  Access Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotOverlay(true)}
                  className="text-[9px] font-body tracking-wider uppercase text-gold-450 hover:text-gold-300 font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ivory-500">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-luxury pl-10 py-3 text-sm"
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2.5 py-1">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                  rememberMe 
                    ? 'border-gold-500 bg-gold-500/10 text-gold-400' 
                    : 'border-white/10 hover:border-gold-500/30 bg-white/5'
                }`}
              >
                {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span className="font-body text-[11px] text-ivory-300 cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>
                Remember this administrator session
              </span>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs font-body font-light text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !apiConnected}
              className="w-full btn-primary py-3.5 text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-matte-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Forgot Password Overlay Modal */}
      <AnimatePresence>
        {showForgotOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative max-w-sm w-full bg-matte-950 border border-gold-500/20 rounded-3xl p-6 md:p-8 text-center shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4 text-gold-450">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg text-ivory-50 mb-2">Forgot Password</h3>
              {forgotMessage ? (
                <>
                  <p className="font-body text-xs text-ivory-300 leading-relaxed mb-6">
                    {forgotMessage}
                  </p>
                  <button
                    onClick={() => { setShowForgotOverlay(false); setForgotMessage(''); setForgotEmail(''); }}
                    className="btn-primary w-full py-2.5 text-xs uppercase tracking-wider font-semibold"
                  >
                    Close
                  </button>
                </>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <p className="font-body text-xs text-ivory-300 leading-relaxed mb-4">
                    Enter your registered admin email and we'll send a password reset link if an account exists.
                  </p>
                  <input
                    type="email"
                    required
                    placeholder="admin@lokahbuilders.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="input-luxury py-3 text-sm w-full mb-4"
                  />
                  <button
                    type="submit"
                    disabled={forgotSubmitting}
                    className="btn-primary w-full py-2.5 text-xs uppercase tracking-wider font-semibold disabled:opacity-50"
                  >
                    {forgotSubmitting ? 'Sending…' : 'Send Reset Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotOverlay(false)}
                    className="w-full mt-3 text-[11px] text-ivory-400 hover:text-ivory-200 font-body"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
