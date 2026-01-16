import {
  TrendingUp,
  Users,
  Lightbulb,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function SMIPrograms() {
  const { t } = useTranslation('landing');

  const programs = [
    {
      icon: <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t('programs.list.mindset.title'),
      description: t('programs.list.mindset.desc'),
    },
    {
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t('programs.list.sales.title'),
      description: t('programs.list.sales.desc'),
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t('programs.list.leadership.title'),
      description: t('programs.list.leadership.desc'),
    },
    {
      icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t('programs.list.system.title'),
      description: t('programs.list.system.desc'),
    },
  ];

  return (
    <section id="program" className="py-20 lg:py-32 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 text-brand-600 font-bold mb-4 font-sans"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase text-[10px]">
              {t('programs.badge')}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-6 font-display leading-tight"
          >
            {t('programs.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-neutral-500 max-w-2xl mx-auto font-sans"
          >
            {t('programs.description')}
          </motion.p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-soft hover:shadow-md transition-all duration-300 flex flex-col h-full"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                {program.icon}
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-3 font-display">
                {program.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-6 font-sans flex-1">
                {program.description}
              </p>

              <div className="pt-6 border-t border-neutral-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest font-sans">
                  {t('programs.level')} 0{index + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-brand-600 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
