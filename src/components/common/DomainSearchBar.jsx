import { useState } from 'react';

const RESELLER_STOREFRONT = 'https://neminathakkole.supersite2.myorderbox.com';

export default function DomainSearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const domain = query.trim().toLowerCase();
    if (!domain) return;
    window.open(`${RESELLER_STOREFRONT}/domain-registration/domain-search?domain=${encodeURIComponent(domain)}`, '_blank');
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Title */}
        <h3 className="font-display text-[1.4rem] md:text-[1.75rem] font-bold text-gray-900 mb-6">
          Domains
        </h3>

        {/* Search Row: Search bar + Promotional pricing */}
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <form onSubmit={handleSearch} className="search-glow-focus flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl sm:rounded-full shadow-[0_4px_32px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden px-4 sm:pl-6 sm:pr-3 py-3 sm:py-2.5 gap-3 sm:gap-0 transition-all duration-300 relative flex-1">
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-gray-800 text-base sm:text-lg placeholder:text-gray-400 py-2.5 sm:py-3 focus:ring-0"
              placeholder="Search your next big domain..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#232f3e] text-white border-none py-3 px-6 sm:px-7 rounded-full text-sm sm:text-base font-semibold cursor-pointer transition-all duration-200 w-full sm:w-auto self-stretch sm:self-start font-body hover:bg-white/20 hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex-shrink-0"
            >
              Search
            </button>
          </form>

          {/* Promotional Pricing - Right side */}
          <div className="hidden lg:flex flex-col items-start px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <span className="text-[10px] text-green-600 font-medium">Promotional Offer</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-green-700">.com</span>
              <span className="text-lg font-bold text-gray-900">₹999</span>
              <span className="text-[10px] text-gray-500">/year</span>
            </div>
          </div>

          {/* Mobile Promotional banner */}
          <div className="lg:hidden flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 w-full sm:w-auto">
            <span className="text-[11px] text-green-700 font-medium">Limited Offer:</span>
            <span className="text-[11px] font-bold text-green-800">.com</span>
            <span className="text-[11px] font-bold text-green-800">₹999/year</span>
          </div>
        </div>
      </div>
      <style>{`
        .search-glow-focus {
          box-shadow:
            -12px 0 20px -6px rgba(0, 195, 255, 0.35),
            12px 0 20px -6px rgba(255, 48, 108, 0.35),
            0 0 14px -3px rgba(120, 80, 220, 0.25);
          border-color: rgba(120, 80, 220, 0.35);
          transform: translateY(-1px);
          transition: all 0.4s ease;
          animation: glow-spread 6s ease-in-out infinite;
        }
        @keyframes glow-spread {
          0%, 100% {
            box-shadow:
              -12px 0 20px -6px rgba(0, 195, 255, 0.35),
              12px 0 20px -6px rgba(255, 48, 108, 0.35),
              0 0 14px -3px rgba(120, 80, 220, 0.25);
          }
          50% {
            box-shadow:
              -16px 0 28px -8px rgba(0, 195, 255, 0.5),
              16px 0 28px -8px rgba(255, 48, 108, 0.5),
              0 0 20px -4px rgba(120, 80, 220, 0.4);
          }
        }
      `}</style>
    </div>
  );
}