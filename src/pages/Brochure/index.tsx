import { motion } from 'framer-motion';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import FullScreenHero from '../../components/FullScreenHero';
import CTASection from '../../components/CTASection';
import type { LayoutContextType } from '../../layouts/RootLayout';
import { getBrochureInfo, resolveUploadUrl } from '../../lib/db';

export default function Brochure() {
  const { onOpenBooking } = useOutletContext<LayoutContextType>();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadBrochure = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      let fileUrl = '/documents/lokah builders & developers brochure.pdf';
      try {
        const info = await getBrochureInfo();
        if (info && info.file_path) {
          fileUrl = resolveUploadUrl(info.file_path);
        }
      } catch (e) {
        // Fallback to uploaded brochure in public/documents/
      }

      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = 'lokah builders & developers brochure.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Brochure download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-matte-black text-ivory-100 min-h-screen"
    >
      <FullScreenHero
        title="Corporate Portfolio &amp; Brochure"
        subtitle="Download our detailed blueprint documents, technical engineering standards, and complete luxury residential catalog."
        imageSrc="/images/hero/services-hero.jpg"
        category="Exclusive Access"
        ctaText={downloading ? 'Preparing Download...' : 'Download Brochure'}
        onCtaClick={handleDownloadBrochure}
        showScrollIndicator={false}
      />

      <CTASection onOpenBooking={onOpenBooking} />
    </motion.div>
  );
}
