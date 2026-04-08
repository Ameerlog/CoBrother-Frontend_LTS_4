import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import coBrotherLogo from '../../assets/Cobrother_logo.png';

export default function HomeNavbar({
  navRef,
  openDropdown,
  setOpenDropdown,
  navigate,
}) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="w-full bg-white border-b-0 sticky top-[45px] z-50" ref={navRef}>
      <div className="px-8 h-[70px] flex items-center justify-between relative max-md:px-4 max-md:h-[60px]">
        {/* Mobile Hamburger Menu */}
        <button 
          className="hidden max-md:block absolute left-4 bg-transparent border-none text-gray-900 text-2xl cursor-pointer transition-colors duration-200 hover:text-gray-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="flex items-center gap-8 max-md:flex-1 max-md:justify-center max-md:gap-0">
          <div className="flex items-center max-md:m-0">
            <img src={coBrotherLogo} alt="CoBrother" className="h-10 w-auto" />
          </div>
          <div className="flex items-center gap-4 max-md:hidden">
            <div className="relative">
              <button
                className={`flex items-center gap-2 px-4 py-2 border-none rounded-lg text-[15px] font-semibold cursor-pointer transition-all duration-200 ${
                  openDropdown === 'domains' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'bg-transparent text-gray-900 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setOpenDropdown(openDropdown === 'domains' ? null : 'domains')}
              >
                {t('domains')} <ChevronDown size={14} />
              </button>
              {openDropdown === 'domains' && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] z-50 overflow-hidden">
                  <button 
                    className="block w-full px-4 py-3 border-none text-left text-sm text-gray-700 bg-transparent cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => { navigate('/domains?type=premium'); setOpenDropdown(null); }}
                  >{t('premiumDomains')}</button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className={`flex items-center gap-2 px-4 py-2 border-none rounded-lg text-[15px] font-semibold cursor-pointer transition-all duration-200 ${
                  openDropdown === 'venture' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'bg-transparent text-gray-900 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setOpenDropdown(openDropdown === 'venture' ? null : 'venture')}
              >
                {t('venture')} <ChevronDown size={14} />
              </button>
              {openDropdown === 'venture' && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] z-50 overflow-hidden">
                  <button 
                    className="block w-full px-4 py-3 border-none text-left text-sm text-gray-700 bg-transparent cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => { navigate('/ventures'); setOpenDropdown(null); }}
                  >{t('allVentures')}</button>
                  <button 
                    className="block w-full px-4 py-3 border-none text-left text-sm text-gray-700 bg-transparent cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => { navigate('/ventures/new'); setOpenDropdown(null); }}
                  >{t('listVenture')}</button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className={`flex items-center gap-2 px-4 py-2 border-none rounded-lg text-[15px] font-semibold cursor-pointer transition-all duration-200 ${
                  openDropdown === 'technology' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'bg-transparent text-gray-900 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setOpenDropdown(openDropdown === 'technology' ? null : 'technology')}
              >
                {t('technologies')} <ChevronDown size={14} />
              </button>
              {openDropdown === 'technology' && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] z-50 overflow-hidden">
                  <button 
                    className="block w-full px-4 py-3 border-none text-left text-sm text-gray-700 bg-transparent cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => { navigate('/cocreation'); setOpenDropdown(null); }}
                  >{t('exploreSoftware')}</button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className={`flex items-center gap-2 px-4 py-2 border-none rounded-lg text-[15px] font-semibold cursor-pointer transition-all duration-200 ${
                  openDropdown === 'auctions' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'bg-transparent text-gray-900 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setOpenDropdown(openDropdown === 'auctions' ? null : 'auctions')}
              >
                {t('auctions')} <ChevronDown size={14} />
              </button>
              {openDropdown === 'auctions' && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] z-50 overflow-hidden">
                  <button 
                    className="block w-full px-4 py-3 border-none text-left text-sm text-gray-700 bg-transparent cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => { navigate('/auctions'); setOpenDropdown(null); }}
                  >{t('ongoingAuctions')}</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 max-md:gap-2 max-md:absolute max-md:right-4">
          <button 
            className="btn-glow btn-glow-sm"
            onClick={() => navigate('/join-form')}
          >
            {t('joinUs')}
          </button>
          <button 
            className="btn-glow btn-glow-sm"
            onClick={() => navigate('/login')}
          >
            {t('signIn')}
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <>
          <div 
            className="hidden max-md:block fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="hidden max-md:block fixed top-0 left-0 w-[280px] h-full bg-white shadow-2xl z-50 animate-[slideInLeft_0.3s_ease-out]">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 m-0">Menu</h3>
              <button 
                className="bg-transparent border-none cursor-pointer text-gray-600 transition-colors duration-200 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col py-4">
              <button 
                className="w-full px-6 py-4 border-none text-left text-base text-gray-700 bg-transparent cursor-pointer transition-all duration-200 border-l-[3px] border-l-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-l-gray-900"
                onClick={() => { navigate('/domains'); setMobileMenuOpen(false); }}
              >
                {t('domains')}
              </button>
              <button 
                className="w-full px-6 py-4 border-none text-left text-base text-gray-700 bg-transparent cursor-pointer transition-all duration-200 border-l-[3px] border-l-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-l-gray-900"
                onClick={() => { navigate('/ventures'); setMobileMenuOpen(false); }}
              >
                {t('venture')}
              </button>
              <button 
                className="w-full px-6 py-4 border-none text-left text-base text-gray-700 bg-transparent cursor-pointer transition-all duration-200 border-l-[3px] border-l-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-l-gray-900"
                onClick={() => { navigate('/cocreation'); setMobileMenuOpen(false); }}
              >
                {t('technologies')}
              </button>
              <button 
                className="w-full px-6 py-4 border-none text-left text-base text-gray-700 bg-transparent cursor-pointer transition-all duration-200 border-l-[3px] border-l-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-l-gray-900"
                onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }}
              >
                Contact Us
              </button>
              <button 
                className="w-full px-6 py-4 border-none text-left text-base text-gray-700 bg-transparent cursor-pointer transition-all duration-200 border-l-[3px] border-l-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-l-gray-900"
                onClick={() => { navigate('/account'); setMobileMenuOpen(false); }}
              >
                My Account
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
