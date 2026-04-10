import { useState, useEffect } from 'react';
import { ChevronDown, Globe, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import cobrotherProfile from '../../assets/CoBrother_profileW.png';

export default function TopNavbar({ homeMobileMenu = false }) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInitial, setShowInitial] = useState(false);

  const languages = [
    { code: 'en', name: 'English (IND)', currency: '₹' },
    { code: 'hi', name: 'Hindi', currency: '₹' },
    { code: 'en-US', name: 'English (US)', currency: '$' },
    { code: 'ur', name: 'Urdu', currency: '₹' },
    { code: 'zh', name: '中文', currency: '$' },
    { code: 'fr', name: 'Français', currency: '$' },
    { code: 'pt', name: 'Português', currency: '$' }
  ];

  const currentLanguageName = languages.find((l) => l.code === i18n.language)?.name || 'English (IND)';

  // Slow flip animation every 3 seconds when user is logged in
  useEffect(() => {
    if (!user) {
      setShowInitial(false);
      return;
    }

    // Start the flip effect after 1 second
    const startFlip = setTimeout(() => {
      setShowInitial(true);
    }, 1000);

    // Flip every 3 seconds
    const interval = setInterval(() => {
      setShowInitial(prev => !prev);
    }, 3000);

    return () => {
      clearTimeout(startFlip);
      clearInterval(interval);
    };
  }, [user]);

  const getUserInitial = () => {
    if (!user) return '';
    return user.fullName?.charAt(0)?.toUpperCase() || user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U';
  };

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

          {/* Profile/Initial Icon with Slow Flip */}
          <div className="relative ml-1 md:ml-2">
            <a
              href={user ? "/dashboard" : "/profile"}
              className="block w-[30px] h-[30px] md:w-[36px] md:h-[36px] shrink-0 rounded-full cursor-pointer no-underline transition-all duration-500 hover:scale-110"
              style={{
                perspective: '500px',
              }}
            >
              {/* Front - Profile Icon */}
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center border-[1.75px] border-white/35 bg-transparent transition-all duration-500"
                style={{
                  transform: showInitial ? 'rotateY(90deg) scale(0.5)' : 'rotateY(0deg) scale(1)',
                  opacity: showInitial ? 0 : 1,
                  backfaceVisibility: 'hidden',
                }}
              >
                <img src={cobrotherProfile} alt="Profile" className="w-full h-full object-contain p-1.5" />
              </div>

              {/* Back - User Initial Circle */}
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold text-sm transition-all duration-500"
                style={{
                  transform: showInitial ? 'rotateY(0deg) scale(1)' : 'rotateY(-90deg) scale(0.5)',
                  opacity: showInitial ? 1 : 0,
                  backfaceVisibility: 'hidden',
                }}
              >
                {getUserInitial()}
              </div>
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
