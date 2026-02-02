import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

export default function SMITestimonials() {
  const { t } = useTranslation('landing');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [direction, setDirection] = useState(1); // 1 = maju, -1 = mundur
  const sliderRef = useRef(null);

  const testimonials = [
    {
      name: "Robert leonardo tobing",
      role: "OWNER PT Sinergi kasikarya sejahtera",
      image: "/robert.jpeg",
      content:
        "Sebagai owner, tantangan terbesar saya adalah membangun sistem yang autopilot. SMI memberikan blueprint yang sangat clear tentang cara scaling tanpa mengorbankan kualitas operasional. Investasi waktu di sini benar-benar berdampak langsung pada bottom line perusahaan kami.",
    },
    {
      name: "Irvan kusuma fardiyanto",
      role: "OWNER KK Production house",
      image: "/irvan.jpeg",
      content:
        "SMI bukan cuma soal teori bisnis, tapi soal leadership dan mindset strategis. Mentor di sini membantu saya membedah bottleneck di perusahaan yang selama ini nggak saya sadari. Sekarang pengambilan keputusan jadi jauh lebih data-driven dan terukur.",
    },
    {
      name: "Rigel pawallo",
      role: "Owner Tokowadah",
      image: "/rigel.jpeg",
      content:
        "Value terbesar yang saya dapatkan adalah akses ke networking level CEO. Bertukar pikiran dengan sesama pengusaha di SMI memberikan perspektif baru yang nggak didapat di tempat lain. Ini adalah ekosistem yang tepat kalau mau akselerasi bisnis secara serius.",
    },
  ];

  // Auto-slide interval - maju mundur (back-and-forth)
  useEffect(() => {
    let interval;
    
    if (isAutoSliding) {
      interval = setInterval(() => {
        setActiveIndex((prev) => {
          let nextIndex = prev + direction;
          
          // Ubah arah jika mencapai batas
          if (nextIndex >= testimonials.length - 1) {
            setDirection(-1);
            return testimonials.length - 1;
          } else if (nextIndex <= 0) {
            setDirection(1);
            return 0;
          }
          
          return nextIndex;
        });
      }, 3000); // 3 detik per slide
    }
    
    return () => clearInterval(interval);
  }, [isAutoSliding, testimonials.length, direction]);

  // Update slider position when activeIndex changes
  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollLeft = activeIndex * slideWidth;
    }
  }, [activeIndex]);

  // Handle manual slide
  const handleSlide = (index) => {
    setActiveIndex(index);
    setIsAutoSliding(false); // Stop auto-slide when user interacts
    
    // Resume auto-slide after 5 seconds of inactivity
    setTimeout(() => {
      setIsAutoSliding(true);
    }, 5000);
  };

  // Handle touch events for mobile swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      setActiveIndex((prev) => Math.min(prev + 1, testimonials.length - 1));
      setIsAutoSliding(false);
    }
    if (touchEnd - touchStart > 50) {
      // Swipe right
      setActiveIndex((prev) => Math.max(prev - 1, 0));
      setIsAutoSliding(false);
    }
    // Reset touch values
    setTouchStart(0);
    setTouchEnd(0);
    
    // Resume auto-slide after 5 seconds
    setTimeout(() => {
      setIsAutoSliding(true);
    }, 5000);
  };

  return (
    <section id="testimoni" className="py-16 sm:py-24 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-4 block font-sans">
            {t('testimonials.badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-6 font-display leading-tight">
            {t('testimonials.title')}
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 max-w-2xl mx-auto font-sans">
            {t('testimonials.description')}
          </p>
        </div>

        {/* Testimonials Layout - Responsive */}
        <div className="relative max-w-7xl mx-auto">
          {/* Desktop: Show all 3 testimonials in grid */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {testimonials.map((testi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-neutral-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-soft flex flex-col justify-between h-full"
              >
                <div>
                  <Quote className="text-brand-200 mb-6 w-7 h-7 sm:w-8 sm:h-8" />
                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-8 font-sans italic">
                    "{testi.content}"
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-200 flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                    <img 
                      src={testi.image} 
                      alt={`${testi.name} - ${testi.role} - Testimoni Sekolah Mentor Indonesia`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-xs sm:text-sm font-display">{testi.name}</h4>
                    <p className="text-neutral-400 text-[9px] sm:text-[10px] uppercase tracking-wider font-sans leading-tight">
                      {testi.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: Slider showing 1 testimonial at a time */}
          <div className="lg:hidden relative max-w-3xl mx-auto">
            <div 
              ref={sliderRef}
              className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Hide scrollbar for WebKit browsers */}
              <style jsx>{
                `.overflow-x-auto::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              <div className="flex gap-6">
                {testimonials.map((testi, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="min-w-full max-w-full snap-center bg-neutral-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-soft flex flex-col justify-between"
                  >
                    <div>
                      <Quote className="text-brand-200 mb-6 w-7 h-7 sm:w-8 sm:h-8" />
                      <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-8 font-sans italic">
                        "{testi.content}"
                      </p>
                    </div>

                    <div className="pt-6 border-t border-neutral-200 flex items-center gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                        <img 
                          src={testi.image} 
                          alt={testi.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900 text-xs sm:text-sm font-display">{testi.name}</h4>
                        <p className="text-neutral-400 text-[9px] sm:text-[10px] uppercase tracking-wider font-sans leading-tight">
                          {testi.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Slider Indicators for Mobile */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'bg-brand-600 w-6' : 'bg-neutral-300'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
