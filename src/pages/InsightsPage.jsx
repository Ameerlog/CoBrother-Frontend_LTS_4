import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { insightsAPI } from '../api/services';

const SCORE_COLORS = { STRONG: '#22c55e', MODERATE: '#f59e0b', CAUTION: '#f97316', RISKY: '#ef4444' };
const SCORE_BG     = { STRONG: 'rgba(34,197,94,0.1)', MODERATE: 'rgba(245,158,11,0.1)', CAUTION: 'rgba(249,115,22,0.1)', RISKY: 'rgba(239,68,68,0.1)' };

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function InsightsPage() {
  const navigate = useNavigate();
  const [history, setHistory]     = useState([]);
  const [unread, setUnread]       = useState(0);
  const [subsCount, setSubsCount] = useState(0);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      insightsAPI.validationHistory().catch(() => ({ data: [] })),
      insightsAPI.getUnreadCount().catch(() => ({ data: { count: 0 } })),
      insightsAPI.getSubscriptions().catch(() => ({ data: [] })),
    ]).then(([histRes, unreadRes, subsRes]) => {
      setHistory(Array.isArray(histRes.data) ? histRes.data.slice(0, 3) : []);
      setUnread(unreadRes.data?.count || 0);
      setSubsCount(Array.isArray(subsRes.data) ? subsRes.data.length : 0);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚡</span>
            <h1 className="font-display text-3xl font-bold text-gray-900 m-0">Insights</h1>
          </div>
          <p className="text-gray-500 text-base mt-1 max-w-xl">
            Market intelligence for startup founders — validate ideas and track your space with live data from GitHub, NewsAPI, YouTube, and Hacker News.
          </p>
        </div>

        {/* Main feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Startup Validator */}
          <div
            className="group relative bg-white rounded-2xl border border-gray-200 p-8 cursor-pointer hover:border-indigo-300 hover:shadow-[0_0_40px_-8px_rgba(99,102,241,0.25)] transition-all duration-300 overflow-hidden"
            onClick={() => navigate('/insights/validate')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-5 text-2xl">
                🔬
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Startup Validator</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Enter your venture's name, description, industry, and stage. Get a full market intelligence report — competitive density, investor activity, community demand, and builder ecosystem — all from live data.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Market Timing', 'Investor Interest', 'Community Demand', 'Builder Activity', 'Uniqueness'].map(tag => (
                  <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm group-hover:gap-3 transition-all">
                Analyze a pitch <span>→</span>
              </div>
            </div>
          </div>

          {/* News Feed */}
          <div
            className="group relative bg-white rounded-2xl border border-gray-200 p-8 cursor-pointer hover:border-purple-300 hover:shadow-[0_0_40px_-8px_rgba(147,51,234,0.25)] transition-all duration-300 overflow-hidden"
            onClick={() => navigate('/insights/news')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-5 text-2xl">
                📡
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Intelligence Feed</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Subscribe to keywords, industries, and competitor names. A scheduled agent aggregates signals daily or weekly — funding rounds, product launches, market trends, community discussions.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Funding Radar', 'Competitor Watch', 'Market Trends', 'HN Community', 'Tech Releases'].map(tag => (
                  <span key={tag} className="text-xs bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  Open feed <span>→</span>
                </div>
                {unread > 0 && (
                  <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {unread} unread
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <div className="text-2xl font-bold text-gray-900">{history.length}</div>
            <div className="text-xs text-gray-500 mt-1">Validations run</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <div className="text-2xl font-bold text-gray-900">{subsCount}</div>
            <div className="text-xs text-gray-500 mt-1">Active subscriptions</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <div className="text-2xl font-bold text-purple-600">{unread}</div>
            <div className="text-xs text-gray-500 mt-1">Unread signals</div>
          </div>
        </div>

        {/* Recent validations */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-base">Recent Validations</h3>
              <button className="text-sm text-indigo-600 hover:underline" onClick={() => navigate('/insights/validate')}>
                Run new →
              </button>
            </div>
            <div className="space-y-3">
              {history.map(v => (
                <div key={v.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{v.ventureName}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{v.industry} · {v.stage} · {timeAgo(v.analyzedAt)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: SCORE_BG[v.verdictLevel] || 'rgba(99,102,241,0.1)',
                        color: SCORE_COLORS[v.verdictLevel] || '#6366f1',
                      }}
                    >
                      {v.overallScore}/100 {v.verdictLevel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state when nothing run yet */}
        {!loading && history.length === 0 && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-10 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Start with your first validation</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Enter your startup idea and get a real-time market intelligence report powered by live data from 4 sources.
            </p>
            <button className="btn-glow btn-glow-sm" onClick={() => navigate('/insights/validate')}>
              Validate a pitch now →
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
