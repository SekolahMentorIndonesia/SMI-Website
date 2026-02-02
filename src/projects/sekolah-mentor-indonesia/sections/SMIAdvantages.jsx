import { Award, Users, BookOpen, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function SMIAdvantages() {
  const { t } = useTranslation('home');

  const advantages = [
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t('advantages.list.system.title'),
      description: t('advantages.list.system.desc'),
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t('advantages.list.mentor.title'),
      description: t('advantages.list.mentor.desc'),
    },
    {
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t('advantages.list.curriculum.title'),
      description: t('advantages.list.curriculum.desc'),
    },
    {
      icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t('advantages.list.method.title'),
      description: t('advantages.list.method.desc'),
    },
  ];

  return (
    <section id="keunggulan" className="py-20 lg:py-32 px-4 sm:px-6 bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          {/* Left: Content */}
          <div className="lg:col-span-1 text-center lg:text-left">
            <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-4 block font-sans">
              {t('advantages.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-6 font-display leading-tight">
              {t('advantages.title')}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-neutral-600 mb-8 leading-relaxed font-sans max-w-2xl mx-auto lg:mx-0">
              {t('advantages.description')}
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">100%</p>
                <p className="text-neutral-500 text-[10px] sm:text-xs font-sans uppercase tracking-wider">{t('advantages.stats.satisfaction')}</p>
              </div>
              <div className="w-px h-8 bg-neutral-200"></div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">500+</p>
                <p className="text-neutral-500 text-[10px] sm:text-xs font-sans uppercase tracking-wider">{t('advantages.stats.alumni')}</p>
              </div>
            </div>
          </div>

          {/* Right: Grid of Advantages */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {advantages.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-soft"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-50 text-brand-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-3 font-display">{item.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
