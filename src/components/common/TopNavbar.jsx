import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import cobrotherProfile from '../../assets/Community-profileicon.png';

export default function TopNavbar() {
  const { t, i18n } = useTranslation();
  const [languageOpen, setLanguageOpen] = useState(false);

  const languages = [
<<<<<<< HEAD
<<<<<<< HEAD
    { code: 'en', name: 'English (IND)', currency: '₹' },
    { code: 'hi', name: 'Hindi', currency: '₹' },
    { code: 'en-US', name: 'English (US)', currency: '₹' },
=======
    { code: 'en', name: 'English', currency: '₹' },
    { code: 'en-GB', name: 'UK English', currency: '₹' },
    { code: 'en-US', name: 'US English', currency: '₹' },
    { code: 'hi', name: 'हिन्दी', currency: '₹' },
>>>>>>> 3b774bd2a4e001096d952836f914779d448a42e4
=======
    { code: 'en', name: 'English (IND)', currency: '₹' },
    { code: 'hi', name: 'Hindi', currency: '₹' },
    { code: 'en-US', name: 'English (US)', currency: '$' },
    { code: 'ur', name: 'Urdu', currency: '₹' },
>>>>>>> Kedits
    { code: 'zh', name: '中文', currency: '$' },
    { code: 'fr', name: 'Français', currency: '$' },
    { code: 'pt', name: 'Português', currency: '$' }
  ];

  const handleLanguageSelect = (langCode) => {
    i18n.changeLanguage(langCode);
    setLanguageOpen(false);
  };

  const currentLanguageName = languages.find(l => l.code === i18n.language)?.name || 'English';

  return (
    <div className="sticky top-0 w-full h-[45px] z-[1001] border-b border-purple/[0.18] font-body" 
         style={{ background: 'linear-gradient(90deg, #0e0b1e 0%, #130d28 60%, #0f1225 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-8 h-full flex items-center justify-end">
        <div className="flex items-center gap-5">
          {/* Language Selector */}
          <div className="relative">
            <button 
              className="text-white text-sm font-normal no-underline flex items-center gap-1 px-3 py-2 rounded transition-colors duration-200 cursor-pointer bg-transparent border-none font-body hover:bg-purple/15 hover:text-purple-light"
              onClick={() => setLanguageOpen(!languageOpen)}
            >
              <Globe size={16} /> {currentLanguageName} <ChevronDown size={14} />
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

          {/* Contact Us */}
          <div className="relative md:block hidden">
            <a href="/contact" className="text-white text-sm font-normal no-underline flex items-center gap-1 px-3 py-2 rounded transition-colors duration-200 cursor-pointer bg-transparent border-none font-body hover:bg-purple/15 hover:text-purple-light">
              {t('contactUs')}
            </a>
          </div>

          {/* My Account */}
          <div className="relative md:block hidden">
            <a href="/account" className="text-white text-sm font-normal no-underline flex items-center gap-1 px-3 py-2 rounded transition-colors duration-200 cursor-pointer bg-transparent border-none font-body hover:bg-purple/15 hover:text-purple-light">
              {t('myAccount')}
            </a>
          </div>

          {/* Profile Icon */}
          <div className="relative ml-2">
            <a href="/profile" className="w-9 h-9 rounded-full flex items-center justify-center text-white bg-transparent border-2 border-white/30 cursor-pointer relative transition-all duration-300 no-underline hover:text-purple-light hover:scale-105 hover:shadow-[0_0_12px_rgba(147,51,234,0.4)] group">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full opacity-0 transition-all duration-300 -z-10 group-hover:w-[60px] group-hover:h-[60px] group-hover:opacity-100"
                    style={{ background: 'radial-gradient(circle, rgba(147, 51, 234, 0.5) 0%, rgba(59, 130, 246, 0.25) 50%, transparent 70%)' }}></span>
              <img src={cobrotherProfile} alt="Profile" className="w-full h-full object-contain p-1.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .h-\[45px\] {
            height: 40px;
            position: sticky;
            top: 0;
            z-index: 101;
          }
          .px-8 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .gap-5 {
            gap: 8px;
          }
          .text-sm {
            font-size: 0.75rem;
          }
          .px-3 {
            padding-left: 8px;
            padding-right: 8px;
          }
          .py-2 {
            padding-top: 4px;
            padding-bottom: 4px;
          }
          .w-9 {
            width: 28px;
          }
          .h-9 {
            height: 28px;
          }
          .border-2 {
            border-width: 1.5px;
          }
          .min-w-\[140px\] {
            min-width: 120px;
          }
        }
      `}</style>
    </div>
  );
}
