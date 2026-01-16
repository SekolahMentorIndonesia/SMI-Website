import { motion } from "framer-motion";

export default function SMIFounderStory() {
  const VIDEO_ID = "j0lv9bNS2mE";

  return (
    <section id="founder-story" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl sm:rounded-[2rem] border border-neutral-100 shadow-2xl shadow-neutral-200/50 bg-white overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 p-6 sm:p-10 lg:p-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:order-1 order-2"
            >
              <span className="inline-block text-brand-600 font-bold tracking-[0.18em] uppercase text-[10px] sm:text-xs mb-4">
                Perjalanan di Balik Sekolah Mentor Indonesia
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 font-display leading-tight">
                Membangun Kepercayaan Melalui Kisah Nyata
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
                Cerita nyata bagaimana SMI dibangun dari pengalaman gagal, belajar, dan mendampingi wirausahawan secara langsung.
              </p>
              <div className="bg-brand-50/60 border-l-4 border-brand-300 rounded-xl p-4 sm:p-5 mb-6">
                <p className="text-neutral-700 text-sm sm:text-base italic">
                  “SMI tidak dibangun dari teori, tapi dari pengalaman langsung mendampingi wirausahawan menghadapi masalah nyata di lapangan.”
                </p>
              </div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center">
                  M
                </div>
                <div>
                  <p className="text-neutral-900 font-bold">Mohammad Iqbal Alhafizh</p>
                  <p className="text-neutral-500 text-sm font-medium">Founder & Mentor Utama</p>
                  <p className="text-neutral-400 text-xs mt-1">Sekolah Mentor Indonesia</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#program"
                  className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all shadow-lg shadow-brand-200"
                >
                  Lihat Program Kami
                </a>
                <a
                  href="#kontak"
                  className="w-full sm:w-auto bg-white text-neutral-700 border border-neutral-200 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base hover:bg-neutral-50 transition-all"
                >
                  Mulai Konsultasi
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:order-2 order-1"
            >
              <div className="relative rounded-3xl overflow-hidden border border-neutral-100 shadow-2xl bg-neutral-900">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=0&controls=1&rel=0&modestbranding=1`}
                    title="Mohammad Iqbal Alhafizh - Founder Sekolah Mentor Indonesia"
                    frameBorder="0"
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
