import DomainsSection from '../home/DomainsSection';
import VenturesSection from '../home/VenturesSection';
import TechnologySection from '../home/TechnologySection';
import FeedbackSection from '../home/FeedbackSection';

export default function ExploreSection() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          DOMAINS SECTION (Separate Component)
      ═══════════════════════════════════════════════════════════════════ */}
      <DomainsSection />

      {/* ═══════════════════════════════════════════════════════════════════
          VENTURES SECTION (Separate Component)
      ═══════════════════════════════════════════════════════════════════ */}
      <VenturesSection />

      {/* ═══════════════════════════════════════════════════════════════════
          TECHNOLOGY SECTION (Separate Component)
      ═══════════════════════════════════════════════════════════════════ */}
      <TechnologySection />

      {/* ═══════════════════════════════════════════════════════════════════
          FEEDBACK WIDGET (Separate Component)
      ═══════════════════════════════════════════════════════════════════ */}
      <FeedbackSection />
    </>
  );
}
