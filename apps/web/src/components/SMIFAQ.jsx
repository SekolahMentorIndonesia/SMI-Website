import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function SMIFAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Apa saja benefit program SMI?",
      answer: "Benefit program SMI meliputi: akses ke materi premium, mentoring personal dengan expert, komunitas eksklusif, sertifikat yang diakui industri, dan kesempatan networking dengan sesama creator."
    },
    {
      question: "Bagaimana cara pendaftaran?",
      answer: "Pendaftaran sangat mudah! Cukup kunjungi website kami, pilih program yang sesuai, lengkapi form pendaftaran, dan lakukan pembayaran. Tim kami akan segera menghubungi Anda untuk proses selanjutnya."
    },
    {
      question: "Apakah program ini cocok untuk pemula?",
      answer: "Tentu saja! Kami memiliki program khusus untuk pemula dengan materi dasar yang mudah dipahami. Anda akan dibimbing step-by-step sampai siap untuk level lanjutan."
    },
    {
      question: "Apakah ada jadwal kelas tetap?",
      answer: "Program kami fleksibel! Anda bisa belajar kapan saja dengan akses materi 24/7. Untuk live session, kami sediakan jadwal rutin setiap minggu yang bisa Anda pilih sesuai waktu luang."
    },
    {
      question: "Bagaimana sistem pembayarannya?",
      answer: "Sistem pembayaran langsung tersedia di website. Pilih paket yang diinginkan dan lakukan pembayaran sesuai dengan metode yang tersedia."
    },
    {
      question: "Apakah mentor bisa dipilih sendiri?",
      answer: "Untuk program tertentu, Anda bisa memilih mentor sesuai dengan kebutuhan dan spesialisasi yang Anda inginkan. Kami akan membantu mencarikan mentor yang paling cocok untuk Anda."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-32 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-4 block font-sans">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-6 font-display leading-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 leading-relaxed font-sans">
            Temukan jawaban untuk pertanyaan umum tentang Sekolah Mentor Indonesia.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-neutral-50 rounded-2xl border border-neutral-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-brand-600 flex-shrink-0" />
                  <h3 className="font-semibold text-neutral-900 pr-4">{faq.question}</h3>
                </div>
                {activeIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                )}
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pl-14">
                      <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-neutral-600 mb-6">
            Masih ada pertanyaan? Tim kami siap membantu Anda.
          </p>
          <a href="#contact" className="bg-brand-600 text-white px-8 py-3 rounded-full font-medium hover:bg-brand-700 transition-colors inline-block">
            Hubungi Support
          </a>
        </motion.div>
      </div>
    </section>
  );
}
