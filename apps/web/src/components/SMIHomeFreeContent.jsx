import { motion } from "framer-motion";
import { Video, FileText, Play } from "lucide-react";

export default function SMIHomeFreeContent() {
  const contents = [
    {
      title: "Mindset Konten Kreator 2024",
      level: "Pemula",
      format: "Video",
      icon: <Video className="w-4.5 h-4.5" />,
      duration: "15 Menit",
    },
    {
      title: "Ide Konten Tanpa Tampil Wajah",
      level: "Pemula",
      format: "Artikel",
      icon: <FileText className="w-4.5 h-4.5" />,
      duration: "5 Menit Baca",
    },
    {
      title: "Optimasi Bio Instagram",
      level: "Pemula",
      format: "Video",
      icon: <Video className="w-4.5 h-4.5" />,
      duration: "12 Menit",
    },
    {
      title: "Cara Menentukan Niche Konten",
      level: "Pemula",
      format: "Video",
      icon: <Video className="w-4.5 h-4.5" />,
      duration: "20 Menit",
    },
  ];

  return (
    <section id="konten" className="py-16 sm:py-24 px-4 sm:px-6 bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="text-center md:text-left">
            <span className="text-brand-600 font-bold tracking-widest uppercase text-[10px] sm:text-xs mb-3 block">
              Eksplorasi Materi
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 font-display leading-tight">
              Konten Gratis untuk Pemula
            </h2>
          </div>
          <button className="text-brand-600 font-bold text-sm flex items-center justify-center md:justify-start gap-2 hover:gap-3 transition-all">
            Lihat Semua Konten <Play className="w-3.5 h-3.5" fill="currentColor" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {contents.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all cursor-pointer flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <span className="px-3 py-1.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  100% Gratis
                </span>
                <div className="text-neutral-300 group-hover:text-brand-600 transition-colors bg-neutral-50 p-2.5 rounded-xl group-hover:bg-brand-50">
                  {item.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-neutral-900 mb-4 font-display leading-snug group-hover:text-brand-600 transition-colors flex-grow">
                {item.title}
              </h3>

              <div className="pt-6 border-t border-neutral-50 flex items-center justify-between text-xs text-neutral-400 font-sans">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                  <span className="font-medium text-neutral-500">{item.level}</span>
                </div>
                <span className="font-medium">{item.duration}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
