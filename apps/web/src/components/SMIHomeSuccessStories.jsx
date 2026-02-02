import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

export default function SMIHomeSuccessStories() {
  const { t } = useTranslation('home');
  const stories = t('stories.items', { returnObjects: true });
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [direction, setDirection] = useState(1); // 1 = maju, -1 = mundur
  
  // Auto-slide interval - maju mundur (back-and-forth)
  useEffect(() => {
    let interval;
    
    if (isAutoSliding) {
      interval = setInterval(() => {
        setActiveIndex((prev) => {
          let nextIndex = prev + direction;
          
          // Ubah arah jika mencapai batas
          if (nextIndex >= stories.length - 1) {
            setDirection(-1);
            return stories.length - 1;
          } else if (nextIndex <= 0) {
            setDirection(1);
            return 0;
          }
          
          return nextIndex;
        });
      }, 3000); // 3 detik per slide
    }
    
    return () => clearInterval(interval);
  }, [isAutoSliding, stories.length, direction]);
  
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
      setActiveIndex((prev) => Math.min(prev + 1, stories.length - 1));
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
          <span className="text-brand-600 font-bold tracking-widest uppercase text-[10px] sm:text-xs mb-4 block">
            {t('stories.badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-neutral-900 mb-6 font-display leading-tight">
            {t('stories.title')}
          </h2>
        </div>

        {/* Desktop: Show all stories in grid */}
        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all group flex flex-col h-full"
            >
              <div className="flex-grow">
                <div className="w-10 h-1 bg-brand-600/20 rounded-full mb-6 sm:mb-8 group-hover:w-16 transition-all duration-500"></div>
                <p className="text-[15px] text-neutral-600 leading-relaxed font-sans mb-8 italic">
                  "{story.story}"
                </p>
              </div>

              <div className="pt-8 border-t border-neutral-50">
                <p className="text-lg font-bold text-neutral-900 font-display mb-1 group-hover:text-brand-600 transition-colors">
                  {story.name}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-sans">
                  <span className="font-medium text-neutral-500">{story.niche}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-200"></span>
                  <span className="text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-md">{story.followers} {t('stories.followers_suffix')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile & Tablet: Slider showing 1 story at a time */}
        <div className="lg:hidden relative max-w-3xl mx-auto">
          {/* Slider Container */}
          <div 
            ref={sliderRef}
            className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Hide scrollbar for WebKit browsers */}
            <style jsx>{`
              .overflow-x-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            <div className="flex gap-6">
              {stories.map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="min-w-full max-w-full snap-center bg-white rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all group flex flex-col h-full"
                >
                  <div className="flex-grow">
                    <div className="w-10 h-1 bg-brand-600/20 rounded-full mb-6 sm:mb-8 group-hover:w-16 transition-all duration-500"></div>
                    <p className="text-[15px] text-neutral-600 leading-relaxed font-sans mb-8 italic">
                      "{story.story}"
                    </p>
                  </div>

                  <div className="pt-8 border-t border-neutral-50">
                    <p className="text-lg font-bold text-neutral-900 font-display mb-1 group-hover:text-brand-600 transition-colors">
                      {story.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-sans">
                      <span className="font-medium text-neutral-500">{story.niche}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-200"></span>
                      <span className="text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-md">{story.followers} {t('stories.followers_suffix')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Slider Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {stories.map((_, index) => (
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
    </section>
  );
}
