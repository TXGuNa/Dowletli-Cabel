// Admin sign-in screen (credentials are checked by the server).

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import type { Lang } from '../content/detectLanguage';
import { adminT, type AdminKey } from '../content/adminStrings';
import { ApiError, login } from '../content/api';

// ---- Login -----------------------------------------------------------------

export default function Login({
  onOk, notice, uiLang, setUiLang,
}: { onOk: () => void; notice?: AdminKey | null; uiLang: Lang; setUiLang: (l: Lang) => void }) {
  const tr = adminT(uiLang);
  const [user, setUser] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState<AdminKey | null>(null);
  const [checking, setChecking] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    try {
      await login(user, pw);
      onOk();
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 0;
      setError(
        status === 401 ? 'wrongCreds'
          : status === 429 ? 'tooManyAttempts'
            : status === 503 ? 'notConfigured'
              : 'serverUnreachable',
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora" />
      <div className="absolute top-10 left-1/4 w-[420px] h-[420px] bg-brand-primary/20 rounded-full blur-[130px] animate-drift-slow" />
      <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-brand-cyan/20 rounded-full blur-[130px] animate-drift" />
      <form
        onSubmit={submit}
        className="relative glass-strong rounded-3xl p-8 w-full max-w-sm"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-cyan flex items-center justify-center text-white mx-auto mb-5 shadow-soft">
          <Lock size={24} />
        </div>
        <h1 className="text-2xl font-extrabold text-brand-ink text-center mb-1">{tr('loginTitle')}</h1>
        <p className="text-brand-slate text-sm text-center mb-6">{tr('loginSubtitle')}</p>
        {notice && !error && (
          <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-sm mb-4">{tr(notice)}</p>
        )}

        <label className="block text-xs font-medium text-brand-slate mb-1.5">{tr('username')}</label>
        <input
          type="text"
          value={user}
          autoFocus
          autoComplete="username"
          placeholder="admin"
          onChange={(e) => { setUser(e.target.value); setError(null); }}
          className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-ink focus:border-brand-ink focus:outline-none mb-4"
        />

        <label className="block text-xs font-medium text-brand-slate mb-1.5">{tr('password')}</label>
        <input
          type="password"
          value={pw}
          autoComplete="current-password"
          placeholder="••••••••"
          onChange={(e) => { setPw(e.target.value); setError(null); }}
          className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-ink focus:border-brand-ink focus:outline-none mb-3"
        />

        {error && <p className="text-red-500 text-sm mb-3">{tr(error)}</p>}
        <button type="submit" disabled={checking} className="btn-primary w-full disabled:opacity-60">
          {checking ? tr('checking') : tr('signIn')}
        </button>
        <div className="flex justify-center gap-1 mt-5">
          {(['en', 'ru', 'tkm'] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setUiLang(l)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${uiLang === l ? 'bg-brand-ink text-white' : 'text-brand-slate hover:text-brand-ink'}`}
            >
              {l === 'tkm' ? 'TM' : l.toUpperCase()}
            </button>
          ))}
        </div>
        <Link to="/" className="block text-center text-sm text-brand-slate hover:text-brand-ink mt-3">
          {tr('backToSite')}
        </Link>
      </form>
    </div>
  );
}

