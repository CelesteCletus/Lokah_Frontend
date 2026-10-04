import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AIConcierge from '../components/AIConcierge';
import EMICalculator from '../components/EMICalculator';
import BookingForm from '../components/BookingForm';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Property } from '../data/sampleData';
import type { Blog } from '../lib/db';
import { slugify } from '../lib/propertyContent';

export interface LayoutContextType {
  handlePropertyClick: (property: Property) => void;
  onOpenBooking: (type?: 'visit' | 'consultation') => void;
  onOpenConcierge: () => void;
  onOpenEmiCalculator: () => void;
  properties: Property[];
  blogs: Blog[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
}

interface RootLayoutProps {
  properties: Property[];
  blogs: Blog[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
}

export default function RootLayout({ properties, blogs, setProperties, setBlogs }: RootLayoutProps) {
  const navigate = useNavigate();
  const [showEmiModal, setShowEmiModal] = useState(false);
  const [showConcierge, setShowConcierge] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState<'visit' | 'consultation'>('consultation');
  const [preselectedProperty, setPreselectedProperty] = useState<string>('');

  const handlePropertyClick = (property: Property) => {
    navigate(`/properties/${slugify(property.name)}`);
  };

  const contextValue: LayoutContextType = {
    handlePropertyClick,
    onOpenBooking: (type?: 'visit' | 'consultation') => {
      setBookingType(type || 'consultation');
      setPreselectedProperty(type === 'consultation' ? 'General Advisory / Custom Build' : '');
      setShowBookingModal(true);
    },
    onOpenConcierge: () => setShowConcierge(true),
    onOpenEmiCalculator: () => setShowEmiModal(true),
    properties,
    blogs,
    setProperties,
    setBlogs,
  };


  return (
    <div className="bg-matte-black text-ivory-100 min-h-screen">
      <Navbar 
        activeSection="" 
        onNavigate={() => {}}
        onOpenConcierge={() => setShowConcierge(true)}
        onOpenBooking={() => setShowBookingModal(true)}
      />

      <main>
        <Outlet context={contextValue} />
      </main>

      <Footer />

      <AIConcierge 
        properties={properties}
        onPropertyClick={handlePropertyClick} 
        onOpenEmiCalculator={() => setShowEmiModal(true)}
        onOpenBooking={(type) => {
          setBookingType(type || 'visit');
          setPreselectedProperty('');
          setShowBookingModal(true);
        }}
        isOpen={showConcierge}
        onOpen={() => setShowConcierge(true)}
        onClose={() => setShowConcierge(false)}
      />

      <AnimatePresence>
        {showEmiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setShowEmiModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-gold-500/20 bg-matte-950 p-4 sm:p-6 md:p-10 shadow-2xl hide-scrollbar"
            >
              <button
                type="button"
                onClick={() => setShowEmiModal(false)}
                aria-label="Close modal"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-ivory-400/10 hover:border-gold-500/40 hover:text-gold-400 flex items-center justify-center text-ivory-400 transition-all cursor-pointer z-10 focus-luxury"
              >
                <X className="w-5 h-5" />
              </button>
              <EMICalculator isModalView={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-gold-500/20 bg-matte-950 p-4 sm:p-6 md:p-10 shadow-2xl hide-scrollbar"
            >
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                aria-label="Close modal"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-ivory-400/10 hover:border-gold-500/40 hover:text-gold-400 flex items-center justify-center text-ivory-400 transition-all cursor-pointer z-10 focus-luxury"
              >
                <X className="w-5 h-5" />
              </button>
              <BookingForm isModalView={true} bookingType={bookingType} preselectedProperty={preselectedProperty} properties={properties} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
