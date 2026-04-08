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
    <div className="w-full max-w-2xl mx-auto my-10 px-4">
      <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full shadow-[0_2px_24px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden pl-5 pr-1.5 py-1.5">
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-gray-800 text-base placeholder:text-gray-400 py-2"
          placeholder="Search your domain name"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="px-7 py-2.5 bg-purple-600 text-white font-semibold text-sm rounded-full transition-all duration-200 hover:bg-purple-700 hover:shadow-md flex-shrink-0"
        >
          Search
        </button>
      </form>
    </div>
  );
}
