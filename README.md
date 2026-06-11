# Himalayan Flames — Next.js 15 Full-Stack App

The Himalayan Flames restaurant site, refactored from a **React (Vite) + Express + JSON-file**
app into a modern **Next.js 15 App Router** full-stack application backed by **MongoDB**.
The visual design, layout, animations, fire effects, and hover preview are unchanged — only
the architecture is new.

## Tech Stack

| Layer            | Technology                                                        |
|------------------|-------------------------------------------------------------------|
| Framework        | Next.js 15 (App Router), React 19, JavaScript (no TypeScript)     |
| Styling          | Plain CSS (the original stylesheets, reused verbatim)             |
| Backend          | Next.js Route Handlers (`app/api/**`)                             |
| Database         | MongoDB + Mongoose ODM                                            |
| Auth             | NextAuth.js (Auth.js v5), Credentials provider, JWT sessions, bcrypt |
| File uploads     | `multipart/form-data` → `/public/uploads`                        |

## Project Structure

```
himalayan-flames-nextjs-app/
├── app/
│   ├── layout.js            # Root layout (fonts, Font Awesome, SessionProvider)
│   ├── providers.js         # Client SessionProvider wrapper
│   ├── page.js              # Home (Server Component — reads reviews from Mongo)
│   ├── menu/page.js         # Menu (Server Component → MenuClient)
│   ├── about/page.js        # About (Server Component)
│   ├── contact/page.js      # Contact (Client Component — form POSTs to /api/contact)
│   ├── order/page.js        # Order links page
│   ├── login/page.js        # Sign-in (NextAuth credentials)
│   ├── register/page.js     # Account registration
│   ├── dashboard/page.js    # Protected admin Menu Manager (Server guard → DashboardClient)
│   └── api/
│       ├── auth/[...nextauth]/route.js   # NextAuth handlers
│       ├── users/route.js    # POST register · GET list (admin)
│       ├── products/route.js # GET flat list of dishes
│       ├── menu/route.js     # GET menu · PUT replace menu (admin)
│       ├── reviews/route.js  # GET reviews
│       ├── contact/route.js  # POST contact message
│       └── uploads/route.js  # POST image upload (admin, multipart)
├── components/
│   ├── Navbar.jsx · Footer.jsx · RevealEffects.jsx
│   ├── MenuClient.jsx        # interactive menu (tabs, scrollspy, hover popup)
│   └── DashboardClient.jsx   # the menu-manager UI
├── lib/
│   ├── mongodb.js            # cached Mongoose connection
│   ├── auth.config.js        # edge-safe NextAuth config (used by middleware)
│   ├── auth.js               # full NextAuth setup (Credentials + bcrypt)
│   └── data.js               # server-side data access (assembles menu shape)
├── models/
│   ├── User.js · Category.js · Product.js · Review.js · Message.js
├── scripts/seed.js          # migrates the old JSON data into MongoDB
├── middleware.js            # protects /dashboard
├── public/uploads/          # uploaded + migrated dish images
├── styles/                  # the original CSS files (global + per page)
├── .env.local               # local secrets (gitignored)
└── .env.example             # template
```

> The old `client/` and `server/` folders are now **legacy** and can be deleted. They are
> kept only for reference and are ignored by Next.js.

## Data Model

The old single `menu.json` (sections → items) is normalized into two collections:

- **Category** — section metadata: `slug`, `icon`, `title`, `subtitle`, `note`, `tab`, `order`
- **Product** — a dish: `category` (slug), `name`, `desc`, `price`, `img`, `spicy`, `vegan`, `label`, `order`

`GET /api/menu` re-assembles these back into the exact `{ sections: [...] }` shape the
frontend already expects, so no UI logic changed. Reviews and contact messages have their
own `Review` and `Message` collections; `User` stores auth accounts.

## API Endpoints

| Method | Route                | Auth   | Purpose                                   |
|--------|----------------------|--------|-------------------------------------------|
| GET    | `/api/menu`          | —      | full menu (sections + items)              |
| PUT    | `/api/menu`          | admin  | replace the whole menu                    |
| GET    | `/api/products`      | —      | flat list of all dishes                   |
| GET    | `/api/reviews`       | —      | customer reviews                          |
| POST   | `/api/contact`       | —      | save a contact message                    |
| POST   | `/api/users`         | —      | register a new account (role `user`)      |
| GET    | `/api/users`         | admin  | list users                               |
| POST   | `/api/uploads`       | admin  | upload an image (multipart)               |
| *      | `/api/auth/*`        | —      | NextAuth (sign in / out / session)        |

## Authentication & Roles

- **NextAuth Credentials provider** with **bcrypt**-hashed passwords and **JWT sessions**.
- Two roles: **admin** and **user**. New registrations are always `user`.
- `middleware.js` protects `/dashboard`: logged-out users are redirected to `/login`,
  and logged-in non-admins are redirected to `/`. The `/dashboard` page **also** re-checks
  the session server-side (defence in depth).
- The admin-only API routes (`PUT /api/menu`, `POST /api/uploads`, `GET /api/users`) verify
  `session.user.role === "admin"`.

## Installation & Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env.local
```
Then edit `.env.local`:
```bash
MONGODB_URI=mongodb://127.0.0.1:27017/himalayan-flames   # or a MongoDB Atlas URI
AUTH_SECRET=...            # generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
ADMIN_NAME=Owner
ADMIN_EMAIL=owner@himalayanflames.com
ADMIN_PASSWORD=HimalayanFlames2024!
```

You need a running MongoDB. Either:
- **Local:** install MongoDB Community Server (`brew install mongodb-community` on macOS) and start it, **or**
- **Cloud:** create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) and use its connection string.

### 3. Seed the database (migrates the old JSON data + creates the admin user)
```bash
npm run seed
```
This loads `server/data/menu.json` (14 categories, 87 dishes) and `reviews.json` into
MongoDB and creates the admin account from the `ADMIN_*` env vars.

### 4. Run
```bash
npm run dev      # http://localhost:3000  (development, hot reload)
# or
npm run build && npm start   # production
```

### Admin access
Sign in at **http://localhost:3000/login** with the seeded admin
(`owner@himalayanflames.com` / `HimalayanFlames2024!`), then manage the live menu at
**/dashboard**. Change these credentials before going to production.

## Migration Summary (what changed)

1. **Pages → App Router.** Each React Router page became an `app/**/page.js`. Static/data
   pages (Home, Menu, About) are **Server Components**; interactive ones (Contact, Order,
   Dashboard, login/register) are **Client Components**. `react-router` `<Link>`/`<NavLink>`
   were replaced with `next/link` + `usePathname`; `ScrollToTop` is no longer needed (Next
   handles scroll restoration). The `usePageEffects` hook became the `<RevealEffects />`
   client component.
2. **Express → Route Handlers.** Every Express endpoint became a Next.js Route Handler under
   `app/api/`. The menu validation/normalization logic was ported verbatim.
3. **JSON files → MongoDB.** File reads/writes were replaced by Mongoose queries against the
   `Category`, `Product`, `Review`, `Message`, and `User` collections.
4. **Schemas/models** live in `models/`.
5. **Auth → NextAuth.** The hand-rolled HMAC-token owner login was replaced with NextAuth
   Credentials + bcrypt + JWT sessions, plus a real registration flow and admin/user roles.
6. **Protected routes.** `middleware.js` + a server-side session check guard `/dashboard`.
7. **Reusable DB connection** with hot-reload-safe caching in `lib/mongodb.js`.
8. **Uploads.** Base64-in-JSON uploads were replaced with `multipart/form-data` uploads that
   validate type + size and write to `/public/uploads` (served statically by Next).
9. **Env vars** moved to `.env.local`.
10. **All existing functionality preserved** — same design, menu, animations, hover preview,
    contact form, and live menu manager.
