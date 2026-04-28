import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { insightsAPI } from '../api/services';

const INDUSTRIES = [
  'Technology', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce',
  'SaaS', 'AI/ML', 'Blockchain/Web3', 'CleanTech', 'BioTech',
  'AgriTech', 'LegalTech', 'PropTech', 'InsurTech', 'SpaceTech',
  'Cybersecurity', 'Other',
];

const EMPTY_FORM = {
  name: '',
  keywords: [],
  industries: [],
  competitorNames: [],
  frequency: 'DAILY',
};

function TagInput({ label, placeholder, tags, onChange }) {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput('');
  };

  const remove = tag => onChange(tags.filter(t => t !== tag));

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5 p-2.5 border border-gray-200 rounded-xl bg-white min-h-[44px] focus-within:ring-2 focus-within:ring-indigo-300 focus-within:border-indigo-300">
        {tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="text-indigo-400 hover:text-indigo-700 leading-none"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
            if (e.key === 'Backspace' && !input && tags.length) remove(tags[tags.length - 1]);
          }}
          placeholder={tags.length ? '' : placeholder}
          className="flex-1 min-w-[120px] text-sm outline-none bg-transparent placeholder-gray-400"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add</p>
    </div>
  );
}

function IndustrySelect({ selected, onChange }) {
  const toggle = ind => onChange(
    selected.includes(ind) ? selected.filter(i => i !== ind) : [...selected, ind]
  );

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industries</label>
      <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-indigo-300 min-h-[52px]">
        {INDUSTRIES.map(ind => (
          <button
            key={ind}
            type="button"
            onClick={() => toggle(ind)}
            className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all ${
              selected.includes(ind)
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {ind}
          </button>
        ))}
      </div>
    </div>
  );
}

function SubscriptionCard({ sub, onToggle, onDelete, onTrigger, onEdit }) {
  const [triggering, setTriggering] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  const keywords = parseJsonField(sub.keywordsJson) || [];
  const industries = parseJsonField(sub.industriesJson) || [];
  const competitors = parseJsonField(sub.competitorNamesJson) || [];

  const handleTrigger = () => {
    setTriggering(true);
    onTrigger(sub.id).finally(() => setTriggering(false));
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete subscription "${sub.name}"?`)) return;
    setDeleting(true);
    onDelete(sub.id);
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 p-6 ${sub.active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900 truncate">{sub.name}</h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              sub.frequency === 'DAILY'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {sub.frequency}
            </span>
            {!sub.active && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Paused</span>
            )}
          </div>
          {sub.lastTriggeredAt && (
            <p className="text-xs text-gray-400">
              Last run: {new Date(sub.lastTriggeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>

        {/* Toggle switch */}
        <button
          onClick={() => onToggle(sub.id)}
          className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${sub.active ? 'bg-indigo-600' : 'bg-gray-200'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${sub.active ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      {/* Tags preview */}
      <div className="space-y-2 mb-4">
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-gray-400 self-center w-20 flex-shrink-0">Keywords</span>
            {keywords.slice(0, 5).map(k => (
              <span key={k} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{k}</span>
            ))}
            {keywords.length > 5 && <span className="text-xs text-gray-400">+{keywords.length - 5}</span>}
          </div>
        )}
        {industries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-gray-400 self-center w-20 flex-shrink-0">Industries</span>
            {industries.slice(0, 3).map(ind => (
              <span key={ind} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">{ind}</span>
            ))}
            {industries.length > 3 && <span className="text-xs text-gray-400">+{industries.length - 3}</span>}
          </div>
        )}
        {competitors.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-gray-400 self-center w-20 flex-shrink-0">Competitors</span>
            {competitors.slice(0, 4).map(c => (
              <span key={c} className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">{c}</span>
            ))}
            {competitors.length > 4 && <span className="text-xs text-gray-400">+{competitors.length - 4}</span>}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={handleTrigger}
          disabled={triggering || !sub.active}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {triggering ? (
            <><span className="animate-spin">⟳</span> Running…</>
          ) : (
            <><span>▶</span> Run now</>
          )}
        </button>
        <button
          onClick={() => onEdit(sub)}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <span>✎</span> Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors ml-auto disabled:opacity-40"
        >
          {deleting ? '…' : <><span>🗑</span> Delete</>}
        </button>
      </div>
    </div>
  );
}

function parseJsonField(jsonStr) {
  if (!jsonStr) return [];
  try { return JSON.parse(jsonStr); } catch { return []; }
}

function SubscriptionForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      name: form.name.trim(),
      keywordsJson: JSON.stringify(form.keywords),
      industriesJson: JSON.stringify(form.industries),
      competitorNamesJson: JSON.stringify(form.competitorNames),
      frequency: form.frequency,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subscription Name *</label>
        <input
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="e.g. AI Tools Watch, FinTech Competitors"
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      {/* Keywords */}
      <TagInput
        label="Keywords"
        placeholder="generative AI, LLM, autonomous agents…"
        tags={form.keywords}
        onChange={v => set('keywords', v)}
      />

      {/* Industries */}
      <IndustrySelect selected={form.industries} onChange={v => set('industries', v)} />

      {/* Competitors */}
      <TagInput
        label="Competitor Names"
        placeholder="OpenAI, Notion, Linear…"
        tags={form.competitorNames}
        onChange={v => set('competitorNames', v)}
      />

      {/* Frequency */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Digest Frequency</label>
        <div className="flex gap-3">
          {['DAILY', 'WEEKLY'].map(freq => (
            <button
              key={freq}
              type="button"
              onClick={() => set('frequency', freq)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                form.frequency === freq
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}
            >
              {freq === 'DAILY' ? '⚡ Daily (8 AM)' : '📅 Weekly (Mon 8 AM)'}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || !form.name.trim()}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm"
        >
          {saving ? 'Saving…' : initial ? 'Save Changes' : 'Create Subscription'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function NewsSubscriptionsPage() {
  const navigate = useNavigate();
  const [subs, setSubs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null);

  useEffect(() => {
    insightsAPI.getSubscriptions()
      .then(r => setSubs(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = data => {
    setSaving(true);
    insightsAPI.createSubscription(data)
      .then(r => {
        setSubs(prev => [r.data, ...prev]);
        setShowForm(false);
        showToast('Subscription created!');
      })
      .catch(() => showToast('Failed to create subscription', 'error'))
      .finally(() => setSaving(false));
  };

  const handleUpdate = data => {
    setSaving(true);
    insightsAPI.updateSubscription(editing.id, data)
      .then(r => {
        setSubs(prev => prev.map(s => s.id === editing.id ? r.data : s));
        setEditing(null);
        showToast('Subscription updated!');
      })
      .catch(() => showToast('Failed to update', 'error'))
      .finally(() => setSaving(false));
  };

  const handleToggle = id => {
    insightsAPI.toggleSubscription(id)
      .then(r => setSubs(prev => prev.map(s => s.id === id ? r.data : s)))
      .catch(() => showToast('Toggle failed', 'error'));
  };

  const handleDelete = id => {
    insightsAPI.deleteSubscription(id)
      .then(() => {
        setSubs(prev => prev.filter(s => s.id !== id));
        showToast('Deleted');
      })
      .catch(() => showToast('Delete failed', 'error'));
  };

  const handleTrigger = id => {
    return insightsAPI.triggerSubscription(id)
      .then(() => showToast('Digest triggered! Check the feed shortly.'))
      .catch(() => showToast('Trigger failed', 'error'));
  };

  const editInitial = editing ? {
    name: editing.name,
    keywords: parseJsonField(editing.keywordsJson),
    industries: parseJsonField(editing.industriesJson),
    competitorNames: parseJsonField(editing.competitorNamesJson),
    frequency: editing.frequency,
  } : null;

  const active   = subs.filter(s => s.active);
  const inactive = subs.filter(s => !s.active);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
          }`}>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/insights/news')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back to Feed
            </button>
            <span className="text-gray-300">|</span>
            <span className="text-2xl">⚙</span>
            <h1 className="font-display text-2xl font-bold text-gray-900">Subscriptions</h1>
          </div>
          <p className="text-gray-500 text-sm max-w-xl">
            Configure intelligence feeds — define keywords, industries, and competitor names to track. Digests are aggregated from Hacker News, NewsAPI, YouTube, and GitHub.
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total',    value: subs.length,   color: 'text-gray-900' },
            { label: 'Active',   value: active.length,  color: 'text-indigo-600' },
            { label: 'Paused',   value: inactive.length, color: 'text-gray-400' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Create / Edit form */}
        {(showForm || editing) && (
          <div className="bg-white rounded-2xl border border-indigo-200 shadow-lg p-6 mb-6">
            <h2 className="font-bold text-gray-900 text-base mb-5">
              {editing ? 'Edit Subscription' : 'New Subscription'}
            </h2>
            <SubscriptionForm
              initial={editInitial}
              onSave={editing ? handleUpdate : handleCreate}
              onCancel={() => { setShowForm(false); setEditing(null); }}
              saving={saving}
            />
          </div>
        )}

        {/* Add button */}
        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-indigo-300 text-gray-500 hover:text-indigo-600 rounded-2xl py-4 text-sm font-semibold transition-all mb-6"
          >
            <span className="text-lg">+</span> New Subscription
          </button>
        )}

        {/* List */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 h-40" />
            ))}
          </div>
        ) : subs.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <div className="text-5xl mb-4">📡</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">No subscriptions yet</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Create your first intelligence feed to start tracking markets, competitors, and funding activity.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-glow btn-glow-sm"
            >
              Create first subscription →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {active.length > 0 && (
              <>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Active ({active.length})</h3>
                {active.map(s => (
                  <SubscriptionCard
                    key={s.id}
                    sub={s}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onTrigger={handleTrigger}
                    onEdit={sub => { setEditing(sub); setShowForm(false); }}
                  />
                ))}
              </>
            )}
            {inactive.length > 0 && (
              <>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mt-4">Paused ({inactive.length})</h3>
                {inactive.map(s => (
                  <SubscriptionCard
                    key={s.id}
                    sub={s}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onTrigger={handleTrigger}
                    onEdit={sub => { setEditing(sub); setShowForm(false); }}
                  />
                ))}
              </>
            )}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
