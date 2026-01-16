import { Menu, X, ArrowRight, Globe, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function SMIHeader() {
  const { t, i18n } = useTranslation('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t('header.nav.about'), href: "#tentang" },
    { label: t('header.nav.program'), href: "#program" },
    { label: t('header.nav.advantages'), href: "#keunggulan" },
    { label: t('header.nav.testimoni'), href: "#testimoni" },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md py-2 sm:py-3 shadow-sm border-b border-gray-100"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex items-center justify-between">
          {/* Logo SMI - clickable ke halaman utama */}
          <a 
            href="/app"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-16 sm:h-18 md:h-20 flex items-center group-hover:scale-105 transition-transform"
            >
              <img 
                src="/logo.jpeg" 
                alt="SMI Logo" 
                className="h-full w-auto object-contain"
              />
            </motion.div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 md:gap-2">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                href={item.href}
                className="px-3 md:px-4 py-2 text-neutral-600 font-medium text-xs md:text-sm hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-all font-sans"
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* CTA Button & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded-xl transition-colors text-neutral-600"
              >
                <Globe className="w-[18px] h-[18px]" />
                <span className="text-xs font-bold uppercase">{i18n.language === 'id' ? 'ID' : 'EN'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-32 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-2 overflow-hidden"
                  >
                    <button
                      onClick={() => changeLanguage('id')}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium rounded-xl transition-colors ${
                        i18n.language === 'id' ? 'bg-brand-50 text-brand-600' : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      ID
                    </button>
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium rounded-xl transition-colors ${
                        i18n.language === 'en' ? 'bg-brand-50 text-brand-600' : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      EN
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.a
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              href="#kontak"
              className="hidden sm:flex items-center gap-2 bg-neutral-900 hover:bg-brand-600 text-white font-bold text-xs md:text-sm px-4 md:px-6 py-2.5 md:py-3 rounded-full transition-all shadow-soft font-sans"
            >
              {t('header.cta')}
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            {/* Hamburger menu (mobile) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-neutral-900" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="lg:hidden mt-4 overflow-hidden"
            >
              <div className="bg-white rounded-2xl border border-neutral-100 p-4 space-y-2 shadow-xl">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-neutral-600 font-medium text-sm hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all"
                  >
                    {item.label}
                  </a>
                ))}
                
                {/* Mobile Language Switcher */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-50 mt-2">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Language</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => changeLanguage('id')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${i18n.language === 'id' ? 'bg-brand-600 text-white' : 'bg-neutral-50 text-neutral-400'}`}
                    >
                      ID
                    </button>
                    <button 
                      onClick={() => changeLanguage('en')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${i18n.language === 'en' ? 'bg-brand-600 text-white' : 'bg-neutral-50 text-neutral-400'}`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <a
                  href="#kontak"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-4 text-center bg-brand-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-100"
                >
                  {t('header.cta')}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
