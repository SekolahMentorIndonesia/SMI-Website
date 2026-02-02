import { Facebook, Instagram, Mail, MapPin, Phone, MessageCircle } from "lucide-react";
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

export default function Footer({ 
  variant = 'smi',
  type, // legacy prop
  showCTA = true,
  className = "",
}) {
  // Map legacy type to variant if variant is default
  const effectiveVariant = 'smi';
  
  // Determine translation namespace based on variant
  // Load both namespaces to ensure access to all keys, prioritizing landing for MPB/Global content
  const { t } = useTranslation(['landing', 'home']);
  const currentYear = new Date().getFullYear();

  // Social media links (MPB or SMI specific? Keeping existing for now but could be variant based)
  const socialLinks = [
    { Icon: Instagram, url: 'https://www.instagram.com/sekolahmentor.id' },
    { Icon: TikTok, url: 'https://www.tiktok.com/@growwithsmi' },
    { Icon: Facebook, url: 'https://www.facebook.com/share/16kGyY5br5/' }
  ];

  // Navigation links based on variant
  const getNavigationLinks = () => {
    return [
      { href: "/sekolah-mentor-indonesia", text: t('footer.nav.about', { ns: 'home' }) },
      { href: "#program", text: t('footer.nav.program', { ns: 'home' }) },
      { href: "#keunggulan", text: t('footer.nav.features', { ns: 'home' }) }
    ];
  };

  const navigationLinks = getNavigationLinks();

  return (
    <footer className={`bg-neutral-900 text-neutral-400 pt-16 lg:pt-24 pb-12 px-6 ${effectiveVariant === 'smi' ? 'mt-20' : ''} ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Company Info (MPB Group) */}
          <div className="flex flex-col items-start">
            <a href="/" className="flex flex-col items-start mb-6 group">
                  <span className="text-xl font-bold text-white leading-tight tracking-tight">MPB Group</span>
                  <span className="text-xs text-neutral-500 font-medium tracking-wide uppercase mt-0.5">Multiusaha Prioritas Bersama</span>
            </a>
            <p className="text-sm leading-relaxed mb-8 font-sans text-neutral-400 max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, url }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-neutral-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all text-neutral-400 rounded-full group"
                  aria-label={`Social link ${i + 1}`}
                >
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Business Units */}
          <div>
             <h4 className="text-white font-bold text-sm mb-6 font-display uppercase tracking-widest border-b border-neutral-800 pb-2 inline-block">
              {t('footer.business_units', { ns: 'company' })}
            </h4>
            <ul className="space-y-4 text-sm font-sans">
              <li>
                <a href="/sekolah-mentor-indonesia" className="group flex items-center gap-2 hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 group-hover:scale-125 transition-transform"></span>
                  Sekolah Mentor Indonesia
                </a>
              </li>
              {/* Future business units can be added here */}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6 font-display uppercase tracking-widest border-b border-neutral-800 pb-2 inline-block">
              {t('footer.contact', { ns: 'company' }) || 'Contact'}
            </h4>
            <div className="flex flex-col gap-5">
              <div className="flex gap-3 items-start">
                <MapPin className="text-brand-500 flex-shrink-0 mt-1 w-5 h-5" />
                <span className="text-sm leading-relaxed">Bekasi, Jawa Barat<br/>Indonesia</span>
              </div>
              <div className="flex gap-3 items-center">
                <Phone className="text-brand-500 flex-shrink-0 w-5 h-5" />
                <a href="tel:+6281915020498" className="text-sm hover:text-white transition-colors">+62 819-1502-0498</a>
              </div>
              <div className="flex gap-3 items-center">
                <MessageCircle className="text-brand-500 flex-shrink-0 w-5 h-5" />
                <a href="https://wa.me/6281915020498" className="text-sm hover:text-white transition-colors">+62 819-1502-0498</a>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="text-brand-500 flex-shrink-0 w-5 h-5" />
                <a href="mailto:multiusahaprioritasbersama@gmail.com" className="text-sm hover:text-white transition-colors">multiusahaprioritasbersama@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Column 4: Legal & Company */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6 font-display uppercase tracking-widest border-b border-neutral-800 pb-2 inline-block">
              {t('footer.company_header', { ns: 'company' })}
            </h4>
            <ul className="space-y-3 text-sm font-sans mb-8">
              {navigationLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="hover:text-brand-400 transition-colors block py-1">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
            
            <h4 className="text-white font-bold text-sm mb-4 font-display uppercase tracking-widest border-b border-neutral-800 pb-2 inline-block">
              {t('footer.legal', { ns: 'company' })}
            </h4>
            <ul className="space-y-3 text-sm font-sans">
              <li><a href="#" className="hover:text-brand-400 transition-colors">{t('footer.privacy', { ns: 'company' })}</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">{t('footer.terms', { ns: 'company' })}</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs text-neutral-500 font-sans">
            {t('footer.copyright', { ns: 'company', year: currentYear })}
          </p>
          <p className="text-xs text-neutral-600 font-sans flex items-center gap-1">
            <span>{t('footer.powered_by', { ns: 'company' })}</span>
            <span className="text-neutral-500 font-medium">MPB Group</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
