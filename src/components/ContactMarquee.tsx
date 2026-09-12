import { Phone } from 'lucide-react';

export default function ContactMarquee() {
  const content = (
    <>
      {Array(6).fill(null).map((_, i) => (
        <div key={i} className="flex items-center gap-8 mx-6 shrink-0">
          <span className="flex items-center gap-2 font-body text-xs text-champagne-300 font-medium tracking-wider">
            <Phone className="w-3 h-3 text-gold-400 shrink-0" />
            <span>Contact Us :-</span>
            <a href="tel:+914842556655" className="hover:text-gold-300 transition-colors font-semibold text-ivory-100">
              +91 484 255 6655
            </a>
            <span className="text-gold-500/40">,</span>
            <a href="tel:+919496975555" className="hover:text-gold-300 transition-colors font-semibold text-ivory-100">
              +91 94969 75555
            </a>
          </span>
          <span className="text-gold-500/40 text-[10px]">•</span>
        </div>
      ))}
    </>
  );

  return (
    <div className="w-full bg-black/15 backdrop-blur-xl border-b border-white/10 py-2 sm:py-2.5 overflow-hidden select-none relative z-50">
      <div className="flex whitespace-nowrap animate-marquee">
        {content}
        {content}
      </div>
    </div>
  );
}
