import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown, Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router";

export default function NavbarMain() {
  const { t, i18n } = useTranslation('common');
  const { isAuthenticated, user, logout } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const role = user?.role?.toLowerCase();
  const isAdminRole = role === 'admin' || role === 'superadmin' || role === 'owner';

  const scrollToSection = (e, href) => {
    e.preventDefault();
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
    
    // Handle cross-page navigation with hash
    if (href.includes('#') && !href.startsWith('#')) {
      const [page, hash] = href.split('#');
      // If we're not on the correct page, navigate first
      if (window.location.pathname !== page) {
        window.location.href = href;
        return;
      }
      // If we're on the correct page, scroll to the section
      const element = document.querySelector(`#${hash}`);
      if (element) {
        const navbarHeight = 68; // Height of the fixed navbar
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      return;
    }
    
    // Handle anchor links on current page
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        const navbarHeight = 68; // Height of the fixed navbar
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // Handle regular navigation
      navigate(href);
    }
  };

  const leftMenuItems = [
    { name: t('navbar.home'), href: '/' },
    { name: t('navbar.free_content'), href: '/sekolah-mentor-indonesia' },
    { name: t('navbar.community'), href: '/#komunitas' },
  ];

  const rightMenuItems = [
    { name: t('navbar.package'), href: '/#paket' },
    { name: t('navbar.testimonial'), href: '/#testimoni' },
  ];

  const allMenuItems = [...leftMenuItems, ...rightMenuItems];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">
        {/* Left Menu - Desktop Only */}
        <div className="hidden lg:flex items-center gap-4 sm:gap-8">
          {leftMenuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors duration-200 relative group"
            >
              {item.name}
              <span className="absolute bottom-[-2px] left-0 w-0 h-0.5 bg-brand-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Center Logo */}
        <Link 
          to="/"
          className="flex items-center justify-center flex-shrink-0"
        >
          <img 
            src="/mbp.jpeg" 
            alt="Logo Sekolah Mentor Indonesia" 
            className="h-16 sm:h-20 w-auto object-contain transition-transform hover:scale-105 duration-200" 
          />
        </Link>

        {/* Right Menu - Desktop Only */}
        <div className="hidden lg:flex items-center gap-4 sm:gap-8">
          {rightMenuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors duration-200 relative group"
            >
              {item.name}
              <span className="absolute bottom-[-2px] left-0 w-0 h-0.5 bg-brand-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
          ))}

          {/* Language Switcher - Desktop Only */}
          <div className="relative hidden lg:block">
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
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
        isMobileMenuOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <motion.div 
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: isMobileMenuOpen ? 0 : '-100%', opacity: isMobileMenuOpen ? 1 : 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute left-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-neutral-100 bg-white">
            <Link 
              to="/"
              className="hover:scale-105 transition-transform duration-200"
            >
              <img 
                src="/logo.jpeg" 
                alt="Logo Sekolah Mentor Indonesia" 
                className="h-12 w-auto object-contain" 
              />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-all duration-200"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-4">
              {allMenuItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="group flex items-center gap-3 px-4 py-3.5 text-neutral-700 hover:text-brand-600 font-medium rounded-lg transition-all duration-200 hover:bg-neutral-50"
                >
                  <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full group-hover:bg-brand-600 transition-colors duration-200"></span>
                  <span>{item.name}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Auth Section */}
          <div className="p-5 border-t border-neutral-100 bg-neutral-50">
            <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Akun</h4>
            <div className="space-y-2">
                <button 
                  onClick={() => {
                    navigate('/profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-neutral-700 rounded-lg font-medium text-sm hover:bg-neutral-100 border border-neutral-200 transition-all duration-200"
                >
                  <User className="w-4 h-4" /> Profil
                </button>
                
                <button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
          </div>

          {/* Language Section */}
          <div className="p-5 border-t border-neutral-100 bg-neutral-50">
            <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Bahasa</h4>
            <div className="space-y-2">
              <button
                onClick={() => {
                  changeLanguage('id');
                  setIsLangOpen(false);
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  i18n.language === 'id' 
                    ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md' 
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                ID 🌐
              </button>
              <button
                onClick={() => {
                  changeLanguage('en');
                  setIsLangOpen(false);
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  i18n.language.startsWith('en') 
                    ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md' 
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                EN 🌐
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-neutral-100 bg-white">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-neutral-500 text-center">
                © {new Date().getFullYear()} Sekolah Mentor Indonesia
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </nav>
  );
}
