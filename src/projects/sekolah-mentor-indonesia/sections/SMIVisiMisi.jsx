import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function SMIVisiMisi() {
  const { t } = useTranslation('landing');

  return (
    <section id="visi-misi" className="py-20 lg:py-32 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-xs mb-4 block font-sans">
            {t('about.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-12 font-display leading-tight">
            {t('about.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visi */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-neutral-50 p-8 sm:p-10 lg:p-12 rounded-2xl sm:rounded-3xl shadow-soft border border-neutral-100"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-5 font-display">{t('about.visi_title')}</h3>
              <p className="text-neutral-600 font-sans leading-relaxed text-sm sm:text-base">
               {t('about.visi_desc')}
              </p>
            </motion.div>
            
            {/* Misi */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-neutral-50 p-8 sm:p-10 lg:p-12 rounded-2xl sm:rounded-3xl shadow-soft border border-neutral-100"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-5 font-display">{t('about.misi_title')}</h3>
              <ul className="space-y-3 text-neutral-600 font-sans leading-relaxed text-sm sm:text-base">
                {t('about.misi_desc', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-brand-600 font-bold mt-1.5 text-xs">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
