import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { insightsAPI } from '../api/services';

const SOURCE_META = {
  HACKER_NEWS:  { label: 'HN',       bg: 'bg-orange-100',  text: 'text-orange-700',  dot: '#f97316' },
  YOUTUBE:      { label: 'YouTube',  bg: 'bg-red-100',     text: 'text-red-700',     dot: '#ef4444' },
  NEWSAPI:      { label: 'News',     bg: 'bg-blue-100',    text: 'text-blue-700',    dot: '#3b82f6' },
  GITHUB:       { label: 'GitHub',   bg: 'bg-gray-100',    text: 'text-gray-700',    dot: '#6b7280' },
};

const SIGNAL_META = {
  FUNDING:              { label: 'Funding',       bg: 'bg-emerald-100', text: 'text-emerald-700' },
  PRODUCT_LAUNCH:       { label: 'Launch',        bg: 'bg-indigo-100',  text: 'text-indigo-700'  },
  MARKET_TREND:         { label: 'Trend',         bg: 'bg-purple-100',  text: 'text-purple-700'  },
  COMPETITOR_MOVE:      { label: 'Competitor',    bg: 'bg-amber-100',   text: 'text-amber-700'   },
  TECH_RELEASE:         { label: 'Tech Release',  bg: 'bg-cyan-100',    text: 'text-cyan-700'    },
  COMMUNITY_DISCUSSION: { label: 'Community',     bg: 'bg-pink-100',    text: 'text-pink-700'    },
  GENERAL:              { label: 'General',       bg: 'bg-gray-100',    text: 'text-gray-600'    },
};

const IMPACT_META = {
  HIGH:   { label: 'High Impact',   color: '#22c55e', bg: 'rgba(34,197,94,0.1)'   },
  MEDIUM: { label: 'Med Impact',    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  LOW:    { label: 'Low Impact',    color: '#9ca3af', bg: 'rgba(156,163,175,0.1)' },
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function SourceBadge({ source }) {
  const m = SOURCE_META[source] || SOURCE_META.GENERAL;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${m.bg} ${m.text}`}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}

function SignalBadge({ signal }) {
  const m = SIGNAL_META[signal] || SIGNAL_META.GENERAL;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.bg} ${m.text}`}>
      {m.label}
    </span>
  );
}

function ImpactPill({ level }) {
  const m = IMPACT_META[level] || IMPACT_META.LOW;
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: m.bg, color: m.color }}>
      {m.label}
    </span>
  );
}

function DigestItemCard({ item, compact = false }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 ${compact ? 'p-4' : 'p-5'}`}
    >
      <div className="flex items-start gap-3">
        {item.thumbnailUrl && !compact && (
          <img
            src={item.thumbnailUrl}
            alt=""
            className="w-20 h-14 object-cover rounded-lg flex-shrink-0 bg-gray-100"
            onError={e => { e.target.style.display = 'none'; }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <SourceBadge source={item.source} />
            {item.signalType && <SignalBadge signal={item.signalType} />}
            {item.impactLevel && <ImpactPill level={item.impactLevel} />}
          </div>
          <h4 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2 mb-1">
            {item.title}
          </h4>
          {!compact && item.snippet && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">{item.snippet}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {item.sourceName && <span>{item.sourceName}</span>}
            {item.publishedAt && <span>{timeAgo(item.publishedAt)}</span>}
            {item.matchedKeyword && (
              <span className="bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded font-medium">
                #{item.matchedKeyword}
              </span>
            )}
            {item.engagementScore > 0 && (
              <span className="flex items-center gap-0.5">
                <span>▲</span> {item.engagementScore}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

function RadarTab({ items, loading }) {
  if (loading) return <TabSkeleton />;
  if (!items.length) return <EmptyState icon="📡" title="No radar signals yet" sub="Run a subscription trigger or wait for the next scheduled digest." />;

  const high   = items.filter(i => i.impactLevel === 'HIGH');
  const medium = items.filter(i => i.impactLevel === 'MEDIUM');

  return (
    <div className="space-y-8">
      {high.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <h3 className="font-bold text-gray-900">High-Impact Signals</h3>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{high.length}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {high.map((item, i) => <DigestItemCard key={i} item={item} />)}
          </div>
        </div>
      )}
      {medium.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h3 className="font-bold text-gray-900">Medium-Impact Signals</h3>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{medium.length}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {medium.map((item, i) => <DigestItemCard key={i} item={item} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function FeedTab({ digests, loading, onMarkRead, onMarkAllRead, unread }) {
  const [filter, setFilter] = useState({ source: 'ALL', signal: 'ALL', impact: 'ALL' });

  if (loading) return <TabSkeleton />;

  const allItems = digests.flatMap(d =>
    (d.items || []).map(it => ({ ...it, digestId: d.id, digestRead: d.read }))
  );

  const filtered = allItems.filter(item =>
    (filter.source === 'ALL' || item.source === filter.source) &&
    (filter.signal === 'ALL' || item.signalType === filter.signal) &&
    (filter.impact === 'ALL' || item.impactLevel === filter.impact)
  );

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select
          value={filter.source}
          onChange={e => setFilter(f => ({ ...f, source: e.target.value }))}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="ALL">All Sources</option>
          {Object.entries(SOURCE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select
          value={filter.signal}
          onChange={e => setFilter(f => ({ ...f, signal: e.target.value }))}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="ALL">All Signals</option>
          {Object.entries(SIGNAL_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select
          value={filter.impact}
          onChange={e => setFilter(f => ({ ...f, impact: e.target.value }))}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="ALL">All Impact</option>
          {Object.entries(IMPACT_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-3">
          {unread > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-sm text-indigo-600 hover:underline font-medium"
            >
              Mark all read ({unread})
            </button>
          )}
          <span className="text-xs text-gray-400">{filtered.length} items</span>
        </div>
      </div>

      {filtered.length === 0
        ? <EmptyState icon="🔍" title="No items match filters" sub="Try adjusting the source, signal, or impact filters." />
        : (
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <div key={i} className="relative">
                {!item.digestRead && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500" />
                )}
                <DigestItemCard item={item} />
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

function FundingTab({ items, loading }) {
  if (loading) return <TabSkeleton />;
  if (!items.length) return <EmptyState icon="💰" title="No funding signals tracked yet" sub="Subscribe to industry keywords or specific companies to track funding rounds." />;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">💰</span>
        <div>
          <h3 className="font-bold text-gray-900">Funding Intelligence</h3>
          <p className="text-xs text-gray-500">Funding rounds, investment activity, and investor signals</p>
        </div>
        <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {items.length} signals
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md p-5 transition-all"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
              💰
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                <SourceBadge source={item.source} />
                <ImpactPill level={item.impactLevel} />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-2 mb-1">
                {item.title}
              </h4>
              {item.snippet && (
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">{item.snippet}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                {item.sourceName && <span>{item.sourceName}</span>}
                {item.publishedAt && <span>{timeAgo(item.publishedAt)}</span>}
                {item.matchedKeyword && (
                  <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">
                    #{item.matchedKeyword}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function TabSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex gap-2 mb-3">
            <div className="h-5 w-12 bg-gray-200 rounded-full" />
            <div className="h-5 w-16 bg-gray-200 rounded-full" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-sm mx-auto">{sub}</p>
    </div>
  );
}

const TABS = [
  { id: 'radar',   label: 'Radar',    icon: '🎯' },
  { id: 'feed',    label: 'Feed',     icon: '📰' },
  { id: 'funding', label: 'Funding',  icon: '💰' },
];

export default function NewsDigestPage() {
  const navigate = useNavigate();
  const [tab, setTab]               = useState('radar');
  const [radar, setRadar]           = useState([]);
  const [digests, setDigests]       = useState([]);
  const [funding, setFunding]       = useState([]);
  const [unread, setUnread]         = useState(0);
  const [loading, setLoading]       = useState({ radar: true, feed: true, funding: true });
  const [page, setPage]             = useState(0);
  const [hasMore, setHasMore]       = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const setLoadingKey = (key, val) => setLoading(l => ({ ...l, [key]: val }));

  useEffect(() => {
    insightsAPI.getRadar()
      .then(r => setRadar(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoadingKey('radar', false));

    insightsAPI.getFundingSignals()
      .then(r => setFunding(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoadingKey('funding', false));

    insightsAPI.getUnreadCount()
      .then(r => setUnread(r.data?.count || 0))
      .catch(() => {});

    loadFeed(0);
  }, []);

  const loadFeed = useCallback((p) => {
    if (p === 0) setLoadingKey('feed', true);
    else setLoadingMore(true);

    insightsAPI.getDigests(p, 10)
      .then(r => {
        const content = r.data?.content || [];
        const last = r.data?.last ?? true;
        setDigests(prev => p === 0 ? content : [...prev, ...content]);
        setHasMore(!last);
        setPage(p);
      })
      .catch(() => {})
      .finally(() => {
        setLoadingKey('feed', false);
        setLoadingMore(false);
      });
  }, []);

  const handleMarkAllRead = () => {
    insightsAPI.markAllRead()
      .then(() => {
        setUnread(0);
        setDigests(prev => prev.map(d => ({ ...d, read: true })));
      })
      .catch(() => {});
  };

  const totalFeedItems = digests.reduce((sum, d) => sum + (d.items?.length || 0), 0);
  const highImpactTotal = radar.filter(i => i.impactLevel === 'HIGH').length;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/insights')}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Back
              </button>
              <span className="text-gray-300">|</span>
              <span className="text-2xl">📡</span>
              <h1 className="font-display text-2xl font-bold text-gray-900">Intelligence Feed</h1>
              {unread > 0 && (
                <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {unread} unread
                </span>
              )}
            </div>
            <button
              onClick={() => navigate('/insights/news/subscriptions')}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <span>⚙</span> Manage Subscriptions
            </button>
          </div>
          <p className="text-gray-500 text-sm max-w-2xl">
            Aggregated market signals from Hacker News, NewsAPI, YouTube, and GitHub — filtered, scored, and ranked by impact.
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Radar signals',    value: radar.length,      color: 'text-indigo-600' },
            { label: 'High impact',       value: highImpactTotal,  color: 'text-green-600'  },
            { label: 'Feed items',        value: totalFeedItems,   color: 'text-gray-900'   },
            { label: 'Funding signals',   value: funding.length,   color: 'text-emerald-600'},
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {tab === 'radar' && <RadarTab items={radar} loading={loading.radar} />}

        {tab === 'feed' && (
          <>
            <FeedTab
              digests={digests}
              loading={loading.feed}
              unread={unread}
              onMarkAllRead={handleMarkAllRead}
              onMarkRead={id => insightsAPI.markDigestRead(id).catch(() => {})}
            />
            {!loading.feed && hasMore && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => loadFeed(page + 1)}
                  disabled={loadingMore}
                  className="bg-white border border-gray-200 hover:border-indigo-300 text-gray-700 font-semibold text-sm px-6 py-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  {loadingMore ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}

        {tab === 'funding' && <FundingTab items={funding} loading={loading.funding} />}

      </div>
    </AppLayout>
  );
}
