import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, User, Mail, Phone, Package, X, Check } from 'lucide-react';

export default function PembayaranPage() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    paket: '',
    metodePembayaran: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi proses pembayaran
    console.log('Payment data:', formData);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      email: '',
      telepon: '',
      paket: '',
      metodePembayaran: ''
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Pembayaran Berhasil!</h2>
          <p className="text-neutral-600 mb-6">
            Terima kasih! Form pembayaran telah diterima. Ini adalah demo, tidak ada proses pembayaran nyata.
          </p>
          <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-neutral-900 mb-2">Detail Pendaftaran:</h3>
            <p className="text-sm text-neutral-600"><strong>Nama:</strong> {formData.nama}</p>
            <p className="text-sm text-neutral-600"><strong>Email:</strong> {formData.email}</p>
            <p className="text-sm text-neutral-600"><strong>Telepon:</strong> {formData.telepon}</p>
            <p className="text-sm text-neutral-600"><strong>Paket:</strong> {formData.paket}</p>
            <p className="text-sm text-neutral-600"><strong>Metode:</strong> {formData.metodePembayaran}</p>
          </div>
          <button
            onClick={resetForm}
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors"
          >
            Buat Pembayaran Baru
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white">
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Form Pembayaran</h1>
                <p className="text-brand-100">Lengkapi data untuk pendaftaran paket SMI</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Data Pribadi */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-600" />
                Data Pribadi
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  name="nama"
                  required
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Nomor Telepon *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="tel"
                    name="telepon"
                    required
                    value={formData.telepon}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    placeholder="+62 812-3456-7890"
                  />
                </div>
              </div>
            </div>

            {/* Pilihan Paket */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-600" />
                Pilih Paket
              </h2>
              
              <div className="grid gap-3">
                {[
                  { value: 'basic', label: 'Paket Basic', price: 'Rp 99.000/bulan', features: ['Akses konten dasar', '1 sesi mentoring/bulan'] },
                  { value: 'premium', label: 'Paket Premium', price: 'Rp 199.000/bulan', features: ['Akses konten premium', '4 sesi mentoring/bulan', 'Sertifikat'] },
                  { value: 'vip', label: 'Paket VIP', price: 'Rp 299.000/bulan', features: ['Akses semua konten', 'Sesi mentoring unlimited', 'Sertifikat + Job referral'] }
                ].map((paket) => (
                  <label
                    key={paket.value}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.paket === paket.value
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paket"
                        value={paket.value}
                        checked={formData.paket === paket.value}
                        onChange={handleChange}
                        className="mt-1 text-brand-600 focus:ring-brand-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-900">{paket.label}</div>
                        <div className="text-brand-600 font-medium">{paket.price}</div>
                        <ul className="mt-2 text-sm text-neutral-600 space-y-1">
                          {paket.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-brand-400 rounded-full"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-neutral-900">Metode Pembayaran</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'transfer', label: 'Transfer Bank', desc: 'BCA, Mandiri, BNI' },
                  { value: 'ewallet', label: 'E-Wallet', desc: 'GoPay, OVO, Dana' }
                ].map((metode) => (
                  <label
                    key={metode.value}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.metodePembayaran === metode.value
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="metodePembayaran"
                        value={metode.value}
                        checked={formData.metodePembayaran === metode.value}
                        onChange={handleChange}
                        className="text-brand-600 focus:ring-brand-500"
                      />
                      <div>
                        <div className="font-medium text-neutral-900">{metode.label}</div>
                        <div className="text-sm text-neutral-500">{metode.desc}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-brand-600 text-white py-4 rounded-lg font-semibold hover:bg-brand-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Proses Pembayaran
              </button>
              <p className="text-center text-sm text-neutral-500 mt-3">
                * Ini adalah form demo. Tidak ada proses pembayaran nyata.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
