import { Calendar, ArrowRight, User } from "lucide-react";
import { motion } from "framer-motion";

export default function SMIBlog() {
  const blogPosts = [
    {
      title: "Tips Meningkatkan Engagement di Instagram",
      excerpt: "Pelajari strategi efektif untuk meningkatkan engagement dan interaksi dengan audiens Anda.",
      author: "Sarah Anderson",
      date: "15 Jan 2024",
      category: "Social Media"
    },
    {
      title: "Cara Memulai Karir sebagai Content Creator",
      excerpt: "Panduan lengkap untuk memulai karir di dunia content creation dari nol hingga sukses.",
      author: "Michael Chen",
      date: "12 Jan 2024", 
      category: "Career"
    },
    {
      title: "Tren Content Creation 2024",
      excerpt: "Update tren terbaru dalam dunia content creation yang harus Anda ketahui tahun ini.",
      author: "Lisa Park",
      date: "8 Jan 2024",
      category: "Trends"
    }
  ];

  return (
    <section id="blog" className="py-20 lg:py-32 px-4 sm:px-6 bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-4 block font-sans">
            BLOG & INSIGHTS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-6 font-display leading-tight">
            Artikel & Tips Terbaru
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-sans">
            Dapatkan insight terbaru tentang content creation, digital marketing, dan industri kreatif.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-brand-50 to-blue-50"></div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
                  <span className="bg-brand-50 text-brand-600 px-2 py-1 rounded-md font-medium">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3 font-display line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  <button className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center gap-1 transition-colors">
                    Baca Selengkapnya
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
