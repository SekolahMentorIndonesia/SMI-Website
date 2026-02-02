import { Target, Compass, History } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function SMIAbout() {
  const { t } = useTranslation('landing');

  return (
    <section id="about" className="py-20 lg:py-32 px-4 sm:px-6 bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-4 block font-sans">
              {t('about.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-6 font-display leading-tight">
              {t('about.title')}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-neutral-600 mb-8 leading-relaxed font-sans max-w-2xl mx-auto lg:mx-0">
              {t('about.description')}
            </p>

            <div className="space-y-6 text-left max-w-2xl mx-auto lg:mx-0">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-soft flex items-center justify-center border border-neutral-100">
                  <Target className="text-brand-600 w-[22px] h-[22px] sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-neutral-900 font-bold mb-1 font-display text-sm sm:text-base">{t('about.visi_title')}</h4>
                  <p className="text-neutral-500 text-xs sm:text-sm font-sans leading-relaxed">
                    {t('about.visi_desc')}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-soft flex items-center justify-center border border-neutral-100">
                  <Compass className="text-brand-600 w-[22px] h-[22px] sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-neutral-900 font-bold mb-1 font-display text-sm sm:text-base">{t('about.misi_title')}</h4>
                  <p className="text-neutral-500 text-xs sm:text-sm font-sans leading-relaxed">
                    {t('about.misi_desc')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: History/Context Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl shadow-soft border border-neutral-100"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6 font-sans">
              {t('about.history_badge')}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-6 font-display">{t('about.history_title')}</h3>
            <div className="space-y-4 text-neutral-600 font-sans leading-relaxed text-xs sm:text-sm">
              <p>
                {t('about.history_p1')}
              </p>
              <p>
                {t('about.history_p2')}
              </p>
              <p>
                {t('about.history_p3')}
              </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-neutral-100 flex items-center gap-4">
              <img 
                src="/pt-logo.jpeg" 
                alt="Logo PT Sekolah Mentor Indonesia" 
                className="h-8 sm:h-10 w-auto object-contain rounded"
              />
              <div>
                <p className="text-neutral-900 font-bold text-xs sm:text-sm font-display leading-none">{t('about.parent_company')}</p>
                <p className="text-neutral-400 text-[9px] sm:text-[10px] font-sans mt-1">{t('about.parent_desc')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
