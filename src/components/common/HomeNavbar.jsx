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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav className="w-full bg-white border-b-0 sticky top-[40px] md:top-[45px] z-50" ref={navRef}>
      <div className="px-4 sm:px-6 lg:px-8 h-[60px] md:h-[70px] flex items-center justify-between relative">
        <div className="flex items-center gap-3 md:gap-6">
          <img src={coBrotherLogo} alt="CoBrother" className="h-8 md:h-10 w-auto" />

          <div className="hidden lg:flex items-center gap-1 lg:gap-4">
            <div className="relative">
              <button
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 border-none rounded-lg text-[14px] lg:text-[15px] font-semibold cursor-pointer transition-all duration-200 ${
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
                    onClick={() => {
                      navigate('/domains');
                      setOpenDropdown(null);
                    }}
                  >
                    {t('exploreDomains')}
                  </button>
                  <button
                    className="block w-full px-4 py-3 border-none text-left text-sm text-gray-700 bg-transparent cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => {
                      navigate('/domains/dashboard');
                      setOpenDropdown(null);
                    }}
                  >
                    {t('listDomains')}
                  </button>
                  <button
                    className="block w-full px-4 py-3 border-none text-left text-sm text-gray-700 bg-transparent cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => {
                      navigate('/auctions');
                      setOpenDropdown(null);
                    }}
                  >
                    {t('bidDomains')}
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 border-none rounded-lg text-[14px] lg:text-[15px] font-semibold cursor-pointer transition-all duration-200 ${
                  openDropdown === 'venture'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-transparent text-gray-900 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setOpenDropdown(openDropdown === 'venture' ? null : 'venture')}
              >
                {t('Ventures')} <ChevronDown size={14} />
              </button>
              {openDropdown === 'venture' && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] z-50 overflow-hidden">
                  <button
                    className="block w-full px-4 py-3 border-none text-left text-sm text-gray-700 bg-transparent cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => {
                      navigate('/ventures');
                      setOpenDropdown(null);
                    }}
                  >
                    {t('exploreVenture')}
                  </button>
                  <button
                    className="block w-full px-4 py-3 border-none text-left text-sm text-gray-700 bg-transparent cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => {
                      navigate('/ventures/new');
                      setOpenDropdown(null);
                    }}
                  >
                    {t('listVenture')}
                  </button>
                  <button
                    className="block w-full px-4 py-3 border-none text-left text-sm text-gray-700 bg-transparent cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => {
                      navigate('/auctions');
                      setOpenDropdown(null);
                    }}
                  >
                    {t('bidVenture')}
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 border-none rounded-lg text-[14px] lg:text-[15px] font-semibold cursor-pointer transition-all duration-200 ${
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
                    onClick={() => {
                      navigate('/auctions');
                      setOpenDropdown(null);
                    }}
                  >
                    {t('liveAuctions')}
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 border-none rounded-lg text-[14px] lg:text-[15px] font-semibold cursor-pointer transition-all duration-200 ${
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
                    onClick={() => {
                      navigate('/cocreation');
                      setOpenDropdown(null);
                    }}
                  >
                    {t('exploreTechnology')}
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 border-none rounded-lg text-[14px] lg:text-[15px] font-semibold cursor-pointer transition-all duration-200 ${
                  openDropdown === 'disruptors'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-transparent text-gray-900 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setOpenDropdown(openDropdown === 'disruptors' ? null : 'disruptors')}
              >
                {t('disruptors')} <ChevronDown size={14} />
              </button>
              {openDropdown === 'disruptors' && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px] z-50 overflow-hidden">
                  <button
                    className="block w-full px-4 py-3 border-none text-left text-sm text-gray-700 bg-transparent cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => {
                      navigate('/join-form');
                      setOpenDropdown(null);
                    }}
                  >
                    {t('beTheDisruptors')}
                  </button>
                  <button
                    className="block w-full px-4 py-3 border-none text-left text-sm text-gray-700 bg-transparent cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => {
                      navigate('/community');
                      setOpenDropdown(null);
                    }}
                  >
                    {t('exploreDisruptors')}
                  </button>
                  <button
                    className="block w-full px-4 py-3 border-none text-left text-sm text-gray-700 bg-transparent cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => {
                      navigate('/auctions');
                      setOpenDropdown(null);
                    }}
                  >
                    {t('bidDisruptors')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <button
            className="lg:hidden bg-transparent border-none text-gray-900 cursor-pointer transition-colors duration-200 hover:text-gray-900"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden lg:flex items-center gap-2 lg:gap-3">
            <button className="btn-glow btn-glow-md" onClick={() => navigate('/join-form')}>
              {t('joinUs')}
            </button>
            <button className="btn-glow btn-glow-md" onClick={() => navigate('/login')}>
              {t('signIn')}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed top-[100px] inset-x-0 bottom-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          <div className="lg:hidden fixed top-[100px] left-0 w-[290px] max-w-[90vw] h-[calc(100dvh-100px)] bg-white shadow-2xl z-50 animate-[slideInLeft_0.3s_ease-out] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 m-0">Menu</h3>
              <button
                className="bg-transparent border-none cursor-pointer text-gray-600 transition-colors duration-200 hover:text-gray-900"
                onClick={closeMobileMenu}
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col py-2">
              <button
                className="w-full px-5 py-3.5 border-none text-left text-base text-gray-700 bg-transparent cursor-pointer transition-all duration-200 border-l-[3px] border-l-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-l-gray-900"
                onClick={() => {
                  navigate('/domains');
                  closeMobileMenu();
                }}
              >
                {t('domains')}
              </button>
              <button
                className="w-full px-5 py-3.5 border-none text-left text-base text-gray-700 bg-transparent cursor-pointer transition-all duration-200 border-l-[3px] border-l-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-l-gray-900"
                onClick={() => {
                  navigate('/ventures');
                  closeMobileMenu();
                }}
              >
                {t('venture')}
              </button>
              <button
                className="w-full px-5 py-3.5 border-none text-left text-base text-gray-700 bg-transparent cursor-pointer transition-all duration-200 border-l-[3px] border-l-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-l-gray-900"
                onClick={() => {
                  navigate('/auctions');
                  closeMobileMenu();
                }}
              >
                {t('auctions')}
              </button>
              <button
                className="w-full px-5 py-3.5 border-none text-left text-base text-gray-700 bg-transparent cursor-pointer transition-all duration-200 border-l-[3px] border-l-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-l-gray-900"
                onClick={() => {
                  navigate('/cocreation');
                  closeMobileMenu();
                }}
              >
                {t('technologies')}
              </button>
              <button
                className="w-full px-5 py-3.5 border-none text-left text-base text-gray-700 bg-transparent cursor-pointer transition-all duration-200 border-l-[3px] border-l-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-l-gray-900"
                onClick={() => {
                  navigate('/community');
                  closeMobileMenu();
                }}
              >
                {t('disruptors')}
              </button>
              <div className="px-5 pt-4 pb-2 grid grid-cols-1 gap-2">
                <button className="btn-glow btn-glow-md w-full" onClick={() => { navigate('/join-form'); closeMobileMenu(); }}>
                  {t('joinUs')}
                </button>
                <button className="btn-glow btn-glow-md w-full" onClick={() => { navigate('/login'); closeMobileMenu(); }}>
                  {t('signIn')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
