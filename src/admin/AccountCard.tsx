// Change the admin username / password (stored hashed on the server).

import { useState } from 'react';
import { Check, Lock } from 'lucide-react';
import { ApiError, changeAccount, getAdminUsername } from '../content/api';
import { Card } from './ui';
import type { Tr } from './types';

// ---- Admin login (username/password) editor --------------------------------

export default function AccountCard({ tr, onAuthError }: { tr: Tr; onAuthError: () => void }) {
  const [username, setUsername] = useState(() => getAdminUsername());
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err' | 'fail'>('idle');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!username.trim() || password.length < 8) {
      setStatus('err');
      return;
    }
    setBusy(true);
    try {
      await changeAccount(username.trim(), password);
      setPassword('');
      setStatus('ok');
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) onAuthError();
      else setStatus(e instanceof ApiError && e.status === 400 ? 'err' : 'fail');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title={tr('adminLogin')} subtitle={tr('adminLoginHint')} icon={<Lock size={17} />}>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-brand-ink mb-1.5">{tr('newUsername')}</label>
          <input
            value={username}
            autoComplete="username"
            onChange={(e) => { setUsername(e.target.value); setStatus('idle'); }}
            className="w-full bg-white border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-ink focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-brand-ink mb-1.5">{tr('newPassword')}</label>
          <input
            type="password"
            value={password}
            autoComplete="new-password"
            placeholder="••••••••"
            onChange={(e) => { setPassword(e.target.value); setStatus('idle'); }}
            className="w-full bg-white border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-ink focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none"
          />
        </div>
      </div>

      {status === 'ok' && (
        <p className="text-sm text-green-600 mt-3 flex items-center gap-1.5"><Check size={15} /> {tr('loginUpdated')}</p>
      )}
      {status === 'err' && (
        <p className="text-sm text-red-500 mt-3">{tr('loginInvalid')}</p>
      )}
      {status === 'fail' && (
        <p className="text-sm text-red-500 mt-3">{tr('accountFailed')}</p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="btn-primary !px-5 !py-2.5 text-sm mt-4 disabled:opacity-60"
      >
        <Lock size={15} /> {tr('updateLogin')}
      </button>
    </Card>
  );
}

