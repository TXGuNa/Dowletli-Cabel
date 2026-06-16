// UI strings for the admin panel itself, in all three languages.
// The admin's language dropdown switches both the content being edited AND
// this interface text.

import type { Lang } from './detectLanguage';

export type AdminKey =
  | 'adminTitle' | 'adminSubtitle'
  | 'tabContent' | 'tabProducts' | 'tabRequests'
  | 'viewSite' | 'logout' | 'save' | 'saved'
  | 'language'
  | 'howTitle' | 'howBody'
  | 'searchPlaceholder' | 'hidePreview' | 'showPreview' | 'export' | 'import' | 'reset'
  | 'applying' | 'livePreview' | 'contentNote'
  | 'requestsTitle' | 'requestsSubtitle' | 'requestsNote'
  | 'fAll' | 'fMessages' | 'fBookings' | 'csv' | 'clear'
  | 'noRequests' | 'noRequestsBody' | 'markRead' | 'markUnread' | 'delete'
  | 'productsTitle' | 'productsEditingPre' | 'productsEditingPost'
  | 'addProduct' | 'addFirstProduct' | 'noProducts'
  | 'replace' | 'upload' | 'title' | 'category' | 'description' | 'specs' | 'addSpec' | 'deleteProduct'
  | 'addItem' | 'categoryPlaceholder' | 'productsNote'
  | 'loginTitle' | 'loginSubtitle' | 'username' | 'password' | 'wrongCreds' | 'checking' | 'signIn' | 'backToSite'
  | 'confirmResetContent' | 'confirmResetProducts' | 'confirmDeleteProduct' | 'confirmClearRequests'
  | 'imported' | 'importError' | 'imageTooBig';

type Dict = Record<AdminKey, string>;

const en: Dict = {
  adminTitle: 'Döwletli Admin',
  adminSubtitle: 'Manage your website',
  tabContent: 'Content',
  tabProducts: 'Products',
  tabRequests: 'Requests',
  viewSite: 'View site',
  logout: 'Logout',
  save: 'Save',
  saved: 'Saved',
  language: 'Language',
  howTitle: 'How it works:',
  howBody: 'pick a language and edit any text — your changes apply automatically and the live preview updates so you can see them right away. Manage products and photos in the Products tab.',
  searchPlaceholder: 'Search text…',
  hidePreview: 'Hide preview',
  showPreview: 'Show preview',
  export: 'Export',
  import: 'Import',
  reset: 'Reset',
  applying: 'Applying your changes to the preview…',
  livePreview: 'Live preview',
  contentNote: 'Changes are saved in this browser and applied to the live site instantly. Use Export to back up your texts.',
  requestsTitle: 'Requests',
  requestsSubtitle: 'Contact messages and consultation bookings from your website.',
  requestsNote: 'Submissions are stored in this browser. To collect leads from every visitor across devices, forward them to a backend or email service.',
  fAll: 'All',
  fMessages: 'Messages',
  fBookings: 'Bookings',
  csv: 'CSV',
  clear: 'Clear',
  noRequests: 'No requests yet',
  noRequestsBody: 'Contact messages and consultation bookings from the website will appear here.',
  markRead: 'Mark read',
  markUnread: 'Mark unread',
  delete: 'Delete',
  productsTitle: 'Products',
  productsEditingPre: 'Add, remove and edit products and their photos. You are editing the ',
  productsEditingPost: ' texts.',
  addProduct: 'Add product',
  addFirstProduct: 'Add your first product',
  noProducts: 'No products yet',
  replace: 'Replace',
  upload: 'Upload',
  title: 'Title',
  category: 'Category',
  description: 'Description',
  specs: 'Specs',
  addSpec: 'Add spec',
  deleteProduct: 'Delete product',
  addItem: 'Add item',
  categoryPlaceholder: 'e.g. aerial, underground, ftth…',
  productsNote: 'Changes apply to the website instantly. Images are stored in this browser — keep them small.',
  loginTitle: 'Admin Panel',
  loginSubtitle: 'Döwletli content editor',
  username: 'Username',
  password: 'Password',
  wrongCreds: 'Wrong username or password.',
  checking: 'Checking…',
  signIn: 'Sign in',
  backToSite: '← Back to website',
  confirmResetContent: 'Reset ALL texts back to the original defaults? This cannot be undone.',
  confirmResetProducts: 'Reset products to the original 5?',
  confirmDeleteProduct: 'Delete this product? This cannot be undone.',
  confirmClearRequests: 'Delete ALL requests?',
  imported: 'Imported. Your changes are now live.',
  importError: 'Could not read that file. Make sure it is a valid export.',
  imageTooBig: 'Please use an image under 2 MB so it saves reliably in the browser.',
};

const ru: Dict = {
  adminTitle: 'Döwletli Admin',
  adminSubtitle: 'Управление сайтом',
  tabContent: 'Тексты',
  tabProducts: 'Продукция',
  tabRequests: 'Заявки',
  viewSite: 'Открыть сайт',
  logout: 'Выйти',
  save: 'Сохранить',
  saved: 'Сохранено',
  language: 'Язык',
  howTitle: 'Как это работает:',
  howBody: 'выберите язык и редактируйте любой текст — изменения применяются автоматически, а предпросмотр обновляется, чтобы вы сразу видели результат. Продукцию и фото меняйте на вкладке «Продукция».',
  searchPlaceholder: 'Поиск текста…',
  hidePreview: 'Скрыть предпросмотр',
  showPreview: 'Показать предпросмотр',
  export: 'Экспорт',
  import: 'Импорт',
  reset: 'Сброс',
  applying: 'Применяем изменения к предпросмотру…',
  livePreview: 'Предпросмотр',
  contentNote: 'Изменения сохраняются в этом браузере и сразу применяются к сайту. Используйте «Экспорт» для резервной копии.',
  requestsTitle: 'Заявки',
  requestsSubtitle: 'Сообщения и записи на консультацию с вашего сайта.',
  requestsNote: 'Заявки хранятся в этом браузере. Чтобы собирать их со всех устройств, подключите бэкенд или почтовый сервис.',
  fAll: 'Все',
  fMessages: 'Сообщения',
  fBookings: 'Записи',
  csv: 'CSV',
  clear: 'Очистить',
  noRequests: 'Пока нет заявок',
  noRequestsBody: 'Сообщения и записи на консультацию с сайта появятся здесь.',
  markRead: 'Прочитано',
  markUnread: 'Непрочитано',
  delete: 'Удалить',
  productsTitle: 'Продукция',
  productsEditingPre: 'Добавляйте, удаляйте и редактируйте продукты и их фото. Вы редактируете тексты на языке ',
  productsEditingPost: '.',
  addProduct: 'Добавить продукт',
  addFirstProduct: 'Добавьте первый продукт',
  noProducts: 'Пока нет продуктов',
  replace: 'Заменить',
  upload: 'Загрузить',
  title: 'Название',
  category: 'Категория',
  description: 'Описание',
  specs: 'Характеристики',
  addSpec: 'Добавить характеристику',
  deleteProduct: 'Удалить продукт',
  addItem: 'Добавить',
  categoryPlaceholder: 'напр. aerial, underground, ftth…',
  productsNote: 'Изменения применяются к сайту сразу. Фото хранятся в этом браузере — используйте небольшие файлы.',
  loginTitle: 'Панель администратора',
  loginSubtitle: 'Редактор сайта Döwletli',
  username: 'Имя пользователя',
  password: 'Пароль',
  wrongCreds: 'Неверное имя пользователя или пароль.',
  checking: 'Проверка…',
  signIn: 'Войти',
  backToSite: '← Назад на сайт',
  confirmResetContent: 'Сбросить ВСЕ тексты к исходным? Это нельзя отменить.',
  confirmResetProducts: 'Вернуть исходные 5 продуктов?',
  confirmDeleteProduct: 'Удалить этот продукт? Это нельзя отменить.',
  confirmClearRequests: 'Удалить ВСЕ заявки?',
  imported: 'Импортировано. Изменения уже на сайте.',
  importError: 'Не удалось прочитать файл. Убедитесь, что это корректный экспорт.',
  imageTooBig: 'Используйте изображение меньше 2 МБ, чтобы оно надёжно сохранилось в браузере.',
};

const tkm: Dict = {
  adminTitle: 'Döwletli Admin',
  adminSubtitle: 'Web sahypaňyzy dolandyryň',
  tabContent: 'Tekstler',
  tabProducts: 'Önümler',
  tabRequests: 'Haýyşlar',
  viewSite: 'Sahypany aç',
  logout: 'Çykmak',
  save: 'Ýatda saklamak',
  saved: 'Saklandy',
  language: 'Dil',
  howTitle: 'Nähili işleýär:',
  howBody: 'dili saýlaň we islendik tekstleri redaktirläň — üýtgeşmeler awtomatiki ulanylýar we önizleme täzelenip, derrew görkezýär. Önümleri we suratlary «Önümler» bölüminde dolandyryň.',
  searchPlaceholder: 'Tekst gözle…',
  hidePreview: 'Önizlemäni gizle',
  showPreview: 'Önizlemäni görkez',
  export: 'Eksport',
  import: 'Import',
  reset: 'Dikeltmek',
  applying: 'Üýtgeşmeler önizlemä ulanylýar…',
  livePreview: 'Janly önizleme',
  contentNote: 'Üýtgeşmeler şu brauzerde saklanýar we sahypa derrew ulanylýar. Ätiýaçlyk üçin «Eksport» ulanyň.',
  requestsTitle: 'Haýyşlar',
  requestsSubtitle: 'Sahypaňyzdan gelen habarlar we maslahat ýazgylary.',
  requestsNote: 'Haýyşlar şu brauzerde saklanýar. Ähli enjamlardan ýygnamak üçin backend ýa-da e-poçta hyzmatyna birikdiriň.',
  fAll: 'Hemmesi',
  fMessages: 'Habarlar',
  fBookings: 'Ýazgylar',
  csv: 'CSV',
  clear: 'Arassala',
  noRequests: 'Heniz haýyş ýok',
  noRequestsBody: 'Sahypadan gelen habarlar we maslahat ýazgylary şu ýerde görüner.',
  markRead: 'Okaldy diýip belle',
  markUnread: 'Okalmady diýip belle',
  delete: 'Poz',
  productsTitle: 'Önümler',
  productsEditingPre: 'Önümleri we suratlaryny goşuň, pozuň we redaktirläň. Siz ',
  productsEditingPost: ' dilindäki tekstleri redaktirleýärsiňiz.',
  addProduct: 'Önüm goş',
  addFirstProduct: 'Ilkinji önümiňizi goşuň',
  noProducts: 'Heniz önüm ýok',
  replace: 'Çalyş',
  upload: 'Ýükle',
  title: 'Ady',
  category: 'Kategoriýa',
  description: 'Düşündiriş',
  specs: 'Aýratynlyklar',
  addSpec: 'Aýratynlyk goş',
  deleteProduct: 'Önümi poz',
  addItem: 'Goş',
  categoryPlaceholder: 'mysal: aerial, underground, ftth…',
  productsNote: 'Üýtgeşmeler sahypa derrew ulanylýar. Suratlar şu brauzerde saklanýar — kiçi faýllary ulanyň.',
  loginTitle: 'Admin paneli',
  loginSubtitle: 'Döwletli mazmun redaktory',
  username: 'Ulanyjy ady',
  password: 'Açar sözi',
  wrongCreds: 'Ulanyjy ady ýa-da açar sözi nädogry.',
  checking: 'Barlanýar…',
  signIn: 'Gir',
  backToSite: '← Sahypa dolan',
  confirmResetContent: 'ÄHLI tekstleri başlangyç görnüşe dikeltmeli? Bu yza gaýtarylmaýar.',
  confirmResetProducts: 'Başlangyç 5 önümi dikeltmeli?',
  confirmDeleteProduct: 'Bu önümi pozmaly? Bu yza gaýtarylmaýar.',
  confirmClearRequests: 'ÄHLI haýyşlary pozmaly?',
  imported: 'Import edildi. Üýtgeşmeler sahypada janly.',
  importError: 'Faýl okalmady. Dogry eksport faýly bolandygyna göz ýetiriň.',
  imageTooBig: 'Brauzerde ygtybarly saklanar ýaly 2 MB-dan kiçi surat ulanyň.',
};

const DICTS: Record<Lang, Dict> = { en, ru, tkm };

export function adminT(lang: Lang) {
  const dict = DICTS[lang] || en;
  return (key: AdminKey): string => dict[key] ?? en[key];
}

// ---- Content section & field labels (translated) ---------------------------

function humanize(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

// Top-level section card headers
const SECTIONS: Record<Lang, Record<string, string>> = {
  en: {
    brand: 'Brand name & tagline', nav: 'Menu / Navigation', hero: 'Home — main banner',
    home: 'Home — sections', features: 'Home — features', products: 'Products page',
    about: 'About page', contact: 'Contact page', booking: 'Booking page',
    gallery: 'Gallery page', footer: 'Footer',
  },
  ru: {
    brand: 'Название и слоган', nav: 'Меню / Навигация', hero: 'Главная — баннер',
    home: 'Главная — разделы', features: 'Главная — преимущества', products: 'Страница продукции',
    about: 'Страница «О нас»', contact: 'Страница контактов', booking: 'Страница записи',
    gallery: 'Страница галереи', footer: 'Подвал сайта',
  },
  tkm: {
    brand: 'Brend ady we şygary', nav: 'Menýu / Nawigasiýa', hero: 'Baş sahypa — banner',
    home: 'Baş sahypa — bölümler', features: 'Baş sahypa — aýratynlyklar', products: 'Önümler sahypasy',
    about: 'Biz barada sahypasy', contact: 'Habarlaşmak sahypasy', booking: 'Ýazgy sahypasy',
    gallery: 'Galereýa sahypasy', footer: 'Aşaky bölüm',
  },
};

// Field & nested-group labels (keyed by the last path segment)
const FIELDS: Record<string, Record<Lang, string>> = {
  title: { en: 'Title', ru: 'Заголовок', tkm: 'Ady' },
  subtitle: { en: 'Subtitle', ru: 'Подзаголовок', tkm: 'Kömekçi ýazgy' },
  description: { en: 'Description', ru: 'Описание', tkm: 'Düşündiriş' },
  label: { en: 'Label', ru: 'Метка', tkm: 'Bellik' },
  name: { en: 'Name', ru: 'Имя', tkm: 'Ady' },
  tagline: { en: 'Tagline', ru: 'Слоган', tkm: 'Şygar' },
  highlight: { en: 'Highlighted word', ru: 'Выделенное слово', tkm: 'Bellenen söz' },
  cta: { en: 'Button (CTA)', ru: 'Кнопка', tkm: 'Düwme' },
  book: { en: 'Booking button', ru: 'Кнопка записи', tkm: 'Ýazgy düwmesi' },
  button: { en: 'Button', ru: 'Кнопка', tkm: 'Düwme' },
  // nav items
  home: { en: 'Home', ru: 'Главная', tkm: 'Baş sahypa' },
  about: { en: 'About', ru: 'О нас', tkm: 'Biz barada' },
  products: { en: 'Products', ru: 'Продукция', tkm: 'Önümler' },
  gallery: { en: 'Gallery', ru: 'Галерея', tkm: 'Galereýa' },
  contact: { en: 'Contact', ru: 'Контакты', tkm: 'Habarlaşmak' },
  // hero stats
  stat1num: { en: 'Stat 1 — number', ru: 'Показатель 1 — число', tkm: 'Görkeziji 1 — san' },
  stat1label: { en: 'Stat 1 — label', ru: 'Показатель 1 — подпись', tkm: 'Görkeziji 1 — ýazgy' },
  stat2num: { en: 'Stat 2 — number', ru: 'Показатель 2 — число', tkm: 'Görkeziji 2 — san' },
  stat2label: { en: 'Stat 2 — label', ru: 'Показатель 2 — подпись', tkm: 'Görkeziji 2 — ýazgy' },
  stat3num: { en: 'Stat 3 — number', ru: 'Показатель 3 — число', tkm: 'Görkeziji 3 — san' },
  stat3label: { en: 'Stat 3 — label', ru: 'Показатель 3 — подпись', tkm: 'Görkeziji 3 — ýazgy' },
  // home
  manufacturing: { en: 'Manufacturing', ru: 'Производство', tkm: 'Önümçilik' },
  stats: { en: 'Stats', ru: 'Показатели', tkm: 'Görkezijiler' },
  cycle: { en: 'Production cycle', ru: 'Производственный цикл', tkm: 'Önümçilik tapgyry' },
  quality: { en: 'Quality', ru: 'Качество', tkm: 'Hil' },
  badge: { en: 'Badge', ru: 'Бейдж', tkm: 'Bellik' },
  global: { en: 'Global', ru: 'Глобально', tkm: 'Global' },
  reliable: { en: 'Reliability', ru: 'Надёжность', tkm: 'Ynamdarlyk' },
  // products
  viewDetails: { en: 'View details', ru: '«Подробнее»', tkm: '«Jikme-jik»' },
  categories: { en: 'Categories', ru: 'Категории', tkm: 'Kategoriýalar' },
  aerial: { en: 'Aerial', ru: 'Воздушный', tkm: 'Howa' },
  underground: { en: 'Underground', ru: 'Подземный', tkm: 'Ýerasty' },
  ftth: { en: 'FTTH', ru: 'FTTH', tkm: 'FTTH' },
  directBurial: { en: 'Direct burial', ru: 'Прямая укладка', tkm: 'Göni gömme' },
  // about
  story: { en: 'Story', ru: 'История', tkm: 'Taryh' },
  history: { en: 'History', ru: 'История', tkm: 'Taryh' },
  expansion: { en: 'Expansion', ru: 'Расширение', tkm: 'Giňeltmek' },
  mission: { en: 'Mission', ru: 'Миссия', tkm: 'Wezipe' },
  // contact
  hero_title: { en: 'Page title', ru: 'Заголовок страницы', tkm: 'Sahypa ady' },
  labels: { en: 'Labels', ru: 'Метки', tkm: 'Bellikler' },
  location: { en: 'Location', ru: 'Местоположение', tkm: 'Ýerleşýän ýeri' },
  phone: { en: 'Phone', ru: 'Телефон', tkm: 'Telefon' },
  email: { en: 'Email', ru: 'Эл. почта', tkm: 'E-poçta' },
  form: { en: 'Form', ru: 'Форма', tkm: 'Forma' },
  message: { en: 'Message', ru: 'Сообщение', tkm: 'Habar' },
  send: { en: 'Send', ru: 'Отправить', tkm: 'Iber' },
  sending: { en: 'Sending…', ru: 'Отправка…', tkm: 'Iberilýär…' },
  success: { en: 'Success message', ru: 'Сообщение об успехе', tkm: 'Üstünlik habary' },
  sent: { en: 'After-send note', ru: 'Текст после отправки', tkm: 'Iberilenden soňky ýazgy' },
  info: { en: 'Contact info', ru: 'Контактные данные', tkm: 'Habarlaşmak maglumaty' },
  address: { en: 'Address', ru: 'Адрес', tkm: 'Salgy' },
  mobile: { en: 'Mobile', ru: 'Мобильный', tkm: 'Jübi telefony' },
  badges: { en: 'Badges', ru: 'Бейджи', tkm: 'Bellikler' },
  facility: { en: 'Facility', ru: 'Объект', tkm: 'Desga' },
  sendMessage: { en: '“Send message” heading', ru: 'Заголовок «Сообщение»', tkm: '«Habar iber» sözbaşy' },
  // booking
  selectService: { en: 'Select service', ru: 'Выбор услуги', tkm: 'Hyzmat saýlamak' },
  selectDate: { en: 'Select date', ru: 'Выбор даты', tkm: 'Sene saýlamak' },
  selectTime: { en: 'Select time', ru: 'Выбор времени', tkm: 'Wagt saýlamak' },
  yourInfo: { en: 'Your info', ru: 'Ваши данные', tkm: 'Maglumatyňyz' },
  confirm: { en: 'Confirm', ru: 'Подтвердить', tkm: 'Tassyklamak' },
  services: { en: 'Services', ru: 'Услуги', tkm: 'Hyzmatlar' },
  technical: { en: 'Technical', ru: 'Технические', tkm: 'Tehniki' },
  sales: { en: 'Sales', ru: 'Продажи', tkm: 'Satuw' },
  tour: { en: 'Tour', ru: 'Экскурсия', tkm: 'Gezelenç' },
  next: { en: 'Next', ru: 'Далее', tkm: 'Indiki' },
  back: { en: 'Back', ru: 'Назад', tkm: 'Yza' },
  summary: { en: 'Summary', ru: 'Сводка', tkm: 'Jemi' },
  fullName: { en: 'Full name', ru: 'Полное имя', tkm: 'Doly ady' },
  emailAddress: { en: 'Email address', ru: 'Эл. почта', tkm: 'E-poçta salgysy' },
  edit: { en: 'Edit', ru: 'Изменить', tkm: 'Üýtgetmek' },
  steps: { en: 'Steps', ru: 'Шаги', tkm: 'Ädimler' },
  service: { en: 'Service', ru: 'Услуга', tkm: 'Hyzmat' },
  datetime: { en: 'Date & time', ru: 'Дата и время', tkm: 'Sene we wagt' },
  details: { en: 'Details', ru: 'Детали', tkm: 'Maglumatlar' },
  benefits: { en: 'Benefits', ru: 'Преимущества', tkm: 'Artykmaçlyklar' },
  expertTitle: { en: 'Benefit 1 — title', ru: 'Преимущество 1 — заголовок', tkm: 'Artykmaçlyk 1 — ady' },
  expertDesc: { en: 'Benefit 1 — text', ru: 'Преимущество 1 — текст', tkm: 'Artykmaçlyk 1 — tekst' },
  customTitle: { en: 'Benefit 2 — title', ru: 'Преимущество 2 — заголовок', tkm: 'Artykmaçlyk 2 — ady' },
  customDesc: { en: 'Benefit 2 — text', ru: 'Преимущество 2 — текст', tkm: 'Artykmaçlyk 2 — tekst' },
  // footer
  company: { en: 'Company', ru: 'Компания', tkm: 'Kompaniýa' },
  technology: { en: 'Technology', ru: 'Технологии', tkm: 'Tehnologiýa' },
  careers: { en: 'Careers', ru: 'Карьера', tkm: 'Karýera' },
  news: { en: 'News', ru: 'Новости', tkm: 'Habarlar' },
  rights: { en: 'Rights text', ru: 'Текст о правах', tkm: 'Hukuklar ýazgysy' },
  // gallery
  filters: { en: 'Filters', ru: 'Фильтры', tkm: 'Süzgüçler' },
  all: { en: 'All', ru: 'Все', tkm: 'Hemmesi' },
  factory: { en: 'Factory', ru: 'Завод', tkm: 'Fabrik' },
  events: { en: 'Events', ru: 'События', tkm: 'Çäreler' },
};

export function sectionLabel(key: string, lang: Lang): string {
  return SECTIONS[lang]?.[key] ?? SECTIONS.en[key] ?? humanize(key);
}

export function fieldLabel(key: string, lang: Lang): string {
  return FIELDS[key]?.[lang] ?? humanize(key);
}
