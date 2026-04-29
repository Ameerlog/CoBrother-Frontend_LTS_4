import { useState, useEffect } from 'react';
import { adminAPI } from '../api/services';
import AppLayout from '../components/layout/AppLayout';
import VentureIcon from '../assets/Coventure_logo.png';
import DomainsIcon from '../assets/CoBranding.png';
import TechnologyIcon from '../assets/CoCreation.png';
import AuctionIcon from '../assets/Auction.png';
import PurchaseIcon from '../assets/purchase.png';
import RequestIcon from '../assets/Request.png';
import EnquireIcon from '../assets/Enquire.png';
import HomepageFeatureSelector from '../components/admin/HomepageFeatureSelector';

const STATUS_COLORS = {
  PAYMENT_PENDING:   '#c8a96e',
  PAYMENT_COMPLETED: '#6eadc8',
  FORWARDED:         '#a06ec8',
  ACCEPTED:          '#6ec896',
  REJECTED:          '#c86e6e',
  CANCELLED:         '#666',
};

export default function AdminDashboardPage() {
  const [tab, setTab]                       = useState('coventures');
  const [data, setData]                     = useState([]);
  const [coBrothers, setCoBrothers]         = useState([]);
  const [requests, setRequests]             = useState([]);
  const [loading, setLoading]               = useState(false);
  const [forwardModal, setForwardModal]     = useState(null);
  const [takeDownTarget, setTakeDownTarget] = useState(null);

  const fetchers = {
    coventures:         adminAPI.getCoVentures,
    domains:            adminAPI.getDomains,
    'domain-enquiries': adminAPI.getDomainEnquiries,
    cocreations:        adminAPI.getCoCreations,
    auctions:           adminAPI.getAllAuctions,
    'venture-auctions': adminAPI.getAllVentureAuctions,
    'addon-orders':     adminAPI.getAddonOrders,
  };

  const loadTab = (currentTab) => {
    if (!fetchers[currentTab]) return;
    setLoading(true);
    fetchers[currentTab]()
      .then(({ data }) => setData(Array.isArray(data) ? data : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    adminAPI.getCoBrothers()
      .then(({ data }) => setCoBrothers(Array.isArray(data) ? data : []))
      .catch(() => {});
    adminAPI.getCoBrotherRequests()
      .then(({ data }) => setRequests(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => { loadTab(tab); }, [tab]);

  const handleForward = async (entityId, type, coBrotherId) => {
    try {
      await adminAPI.forward({ entityId, type, coBrotherId });
      alert('Payment request sent to lister.');
      setForwardModal(null);
      adminAPI.getCoBrotherRequests()
        .then(({ data }) => setRequests(Array.isArray(data) ? data : []));
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to forward.');
    }
  };

  const handleTakeDown = (entityId, type, title) =>
    setTakeDownTarget({ entityId, type, title });

  const confirmTakeDown = async (reason) => {
    try {
      await adminAPI.takeDown(takeDownTarget.type, takeDownTarget.entityId, reason);
      setTakeDownTarget(null);
      loadTab(tab);
    } catch (e) {
      alert('Failed to take down listing.');
    }
  };

  const handleRestore = async (entityId, type) => {
    try {
      await adminAPI.restore(type, entityId);
      loadTab(tab);
    } catch (e) {
      alert('Failed to restore listing.');
    }
  };

  const tabs = [
    { id: 'coventures',         label: 'CoVentures', icon: VentureIcon       },
    { id: 'domains',            label: 'Domains', icon: DomainsIcon           },
    { id: 'domain-enquiries',   label: 'Domain Enquiries', icon: EnquireIcon },
    { id: 'cocreations',        label: 'CoCreations', icon: TechnologyIcon    },
    { id: 'requests',           label: 'CoBrother Requests', icon: RequestIcon},
    { id: 'auctions',           label: 'Domain Auctions', icon: AuctionIcon   },
    { id: 'venture-auctions',   label: 'Venture Auctions', icon: AuctionIcon  },
    { id: 'addon-orders',       label: 'Addon Orders', icon: PurchaseIcon     },
    { id: 'homepage-features',  label: 'Homepage Features', icon: PurchaseIcon},
  ];

  return (
    <AppLayout>
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 m-0">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage all platform activity.</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          {tabs.map(t => (
            <button key={t.id}
              className={`filter-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}>
              {t.icon && <img src={t.icon} alt="" className="inline-block w-4 h-4 mr-1.5 object-contain" />}
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-12 h-12 border-4 border-gray-400 border-t-gray-800 rounded-full animate-spin" /></div>
        ) : tab === 'domain-enquiries' ? (
          <DomainEnquiriesTable
            enquiries={data}
            onForward={(entityId, type) => setForwardModal({ entityId, type })}
          />
        ) : tab === 'auctions' ? ( <AuctionsAdminTable auctions={data} />
        ) : tab === 'venture-auctions' ? ( <VentureAuctionsAdminTable auctions={data} />
        ) : tab === 'addon-orders' ? ( <AddonOrdersTable orders={data} />
        ) : tab === 'homepage-features' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <HomepageFeatureSelector type="domain" />
            <HomepageFeatureSelector type="venture" />
            <HomepageFeatureSelector type="software" />
          </div>
        ) : tab === 'requests' ? (
          <RequestsTable requests={requests} />
        ) : data.length === 0 ? (
          <div className="text-center py-20"><h3 className="font-display text-2xl font-bold text-gray-900">No records found</h3></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.map(item => (
              <AdminRow
                key={item.id}
                item={item}
                tabType={tab}
                onForward={(entityId, type) => setForwardModal({ entityId, type })}
                onTakeDown={handleTakeDown}
                onRestore={handleRestore}
              />
            ))}
          </div>
        )}
      </div>

      {forwardModal && (
        <ForwardModal
          entityId={forwardModal.entityId}
          type={forwardModal.type}
          coBrothers={coBrothers}
          requests={requests}
          onForward={handleForward}
          onClose={() => setForwardModal(null)}
        />
      )}

      {takeDownTarget && (
        <TakeDownModal
          target={takeDownTarget}
          onConfirm={confirmTakeDown}
          onClose={() => setTakeDownTarget(null)}
        />
      )}
    </AppLayout>
  );
}

function AdminRow({ item, tabType, onForward, onTakeDown, onRestore }) {
  const [expanded, setExpanded] = useState(false);

  const getTitle = () => {
    if (tabType === 'coventures') return item.venture?.brandDetails?.brandName || 'CoVenture #' + item.id;
    if (tabType === 'domains')    return (item.domainName || '') + (item.domainExtension || '');
    return item.name || 'Software #' + item.id;
  };

  const getType = () => {
    if (tabType === 'coventures') return 'COVENTURE';
    if (tabType === 'domains')    return 'DOMAIN';
    return 'COCREATION';
  };

  const lister    = tabType === 'coventures' ? item.venture?.listedBy : item.listedBy;
  const applicant = tabType === 'coventures' ? item.applicant          : item.purchasedBy;

  return (
    <div style={{
      background: '#ffffff',
      border: `1px solid ${item.takenDown ? 'rgba(200,110,110,0.25)' : '#e5e7eb'}`,
      borderRadius: 10, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem', cursor: 'pointer' }}
           onClick={() => setExpanded(v => !v)}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#111827', display: 'flex',
                        alignItems: 'center', gap: '0.5rem' }}>
            {getTitle()}
            {item.takenDown && (
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c86e6e',
                             background: 'rgba(200,110,110,0.12)',
                             border: '1px solid rgba(200,110,110,0.3)',
                             padding: '0.15rem 0.45rem', borderRadius: 4 }}>
                ⚠ Taken Down
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.2rem' }}>
            ID: {item.id}
          </div>
        </div>
        <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid #e5e7eb', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
                        marginBottom: '1rem' }}>
            <div>
              <div style={labelStyle}>Lister</div>
              {lister ? (
                <>
                  <div style={valueStyle}>{lister.firstname} {lister.lastname}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{lister.email}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{lister.phoneNumber || '—'}</div>
                </>
              ) : <div style={valueStyle}>—</div>}
            </div>
            <div>
              <div style={labelStyle}>{tabType === 'coventures' ? 'Applicant' : 'Buyer'}</div>
              {applicant ? (
                <>
                  <div style={valueStyle}>{applicant.firstname} {applicant.lastname}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{applicant.email}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{applicant.phoneNumber || '—'}</div>
                </>
              ) : <div style={valueStyle}>Not yet</div>}
            </div>
          </div>

          {item.takenDown && item.takeDownReason && (
            <div style={{ fontSize: '0.8rem', color: '#c86e6e', marginBottom: '0.75rem',
                          fontStyle: 'italic' }}>
              Takedown reason: {item.takeDownReason}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {!item.takenDown && (
              <button className="btn-secondary btn-sm"
                onClick={() => onForward(item.id, getType())}
                style={{ fontSize: '0.8rem' }}>
                ◆ Forward to CoBrother
              </button>
            )}
            {!item.takenDown ? (
              <button className="btn-danger btn-sm"
                onClick={() => onTakeDown(item.id, getType(), getTitle())}
                style={{ fontSize: '0.8rem' }}>
                ⚠ Take Down
              </button>
            ) : (
              <button className="btn-secondary btn-sm"
                onClick={() => onRestore(item.id, getType())}
                style={{ fontSize: '0.75rem' }}>
                ↺ Restore
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AuctionsAdminTable({ auctions }) {
  if (!auctions.length) return (
    <div className="text-center py-20"><h3 className="font-display text-2xl font-bold text-gray-900">No auctions yet</h3></div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {auctions.map((item) => {
        // Handle both { auction, bids, domain } and flat auction objects
        const auction = item.auction ?? item;
        const bids    = item.bids ?? [];
        return (
          <AuctionAdminRow key={auction.id} auction={auction} bids={bids} />
        );
      })}
    </div>
  );
}

function AuctionAdminRow({ auction, bids }) {
  const [expanded, setExpanded] = useState(false);
  const domain = auction.domain || {};

  return (
    <div style={{ background: '#ffffff',
                  border: '1px solid #e5e7eb', borderRadius: 10,
                  overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem', cursor: 'pointer' }}
           onClick={() => setExpanded(v => !v)}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#111827' }}>
            {domain.domainName}{domain.domainExtension}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.2rem' }}>
            {auction.totalBids} bids · Status: {auction.status}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem',
                        fontWeight: 700, color: '#6ec896' }}>
            {auction.currentHighestBid > 0
              ? `₹${Number(auction.currentHighestBid).toLocaleString('en-IN')}`
              : 'No bids'}
          </div>
          {auction.currentWinner && (
            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
              {auction.currentWinner.firstname} {auction.currentWinner.lastname}
            </div>
          )}
        </div>
        <span style={{ color: '#9ca3af' }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid #e5e7eb',
                      padding: '1rem 1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '1rem', marginBottom: '1rem' }}>
            <div><div style={labelStyle}>Lister</div>
              <div style={valueStyle}>
                {domain.listedBy?.firstname} {domain.listedBy?.lastname}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                {domain.listedBy?.email}
              </div>
            </div>
            <div><div style={labelStyle}>Winner</div>
              <div style={valueStyle}>
                {auction.currentWinner
                  ? `${auction.currentWinner.firstname} ${auction.currentWinner.lastname}`
                  : '—'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                {auction.currentWinner?.email || ''}
              </div>
            </div>
            <div><div style={labelStyle}>Winning Bid</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem',
                            fontWeight: 700, color: '#6ec896' }}>
                {auction.currentHighestBid > 0
                  ? `₹${Number(auction.currentHighestBid).toLocaleString('en-IN')}`
                  : '—'}
              </div>
            </div>
          </div>

          {bids?.length > 0 && (
            <div>
              <div style={labelStyle}>All Bids ({bids.length})</div>
              <div style={{ maxHeight: 200, overflowY: 'auto', marginTop: '0.5rem',
                            background: '#f9fafb', borderRadius: 8, padding: '0.5rem', border: '1px solid #e5e7eb' }}>
                {bids.map((bid, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                                        padding: '0.4rem 0.5rem', fontSize: '0.8rem',
                                        borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#111827', fontWeight: 500 }}>{bid.bidderName}</span>
                    <span style={{ color: bid.isWinningBid ? '#059669' : '#7c3aed',
                                   fontWeight: 600 }}>
                      ₹{Number(bid.amount).toLocaleString('en-IN')}
                      {bid.isWinningBid && ' 🏆'}
                    </span>
                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                      {bid.bidTime
                        ? new Date(bid.bidTime).toLocaleString('en-IN',
                            { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
                        : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VentureAuctionsAdminTable({ auctions }) {
  if (!auctions.length) return (
    <div className="text-center py-20"><h3 className="font-display text-2xl font-bold text-gray-900">No venture auctions yet</h3></div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {auctions.map((item) => {
        const auction = item.auction ?? item;
        const bids    = item.bids ?? [];
        return (
          <VentureAuctionAdminRow key={auction.id} auction={auction} bids={bids} />
        );
      })}
    </div>
  );
}

function VentureAuctionAdminRow({ auction, bids }) {
  const [expanded, setExpanded] = useState(false);
  const venture = auction.venture || {};
  const brand   = venture.brandDetails || {};

  return (
    <div style={{ background: '#ffffff',
                  border: '1px solid #e5e7eb', borderRadius: 10,
                  overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem', cursor: 'pointer' }}
           onClick={() => setExpanded(v => !v)}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {brand.brandName || 'Venture #' + auction.id}
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#7c3aed',
                           background: 'rgba(124,58,237,0.08)',
                           border: '1px solid rgba(124,58,237,0.25)',
                           padding: '0.15rem 0.45rem', borderRadius: 4 }}>
              🔨 Equity Auction
            </span>
            {venture.verified && (
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669',
                             background: 'rgba(5,150,105,0.08)',
                             border: '1px solid rgba(5,150,105,0.25)',
                             padding: '0.15rem 0.45rem', borderRadius: 4 }}>
                ✓ GSTIN
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.2rem' }}>
            {auction.totalBids} bids · Status: {auction.status}
            {brand.industry && ` · ${brand.industry.replace(/_/g, ' ')}`}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem',
                        fontWeight: 700, color: '#6ec896' }}>
            {auction.currentHighestBid > 0
              ? `₹${Number(auction.currentHighestBid).toLocaleString('en-IN')}`
              : 'No bids'}
          </div>
          {auction.currentWinner && (
            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
              {auction.currentWinner.firstname} {auction.currentWinner.lastname}
            </div>
          )}
        </div>
        <span style={{ color: '#9ca3af' }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid #e5e7eb',
                      padding: '1rem 1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '1rem', marginBottom: '1rem' }}>
            <div><div style={labelStyle}>Venture Owner</div>
              <div style={valueStyle}>
                {venture.listedBy?.firstname} {venture.listedBy?.lastname}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                {venture.listedBy?.email}
              </div>
            </div>
            <div><div style={labelStyle}>Current Winner</div>
              <div style={valueStyle}>
                {auction.currentWinner
                  ? `${auction.currentWinner.firstname} ${auction.currentWinner.lastname}`
                  : '—'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                {auction.currentWinner?.email || ''}
              </div>
            </div>
            <div><div style={labelStyle}>Auction Details</div>
              <div style={valueStyle}>
                Min: ₹{Number(auction.minBidPrice || 0).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                Duration: {auction.duration?.replace(/_/g, ' ') || '—'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                {auction.startTime ? `Start: ${new Date(auction.startTime).toLocaleDateString('en-IN')}` : ''}
              </div>
            </div>
          </div>

          {bids?.length > 0 && (
            <div>
              <div style={labelStyle}>All Bids ({bids.length})</div>
              <div style={{ maxHeight: 200, overflowY: 'auto', marginTop: '0.5rem',
                            background: '#f9fafb', borderRadius: 8, padding: '0.5rem', border: '1px solid #e5e7eb' }}>
                {bids.map((bid, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                                        padding: '0.4rem 0.5rem', fontSize: '0.8rem',
                                        borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#111827', fontWeight: 500 }}>{bid.bidderName}</span>
                    <span style={{ color: bid.isWinningBid ? '#059669' : '#7c3aed',
                                   fontWeight: 600 }}>
                      ₹{Number(bid.amount).toLocaleString('en-IN')}
                      {bid.isWinningBid && ' 🏆'}
                    </span>
                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                      {bid.bidTime
                        ? new Date(bid.bidTime).toLocaleString('en-IN',
                            { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
                        : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DomainEnquiriesTable({ enquiries, onForward }) {
  if (enquiries.length === 0) return (
    <div className="text-center py-20">
      <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">No domain enquiries yet</h3>
      <p className="text-gray-600">Enquiries for domains above ₹5,00,000 will appear here.</p>
    </div>
  );

  const ENQUIRY_STATUS = { PENDING: '#c8a96e', FORWARDED: '#a06ec8', CLOSED: '#6ec896' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {enquiries.map(e => (
        <div key={e.id} style={{ padding: '1rem 1.25rem', background: '#ffffff',
                                  border: '1px solid #e5e7eb', borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#111827' }}>
                {e.domain?.domainName}{e.domain?.domainExtension}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.2rem' }}>
                ₹{Number(e.domain?.askingPrice || 0).toLocaleString('en-IN')}
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700,
                           color: ENQUIRY_STATUS[e.status] || '#888' }}>
              {e.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <div style={labelStyle}>Enquirer</div>
              <div style={valueStyle}>{e.fullName}</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{e.email}</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{e.phone}</div>
            </div>
            <div>
              <div style={labelStyle}>Domain Lister</div>
              <div style={valueStyle}>
                {e.domain?.listedBy?.firstname} {e.domain?.listedBy?.lastname}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{e.domain?.listedBy?.email}</div>
            </div>
          </div>

          {e.message && (
            <div style={{ fontSize: '0.82rem', color: '#a0a0b0', marginBottom: '0.75rem',
                          fontStyle: 'italic' }}>
              "{e.message}"
            </div>
          )}

          {e.status === 'PENDING' && (
            <button className="btn-secondary btn-sm"
              onClick={() => onForward(e.id, 'DOMAIN_ENQUIRY')}
              style={{ fontSize: '0.8rem' }}>
              ◆ Forward to CoBrother
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function RequestsTable({ requests }) {
  if (requests.length === 0) return (
    <div className="text-center py-20"><h3 className="font-display text-2xl font-bold text-gray-900">No CoBrother requests yet</h3></div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {requests.map(r => (
        <div key={r.id} style={{ padding: '1rem 1.25rem', background: '#ffffff',
                                  border: '1px solid #e5e7eb', borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div>
              <span style={{ fontWeight: 600, color: '#111827' }}>{r.entityTitle}</span>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                {r.requestType}
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700,
                           color: STATUS_COLORS[r.status] || '#888' }}>
              {r.status?.replace(/_/g, ' ')}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
            Lister: {r.listerName} · {r.listerEmail}
          </div>
          {r.applicantName && (
            <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
              Applicant: {r.applicantName} · {r.applicantEmail}
            </div>
          )}
          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.3rem' }}>
            CoBrother: {r.assignedCoBrother?.firstname} {r.assignedCoBrother?.lastname}
          </div>
        </div>
      ))}
    </div>
  );
}

function ForwardModal({ entityId, type, coBrothers, requests, onForward, onClose }) {
  const [selectedCoBrother, setSelectedCoBrother] = useState('');
  const [loading, setLoading]                     = useState(false);

  const activeRequests = requests.filter(r =>
    r.entityId === entityId &&
    r.requestType === type &&
    r.status !== 'CANCELLED' &&
    r.status !== 'REJECTED'
  );

  const alreadyAccepted = activeRequests.some(r => r.status === 'ACCEPTED');
  const pendingPayment  = activeRequests.some(r =>
    r.status === 'PAYMENT_PENDING' || r.status === 'FORWARDED');

  const handleSubmit = async () => {
    if (!selectedCoBrother) { alert('Please select a CoBrother'); return; }
    setLoading(true);
    await onForward(entityId, type, Number(selectedCoBrother));
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: 440 }}>
        <div className="modal-glow" />
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-header">
          <div className="modal-badge">Forward to CoBrother</div>
          <h2>Assign CoBrother</h2>
          <p>Select a CoBrother for this {type.toLowerCase().replace(/_/g, ' ')} request.</p>
        </div>

        {alreadyAccepted && (
          <div style={{ padding: '0.875rem', background: 'rgba(200,110,110,0.08)',
                        border: '1px solid rgba(200,110,110,0.25)', borderRadius: 8,
                        marginBottom: '1rem', fontSize: '0.83rem', color: '#c86e6e' }}>
            ⚠️ This request has already been accepted. Forwarding again is not recommended.
          </div>
        )}

        {!alreadyAccepted && pendingPayment && (
          <div style={{ padding: '0.875rem', background: 'rgba(200,169,110,0.08)',
                        border: '1px solid rgba(200,169,110,0.25)', borderRadius: 8,
                        marginBottom: '1rem', fontSize: '0.83rem', color: '#c8a96e' }}>
            ⚠️ The lister already has a pending payment request. Cancel it before assigning another.
          </div>
        )}

        <div className="form-group" style={{ margin: '1rem 0' }}>
          <label style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.5rem',
                          display: 'block' }}>Select CoBrother</label>
          <select value={selectedCoBrother} onChange={e => setSelectedCoBrother(e.target.value)}>
            <option value="">Choose a CoBrother…</option>
            {coBrothers.map(cb => {
              const alreadyAssigned = activeRequests.some(r => r.assignedCoBrother?.id === cb.id);
              return (
                <option key={cb.id} value={cb.id} disabled={alreadyAssigned}>
                  {cb.firstname} {cb.lastname} ({cb.email})
                  {alreadyAssigned ? ' — Already assigned' : ''}
                </option>
              );
            })}
          </select>
        </div>

        <div style={{ padding: '0.875rem', background: 'rgba(200,169,110,0.08)',
                      border: '1px solid rgba(200,169,110,0.2)', borderRadius: 8,
                      marginBottom: '1.25rem', fontSize: '0.83rem', color: '#c8a96e' }}>
          ⚡ A ₹1,000 payment request will be sent to the lister. CoBrother notified after payment.
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-primary" onClick={handleSubmit}
            disabled={loading || !selectedCoBrother || alreadyAccepted || pendingPayment}
            style={{ flex: 1 }}>
            {loading ? <span className="btn-spinner" /> : 'Send Payment Request →'}
          </button>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function TakeDownModal({ target, onConfirm, onClose }) {
  const [reason, setReason]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) { alert('Please provide a reason.'); return; }
    setLoading(true);
    await onConfirm(reason);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: 440 }}>
        <div className="modal-glow" />
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-header">
          <div className="modal-badge" style={{ background: 'rgba(200,110,110,0.15)',
                                                color: '#c86e6e',
                                                border: '1px solid rgba(200,110,110,0.3)' }}>
            Take Down Listing
          </div>
          <h2>{target.title}</h2>
          <p>{target.type}</p>
        </div>

        <div style={{ padding: '0.875rem', background: 'rgba(200,110,110,0.07)',
                      border: '1px solid rgba(200,110,110,0.2)', borderRadius: 8,
                      marginBottom: '1.25rem', fontSize: '0.83rem', color: '#c86e6e' }}>
          ⚠️ This hides the listing from public view. Lister still sees it with a "Taken Down"
          badge. Restorable at any time.
        </div>

        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.5rem',
                          display: 'block' }}>
            Reason <span style={{ color: '#c86e6e' }}>*</span>
          </label>
          <textarea value={reason} onChange={e => setReason(e.target.value)}
            placeholder="e.g. Fraudulent listing, policy violation, spam…"
            rows={3} style={{ resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-danger" onClick={handleSubmit}
            disabled={loading || !reason.trim()} style={{ flex: 1 }}>
            {loading ? <span className="btn-spinner" /> : '⚠ Confirm Takedown'}
          </button>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function AddonOrdersTable({ orders }) {
  if (!orders.length) return (
    <div className="text-center py-20">
      <h3 className="font-display text-2xl font-bold text-gray-900">No addon orders yet</h3>
      <p className="text-gray-600 mt-2">Orders will appear here when users select add-ons during checkout.</p>
    </div>
  );

  const STATUS_COLOR = {
    COMPLETED:       '#6ec896',
    CONTACT_PENDING: '#c8a96e',
    CREATED:         '#6eadc8',
    FAILED:          '#c86e6e',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {orders.map(order => (
        <AddonOrderRow key={order.id} order={order} statusColor={STATUS_COLOR} />
      ))}
    </div>
  );
}

function AddonOrderRow({ order, statusColor }) {
  const [expanded, setExpanded] = useState(false);
  const services = order.selectedServices ? order.selectedServices.split(',') : [];

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', cursor: 'pointer' }}
           onClick={() => setExpanded(v => !v)}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            #{order.id} — {order.buyerName || order.buyerEmail || '—'}
            <span style={{ fontSize: '0.68rem', fontWeight: 700,
                           color: order.purchaseType === 'DOMAIN' ? '#0369a1' : '#7c3aed',
                           background: order.purchaseType === 'DOMAIN' ? 'rgba(3,105,161,0.08)' : 'rgba(124,58,237,0.08)',
                           border: `1px solid ${order.purchaseType === 'DOMAIN' ? 'rgba(3,105,161,0.25)' : 'rgba(124,58,237,0.25)'}`,
                           padding: '0.15rem 0.45rem', borderRadius: 4 }}>
              {order.purchaseType}
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 700,
                           color: statusColor[order.paymentStatus] || '#888',
                           background: 'rgba(0,0,0,0.04)',
                           border: '1px solid rgba(0,0,0,0.1)',
                           padding: '0.15rem 0.45rem', borderRadius: 4 }}>
              {order.paymentStatus?.replace(/_/g, ' ')}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.2rem' }}>
            {services.length} service{services.length !== 1 ? 's' : ''} · ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
            {order.createdAt && ` · ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 700,
                        color: statusColor[order.paymentStatus] || '#888' }}>
            ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
          </div>
        </div>
        <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid #e5e7eb', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={labelStyle}>Buyer</div>
              <div style={valueStyle}>{order.buyerName || '—'}</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{order.buyerEmail}</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{order.buyerPhone || '—'}</div>
            </div>
            <div>
              <div style={labelStyle}>Linked Purchase</div>
              <div style={valueStyle}>{order.purchaseType} #{order.purchaseId}</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>Addon Order #{order.id}</div>
            </div>
            <div>
              <div style={labelStyle}>Payment</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: statusColor[order.paymentStatus] || '#888' }}>
                {order.paymentStatus?.replace(/_/g, ' ')}
              </div>
              {order.razorpayPaymentId && (
                <div style={{ fontSize: '0.72rem', color: '#6b7280', wordBreak: 'break-all' }}>
                  {order.razorpayPaymentId}
                </div>
              )}
            </div>
          </div>

          {services.length > 0 && (
            <div>
              <div style={labelStyle}>Services Selected</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                {services.map(key => (
                  <span key={key} style={{ fontSize: '0.75rem', fontWeight: 600,
                                           background: '#eef2ff', color: '#4338ca',
                                           border: '1px solid #c7d2fe',
                                           padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                    {key.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  fontSize: '0.72rem', fontWeight: 600, color: '#6b7280',
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem',
};
const valueStyle = { fontSize: '0.9rem', color: '#111827', fontWeight: 500 };