import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../data/sampleData';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden bg-matte-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-charcoal-800/30 to-transparent scale-150" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-champagne-400/5 rounded-full blur-3xl" />
      </div>

      {/* Decorative Quote */}
      <div className="absolute top-20 left-10 opacity-5">
        <Quote className="w-40 h-40 text-champagne-400" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-body text-champagne-400 text-sm tracking-widest uppercase mb-4 block">
            Client Stories
          </span>
          <h2 className="section-heading">
            Voices of <span className="text-gradient-gold">Excellence</span>
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background Quote */}
            <div className="absolute top-4 left-8 opacity-10">
              <Quote className="w-12 h-12 text-champagne-400" fill="currentColor" />
            </div>

            {/* Testimonial Content */}
            <div className="relative z-10">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Quote */}
                <blockquote className="font-display text-xl md:text-2xl lg:text-3xl text-ivory-50 leading-relaxed mb-8 max-w-3xl mx-auto italic font-light">
                  "{testimonials[activeIndex].text}"
                </blockquote>

                {/* Author Info */}
                <div className="flex flex-col items-center gap-2">
                  <span className="font-display text-lg text-ivory-50">
                    {testimonials[activeIndex].name}
                  </span>
                  <div className="flex items-center gap-4 font-body text-ivory-400 text-sm">
                    <span>{testimonials[activeIndex].role}</span>
                    {testimonials[activeIndex].location && (
                      <>
                        <span className="w-1 h-1 bg-ivory-400/40 rounded-full" />
                        <span>{testimonials[activeIndex].location}</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-4 flex items-center">
              <button
                type="button"
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
                className="focus-luxury w-10 h-10 flex items-center justify-center bg-charcoal-800/80 backdrop-blur-sm rounded-full border border-ivory-400/20 text-ivory-300 hover:text-ivory-50 hover:border-champagne-400/50 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-4 flex items-center">
              <button
                type="button"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
                className="focus-luxury w-10 h-10 flex items-center justify-center bg-charcoal-800/80 backdrop-blur-sm rounded-full border border-ivory-400/20 text-ivory-300 hover:text-ivory-50 hover:border-champagne-400/50 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`focus-luxury transition-all duration-300 rounded-full ${
                  index === activeIndex
                    ? 'w-6 h-2 bg-champagne-400'
                    : 'w-2 h-2 bg-ivory-400/30 hover:bg-ivory-400/50'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
