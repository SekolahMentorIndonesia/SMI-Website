import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function SMIAbout() {
  const { t } = useTranslation('landing');

  return (
    <section id="about-smi" className="py-20 lg:py-28 px-4 sm:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="lg:sticky lg:top-24">
              <span className="text-brand-600 font-semibold tracking-[0.18em] uppercase text-[11px] mb-4 block">
                {t('introduction.badge')}
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900">
                {t('introduction.title')}
              </h2>
              <div className="mt-4 w-20 h-[3px] bg-brand-600 rounded-full"></div>
              <div className="mt-6">
                <img 
                  src="/logo.jpeg" 
                  alt="Logo Sekolah Mentor Indonesia" 
                  className="w-40 h-auto object-contain"
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-neutral-700 space-y-6">
              <p className="leading-relaxed">
                {t('introduction.paragraph1')}
              </p>
              <p className="leading-relaxed">
                {t('introduction.paragraph2')}
              </p>
              <p className="leading-relaxed">
                {t('introduction.paragraph3')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
