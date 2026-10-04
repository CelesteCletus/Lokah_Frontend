import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Calendar, User, Mail, Phone, Home, MessageSquare, Check, Loader2, AlertCircle } from 'lucide-react';
import { properties as staticProperties, Property } from '../data/sampleData';
import { submitConsultation, submitSiteVisit } from '../lib/db';

interface BookingFormProps {
  isModalView?: boolean;
  bookingType?: 'visit' | 'consultation';
  preselectedProperty?: string;
  properties?: Property[];
}

export default function BookingForm({
  isModalView = false,
  bookingType = 'consultation',
  preselectedProperty = '',
  properties = staticProperties
}: BookingFormProps) {
  const isConsultation = bookingType === 'consultation';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    property: preselectedProperty || (isConsultation ? 'General Advisory / Custom Build' : ''),
    date: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      property: preselectedProperty || (isConsultation ? 'General Advisory / Custom Build' : ''),
    }));
  }, [preselectedProperty, isConsultation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isConsultation) {
        await submitConsultation({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          preferredDate: formData.date || undefined,
          projectType: formData.property,
          message: formData.message || 'No additional message',
        });
      } else {
        const matchedProperty = properties.find((p) => p.name === formData.property);
        await submitSiteVisit({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          projectId: matchedProperty?.id,
          projectName: formData.property,
          visitDate: formData.date,
          message: formData.message || 'No additional message',
        });
      }
      try {
        window.dispatchEvent(new CustomEvent('new_enquiry_submitted', { detail: { name: formData.name } }));
      } catch (e) {}
      setSubmitted(true);
    } catch (err) {
      console.error('Booking submission failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while submitting your booking. Please try again or contact us directly.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className={`relative z-10 max-w-5xl mx-auto ${isModalView ? 'px-0' : 'px-6 lg:px-8'}`}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-champagne-500/10 border border-champagne-500/20 rounded-full mb-6">
          <Calendar className="w-4 h-4 text-champagne-400" />
          <span className="font-body text-champagne-400 text-sm">
            {isConsultation ? 'Expert Consultation' : 'Schedule a Visit'}
          </span>
        </div>
        <h2 className="section-heading mb-4">
          {isConsultation ? (
            <>Book a <span className="text-gradient-gold">Consultation</span></>
          ) : (
            <>Book Your <span className="text-gradient-gold">Site Visit</span></>
          )}
        </h2>
        <p className="font-body text-ivory-400 max-w-2xl mx-auto">
          {isConsultation
            ? 'Connect with LOKAH Builders & Developers experts to discuss custom designs, architectural blueprints, or property details.'
            : 'Experience luxury firsthand. Schedule a personalized site visit and let our experts guide you through your dream property.'}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="font-display text-3xl text-ivory-50 mb-4">
              Booking Confirmed!
            </h3>
            <p className="font-body text-ivory-400 mb-8 max-w-md mx-auto">
              {isConsultation
                ? `Thank you, ${formData.name}! Our team will contact you shortly to confirm your consultation session regarding "${formData.property}". Check your email for details.`
                : `Thank you, ${formData.name}! Our team will contact you shortly to confirm your site visit to ${formData.property}. Check your email for confirmation details.`}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  phone: '',
                  email: '',
                  property: isConsultation ? 'General Advisory / Custom Build' : '',
                  date: '',
                  message: '',
                });
              }}
              className="btn-primary"
            >
              {isConsultation ? 'Book Another Consultation' : 'Book Another Visit'}
            </motion.button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="glass-card p-8 md:p-12"
          >
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="font-body text-red-300 text-sm">{error}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-2">
                  <User className="w-4 h-4 text-champagne-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-luxury"
                  placeholder="Enter your name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-2">
                  <Phone className="w-4 h-4 text-champagne-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-luxury"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-2">
                  <Mail className="w-4 h-4 text-champagne-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-luxury"
                  placeholder="Enter your email"
                />
              </div>

              {/* Property Select */}
              <div>
                <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-2">
                  <Home className="w-4 h-4 text-champagne-400" />
                  {isConsultation ? 'Select Consultation Category' : 'Select Property'}
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.property}
                    onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                    className="select-luxury pr-10 bg-[#111111] text-ivory-100"
                  >
                    <option value="" disabled className="text-ivory-400/60 bg-[#111111]">
                      Select a property/category
                    </option>
                    {isConsultation && (
                      <option value="General Advisory / Custom Build" className="text-ivory-100 bg-[#111111]">
                        General Advisory / Custom Build
                      </option>
                    )}
                    {properties.map((prop) => (
                      <option key={prop.id} value={prop.name} className="text-ivory-100 bg-[#111111]">
                        {prop.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ivory-400/50">
                    ▼
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-2">
                  <Calendar className="w-4 h-4 text-champagne-400" />
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-luxury"
                />
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-2">
                  <MessageSquare className="w-4 h-4 text-champagne-400" />
                  Additional Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="input-luxury resize-none"
                  placeholder="Any specific requirements or questions..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
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
                    <span>Confirming Booking...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    <span>{isConsultation ? 'Confirm Consultation Booking' : 'Confirm Site Visit'}</span>
                  </>
                )}
              </motion.button>
            </div>

            <p className="text-center font-body text-ivory-400/60 text-xs mt-4">
              By submitting, you agree to receive communications from LOKAH BUILDERS & DEVELOPERS PVT LTD regarding your booking and property updates.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );

  if (isModalView) {
    return formContent;
  }

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-dark">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)',
          }}
        />
      </div>
      {formContent}
    </section>
  );
}
