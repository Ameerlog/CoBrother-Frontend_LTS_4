import { useState, useEffect } from 'react';

const tlds = ["com", "net", "org", "in", "co", "io", "ai"];

export default function DomainSearchBar() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const doSearch = async (input) => {
    if (!input) return;
    setLoading(true);

    const domains = input.includes(".")
      ? [input]
      : tlds.map(tld => `${input}.${tld}`);

    setResult(domains.map(domain => ({ domain, status: "loading", price: null })));

    await Promise.all(
      domains.map(async (fullDomain) => {
        try {
          const res = await fetch(
            `https://backend.cobrother.com/api/v1/domain/check?name=${fullDomain}`
          );
          const data = await res.json();
          const status = data.status === "available" ? "available" : "taken";
          const price = data.price ? `₹${data.price}` : null;

          setResult(prev =>
            prev.map(item =>
              item.domain === fullDomain ? { ...item, status, price } : item
            )
          );
        } catch {
          setResult(prev =>
            prev.map(item =>
              item.domain === fullDomain ? { ...item, status: "taken", price: null } : item
            )
          );
        }
      })
    );
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const input = query.trim().toLowerCase();
    if (!input) return;
    doSearch(input);
  };

  useEffect(() => {
    if (!query) { setResult([]); return; }
    const delay = setTimeout(() => {
      const input = query.trim().toLowerCase();
      if (input) doSearch(input);
    }, 600);
    return () => clearTimeout(delay);
  }, [query]);

  const handleBuyNow = (domain) => {
    window.open(
      `https://cobrother.supersite2.myorderbox.com/domain-registration/index.php?domain=${domain}`,
      "_blank"
    );
  };

  const bestDomain = result.find(item => item.status === "available") || result[0];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Title */}
        <h3 className="font-display text-[1.4rem] md:text-[1.75rem] font-bold text-gray-900 mb-6">
          Domains
        </h3>

        {/* Search Row: Search bar + Promotional pricing */}
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <form onSubmit={handleSearch} className="search-glow-focus w-full max-w-[880px] flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl sm:rounded-full shadow-[0_4px_32px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden px-4 sm:pl-6 sm:pr-3 py-3 sm:py-2.5 gap-3 sm:gap-0 transition-all duration-300 relative flex-1">
            <input
              type="text"
              className="w-full min-w-0 flex-1 bg-transparent border-none outline-none text-gray-800 text-base sm:text-lg placeholder:text-gray-400 py-2.5 sm:py-3 focus:ring-0"
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
          <div className="hidden lg:flex flex-col items-center px-6 py-4 min-w-[220px] bg-gradient-to-br from-indigo-50 via-white to-pink-50 rounded-[28px] border border-indigo-100 shadow-[0_20px_60px_rgba(99,102,241,0.12)] relative swing-hover hover:shadow-[0_22px_66px_rgba(99,102,241,0.2)] transition-shadow duration-300">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_0_20px_rgba(99,102,241,0.35)]" />
            <span className="text-[11px] uppercase tracking-[0.2em] bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-transparent bg-clip-text font-semibold mb-2">Promotional Offer</span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-slate-900">.com</span>
              <span className="text-2xl font-extrabold text-slate-900">₹999</span>
              <span className="text-[11px] text-slate-500">/year</span>
            </div>
          </div>

          {/* Mobile Promotional banner */}
          <div className="lg:hidden flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-50 via-white to-pink-50 rounded-2xl border border-indigo-100 shadow-[0_14px_40px_rgba(99,102,241,0.12)] w-full sm:w-auto relative swing-hover">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_0_14px_rgba(99,102,241,0.35)]" />
            <span className="text-[11px] uppercase tracking-[0.12em] bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-transparent bg-clip-text font-semibold">Limited Offer</span>
            <span className="text-[12px] font-bold text-slate-900">.com ₹999/year</span>
          </div>
        </div>

        {/* RESULTS */}
        <div className="mt-8">

          {loading && (
            <p className="text-center text-gray-500 mb-6">
              Checking domains...
            </p>
          )}

          {/* ⭐ FEATURED */}
          {bestDomain && bestDomain.status !== "loading" && (
            <div className={`mb-8 bg-white rounded-3xl p-8 shadow-xl border-2 ${bestDomain.status === "available" ? 'border-purple-500' : 'border-red-300'}`}>

              {bestDomain.status === "available" ? (
                <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded mb-3">
                  BEST MATCH
                </span>
              ) : (
                <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded mb-3">
                  TAKEN / SOLD
                </span>
              )}

              {(() => {
                const [name, tld] = bestDomain.domain.split(".");
                return (
                  <>
                    <h2 className={`text-4xl font-bold mb-4 ${bestDomain.status === "available" ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                      {name}
                      <span className={bestDomain.status === "available" ? 'text-purple-600' : 'text-purple-300'}>.{tld}</span>
                    </h2>

                    {bestDomain.status === "available" && bestDomain.price && (
                      <div className="mb-4">
                        <p className="text-gray-400 line-through text-lg">
                          ₹{Math.round(parseInt(bestDomain.price.replace("₹","")) * 1.8)}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {bestDomain.price}
                        </p>
                      </div>
                    )}

                    {bestDomain.status === "available" ? (
                      <button
                        onClick={() => handleBuyNow(bestDomain.domain)}
                        className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                      >
                        Make it Yours
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyNow(bestDomain.domain)}
                        className="bg-gray-200 text-gray-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                      >
                        Check Alternatives
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {result
              .filter(item => item !== bestDomain)
              .map((item, index) => {
                const [name, tld] = item.domain.split(".");

                const isTaken = item.status === "taken";
                return (
                  <div key={index} className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition ${isTaken ? 'border-gray-200 opacity-75' : 'border-gray-300'}`}>

                    {item.status === "available" ? (
                      <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-bold px-3 py-1 rounded mb-3">
                        AVAILABLE
                      </span>
                    ) : item.status === "taken" ? (
                      <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded mb-3">
                        TAKEN / SOLD
                      </span>
                    ) : (
                      <span className="inline-block bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded mb-3">
                        CHECKING...
                      </span>
                    )}

                    <h2 className={`text-2xl font-bold mb-4 ${isTaken ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {name}
                      <span className={isTaken ? 'text-purple-300' : 'text-purple-600'}>.{tld}</span>
                    </h2>

                    {item.status === "available" && item.price && (
                      <div className="mb-4">
                        <p className="text-gray-400 line-through text-sm">
                          ₹{Math.round(parseInt(item.price.replace("₹","")) * 1.8)}
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {item.price}
                        </p>
                      </div>
                    )}

                    {item.status === "available" ? (
                      <button
                        onClick={() => handleBuyNow(item.domain)}
                        className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
                      >
                        Buy
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyNow(item.domain)}
                        className="bg-gray-200 text-gray-500 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                      >
                        Check Alternatives
                      </button>
                    )}

                  </div>
                );
              })}
          </div>

        </div>
      </div>

      <style>{`
        .search-glow-focus {
          width: 100%;
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
        @media (max-width: 639px) {
          .search-glow-focus {
            padding: 0.9rem;
            gap: 0.85rem;
          }
        }
        .swing-hover {
          transform-origin: top center;
          animation: swing 3s ease-in-out infinite;
        }
        @keyframes swing {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
      `}</style>
    </div>
  );
}
