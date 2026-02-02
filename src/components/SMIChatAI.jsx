import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, PhoneCall } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { findAnswer } from "../utils/aiMatcher";

export default function SMIChatAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      content: 'Halo! Saya MentorAI, asisten virtual Sekolah Mentor Indonesia. Ada yang bisa saya bantu?', 
      isFallback: false 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(() => {
      const response = findAnswer(userMessage.content);
      
      const botMessage = { 
        role: 'bot', 
        content: response.text,
        isFallback: response.isFallback,
        showContactButton: response.showContactButton,
        showTelegramButton: response.showTelegramButton
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleWhatsappClick = () => {
    window.open('https://wa.me/6281915020498?text=Halo%20Admin%20SMI,%20saya%20ingin%20bertanya%20lebih%20lanjut', '_blank');
  };

  const handleTelegramClick = () => {
    window.open('https://t.me/sekolahmentorindonesia', '_blank');
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[90] bg-brand-600 text-white w-14 h-14 rounded-full shadow-2xl shadow-brand-200 flex items-center justify-center group"
      >
        <div className="relative w-7 h-7">
          <div className={`transition-all duration-300 flex items-center justify-center ${isOpen ? 'group-hover:opacity-0 group-hover:scale-50 absolute inset-0' : 'opacity-100 scale-100'}`}>
            <Bot className="w-7 h-7" />
            {!isOpen && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-brand-600"></span>
            )}
          </div>
          
          {isOpen && (
            <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100">
              <X className="w-7 h-7" />
            </div>
          )}
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-[90] w-[calc(100vw-2rem)] sm:w-[400px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[600px] h-[80vh] sm:h-[600px]"
          >
            {/* Header */}
            <div className="bg-brand-600 p-4 sm:p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg">MentorAI SMI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <p className="text-brand-100 text-xs sm:text-sm">Online</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-neutral-50 scrollbar-thin scrollbar-thumb-neutral-200">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 sm:p-4 rounded-2xl text-sm sm:text-base leading-relaxed shadow-sm whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-brand-600 text-white rounded-br-none'
                        : 'bg-white text-neutral-800 border border-neutral-100 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                    
                    {/* Fallback Button */}
                    {(msg.isFallback || msg.showContactButton) && (
                      <div className="mt-3 pt-3 border-t border-neutral-100">
                        <button
                          onClick={handleWhatsappClick}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors text-sm font-semibold"
                        >
                          <PhoneCall className="w-4 h-4" />
                          Hubungi Admin SMI
                        </button>
                      </div>
                    )}

                    {/* Telegram Button */}
                    {msg.showTelegramButton && (
                      <div className="mt-3 pt-3 border-t border-neutral-100">
                        <button
                          onClick={handleTelegramClick}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-sm font-semibold"
                        >
                          <Send className="w-4 h-4" />
                          Gabung Grup Telegram
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 sm:p-4 rounded-2xl rounded-bl-none border border-neutral-100 shadow-sm flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-4 bg-white border-t border-neutral-100 shrink-0">
              <div className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanya tentang SMI..."
                  className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm sm:text-base transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-3 sm:p-3.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-brand-100"
                >
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              <p className="text-center text-[10px] sm:text-xs text-neutral-400 mt-2">
                AI Knowledge Base
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
