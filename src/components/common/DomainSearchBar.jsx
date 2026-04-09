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
    <div className="w-full px-4 sm:px-6 lg:px-8 my-4 md:my-6">
      <div className="max-w-[1200px] mx-auto">
        <h3 className="font-display text-[1.4rem] md:text-[1.75rem] font-bold text-gray-900 mb-4">
          Domains
        </h3>
        <div className="max-w-3xl mx-auto px-0 sm:px-4">
          <form onSubmit={handleSearch} className="search-glow-focus flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl sm:rounded-full shadow-[0_4px_32px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden px-4 sm:pl-6 sm:pr-2 py-3 sm:py-2.5 gap-3 sm:gap-0 transition-all duration-300 relative">
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-gray-800 text-base sm:text-lg placeholder:text-gray-400 py-2.5 sm:py-3 focus:ring-0"
              placeholder="Search your domain name"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#232f3e] text-white border-none py-3 px-7 rounded-full text-sm sm:text-base font-semibold cursor-pointer transition-all duration-200 w-full sm:w-auto self-stretch sm:self-start font-body hover:bg-white/20 hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex-shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>
      <style>{`
        .search-glow-focus {
          transition: box-shadow 0.35s ease, border-color 0.35s ease, transform 0.35s ease;
        }
        .search-glow-focus:hover,
        .search-glow-focus:focus-within {
          box-shadow:
            -18px 0 28px -8px rgba(0, 195, 255, 0.5),
            18px 0 28px -8px rgba(255, 48, 108, 0.5),
            0 0 18px -4px rgba(120, 80, 220, 0.3);
          border-color: rgba(120, 80, 220, 0.4);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
