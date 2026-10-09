// Platform metadata for social links (shared between admin and components).

export const SOCIAL_PLATFORMS: { id: string; label: string }[] = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'wechat', label: 'WeChat' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'twitter', label: 'X (Twitter)' },
  { id: 'imo', label: 'imo' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'website', label: 'Website' },
];

export function platformLabel(id: string): string {
  return SOCIAL_PLATFORMS.find((p) => p.id === id)?.label || id;
}

// Turn what the admin typed into a working link:
// email -> mailto:, phone -> tel:, WhatsApp number -> wa.me, bare domain -> https://
export function socialHref(platform: string, raw: string): string {
  const v = raw.trim();
  if (!v) return '';
  if (/^(https?:|mailto:|tel:|viber:|skype:)/i.test(v)) return v;
  if (platform === 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return `mailto:${v}`;
  const digits = v.replace(/[^\d+]/g, '');
  if (platform === 'phone') return `tel:${digits}`;
  if (platform === 'whatsapp' && /^\+?\d{6,}$/.test(digits)) return `https://wa.me/${digits.replace('+', '')}`;
  if (platform === 'telegram' && /^@?\w{4,}$/.test(v)) return `https://t.me/${v.replace('@', '')}`;
  return `https://${v.replace(/^\/+/, '')}`;
}

// mailto:/tel: links open the mail/phone app; everything else in a new tab.
export function opensNewTab(href: string): boolean {
  return /^https?:/i.test(href);
}
