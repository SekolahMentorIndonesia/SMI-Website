import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";

const TestimonialCard = ({ name, niche, followers, story, rating = 5 }) => (
  <div className="bg-white border border-neutral-100 p-6 rounded-2xl mb-6 break-inside-avoid shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex gap-1 mb-4">
       {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-brand-500 text-brand-500" />
       ))}
    </div>
    <p className="text-neutral-600 mb-6 text-sm leading-relaxed">"{story}"</p>
    <div className="flex items-center gap-3">
       <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 font-bold border border-brand-100 shrink-0">
          {name.charAt(0)}
       </div>
       <div>
          <h4 className="text-neutral-900 font-semibold text-sm">{name}</h4>
          <p className="text-neutral-500 text-xs">{niche} • {followers}</p>
       </div>
    </div>
  </div>
);

const MarqueeColumn = ({ items, duration = 40, direction = "up" }) => {
  // Duplicate items for seamless loop
  const marqueeItems = [...items, ...items];
  
  return (
    <motion.div
      initial={{ y: direction === "up" ? "0%" : "-50%" }}
      animate={{ y: direction === "up" ? "-50%" : "0%" }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
      }}
      className="flex flex-col"
    >
      {marqueeItems.map((story, index) => (
        <TestimonialCard key={`${story.name}-${index}`} {...story} />
      ))}
    </motion.div>
  );
};

export default function SMIHomeSuccessStories() {
  const { t } = useTranslation('home');
  const stories = t('stories.items', { returnObjects: true });
  
  // Split stories roughly evenly
  const half = Math.ceil(stories.length / 2);
  const col1 = stories.slice(0, half);
  const col2 = stories.slice(half);
  
  return (
    <section id="stories" className="bg-white py-24 sm:py-32 overflow-hidden relative">
      {/* Background Gradients */}
       <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-50/50 blur-[120px] rounded-full pointer-events-none opacity-60" />
       <div className="absolute bottom-0 left-0 w-1/2 h-full bg-blue-50/50 blur-[120px] rounded-full pointer-events-none opacity-60" />

       <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left Content */}
          <div className="max-w-xl text-center lg:text-left">
             <span className="text-brand-600 font-bold tracking-widest text-xs uppercase mb-4 block">
                {t('stories.badge')}
             </span>
             <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-[1.1] font-display">
                {t('stories.title')}
             </h2>
             <p className="text-neutral-600 text-lg leading-relaxed mb-8">
                {t('stories.subtitle')}
             </p>
             {/* Removed View All Button */}
          </div>
          
          {/* Right Content - Scrolling Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-[600px] overflow-hidden relative">
             {/* Gradient Masks for Fade In/Out */}
             <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
             
             {/* Column 1 - Up */}
             <div className="flex flex-col relative z-10">
                 <MarqueeColumn items={col1} direction="up" duration={45} />
             </div>
             {/* Column 2 - Down */}
            <div className="flex-col relative z-10 hidden sm:flex">
                <MarqueeColumn items={col2} direction="down" duration={55} />
            </div>
          </div>
       </div>
    </section>
  )
}
