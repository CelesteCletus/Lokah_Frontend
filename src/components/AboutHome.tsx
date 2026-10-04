import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function AboutHome() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Parallax scroll transforms for outer container
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yScrollParallax = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // Subtle coordinate readings based on Kochi/Ernakulam vectors
  const coordinateStrings = [
    "LAT: 10.058366° N | LNG: 76.304462° E",
    "GRID REF: IN-KL-02",
    "ALT: +4.80m MSL",
    "SCALE: 1:100 @ A3"
  ];

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden bg-matte-black border-b border-ivory-400/5">
      {/* Far Right Vertical Text Accent */}
      <div className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 select-none pointer-events-none text-gold-500/10 font-display text-[8px] md:text-[9px] tracking-[0.5em] font-semibold rotate-90 origin-right translate-x-[42%] whitespace-nowrap z-20 uppercase">
        Architecture &bull; Craftsmanship &bull; Legacy
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-body text-champagne-400 text-sm tracking-widest uppercase mb-4 block">
              About Lokah Builders
            </span>
            <h2 className="section-heading mb-6">
              Building Kerala's Most{' '}
              <span className="text-gradient-gold">Trusted Landmarks.</span>
            </h2>
            <p className="font-body text-ivory-400 text-sm md:text-base leading-relaxed mb-5 max-w-prose">
              We are the leading building service provider offering a comprehensive range of construction services — from architectural design to final handover. We deploy cutting-edge machinery and progressive construction techniques, always delivered at a fair and transparent price.
            </p>
            <p className="font-body text-ivory-400 text-sm md:text-base leading-relaxed max-w-prose">
              Our design professionals are equipped to guide you through every decision. From the very first consultation, the ultimate aim of Lokah Builders has been to be a loyal, trusted partner — offering the best in craftsmanship, management, and construction excellence.
            </p>
          </motion.div>

          {/* Right Column: Multi-Layered Blueprint Parallax Experience */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full aspect-square max-w-md mx-auto z-10 select-none pointer-events-none"
          >
            {/* Scroll Parallax Wrapper */}
            <motion.div style={{ y: yScrollParallax }} className="relative w-full h-full rounded-3xl overflow-hidden border border-gold-500/10 bg-charcoal-950/20 backdrop-blur-sm p-4 shadow-2xl flex items-center justify-center">
              
              {/* Blueprint Grid Paper Background Texture */}
              <div 
                className="absolute inset-0 z-0 opacity-[0.2]"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(212, 175, 55, 0.12) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(212, 175, 55, 0.12) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px',
                }}
              />

              {/* LAYER 1: ARCHITECTURAL ELEVATION (Background facade) */}
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0.2, -0.2, 0.2] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 z-10 flex items-center justify-center p-6"
              >
                <svg viewBox="0 0 500 500" className="w-full h-full fill-none stroke-[#D4AF37]/5" strokeWidth="0.8">
                  {/* Villa facade elevation details */}
                  <rect x="140" y="260" width="220" height="130" />
                  <rect x="120" y="150" width="260" height="110" />
                  <polygon points="100,140 400,140 380,150 120,150" />
                  
                  {/* Large structural glass bays */}
                  <rect x="140" y="170" width="100" height="75" />
                  <rect x="260" y="170" width="100" height="75" />
                  <line x1="190" y1="170" x2="190" y2="245" />
                  <line x1="310" y1="170" x2="310" y2="245" />

                  {/* Ground floor pillars & sliding panels */}
                  <rect x="170" y="280" width="50" height="110" />
                  <rect x="280" y="280" width="50" height="110" />
                  <line x1="250" y1="260" x2="250" y2="390" />
                  
                  {/* Ground floor basework */}
                  <line x1="80" y1="390" x2="420" y2="390" strokeWidth="1.5" />
                </svg>
              </motion.div>

              {/* LAYER 2: FLOOR PLAN FRAGMENTS (Offset drafting paper sketches) */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [-0.3, 0.3, -0.3] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 z-20 flex items-center justify-center p-8 opacity-[0.06]"
              >
                <svg viewBox="0 0 500 500" className="w-full h-full fill-none stroke-[#D4AF37]" strokeWidth="0.7">
                  {/* Compass details */}
                  <circle cx="80" cy="80" r="24" strokeDasharray="3,3" />
                  <line x1="80" y1="50" x2="80" y2="110" />
                  <line x1="50" y1="80" x2="110" y2="80" />
                  <path d="M 80,56 L 85,80 L 80,76 L 75,80 Z" fill="#D4AF37" />

                  {/* Floor Plan room divisions (bottom right corner) */}
                  <rect x="240" y="280" width="180" height="140" strokeDasharray="5,2" />
                  <line x1="330" y1="280" x2="330" y2="420" />
                  <line x1="240" y1="350" x2="420" y2="350" />
                  {/* Door swings swing arcs */}
                  <path d="M 330,320 A 30,30 0 0,1 300,350" />
                  <path d="M 330,380 A 30,30 0 0,0 360,350" />
                  
                  {/* Structural column cross-hatching */}
                  <rect x="235" y="275" width="10" height="10" fill="#D4AF37" fillOpacity="0.1" />
                  <rect x="415" y="275" width="10" height="10" fill="#D4AF37" fillOpacity="0.1" />
                  <rect x="235" y="415" width="10" height="10" fill="#D4AF37" fillOpacity="0.1" />
                  <rect x="415" y="415" width="10" height="10" fill="#D4AF37" fillOpacity="0.1" />
                </svg>
              </motion.div>

              {/* LAYER 3: GOLDEN GEOMETRIC CONSTRUCTION LINES (Alignment circles & ratio spirals) */}
              <motion.div
                animate={{ y: [0, -14, 0], rotate: [0.5, -0.5, 0.5] }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 z-35 flex items-center justify-center p-4 opacity-[0.04]"
              >
                <svg viewBox="0 0 500 500" className="w-full h-full fill-none stroke-[#D4AF37]" strokeWidth="0.5">
                  {/* Golden spiral proportion lines */}
                  <path d="M250,250 A10,10 0 0,1 260,250 A20,20 0 0,1 240,250 A40,40 0 0,1 280,250 A80,80 0 0,1 200,250 A160,160 0 0,1 360,250" strokeDasharray="3,3" />

                  {/* Concentric proportion circles */}
                  <circle cx="250" cy="270" r="180" />
                  <circle cx="250" cy="270" r="111" />
                  <circle cx="250" cy="270" r="68" />
                  
                  {/* Diagonal construction grids */}
                  <line x1="50" y1="50" x2="450" y2="450" strokeDasharray="5,10" />
                  <line x1="450" y1="50" x2="50" y2="450" strokeDasharray="5,10" />
                  
                  {/* Horizontal horizon level & center crosshair */}
                  <line x1="20" y1="270" x2="480" y2="270" strokeDasharray="12,4" />
                  <line x1="250" y1="20" x2="250" y2="480" strokeDasharray="12,4" />
                </svg>
              </motion.div>

              {/* LAYER 4: TINY COORDINATES AND MEASUREMENTS (Dimensions & CAD parameters) */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [-0.1, 0.1, -0.1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 z-40 flex items-center justify-center p-5 opacity-[0.08] font-mono text-[6px] md:text-[7px] text-[#D4AF37]"
              >
                <div className="w-full h-full relative">
                  {/* Upper-Left coordinates stamp */}
                  <div className="absolute top-2 left-2 text-left space-y-0.5 leading-none">
                    <p className="font-bold">SHEET REF: DET-092-B</p>
                    <p>{coordinateStrings[0]}</p>
                    <p>{coordinateStrings[1]}</p>
                  </div>

                  {/* Height dimensions labels */}
                  <div className="absolute left-[30px] top-[140px] h-[250px] flex flex-col justify-between items-start border-l border-dashed border-[#D4AF37] pl-1">
                    <p className="leading-none">ROOF +9.60m</p>
                    <p className="leading-none">LEVEL 2 +4.80m</p>
                    <p className="leading-none">LEVEL 1 +0.00m</p>
                  </div>

                  {/* Corner dimension brackets details */}
                  <div className="absolute right-[40px] bottom-[115px] text-right leading-none">
                    <p>W1500 x H1200</p>
                    <p className="text-[5px]">SILICONE SEALED BAYS</p>
                  </div>

                  {/* Title block box in bottom left */}
                  <div className="absolute bottom-2 left-2 border border-[#D4AF37] p-1.5 text-left leading-tight bg-matte-black/60 rounded">
                    <p className="font-bold text-[8px] tracking-wide text-gradient-gold">LOKAH DESIGN</p>
                    <p className="text-[5px]">VILLA ELEVATION DETAIL</p>
                    <p className="text-[4px] opacity-75">ALL MEASUREMENTS IN MM</p>
                  </div>

                  {/* CAD coordinate ticks */}
                  <div className="absolute top-1/2 right-2 -translate-y-1/2 text-right leading-none space-y-1">
                    <p>X: 104.92</p>
                    <p>Y: 760.35</p>
                    <p>Z: {coordinateStrings[2]}</p>
                  </div>
                </div>
              </motion.div>

              {/* LAYER 5: EXTREMELY SUBTLE MOVING PARTICLES (Floating nodes) */}
              <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
                {/* Particle 1 */}
                <motion.div
                  animate={{ x: [0, 40, 0], y: [0, -60, 0], opacity: [0.15, 0.45, 0.15] }}
                  transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-10 left-[20%] w-1.5 h-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                />
                {/* Particle 2 */}
                <motion.div
                  animate={{ x: [0, -30, 0], y: [0, -80, 0], opacity: [0.1, 0.35, 0.1] }}
                  transition={{ duration: 19, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-20 left-[60%] w-1 h-1 rounded-full bg-gold-500 shadow-[0_0_6px_rgba(212,175,55,0.6)]"
                />
                {/* Particle 3 */}
                <motion.div
                  animate={{ x: [0, 50, 0], y: [0, -50, 0], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-5 left-[80%] w-1.5 h-1.5 rounded-full bg-gold-450 shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                />
                {/* Particle 4 */}
                <motion.div
                  animate={{ x: [0, -40, 0], y: [0, -70, 0], opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 17, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-32 left-[40%] w-1 h-1 rounded-full bg-gold-400 shadow-[0_0_6px_rgba(212,175,55,0.6)]"
                />
              </div>

            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
