import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Users, Clock, CheckCircle, Building } from "lucide-react";
import { useState } from "react";

export default function EnterprisePage() {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    size: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    requirements: '',
    budget: '',
    timeline: '',
    preferredFormat: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle enterprise inquiry submission
    console.log('Enterprise inquiry:', formData);
    // Show success message
    alert('Terima kasih! Tim kami akan menghubungi Anda dalam 1x24 jam.');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Building className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Enterprise Coaching & Consulting
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Solusi mentoring custom untuk perusahaan, komunitas, dan institusi pendidikan
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Mengapa Memilih Enterprise Coaching?
            </h2>
            
            <div className="space-y-6 mb-12">
              {[
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Team Development",
                  description: "Tingkatkan skill seluruh tim content creator Anda dengan program yang disesuaikan"
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "Flexible Scheduling",
                  description: "Jadwal mentoring yang disesuaikan dengan operasional perusahaan Anda"
                },
                {
                  icon: <CheckCircle className="w-6 h-6" />,
                  title: "Measurable Results",
                  description: "Analytics dan reporting untuk melihat ROI dari program mentoring"
                },
                {
                  icon: <Building className="w-6 h-6" />,
                  title: "Industry Expertise",
                  description: "Mentor dengan pengalaman di berbagai industri kreatif"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pricing Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Investasi</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Coaching Rate:</span>
                  <span className="font-bold text-gray-900">Rp 4jt / jam</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Package:</span>
                  <span className="font-bold text-gray-900">10 jam / bulan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Custom Program:</span>
                  <span className="font-bold text-gray-900">Disesuaikan</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                * Harga disesuaikan berdasarkan scope dan kompleksitas program
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Konsultasi Gratis
              </h2>
              <p className="text-gray-600 mb-8">
                Ceritakan kebutuhan perusahaan Anda, tim kami akan merancang solusi yang tepat
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Perusahaan *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="PT Kreatif Indonesia"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industri *
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Pilih Industri</option>
                      <option value="media">Media & Broadcasting</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="education">Education</option>
                      <option value="corporate">Corporate</option>
                      <option value="government">Government</option>
                      <option value="nonprofit">Non-profit</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ukuran Tim *
                    </label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Pilih Ukuran</option>
                      <option value="1-10">1-10 orang</option>
                      <option value="11-50">11-50 orang</option>
                      <option value="51-200">51-200 orang</option>
                      <option value="200+">200+ orang</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Kontak *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Budi Santoso"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="budi@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telepon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+62 812-3456-7890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Jakarta, Indonesia"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kebutuhan Spesifik *
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Jelaskan kebutuhan mentoring dan training yang diinginkan..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Range Budget
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Pilih Range</option>
                    <option value="10-50jt">Rp 10-50jt</option>
                    <option value="50-100jt">Rp 50-100jt</option>
                    <option value="100-500jt">Rp 100-500jt</option>
                    <option value="500jt+">Rp 500jt+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Pilih Timeline</option>
                    <option value="immediate">Segera (1 bulan)</option>
                    <option value="3months">3 bulan</option>
                    <option value="6months">6 bulan</option>
                    <option value="1year">1 tahun</option>
                    <option value="ongoing">Berkelanjutan</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Kirim Konsultasi Gratis
                </motion.button>
              </form>

              {/* Contact Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Butuh Bantuan Langsung?</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+62 812-3456-7890</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>enterprise@smi.id</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Jakarta, Indonesia</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
