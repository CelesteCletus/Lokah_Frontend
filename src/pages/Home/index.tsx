import { motion } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Hero from '../../components/Hero';
import AboutHome from '../../components/AboutHome';
import Stats from '../../components/Stats';
import ServicesShowcase from '../../components/ServicesShowcase';
import FeaturedProperties from '../../components/FeaturedProperties';
import Lifestyle from '../../components/Lifestyle';
import WhyChooseUs from '../../components/WhyChooseUs';
import Process from '../../components/Process';
import FeaturedVideo from '../../components/FeaturedVideo';
import Testimonials from '../../components/Testimonials';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';

export default function Home() {
  const navigate = useNavigate();
  const { onOpenBooking, properties, handlePropertyClick } = useOutletContext<LayoutContextType>();

  const handleNavigate = (path: string) => {
    if (path === 'properties' || path === 'services') {
      navigate('/services');
    } else if (path === 'contact') {
      navigate('/reach-us');
    } else {
      navigate('/');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-matte-black text-ivory-100"
    >
      <Hero onNavigate={handleNavigate} />
      <AboutHome />
      <Stats />
      <ServicesShowcase />
      <FeaturedProperties 
        properties={properties} 
        onPropertyClick={handlePropertyClick} 
        onViewAll={() => navigate('/projects/all')} 
      />
      <Lifestyle />
      <WhyChooseUs />
      <Process />
      <FeaturedVideo onNavigate={handleNavigate} />
      <Testimonials />
      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
