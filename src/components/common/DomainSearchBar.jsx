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
    <div className="w-full max-w-3xl mx-auto my-4 px-4">
      <form onSubmit={handleSearch} className="search-glow-focus flex items-center bg-white rounded-full shadow-[0_4px_32px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden pl-6 pr-2 py-2.5 transition-all duration-300 relative">
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-gray-800 text-lg placeholder:text-gray-400 py-3 focus:ring-0"
          placeholder="Search your domain name"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="btn-glow flex-shrink-0"
        >
          Search
        </button>
      </form>
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
