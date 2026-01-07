# The National Society of Business Sciences (NSBS)

Production website for NSBS using Next.js 15, Supabase auth with RBAC, and deployable to Koyeb.

## Tech Stack

- **Framework**: Next.js 15.1 (App Router)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 4.0
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL) - Auth & user profiles only
- **Package Manager**: PNPM 9.x
- **Deployment**: Koyeb

## Prerequisites

- Node.js 20+
- PNPM 9+
- Supabase account
- Koyeb account

## Local Setup

1. Clone repository:
```bash
git clone https://github.com/AahPlexX/nsbs-platform.git
cd nsbs-platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

4. Run development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Check TypeScript types

## Deployment to Koyeb

1. Connect your GitHub repository to Koyeb
2. Configure build settings:
   - **Build command**: `pnpm build`
   - **Run command**: `pnpm start`
   - **Port**: 3000
3. Add environment variables in Koyeb dashboard:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

### Koyeb IPv6 Direct Connection

Koyeb supports direct IPv6 connections to Supabase without additional configuration.

## RBAC (Role-Based Access Control)

- **user**: Standard user role (default)
- **admin**: Administrator with free access to all course content

Admin users are automatically granted access without payment.

## Project Structure

```
nsbs-platform/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (content)/         # Public content pages
│   ├── dashboard/         # User dashboard
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
├── lib/                   # Utilities and helpers
│   ├── supabase/         # Supabase clients
│   └── rbac.ts           # RBAC utilities
├── content/              # Static course content (MDX/Markdown)
├── types/                # TypeScript type definitions
├── public/               # Static assets
└── database/             # Database schema
```

## License

Private - All rights reserved
