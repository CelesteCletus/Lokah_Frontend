import { motion } from 'framer-motion';
import ContactSection from '../../components/Contact';
import PageHero from '../../components/PageHero';

export default function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      <PageHero
        title="Connect With Us"
        subtitle="Get in touch with our team of luxury property builders, architectural designers, and joint-venture specialists."
        imageSrc="/images/hero/contact-hero.jpg"
        category="Reach Us"
      />
      <ContactSection />
    </motion.div>
  );
}
