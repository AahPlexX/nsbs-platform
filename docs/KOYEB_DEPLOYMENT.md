# Koyeb Deployment Guide for NSBS Platform

## Prerequisites

1. **Koyeb Account**: [Sign up at koyeb.com](https://www.koyeb.com)
2. **Supabase Project**: Already configured with schema applied
3. **GitHub Repository**: `AahPlexX/nsbs-platform` (private)

## Step 1: Prepare Supabase

### Apply Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `database/schema.sql`
4. Execute the SQL to create the profiles table

### Get Environment Variables

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

## Step 2: Deploy to Koyeb

### Connect GitHub Repository

1. Log in to [Koyeb dashboard](https://app.koyeb.com)
2. Click **Create App**
3. Select **GitHub** as deployment source
4. Authorize Koyeb to access your GitHub account
5. Select repository: `AahPlexX/nsbs-platform`
6. Select branch: `main`

### Configure Build Settings

**Builder**: Node.js

**Build configuration**:
```bash
# Install command
pnpm install

# Build command
pnpm build
```

**Run configuration**:
```bash
# Start command
pnpm start

# Port
3000
```

### Add Environment Variables

In the Koyeb app settings, add these environment variables:

| Variable Name | Value | Example |
|---------------|-------|------|
| `NEXT_PUBLIC_SITE_URL` | Your production URL | `https://nsbs-platform.koyeb.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase Settings → API | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase Settings → API | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase Settings → API | `eyJhbGc...` |
| `NODE_ENV` | production | `production` |

**Important**: Mark `SUPABASE_SERVICE_ROLE_KEY` as **secret**!

### Advanced Settings (Optional)

**Resources**:
- **Instance Type**: Nano (for testing) or Small (production)
- **Regions**: Choose closest to your users
- **Scaling**: Configure auto-scaling as needed

**Health Checks**:
- **Path**: `/api/health` (if implemented)
- **Port**: 3000

## Step 3: Deploy

1. Review all settings
2. Click **Deploy**
3. Wait for build to complete (~2-5 minutes)
4. Koyeb will automatically:
   - Clone the repository
   - Install dependencies with PNPM
   - Build Next.js production bundle
   - Start the application
   - Assign a URL

## Step 4: Configure Supabase Redirect URLs

1. Go to Supabase dashboard → **Authentication** → **URL Configuration**
2. Add your Koyeb URL to:
   - **Site URL**: `https://your-app.koyeb.app`
   - **Redirect URLs**: Add these:
     ```
     https://your-app.koyeb.app/auth/callback
     https://your-app.koyeb.app/api/auth/callback
     ```

## Step 5: Create Admin User

### Option 1: Via Supabase Dashboard

1. Go to Supabase → **Authentication** → **Users**
2. Click **Add User**
3. Fill in email and password
4. After user is created, go to **Table Editor** → **profiles**
5. Find the user's profile row
6. Change `role` from `user` to `admin`
7. Save

### Option 2: Via SQL Editor

```sql
-- First, create the user in auth.users via Supabase dashboard
-- Then update their role:
UPDATE profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

## Step 6: Verify Deployment

### Test Checklist

- [ ] Homepage loads at your Koyeb URL
- [ ] Sign up creates new user
- [ ] Login works correctly
- [ ] User redirected to dashboard after login
- [ ] Admin user has free access to content
- [ ] Regular user sees appropriate access restrictions
- [ ] Logout works correctly

### Check Logs

1. In Koyeb dashboard, go to your app
2. Click **Logs** tab
3. Look for any errors or warnings

### Test IPv6 Direct Connection

```bash
# Check if Supabase connection is working
curl https://your-app.koyeb.app/api/health
```

## Troubleshooting

### Build Fails

**Error**: `pnpm: command not found`
- **Solution**: Koyeb should auto-detect PNPM from `package.json`. If not, contact Koyeb support.

**Error**: `Module not found`
- **Solution**: Ensure `pnpm-lock.yaml` is committed to repository

### Runtime Errors

**Error**: `NEXT_PUBLIC_SUPABASE_URL is not defined`
- **Solution**: Double-check environment variables in Koyeb dashboard
- Make sure variables start with `NEXT_PUBLIC_` for client-side access

**Error**: `Failed to connect to Supabase`
- **Solution**: Verify Supabase credentials are correct
- Check Supabase project is not paused
- Confirm IPv6 connectivity (should work automatically on Koyeb)

### Authentication Issues

**Error**: `Invalid redirect URL`
- **Solution**: Add Koyeb URL to Supabase redirect URLs (Step 4)

**Error**: `User not found after signup`
- **Solution**: Check that database trigger is working:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```

## Updating Deployment

Koyeb automatically redeploys when you push to the `main` branch:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Koyeb will automatically:
# 1. Detect the push
# 2. Pull latest code
# 3. Rebuild and redeploy
```

## Domain Setup (Optional)

### Add Custom Domain

1. In Koyeb dashboard, go to your app
2. Click **Domains** tab
3. Click **Add Domain**
4. Enter your domain (e.g., `nsbs.org`)
5. Follow DNS configuration instructions
6. Update `NEXT_PUBLIC_SITE_URL` environment variable
7. Update Supabase redirect URLs

## Monitoring

### Koyeb Dashboard

- **Metrics**: CPU, memory, and network usage
- **Logs**: Real-time application logs
- **Health**: Service health status

### Set Up Alerts (Recommended)

1. Go to app settings → **Alerts**
2. Configure notifications for:
   - Deployment failures
   - High error rates
   - Resource limits

## Scaling

### Manual Scaling

1. Go to app settings → **Scaling**
2. Adjust:
   - **Instances**: Number of running instances
   - **Instance size**: Nano, Small, Medium, Large

### Auto-Scaling

Configure auto-scaling based on:
- CPU usage
- Memory usage
- Request rate

## Security Best Practices

- ✅ Use environment variables for all secrets
- ✅ Keep `SUPABASE_SERVICE_ROLE_KEY` secret (never expose to client)
- ✅ Use HTTPS only (Koyeb default)
- ✅ Enable Supabase RLS policies
- ✅ Regularly update dependencies
- ✅ Monitor logs for suspicious activity

## Cost Optimization

- Start with **Nano** instance for testing
- Upgrade to **Small** for production
- Enable auto-scaling only if needed
- Monitor resource usage regularly

## Backup Strategy

1. **Code**: Backed up in GitHub
2. **Database**: Enable Supabase daily backups
3. **Environment Variables**: Document in secure location

## Support

- **Koyeb Docs**: [koyeb.com/docs](https://www.koyeb.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Deployment Time**: ~5 minutes

**Status**: ✅ Ready for production deployment
