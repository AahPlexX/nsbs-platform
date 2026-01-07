# The National Society of Business Sciences (NSBS)

Production website for NSBS built with Next.js 15, Supabase authentication, and deployed on Koyeb.

## Tech Stack

- **Framework**: Next.js 15.1 (App Router)
- **Auth**: Supabase (Magic Link + Google OAuth)
- **Styling**: Tailwind CSS 4.0
- **Package Manager**: PNPM
- **Deployment**: Koyeb
- **Database**: Supabase (users/profiles only, no course content)

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

3. Create `.env.local`:
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Run development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Setup

1. Run the SQL schema in Supabase dashboard (`database/schema.sql`)
2. Configure Google OAuth provider in Supabase Auth settings
3. Enable Magic Link in Supabase Auth settings

## Deployment to Koyeb

1. Connect GitHub repository to Koyeb
2. Set build command: `pnpm build`
3. Set start command: `pnpm start`
4. Add environment variables in Koyeb dashboard
5. Deploy

## Environment Variables

- `NEXT_PUBLIC_SITE_URL`: Your production URL
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side only)

## Project Structure

```
nsbs-platform/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Authentication routes
│   ├── (courses)/         # Course routes
│   ├── dashboard/         # User dashboard
│   └── api/               # API routes
├── components/            # React components
├── content/               # Static course content (MDX)
├── lib/                   # Utility functions
├── types/                 # TypeScript types
├── database/              # SQL schema
└── public/                # Static assets
```

## Authentication

- **Magic Link**: Passwordless email authentication
- **Google OAuth**: Social sign-in via Google
- No password-based authentication

## RBAC

- **user**: Standard user with paid course access
- **admin**: Free access to all courses, no special UI

## Adding Course Content

Course content is stored as MDX files in `/content/courses/`. To add new content:

1. Create MDX file in `/content/courses/<slug>.mdx`
2. Add metadata and content
3. Commit and push to GitHub
4. Koyeb auto-deploys

## License

Private - All Rights Reserved