import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

// Custom TikTok Icon
const TikTok = ({ size = 16 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function SMIHomeFooter() {
  const { t } = useTranslation('home');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-400 pt-16 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <a href="/app" className="flex items-center mb-6 group">
              <img 
                src="/logo.jpeg" 
                alt="Logo Sekolah Mentor Indonesia - Platform Mentoring Content Creator" 
                className="h-14 sm:h-16 w-auto object-contain rounded-lg transition-transform group-hover:scale-105"
              />
            </a>
            <p className="text-sm leading-relaxed mb-6 sm:mb-8 font-sans max-w-xs text-neutral-400">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, url: 'https://www.instagram.com/sekolahmentor.id' },
                { Icon: TikTok, url: 'https://www.tiktok.com/@growwithsmi' },
                { Icon: Facebook, url: 'https://www.facebook.com/share/16kGyY5br5/' }
              ].map(({ Icon, url }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all text-neutral-400"
                >
                  <Icon className="w-4 h-4 sm:w-4 sm:h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="sm:pl-4 lg:pl-0">
            <h4 className="text-white font-bold text-[10px] sm:text-xs mb-4 sm:mb-6 font-display uppercase tracking-widest">
              {t('footer.categories.company')}
            </h4>
            <ul className="space-y-3 sm:space-y-4 text-sm font-sans">
              <li><a href="/app" className="hover:text-brand-400 transition-colors">{t('footer.nav.about')}</a></li>
              <li><a href="#program" className="hover:text-brand-400 transition-colors">{t('footer.nav.program')}</a></li>
              <li><a href="#keunggulan" className="hover:text-brand-400 transition-colors">{t('footer.nav.features')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="sm:col-span-2">
            <h4 className="text-white font-bold text-[10px] sm:text-xs mb-4 sm:mb-6 font-display uppercase tracking-widest">
              {t('footer.categories.contact')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <ul className="space-y-3 sm:space-y-4 text-sm font-sans">
                <li className="flex gap-3 items-start">
                  <MapPin className="text-brand-500 flex-shrink-0 w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  <span className="text-sm">Bekasi, Indonesia</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Phone className="text-brand-500 flex-shrink-0 w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  <a href="https://wa.me/6281915020498" className="hover:text-brand-400 transition-colors text-sm">+62 819-1502-0498</a>
                </li>
              </ul>
              <ul className="space-y-3 sm:space-y-4 text-sm font-sans">
                <li className="flex gap-3 items-start">
                  <Mail className="text-brand-500 flex-shrink-0 w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  <span className="text-sm break-all">admin@sekolahmentorindonesia.id</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 sm:pt-10 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
          <p className="text-[10px] sm:text-xs text-neutral-500 font-sans">
            {t('footer.copyright', { year: currentYear })}
          </p>
          <p className="text-[10px] sm:text-xs text-neutral-600 font-sans">
            {t('footer.powered_by')}
          </p>
        </div>
      </div>
    </footer>
  );
}
