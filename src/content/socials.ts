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
