import { motion } from "framer-motion";
import { ArrowRight, UserPlus, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SMIHomeCTA() {
  const { t } = useTranslation('home');

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="bg-brand-600 rounded-3xl sm:rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-brand-200">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-6 font-display leading-tight">
              {t('cta.title')}
            </h2>
            <p className="text-brand-100 text-base sm:text-lg md:text-xl mb-10 sm:mb-12 max-w-2xl mx-auto font-sans leading-relaxed">
              {t('cta.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-white text-brand-600 font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-brand-900/20 group transition-all text-sm sm:text-base"
              >
                <UserPlus className="w-5 h-5" />
                {t('cta.cta_register')}
                <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-transparent text-white border border-brand-400 font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
              >
                <BookOpen className="w-5 h-5" />
                {t('cta.cta_packages')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
