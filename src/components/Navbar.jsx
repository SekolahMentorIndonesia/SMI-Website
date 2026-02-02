import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Navbar({ variant = 'smi' }) {
  const { t, i18n } = useTranslation(['landing', 'home']);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const navbarConfig = {
    smi: {
      logo: "/logo.jpeg",
      title: "SMI",
      subtitle: "Sekolah Mentor Indonesia",
      menuItems: [
        { name: t('header.nav.home', { ns: 'home' }), href: '#hero' },
        { 
          name: t('header.nav.about', { ns: 'home' }), 
          href: '#about-smi',
          hasDropdown: true,
          dropdownItems: [
            { name: t('header.nav.about_us', { ns: 'home' }), href: '#about-smi' },
            { name: t('header.nav.vision_mission', { ns: 'home' }), href: '#visi-misi' },
          ]
        },
        { name: t('header.nav.community', { ns: 'home' }), href: '#komunitas' },
        { name: t('header.nav.program', { ns: 'home' }), href: '#pricing' },
        { name: t('header.nav.testimonials', { ns: 'home' }), href: '#testimoni' },
        { name: t('header.nav.content', { ns: 'home' }), href: '#blog' },
        { name: t('header.nav.faq', { ns: 'home' }), href: '#faq' },
      ]
    }
  };

  const currentConfig = navbarConfig.smi;
  const menuItems = currentConfig?.menuItems || [];

  const [activeDropdown, setActiveDropdown] = useState(null);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    
    // Handle page navigation
    if (href.startsWith('/')) {
      window.location.href = href;
      return;
    }
    
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        const navbarHeight = 68;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">
        {/* Logo Section (Left) */}
        <div className="flex items-center flex-shrink-0">
          <button 
            onClick={(e) => scrollToSection(e, '#hero')}
            className="flex items-center hover:scale-105 transition-transform duration-200"
          >
            <img 
              src={currentConfig.logo}
              alt={`Logo ${currentConfig.title}`}
              className="h-10 sm:h-12 w-auto object-contain" 
            />
            <div className="ml-3 flex flex-col items-start">
                <span className="text-sm font-bold text-neutral-900 leading-tight">{currentConfig.title}</span>
                <span className="text-[10px] text-neutral-500 leading-tight">{currentConfig.subtitle}</span>
            </div>
          </button>
        </div>

        {/* Desktop Menu (Right) */}
        <div className="hidden lg:flex items-center gap-6">
          {menuItems.map((item) => (
            <div 
              key={item.name} 
              className="relative group"
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
              onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
            >
              <a
                href={item.href}
                onClick={(e) => !item.hasDropdown && scrollToSection(e, item.href)}
                className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors duration-200 py-2"
              >
                {item.name}
                {item.hasDropdown && (
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                )}
              </a>

              {/* Desktop Dropdown */}
              {item.hasDropdown && (
                <div className={`absolute top-full right-0 w-56 pt-2 transition-all duration-200 ${
                  activeDropdown === item.name 
                    ? 'opacity-100 translate-y-0 visible' 
                    : 'opacity-0 translate-y-2 invisible'
                }`}>
                  <div className="bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden py-2">
                    {item.dropdownItems.map((subItem) => (
                      <a
                        key={subItem.name}
                        href={subItem.href}
                        onClick={(e) => scrollToSection(e, subItem.href)}
                        className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                      >
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Language Switcher */}
          <div className="relative ml-2 pl-6 border-l border-neutral-200">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
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
                  className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-neutral-100 p-1 overflow-hidden"
                >
                  <button
                    onClick={() => changeLanguage('id')}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-md transition-colors duration-200 ${
                      i18n.language === 'id' ? 'bg-brand-50 text-brand-600' : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    Bahasa Indonesia
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-md transition-colors duration-200 ${
                      i18n.language.startsWith('en') ? 'bg-brand-50 text-brand-600' : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    English
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
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-80 bg-white shadow-2xl flex flex-col lg:hidden"
            >
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <span className="font-bold text-lg text-neutral-900">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:bg-neutral-50 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <div className="flex flex-col px-4 space-y-2">
                  {menuItems.map((item) => (
                    <div key={item.name} className="flex flex-col">
                      {item.hasDropdown ? (
                        <>
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                            className="flex items-center justify-between py-3 text-base font-medium text-neutral-700 hover:text-brand-600"
                          >
                            {item.name}
                            <ChevronDown className={`w-5 h-5 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === item.name && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-neutral-50 rounded-lg"
                              >
                                <div className="py-2 flex flex-col">
                                  {item.dropdownItems.map((subItem) => (
                                    <a
                                      key={subItem.name}
                                      href={subItem.href}
                                      onClick={(e) => scrollToSection(e, subItem.href)}
                                      className="px-4 py-3 text-sm text-neutral-600 hover:text-brand-600 hover:bg-neutral-100"
                                    >
                                      {subItem.name}
                                    </a>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <a
                          href={item.href}
                          onClick={(e) => scrollToSection(e, item.href)}
                          className="py-3 text-base font-medium text-neutral-700 hover:text-brand-600 border-b border-neutral-50 last:border-0"
                        >
                          {item.name}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Language Switcher (Bottom) */}
              <div className="p-4 border-t border-neutral-100 bg-neutral-50">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => changeLanguage('id')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      i18n.language === 'id' 
                        ? 'bg-brand-600 text-white shadow-sm' 
                        : 'bg-white text-neutral-600 border border-neutral-200'
                    }`}
                  >
                    Bahasa Indonesia
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      i18n.language.startsWith('en') 
                        ? 'bg-brand-600 text-white shadow-sm' 
                        : 'bg-white text-neutral-600 border border-neutral-200'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
