import { motion } from "framer-motion";
import { ArrowRight, Star, Users, Building, Shield, X, HeartHandshake, MessageCircle, Check, Clock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import OrderDetailModal from "../../../components/OrderDetailModal";

export default function SMIProducts() {
  const { t } = useTranslation('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fungsi untuk membuka modal kontak
  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const products = [
    {
      id: 'community',
      name: "Program Belajar",
      desc: "Akses komunitas dan materi dasar.",
      price: "Rp 50.000",
      originalPrice: "Rp 150.000",
      benefits: [
        "Akses komunitas kreator SMI (seumur hidup)",
        "Event online / offline tanpa batas",
        "Zoom meet sharing & diskusi",
        "Konten eksklusif premium",
        "Networking antar kreator",
        "Akses webinar dan group selamanya"
      ],
      cta: "Pilih Program Belajar",
      action: 'checkout'
    },
    {
      id: 'private',
      name: "Mentoring",
      desc: "Bimbingan intensif personal.",
      price: "Rp 100.000",
      originalPrice: "Rp 300.000",
      unit: "/jam",
      benefits: [
        "Konsultasi langsung 1-on-1",
        "Review akun & konten",
        "Penentuan niche & strategi growth",
        "Jadwal fleksibel (by appointment)",
        "Bisa online atau offline"
      ],
      cta: "Pilih Mentoring",
      action: 'checkout'
    },
    {
      id: 'corporate',
      name: "Coaching",
      desc: "Solusi pelatihan dan pengembangan SDM perusahaan secara komprehensif.",
      price: "Rp 6.000.000",
      originalPrice: "Rp 10.000.000",
      unit: "/sesi",
      benefits: [
        "Konsultasi awal dengan admin SMI",
        "Analisis kebutuhan perusahaan",
        "Materi custom sesuai kebutuhan",
        "Mentor profesional SMI",
        "Workshop, event, atau internal training",
        "Kontrak & kerja sama resmi"
      ],
      cta: "Hubungi Kami",
      isHighlight: true,
      limited: true,
      action: 'consultation'
    }
  ];

  const ProductCard = ({ product, index }) => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`relative bg-white rounded-3xl p-8 flex flex-col h-full ${
          product.isHighlight 
            ? 'border-2 border-orange-400 shadow-2xl scale-105 z-10' 
            : 'border border-slate-200 shadow-sm hover:shadow-md'
        }`}
      >
        {product.isHighlight && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg whitespace-nowrap">
              <Star className="w-4 h-4 fill-white" />
              Promo Februari
            </span>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{product.name}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{product.desc}</p>
        </div>

        <div className="mb-8 p-4 bg-slate-50 rounded-2xl">
          {product.originalPrice && (
            <div className="text-slate-400 text-sm font-medium line-through mb-1">
              {product.originalPrice}
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-900">{product.price}</span>
            {product.unit && <span className="text-slate-500 text-sm">{product.unit}</span>}
          </div>
          
          {product.limited && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
              <Clock className="w-3 h-3" />
              10 slot terbatas
            </div>
          )}
        </div>

        <div className="space-y-4 mb-8 flex-1">
          {product.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${product.isHighlight ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                <Check className="w-3 h-3" />
              </div>
              <span className="text-slate-600 text-sm text-left">{benefit}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => handleOrderClick(product)}
          className={`w-full py-3.5 rounded-xl font-bold transition-all ${
            product.isHighlight
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-200'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          {product.cta}
        </button>
      </motion.div>
    );
  };

  return (
    <section id="programs" className="py-24 px-6 md:px-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Pilih Program Sesuai Kebutuhan
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Dari belajar mandiri hingga bimbingan intensif, kami punya solusi untuk setiap tahap perjalanan karier Anda.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start pt-8">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} index={index} />
          ))}
        </div>
      </div>

      <OrderDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </section>
  );
}
