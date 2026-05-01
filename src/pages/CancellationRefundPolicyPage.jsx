import { useState } from 'react';
import { motion } from '../utils/simpleMotion';
import { useNavigate } from 'react-router-dom';
import { FileCheck, FileText, Mail, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import TopNavbar from '../components/common/TopNavbar';
import HomeNavbar from '../components/common/HomeNavbar';
import HomeFooter from '../components/common/HomeFooter';
import BrandWordmark from '../components/common/BrandWordmark';

export default function CancellationRefundPolicyPage() {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const lastUpdated = '18 APRIL 2026';
  const sections = [
    { id: 'cancellation-policy', title: '1. Cancellation Policy' },
    { id: 'perishable-items', title: '2. Perishable Items' },
    { id: 'damaged-items', title: '3. Damaged or Defective Items' },
    { id: 'warranty-products', title: '4. Warranty Products' },
    { id: 'refund-processing', title: '5. Refund Processing' },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <TopNavbar homeMobileMenu />
      <HomeNavbar openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} navigate={navigate} />
      <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-2 md:pt-2">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute -top-24 right-1/4 h-72 sm:h-80 md:h-96 w-72 sm:w-80 md:w-96 rounded-full bg-indigo-300/30 blur-3xl"
            animate={{ x: [0, -40, 20, 0], y: [0, 20, -20, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-24 left-1/4 h-72 sm:h-80 md:h-96 w-72 sm:w-80 md:w-96 rounded-full bg-sky-300/25 blur-3xl"
            animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0], scale: [1, 1.15, 0.9, 1] }}
            transition={{ duration: 10, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-slate-50/80" />
        </div>

        <div className="relative mx-auto max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center mt-24 sm:mt-32 md:mt-16 lg:mt-20 xl:mt-24"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50 px-4 py-2 mb-5 shadow-sm">
              <FileCheck className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-800">Cancellation & Refund Policy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-display text-slate-900">
              <span className="text-slate-800">Your satisfaction,</span>{' '}
              <span className="text-indigo-600">our commitment</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              At <span className="text-slate-900 font-semibold"><BrandWordmark inline className="h-4 w-auto mx-1" /></span>, we believe in helping customers as far as possible through a transparent and fair cancellation and refund process.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                <Clock className="h-4 w-4 text-slate-500" /> Last updated:{' '}
                <span className="font-medium text-slate-900">{lastUpdated}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                <FileText className="h-4 w-4 text-slate-500" /> Read time: ~3 minutes
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mt-10">
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-lg shadow-slate-200/50">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">On this page</h2>
                <ul className="space-y-2">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => scrollTo(s.id)}
                        className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition"
                      >
                        <span className="truncate text-left">{s.title}</span>
                        <ChevronRight className="h-4 w-4 text-slate-400 opacity-80 group-hover:text-indigo-600 group-hover:opacity-100 transition" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      For questions about this policy, contact contact@cobrother.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-slate-200 bg-white mt-10 p-4 sm:p-8 shadow-xl shadow-slate-200/40">
                <PolicySection id="cancellation-policy" title="1. Cancellation Policy">
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Cancellations are considered only if requested immediately after order placement. Requests may not be possible once vendors/merchants start shipping.
                  </p>
                </PolicySection>
                <PolicySection id="perishable-items" title="2. Perishable Items">
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Cancellation requests are not accepted for perishable items. Refund/replacement may be considered if delivered quality is unsatisfactory.
                  </p>
                </PolicySection>
                <PolicySection id="damaged-items" title="3. Damaged or Defective Items">
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Report damaged or defective items to customer service immediately, preferably within 7 days of receipt.
                  </p>
                </PolicySection>
                <PolicySection id="warranty-products" title="4. Warranty Products">
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    For products with manufacturer warranty, claims should be raised with the manufacturer as per warranty terms.
                  </p>
                </PolicySection>
                <PolicySection id="refund-processing" title="5. Refund Processing">
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Approved refunds are processed to the original payment method in 6 to 8 business days.
                  </p>
                </PolicySection>
              </div>
              <div className="h-10" />
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
                <div className="rounded-2xl border border-slate-200 bg-white mb-6 p-6 sm:p-8 shadow-xl shadow-slate-200/40">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Need help?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-indigo-600" />
                        <h4 className="text-sm font-semibold text-slate-900">Support contact</h4>
                      </div>
                      <p className="text-sm text-slate-600">
                        Email: <span className="font-medium text-slate-900">contact@cobrother.com</span>
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        Phone: <span className="font-medium text-slate-900">+91 80 8575 8575</span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <HomeFooter />
    </div>
  );
}

function PolicySection({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 mt-10 first:mt-0">{title}</h2>
      {children}
      <div className="mt-4 mb-4 border-t border-slate-200" />
    </section>
  );
}
