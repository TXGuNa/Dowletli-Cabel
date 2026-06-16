# Döwletli Cabel — Website + Content Admin

Marketing website for **Döwletli**, a Turkmenistan-based optical fiber cable
manufacturer, built with React + TypeScript + Vite + Tailwind CSS.

The design is intentionally bright and modern: an airy white background with a
corporate blue → teal accent palette, soft shadows and smooth motion.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run lint     # eslint
```

## Pages

| Route       | Description                                              |
|-------------|----------------------------------------------------------|
| `/`         | Home — hero, features, manufacturing, call-to-action     |
| `/about`    | Company story and mission                                |
| `/products` | Optical cable product range with specs                   |
| `/gallery`  | Filterable image gallery with lightbox                   |
| `/contact`  | Contact details and message form                         |
| `/book`     | Multi-step consultation booking                          |
| `/admin`    | **Content editor (see below)**                           |

## Admin panel — `/admin`

Open `dowletli.net/admin` (or `/admin` locally) to manage the whole website.

**Login**

- **Username:** `nuraly`
- **Password:** `U12345678142536b`

The password is **not stored in plaintext** — only a salted SHA-256 hash lives in
the code (`src/content/auth.ts`). To change credentials, hash the new value with
the same salt (command shown in that file). Note: front-end-only auth can never
be fully secure; for strong protection move the check to a server.

**Content tab** — edit **every text on the site** without touching code.

- Edit any field for **English / Русский / Türkmen** using the language tabs.
- **Search** filters fields by text or field name.
- **Save** publishes instantly — the live site updates with no reload.
- **Export / Import** back up or restore all texts as JSON. **Reset** restores defaults.

**Requests tab** — see form submissions from the website.

- **Contact** messages and **Booking** (consultation) requests appear here with
  name, email, message/service, date & time.
- Mark read/unread, delete, or **export to CSV**. An unread badge shows new ones.

Texts and submissions are stored in the browser (`localStorage`). This is a
front-end-only setup — great for a single admin on one device. To collect leads
from every visitor across devices, forward submissions to a backend or email
service inside `addSubmission` (`src/content/submissionsStore.ts`), and wire the
content save/load to a backend in `src/content/contentStore.ts` (e.g. the C# / SQL
API you plan to build).

> Direct visits to `/admin` work on hosts with SPA routing. `public/_redirects`
> (Netlify/Cloudflare) and `vercel.json` (Vercel) are included for this.

## Automatic language

On first visit the language is auto-detected by region
(`src/content/detectLanguage.ts`):

- Turkmenistan → **Türkmen**
- Former-USSR / Russian-speaking regions → **Русский**
- everywhere else → **English**

The visitor's manual choice (via the language switcher) is remembered afterward.

## Project structure

```
src/
  components/      Header, Footer, Hero, ProductCard, LanguageSwitcher
  pages/           Home, About, Products, Gallery, Contact, BookConsultation, Admin
  locales/         en.json, ru.json, tkm.json  (default texts)
  content/
    contentStore.ts      load/save/merge texts, push into i18next
    ContentContext.tsx   React context used by the site + admin
    detectLanguage.ts    region-based language detection
  i18n.ts          i18next setup
```
