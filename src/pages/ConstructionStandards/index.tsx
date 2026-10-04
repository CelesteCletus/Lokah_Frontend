import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import ConstructionStandards from '../../components/ConstructionStandards';
import BrandsWeUse from '../../components/BrandsWeUse';
import DownloadSpecifications from '../../components/DownloadSpecifications';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';

export default function ConstructionStandardsPage() {
  const { onOpenBooking } = useOutletContext<LayoutContextType>();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      <PageHero
        title="Construction Standards"
        subtitle="Engineering excellence, structural benchmarks, and material standards across residential and commercial developments."
        category="Quality & Engineering"
      />

      <ConstructionStandards />

      <BrandsWeUse />

      <DownloadSpecifications />

      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
