import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown, Globe, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "react-i18next";

import { useNavigate, Link } from "react-router";

export default function SMINavbar() {
  const { t, i18n } = useTranslation('common');
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const role = user?.role?.toLowerCase();
  const isAdminRole = role === 'admin' || role === 'superadmin' || role === 'owner';
  const isSuperAdminRole = role === 'superadmin' || role === 'owner';

  const menuItems = [
    { name: t('navbar.free_content'), href: "#library" },
    { name: t('navbar.community'), href: "#komunitas" },
    { name: t('navbar.package'), href: "#paket" },
    { name: t('navbar.testimonial'), href: "#testimoni" },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 md:h-20 flex items-center justify-between">
        <a href="/app" className="flex items-center gap-2 group">
          <img 
            src="/logo.jpeg" 
            alt="Logo Sekolah Mentor Indonesia - Platform Mentoring Content Creator" 
            className="h-16 sm:h-[4.5rem] md:h-20 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Auth Section & Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-4 md:gap-6">
          {/* Desktop Language Switcher */}
          <div className="hidden sm:relative sm:block">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded-xl transition-colors text-neutral-600"
            >
              <Globe className="w-[18px] h-[18px]" />
              <span className="text-xs font-bold uppercase">{i18n.language}</span>
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
                      i18n.language.startsWith('en') ? 'bg-brand-50 text-brand-600' : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    EN
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden lg:flex items-center gap-3 md:gap-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {isAdminRole ? (
                  <button 
                    onClick={() => navigate('/admin/dashboard')}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full border border-brand-100 font-bold text-xs hover:bg-brand-100 transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard Admin
                  </button>
                ) : isSuperAdminRole ? (
                  <button 
                    onClick={() => navigate('/admin/dashboard')}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full border border-purple-100 font-bold text-xs hover:bg-purple-100 transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard Superadmin
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/profile')}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-neutral-50 text-neutral-700 rounded-full border border-neutral-200 font-bold text-xs hover:bg-neutral-100 transition-all"
                  >
                    <User className="w-3.5 h-3.5" />
                    Profil
                  </button>
                )}
                
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 pr-3 bg-neutral-50 rounded-full hover:bg-neutral-100 transition-all border border-neutral-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:block text-xs font-bold text-neutral-700">{user?.name}</span>
                    <ChevronDown className={`text-neutral-400 w-3.5 h-3.5 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-2 overflow-hidden"
                        >
                          <button 
                            onClick={() => {
                              navigate('/profile');
                              setIsProfileOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 rounded-xl flex items-center gap-2"
                          >
                            <User className="w-3.5 h-3.5" /> {t('navbar.my_profile')}
                          </button>
                          <button 
                            onClick={() => {
                              logout();
                              setIsProfileOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-2"
                          >
                            <LogOut className="w-3.5 h-3.5" /> {t('navbar.logout')}
                          </button>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login"
                  className="text-sm font-bold text-neutral-600 px-4 py-2 hover:text-brand-600 transition-colors"
                >
                  {t('navbar.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-600 text-white text-sm font-bold px-5 md:px-6 py-2 md:py-2.5 rounded-full shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all"
                >
                  {t('navbar.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-600 hover:bg-neutral-50 rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-neutral-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-neutral-600 hover:text-brand-600 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              
              <div className="pt-4 border-t border-neutral-50 space-y-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    {isAdminRole ? (
                      <button
                        onClick={() => {
                          navigate('/admin/dashboard');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-brand-50 text-brand-600 rounded-xl font-bold text-sm"
                      >
                        <LayoutDashboard className="w-4.5 h-4.5" /> Dashboard
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-50 text-neutral-700 rounded-xl font-bold text-sm"
                      >
                        <User className="w-4.5 h-4.5" /> {t('navbar.my_profile')}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl font-bold text-sm"
                    >
                      <LogOut className="w-4.5 h-4.5" /> {t('navbar.logout')}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center py-3 border border-neutral-200 rounded-xl font-bold text-sm text-neutral-600"
                    >
                      {t('navbar.login')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center py-3 bg-brand-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-200"
                    >
                      {t('navbar.register')}
                    </Link>
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-neutral-100">
                  <span className="text-sm font-medium text-neutral-500 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Language
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => changeLanguage('id')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${i18n.language === 'id' ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-600'}`}
                    >
                      ID
                    </button>
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${i18n.language.startsWith('en') ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-600'}`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
