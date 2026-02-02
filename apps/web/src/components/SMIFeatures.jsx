import { Zap, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function SMIFeatures() {
  const { t } = useTranslation('landing');
  
  const features = [
    {
      icon: Zap,
      key: 'interactive'
    },
    {
      icon: Users,
      key: 'community'
    },
    {
      icon: Shield,
      key: 'certificate'
    }
  ];

  return (
    <section id="features" className="py-20 lg:py-32 px-4 sm:px-6 bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-4 block font-sans">
            {t('features.badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-6 font-display leading-tight">
            {t('features.title')}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-sans">
            {t('features.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-neutral-100"
              >
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4 font-display">
                  {t(`features.list.${feature.key}.title`)}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {t(`features.list.${feature.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
