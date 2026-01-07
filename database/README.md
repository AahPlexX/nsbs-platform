# Database Setup

## Schema Overview

The NSBS platform uses Supabase **only for authentication and user profiles**. All course content is stored as static files in the repository.

### Tables

1. **profiles** - User profiles with RBAC
   - `id` (UUID, FK to auth.users)
   - `role` ('admin' | 'user')
   - `created_at`
   - `updated_at`

### Roles

- **admin**: Full access to all course content without payment
- **user**: Standard user, requires payment/enrollment for courses

## Setup Instructions

1. Go to Supabase Dashboard → SQL Editor
2. Run `schema.sql`
3. Configure Auth providers:
   - Enable Magic Link (default)
   - Enable Google OAuth (add credentials)
4. **Disable** password authentication

## Koyeb IPv6 Connection

Koyeb supports direct IPv6 connections to Supabase. No connection pooling required.

## Making a User Admin

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'user-uuid-here';
```