# CRM - Lead Management

A simple web CRM application for managing local business leads. Built with Next.js, TypeScript, Tailwind CSS, and Supabase (PostgreSQL).

## Features

- **Dashboard** - Přehled metrik (celkem poptávek, kontaktováno, odpovědělo, vyhráno)
- **Poptávky** - Tabulka s filtry podle stavu
- **Vytvoření/úprava** - Formulář pro přidání a editaci poptávek

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a Supabase project at [supabase.com](https://supabase.com) and get your credentials.

3. Set up environment variables. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL` - From Project Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for server-side data access)

4. Create the leads table. In Supabase Dashboard → SQL Editor, run:

```sql
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  city TEXT NOT NULL,
  website TEXT NOT NULL DEFAULT '',
  contact TEXT NOT NULL DEFAULT '',
  contact_channel TEXT NOT NULL DEFAULT 'email',
  status TEXT NOT NULL DEFAULT 'new',
  contacted_at TIMESTAMPTZ,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON leads FOR ALL USING (true) WITH CHECK (true);
```

5. Seed with sample data (optional):

```bash
npm run db:seed
```

6. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment (Vercel)

Supabase works great with Vercel. Add your environment variables in the Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Project Structure

```
├── app/
│   ├── leads/          # Lead list, detail, create, edit
│   ├── layout.tsx
│   └── page.tsx        # Dashboard
├── components/
│   ├── DeleteLeadButton.tsx
│   ├── LeadForm.tsx
│   └── Navigation.tsx
├── lib/
│   ├── actions.ts      # Server actions (CRUD)
│   ├── constants.ts
│   ├── database.ts     # Types and helpers
│   ├── leads.ts        # Lead queries
│   └── supabase.ts     # Supabase client
├── scripts/
│   └── seed.ts         # Database seed
└── supabase/
    └── migrations/     # SQL migrations
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:seed` - Seed database with sample data
