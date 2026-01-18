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

export default function SMIFooter() {
  const { t } = useTranslation('landing');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-400 pt-16 lg:pt-20 pb-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <a href="/app" className="flex items-center mb-6 group">
              <img 
                src="/logo.jpeg" 
                alt="Logo Sekolah Mentor Indonesia - Platform Mentoring Content Creator" 
                className="h-14 sm:h-16 w-auto object-contain rounded-lg transition-transform group-hover:scale-105"
              />
            </a>
            <p className="text-sm leading-relaxed mb-8 font-sans max-w-xs">
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
                  className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all text-neutral-400 group"
                >
                  <Icon className="w-[18px] h-[18px] transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="sm:pl-8 lg:pl-0">
            <h4 className="text-white font-bold text-xs sm:text-sm mb-6 font-display uppercase tracking-widest">{t('footer.company')}</h4>
            <ul className="space-y-4 text-sm font-sans">
              <li><a href="#about" className="hover:text-brand-400 transition-colors block py-1">{t('header.nav.about')}</a></li>
              <li><a href="#products" className="hover:text-brand-400 transition-colors block py-1">{t('header.nav.products')}</a></li>
              <li><a href="#benefits" className="hover:text-brand-400 transition-colors block py-1">{t('header.nav.benefits')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs sm:text-sm mb-6 font-display uppercase tracking-widest">{t('footer.contact')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              <ul className="space-y-4 text-sm font-sans">
                <li className="flex gap-3 items-start">
                  <MapPin className="text-brand-500 flex-shrink-0 mt-0.5 w-[18px] h-[18px]" />
                  <span className="leading-snug">Bekasi, Indonesia</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Phone className="text-brand-500 flex-shrink-0 w-[18px] h-[18px]" />
                  <a href="https://wa.me/6281915020498" className="hover:text-brand-400 transition-colors">+62 819-1502-0498</a>
                </li>
              </ul>
              <ul className="space-y-4 text-sm font-sans">
                <li className="flex gap-3 items-start">
                  <Mail className="text-brand-500 flex-shrink-0 mt-0.5 w-[18px] h-[18px]" />
                  <span className="break-all leading-snug">sekolahmentorindonesia@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
          <p className="text-[10px] sm:text-xs text-neutral-500 font-sans">
            © {currentYear} {t('footer.copyright')}
          </p>
          <p className="text-[10px] sm:text-xs text-neutral-600 font-sans">
            {t('footer.powered_by')}
          </p>
        </div>
      </div>
    </footer>
  );
}
