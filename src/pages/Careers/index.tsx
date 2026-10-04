import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Briefcase, MapPin, Send, CheckCircle2, X, Check, Loader2, AlertCircle, Upload } from 'lucide-react';
import PageHero from '../../components/PageHero';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';
import { getJobsList, submitJobApplication, type Job } from '../../lib/db';

// No fictional fallback listings: open roles come only from admin-posted jobs (see getJobsList below).
// TODO: client to confirm current open positions via the admin panel before launch.
const fallbackJobs: Job[] = [];

const perks = [
  'A supportive and collaborative work environment',
  'Opportunities to learn and grow professionally',
  'Exposure to diverse projects and experiences',
  'A workplace that values ideas and initiative',
  'Opportunities for meaningful career development',
];

function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
      setError('Please attach your resume (PDF or Word document).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await submitJobApplication(
        {
          jobId: job.id > 0 ? job.id : undefined,
          jobTitle: job.title,
          name: form.name,
          email: form.email,
          phone: form.phone,
          position: job.title,
        },
        resume
      );
      setSubmitted(true);
    } catch (err) {
      console.error('Application submission failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while submitting your application. Please try again or email careers@lokahbuilders.com directly.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-lg p-8 md:p-10 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full border border-ivory-400/10 hover:border-gold-500/40 hover:text-gold-400 flex items-center justify-center text-ivory-400 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-display text-2xl text-ivory-50 mb-3">Application Received!</h3>
            <p className="font-body text-ivory-400 text-sm mb-8">
              Thank you, {form.name}. Our HR team will review your profile for the {job.title} role and reach out if there's a match.
            </p>
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-400 text-xs font-body mb-3">
                <Briefcase className="w-3.5 h-3.5" />
                Applying for
              </span>
              <h3 className="font-display text-2xl text-ivory-50 font-light">{job.title}</h3>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="font-body text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="text-ivory-400 text-sm font-body mb-2 block">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-luxury"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="text-ivory-400 text-sm font-body mb-2 block">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-luxury"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="text-ivory-400 text-sm font-body mb-2 block">Phone Number</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-luxury"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="text-ivory-400 text-sm font-body mb-2 block">Resume / CV</label>
              <label className="flex items-center gap-3 border border-dashed border-ivory-400/20 hover:border-gold-500/40 rounded-xl px-4 py-4 cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-gold-500 shrink-0" />
                <span className="font-body text-ivory-400 text-sm truncate">
                  {resume ? resume.name : 'Click to attach PDF or Word document'}
                </span>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setResume(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="btn-primary w-full justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Careers() {
  const { onOpenBooking } = useOutletContext<LayoutContextType>();
  const [jobs, setJobs] = useState<Job[]>(fallbackJobs);
  const [applyingTo, setApplyingTo] = useState<Job | null>(null);

  useEffect(() => {
    let cancelled = false;
    getJobsList(false).then((list) => {
      if (cancelled) return;
      const openJobs = list.filter((j) => j.status === 'open');
      if (openJobs.length > 0) setJobs(openJobs);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      <PageHero
        title="Careers at Lokah"
        subtitle="Become part of a dedicated team transforming the landscape of luxury developments and professional construction across Kerala."
        imageSrc="/images/hero/about-hero.jpg"
        category="Join Our Ranks"
      />

      {/* Corporate Culture Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-widest uppercase font-semibold">
              Life at Lokah
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              Where Engineering Meets <span className="text-gradient-gold font-medium">Artistry</span>
            </h2>
            <p className="font-body text-ivory-300 text-sm leading-relaxed font-light">
              At LOKAH Builders &amp; Developers, we believe that construction is not just about brick and mortar; it is about establishing landmarks that last. We foster a collaborative, high-performance workspace where engineers, architects, and advisors push the limits of luxury and structural quality.
            </p>
            <p className="font-body text-ivory-300 text-sm leading-relaxed font-light">
              If you value absolute transparency, uncompromising materials curation, and meticulous design details, you will find your place with us.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-10 space-y-6 border border-gold-500/15"
          >
            <h3 className="font-display text-2xl text-ivory-50 font-light">Perks &amp; Benefits</h3>
            <ul className="space-y-4">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                  <span className="font-body text-ivory-300 text-xs sm:text-sm font-light leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </section>

      {/* Open Roles Listing */}
      <section className="py-24 bg-matte-950 border-t border-ivory-400/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-body text-champagne-400 text-xs sm:text-sm tracking-widest uppercase font-semibold block mb-3">
              Opportunities
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-50">
              Open <span className="text-gradient-gold font-medium">Positions</span>
            </h2>
          </div>

          {jobs.length === 0 && (
            <div className="max-w-2xl mx-auto text-center glass-card p-10 border border-gold-500/10">
              <p className="font-body text-ivory-300 text-sm md:text-base leading-relaxed">
                There are no open positions listed right now. Check back soon, or reach out to us directly at{' '}
                <a href="mailto:careers@lokahbuilders.com" className="text-gold-400 hover:text-gold-300">
                  careers@lokahbuilders.com
                </a>.
              </p>
            </div>
          )}
          <div className="space-y-6 max-w-3xl mx-auto">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id ?? job.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="glass-card p-8 border border-gold-500/10 hover:border-gold-500/25 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group"
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-400 text-xs font-body">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{job.type}{job.experience ? ` • ${job.experience}` : ''}</span>
                  </div>
                  <h3 className="font-display text-2xl text-ivory-50 tracking-wide font-light">{job.title}</h3>
                  {job.location && (
                    <div className="flex items-center gap-1.5 font-body text-xs sm:text-sm text-ivory-405 font-light">
                      <MapPin className="w-4 h-4 text-gold-500" />
                      <span>{job.location}</span>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setApplyingTo(job)}
                  className="btn-secondary py-3 px-6 whitespace-nowrap self-stretch md:self-auto justify-center group-hover:border-gold-500/40 group-hover:text-gold-400"
                >
                  <Send className="w-4 h-4" />
                  <span>Apply Now</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {applyingTo && <ApplyModal job={applyingTo} onClose={() => setApplyingTo(null)} />}
      </AnimatePresence>

      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
