import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import coBrotherLogo from '../../assets/Cobrother_Green.png';

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="w-4 h-4 sm:w-5 sm:h-5"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5">
    <path d="M24 12.073C24 5.404 18.629 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const socials = [
  { href: 'https://x.com/CoBrother141506', label: 'X', Icon: XIcon },
  { href: 'https://www.instagram.com/cobrother__?igsh=bXE3YnR4dDJ6NnVi', label: 'Instagram', Icon: InstagramIcon },
  { href: 'https://www.facebook.com/share/16vjEWTjHi/', label: 'Facebook', Icon: FacebookIcon },
  { href: 'https://www.linkedin.com/in/co-brother-9921b03aa', label: 'LinkedIn', Icon: LinkedinIcon },
  { href: 'https://www.youtube.com/channel/UCPq5njZ3e63myDvzfcoSDEQ', label: 'YouTube', Icon: YoutubeIcon },
];

const socialHoverStyles = {
  X: 'hover:text-white',
  Instagram: 'hover:text-pink-400',
  Facebook: 'hover:text-sky-400',
  LinkedIn: 'hover:text-sky-300',
  YouTube: 'hover:text-red-400',
};

const linkClass =
  'text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 no-underline block py-1.5';

// Full width gradient underline heading
const headingClass =
  'text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4 relative pb-3 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-12 sm:after:w-16 md:after:w-20 lg:after:w-24 after:h-px after:bg-gradient-to-r after:from-cyan-400 after:to-green-500/40';

export default function HomeFooter() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gradient-to-b from-slate-950 to-slate-900 text-slate-300 mt-auto border-t border-slate-800/80 relative">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 md:pt-16 pb-6 md:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-10 lg:gap-8 xl:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-4 lg:col-span-4 flex flex-col items-start justify-start">
            <Link to="/" className="inline-block mb-4 group">
              <img
                src={coBrotherLogo}
                alt="CoBrother"
                className="h-9 sm:h-10 md:h-11 w-auto opacity-90 group-hover:opacity-100 transition-opacity max-w-full"
              />
            </Link>
          </div>

          {/* Explore */}
          <div className="md:col-span-1 lg:col-span-2">
            <h3 className={headingClass}>{t('explore')}</h3>
            <nav className="flex flex-col">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`${linkClass} text-left`}>
                {t('home')}
              </button>
              <Link to="/join-form" className={linkClass}>
                {t('joinUs')}
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div className="md:col-span-1 lg:col-span-2">
            <h3 className={headingClass}>{t('company')}</h3>
            <nav className="flex flex-col">
              <Link to="/about" className={linkClass}>
                {t('aboutUs')}
              </Link>
              <Link to="/contact" className={linkClass}>
                {t('contact')}
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="md:col-span-1 lg:col-span-2">
            <h3 className={headingClass}>{t('legal')}</h3>
            <nav className="flex flex-col">
              <Link to="/privacy-policy" className={linkClass}>
                {t('privacyPolicy')}
              </Link>
              <Link to="/terms-and-conditions" className={linkClass}>
                {t('termsAndConditions')}
              </Link>
              <Link to="/cancellation-refund-policy" className={linkClass}>
                {t('cancellationRefund')}
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 flex flex-col">
            <h3 className={headingClass}>{t('showUsSomeLove')}</h3>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/50 text-slate-400 transition-all duration-300 hover:border-slate-500 hover:scale-110 hover:-translate-y-0.5 ${socialHoverStyles[label]}`}
                >
                  <Icon />
                </a>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-12 pt-5 sm:pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left">
          <p className="text-slate-500 text-xs sm:text-sm order-2 sm:order-1">
            {t('footerCopyright')}
          </p>

          <p className="text-slate-500 text-xs sm:text-sm flex items-center justify-center sm:justify-end gap-1.5 order-1 sm:order-2">
            {t('madeWith')}
            <span className="relative inline-flex items-center justify-center group">
              <Heart size={18} fill="#fb7185" stroke="none" className="text-rose-400 inline-block" />
              <Heart size={12} fill="#fb7185" stroke="none" className="floating-heart heart-1" />
              <Heart size={12} fill="#fb7185" stroke="none" className="floating-heart heart-2" />
              <Heart size={12} fill="#fb7185" stroke="none" className="floating-heart heart-3" />
            </span>
            {t('inIndia')}
          </p>
        </div>
      </div>

     

      <style>{`
        .floating-heart {
          position: absolute; top: 0; left: 50%;
          transform: translateX(-50%) translateY(0);
          opacity: 0; pointer-events: none;
        }
        .group:hover .floating-heart {
          opacity: 1; animation: heartFloat 1.4s ease-out infinite;
        }
        .heart-1 { animation-delay: 0s; }
        .heart-2 { animation-delay: 0.2s; }
        .heart-3 { animation-delay: 0.4s; }
        @keyframes heartFloat {
          0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.8; }
          25% { opacity: 1; }
          100% { transform: translateX(-50%) translateY(-28px) scale(0.8); opacity: 0; }
        }
      `}</style>
    </footer>
  );
}
