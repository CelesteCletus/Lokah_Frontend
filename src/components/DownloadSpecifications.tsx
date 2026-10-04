import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, CheckCircle2, X } from 'lucide-react';

export default function DownloadSpecifications() {
  const [showModal, setShowModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const pdfUrl = '/documents/TURNKEY CONSTRUCTION SPECIFICATIONS.pdf';

  const handleDownload = () => {
    setDownloadSuccess(true);
    const element = document.createElement('a');
    element.href = pdfUrl;
    element.download = 'TURNKEY CONSTRUCTION SPECIFICATIONS.pdf';
    element.target = '_blank';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <section className="relative py-20 bg-gradient-to-b from-matte-950 via-matte-900 to-matte-950 border-t border-ivory-400/10 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="glass-card p-10 md:p-14 rounded-3xl border border-gold-500/20 shadow-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gold-500/5 blur-3xl rounded-full pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full mb-6">
              <FileText className="w-4 h-4 text-gold-400" />
              <span className="font-body text-gold-400 text-xs sm:text-sm tracking-wider font-medium">
                Documentation
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-ivory-50 font-light mb-4 tracking-wide">
              Construction <span className="text-gradient-gold font-medium">Specifications</span>
            </h2>

            <p className="font-body text-ivory-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light mb-8">
              Explore our standard construction specifications covering structural work, materials and finishing practices.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={pdfUrl}
                download="TURNKEY CONSTRUCTION SPECIFICATIONS.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDownload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-matte-black font-body text-sm font-semibold rounded-full shadow-gold hover:shadow-gold-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Construction Specifications</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Download / Preview Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg glass-card p-8 rounded-3xl border border-gold-500/30 bg-matte-950 text-ivory-100 shadow-2xl"
            >
              <button
                onClick={() => {
                  setShowModal(false);
                  setDownloadSuccess(false);
                }}
                className="absolute top-5 right-5 p-2 text-ivory-400 hover:text-ivory-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-ivory-50 font-medium">Turnkey Construction Specifications</h3>
                  <p className="font-body text-xs text-ivory-400 font-light">Lokah Builders & Developers Pvt Ltd</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-matte-900/80 border border-ivory-400/10 text-xs text-ivory-300 space-y-2.5 font-light mb-6">
                <p><strong className="text-gold-400 font-medium">Document Summary:</strong> Contains turn-key construction guidelines, structural engineering considerations, standard material selections, and utility layout practices.</p>
                <p><strong className="text-gold-400 font-medium">Format:</strong> Official Construction Specifications Document (.pdf)</p>
              </div>

              {downloadSuccess ? (
                <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center gap-3 text-gold-300 text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                  <span>Specification PDF downloaded successfully!</span>
                </div>
              ) : (
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-full border border-ivory-400/20 text-ivory-300 hover:text-ivory-100 text-xs font-body"
                  >
                    Close
                  </button>
                  <a
                    href={pdfUrl}
                    download="TURNKEY CONSTRUCTION SPECIFICATIONS.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold-500 text-matte-black font-body text-xs font-semibold rounded-full hover:bg-gold-400 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Specs PDF</span>
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
