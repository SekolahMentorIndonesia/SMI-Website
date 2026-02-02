import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Users, Globe, MessageCircle, Calendar, ArrowRight, Heart } from "lucide-react";

export default function SMIHomeCommunity() {
  const { t } = useTranslation('home');

  const icons = [
    <Users key="0" className="text-brand-600 w-5 h-5 sm:w-6 sm:h-6" />,
    <MessageCircle key="1" className="text-brand-600 w-5 h-5 sm:w-6 sm:h-6" />,
    <Calendar key="2" className="text-brand-600 w-5 h-5 sm:w-6 sm:h-6" />,
    <Heart key="3" className="text-brand-600 w-5 h-5 sm:w-6 sm:h-6" />
  ];

  const benefits = t('community.benefits', { returnObjects: true }) || [];

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="komunitas" className="py-20 lg:py-24 px-4 sm:px-6 bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left z-10 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 font-bold text-xs uppercase tracking-wider mb-6"
            >
              <Users className="w-3.5 h-3.5" />
              {t('community.badge')}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 font-display leading-tight tracking-tight"
            >
              {t('community.title')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base lg:text-lg text-neutral-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              {t('community.subtitle')}
            </motion.p>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-12 text-left">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-neutral-100 transition-all hover:shadow-md"
                >
                  <div className="p-2.5 sm:p-3 rounded-xl bg-brand-50 shrink-0">
                    {icons[idx]}
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1 text-sm sm:text-base">{benefit.title}</h4>
                    <p className="text-xs sm:text-sm text-neutral-500 leading-snug">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToPricing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-brand-100 transition-all hover:bg-brand-700"
            >
              {t('community.cta')}
              <ArrowRight className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
            </motion.button>
          </div>

          {/* Right Visual Placeholder */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none">
            <div className="relative p-6 sm:p-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative bg-gradient-to-br from-brand-50 to-white border border-brand-100 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-sm z-10"
              >
                {/* Grid of "Members" - Visualization */}
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 md:gap-4 relative z-10">
                  {[...Array(16)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.03 }}
                      className={`aspect-square rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold shadow-md
                        ${i % 4 === 0 ? 'bg-brand-500' : 
                          i % 4 === 1 ? 'bg-blue-400' : 
                          i % 4 === 2 ? 'bg-indigo-400' : 'bg-brand-300'}`}
                    >
                      <Users className="w-[18px] h-[18px] md:w-5 md:h-5" />
                    </motion.div>
                  ))}
                </div>

                {/* Floating Stats - Integrated with consistent layout */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="flex-1 min-w-[140px] bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-neutral-900">{t('community.stats.members')}</div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{t('community.stats.members_label')}</div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 }}
                    className="flex-1 min-w-[140px] bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-neutral-900">{t('community.stats.cities')}</div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{t('community.stats.cities_label')}</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Decorative background elements that won't cut off content */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200/20 rounded-full blur-3xl -z-0" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -z-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
