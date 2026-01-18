import { Award, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function SMIBenefits() {
  const { t } = useTranslation('landing');
  
  const benefits = [
    {
      icon: Award,
      key: 'mentor'
    },
    {
      icon: Clock,
      key: 'flexible'
    },
    {
      icon: Target,
      key: 'portfolio'
    }
  ];

  return (
    <section id="benefits" className="py-20 lg:py-32 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-4 block font-sans">
            {t('benefits.badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-6 font-display leading-tight">
            {t('benefits.title')}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-sans">
            {t('benefits.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.key} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2 font-display">
                      {t(`benefits.list.${benefit.key}.title`)}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                      {t(`benefits.list.${benefit.key}.description`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-3xl p-8 lg:p-12"
          >
            <h3 className="text-2xl font-bold text-neutral-900 mb-6 font-display">
              {t('cta.title')}
            </h3>
            <p className="text-neutral-600 mb-8 leading-relaxed">
              {t('cta.description')}
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brand-600 rounded-full"></div>
                <span className="text-neutral-700">{t('programs.list.mindset.title')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brand-600 rounded-full"></div>
                <span className="text-neutral-700">{t('programs.list.sales.title')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brand-600 rounded-full"></div>
                <span className="text-neutral-700">{t('programs.list.leadership.title')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
