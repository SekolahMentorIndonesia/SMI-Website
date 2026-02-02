import { motion } from "framer-motion";
import { ArrowRight, Star, Users, Building, Shield, X, HeartHandshake, MessageCircle } from "lucide-react";
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
      name: t('products.items.learning.name'),
      price: 'Rp 50.000',
      period: '', 
      description: t('products.items.learning.desc'),
      features: [
        'Akses komunitas kreator SMI (seumur hidup)',
        'Event online / offline tanpa batas',
        'Zoom meet sharing & diskusi',
        'Konten eksklusif premium',
        'Networking antar kreator',
        'Akses webinar dan group selamanya'
      ],
      icon: Users,
      color: 'blue',
      popular: true,
      action: 'checkout'
    },
    {
      id: 'private',
      name: t('products.items.mentoring.name'),
      price: 'Rp 100.000',
      period: '/jam',
      description: t('products.items.mentoring.desc'),
      features: [
        'Konsultasi langsung 1-on-1',
        'Review akun & konten',
        'Penentuan niche & strategi growth',
        'Jadwal fleksibel (by appointment)',
        'Bisa online atau offline'
      ],
      icon: HeartHandshake,
      color: 'purple',
      action: 'checkout'
    },
    {
      id: 'corporate',
      name: t('products.items.coaching.name'),
      price: 'Rp 5-6jt',
      period: '/sesi',
      description: t('products.items.coaching.desc'),
      features: [
        'Konsultasi awal dengan admin SMI',
        'Analisis kebutuhan perusahaan',
        'Materi custom sesuai kebutuhan',
        'Mentor profesional SMI',
        'Workshop, event, atau internal training',
        'Kontrak & kerja sama resmi'
      ],
      icon: Star,
      color: 'green',
      action: 'consultation'
    }
  ];

  const ProductCard = ({ product, index }) => {
    const Icon = product.icon;
    
    return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative bg-white rounded-2xl border-2 ${
        product.popular 
          ? 'border-brand-500 shadow-lg' 
          : 'border-neutral-200'
      } overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col`}
    >
        {product.popular && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-brand-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3" />
              POPULER
            </span>
          </div>
        )}

        <div className="p-8 flex-1 flex flex-col">
          <div className={`w-16 h-16 bg-${product.color}-100 rounded-2xl flex items-center justify-center mb-6`}>
            <Icon className={`w-8 h-8 text-${product.color}-600`} />
          </div>

          <h3 className="text-2xl font-bold text-neutral-900 mb-2">
            {product.name}
          </h3>
          <p className="text-neutral-600 mb-6">
            {product.description}
          </p>

          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-neutral-900">
                {product.price}
              </span>
              <span className="text-neutral-500">{product.period}</span>
            </div>
            {product.id === 'corporate' && (
              <p className="text-sm text-neutral-500 mt-1">
                *Harga tergantung scope dan kebutuhan
              </p>
            )}
          </div>

          <div className="space-y-3 mb-8 flex-1">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleOrderClick(product)}
            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              product.action === 'consultation' 
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-brand-600 text-white hover:bg-brand-700'
            }`}
          >
            {product.action === 'consultation' ? (
              <>
                <Building className="w-4 h-4" />
                Konsultasi Sekarang
              </>
            ) : (
              <>
                {product.popular ? 'Gabung Komunitas Premium' : `Pilih ${product.name}`}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-24 bg-neutral-50" id="products">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4"
          >
            {t('products.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-600"
          >
            {t('products.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
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
