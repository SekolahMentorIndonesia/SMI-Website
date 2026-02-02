import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { faqs } from "../data";

export default function SMIFAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

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
