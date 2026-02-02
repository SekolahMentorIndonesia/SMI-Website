import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle, ChevronDown, X, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function SMIContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);

  const subjectOptions = [
    { value: 'general', label: 'Informasi Umum' },
    { value: 'registration', label: 'Pendaftaran Program' },
    { value: 'technical', label: 'Bantuan Teknis' },
    { value: 'partnership', label: 'Kerjasama' },
    { value: 'other', label: 'Lainnya' }
  ];

  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: '' // 'success' or 'error'
  });

  const showNotification = (message, type) => {
    setNotification({
      visible: true,
      message,
      type
    });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Send to Telegram bot
    const telegramBotToken = '8252237259:AAFhxJBP_LHl3vyVzjyrlYCTGfUW_aK9H_M';
    const telegramChatId = '8375398953'; // Your correct user ID
    
    const telegramMessage = `📩 Pesan Baru dari Website SMI

Nama: ${formData.name}
Email: ${formData.email}
Subjek: ${formData.subject}
Pesan: ${formData.message}

---
Dikirim: ${new Date().toLocaleString('id-ID')}`;
    
    console.log('Sending message to Telegram bot...');
    console.log('Chat ID:', telegramChatId);
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegramMessage
        })
      });
      
      const responseData = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', responseData);
      
      if (response.ok) {
        console.log('✅ Message sent to Telegram bot successfully');
        showNotification('Pesan berhasil dikirim!', 'success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        console.log('❌ Failed to send message to Telegram bot');
        showNotification('Gagal mengirim pesan. Silakan coba lagi.', 'error');
      }
    } catch (error) {
      console.error('❌ Error sending message to Telegram bot:', error);
      showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubjectSelect = (option) => {
    setFormData({
      ...formData,
      subject: option.value
    });
    setIsSubjectOpen(false);
  };

  return (
    <>
      {/* Custom Notification */}
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-xl shadow-lg border ${
              notification.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {notification.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {notification.type === 'success' ? 'Berhasil!' : 'Gagal!'}
                </p>
                <p className="text-sm mt-1 opacity-90">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section id="contact" className="py-20 lg:py-32 px-4 sm:px-6 bg-gradient-to-br from-neutral-50 via-white to-brand-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-4 block font-sans">
            HUBUNGI KAMI
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 font-display leading-tight">
            Siap Membantu Anda <span className="text-brand-600">Berkembang</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed font-sans">
            Tim profesional kami siap menjawab pertanyaan dan membantu Anda memulai perjalanan sukses di dunia content creation.
          </p>
        </motion.div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-3xl border border-neutral-100 p-8 lg:p-10 shadow-lg">
              <h3 className="text-2xl font-bold text-neutral-900 mb-8 font-display flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-xl flex items-center justify-center">
                  <Send className="w-4 h-4 text-brand-600" />
                </div>
                Kirim Pesan Langsung
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Subjek *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSubjectOpen(!isSubjectOpen)}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm bg-white text-left flex items-center justify-between hover:bg-neutral-50"
                    >
                      <span className={formData.subject ? 'text-neutral-900' : 'text-neutral-400'}>
                        {formData.subject 
                          ? subjectOptions.find(opt => opt.value === formData.subject)?.label 
                          : 'Pilih subjek'
                        }
                      </span>
                      <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isSubjectOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isSubjectOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden"
                        >
                          {subjectOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleSubjectSelect(option)}
                              className={`w-full px-4 py-3 text-left text-sm hover:bg-brand-50 transition-colors ${
                                formData.subject === option.value ? 'bg-brand-50 text-brand-600' : 'text-neutral-700'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Pesan *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none text-sm"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-brand-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl border border-neutral-100 p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-neutral-900 mb-8 font-display flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                Kantor Pusat
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-brand-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">Alamat Admin</h4>
                    <p className="text-neutral-600 leading-relaxed">
                      Blk. G, Sriamur, Kec. Tambun Utara<br />
                      Kabupaten Bekasi, Jawa Barat 17510<br />
                      Indonesia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden h-64 lg:h-80">
              <iframe
                src="https://www.google.com/maps?q=-6.181316,107.055367&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  );
}
