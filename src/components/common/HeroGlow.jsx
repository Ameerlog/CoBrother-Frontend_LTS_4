import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HeroGlow() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative py-8 md:py-12 px-4 sm:px-6 lg:px-8 border-b-0 overflow-hidden bg-transparent">

      <div className="absolute inset-0 z-0 pointer-events-none glow-layer" />

      <div className="max-w-[1200px] mx-auto flex flex-col gap-5 md:gap-12 relative z-10">
        <div className="flex flex-col gap-5">
          <h2 className="font-display text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] font-bold text-gray-900 m-0 leading-tight">
            {t('heroHeading')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 m-0 leading-relaxed max-w-[600px]">
            {t('heroSubtitle')}
          </p>
          {/* <button
            className="bg-[#232F3E] text-white border-none py-3.5 px-7 rounded-full text-base font-semibold cursor-pointer transition-all duration-200 self-start font-body hover:bg-white hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
            onClick={() => navigate('/login')}
          >
            {t('exploreNowBtn')}
          </button> */}
        </div>
      </div>

      <style>{`
        @property --glow-hue {
          syntax: '<number>';
          initial-value: 270;
          inherits: false;
        }

        @keyframes hueRotate {
          from { --glow-hue: 270; }
          to   { --glow-hue: 630; }
        }

        .glow-layer {
          animation: hueRotate 24s linear infinite;
          background: radial-gradient(
            ellipse 100% 85% at 45% 0%,
            hsl(var(--glow-hue), 80%, 62%, 0.30) 0%,
            hsl(var(--glow-hue), 75%, 60%, 0.14) 40%,
            hsl(var(--glow-hue), 70%, 58%, 0.04) 65%,
            transparent 82%
          );
        }

        @media (prefers-reduced-motion: reduce) {
          .glow-layer {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
