// Requests inbox: contact messages and consultation bookings from visitors.

import { useState } from 'react';
import { CalendarClock, CloudOff, Download, Inbox, Loader2, Mail, RefreshCw, Trash2 } from 'lucide-react';
import { formatDate, type SubmissionsApi } from './submissions';
import type { Tr } from './types';

// ---- Requests inbox -------------------------------------------------------

export default function RequestsView({ serviceLabel, tr, subs }: { serviceLabel: (id: string) => string; tr: Tr; subs: SubmissionsApi }) {
  const { items } = subs;
  const [filter, setFilter] = useState<'all' | 'contact' | 'booking'>('all');

  const filtered = items.filter((s) => filter === 'all' || s.type === filter);
  const counts = {
    all: items.length,
    contact: items.filter((s) => s.type === 'contact').length,
    booking: items.filter((s) => s.type === 'booking').length,
  };

  const exportCsv = () => {
    const rows = [['type', 'date', 'name', 'email', 'detail']];
    for (const s of items) {
      const detail = s.type === 'contact' ? s.message : `${serviceLabel(s.service)} · ${s.date} ${s.time}`;
      rows.push([s.type, new Date(s.createdAt).toISOString(), s.name, s.email, detail]);
    }
    // Cells starting with = + - @ would run as formulas in Excel -> prefix with '.
    const cell = (c: string) => {
      const v = /^[=+\-@\t\r]/.test(c) ? `'${c}` : c;
      return `"${v.replace(/"/g, '""')}"`;
    };
    const csv = rows.map((r) => r.map((c) => cell(String(c ?? ''))).join(',')).join('\r\n');
    // UTF-8 BOM so Excel shows Russian / Türkmen letters correctly.
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dowletli-requests.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: 'all' | 'contact' | 'booking'; label: string; n: number }[] = [
    { id: 'all', label: tr('fAll'), n: counts.all },
    { id: 'contact', label: tr('fMessages'), n: counts.contact },
    { id: 'booking', label: tr('fBookings'), n: counts.booking },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-7">
        <div className="flex gap-1 bg-white border border-brand-border rounded-xl p-1">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setFilter(tb.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                filter === tb.id ? 'bg-brand-ink text-white' : 'text-brand-text hover:text-brand-ink'
              }`}
            >
              {tb.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tb.id ? 'bg-white/20' : 'bg-brand-soft text-brand-slate'}`}>
                {tb.n}
              </span>
            </button>
          ))}
        </div>
        <div className="sm:ml-auto flex gap-2">
          <button onClick={() => subs.refresh()} disabled={subs.state === 'loading'} className="btn-ghost !px-4 !py-2 text-sm disabled:opacity-50">
            <RefreshCw size={16} className={subs.state === 'loading' ? 'animate-spin' : ''} /> {tr('refresh')}
          </button>
          <button onClick={exportCsv} disabled={!items.length} className="btn-ghost !px-4 !py-2 text-sm disabled:opacity-50">
            <Download size={16} /> {tr('csv')}
          </button>
          <button
            onClick={() => { if (confirm(tr('confirmClearRequests'))) subs.clearAll(); }}
            disabled={!items.length}
            className="btn-ghost !px-4 !py-2 text-sm disabled:opacity-50"
          >
            <Trash2 size={16} /> {tr('clear')}
          </button>
        </div>
      </div>

      {subs.state === 'error' && (
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl">
          <CloudOff size={15} /> {tr('requestsLoadFailed')}
        </div>
      )}

      {filtered.length === 0 && subs.state === 'loading' ? (
        <div className="flex justify-center py-24 text-brand-slate">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-brand-border rounded-2xl">
          <Inbox size={36} className="mx-auto text-brand-slate mb-4" strokeWidth={1.4} />
          <p className="text-brand-ink font-semibold">{tr('noRequests')}</p>
          <p className="text-brand-slate text-sm mt-1 max-w-sm mx-auto">
            {tr('noRequestsBody')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className={`bg-white border rounded-2xl p-5 transition-colors ${
                s.read ? 'border-brand-border' : 'border-brand-ink/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  s.type === 'contact' ? 'bg-brand-soft text-brand-ink' : 'bg-brand-ink text-white'
                }`}>
                  {s.type === 'contact' ? <Mail size={18} /> : <CalendarClock size={18} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-brand-ink">{s.name || '—'}</span>
                    {!s.read && <span className="w-2 h-2 rounded-full bg-brand-primary" title="Unread" />}
                    <span className="text-xs text-brand-slate ml-auto">{formatDate(s.createdAt)}</span>
                  </div>
                  <a href={`mailto:${s.email}`} className="text-sm text-brand-primary hover:underline break-all">
                    {s.email || '—'}
                  </a>

                  {s.type === 'contact' ? (
                    <p className="text-brand-text mt-2 whitespace-pre-wrap">{s.message}</p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                      <span className="px-2.5 py-1 rounded-lg bg-brand-soft text-brand-ink font-medium">{serviceLabel(s.service)}</span>
                      <span className="px-2.5 py-1 rounded-lg bg-brand-soft text-brand-ink font-medium">{s.date}</span>
                      <span className="px-2.5 py-1 rounded-lg bg-brand-soft text-brand-ink font-medium">{s.time}</span>
                    </div>
                  )}

                  <div className="flex gap-4 mt-3 text-sm">
                    <button onClick={() => subs.setRead(s.id, !s.read)} className="text-brand-slate hover:text-brand-ink font-medium">
                      {s.read ? tr('markUnread') : tr('markRead')}
                    </button>
                    <button onClick={() => subs.remove(s.id)} className="text-brand-slate hover:text-red-500 font-medium">
                      {tr('delete')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

