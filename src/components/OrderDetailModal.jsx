import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, QrCode, Check, ChevronRight, Copy, MessageCircle, Loader2 } from 'lucide-react';

export default function OrderDetailModal({ isOpen, onClose, product }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    notes: ''
  });
  // Kept for UI compatibility, always false since backend is skipped
  const [isSubmitting] = useState(false);

  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !product) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.whatsapp) {
      if (product?.id === 'corporate' || product?.action === 'consultation') {
        // ... existing consultation logic ...
        const consultMessage = [
          'Halo Tim SMI, saya tertarik dengan Private Exclusive Coaching.',
          '',
          'Data Konsultasi:',
          '—',
          `Layanan: ${product.name}`,
          `Nama: ${formData.name}`,
          `Email: ${formData.email}`,
          `WhatsApp: ${formData.whatsapp}`,
          `Catatan: ${formData.notes?.trim() ? formData.notes : 'Tidak ada catatan'}`,
          '',
          'Mohon informasikan harga dan proses selanjutnya. Terima kasih!'
        ].join('\n');
        const whatsappUrl = `https://wa.me/6287744556696?text=${encodeURIComponent(consultMessage)}`;
        window.open(whatsappUrl, '_blank');
        onClose();
      } else {
        // Skip backend submission, go directly to payment step
        setStep(2);
      }
    }
  };

  const handleCopyRekening = () => {
    navigator.clipboard.writeText('0661555920');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleWhatsAppRedirect = () => {
    const message = `Halo Admin SMI, saya telah melakukan pembayaran untuk pesanan berikut:

DATA PEMESANAN
Nama: ${formData.name}
Email: ${formData.email}
Program: ${product.name}
Nominal: ${product.price}

Mohon dicek kembali. Berikut saya lampirkan FOTO BUKTI PEMBAYARAN. Terima kasih.`;

    const whatsappUrl = `https://wa.me/6287744556696?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
    setStep(1);
    setFormData({ name: '', email: '', whatsapp: '', notes: '' });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {step === 1 ? product.name : 'Instruksi Pembayaran'}
              </h3>
              {step === 1 && (
                <p className="text-brand-600 font-semibold mt-1">{product.price}</p>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">
            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="Nomor WhatsApp Anda"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ceritakan tujuan Anda bergabung..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all outline-none resize-none"
                  />
                </div>

                {/* Product Summary */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center text-sm">
                  <span className="text-gray-600">Produk</span>
                  <span className="font-semibold text-gray-900">{product.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-brand-600 text-lg">{product.price}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-brand-600 text-white py-3.5 rounded-xl font-semibold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    product?.id === 'corporate' || product?.action === 'consultation' ? (
                      <>
                        <MessageCircle className="w-5 h-5" />
                        Kirim ke WhatsApp
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Lanjut ke Pembayaran
                      </>
                    )
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-600 mb-1">Total Pembayaran:</p>
                  <p className="text-2xl font-bold text-blue-700">{product.price}</p>
                </div>

                {/* Bank Transfer */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-gray-900">Bank Transfer</span>
                  </div>
                  
                  <div 
                    className="bg-gray-50 p-4 rounded-lg flex justify-between items-center group cursor-pointer hover:bg-gray-100 transition-colors relative" 
                    onClick={handleCopyRekening}
                    title="Klik untuk menyalin"
                  >
                    <div>
                      <p className="text-sm text-gray-500">BCA: <span className="font-mono font-medium text-gray-900">0661555920</span></p>
                      <p className="text-xs text-gray-400 mt-0.5">A.n. Mohamad Iqbal Alhafizh</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium transition-all duration-300 ${isCopied ? 'text-green-600 opacity-100' : 'opacity-0'}`}>
                        Tersalin!
                      </span>
                      {isCopied ? (
                        <Check className="w-4 h-4 text-green-600 transition-all duration-300 scale-110" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400 group-hover:text-brand-600 transition-all duration-300" />
                      )}
                    </div>
                  </div>
                </div>

                {/* QRIS */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-gray-900">Pembayaran Instan / QRIS</span>
                  </div>

                  <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-200 rounded-xl">
                    <img 
                      src="/images/sekolah-mentor-indonesia/qris-smi.jpeg" 
                      alt="QRIS SMI" 
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-500 text-center leading-relaxed">
                  Silakan lakukan pembayaran ke nomor rekening di atas Atau Lakukan Pembayaran Secara Instan dengan Scan Code QR tersebut. Setelah transfer, klik tombol di bawah untuk konfirmasi. Admin akan memverifikasi dalam 1x24 jam.
                </div>

                <button
                  onClick={handleWhatsAppRedirect}
                  disabled={isSubmitting}
                  className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-semibold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Saya Sudah Bayar
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
