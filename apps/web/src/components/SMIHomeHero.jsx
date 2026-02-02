import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function SMIHomeHero() {
  const { t } = useTranslation('home');
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    } else {
      navigate("/login"); // Redirect to login page instead of mock login
    }
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center pt-24 pb-12 sm:pt-32 sm:pb-24 overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full sm:w-1/2 h-full bg-brand-50/30 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full sm:w-1/3 h-1/2 bg-brand-50/20 blur-3xl rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-[10px] sm:text-xs md:text-sm font-bold mb-6 lg:mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="uppercase tracking-wider">{t('hero.badge')}</span>
          </div>

          <h1 className="text-[clamp(1.75rem,8vw,3.75rem)] font-bold text-neutral-900 mb-6 font-display leading-[1.15] lg:leading-[1.1] tracking-tight">
            {t('hero.title_part1')} <span className="text-brand-600">{t('hero.title_part2')}</span> {t('hero.title_part3')}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 mb-8 lg:mb-10 font-sans leading-relaxed max-w-xl mx-auto lg:mx-0">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartLearning}
              className="w-full sm:w-auto bg-brand-600 text-white px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-xl shadow-brand-200 flex items-center justify-center gap-3 group transition-all"
            >
              {isAuthenticated ? t('hero.cta_dashboard') : t('hero.cta_start')}
              <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('paket')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-white text-neutral-900 border-2 border-neutral-100 px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all"
            >
              {t('hero.cta_packages')}
            </motion.button>
          </div>

          {/* Social Proof Mini */}
          <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-neutral-200 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              <span className="text-neutral-900 font-bold">1,200+</span> {t('hero.social_proof')}
            </p>
          </div>
        </motion.div>

        {/* Right Content - Visual representation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 bg-white p-6 rounded-[2rem] shadow-2xl border border-neutral-100 max-w-sm ml-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-sm">{t('hero.curriculum_title')}</h3>
                <p className="text-[10px] text-neutral-400">{t('hero.curriculum_subtitle')}</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                t('hero.curriculum_items.branding'),
                t('hero.curriculum_items.editing'),
                t('hero.curriculum_items.monetization'),
                t('hero.curriculum_items.community')
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100 group hover:border-brand-200 hover:bg-white transition-all">
                  <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-neutral-700">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Abstract Floating Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-100/50 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-100/30 rounded-full blur-3xl animate-pulse delay-700" />
        </motion.div>
      </div>
    </section>
  );
}
