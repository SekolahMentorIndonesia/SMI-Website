import { Link } from "react-router";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function NavbarLanding() {
  const { t, i18n } = useTranslation('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const leftMenuItems = [
    { name: t('header.nav.home'), href: '/' },
    { name: t('header.nav.products'), href: '#products' },
    { name: t('header.nav.features'), href: '#features' },
    { name: t('header.nav.benefits'), href: '#benefits' },
  ];

  const rightMenuItems = [
    { name: t('header.nav.about'), href: '#about' },
    { name: t('header.nav.blog'), href: '#blog' },
    { name: t('header.nav.faq'), href: '#faq' },
    { name: t('header.nav.contact'), href: '#contact' },
  ];

  const allMenuItems = [...leftMenuItems, ...rightMenuItems];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
        {/* Left Menu - Desktop Only */}
        <div className="hidden lg:flex items-center gap-6">
          {leftMenuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-xs font-medium text-neutral-600 hover:text-brand-600 transition-colors duration-200 relative group"
            >
              {item.name}
              <span className="absolute bottom-[-2px] left-0 w-0 h-0.5 bg-brand-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
          <img 
            src="/logo.jpeg" 
            alt="Logo Sekolah Mentor Indonesia" 
            width="80"
            height="80"
            className="h-20 w-auto object-contain transition-transform hover:scale-105 duration-200" 
          />
        </div>

        {/* Right Menu - Desktop Only */}
        <div className="hidden lg:flex items-center gap-6">
          {rightMenuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-xs font-medium text-neutral-600 hover:text-brand-600 transition-colors duration-200 relative group"
            >
              {item.name}
              <span className="absolute bottom-[-2px] left-0 w-0 h-0.5 bg-brand-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
          ))}

          {/* Language Switcher - Desktop Only */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              aria-label={t('header.language_selector', 'Select Language')}
              className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded-lg transition-colors duration-200 text-neutral-600"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">{i18n.language}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-sm border border-neutral-100 p-1 overflow-hidden"
                >
                  <button
                    onClick={() => changeLanguage('id')}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-md transition-colors duration-200 ${
                      i18n.language === 'id' ? 'bg-brand-50 text-brand-600' : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    ID 🌐
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-md transition-colors duration-200 ${
                      i18n.language.startsWith('en') ? 'bg-brand-50 text-brand-600' : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    EN 🌐
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
        isMobileMenuOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-gradient-to-r from-brand-50 to-blue-50">
              <h3 className="text-lg font-bold text-brand-600">{t('header.menu')}</h3>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-neutral-600 hover:bg-white/80 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {allMenuItems.map((item, index) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group block px-4 py-3 text-neutral-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-600 hover:to-brand-700 rounded-xl transition-all duration-300 font-medium relative overflow-hidden"
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </a>
                ))}
              </div>
            </div>

            {/* Language Section */}
            <div className="p-4 border-t border-neutral-100 bg-gradient-to-r from-brand-50 to-blue-50">
              <h4 className="text-sm font-bold text-brand-600 mb-3">{t('header.language')}</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    changeLanguage('id');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                    i18n.language === 'id' 
                      ? 'bg-brand-50 text-brand-600 hover:bg-brand-100' 
                      : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  ID 🌐
                </button>
                <button
                  onClick={() => {
                    changeLanguage('en');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                    i18n.language.startsWith('en') 
                      ? 'bg-brand-50 text-brand-600 hover:bg-brand-100' 
                      : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  EN 🌐
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-100 bg-gradient-to-r from-brand-50 to-blue-50">
              <div className="text-center">
                <img 
                  src="/logo.jpeg" 
                  alt="Logo Sekolah Mentor Indonesia" 
                  className="h-12 w-auto mx-auto mb-4 object-contain" 
                />
                <p className="text-sm text-brand-600 font-medium">
                  Sekolah Mentor Indonesia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
