# National Academy of Business Sciences (NSBS)

> Professional certification platform for business education

## 🎯 Overview

NSBS provides text-based professional certification courses with comprehensive study materials and rigorous exam-only assessment. Courses are designed for working professionals seeking industry-recognized credentials.

## 🏗️ Architecture

### Core Technologies
- **Framework**: Next.js 16.1.1 (React 19.2.0)
- **Language**: TypeScript 5.9.3
- **Package Manager**: PNPM 9.15.0
- **Node Version**: 20.13.0
- **Styling**: Tailwind CSS 4.1.18
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Hosting**: Koyeb

### Key Design Decisions
- **Course Content**: Stored as MDX files in repository (NOT in database)
- **User Data Only**: Supabase stores authentication and user-specific data
- **RBAC**: Two roles - admin (eastman.luccas@gmail.com) and user (everyone else)
- **No Admin UI**: Admins edit repository directly

## 📚 Available Courses

1. **Change Management Specialist (CMS)** - $299
2. **Kaizen Theory & Practice Practitioner (KTP)** - $279  
3. **Corporate Finance Specialist (CFS)** - $349

## 🚀 Quick Start

### Prerequisites
```bash
# Install Node.js 20.13.0
nvm install 20.13.0
nvm use 20.13.0

# Install PNPM 9.15.0
npm install -g pnpm@9.15.0
```

### Installation
```bash
# Clone repository
git clone https://github.com/AahPlexX/nsbs-platform.git
cd nsbs-platform

# Install dependencies (exact versions from lockfile)
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Stripe credentials

# Run database migrations
pnpm db:push

# Seed course metadata
pnpm db:seed

# Start development server
pnpm dev
```

### Development Commands
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript compiler
pnpm format       # Format code with Prettier
```

## 📂 Project Structure

```
nsbs-platform/
├── app/                    # Next.js 13+ app directory
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (courses)/         # Course pages
│   ├── api/               # API routes
│   └── dashboard/         # User dashboard
├── components/            # React components
├── content/               # Course content (MDX files)
│   ├── courses.json       # Course metadata
│   └── courses/           # Individual course directories
├── database/              # Database schema and seeds
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## 🗄️ Database Schema

Minimal schema storing only user data:
- `courses` - Course metadata (not content)
- `course_purchases` - User purchases
- `lesson_completions` - Chapter completion tracking
- `exam_attempts` - Exam history
- `certificates` - Issued certificates
- `user_bookmarks` - User bookmarks

## 🔐 Environment Variables

```bash
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 📝 License

UNLICENSED - Private/Proprietary

## 👤 Author

Luccas Eastman <eastman.luccas@gmail.com>
