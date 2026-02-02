import { motion } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SMIHomeLibrary() {
  const { t } = useTranslation('home');
  const filters = t('library.filters', { returnObjects: true });

  return (
    <section id="library" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-12 lg:mb-16 gap-8 text-center lg:text-left">
          <div className="max-w-xl mx-auto lg:mx-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 font-display tracking-tight leading-tight">
              {t('library.title')}
            </h2>
            <p className="text-neutral-500 text-sm sm:text-base md:text-lg font-sans">
              {t('library.subtitle')}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-end gap-2 sm:gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs md:text-sm font-bold bg-neutral-50 text-neutral-400 border border-neutral-100 cursor-not-allowed transition-all"
                disabled
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="relative overflow-hidden bg-neutral-50/50 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] border border-dashed border-neutral-200 py-12 sm:py-16 md:py-24 px-6 sm:px-8">
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-brand-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-brand-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center max-w-2xl mx-auto relative z-10"
          >
            <div className="relative mb-8">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center text-brand-600 shadow-xl shadow-brand-100/20">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-neutral-900 mb-4 font-display tracking-tight">
              {t('library.empty_state.title')}
            </h3>
            <p className="text-neutral-600 text-sm sm:text-base lg:text-lg font-sans leading-relaxed mb-10 max-w-[90%] sm:max-w-full">
              {t('library.empty_state.description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-3 text-neutral-400 text-xs sm:text-sm font-bold tracking-wide">
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></div>
                {t('library.empty_state.curating')}
              </div>
              <div className="flex items-center gap-3 text-neutral-400 text-xs sm:text-sm font-bold tracking-wide">
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse delay-75"></div>
                {t('library.empty_state.gradual_update')}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Link */}
        <div className="flex justify-center mt-12 lg:mt-16">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/library'}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-neutral-900 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-neutral-200 group transition-all"
          >
            {t('library.cta_progress')}
            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
