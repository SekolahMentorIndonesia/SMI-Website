import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CheckCircle2, GraduationCap, Users, Lightbulb } from "lucide-react";

export default function SMIAbout() {
  const { t } = useTranslation('landing');

  const features = [
    { icon: GraduationCap, label: "Edukasi Praktis", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Users, label: "Mentoring Intensif", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: Lightbulb, label: "Pengembangan Diri", color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <section id="about-smi" className="py-24 lg:py-32 px-4 sm:px-8 bg-neutral-50/50 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Column - Sticky Title & Logo */}
          <motion.div 
            className="lg:sticky lg:top-32"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 font-bold text-[10px] tracking-widest uppercase mb-6">
                {t('introduction.badge')}
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-[1.1] mb-8">
                {t('introduction.title')}
              </h2>
              
              {/* Key Features Grid - Moved here */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mb-8">
                {features.map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center shrink-0`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="text-sm font-bold text-neutral-700">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Quote/Mission Highlight - Moved here */}
              <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
                <p className="text-brand-800 font-medium italic">
                  "Mencetak talenta yang kompeten, berkarakter, dan siap berkarya."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 text-lg leading-relaxed text-neutral-600"
          >
            <div className="relative">
              <div className="absolute -left-5 top-1 bottom-1 w-1 bg-gradient-to-b from-brand-600 to-brand-200 rounded-full hidden sm:block" />
              <p className="text-neutral-900">{t('introduction.paragraph1')}</p>
            </div>
            <p>{t('introduction.paragraph2')}</p>
            <p>{t('introduction.paragraph3')}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
