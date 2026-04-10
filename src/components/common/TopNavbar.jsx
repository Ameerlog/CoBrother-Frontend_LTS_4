import { useState } from 'react';
import { ChevronDown, Globe, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import cobrotherProfile from '../../assets/CoBrother_profileW.png';

export default function TopNavbar({ homeMobileMenu = false }) {
  const { t, i18n } = useTranslation();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English (IND)', currency: '₹' },
    { code: 'hi', name: 'Hindi', currency: '₹' },
    { code: 'en-US', name: 'English (US)', currency: '$' },
    { code: 'ur', name: 'Urdu', currency: '₹' },
    { code: 'zh', name: '中文', currency: '$' },
    { code: 'fr', name: 'Français', currency: '$' },
    { code: 'pt', name: 'Português', currency: '$' }
  ];

  const handleLanguageSelect = (langCode) => {
    i18n.changeLanguage(langCode);
    setLanguageOpen(false);
  };

  const currentLanguageName = languages.find((l) => l.code === i18n.language)?.name || 'English';

  return (
    <div
      className="sticky top-0 w-full h-[40px] md:h-[45px] z-[1001] border-b border-purple/[0.18] font-body"
      style={{ background: 'linear-gradient(90deg, #0e0b1e 0%, #130d28 60%, #0f1225 100%)' }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex items-center justify-end">
        <div className="flex items-center gap-2 md:gap-5">
          <div className="relative">
            <button
              className="text-white text-xs md:text-sm font-normal no-underline flex items-center gap-1 px-2.5 md:px-3 py-1.5 md:py-2 rounded transition-colors duration-200 cursor-pointer bg-transparent border-none font-body hover:bg-white/15 hover:text-gray-200"
              onClick={() => setLanguageOpen((prev) => !prev)}
            >
              <Globe size={14} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">{currentLanguageName}</span>
              <ChevronDown size={14} />
            </button>
            {languageOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[140px] overflow-hidden z-[1001]">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full px-4 py-2.5 bg-transparent border-none text-left text-sm cursor-pointer transition-colors duration-200 font-body ${
                      i18n.language === lang.code
                        ? 'bg-purple-50 text-purple font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative hidden md:block">
            <a
              href="/contact"
              className="text-white text-sm font-normal no-underline flex items-center gap-1 px-3 py-2 rounded transition-colors duration-200 cursor-pointer bg-transparent border-none font-body hover:bg-white/15 hover:text-gray-200"
            >
              {t('contactUs')}
            </a>
          </div>

          <div className="relative hidden md:block">
            <a
              href="/account"
              className="text-white text-sm font-normal no-underline flex items-center gap-1 px-3 py-2 rounded transition-colors duration-200 cursor-pointer bg-transparent border-none font-body hover:bg-white/15 hover:text-gray-200"
            >
              {t('myAccount')}
            </a>
          </div>

          <div className="relative ml-1 md:ml-2">
            <a
              href="/profile"
              className="w-[30px] h-[30px] md:w-[36px] md:h-[36px] min-w-[30px] min-h-[30px] md:min-w-[36px] md:min-h-[36px] shrink-0 rounded-full flex items-center justify-center text-white bg-transparent border-[1.75px] border-white/35 cursor-pointer relative transition-all duration-300 no-underline hover:text-gray-200 hover:scale-105 hover:shadow-[0_0_12px_rgba(255,255,255,0.2)] group overflow-hidden box-border"
            >
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full opacity-0 transition-all duration-300 -z-10 group-hover:w-[60px] group-hover:h-[60px] group-hover:opacity-100"
                style={{ background: 'radial-gradient(circle, rgba(147, 51, 234, 0.5) 0%, rgba(59, 130, 246, 0.25) 50%, transparent 70%)' }}
              ></span>
              <img src={cobrotherProfile} alt="Profile" className="w-full h-full object-contain p-1.5" />
            </a>
          </div>

          {homeMobileMenu && (
            <button
              type="button"
              aria-label="Toggle top menu"
              className="md:hidden text-white p-1.5 rounded hover:bg-white/15 transition-colors"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </div>

      {homeMobileMenu && mobileMenuOpen && (
        <div className="md:hidden absolute top-full inset-x-0 px-4 py-3 bg-[#130d28] border-b border-white/10">
          <div className="w-full flex flex-col gap-2">
            <a
              href="/contact"
              className="text-white text-sm px-3 py-2 rounded hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('contactUs')}
            </a>
            <a
              href="/account"
              className="text-white text-sm px-3 py-2 rounded hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('myAccount')}
            </a>
            <a
              href="/profile"
              className="text-white text-sm px-3 py-2 rounded hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
