import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function SMILoadingScreen() {
  const { t } = useTranslation('common');

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/30 to-white pointer-events-none" />

      <div className="relative z-10 text-center w-full max-w-[90vw] md:max-w-2xl mx-auto">
        {/* Logo/Brand Section */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mb-8 sm:mb-12"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex items-center justify-center p-3 sm:p-4">
              <img 
                src="/logo.jpeg" 
                alt="Logo Sekolah Mentor Indonesia - Platform Mentoring Content Creator" 
                className="w-full h-full object-contain rounded-lg sm:rounded-xl"
              />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-4 bg-brand-400/20 blur-2xl rounded-full -z-10"
            />
          </motion.div>
          <h1 className="text-[clamp(1.5rem,5vw,3rem)] font-bold text-neutral-900 mb-3 font-display tracking-tight leading-tight">
            Sekolah Mentor Indonesia
          </h1>
          <p className="text-[clamp(0.875rem,2.5vw,1.25rem)] text-neutral-500 font-sans font-medium tracking-wide max-w-[80%] mx-auto">
            {t('loading.tagline')}
          </p>
        </motion.div>

        {/* Minimalist Loader */}
        <div className="mt-10 md:mt-16 flex flex-col items-center">
          <div className="w-32 md:w-48 h-[3px] bg-neutral-100 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-brand-600 w-1/2 rounded-full"
            />
          </div>
          <span className="mt-4 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">
            Please Wait
          </span>
        </div>
      </div>
    </motion.div>
  );
}
