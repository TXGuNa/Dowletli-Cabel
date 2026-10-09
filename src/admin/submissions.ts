// Server-backed list of form submissions for the admin panel.

import { useEffect, useState } from 'react';
import { ApiError } from '../content/api';
import {
  type Submission, loadSubmissions, markRead, deleteSubmission, clearSubmissions,
} from '../content/submissionsStore';

// Submissions live on the server; this hook loads them and applies changes
// optimistically (the list updates at once, the server call follows).
export function useServerSubmissions(enabled: boolean, onAuthError: () => void) {
  const [items, setItems] = useState<Submission[]>([]);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');

  const run = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) onAuthError();
      else refresh();
    }
  };

  const refresh = async () => {
    setState('loading');
    try {
      setItems(await loadSubmissions());
      setState('idle');
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) onAuthError();
      setState('error');
    }
  };

  useEffect(() => {
    if (enabled) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return {
    items,
    state,
    refresh,
    setRead: (id: string, read: boolean) => {
      setItems((list) => list.map((s) => (s.id === id ? { ...s, read } : s)));
      run(() => markRead(id, read));
    },
    remove: (id: string) => {
      setItems((list) => list.filter((s) => s.id !== id));
      run(() => deleteSubmission(id));
    },
    clearAll: () => {
      setItems([]);
      run(() => clearSubmissions());
    },
  };
}

export type SubmissionsApi = ReturnType<typeof useServerSubmissions>;

export function formatDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

