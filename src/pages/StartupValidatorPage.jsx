import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import { insightsAPI } from '../api/services';

const INDUSTRIES = [
  'TECH','FINANCE','HEALTHCARE','EDUCATION','FOOD_AND_BEVERAGE','RETAIL',
  'REAL_ESTATE','MEDIA','MANUFACTURING','LOGISTICS','AGRICULTURE',
  'SAAS','ECOMMERCE','SERVICES','AI_AUTOMATION','FINTECH','OTHER',
];
const STAGES = ['IDEA', 'MVP', 'EARLY_TRACTION', 'GROWTH', 'SCALE'];

const VERDICT_STYLE = {
  STRONG:   { bg: 'linear-gradient(135deg, #065f46, #047857)', border: '#10b981', text: '#d1fae5', badge: '#10b981' },
  MODERATE: { bg: 'linear-gradient(135deg, #78350f, #92400e)', border: '#f59e0b', text: '#fef3c7', badge: '#f59e0b' },
  CAUTION:  { bg: 'linear-gradient(135deg, #7c2d12, #9a3412)', border: '#f97316', text: '#ffedd5', badge: '#f97316' },
  RISKY:    { bg: 'linear-gradient(135deg, #7f1d1d, #991b1b)', border: '#ef4444', text: '#fee2e2', badge: '#ef4444' },
};

const INSIGHT_STYLE = {
  OPPORTUNITY: { icon: '🟢', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
  COMPETITOR:  { icon: '🔵', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
  VALIDATION:  { icon: '🟡', color: '#eab308', bg: 'rgba(234,179,8,0.08)' },
  WARNING:     { icon: '🔴', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  TIMING:      { icon: '⏱️', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  INFO:        { icon: 'ℹ️', color: '#6b7280', bg: 'rgba(107,114,128,0.08)' },
};

const SOURCE_BADGE = {
  HN:      { label: 'Hacker News', bg: '#ff6600', text: '#fff' },
  GITHUB:  { label: 'GitHub',      bg: '#24292e', text: '#fff' },
  NEWSAPI: { label: 'News',        bg: '#1d4ed8', text: '#fff' },
  YOUTUBE: { label: 'YouTube',     bg: '#dc2626', text: '#fff' },
};

const LOADING_STEPS = [
  { icon: '🔍', text: 'Scanning Hacker News discussions...' },
  { icon: '📺', text: 'Analyzing YouTube content landscape...' },
  { icon: '📰', text: 'Pulling news articles and funding signals...' },
  { icon: '💻', text: 'Mapping GitHub ecosystem and competitors...' },
  { icon: '📊', text: 'Computing intelligence scores...' },
];

function ScoreRing({ score, label, color, size = 110 }) {
  const r = size / 2 - 10;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: size > 100 ? 22 : 18, fontWeight: 700, color: '#111' }}>{score}</span>
          <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>/100</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-gray-600 text-center leading-tight max-w-[90px]">{label}</span>
    </div>
  );
}

function SourceBadge({ source }) {
  const s = SOURCE_BADGE[source] || { label: source, bg: '#6b7280', text: '#fff' };
  return (
    <span style={{ background: s.bg, color: s.text }}
      className="text-xs font-bold px-2 py-0.5 rounded-full">
      {s.label}
    </span>
  );
}

export default function StartupValidatorPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    ventureName: '', description: '', industry: '', stage: '', ventureId: null,
  });
  const [loading, setLoading]       = useState(false);
  const [loadStep, setLoadStep]     = useState(0);
  const [result, setResult]         = useState(null);
  const [history, setHistory]       = useState([]);
  const [error, setError]           = useState('');
  const [activeTab, setActiveTab]   = useState('overview');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    insightsAPI.validationHistory()
      .then(r => setHistory(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});

    if (location.state?.venture) {
      const v = location.state.venture;
      setForm({
        ventureName: v.brandDetails?.brandName || '',
        description: v.brandDetails?.description || '',
        industry: v.brandDetails?.industry || '',
        stage: v.stage || '',
        ventureId: v.id,
      });
    }
  }, []);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadStep(prev => (prev + 1) % LOADING_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ventureName.trim()) { setError('Venture name is required'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    setLoadStep(0);
    try {
      const { data } = await insightsAPI.validate(form);
      setResult(data);
      setHistory(prev => [data, ...prev.filter(h => h.id !== data.id)]);
    } catch (err) {
      setError('Validation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseJson = (str) => {
    try { return JSON.parse(str); } catch { return []; }
  };

  const trendData = result ? parseJson(result.trendDataJson) : [];
  const competitors = result ? parseJson(result.competitorListJson) : [];
  const fundingSignals = result ? parseJson(result.fundingSignalsJson) : [];
  const communityHighlights = result ? parseJson(result.communityHighlightsJson) : [];
  const insights = result ? parseJson(result.actionableInsightsJson) : [];

  const verdictStyle = result ? (VERDICT_STYLE[result.verdictLevel] || VERDICT_STYLE.MODERATE) : null;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button className="text-sm text-gray-400 hover:text-gray-600" onClick={() => navigate('/insights')}>
                Insights
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-sm text-gray-600 font-medium">Startup Validator</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-gray-900 m-0">🔬 Startup Validator</h1>
            <p className="text-gray-500 text-sm mt-1">Live market intelligence from GitHub · Hacker News · NewsAPI · YouTube</p>
          </div>
          {history.length > 0 && (
            <button className="btn-glow btn-glow-sm text-sm" onClick={() => setShowHistory(v => !v)}>
              {showHistory ? 'Hide' : 'History'} ({history.length})
            </button>
          )}
        </div>

        {/* History panel */}
        {showHistory && history.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 text-sm font-semibold text-gray-700">
              Previous Validations
            </div>
            {history.map(h => (
              <div
                key={h.id}
                className="flex items-center justify-between px-5 py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
                onClick={() => { setResult(h); setShowHistory(false); }}
              >
                <div>
                  <span className="font-medium text-sm text-gray-900">{h.ventureName}</span>
                  <span className="text-gray-400 text-xs ml-2">{h.industry}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{h.overallScore}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: VERDICT_STYLE[h.verdictLevel]?.badge + '22', color: VERDICT_STYLE[h.verdictLevel]?.badge }}>
                    {h.verdictLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Venture Name *</label>
                <input
                  type="text"
                  value={form.ventureName}
                  onChange={e => setForm(f => ({ ...f, ventureName: e.target.value }))}
                  placeholder="e.g. PayFlow, HealthAI, EduSync"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe what your startup does and the problem it solves..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry</label>
                <select
                  value={form.industry}
                  onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 bg-white"
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map(i => (
                    <option key={i} value={i}>{i.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stage</label>
                <select
                  value={form.stage}
                  onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 bg-white"
                >
                  <option value="">Select stage</option>
                  {STAGES.map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-glow py-3 font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : '⚡ Run Intelligence Analysis'}
            </button>
          </form>
        </div>

        {/* Loading animation */}
        {loading && (
          <div className="bg-white rounded-2xl border border-indigo-200 p-8 mb-6 text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                  {LOADING_STEPS[loadStep].icon}
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-base">{LOADING_STEPS[loadStep].text}</p>
                <p className="text-gray-400 text-sm mt-1">Querying live data sources in parallel...</p>
              </div>
              <div className="flex gap-1.5">
                {LOADING_STEPS.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === loadStep ? 'bg-indigo-500 scale-125' : 'bg-gray-200'}`} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-6">

            {/* Verdict Banner */}
            <div
              className="rounded-2xl p-6 border"
              style={{
                background: verdictStyle.bg,
                borderColor: verdictStyle.border,
              }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black"
                      style={{ background: verdictStyle.badge, color: '#fff' }}>
                      {result.verdictLevel}
                    </span>
                    <span className="text-white/60 text-sm">{result.ventureName}</span>
                  </div>
                  <h2 className="text-lg font-bold mb-0.5" style={{ color: verdictStyle.text }}>
                    {result.verdictLabel}
                  </h2>
                  <p className="text-sm opacity-70 mt-1" style={{ color: verdictStyle.text }}>
                    {result.industry?.replace(/_/g, ' ')} · {result.stage?.replace(/_/g, ' ')} · Analyzed {new Date(result.analyzedAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black" style={{ color: verdictStyle.text }}>
                    {result.overallScore}
                  </div>
                  <div className="text-xs opacity-60 font-semibold mt-1" style={{ color: verdictStyle.text }}>
                    OVERALL SCORE
                  </div>
                </div>
              </div>
            </div>

            {/* Score Rings */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-6 text-base">Intelligence Breakdown</h3>
              <div className="flex justify-around flex-wrap gap-6">
                <ScoreRing score={result.marketTimingScore}     label="Market Timing"      color="#6366f1" />
                <ScoreRing score={result.communityDemandScore}  label="Community Demand"   color="#8b5cf6" />
                <ScoreRing score={result.builderActivityScore}  label="Builder Activity"   color="#06b6d4" />
                <ScoreRing score={result.investorInterestScore} label="Investor Interest"  color="#f59e0b" />
                <ScoreRing score={result.uniquenessScore}       label="Uniqueness"         color="#10b981" size={100} />
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {[
                  { key: 'overview',   label: '📊 Overview' },
                  { key: 'competitors', label: '💻 Competitors' },
                  { key: 'funding',    label: '💰 Funding' },
                  { key: 'community',  label: '🧵 Community' },
                  { key: 'insights',   label: '💡 Insights' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                      activeTab === tab.key
                        ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Market Momentum Chart */}
                    {trendData.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 text-sm">Market Momentum — News Coverage (12 months)</h4>
                        <div style={{ height: 180 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData} barSize={20}>
                              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                              <YAxis hide />
                              <Tooltip
                                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, color: '#f9fafb', fontSize: 12 }}
                                cursor={{ fill: 'rgba(99,102,241,0.08)' }}
                              />
                              <Bar dataKey="articles" radius={[4, 4, 0, 0]}>
                                {trendData.map((entry, i) => (
                                  <Cell key={i} fill={entry.articles > 5 ? '#6366f1' : '#c7d2fe'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Source Summary */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-sm">Source Intelligence Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { source: 'HN', label: 'Hacker News', stats: [
                            { label: 'Stories found', value: result.hnStoriesFound },
                            { label: 'Avg points', value: result.hnAvgPoints },
                            { label: 'Ask HN posts', value: result.hnAskCount },
                          ]},
                          { source: 'YOUTUBE', label: 'YouTube', stats: [
                            { label: 'Videos returned', value: result.ytVideosFound },
                            { label: 'Total in space', value: (result.ytTotalResults || 0).toLocaleString() },
                          ]},
                          { source: 'NEWSAPI', label: 'News', stats: [
                            { label: 'Articles found', value: result.newsArticlesFound },
                            { label: 'Funding mentions', value: result.newsFundingMentions },
                          ]},
                          { source: 'GITHUB', label: 'GitHub', stats: [
                            { label: 'Repos found', value: result.ghReposFound },
                            { label: 'Active repos', value: result.ghActiveRepos },
                            { label: 'Total stars', value: (result.ghTotalStars || 0).toLocaleString() },
                          ]},
                        ].map(s => (
                          <div key={s.source} className="bg-gray-50 rounded-xl p-4">
                            <div className="mb-3"><SourceBadge source={s.source} /></div>
                            {s.stats.map(stat => (
                              <div key={stat.label} className="flex justify-between items-center py-1">
                                <span className="text-xs text-gray-500">{stat.label}</span>
                                <span className="text-xs font-bold text-gray-900">{stat.value}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Competitors Tab */}
                {activeTab === 'competitors' && (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">
                      GitHub repositories in your space — {result.ghReposFound} total found, {result.ghActiveRepos} active in last 90 days.
                    </p>
                    {competitors.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">No competing repositories found — space may be genuinely novel.</div>
                    ) : (
                      <div className="space-y-3">
                        {competitors.map((repo, i) => (
                          <div key={i} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <a href={repo.url} target="_blank" rel="noopener noreferrer"
                                  className="font-semibold text-sm text-gray-900 hover:text-indigo-600 transition-colors">
                                  {repo.fullName || repo.name}
                                </a>
                                {repo.active && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                                )}
                                {repo.language && (
                                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{repo.language}</span>
                                )}
                              </div>
                              {repo.description && (
                                <p className="text-xs text-gray-500 line-clamp-2">{repo.description}</p>
                              )}
                              {repo.topics?.length > 0 && (
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {repo.topics.slice(0, 5).map(t => (
                                    <span key={t} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{t}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1 ml-4 shrink-0">
                              <div className="flex items-center gap-1 text-amber-500">
                                <span className="text-xs">⭐</span>
                                <span className="text-sm font-bold">{(repo.stars || 0).toLocaleString()}</span>
                              </div>
                              <div className="text-xs text-gray-400">
                                🍴 {(repo.forks || 0).toLocaleString()}
                              </div>
                              {repo.openIssues > 0 && (
                                <div className="text-xs text-orange-500">
                                  {repo.openIssues} open issues
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Funding Tab */}
                {activeTab === 'funding' && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl font-black text-amber-500">{result.newsFundingMentions}</div>
                      <p className="text-sm text-gray-500">funding events detected in this space</p>
                    </div>
                    {fundingSignals.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">No funding activity found — this may be a bootstrappable market.</div>
                    ) : (
                      <div className="space-y-3">
                        {fundingSignals.map((signal, i) => (
                          <div key={i} className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                            <a href={signal.url} target="_blank" rel="noopener noreferrer"
                              className="font-semibold text-sm text-gray-900 hover:text-amber-700 transition-colors leading-snug block mb-1">
                              {signal.title}
                            </a>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="font-medium text-gray-700">{signal.source}</span>
                              <span>·</span>
                              <span>{signal.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Community Tab */}
                {activeTab === 'community' && (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">
                      {result.hnStoriesFound} Hacker News stories found · {result.hnAskCount} Ask HN posts (direct user demand signal)
                    </p>
                    {communityHighlights.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">No HN discussions found — consider whether the problem is recognized by builders.</div>
                    ) : (
                      <div className="space-y-3">
                        {communityHighlights.map((post, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                            <div className="flex flex-col items-center bg-white rounded-lg px-3 py-2 min-w-[48px] border border-orange-200">
                              <span className="text-sm font-black text-orange-600">{post.points}</span>
                              <span className="text-xs text-gray-400">pts</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <a href={post.url} target="_blank" rel="noopener noreferrer"
                                className="font-semibold text-sm text-gray-900 hover:text-orange-700 transition-colors block">
                                {post.title}
                              </a>
                              {post.isAsk && (
                                <span className="text-xs bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full mt-1 inline-block font-medium">
                                  Ask HN
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Insights Tab */}
                {activeTab === 'insights' && (
                  <div className="space-y-4">
                    {insights.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">No specific insights generated.</div>
                    ) : (
                      insights.map((insight, i) => {
                        const style = INSIGHT_STYLE[insight.type] || INSIGHT_STYLE.INFO;
                        return (
                          <div key={i} className="flex gap-4 p-4 rounded-xl border"
                            style={{ background: style.bg, borderColor: style.color + '33' }}>
                            <span className="text-xl shrink-0 mt-0.5">{style.icon}</span>
                            <div>
                              <span className="text-xs font-black uppercase mb-1 block"
                                style={{ color: style.color }}>
                                {insight.type}
                              </span>
                              <p className="text-sm text-gray-700 leading-relaxed">{insight.message}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>
        )}
      </div>
    </AppLayout>
  );
}
