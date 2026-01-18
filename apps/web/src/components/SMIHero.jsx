import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function SMIHero() {
  const { t } = useTranslation('landing');

  return (
    <section className="relative min-h-[100dvh] pt-24 sm:pt-32 pb-16 overflow-hidden bg-white flex items-center">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-brand-50/50 blur-[80px] sm:blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-brand-50/30 blur-[80px] sm:blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 font-semibold text-[10px] sm:text-xs mb-6 font-sans">
              <span className="flex h-1.5 w-1.5 rounded-full bg-brand-600"></span>
              {t('hero.badge')}
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 leading-tight mb-6 tracking-tight font-display">
              {t('hero.headline_main')} <br />
              <span className="text-brand-600">
                {t('hero.headline_sub')}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base lg:text-lg text-neutral-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 font-sans">
              {t('hero.subheadline')}
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start mb-10">
              <a
                href="/app"
                className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl transition-all shadow-soft flex items-center justify-center gap-2 font-sans"
              >
                {t('hero.cta')}
                <ArrowRight className="w-4.5 h-4.5" />
              </a>
            </div>

            {/* Trust Points */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8 pt-8 border-t border-neutral-100 items-center lg:items-start">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-brand-600 shrink-0" />
                <span className="text-neutral-700 font-medium text-xs sm:text-sm font-sans">{t('hero.trust_points.mentor')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-brand-600 shrink-0" />
                <span className="text-neutral-700 font-medium text-xs sm:text-sm font-sans">{t('hero.trust_points.curriculum')}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Visual Section - Founder Portrait with Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-3xl lg:rounded-[2rem] overflow-hidden shadow-2xl border border-neutral-100 bg-white max-w-[420px] sm:max-w-[480px] lg:max-w-[440px] xl:max-w-[480px] mx-auto lg:ml-auto">
              <div className="relative w-full h-full aspect-[4/5] sm:aspect-[3/4]">
                <img
                  src="/mohamad-iqbal-alhafizh-founder-smi.jpeg"
                  alt="Mohamad Iqbal Alhafizh - Founder Sekolah Mentor Indonesia"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                  <p className="text-white font-semibold text-sm sm:text-base leading-relaxed italic">
                    “Built from real entrepreneurial battles — value-first, human-centered.”
                  </p>
                  <p className="text-brand-100 text-[11px] sm:text-xs font-bold mt-2">
                    Mohamad Iqbal Alhafizh · Founder & Business Mentor
                  </p>
                </div>
              </div>
            </div>

            {/* Minimal Decorative Elements */}
            <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 bg-brand-50 rounded-full -z-10 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 w-20 h-20 sm:w-32 sm:h-32 bg-brand-50/50 rounded-full -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
