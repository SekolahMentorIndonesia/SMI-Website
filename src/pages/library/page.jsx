import { motion } from "framer-motion";
import { BookOpen, Sparkles, MessageSquare, ArrowLeft } from "lucide-react";
import NavbarMain from "../../components/NavbarMain";
import SMIHomeFooter from "../../components/SMIHomeFooter";
import SMIAIAssistant from "../../projects/sekolah-mentor-indonesia/sections/SMIAIAssistant";

export default function LibraryPage() {

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarMain />
      
      <main className="flex-grow pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-neutral-400 mb-4 sm:mb-6 hover:text-brand-600 transition-colors cursor-pointer group"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs sm:text-sm font-medium">Kembali</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-5xl font-bold text-neutral-900 mb-3 sm:mb-4 font-display"
            >
              Perpustakaan Pembelajaran
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-neutral-500 text-sm sm:text-base md:text-lg max-w-2xl font-sans"
            >
              Kumpulan materi edukatif yang akan terus diperbarui secara bertahap untuk menemani perjalanan kreatif Anda.
            </motion.p>
          </div>

          {/* Content Section */}
            <div className="min-h-[400px] sm:min-h-[500px] flex items-center justify-center border border-neutral-100 rounded-3xl sm:rounded-[3rem] bg-neutral-50/30 relative overflow-hidden">
              {/* Background Decorative Elements */}
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-brand-50/50 rounded-full blur-3xl -mr-24 -mt-24 sm:-mr-32 sm:-mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-brand-50/50 rounded-full blur-3xl -ml-24 -mb-24 sm:-ml-32 sm:-mb-32"></div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-10 text-center px-4 sm:px-6 max-w-xl"
              >
                {/* Illustration Icon */}
                <div className="relative inline-block mb-6 sm:mb-10">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-2xl sm:rounded-[2.5rem] shadow-xl shadow-neutral-200/50 flex items-center justify-center text-brand-600">
                    <BookOpen className="w-9 h-9 sm:w-[48px] sm:h-[48px]" strokeWidth={1.2} />
                  </div>
                  <motion.div 
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 bg-brand-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200"
                  >
                    <Sparkles className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
                  </motion.div>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-neutral-900 mb-4 sm:mb-6 font-display">
                  Materi sedang dipersiapkan
                </h2>
                <p className="text-neutral-600 text-sm sm:text-base md:text-lg mb-8 sm:mb-12 leading-relaxed font-sans">
                  Saat ini kami sedang menyiapkan materi pembelajaran awal yang berkualitas. Konten akan ditambahkan secara bertahap melalui dashboard sistem kami.
                </p>

                {/* Real Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <motion.button
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const aiBtn = document.querySelector('[data-ai-trigger]');
                      if (aiBtn) aiBtn.click();
                    }}
                    className="w-full sm:w-auto bg-brand-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm shadow-xl shadow-brand-100 flex items-center justify-center gap-3 group"
                  >
                    <MessageSquare className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
                    Tanya Asisten
                  </motion.button>
                </div>
              </motion.div>
            </div>
        </div>
      </main>

      <SMIHomeFooter />
      <SMIAIAssistant />
    </div>
  );
}
