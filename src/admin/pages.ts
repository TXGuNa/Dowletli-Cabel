// Admin "Pages & texts" structure: which content sections belong to which page.

import { PanelTop, Home, Info, Boxes, Images, Mail, CalendarClock, PanelBottom, Globe, FileQuestion } from 'lucide-react';
import type { AdminKey } from '../content/adminStrings';

export interface PageDef {
  id: string;
  label: AdminKey;
  icon: typeof Home;
  route: string;
  sections: string[]; // top-level content keys shown on this page
}

export const PAGES: PageDef[] = [
  { id: 'header', label: 'pageHeader', icon: PanelTop, route: '/', sections: ['nav'] },
  { id: 'home', label: 'pageHome', icon: Home, route: '/', sections: ['brand', 'hero', 'home', 'features'] },
  { id: 'about', label: 'pageAbout', icon: Info, route: '/about', sections: ['about'] },
  { id: 'products', label: 'pageProducts', icon: Boxes, route: '/products', sections: ['products'] },
  { id: 'gallery', label: 'pageGallery', icon: Images, route: '/gallery', sections: ['gallery'] },
  { id: 'contact', label: 'pageContact', icon: Mail, route: '/contact', sections: ['contact'] },
  { id: 'booking', label: 'pageBooking', icon: CalendarClock, route: '/book', sections: ['booking'] },
  { id: 'footer', label: 'pageFooter', icon: PanelBottom, route: '/', sections: ['footer'] },
  { id: 'seo', label: 'pageSeo', icon: Globe, route: '/', sections: ['seo'] },
  { id: 'notFound', label: 'page404', icon: FileQuestion, route: '/page-not-found', sections: ['notFound'] },
];

export const PREVIEW_ROUTES: { path: string; label: AdminKey }[] = [
  { path: '/', label: 'pageHome' },
  { path: '/about', label: 'pageAbout' },
  { path: '/products', label: 'pageProducts' },
  { path: '/gallery', label: 'pageGallery' },
  { path: '/contact', label: 'pageContact' },
  { path: '/book', label: 'pageBooking' },
];

