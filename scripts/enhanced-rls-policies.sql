-- Enhanced Row Level Security (RLS) Policies
-- National Society of Business Sciences Certification Platform
-- Production-ready security enhancements
-- Created: 2025-01-19

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is support or admin
CREATE OR REPLACE FUNCTION auth.is_support_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role IN ('admin', 'support')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user owns a purchase
CREATE OR REPLACE FUNCTION auth.user_owns_purchase(purchase_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.purchases 
        WHERE id = purchase_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies to replace with enhanced versions
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own user_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own user_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own user_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own purchases" ON public.purchases;
DROP POLICY IF EXISTS "System can insert purchases" ON public.purchases;
DROP POLICY IF EXISTS "System can update purchases" ON public.purchases;
DROP POLICY IF EXISTS "Users can view own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can view own completions" ON public.lesson_completions;
DROP POLICY IF EXISTS "Users can insert own completions" ON public.lesson_completions;
DROP POLICY IF EXISTS "Users can view own attempts" ON public.exam_attempts;
DROP POLICY IF EXISTS "Users can insert own attempts" ON public.exam_attempts;
DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public can verify certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public can view verifications" ON public.certificate_verifications;
DROP POLICY IF EXISTS "System can insert verifications" ON public.certificate_verifications;
DROP POLICY IF EXISTS "Admins can view admin actions" ON public.admin_actions;
DROP POLICY IF EXISTS "Admins can insert admin actions" ON public.admin_actions;

-- ===== ENHANCED USERS TABLE POLICIES =====
-- Users can view their own profile
CREATE POLICY "users_select_own" ON public.users FOR SELECT 
USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "users_select_admin" ON public.users FOR SELECT 
USING (auth.is_admin());

-- Users can update their own profile (except role)
CREATE POLICY "users_update_own" ON public.users FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id 
    AND (
        OLD.role = NEW.role -- Role unchanged
        OR auth.is_admin() -- Or user is admin
    )
);

-- Only admins can change user roles
CREATE POLICY "users_update_role_admin" ON public.users FOR UPDATE 
USING (auth.is_admin())
WITH CHECK (auth.is_admin());

-- Users are created through Supabase Auth triggers
CREATE POLICY "users_insert_auth" ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- ===== ENHANCED USER PROFILES POLICIES =====
-- Users can view their own profile
CREATE POLICY "user_profiles_select_own" ON public.user_profiles FOR SELECT 
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "user_profiles_select_admin" ON public.user_profiles FOR SELECT 
USING (auth.is_admin());

-- Users can update their own profile
CREATE POLICY "user_profiles_update_own" ON public.user_profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can create their own profile
CREATE POLICY "user_profiles_insert_own" ON public.user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- ===== ENHANCED PURCHASES POLICIES =====
-- Users can view their own purchases
CREATE POLICY "purchases_select_own" ON public.purchases FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all purchases
CREATE POLICY "purchases_select_admin" ON public.purchases FOR SELECT 
USING (auth.is_admin());

-- Only authenticated users can create purchases (via API)
CREATE POLICY "purchases_insert_authenticated" ON public.purchases FOR INSERT 
WITH CHECK (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
);

-- Only admins and the purchase owner can update purchases
CREATE POLICY "purchases_update_admin_or_owner" ON public.purchases FOR UPDATE 
USING (
    auth.is_admin() 
    OR auth.uid() = user_id
)
WITH CHECK (
    auth.is_admin() 
    OR (auth.uid() = user_id AND OLD.user_id = NEW.user_id) -- Prevent user_id changes
);

-- ===== ENHANCED COURSE PROGRESS POLICIES =====
-- Users can view their own progress
CREATE POLICY "course_progress_select_own" ON public.course_progress FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all progress
CREATE POLICY "course_progress_select_admin" ON public.course_progress FOR SELECT 
USING (auth.is_admin());

-- Users can update their own progress if they own the purchase
CREATE POLICY "course_progress_update_own" ON public.course_progress FOR UPDATE 
USING (
    auth.uid() = user_id 
    AND auth.user_owns_purchase(purchase_id)
)
WITH CHECK (
    auth.uid() = user_id 
    AND auth.user_owns_purchase(purchase_id)
);

-- Users can create progress for their own purchases
CREATE POLICY "course_progress_insert_own" ON public.course_progress FOR INSERT 
WITH CHECK (
    auth.uid() = user_id 
    AND auth.user_owns_purchase(purchase_id)
);

-- ===== ENHANCED LESSON COMPLETIONS POLICIES =====
-- Users can view their own completions
CREATE POLICY "lesson_completions_select_own" ON public.lesson_completions FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all completions
CREATE POLICY "lesson_completions_select_admin" ON public.lesson_completions FOR SELECT 
USING (auth.is_admin());

-- Users can insert their own completions (only if they have access to the course)
CREATE POLICY "lesson_completions_insert_own" ON public.lesson_completions FOR INSERT 
WITH CHECK (
    auth.uid() = user_id 
    AND EXISTS (
        SELECT 1 FROM public.purchases p 
        WHERE p.user_id = auth.uid() 
        AND p.course_slug = NEW.course_slug 
        AND p.status = 'completed'
    )
);

-- ===== ENHANCED EXAM ATTEMPTS POLICIES =====
-- Users can view their own exam attempts
CREATE POLICY "exam_attempts_select_own" ON public.exam_attempts FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all exam attempts
CREATE POLICY "exam_attempts_select_admin" ON public.exam_attempts FOR SELECT 
USING (auth.is_admin());

-- Users can insert their own exam attempts (only if they have access and haven't exceeded limits)
CREATE POLICY "exam_attempts_insert_own" ON public.exam_attempts FOR INSERT 
WITH CHECK (
    auth.uid() = user_id 
    AND EXISTS (
        SELECT 1 FROM public.purchases p 
        WHERE p.user_id = auth.uid() 
        AND p.course_slug = NEW.course_slug 
        AND p.status = 'completed'
    )
    AND (
        SELECT COUNT(*) FROM public.exam_attempts ea 
        WHERE ea.user_id = auth.uid() 
        AND ea.course_slug = NEW.course_slug
    ) < 2 -- Maximum 2 attempts per course
);

-- No updates to exam attempts (immutable once submitted)

-- ===== ENHANCED CERTIFICATES POLICIES =====
-- Users can view their own certificates
CREATE POLICY "certificates_select_own" ON public.certificates FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all certificates
CREATE POLICY "certificates_select_admin" ON public.certificates FOR SELECT 
USING (auth.is_admin());

-- Public can view non-revoked certificates for verification
CREATE POLICY "certificates_select_public_verification" ON public.certificates FOR SELECT 
USING (
    revoked_at IS NULL 
    AND certificate_number IS NOT NULL
);

-- Only admins can insert certificates (generated after successful exam)
CREATE POLICY "certificates_insert_admin" ON public.certificates FOR INSERT 
WITH CHECK (auth.is_admin());

-- Only admins can update certificates (for revocation)
CREATE POLICY "certificates_update_admin" ON public.certificates FOR UPDATE 
USING (auth.is_admin())
WITH CHECK (auth.is_admin());

-- ===== ENHANCED CERTIFICATE VERIFICATIONS POLICIES =====
-- Public can view verifications (for transparency)
CREATE POLICY "certificate_verifications_select_public" ON public.certificate_verifications FOR SELECT 
USING (true);

-- Anyone can insert verifications (logging access)
CREATE POLICY "certificate_verifications_insert_public" ON public.certificate_verifications FOR INSERT 
WITH CHECK (true);

-- ===== ENHANCED ADMIN ACTIONS POLICIES =====
-- Only admins can view admin actions
CREATE POLICY "admin_actions_select_admin" ON public.admin_actions FOR SELECT 
USING (auth.is_admin());

-- Only admins can insert admin actions
CREATE POLICY "admin_actions_insert_admin" ON public.admin_actions FOR INSERT 
WITH CHECK (
    auth.is_admin() 
    AND auth.uid() = admin_user_id
);

-- ===== ADDITIONAL SECURITY CONSTRAINTS =====
-- Ensure authenticated users exist in users table
CREATE POLICY "require_user_record" ON public.users FOR ALL 
USING (
    CASE 
        WHEN auth.uid() IS NULL THEN true -- Allow public access where explicitly permitted
        ELSE EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid())
    END
);

-- ===== SECURITY FUNCTIONS FOR API USAGE =====
-- Function to check if user has completed a course
CREATE OR REPLACE FUNCTION public.user_has_completed_course(course_slug TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.purchases p 
        WHERE p.user_id = auth.uid() 
        AND p.course_slug = course_slug 
        AND p.status = 'completed'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can take exam
CREATE OR REPLACE FUNCTION public.user_can_take_exam(course_slug TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.user_has_completed_course(course_slug)
    AND (
        SELECT COUNT(*) FROM public.exam_attempts 
        WHERE user_id = auth.uid() AND course_slug = course_slug
    ) < 2;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's remaining exam attempts
CREATE OR REPLACE FUNCTION public.get_remaining_exam_attempts(course_slug TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN 2 - (
        SELECT COUNT(*) FROM public.exam_attempts 
        WHERE user_id = auth.uid() AND course_slug = course_slug
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== ENABLE RLS ON ALL TABLES =====
-- Ensure RLS is enabled (should already be done in create-tables.sql)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- ===== GRANT NECESSARY PERMISSIONS =====
-- Grant usage on auth schema functions
GRANT USAGE ON SCHEMA auth TO authenticated, anon;
GRANT EXECUTE ON FUNCTION auth.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.is_support_or_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.user_owns_purchase(UUID) TO authenticated;

-- Grant usage on public functions
GRANT EXECUTE ON FUNCTION public.user_has_completed_course(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.user_can_take_exam(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_remaining_exam_attempts(TEXT) TO authenticated;

-- Additional security: Prevent bypass attempts
-- Revoke public access to sensitive tables
REVOKE ALL ON public.users FROM anon;
REVOKE ALL ON public.user_profiles FROM anon;
REVOKE ALL ON public.purchases FROM anon;
REVOKE ALL ON public.course_progress FROM anon;
REVOKE ALL ON public.lesson_completions FROM anon;
REVOKE ALL ON public.exam_attempts FROM anon;
REVOKE ALL ON public.admin_actions FROM anon;

-- Allow only specific access for certificates and verifications
GRANT SELECT ON public.certificates TO anon; -- For public verification
GRANT SELECT, INSERT ON public.certificate_verifications TO anon; -- For logging verifications
