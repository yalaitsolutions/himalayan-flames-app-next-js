# Himalayan Flames — React + Node Web App

The Himalayan Flames restaurant site, rebuilt as a modern web application.
The visual design, layout, animations, fire effects and hover preview are
unchanged from the original static site — only the architecture is new.

- **Frontend:** React 18 + Vite + React Router (`/client`)
- **Backend:** Node.js + Express (`/server`)
- **Storage:** local JSON files in `/server/data` (no database)

## Architecture

```
himalayan-flames-app/
├── client/                 # React app (Vite)
│   ├── public/             # logo.avif, fire-bg.gif
│   └── src/
│       ├── components/     # Navbar, Footer, ScrollToTop
│       ├── hooks/          # usePageEffects (scroll-reveal + counters)
│       ├── pages/          # Home, Menu, About, Contact, Order
│       ├── styles/         # global.css + one CSS file per page (verbatim)
│       └── api.js          # fetch helpers for the backend
└── server/
    ├── index.js            # Express API + serves built frontend
    └── data/
        ├── menu.json       # 13 sections, 86 dishes (parsed from the PDF menu)
        ├── reviews.json    # customer testimonials
        ├── site.json       # address, hours, links
        └── messages.json   # contact-form submissions are appended here
```

### API endpoints
| Method | Route               | Auth  | Purpose                                       |
|--------|---------------------|-------|-----------------------------------------------|
| GET    | `/api/health`       | —     | health check                                  |
| GET    | `/api/menu`         | —     | full menu (sections + items)                  |
| GET    | `/api/reviews`      | —     | customer reviews                              |
| GET    | `/api/site`         | —     | restaurant info (address, hours, links)       |
| POST   | `/api/contact`      | —     | save a contact message to `messages.json`     |
| POST   | `/api/admin/login`  | —     | owner login → returns a signed token          |
| GET    | `/api/admin/me`     | owner | verify the current token                      |
| PUT    | `/api/admin/menu`   | owner | save the full menu (writes `menu.json`)       |

## Owner Menu Manager (hidden admin page)

The owner can log in and edit the menu live — **no code or JSON editing needed**.

- **Secret URL:** http://localhost:4000/owner-login (or http://localhost:5173/owner-login in dev).
  This page is intentionally **not linked anywhere** in the public site, so normal
  customers never see it.
- **Default login:** username `owner` / password `HimalayanFlames2024!`

Once logged in, the owner can:
- Add new dishes, delete dishes, change prices, descriptions, images and the
  spicy/vegan flags.
- Move a dish from one category to another (e.g. into **Popular** or **Chef's Special**).
- Add new categories — including one-click **Popular** and **Chef's Special** presets —
  edit category titles/icons/notes, or delete a category.
- Click **Save changes** to publish everything to the live site instantly.

### Changing the credentials (do this before going live)
Credentials and the token secret are read from environment variables, so set them
when starting the server:
```bash
ADMIN_USER="your-name" \
ADMIN_PASSWORD="a-strong-password" \
AUTH_SECRET="a-long-random-string" \
npm start
```
If you change the public `/owner-login` path, update the routes in
`client/src/App.jsx` and rebuild (`npm run build`).

## Run it

### 1. Install dependencies
```bash
npm run install:all
```

### 2a. Development (two terminals, hot reload)
```bash
npm run dev:server     # Express on http://localhost:4000
npm run dev:client     # Vite on http://localhost:5173 (proxies /api -> :4000)
```
Open http://localhost:5173

### 2b. Production (single server)
```bash
npm run build          # builds client into client/dist
npm start              # Express serves API + the built app on :4000
```
Open http://localhost:4000

## Notes
- The contact form posts to the backend and is stored in `server/data/messages.json`.
- The menu can be edited live via the **Owner Menu Manager** (see above), or by editing
  `server/data/menu.json` directly — no rebuild needed (backend reads it per request).
- Hours and reviews can still be edited directly in their JSON files in `server/data/`.
