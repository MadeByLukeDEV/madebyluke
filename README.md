# madebyluke.dev — Portfolio

Personal portfolio & project showcase for **Lukas Graf**, Junior Fullstack Web Developer.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v3 + custom design tokens |
| Animations | Motion (Framer Motion v11) |
| Database | MariaDB via Prisma ORM |
| Auth | WebAuthn Passkeys (no passwords) |
| Email | Resend API |
| i18n | next-intl (DE/EN auto-detect) |
| Deployment | Coolify (nixpacks) |

## Features

- 🌙 **Dark / Light mode** — system-aware, user-toggleable
- 🌍 **DE / EN** — auto-detects from `Accept-Language` header, cookie override
- 💀 **Skeleton loading** — all async content loads with skeleton shimmer
- 🖱️ **Custom cursor** — glowing accent cursor on desktop
- 🔐 **Passkey auth** — WebAuthn biometric login for dashboard (no passwords)
- 📬 **Contact form** — Resend API, rate-limited, validated, GDPR-friendly
- 📁 **Project dashboard** — add/edit/delete projects with cover, description, links
- 🛡️ **Security** — CORS, rate limiting, CSP headers, HSTS, input validation (Zod)

## Setup

### 1. Clone & install
```bash
git clone https://github.com/you/madebyluke.git
cd madebyluke
npm install
```

### 2. Environment
```bash
cp .env.example .env
# Fill in your values:
# - DATABASE_URL (MariaDB connection string)
# - RESEND_API_KEY
# - JWT_SECRET (generate: openssl rand -base64 32)
# - WEBAUTHN_RP_ID (your domain, e.g. madebyluke.dev)
# - WEBAUTHN_ORIGIN (https://madebyluke.dev)
```

### 3. Database
```bash
npx prisma migrate dev --name init
npx prisma db seed  # optional: adds sample projects
```

### 4. Dev server
```bash
npm run dev
```

### 5. First login (passkey setup)
1. Go to `/dashboard/login`
2. Click **"Register a new passkey"**
3. Follow your browser/device prompts
4. Log in with your newly registered passkey

## Deployment (Coolify)

### Using nixpacks (recommended)
1. In Coolify: **New Service → GitHub Repo**
2. Set build pack to **Nixpacks** (or let it auto-detect)
3. Set all environment variables from `.env.example`
4. Set **Port** to `3000`
5. Deploy — nixpacks will run `prisma migrate deploy && npm start`

### Using Docker
The `Dockerfile` is included for manual builds. Make sure to set `output: 'standalone'` in `next.config.ts` (already done).

## Project Structure

```
src/
  app/
    api/               # API routes
      auth/            # WebAuthn register/login/logout
      contact/         # Contact form (Resend)
      projects/        # CRUD for projects
    dashboard/         # Admin dashboard
      login/           # Passkey login page
    globals.css        # Design tokens + animations
    layout.tsx         # Root layout (fonts, theme, i18n)
    page.tsx           # One-page portfolio
  components/
    layout/            # Navbar, Footer
    sections/          # Hero, About, Experience, Projects, Contact
    ui/                # CursorGlow
  i18n/
    messages/          # en.json, de.json
    request.ts         # next-intl config
  lib/
    auth.ts            # JWT session + CORS helpers
    prisma.ts          # Prisma singleton
    rateLimit.ts       # In-memory rate limiter
    utils.ts           # cn() helper
    validations.ts     # Zod schemas
  middleware.ts        # Route protection + CORS
prisma/
  schema.prisma        # DB schema
  seed.ts              # Sample data
```

## Customization

- **Colors**: `#00FFA8` accent defined in `tailwind.config.ts` and `globals.css`
- **Content**: Edit translations in `src/i18n/messages/`
- **Skills/Experience**: Edit directly in the component files (static data)
- **Projects**: Add via `/dashboard` — no code needed

## Security

- All forms validated server-side with Zod
- Rate limiting on contact form (3/10min) and auth endpoints
- CSP, HSTS, X-Frame-Options headers set in `next.config.ts`
- WebAuthn passkeys — phishing-resistant, no passwords stored
- JWT session cookies — httpOnly, secure, sameSite=lax
- CORS restricted to `NEXT_PUBLIC_URL`

---

Built with ♥ by Lukas Graf · [madebyluke.dev](https://madebyluke.dev)
