import { ArrowRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function SMICTA() {
  const { t } = useTranslation('landing');

  return (
    <section id="kontak" className="py-16 sm:py-24 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-brand-600 rounded-3xl sm:rounded-4xl text-left relative overflow-hidden"
        >
          {/* Subtle Decorative Circle */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500 rounded-full opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-700 rounded-full opacity-20"></div>

          <div className="relative z-10 flex flex-col items-stretch">

            {/* Right: Content */}
            <div className="w-full p-6 sm:p-10 md:p-16 lg:p-20 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 font-display leading-tight">
                {t('cta.title')}
              </h2>
              <p className="text-brand-100 mb-8 md:mb-10 text-sm sm:text-base md:text-lg font-sans leading-relaxed opacity-90">
                {t('cta.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://wa.me/6287744556696"
                  className="bg-white text-brand-600 font-bold text-sm sm:text-base px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-neutral-50 transition-all font-sans"
                >
                  {t('cta.join')}
                  <ArrowRight className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://wa.me/6287744556696"
                  className="bg-transparent text-white border border-white/30 font-bold text-sm sm:text-base px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all font-sans backdrop-blur-sm"
                >
                  <MessageSquare className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                  {t('cta.consultation')}
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
