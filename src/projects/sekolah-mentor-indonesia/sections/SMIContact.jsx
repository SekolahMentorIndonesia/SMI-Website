import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, User, MessageSquare } from 'lucide-react';

const SMIContact = () => {
  const { t } = useTranslation('home');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct mailto link
    const mailtoLink = `mailto:sekolahmentorindonesia@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.info.email'),
      value: "sekolahmentorindonesia@gmail.com",
      link: "mailto:sekolahmentorindonesia@gmail.com",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: Phone,
      title: t('contact.info.whatsapp'),
      value: "+62 812-3456-7890",
      link: "https://wa.me/6281234567890",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      icon: MapPin,
      title: t('contact.info.address'),
      value: "Kabupaten Bekasi, Indonesia",
      link: "#",
      color: "text-red-600",
      bg: "bg-red-50"
    }
  ];

  return (
    <section className="py-20 bg-neutral-50" id="contact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4"
          >
            {t('contact.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-600 text-lg"
          >
            {t('contact.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                target={info.link.startsWith('http') ? "_blank" : undefined}
                rel={info.link.startsWith('http') ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="block bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${info.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <info.icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-500 mb-1">{info.title}</h3>
                    <p className="text-neutral-900 font-medium group-hover:text-blue-600 transition-colors">
                      {info.value}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-neutral-100/50 border border-neutral-100 p-8 sm:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-neutral-700 ml-1">
                    {t('contact.form.name')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all pl-11"
                      placeholder="John Doe"
                    />
                    <User className="w-5 h-5 text-neutral-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-neutral-700 ml-1">
                    {t('contact.form.email')}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all pl-11"
                      placeholder="john@example.com"
                    />
                    <Mail className="w-5 h-5 text-neutral-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-semibold text-neutral-700 ml-1">
                  {t('contact.form.subject')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all pl-11"
                    placeholder={t('contact.form.subject')}
                  />
                  <MessageSquare className="w-5 h-5 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-neutral-700 ml-1">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                  placeholder={t('contact.form.message')}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-1"
              >
                {t('contact.form.submit')}
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SMIContact;
