import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { ArrowRight, BookOpen, Sparkles, CheckCircle2, ArrowDown } from "lucide-react";
import { useUser } from "../../../hooks/useUser";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function SMIHomeHero() {
  const { t } = useTranslation('home');
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest).toLocaleString());

  useEffect(() => {
    const controls = animate(count, 1200, { duration: 2.5, ease: "easeOut" });
    return controls.stop;
  }, []);

  const handleConsultation = () => {
    const message = encodeURIComponent("Halo Admin SMI, saya ingin konsultasi mengenai program SMI.");
    window.open(`https://wa.me/6287744556696?text=${message}`, '_blank');
  };

  return (
    <section id="hero" className="relative min-h-[85dvh] flex items-center pt-20 pb-12 sm:pt-24 sm:pb-20 overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full sm:w-1/2 h-full bg-brand-50/30 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full sm:w-1/3 h-1/2 bg-brand-50/20 blur-3xl rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex flex-col items-center gap-4 mb-6 lg:mb-8">
            <a 
              href="https://multipriority.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Kembali ke MPB Group" 
              className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-[10px] font-medium hover:bg-neutral-200 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
              Part of MPB Group
            </a>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-[10px] sm:text-xs md:text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span className="uppercase tracking-wider">{t('hero.badge')}</span>
            </div>
          </div>

          <h1 className="text-[clamp(1.75rem,8vw,3.75rem)] font-bold text-neutral-900 mb-6 font-display leading-[1.15] lg:leading-[1.1] tracking-tight">
            {t('hero.title_part1')} <span className="text-brand-600">{t('hero.title_part2')}</span> {t('hero.title_part3')}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 mb-8 lg:mb-10 font-sans leading-relaxed max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConsultation}
              className="w-full sm:w-auto min-w-[240px] bg-brand-600 text-white px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-xl shadow-brand-200 flex items-center justify-center gap-3 group transition-all"
            >
              Konsultasi Sekarang
              <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto min-w-[240px] bg-white text-neutral-900 border-2 border-neutral-100 px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all"
            >
              {t('hero.cta_packages')}
              <ArrowDown className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Social Proof Mini */}
          <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6">
            <div className="flex -space-x-3">
              {['/irvan.jpeg', '/rigel.jpeg', '/robert.jpeg'].map((img, i) => (
                <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-neutral-200 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                  <img 
                    src={img}  
                    alt="Member SMI" 
                    loading="lazy"
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              <span className="text-neutral-900 font-bold"><motion.span>{rounded}</motion.span>+</span> {t('hero.social_proof')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
