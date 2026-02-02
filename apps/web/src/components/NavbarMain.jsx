import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown, Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router";

export default function NavbarMain() {
  const { t, i18n } = useTranslation('common');
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const role = user?.role?.toLowerCase();
  const isAdminRole = role === 'admin' || role === 'superadmin' || role === 'owner';

  const leftMenuItems = [
    { name: t('navbar.home'), href: '/' },
    { name: t('navbar.free_content'), href: '/konten-gratis' },
    { name: t('navbar.community'), href: '#komunitas' },
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
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
        {/* Left Menu - Desktop Only */}
        <div className="hidden lg:flex items-center gap-8">
          {leftMenuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors duration-200 relative group"
            >
              {item.name}
              <span className="absolute bottom-[-2px] left-0 w-0 h-0.5 bg-brand-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Center Logo */}
        <Link 
          to="/"
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
        >
          <img 
            src="/logo.jpeg" 
            alt="Logo Sekolah Mentor Indonesia" 
            className="h-20 w-auto object-contain transition-transform hover:scale-105 duration-200" 
          />
        </Link>

        {/* Right Menu - Desktop Only */}
        <div className="hidden lg:flex items-center gap-8">
          {rightMenuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors duration-200 relative group"
            >
              {item.name}
              <span className="absolute bottom-[-2px] left-0 w-0 h-0.5 bg-brand-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
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

          {/* Auth Section - Desktop Only */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdminRole && (
                  <button 
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-md border border-brand-100 font-bold text-xs hover:bg-brand-100 transition-all duration-200"
                  >
                    Dashboard
                  </button>
                )}
                
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 pr-2 bg-neutral-50 rounded-full hover:bg-neutral-100 transition-all duration-200 border border-neutral-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs font-bold text-neutral-700">{user?.name}</span>
                    <ChevronDown className={`text-neutral-400 w-3 h-3 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-sm border border-neutral-100 p-1 overflow-hidden"
                      >
                        <button 
                          onClick={() => {
                            navigate('/profile');
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50 rounded-md flex items-center gap-2 transition-colors duration-200"
                        >
                          <User className="w-3 h-3" /> Profil
                        </button>
                        <button 
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-md flex items-center gap-2 transition-colors duration-200"
                        >
                          <LogOut className="w-3 h-3" /> Keluar
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Link 
                  to="/login"
                  className="text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-600 text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-brand-700 transition-all duration-200"
                >
                  Daftar
                </Link>
              </div>
            )}
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
              <h3 className="text-lg font-bold text-brand-600">Menu</h3>
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
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group block px-4 py-3 text-neutral-700 hover:text-white hover:bg-gradient-to-r hover:from-brand-600 hover:to-brand-700 rounded-xl transition-all duration-300 font-medium relative overflow-hidden"
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Auth Section */}
            <div className="p-4 border-t border-neutral-100 bg-gradient-to-r from-brand-50 to-blue-50">
              {isAuthenticated ? (
                <div className="space-y-3">
                  {isAdminRole && (
                    <button 
                      onClick={() => {
                        navigate('/admin/dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-50 text-brand-600 rounded-xl font-bold text-sm hover:bg-brand-100 transition-all duration-200"
                    >
                      Dashboard
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      navigate('/profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-50 text-neutral-700 rounded-xl font-bold text-sm hover:bg-neutral-100 transition-all duration-200"
                  >
                    <User className="w-4 h-4" /> Profil
                  </button>
                  
                  <button 
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center px-4 py-3 text-neutral-700 rounded-xl font-bold text-sm hover:bg-neutral-100 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm hover:from-brand-700 hover:to-brand-800 transition-all duration-300"
                  >
                    Daftar
                  </Link>
                </div>
              )}
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
