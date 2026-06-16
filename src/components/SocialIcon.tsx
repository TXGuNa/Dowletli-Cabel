import {
  Instagram, Facebook, Linkedin, Youtube, Twitter, Send,
  MessageCircle, MessagesSquare, Music2, Mail, Phone, Globe,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: MessageCircle,
  wechat: MessagesSquare,
  telegram: Send,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  imo: MessageCircle,
  tiktok: Music2,
  email: Mail,
  phone: Phone,
  website: Globe,
};

export default function SocialIcon({ platform, size = 18 }: { platform: string; size?: number }) {
  const Icon = ICONS[platform] || Globe;
  return <Icon size={size} />;
}
