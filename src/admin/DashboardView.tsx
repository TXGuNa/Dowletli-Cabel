// Dashboard: site status at a glance + quick actions.

import { ArrowRight, Boxes, CalendarClock, CheckCircle2, CircleDot, Home, Images, Inbox, Languages, Mail, Palette, AlertTriangle } from 'lucide-react';
import { resolveTheme } from '../content/themes';
import type { Submission } from '../content/submissionsStore';
import { Card, Pill } from './ui';
import { formatDate } from './submissions';
import type { Draft, Tr, View } from './types';

export default function DashboardView({
  draft, tr, status, lastPublished, submissions, serviceLabel, go, openPage,
}: {
  draft: Draft;
  tr: Tr;
  status: 'live' | 'dirty' | 'never';
  lastPublished: number;
  submissions: Submission[];
  serviceLabel: (id: string) => string;
  go: (v: View) => void;
  openPage: (id: string) => void;
}) {
  const theme = resolveTheme(draft.settings.theme);
  const unread = submissions.filter((s) => !s.read).length;
  const p = theme.palette;

  const statusUi = {
    live: { icon: <CheckCircle2 size={18} className="text-emerald-600" />, text: tr('statusPublished'), tone: 'text-emerald-700' },
    dirty: { icon: <CircleDot size={18} className="text-amber-500" />, text: tr('statusUnsaved'), tone: 'text-amber-700' },
    never: { icon: <AlertTriangle size={18} className="text-amber-500" />, text: tr('statusNever'), tone: 'text-amber-700' },
  }[status];

  const actions: { label: string; icon: React.ReactNode; onClick: () => void }[] = [
    { label: tr('actEditHome'), icon: <Home size={18} />, onClick: () => openPage('home') },
    { label: tr('addProduct'), icon: <Boxes size={18} />, onClick: () => go('products') },
    { label: tr('actChangeTheme'), icon: <Palette size={18} />, onClick: () => go('theme') },
    { label: tr('actViewRequests'), icon: <Inbox size={18} />, onClick: () => go('requests') },
  ];

  return (
    <div className="grid gap-5">
      <div className="rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-brand-ink via-[#14213d] to-[#1e3a8a] text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-brand-cyan/20 blur-3xl" />
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{tr('welcome')} 👋</h2>
          <p className="text-white/75 mt-2 max-w-2xl">{tr('dashboardIntro')}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-slate">{tr('cardSiteStatus')}</div>
          <div className={`mt-3 flex items-center gap-2 font-bold ${statusUi.tone}`} data-testid="dash-status">
            {statusUi.icon} {statusUi.text}
          </div>
          {lastPublished > 0 && (
            <div className="text-xs text-brand-slate mt-2">{tr('lastPublished')}: {formatDate(lastPublished)}</div>
          )}
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-slate">{tr('cardTheme')}</div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex -space-x-1.5">
              {[p.primary, p.cyan, p.ink, p.bg].map((c, i) => (
                <span key={i} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ background: c }} />
              ))}
            </div>
            <span className="font-bold text-brand-ink" data-testid="dash-theme">{theme.def.name}</span>
          </div>
          <button type="button" onClick={() => go('theme')} className="text-xs font-semibold text-brand-primary mt-3 inline-flex items-center gap-1 hover:underline">
            {tr('actChangeTheme')} <ArrowRight size={13} />
          </button>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-slate">{tr('cardRequests')}</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-ink">{unread}</span>
            <span className="text-sm text-brand-slate">{tr('unreadCount')}</span>
          </div>
          <button type="button" onClick={() => go('requests')} className="text-xs font-semibold text-brand-primary mt-2 inline-flex items-center gap-1 hover:underline">
            {tr('actViewRequests')} <ArrowRight size={13} />
          </button>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-slate">{tr('cardContent')}</div>
          <ul className="mt-3 space-y-1.5 text-sm text-brand-text">
            <li className="flex items-center gap-2"><Boxes size={15} className="text-brand-primary" /> <b className="text-brand-ink">{draft.products.length}</b> {tr('productsCount')}</li>
            <li className="flex items-center gap-2"><Images size={15} className="text-brand-primary" /> <b className="text-brand-ink">{draft.gallery.filter((g) => g.image).length}</b> {tr('photosCount')}</li>
            <li className="flex items-center gap-2"><Languages size={15} className="text-brand-primary" /> <b className="text-brand-ink">3</b> {tr('languagesCount')} · EN · RU · TM</li>
          </ul>
        </Card>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-5 items-start">
        <Card title={tr('quickActions')}>
          <div className="grid grid-cols-2 gap-3">
            {actions.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={a.onClick}
                className="flex flex-col items-start gap-3 p-4 rounded-xl border border-brand-border hover:border-brand-primary/40 hover:bg-brand-soft/50 transition-colors text-left"
              >
                <span className="w-9 h-9 rounded-lg bg-brand-soft text-brand-primary flex items-center justify-center">{a.icon}</span>
                <span className="text-sm font-semibold text-brand-ink">{a.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card
          title={tr('latestRequests')}
          actions={
            <button type="button" onClick={() => go('requests')} className="text-xs font-semibold text-brand-primary inline-flex items-center gap-1 hover:underline">
              {tr('viewAll')} <ArrowRight size={13} />
            </button>
          }
        >
          {submissions.length === 0 ? (
            <div className="text-center py-8 text-sm text-brand-slate">
              <Inbox size={28} className="mx-auto mb-2 opacity-60" strokeWidth={1.5} />
              {tr('noRequests')}
            </div>
          ) : (
            <ul className="divide-y divide-brand-border">
              {submissions.slice(0, 5).map((s) => (
                <li key={s.id} className="py-3 flex items-start gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.type === 'contact' ? 'bg-brand-soft text-brand-primary' : 'bg-brand-ink text-white'}`}>
                    {s.type === 'contact' ? <Mail size={15} /> : <CalendarClock size={15} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-brand-ink truncate">{s.name || s.email || '—'}</span>
                      {!s.read && <Pill tone="blue">{tr('newBadge')}</Pill>}
                      <span className="ml-auto text-[11px] text-brand-slate shrink-0">{formatDate(s.createdAt)}</span>
                    </div>
                    <p className="text-xs text-brand-slate truncate mt-0.5">
                      {s.type === 'contact' ? s.message : `${serviceLabel(s.service)} · ${s.date} ${s.time}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
