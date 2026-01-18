import { Package, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function SMIProducts() {
  const { t } = useTranslation('landing');
  return (
    <section id="products" className="py-20 lg:py-32 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-4 block font-sans">
            {t('products.badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-6 font-display leading-tight">
            {t('products.title')}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-sans">
            {t('products.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl border border-neutral-100 p-8 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-6">
              <Package className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-display">{t('products.basic.title')}</h3>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              {t('products.basic.description')}
            </p>
            <ul className="space-y-2 text-sm text-neutral-600">
              {t('products.basic.features', { returnObjects: true }).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-brand-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl border border-neutral-100 p-8 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-display">{t('products.advanced.title')}</h3>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              {t('products.advanced.description')}
            </p>
            <ul className="space-y-2 text-sm text-neutral-600">
              {t('products.advanced.features', { returnObjects: true }).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-brand-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl border border-neutral-100 p-8 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-6">
              <Star className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-display">{t('products.mentorship.title')}</h3>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              {t('products.mentorship.description')}
            </p>
            <ul className="space-y-2 text-sm text-neutral-600">
              {t('products.mentorship.features', { returnObjects: true }).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-brand-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
