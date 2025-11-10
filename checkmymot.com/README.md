# CheckMyMoT.com

CheckMyMoT.com is a production-ready Next.js 14 platform for UK vehicle owners and registered garages to manage MOT (Ministry of Transport) compliance. It combines a polished public landing page, powerful owner and garage dashboards, Prisma-backed persistence, and secure authentication powered by NextAuth.js.

## ✨ Features

- **Hero landing page** with an MOT lookup form wired to a mocked DVLA data set.
- **Vehicle owner dashboard** for managing saved vehicles, tracking MOT history, and viewing reminder notifications.
- **Garage workspace** for recording inspections, updating MOT results, searching customer vehicles, and maintaining garage profile details.
- **NextAuth.js authentication** supporting Google OAuth and email magic links with Prisma persistence and role-aware sessions.
- **PostgreSQL + Prisma ORM** schema covering users, garages, vehicles, MOT records, and notifications.
- **shadcn/ui + Tailwind CSS** component library with light/dark themes, responsive layouts, and rich data tables.
- **Server Actions and React Query** for ergonomic data mutations and client feedback loops.
- **CI/CD workflow** deploying to Vercel with lint/build gates and Neon/Postgres compatibility.

## 🧱 Tech Stack

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui, lucide-react icons
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth.js (Google OAuth + email magic link)
- **State & Data:** Server Actions, React Query, Prisma
- **Deployment Targets:** Vercel (frontend) & Neon/Postgres (database)

## 🚀 Getting Started

### 1. Clone & Install

```bash
npm install
```

The install step runs `prisma generate` automatically via the `postinstall` script.

### 2. Environment Variables

Copy `.env.example` to `.env.local` and update the values for your environment:

```bash
cp .env.example .env.local
```

Required variables:

- `DATABASE_URL` – connection string for your Postgres database (Neon compatible)
- `NEXTAUTH_SECRET` – random string used to encrypt NextAuth sessions
- `NEXTAUTH_URL` – base URL of your deployed site (http://localhost:3000 in development)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` – Google OAuth credentials
- `EMAIL_*` variables – optional SMTP settings for production magic links (the development build logs magic link URLs when unset)

### 3. Database Setup

Apply migrations and (optionally) seed sample data:

```bash
npx prisma migrate dev
npm run seed
```

The seed script provisions:

- `owner@example.com` (USER role) with a Ford Focus and example MOT history
- `garage@example.com` (GARAGE role) with a High Street MOT Centre profile

These credentials are perfect for exploring both dashboards locally.

### 4. Start Developing

```bash
npm run dev
```

Visit http://localhost:3000 to view the landing page. Use the navigation bar to sign in with the seeded accounts or your own providers.

## 🧪 Testing & Quality

- `npm run lint` – Next.js lint (ESLint) rules
- `npm run format` – Prettier formatting across the codebase

Additional checks run automatically inside the GitHub Actions workflow located at `.github/workflows/deploy.yml`.

## ☁️ Deployment

1. Deploy the Next.js application to **Vercel** and connect your GitHub repository.
2. Provision a **Neon.tech** (or any Postgres) database and update `DATABASE_URL` in the Vercel environment settings.
3. Set all secrets listed in `.env.example` inside Vercel’s dashboard.
4. Configure the GitHub Actions workflow secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

Every push to `main` triggers lint/build checks followed by an automated Vercel deployment.

## 📚 Project Structure

```
app/
  ├─ api/             # MOT mock API, users & garage endpoints, NextAuth handler
  ├─ dashboard/       # Shared layout plus user & garage dashboards
  ├─ (auth)/signin/   # Custom sign-in experience
  └─ page.tsx         # Public landing page with MOT checker
components/
  ├─ landing/         # Landing page widgets
  ├─ dashboard/       # Sidebar and dashboard widgets
  ├─ providers/       # Session, theme, and React Query providers
  └─ ui/              # shadcn/ui component primitives
lib/
  ├─ auth.ts          # NextAuth configuration
  ├─ prisma.ts        # Prisma client singleton
  └─ utils.ts         # Helpers for MOT formatting and Tailwind classes
prisma/
  └─ schema.prisma    # Database schema definition
scripts/
  └─ seed.ts          # Sample data for development
```

## 🔐 Sample Credentials

After running `npm run seed`, sign in with magic links (Email provider) or use Google OAuth. Magic link URLs are logged in the terminal when SMTP settings are not configured.

- **Owner dashboard:** `owner@example.com`
- **Garage dashboard:** `garage@example.com`

Assign the GARAGE role to additional users via Prisma Studio or the `/api/users` endpoint.

## 🛠️ Useful Commands

```bash
npm run dev      # Start Next.js locally
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Lint the project
npm run seed     # Seed database with demo data
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes and push the branch
4. Open a Pull Request describing your enhancements

## 📄 License

This project is provided as a reference implementation for CheckMyMoT.com and does not include a formal license. Contact the maintainers for commercial use.
