import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, Gavel, ShoppingCart, MessageSquare, Trash2, CheckCircle, Share2, ArrowUpRight } from 'lucide-react';
import { domainAPI, domainEnquiryAPI, auctionAPI, addonAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import { useLikes } from '../hooks/useLikes';
import LikeButton from '../components/common/LikeButton';
import { useFilterSort } from '../hooks/useFilterSort';
import FilterBar from '../components/common/FilterBar';
import Pagination from '../components/common/Pagination';
import SkeletonCard from '../components/common/Skeleton';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Confetti from '../components/common/Confetti';
import DomainsIcon from '../assets/CoBranding.png';
import AddonSelector, {addonTotal, ADDON_SERVICES} from '../components/addon/AddonSelector';

const DOMAIN_PRICING_OPTIONS = [
  { value: 'FIXED',      label: 'Fixed Price' },
  { value: 'NEGOTIABLE', label: 'Negotiable'  },
];

const STATUS_COLORS = {
  AVAILABLE: { color: '#6ec896', bg: 'rgba(110,200,150,0.1)', border: 'rgba(110,200,150,0.3)' },
  PENDING:   { color: '#c8a96e', bg: 'rgba(200,169,110,0.1)', border: 'rgba(200,169,110,0.3)' },
  SOLD:      { color: '#c86e6e', bg: 'rgba(200,110,110,0.1)', border: 'rgba(200,110,110,0.3)' },
};

export default function DomainsPage() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [allDomains, setAllDomains]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [showForm, setShowForm]             = useState(false);
  const [buyTarget, setBuyTarget]           = useState(null);
  const [successDomain, setSuccessDomain]   = useState(null);
  const [detailTarget, setDetailTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget]     = useState(null);
  const [enquireTarget, setEnquireTarget]   = useState(null);
  const [enquireSuccess, setEnquireSuccess] = useState(false);
  const [filterTab, setFilterTab]           = useState('all');
  const [showConfetti, setShowConfetti]     = useState(false);

  const { toggle: toggleLike, get: getLike } = useLikes('DOMAIN', allDomains);

  const visibleDomains = filterTab === 'mine'
    ? allDomains.filter(d => d.listedBy?.id === user?.id)
    : allDomains.filter(d => !d.takenDown);

  const {
    paginated, totalCount,
    search, category, minPrice, maxPrice, sortBy,
    handleSearch, handleCategory, handleMinPrice, handleMaxPrice, handleSort,
    clearAll, activeFilterCount,
    page, totalPages, setPage,
  } = useFilterSort(visibleDomains, {
    searchFields:  ['domainName', 'domainExtension'],
    priceField:    'askingPrice',
    categoryField: 'pricingDemand',
    dateField:     'createdAt',
  }, 20);

  useEffect(() => {
    setLoading(true);
    domainAPI.getAll()
      .then(({ data }) => setAllDomains(Array.isArray(data) ? data : (data?.data ?? [])))
      .catch(() => setAllDomains([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    try {
      await domainAPI.delete(deleteTarget);
      setAllDomains(d => d.filter(x => x.id !== deleteTarget));
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to remove listing.');
    } finally { setDeleteTarget(null); }
  };

  const refreshDomains = () =>
    domainAPI.getAll()
      .then(({ data }) => setAllDomains(Array.isArray(data) ? data : (data?.data ?? [])));

  return (
    <AppLayout>
      <Confetti show={showConfetti} />
      {showConfetti && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-none animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 text-center max-w-sm mx-4 animate-slideUp">
            <div className="text-5xl mb-3">🌐</div>
            <h2 className="font-display text-2xl font-extrabold text-gray-900 mb-1">Domain Listed!</h2>
            <p className="text-sm text-gray-500">Your domain is now live on the marketplace.</p>
          </div>
        </div>
      )}
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 m-0">Domains</h1>
            <p className="text-gray-600 mt-1">Buy and sell premium domain names.</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-glow btn-glow-sm flex items-center gap-2" onClick={() => navigate('/domains/dashboard')}>
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button className="btn-glow btn-glow-sm flex items-center gap-2" onClick={() => setShowForm(true)}>
              <Plus size={16} /> List Domain
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button className={`btn-glow btn-glow-sm ${filterTab === 'all' ? 'bg-gray-900 text-white border-gray-900' : ''}`}
            onClick={() => setFilterTab('all')}>All Domains</button>
          <button className={`btn-glow btn-glow-sm ${filterTab === 'mine' ? 'bg-gray-900 text-white border-gray-900' : ''}`}
            onClick={() => setFilterTab('mine')}>My Listings</button>
        </div>

        {showForm && (
          <div className="mb-6">
            <DomainForm
              onSaved={d => {
                setAllDomains(prev => [d, ...prev]);
                setShowForm(false);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 4000);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <FilterBar
          search={search}           onSearch={handleSearch}
          category={category}       onCategory={handleCategory}
          categoryOptions={DOMAIN_PRICING_OPTIONS}
          minPrice={minPrice}       onMinPrice={handleMinPrice}
          maxPrice={maxPrice}       onMaxPrice={handleMaxPrice}
          sortBy={sortBy}           onSort={handleSort}
          onClear={clearAll}        activeFilterCount={activeFilterCount}
          placeholder="Search domains by name or extension…"
          theme="light"
        />

        {!loading && allDomains.length > 0 && (
          <div className="text-sm text-gray-600 mb-4">
            {totalCount} domain{totalCount !== 1 ? 's' : ''} found
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20">
            <img src={DomainsIcon} alt="Domain" className="mx-auto mb-4 w-16 h-16 object-contain" />
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">
              {activeFilterCount > 0 ? 'No domains match your filters' :
               filterTab === 'mine' ? 'You have no active listings' :
               'No domains listed yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeFilterCount > 0
                ? 'Try adjusting your search or filters.'
                : 'Be the first to list a domain for sale.'}
            </p>
            {activeFilterCount > 0
              ? <button className="btn-glow btn-glow-sm" onClick={clearAll}>Clear Filters</button>
              : <button className="btn-glow btn-glow-sm" onClick={() => setShowForm(true)}>
                  List a Domain
                </button>
            }
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginated.map(d => (
                <DomainCard
                  key={d.id}
                  domain={d}
                  isOwner={d.listedBy?.id === user?.id}
                  likeState={getLike(d.id)}
                  onLike={() => toggleLike(d.id)}
                  onView={() => setDetailTarget(d)}
                  onBuy={() => setBuyTarget(d)}
                  onEnquire={() => setEnquireTarget(d)}
                  onViewAuction={() => navigate(`/auction/${d.auction?.id}`)}
                  onDelete={() => setDeleteTarget(d.id)}
                />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages}
              onPage={setPage} totalCount={totalCount} pageSize={20} />
          </>
        )}
      </div>

      {buyTarget && (
        <BuyDomainModal
          domain={buyTarget}
          onClose={() => setBuyTarget(null)}
          onSuccess={d => {
            setSuccessDomain(d);
            setBuyTarget(null);
            setAllDomains(prev => prev.map(x => x.id === d.id ? d : x));
          }}
        />
      )}

      {successDomain && (
        <PurchaseSuccessModal domain={successDomain} onClose={() => setSuccessDomain(null)} />
      )}

      {detailTarget && (
        <DomainDetailModal
          domain={detailTarget}
          isOwner={detailTarget.listedBy?.id === user?.id}
          likeState={getLike(detailTarget.id)}
          onLike={() => toggleLike(detailTarget.id)}
          onClose={() => { setDetailTarget(null); refreshDomains(); }}
          onBuy={() => { setBuyTarget(detailTarget); setDetailTarget(null); }}
          onEnquire={() => { setEnquireTarget(detailTarget); setDetailTarget(null); }}
          onViewAuction={() => {
            navigate(`/auction/${detailTarget.auction?.id}`);
            setDetailTarget(null);
          }}
        />
      )}

      {enquireTarget && (
        <DomainEnquiryModal
          domain={enquireTarget}
          user={user}
          onClose={() => setEnquireTarget(null)}
          onSuccess={() => { setEnquireTarget(null); setEnquireSuccess(true); }}
        />
      )}

      {enquireSuccess && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEnquireSuccess(false)}>
          <div className="relative w-full max-w-[420px] text-center bg-white border border-gray-200 rounded-[18px] shadow-[0_20px_60px_rgba(17,24,39,0.16)] p-8">
            <div className="absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full bg-indigo-100/30 blur-3xl pointer-events-none" />
            <div className="text-green-600 flex justify-center mb-4"><CheckCircle size={46} /></div>
            <h2 className="font-display text-[1.75rem] text-gray-900 mb-2">Enquiry Submitted!</h2>
            <p className="text-gray-500 mb-6">
              Our team will review your request and get back to you shortly.
            </p>
            <button className="btn-glow w-full" onClick={() => setEnquireSuccess(false)}>Done</button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Domain Listing?"
        message="This will remove your domain from the marketplace. You can re-list it later."
        confirmLabel="Remove"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppLayout>
  );
}

// ─── Domain Card ──────────────────────────────────────────────────────────────
function DomainCard({ domain, isOwner, onView, onBuy, onEnquire, onViewAuction,
                       onDelete, likeState, onLike }) {
  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = useRef(null);
  const s           = STATUS_COLORS[domain.domainStatus] || STATUS_COLORS.AVAILABLE;
  const isAuction   = domain.saleType === 'AUCTION';
  const isHighValue = !isAuction && domain.askingPrice >= 500000;
  const auction     = domain.auction;
  const auctionLive = auction?.status === 'ACTIVE' || auction?.status === 'EXTENDED';
  const domainInitials = (domain.domainName || '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 2)
    .toUpperCase() || '?';

  // Close share dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/domains` : 'https://cobrother.com/domains';
  const shareText = `Check out this domain: ${domain.domainName}${domain.domainExtension} - Listed on CoBrother!`;

  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const handleShare = (platform) => {
    window.open(platform, '_blank', 'width=600,height=400');
    setShareOpen(false);
  };

  const accentGrad = isAuction
    ? 'from-purple-600 via-fuchsia-500 to-pink-500'
    : 'from-indigo-600 via-blue-500 to-cyan-400';

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-300"
      onClick={onView}
    >
      {/* Gradient header with large image */}
      <div className={`relative bg-gradient-to-r ${accentGrad} px-4 pt-3.5 pb-3.5 min-h-[90px] flex items-end`}>
        {domain.logo
          ? <img src={domain.logo} alt={domain.domainName}
              className="absolute top-0 right-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300" />
          : null
        }
        <div className="relative z-10 flex items-end justify-between w-full">
          <div className="flex items-center gap-2">
            {domain.logo
              ? <img src={domain.logo} alt={domain.domainName}
                  className="w-14 h-14 rounded-xl object-cover ring-[3px] ring-white/50 shadow-lg" />
              : <div className="w-14 h-14 rounded-xl flex items-center justify-center font-display text-2xl font-extrabold text-white ring-[3px] ring-white/30 shadow-lg bg-white/15 backdrop-blur-sm">
                  {domainInitials}
                </div>
            }
            <div>
              <span className={`px-2 py-[3px] text-[10px] font-bold rounded-md uppercase tracking-wide ${isAuction ? 'bg-yellow-400 text-gray-900' : 'bg-white/25 backdrop-blur-sm text-white'}`}>
                {isAuction ? '🔨 Auction' : domain.domainExtension}
              </span>
              {isOwner && (
                <span className="ml-1.5 px-2 py-[3px] bg-white text-indigo-600 text-[10px] font-extrabold rounded-md uppercase tracking-wide shadow-sm">
                  ✦ Owner
                </span>
              )}
            </div>
          </div>
        </div>
        {domain.takenDown && (
          <span className="absolute top-3 right-3 z-10 px-2 py-[3px] bg-red-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wide shadow-sm">
            ⚠ Taken Down
          </span>
        )}
      </div>

      {/* Body */}
      <div className="relative px-4 pb-4 pt-3 flex flex-col flex-1">
        {/* Domain name + status/pricing tags on right */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-[0.95rem] font-extrabold text-gray-900 truncate leading-snug">
            {domain.domainName}{domain.domainExtension}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            {!isAuction && (
              <span className={`px-1.5 py-[2px] text-[9px] font-bold rounded uppercase tracking-wide border ${
                domain.domainStatus === 'AVAILABLE' ? 'bg-green-50 text-green-600 border-green-200' :
                domain.domainStatus === 'SOLD'      ? 'bg-red-50 text-red-500 border-red-200' :
                                                      'bg-amber-50 text-amber-600 border-amber-200'
              }`}>
                {domain.domainStatus}
              </span>
            )}
            <span className="px-1.5 py-[2px] bg-gray-100 text-gray-500 text-[9px] font-bold rounded uppercase tracking-wide whitespace-nowrap">
              {domain.pricingDemand || 'Fixed'}
            </span>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {domain.verified && (
            <span className="px-2 py-[2px] text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md">
              ✓ Verified
            </span>
          )}
          {isHighValue && domain.domainStatus === 'AVAILABLE' && (
            <span className="px-2 py-[2px] text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-200 rounded-md">
              Premium
            </span>
          )}
          {isAuction && (
            <>
              {auction?.status === 'ACTIVE'   && <span className="text-[10px] text-emerald-600 font-bold">🟢 Live</span>}
              {auction?.status === 'EXTENDED' && <span className="text-[10px] text-amber-500 font-bold">⚡ Extended</span>}
              {auction?.status === 'DRAFT'    && <span className="text-[10px] text-gray-400">⏳ Draft</span>}
            </>
          )}
        </div>

        {/* Price block */}
        {isAuction && auction ? (
          <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 px-3 py-2 mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-purple-700 tracking-tight">
                ₹{Number(auction.currentHighestBid > 0 ? auction.currentHighestBid : auction.minBidPrice).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-purple-400 font-semibold">
                {auction.currentHighestBid > 0 ? 'highest' : 'min bid'}
              </span>
            </div>
            <span className="text-[10px] text-purple-400">{auction.totalBids} bid{auction.totalBids !== 1 ? 's' : ''}</span>
          </div>
        ) : (
          <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 px-3 py-2 mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-emerald-700 tracking-tight">
                ₹{Number(domain.askingPrice).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">asking price</span>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-2.5 text-[11px] text-gray-400 font-medium py-2 border-t border-gray-100 mt-auto">
          <span className="flex items-center gap-1">👁 {domain.views || 0}</span>
          <LikeButton liked={likeState?.liked} count={likeState?.count} onToggle={onLike} />

          <div className="relative ml-auto" ref={shareRef}>
            <button
              className="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              onClick={(e) => { e.stopPropagation(); setShareOpen(!shareOpen); }}
              title="Share"
            >
              <Share2 size={13} />
            </button>

            {shareOpen && (
              <div className="absolute right-0 bottom-full mb-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden min-w-[150px]">
                <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
                  <span className="text-[10px] font-semibold text-gray-500">Share via</span>
                </div>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  onClick={(e) => { e.stopPropagation(); handleShare(linkedinShare); }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={(e) => { e.stopPropagation(); handleShare(facebookShare); }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  onClick={(e) => { e.stopPropagation(); handleShare(whatsappShare); }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1 items-center" onClick={e => e.stopPropagation()}>
          {isOwner ? (
            <>
              <button className="flex-1 py-2 bg-red-500 text-white text-xs font-bold rounded-lg transition-all hover:bg-red-600 inline-flex items-center justify-center gap-1.5"
                onClick={e => { e.stopPropagation(); onDelete(); }}>
                <Trash2 size={13} /> Remove
              </button>
              <button
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-600 transition-all hover:border-indigo-400 hover:text-indigo-600 hover:shadow-md"
                onClick={onView} title="View Details">
                <ArrowUpRight size={16} />
              </button>
            </>
          ) : (
            <>
              {isAuction ? (
                auctionLive ? (
                  <button
                    onClick={e => { e.stopPropagation(); onViewAuction(); }}
                    className={`flex-1 py-2 bg-gradient-to-r ${accentGrad} text-white text-xs font-bold rounded-lg transition-all hover:opacity-90 inline-flex items-center justify-center gap-1.5`}>
                    <Gavel size={13} /> Bid Now
                  </button>
                ) : (
                  <span className="flex-1 py-2 text-center text-[11px] text-gray-400 font-medium">
                    {auction?.status === 'DRAFT'  ? 'Coming Soon' :
                     auction?.status === 'ENDED'  ? 'Auction Ended' :
                     auction?.status === 'UNSOLD' ? 'Unsold' : 'Closed'}
                  </span>
                )
              ) : domain.domainStatus === 'AVAILABLE' ? (
                isHighValue ? (
                  <button
                    onClick={e => { e.stopPropagation(); onEnquire(); }}
                    className={`flex-1 py-2 bg-gradient-to-r ${accentGrad} text-white text-xs font-bold rounded-lg transition-all hover:opacity-90 inline-flex items-center justify-center gap-1.5`}>
                    <MessageSquare size={13} /> Enquire
                  </button>
                ) : (
                  <button
                    onClick={e => { e.stopPropagation(); onBuy(); }}
                    className={`flex-1 py-2 bg-gradient-to-r ${accentGrad} text-white text-xs font-bold rounded-lg transition-all hover:opacity-90 inline-flex items-center justify-center gap-1.5`}>
                    <ShoppingCart size={13} /> Buy Now
                  </button>
                )
              ) : (
                <span className="flex-1 py-2 text-center text-[11px] text-gray-400 font-medium">
                  {domain.domainStatus === 'SOLD' ? 'Sold' : 'Pending'}
                </span>
              )}
              <button
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-600 transition-all hover:border-indigo-400 hover:text-indigo-600 hover:shadow-md"
                onClick={onView} title="View Details">
                <ArrowUpRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Domain Form ──────────────────────────────────────────────────────────────
function DomainForm({ onSaved, onCancel }) {
  const [form, setForm] = useState({
    domainName: '', domainExtension: '',
    askingPrice: '', pricingDemand: '',
    saleType: 'ONE_TIME', minBidPrice: '', auctionDuration: 'SEVEN_DAYS',
    contactInfo: { email: '', phoneNumber: '' },
    agreement: { terms: false },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const [savedDomain, setSavedDomain]       = useState(null);
  const [imageFile, setImageFile]           = useState(null);
  const [imagePreview, setImagePreview]     = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError]         = useState('');
  const fileInputRef                        = useRef(null);

  const setContact = (k, v) =>
    setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, [k]: v } }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.saleType === 'AUCTION' && (!form.minBidPrice || parseFloat(form.minBidPrice) <= 0)) {
      setError('Please enter a valid minimum bid price.');
      return;
    }
    setLoading(true); setError('');
    try {
      const { data: domain } = await domainAPI.create({
        domainName:      form.domainName,
        domainExtension: form.domainExtension,
        askingPrice:     form.saleType === 'AUCTION' ? 0 : parseFloat(form.askingPrice),
        pricingDemand:   form.pricingDemand,
        saleType:        form.saleType,
        contactInfo:     form.contactInfo,
        agreement:       form.agreement,
      });
      if (form.saleType === 'AUCTION' && domain.id) {
        await auctionAPI.create(domain.id, {
          minBidPrice: parseFloat(form.minBidPrice),
          duration:    form.auctionDuration,
        });
      }
      setSavedDomain(domain);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to list domain.');
    } finally { setLoading(false); }
  };

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setImageError('Only image files are allowed.'); return; }
    setImageError('');
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!imageFile || !savedDomain) return;
    setImageUploading(true); setImageError('');
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      const { data } = await domainAPI.uploadImage(savedDomain.id, formData);
      onSaved({ ...savedDomain, logo: data.logoUrl });
    } catch (err) {
      setImageError(err.response?.data?.error || 'Upload failed. You can add a logo later.');
      setImageUploading(false);
    }
  };

  const handleSkip = () => onSaved(savedDomain);

  const isAuction = form.saleType === 'AUCTION';

  const inputCls = 'px-3 py-2 border border-gray-300 rounded-[8px] text-gray-900 bg-white outline-none focus:border-purple-500 transition-all w-full';
  const labelCls = 'text-sm font-medium text-gray-700';

  if (savedDomain) {
    return (
      <div className="p-8 bg-white border border-gray-200 rounded-[18px] shadow-sm">
        <h3 className="font-display text-2xl text-gray-900 font-semibold">
          Add a Logo <span className="text-sm text-gray-400 font-normal">(optional)</span>
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          Upload a logo for <strong className="text-purple-600">{savedDomain.domainName}{savedDomain.domainExtension}</strong>. You can also do this later.
        </p>
        <div className="mt-5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-3 ${
              imagePreview ? 'border-gray-400 bg-gray-50' : 'border-gray-200 bg-gray-50 hover:border-gray-400'
            }`}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="max-h-[120px] max-w-full rounded-lg object-contain mx-auto" />
            ) : (
              <>
                <div className="text-4xl mb-2">🖼</div>
                <div className="text-sm text-gray-500">Click to choose an image</div>
                <div className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</div>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          {imagePreview && (
            <button type="button" className="text-xs text-gray-500 hover:text-red-500 mb-3"
              onClick={() => { setImageFile(null); setImagePreview(null); }}>✕ Remove</button>
          )}
          {imageError && <div className="text-sm text-red-500 mb-3">{imageError}</div>}
          <div className="flex gap-3">
            <button type="button" className="btn-glow flex-1"
              disabled={!imageFile || imageUploading} onClick={handleImageUpload}>
              {imageUploading ? <span className="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin inline-block" /> : 'List Your Domain →'}
            </button>
            <button type="button" className="btn-glow" onClick={handleSkip}>Skip</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white border border-gray-200 rounded-[18px] shadow-sm">
      <h3 className="font-display text-2xl text-gray-900 font-semibold">List Your Domain</h3>
      <p className="text-gray-500 text-sm mt-1">Fill in the details to list your domain for sale.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-5">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Domain Name <span className="text-red-500">*</span></label>
          <input className={inputCls}
            value={form.domainName + form.domainExtension}
            onChange={e => {
              const full = e.target.value;
              const dot  = full.indexOf('.');
              if (dot !== -1) {
                setForm(f => ({ ...f, domainName: full.slice(0, dot), domainExtension: full.slice(dot) }));
              } else {
                setForm(f => ({ ...f, domainName: full, domainExtension: '' }));
              }
            }}
            placeholder="e.g. mybrand.com" required
          />
          <span className="text-xs text-gray-500 mt-1 block">
            Include the extension (e.g. .com, .in, .io)
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Sale Type <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-3 mt-1.5">
            {[
              { value: 'ONE_TIME', label: '🛒 One-Time Sale', desc: 'Set a fixed price. Buyer pays and gets the domain.' },
              { value: 'AUCTION',  label: '🔨 Auction',       desc: 'Bidders compete. Highest bid wins after your chosen duration.' },
            ].map(opt => (
              <div key={opt.value}
                onClick={() => setForm(f => ({ ...f, saleType: opt.value }))}
                className={`p-3.5 rounded-lg cursor-pointer border-2 transition-all duration-150 ${
                  form.saleType === opt.value 
                    ? 'border-purple-600 bg-purple-50' 
                    : 'border-gray-200 bg-white'
                }`}>
                <div className={`font-semibold text-sm mb-1 ${
                  form.saleType === opt.value ? 'text-purple-600' : 'text-gray-600'
                }`}>
                  {opt.label}
                </div>
                <div className="text-xs text-gray-500 leading-snug">{opt.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {!isAuction && (
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Asking Price (₹) <span className="text-red-500">*</span></label>
              <input className={inputCls} type="number" min="0" value={form.askingPrice}
                onChange={e => setForm(f => ({ ...f, askingPrice: e.target.value }))}
                placeholder="e.g. 50000" required={!isAuction} />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Pricing Type <span className="text-red-500">*</span></label>
            <select className={inputCls} value={form.pricingDemand}
              onChange={e => setForm(f => ({ ...f, pricingDemand: e.target.value }))} required>
              <option value="">Select pricing type</option>
              <option value="FIXED">Fixed Price</option>
              <option value="NEGOTIABLE">Negotiable</option>
            </select>
          </div>
        </div>

        {isAuction && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Minimum Bid (₹) <span className="text-red-500">*</span></label>
                <input className={inputCls} type="number" min="1" value={form.minBidPrice}
                  onChange={e => setForm(f => ({ ...f, minBidPrice: e.target.value }))}
                  placeholder="e.g. 5000" required />
                <span className="text-[0.72rem] text-gray-500 mt-1 block">
                  Each subsequent bid must be at least 5% higher.
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Auction Duration <span className="text-red-500">*</span></label>
                <select className={inputCls} value={form.auctionDuration}
                  onChange={e => setForm(f => ({ ...f, auctionDuration: e.target.value }))}>
                  <option value="ONE_DAY">1 Day</option>
                  <option value="SEVEN_DAYS">7 Days</option>
                  <option value="FIFTEEN_DAYS">15 Days</option>
                  <option value="THIRTY_DAYS">30 Days</option>
                </select>
              </div>
            </div>
            <div className="p-3.5 bg-amber-100 border border-amber-400 rounded-lg text-[0.82rem] text-amber-900 leading-relaxed">
              ⚡ Auction domains go live only after domain verification (≈15 mins). Your listing
              stays in <strong>Draft</strong> until verification is complete, then the auction
              timer starts automatically.
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Contact Email <span className="text-red-500">*</span></label>
            <input className={inputCls} type="email" value={form.contactInfo.email}
              onChange={e => setContact('email', e.target.value)}
              placeholder="your@email.com" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Phone</label>
            <input className={inputCls} value={form.contactInfo.phoneNumber}
              onChange={e => setContact('phoneNumber', e.target.value)}
              placeholder="10-digit number" maxLength={10} />
          </div>
        </div>

        <label className="inline-flex items-center gap-3 cursor-pointer self-start rounded-[12px] border border-purple-100 bg-purple-50/60 px-3.5 py-2.5 max-w-full">
          <input
            type="checkbox"
            checked={form.agreement.terms}
            onChange={e => setForm(f => ({ ...f, agreement: { terms: e.target.checked } }))}
            required
            className="peer sr-only"
          />
          <span className="relative w-5 h-5 rounded-[7px] border-2 border-purple-300 bg-white flex items-center justify-center flex-shrink-0 transition-all peer-checked:bg-purple-600 peer-checked:border-purple-600 peer-focus-visible:ring-2 peer-focus-visible:ring-purple-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7)] overflow-hidden">
            <span className="absolute left-[6px] top-[1px] w-[5px] h-[10px] border-r-[2.5px] border-b-[2.5px] border-white rotate-45 opacity-0 scale-75 transition-all duration-150 peer-checked:opacity-100 peer-checked:scale-100 z-10" aria-hidden="true"></span>
          </span>
          <span className="text-sm text-gray-700 leading-snug">I confirm I own this domain and agree to the Terms & Conditions.</span>
        </label>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <div className="flex gap-3 mt-2">
          <button type="submit" className="btn-glow flex-1" disabled={loading}>
            {loading ? <span className="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin inline-block" /> :
              isAuction ? 'List for Auction →' : 'Add Logo →'}
          </button>
          <button type="button" className="btn-glow" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

// ─── Buy Domain Modal ─────────────────────────────────────────────────────────
function BuyDomainModal({ domain, onClose, onSuccess }) {
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [addons, setAddons]         = useState([]);   // selected addon keys
  const [addonDone, setAddonDone]   = useState(false);// track if addon payment finished
 
  const addonExtra = addonTotal(addons);
  const domainPrice = Number(domain.askingPrice);
  const totalDisplay = domainPrice + addonExtra;
 
  // After domain payment succeeds, pay for addons if any were selected
  const payAddons = async (domainPurchaseId) => {
    if (addons.length === 0) return;
    try {
      const { data: addonOrder } = await addonAPI.createOrder({
        purchaseType: 'DOMAIN',
        purchaseId:   domainPurchaseId,
        services:     addons,
        buyerEmail:   domain._buyerEmail || '',
        buyerName:    domain._buyerName  || '',
        buyerPhone:   domain._buyerPhone || '',
      });
 
      if (addonOrder.contactOnly) {
        // No payment needed — contact-only services recorded
        setAddonDone(true);
        return;
      }
 
      // Open second Razorpay checkout for addons
      await new Promise((resolve, reject) => {
        const opts = {
          key:         addonOrder.keyId,
          amount:      addonOrder.amount * 100,
          currency:    addonOrder.currency,
          name:        'CoBrother',
          description: 'Business Registration Add-ons',
          order_id:    addonOrder.orderId,
          handler: async (resp) => {
            try {
              await addonAPI.verifyPayment({
                razorpayPaymentId: resp.razorpay_payment_id,
                razorpayOrderId:   resp.razorpay_order_id,
                razorpaySignature: resp.razorpay_signature,
              });
              setAddonDone(true);
              resolve();
            } catch { reject(new Error('Addon payment verification failed')); }
          },
          modal: { ondismiss: () => resolve() }, // soft-fail: addon dismissed = ok
          theme: { color: '#6366f1' },
        };
        const rzp = new window.Razorpay(opts);
        rzp.on('payment.failed', () => resolve()); // soft-fail
        rzp.open();
      });
    } catch (e) {
      // Addon payment failure is non-blocking — domain purchase still succeeded
      console.warn('Addon payment issue:', e);
    }
  };
 
  const handleBuy = async () => {
    setLoading(true); setError('');
    try {
      const { data: orderData } = await domainAPI.createOrder(domain.id);
      const options = {
        key: orderData.keyId, amount: orderData.amount * 100, currency: orderData.currency,
        name: 'CoBrother', description: `Purchase ${domain.domainName}${domain.domainExtension}`,
        order_id: orderData.orderId,
        handler: async response => {
          try {
            await domainAPI.verifyPayment(domain.id, {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId:   response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
            // Domain paid — now handle addons
            await payAddons(domain.id);
            onSuccess({
              ...domain,
              domainStatus:  'SOLD',
              paymentStatus: 'COMPLETED',
              _addons:       addons,  // pass to success modal for display
            });
          } catch { setError('Payment verification failed. Contact support.'); setLoading(false); }
        },
        modal: { ondismiss: async () => { await domainAPI.handleFailure(domain.id); setLoading(false); } },
        prefill: {}, theme: { color: '#c8a96e' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async () => {
        await domainAPI.handleFailure(domain.id);
        setError('Payment failed. Please try again.');
        setLoading(false);
      });
      rzp.open();
    } catch (err) { setError(err.response?.data || 'Failed to initiate payment.'); setLoading(false); }
  };
 
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-[520px] bg-white border border-gray-200 rounded-[18px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] p-8 max-h-[90vh] overflow-y-auto">
        <div className="absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full bg-indigo-100/30 blur-3xl pointer-events-none" />
        <button className="absolute top-4 right-4 z-20 bg-transparent border-none text-gray-400 text-xl cursor-pointer transition-colors hover:text-gray-700" onClick={onClose}>✕</button>
 
        <div className="mb-5">
          <div className="inline-flex items-center px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded-full text-[0.72rem] font-semibold text-indigo-600 uppercase tracking-wide mb-2">Domain Purchase</div>
          <h2 className="font-display text-[1.75rem] font-semibold text-gray-900 mb-1">{domain.domainName}{domain.domainExtension}</h2>
          <p className="text-sm text-gray-500">{domain.pricingDemand}</p>
        </div>
 
        {/* Domain price summary */}
        <div className="p-3.5 bg-green-50 border border-green-200 rounded-lg text-[0.82rem] text-green-800 leading-relaxed mb-3">
          ✅ Domain price: <strong>₹{domainPrice.toLocaleString('en-IN')}</strong>
        </div>
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-[0.82rem] text-amber-800 leading-relaxed mb-4">
          ⏳ After payment, you will be updated within <strong>24 hours</strong> with transfer details.
        </div>
 
        {/* ── Add-on selector ── */}
        <AddonSelector selected={addons} onChange={setAddons} />
 
        {/* Total */}
        {addons.length > 0 && (
          <div className="mt-4 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
            <div className="flex justify-between text-gray-600 mb-1">
              <span>Domain</span>
              <span>₹{domainPrice.toLocaleString('en-IN')}</span>
            </div>
            {addons.filter(k => !ADDON_SERVICES.find(s=>s.key===k)?.contactOnly).map(k => {
              const svc = ADDON_SERVICES.find(s => s.key === k);
              return svc ? (
                <div key={k} className="flex justify-between text-gray-600 mb-1">
                  <span className="truncate mr-2">{svc.label}</span>
                  <span>₹{svc.price.toLocaleString('en-IN')}</span>
                </div>
              ) : null;
            })}
            {addons.some(k => ADDON_SERVICES.find(s=>s.key===k)?.contactOnly) && (
              <div className="text-xs text-amber-600 mb-1">+ contact-based services (no charge now)</div>
            )}
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-1">
              <span>Total payable now</span>
              <span>₹{totalDisplay.toLocaleString('en-IN')}</span>
            </div>
            {addonExtra > 0 && (
              <p className="text-xs text-indigo-600 mt-1">
                Domain will be charged first (₹{domainPrice.toLocaleString('en-IN')}), then add-ons (₹{addonExtra.toLocaleString('en-IN')}) in a second step.
              </p>
            )}
          </div>
        )}
 
        {error && <div className="text-sm text-red-500 mt-4 mb-2">{error}</div>}
 
        <div className="flex gap-3 mt-5">
          <button type="button" className="btn-glow flex-1" onClick={handleBuy} disabled={loading}>
            {loading
              ? <span className="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin inline-block" />
              : `Pay ₹${domainPrice.toLocaleString('en-IN')}${addonExtra > 0 ? ` + ₹${addonExtra.toLocaleString('en-IN')} add-ons` : ''} →`}
          </button>
          <button type="button" className="btn-glow" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}


// ─── Purchase Success Modal ───────────────────────────────────────────────────
function PurchaseSuccessModal({ domain, onClose }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-[440px] text-center bg-white border border-gray-200 rounded-[18px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] p-8">
        <div className="absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full bg-indigo-100/30 blur-3xl pointer-events-none" />
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-display text-[1.75rem] font-semibold text-gray-900 mb-2">Purchase Successful!</h2>
        <p className="text-gray-500 mb-5">
          You've successfully purchased{' '}
          <strong className="text-gray-900">{domain.domainName}{domain.domainExtension}</strong>
        </p>
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-[0.82rem] text-amber-800 leading-relaxed mb-6">
          ⏳ A confirmation email has been sent. The seller will initiate the domain transfer
          within <strong>24 hours</strong>.
        </div>
        <button className="btn-glow w-full" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

// ─── Domain Detail Modal ──────────────────────────────────────────────────────
function DomainDetailModal({ domain, isOwner, onClose, onBuy, onEnquire,
                              onViewAuction, likeState, onLike }) {
  const [detail, setDetail]   = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched            = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    domainAPI.get(domain.id)
      .then(({ data }) => setDetail(data?.data ?? data))
      .catch(() => setDetail(domain))
      .finally(() => setLoading(false));
  }, [domain.id]);

  const d           = detail || domain;
  const c           = d.contactInfo || {};
  const s           = STATUS_COLORS[d.domainStatus] || STATUS_COLORS.AVAILABLE;
  const isAuction   = d.saleType === 'AUCTION';
  const isHighValue = !isAuction && d.askingPrice >= 500000;
  const auction     = d.auction;
  const auctionLive = auction?.status === 'ACTIVE' || auction?.status === 'EXTENDED';

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-[18px] shadow-[0_20px_60px_rgba(17,24,39,0.16)] p-8">
        <div className="absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full bg-indigo-100/30 blur-3xl pointer-events-none" />
        <button className="absolute top-4 right-4 z-20 bg-transparent border-none text-gray-400 text-xl cursor-pointer transition-colors hover:text-gray-700" onClick={onClose}>✕</button>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-7 h-7 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="inline-flex items-center px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded-full text-[0.72rem] font-semibold text-indigo-600 uppercase tracking-wide">{isAuction ? '🔨 Auction' : 'Domain'}</div>
                {d.verified && (
                  <span className="px-2 py-0.5 rounded text-[0.68rem] font-bold text-green-600 bg-green-50 border border-green-300">
                    ✓ Verified
                  </span>
                )}
                {isHighValue && (
                  <span className="px-2 py-0.5 rounded text-[0.68rem] font-bold text-purple-600 bg-purple-50 border border-purple-200">
                    Premium
                  </span>
                )}
              </div>
              <h2 className="font-display text-[1.75rem] font-semibold text-gray-900 mb-1">{d.domainName}{d.domainExtension}</h2>
              <p className="text-sm text-gray-500">{d.pricingDemand}</p>
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
              {isAuction && auction ? (
                <>
                  <div className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-[0.82rem] text-green-800">
                    {auction.currentHighestBid > 0
                      ? `🏆 ₹${Number(auction.currentHighestBid).toLocaleString('en-IN')}`
                      : `🔨 Min ₹${Number(auction.minBidPrice).toLocaleString('en-IN')}`}
                  </div>
                  <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[0.82rem] text-gray-600">
                    📋 {auction.totalBids} bid{auction.totalBids !== 1 ? 's' : ''}
                  </div>
                </>
              ) : (
                <div className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-[0.82rem] text-green-800">
                  💰 ₹{Number(d.askingPrice).toLocaleString('en-IN')}
                </div>
              )}
              <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[0.82rem] text-gray-600">
                👁 {d.views || 0} views
              </div>
              {!isAuction && (
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold" style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                  {d.domainStatus}
                </span>
              )}
            </div>

            {isAuction && auction && (
              <Section title="Auction Info">
                <div className="grid grid-cols-2 gap-3">
                  <DetailItem label="Status"
                    value={auction.status === 'ACTIVE'   ? '🟢 Live' :
                           auction.status === 'EXTENDED' ? '⚡ Extended' :
                           auction.status === 'DRAFT'    ? '⏳ Pending Verification' :
                           auction.status} />
                  <DetailItem label="Duration" value={auction.duration?.replace(/_/g, ' ')} />
                  {auction.endTime && (
                    <DetailItem label="Ends"
                      value={new Date(
                        auction.endTime.endsWith('Z') ? auction.endTime : auction.endTime + 'Z'
                      ).toLocaleDateString('en-IN',
                        { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} />
                  )}
                  {auction.currentHighestBid > 0 && (
                    <DetailItem label="Next Min Bid"
                      value={`₹${Number(auction.currentHighestBid * 1.05)
                        .toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                  )}
                </div>
              </Section>
            )}

            {isHighValue && !isOwner && d.domainStatus === 'AVAILABLE' && (
              <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-lg mb-5 text-[0.83rem] text-purple-700">
                ❆ This is a premium domain. Submit an enquiry and our team will facilitate
                the transaction.
              </div>
            )}

            {(c.email || c.phoneNumber) && (
              <Section title="Contact">
                <div className="grid grid-cols-2 gap-3">
                  {c.email       && <DetailItem label="Email" value={c.email} />}
                  {c.phoneNumber && <DetailItem label="Phone" value={c.phoneNumber} />}
                </div>
              </Section>
            )}

            {d.listedBy && (
              <Section title="Listed By">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-600">
                    {d.listedBy.firstname?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="font-semibold text-gray-900 text-[0.9rem]">
                    {d.listedBy.firstname} {d.listedBy.lastname}
                  </div>
                </div>
              </Section>
            )}

            <div className="flex gap-3 mt-6 flex-wrap items-center">
              {!isOwner && (
                isAuction ? (
                  auctionLive ? (
                    <button
                      onClick={onViewAuction}
                      className="btn-glow btn-glow-sm">
                      🔨 Go to Auction →
                    </button>
                  ) : null
                ) : d.domainStatus === 'AVAILABLE' ? (
                  isHighValue ? (
                    <button
                      onClick={onEnquire}
                      className="btn-glow btn-glow-sm">
                      Enquire Now →
                    </button>
                  ) : (
                    <button className="btn-glow btn-glow-sm" onClick={onBuy}>Buy Now →</button>
                  )
                ) : null
              )}
              <LikeButton liked={likeState?.liked} count={likeState?.count}
                          onToggle={onLike} size="md" />
              <button className="btn-glow btn-glow-sm" onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Domain Enquiry Modal ─────────────────────────────────────────────────────
function DomainEnquiryModal({ domain, user, onClose, onSuccess }) {
  const [form, setForm] = useState({
    fullName: `${user?.firstname || ''} ${user?.lastname || ''}`.trim(),
    email:    user?.email || '',
    phone:    user?.phoneNumber || '',
    message:  '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      // Correct signature: (domainId, { fullName, email, phone, message })
      await domainEnquiryAPI.submit(domain.id, {
        fullName: form.fullName,
        email:    form.email,
        phone:    form.phone,
        message:  form.message,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit enquiry.');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-[500px] bg-white border border-gray-200 rounded-[18px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] p-8">
        <div className="absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full bg-indigo-100/30 blur-3xl pointer-events-none" />
        <button className="absolute top-4 right-4 z-20 bg-transparent border-none text-gray-400 text-xl cursor-pointer transition-colors hover:text-gray-700" onClick={onClose}>✕</button>
        <div className="mb-6">
          <div className="inline-flex items-center px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded-full text-[0.72rem] font-semibold text-indigo-600 uppercase tracking-wide mb-2">Domain Enquiry</div>
          <h2 className="font-display text-[1.75rem] font-semibold text-gray-900 mb-1">{domain.domainName}{domain.domainExtension}</h2>
          <p className="text-sm text-gray-500">₹{Number(domain.askingPrice).toLocaleString('en-IN')} · {domain.pricingDemand}</p>
        </div>
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg mb-5 text-[0.83rem] text-amber-800">
          ⚡ For high-value domains, our team will facilitate the transaction.
          Fill in your details and we'll be in touch shortly.
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
            <input className="px-3 py-2 border border-gray-300 rounded-[8px] text-gray-900 bg-white outline-none focus:border-purple-500 transition-all" value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              placeholder="Your full name" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
              <input className="px-3 py-2 border border-gray-300 rounded-[8px] text-gray-900 bg-white outline-none focus:border-purple-500 transition-all" type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Phone <span className="text-red-500">*</span></label>
              <input className="px-3 py-2 border border-gray-300 rounded-[8px] text-gray-900 bg-white outline-none focus:border-purple-500 transition-all" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="10-digit number" maxLength={10} required />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Message / Reason for Enquiry <span className="text-red-500">*</span></label>
            <textarea className="px-3 py-2 border border-gray-300 rounded-[8px] text-gray-900 bg-white outline-none focus:border-purple-500 transition-all resize-vertical" value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Tell us why you're interested and any specific requirements…"
              rows={4} required />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="flex gap-3 mt-1">
            <button type="submit" className="btn-glow flex-1" disabled={loading}>
              {loading ? <span className="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin inline-block" /> : 'Submit Enquiry →'}
            </button>
            <button type="button" className="btn-glow" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <div className="text-[0.72rem] font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="border border-gray-200 bg-white rounded-[10px] p-2.5">
      <div className="text-[0.72rem] text-gray-500 font-bold uppercase tracking-wider mb-1">{label}</div>
      <div className="text-[0.95rem] text-gray-900 font-semibold">{value}</div>
    </div>
  );
}