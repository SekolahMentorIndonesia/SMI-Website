import { motion } from "framer-motion";
import { Calendar, Star, Video, Phone } from "lucide-react";
import { useState } from "react";

export default function BookingPage() {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goals: '',
    experience: '',
    preferredFormat: 'offline'
  });

  const mentors = [
    {
      id: 1,
      name: 'Mohamad Iqbal Alhafizh',
      title: 'Founder & Lead Mentor',
      specialty: 'Content Strategy & Business Development',
      experience: '10+ tahun',
      rating: 4.9,
      students: 500,
      rate: 100000,
      image: '/mohamad-iqbal-alhafizh-founder-smi.jpeg',
      bio: 'Founder Sekolah Mentor Indonesia dengan pengalaman 10+ tahun di digital marketing dan content creation. Spesialisasi dalam strategi konten dan pengembangan bisnis untuk creator.',
      availability: ['Senin', 'Selasa', 'Kamis', 'Jumat'],
      languages: ['Bahasa Indonesia', 'English']
    },
    {
      id: 2,
      name: 'Sarah Wijaya',
      title: 'Senior Content Mentor',
      specialty: 'Video Production & Storytelling',
      experience: '8+ tahun',
      rating: 4.8,
      students: 350,
      rate: 80000,
      image: '/sarah-mentor.jpg',
      bio: 'Mentor senior dengan fokus pada produksi video dan storytelling. Berpengalaman dalam membantu creator mengembangkan konten yang engaging dan viral.',
      availability: ['Selasa', 'Rabu', 'Kamis', 'Sabtu'],
      languages: ['Bahasa Indonesia', 'English']
    },
    {
      id: 3,
      name: 'Budi Santoso',
      title: 'Business & Monetization Mentor',
      specialty: 'Business Strategy & Monetization',
      experience: '12+ tahun',
      rating: 4.7,
      students: 420,
      rate: 90000,
      image: '/budi-mentor.jpg',
      bio: 'Expert dalam strategi bisnis dan monetisasi konten. Membantu creator mengubah passion menjadi income yang sustainable.',
      availability: ['Senin', 'Rabu', 'Jumat', 'Sabtu'],
      languages: ['Bahasa Indonesia']
    }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const packages = [
    {
      id: 'single',
      name: 'Single Session',
      duration: '1 jam',
      price: 100000,
      description: 'Konsultasi satu kali untuk topik spesifik'
    },
    {
      id: 'package3',
      name: 'Package 3 Sessions',
      duration: '3 jam',
      price: 270000,
      originalPrice: 300000,
      description: '3 sesi mendalam dengan roadmap personal'
    },
    {
      id: 'package5',
      name: 'Package 5 Sessions',
      duration: '5 jam',
      price: 425000,
      originalPrice: 500000,
      description: 'Program lengkap dengan follow-up dan support'
    }
  ];

  const handleMentorSelect = (mentor) => {
    setSelectedMentor(mentor);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      mentor: selectedMentor,
      date: selectedDate,
      time: selectedTime,
      package: selectedPackage,
      ...formData
    };
    
    // In a real app, you would send this to an API
    alert('Terima kasih! Booking Anda akan dikonfirmasi dalam 1x24 jam.');
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
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Calendar className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              VIP 1-on-1 Mentoring
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Booking session tatap muka dengan mentor profesional
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Mentor Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pilih Mentor Anda</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentors.map((mentor) => (
                <motion.div
                  key={mentor.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMentorSelect(mentor)}
                  className={`bg-white rounded-xl shadow-lg border-2 p-6 cursor-pointer transition-all ${
                    selectedMentor?.id === mentor.id 
                      ? 'border-purple-500 shadow-purple-100' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex gap-4 mb-4">
                    <img 
                      src={mentor.image} 
                      alt={mentor.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{mentor.name}</h3>
                      <p className="text-sm text-gray-600">{mentor.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium ml-1">{mentor.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">({mentor.students} students)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Spesialisasi:</span>
                      <span className="text-gray-600">{mentor.specialty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Pengalaman:</span>
                      <span className="text-gray-600">{mentor.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Rate:</span>
                      <span className="font-bold text-purple-600">Rp {mentor.rate.toLocaleString('id-ID')}/jam</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Bahasa:</span>
                      <span className="text-gray-600">{mentor.languages.join(', ')}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-3 line-clamp-2">
                    {mentor.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Detail Booking</h2>
              
              {selectedMentor && (
                <div className="bg-purple-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedMentor.image} 
                      alt={selectedMentor.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{selectedMentor.name}</h3>
                      <p className="text-sm text-gray-600">{selectedMentor.title}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Session *
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waktu Session *
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Pilih Waktu</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package *
                  </label>
                  <div className="space-y-2">
                    {packages.map((pkg) => (
                      <label key={pkg.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                        <input
                          type="radio"
                          name="package"
                          value={pkg.id}
                          checked={selectedPackage === pkg.id}
                          onChange={(e) => setSelectedPackage(e.target.value)}
                          className="text-purple-600"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{pkg.name}</div>
                          <div className="text-sm text-gray-600">{pkg.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-purple-600">
                              Rp {pkg.price.toLocaleString('id-ID')}
                            </span>
                            {pkg.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                Rp {pkg.originalPrice.toLocaleString('id-ID')}
                              </span>
                            )}
                            <span className="text-sm text-gray-600">({pkg.duration})</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-4">Informasi Kontak</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="John Doe"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="john@example.com"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="+62 812-3456-7890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tujuan Mentoring *
                      </label>
                      <textarea
                        name="goals"
                        value={formData.goals}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Jelaskan tujuan dan harapan Anda dari mentoring ini..."
                      />
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!selectedMentor || !selectedDate || !selectedTime || !selectedPackage}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedMentor && selectedDate && selectedTime && selectedPackage 
                    ? `Book Session - Rp ${packages.find(p => p.id === selectedPackage)?.price.toLocaleString('id-ID')}`
                    : 'Lengkapi Data Dulu'
                  }
                </motion.button>
              </form>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Butuh Bantuan?</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+62 812-3456-7890</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>booking@smi.id</span>
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
