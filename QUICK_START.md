# NSBS Platform - Quick Start Guide

## ⚡ Deploy in 5 Minutes

### ✅ What's Already Done

- ✅ **PNPM** configured (`package.json` + `pnpm-lock.yaml`)
- ✅ **Supabase** setup for auth/RBAC only
- ✅ **Database schema** ready (`database/schema.sql`)
- ✅ **RBAC** implemented (admin | user)
- ✅ **Koyeb** deployment configured
- ✅ **Private** repository
- ✅ **Production-ready** code (no prototypes)

### 🚀 Deployment Steps

#### 1. Set Up Supabase (2 minutes)

```bash
# Go to: https://supabase.com
# Create new project
# Copy these from Settings → API:
# - Project URL
# - anon/public key  
# - service_role key

# Go to SQL Editor and run:
# (Copy from database/schema.sql)
```

#### 2. Deploy to Koyeb (3 minutes)

```bash
# Go to: https://app.koyeb.com
# Click "Create App"
# Connect GitHub: AahPlexX/nsbs-platform
# Branch: main

# Build settings:
Build: pnpm build
Start: pnpm start
Port: 3000

# Add environment variables:
NEXT_PUBLIC_SITE_URL=https://your-app.koyeb.app
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... (mark as secret)

# Click Deploy!
```

#### 3. Configure Supabase Redirects

```bash
# In Supabase: Authentication → URL Configuration
# Add:
Site URL: https://your-app.koyeb.app
Redirect URLs: 
  - https://your-app.koyeb.app/auth/callback
  - https://your-app.koyeb.app/api/auth/callback
```

#### 4. Create Admin User

```sql
-- In Supabase: SQL Editor
-- First create user via Authentication → Users
-- Then run:
UPDATE profiles SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

### ✅ Done!

Your NSBS platform is now live at: `https://your-app.koyeb.app`

---

## 📁 Repository Structure

```
nsbs-platform/
├── app/                    # Next.js pages & API routes
├── components/            # React components  
├── lib/                   # Core utilities
│   ├── supabase/         # Auth clients (server + browser)
│   ├── rbac.ts           # Role-based access control
│   └── courses.ts        # Course data management
├── content/               # Static course content
│   ├── README.md         # Course content guide
│   └── catalog.json      # Course index
├── database/              # Supabase schema
│   └── schema.sql        # Profiles table
├── docs/                  # Documentation
│   └── KOYEB_DEPLOYMENT.md  # Full deployment guide
├── NSBS_STATUS.md        # Production readiness status
└── QUICK_START.md        # This file
```

---

## 📚 Adding Course Content

### Create Your First Course

```bash
# 1. Create course directory
mkdir -p content/courses/your-course-slug

# 2. Create course metadata
cat > content/courses/your-course-slug/index.json << 'EOF'
{
  "slug": "your-course-slug",
  "title": "Your Course Title",
  "description": "Course description",
  "level": "Graduate",
  "status": "published",
  "chapters": [
    {
      "slug": "chapter-01",
      "title": "Introduction",
      "order": 1
    }
  ]
}
EOF

# 3. Create chapter content
cat > content/courses/your-course-slug/chapter-01.md << 'EOF'
---
slug: chapter-01
title: Introduction
order: 1
---

# Introduction

Your course content here...
EOF

# 4. Update catalog
# Edit content/catalog.json to add your course

# 5. Commit and push
git add content/
git commit -m "Add new course"
git push origin main

# Koyeb auto-deploys!
```

See `content/README.md` for complete guide.

---

## 🔐 Admin vs User Access

### Admin Role
- **Free access** to all courses
- No payment required
- No admin UI needed
- Manage via Supabase dashboard

### User Role  
- Standard access
- Default role for new signups
- Access control as you define

---

## 🛠️ Key Files

| File | Purpose |
|------|------|
| `database/schema.sql` | Supabase profiles table |
| `lib/supabase/server.ts` | Server-side Supabase client |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/rbac.ts` | Role checking utilities |
| `lib/courses.ts` | Course data management |
| `app/layout.tsx` | Root layout with NSBS branding |
| `.env.example` | Environment variables template |
| `next.config.mjs` | Next.js configuration |
| `package.json` | PNPM dependencies |

---

## 🐞 Common Issues

### "pnpm: command not found"
**Fix**: Koyeb auto-detects PNPM from `package.json`. Already configured.

### "NEXT_PUBLIC_SUPABASE_URL is not defined"
**Fix**: Add environment variables in Koyeb dashboard.

### "Invalid redirect URL"  
**Fix**: Add Koyeb URL to Supabase redirect URLs (see Step 3).

### "User not found after signup"
**Fix**: Ensure `database/schema.sql` trigger is applied.

---

## 📌 Important Links

- **Repository**: [github.com/AahPlexX/nsbs-platform](https://github.com/AahPlexX/nsbs-platform)
- **Koyeb Dashboard**: [app.koyeb.com](https://app.koyeb.com)
- **Supabase Dashboard**: [app.supabase.com](https://app.supabase.com)
- **Full Deployment Guide**: `docs/KOYEB_DEPLOYMENT.md`
- **Status Document**: `NSBS_STATUS.md`
- **Content Guide**: `content/README.md`

---

## 🔄 Update Workflow

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Koyeb automatically:
# 1. Detects push
# 2. Pulls code
# 3. Rebuilds with PNPM
# 4. Redeploys
# (~2-5 minutes)
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Homepage loads
- [ ] Signup creates user
- [ ] Login works  
- [ ] Dashboard accessible
- [ ] Admin has free course access
- [ ] User sees correct permissions
- [ ] Logout works

---

## 📊 Tech Stack Summary

| Technology | Version | Purpose |
|------------|---------|------|
| Next.js | 15.1.0 | Framework |
| React | 19.0.0 | UI Library |
| TypeScript | 5.7.2 | Type Safety |
| Tailwind CSS | 4.0.0 | Styling |
| Supabase | 2.76.1 | Auth/Database |
| PNPM | 9.0.0+ | Package Manager |
| Koyeb | - | Hosting |

---

## 👨‍💻 Local Development

```bash
# Clone repo
git clone https://github.com/AahPlexX/nsbs-platform.git
cd nsbs-platform

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run dev server
pnpm dev

# Open http://localhost:3000
```

---

## 📞 Need Help?

1. **Deployment Issues**: See `docs/KOYEB_DEPLOYMENT.md`
2. **Course Content**: See `content/README.md`  
3. **Architecture**: See `NSBS_STATUS.md`
4. **Koyeb Docs**: [koyeb.com/docs](https://www.koyeb.com/docs)
5. **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

---

**Status**: ✅ **READY FOR IMMEDIATE DEPLOYMENT**

**Estimated Setup Time**: 5 minutes

**No prototyping**: All code is production-ready
