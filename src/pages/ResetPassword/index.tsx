import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Key, ArrowRight, ShieldCheck } from 'lucide-react';
import { resetAdminPassword } from '../../lib/db';

const LUXE_EASE = [0.16, 1, 0.3, 1] as const;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('This reset link is missing its token. Please request a new one.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetAdminPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/team-login'), 2500);
    } catch (err: any) {
      setError(err.message || 'This reset link is invalid or has expired. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-matte-black relative px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: LUXE_EASE }}
        className="relative max-w-md w-full bg-matte-900/60 backdrop-blur-xl border border-gold-500/20 rounded-3xl p-8 md:p-10 shadow-elegant"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-5 text-gold-450">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h1 className="font-display text-xl text-ivory-50 mb-2">Reset Password</h1>

          {success ? (
            <p className="font-body text-sm text-ivory-300 leading-relaxed">
              Your password has been reset. Redirecting you to sign in…
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-5 text-left mt-4">
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-ivory-400 font-semibold mb-1.5 block">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ivory-500">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-luxury pl-10 py-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-ivory-400 font-semibold mb-1.5 block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ivory-500">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-luxury pl-10 py-3 text-sm"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-xs font-body font-light text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-matte-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <Link
                to="/team-login"
                className="block text-center text-[11px] text-ivory-400 hover:text-ivory-200 font-body"
              >
                Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
