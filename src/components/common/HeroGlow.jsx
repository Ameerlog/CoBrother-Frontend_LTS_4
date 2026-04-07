import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HeroGlow() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative py-12 px-8 border-b-0 overflow-hidden bg-transparent">
      {/* Animated Gradient Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none animate-[sunGlow_20s_ease-in-out_infinite_alternate]"
        style={{
          background: 'radial-gradient(ellipse 100% 90% at 45% 0%, rgba(147, 51, 234, 0.52) 0%, rgba(147, 51, 234, 0.28) 38%, rgba(147, 51, 234, 0.08) 62%, rgba(255, 255, 255, 0) 80%)'
        }}
      />

      <div className="max-w-[1200px] mx-auto flex flex-col gap-12 relative z-10">
        {/* Main Section */}
        <div className="flex flex-col gap-5">
          <h2 className="font-display text-[2.5rem] font-bold text-gray-900 m-0 leading-tight">
            {t('heroHeading')}
          </h2>
          <p className="text-lg text-gray-700 m-0 leading-relaxed max-w-[600px]">
            {t('heroSubtitle')}
          </p>
          <button 
            className="bg-[#232F3E] text-white border-none py-3.5 px-7 rounded-full text-base font-semibold cursor-pointer transition-all duration-200 self-start font-body hover:bg-white hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
            onClick={() => navigate('/login')}
          >
            {t('exploreNowBtn')}
          </button>
        </div>

        {/* Secondary Section */}
        <div className="flex flex-col gap-4 pt-8 border-t border-purple/15">
          <h3 className="font-display text-[1.75rem] font-bold text-gray-900 m-0 leading-snug">
            {t('secondaryHeading')}
          </h3>
          <p className="text-base text-gray-600 m-0 leading-[1.7] max-w-[900px]">
            {t('secondaryDescription')}
          </p>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          section {
            padding: 1.25rem 1rem;
          }
          .gap-12 {
            gap: 1.25rem;
          }
          .text-\[2\.5rem\] {
            font-size: 22px;
            line-height: 1.3;
            margin-bottom: 0.5rem;
          }
          .text-lg {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 0.75rem;
          }
          button {
            width: 100%;
            text-align: center;
            padding: 0.875rem 1.5rem;
            font-size: 16px;
            margin-top: 0.5rem;
          }
          .pt-8 {
            padding-top: 1rem;
          }
          .text-\[1\.75rem\] {
            font-size: 1.125rem;
            line-height: 1.4;
          }
          .text-base {
            font-size: 0.875rem;
            line-height: 1.6;
          }
        }
        @keyframes sunGlow {
          0%   { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(90deg); }
        }
      `}</style>
    </section>
  );
}
