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
npm run cf:dev   # full site + API locally (Cloudflare Worker + local KV)
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

Open `dowletli.net/admin` to manage the whole website. Everything you change is a
**draft** shown in a **live preview** (desktop / tablet / phone); nothing reaches
visitors until you press **Publish** (or Ctrl/⌘ + S).

| Section | What you can change |
|---|---|
| **Dashboard** | Site status, last publish, current theme, new requests, quick actions |
| **Pages & texts** | Every text on every page in EN / RU / TM (one language or all 3 side by side), page images (logo, hero, manufacturing photo, About photo), show/hide sections, social links, booking time slots, browser-tab title & Google description, 404 page |
| **Products** | Add / remove products, photos, categories, specs (per-language status chips) |
| **Gallery** | Photos, categories, hide/show |
| **Theme & design** | 11 themes (Classic = the original look, Midnight Fiber, Emerald, Karakum Sand, Graphite Industrial, Royal Violet, Crimson Steel, Ocean Teal, Carbon Gold, Arctic Minimal, Sunset Energy) + fine-tuning: main/accent color, heading/text font, corner style |
| **Settings** | Brand name & logo, admin login, full backup download / restore, reset everything |
| **Requests** | Contact messages & bookings from all visitors (mark read, delete, CSV) |

Other details:
- Publish saves to **Cloudflare KV** through the Worker (`worker/index.ts`); every visitor
  gets the new version on their next page load — no rebuild or redeploy needed
  (far-away locations can take up to ~60 s to see a change).
- Uploaded images are resized in the browser and stored on the server.
- If someone publishes from another device/tab, the panel shows a banner; a stale
  tab is asked before it can overwrite newer content.
- The panel UI itself is available in English, Русский and Türkmen (sidebar / login).
- All theme fonts support Latin, Türkmen and Cyrillic letters.

**Login**

Credentials are checked on the server — nothing secret lives in this repo.

- Username: the `ADMIN_USERNAME` var in `wrangler.jsonc`.
- Password: the **`ADMIN_PASSWORD` secret** in Cloudflare
  (Workers & Pages → `dowletli` → Settings → Variables and Secrets → Add → type *Secret*).
- After signing in you can change the username/password in the panel (Content tab →
  *Admin login*); the new password is stored PBKDF2-hashed in KV and replaces
  `ADMIN_PASSWORD`. Changing it signs out all other sessions.
- Login and form submissions are rate-limited per IP.

## API (worker/index.ts)

| Method & path                    | Who    | What                                  |
|----------------------------------|--------|---------------------------------------|
| `GET /api/site`                  | public | published content (204 = none yet)    |
| `PUT /api/site`                  | admin  | publish content                       |
| `POST /api/login`                | public | sign in → session token (7 days)      |
| `POST /api/account`              | admin  | change username / password            |
| `POST /api/upload`               | admin  | upload image → `/api/img/<id>`        |
| `GET /api/img/<id>`              | public | serve an uploaded image               |
| `POST /api/submissions`          | public | contact / booking form                |
| `GET/PATCH/DELETE /api/submissions[/<id>]` | admin | read / mark / delete requests |
| `GET /api/health`                | public | `{ kv, adminConfigured }` check       |

## Deploy (Cloudflare Workers)

The site deploys with `wrangler deploy` (Workers Builds runs it on every push to
the production branch). `wrangler.jsonc` declares the KV binding `SITE` without
an id — wrangler ≥ 4.45 creates the namespace on the first deploy automatically.
Node 22 is required (`.nvmrc`).

One-time setup: add the `ADMIN_PASSWORD` secret (see *Login* above).

### Local development

```bash
echo "ADMIN_PASSWORD=dev-password" > .dev.vars   # local secret, git-ignored
npm run cf:dev        # builds and runs the Worker + local KV on http://localhost:8787
# or, for hot reload: run `npm run cf:dev` and `npm run dev` together —
# Vite proxies /api to the local Worker.
```

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
    api.ts               client for the Worker API
    siteSync.ts          loads the published site before first render
    cache.ts             local cache of the published copy
    contentStore.ts      merge texts, push into i18next
    ContentContext.tsx   React context used by the site + admin
    detectLanguage.ts    region-based language detection
  i18n.ts          i18next setup
  admin/           the admin panel (AdminApp.tsx + one file per view)
  content/themes.ts  theme definitions (colors, fonts, corners)
worker/
  index.ts         Cloudflare Worker: static site + /api (KV storage)
public/_headers    security headers for the static site
```
