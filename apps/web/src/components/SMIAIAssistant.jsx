import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, PhoneCall } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function SMIAIAssistant() {
  const { t, i18n } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Reset opening message ketika bahasa berubah, tapi pertahankan chat history
  useEffect(() => {
    setMessages(prev => {
      // Jika hanya ada opening message, update dengan bahasa baru
      if (prev.length === 1 && prev[0].role === 'bot' && !prev[0].showWhatsapp) {
        return [
          { role: 'bot', content: t('ai.opening_message'), showWhatsapp: false }
        ];
      }
      // Jika sudah ada chat, update opening message pertama
      if (prev.length > 0 && prev[0].role === 'bot') {
        const updatedMessages = [...prev];
        updatedMessages[0] = { role: 'bot', content: t('ai.opening_message'), showWhatsapp: false };
        return updatedMessages;
      }
      return prev;
    });
  }, [i18n.language, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input, showWhatsapp: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Kirim request ke backend dengan language parameter
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          language: i18n.language // Kirim language ke backend
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage = { 
        role: 'bot', 
        content: data.response,
        showWhatsapp: data.showWhatsapp || false
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        role: 'bot', 
        content: t('ai.mock_responses.fallback'),
        showWhatsapp: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsappClick = () => {
    // Redirect ke WhatsApp admin
    window.open('https://wa.me/6281234567890?text=Halo%20admin%20SMI,%20saya%20membutuhkan%20bantuan.', '_blank');
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[90] bg-brand-600 text-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl shadow-brand-200 flex items-center gap-3 group"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 border-2 border-brand-600 rounded-full animate-pulse" />
        </div>
        <span className="font-bold text-sm hidden sm:block">{t('ai.name')}</span>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] pointer-events-none flex items-end justify-end p-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="pointer-events-auto w-full sm:max-w-md bg-white rounded-2xl sm:rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-neutral-100 flex flex-col overflow-hidden h-[500px] sm:h-[600px] max-h-[85vh] sm:max-h-[80vh]"
            >
              {/* Header */}
              <div className="bg-brand-600 p-4 sm:p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden">
                    <img src="/logo.jpeg" alt="Logo Sekolah Mentor Indonesia - Platform Mentoring Content Creator" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm">{t('ai.name')}</h4>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-[10px] text-brand-100 font-medium">{t('ai.status')}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.role === 'bot' ? 'items-start' : 'items-end'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'bot' ? '' : 'flex-row-reverse'}`}>
                      <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden ${msg.role === 'bot' ? 'bg-white border border-neutral-100' : 'bg-brand-600'}`}>
                        {msg.role === 'bot' ? (
                          <img src="/logo.jpeg" alt="Logo Sekolah Mentor Indonesia - Platform Mentoring Content Creator" className="w-5 h-5 object-contain" />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'bot' ? 'bg-white text-neutral-700 border border-neutral-100' : 'bg-brand-600 text-white shadow-brand-100'}`}>
                        {msg.content}
                      </div>
                    </div>
                    {/* Tombol WhatsApp jika AI tidak bisa menjawab */}
                    {msg.role === 'bot' && msg.showWhatsapp && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-2 ml-11"
                      >
                        <button
                          onClick={handleWhatsappClick}
                          className="flex items-center gap-2 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full hover:bg-green-600 transition-colors shadow-sm"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{i18n.language === 'en' ? 'Contact Admin via WhatsApp' : 'Hubungi Admin via WhatsApp'}</span>
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden bg-white border border-neutral-100">
                        <img src="/logo.jpeg" alt="Logo Sekolah Mentor Indonesia - Platform Mentoring Content Creator" className="w-5 h-5 object-contain" />
                      </div>
                      <div className="p-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-white text-neutral-700 border border-neutral-100">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 sm:p-6 bg-white border-t border-neutral-100">
                <div className="flex items-center gap-3 bg-neutral-50 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-neutral-200 focus-within:ring-2 focus-within:ring-brand-500 focus-within:bg-white transition-all">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t('ai.input_placeholder')}
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-neutral-900 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
