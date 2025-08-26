-- RLS Policy Validation Tests
-- Test script to validate Row Level Security policies
-- Run this after applying enhanced-rls-policies.sql

-- Test 1: Verify RLS is enabled on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'users', 'user_profiles', 'purchases', 'course_progress',
    'lesson_completions', 'exam_attempts', 'certificates', 
    'certificate_verifications', 'admin_actions'
)
ORDER BY tablename;

-- Test 2: Check all policies exist
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test 3: Verify helper functions exist
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_schema IN ('auth', 'public')
AND routine_name IN (
    'is_admin', 'is_support_or_admin', 'user_owns_purchase',
    'user_has_completed_course', 'user_can_take_exam', 
    'get_remaining_exam_attempts'
)
ORDER BY routine_name;

-- Test 4: Verify indexes for performance
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN (
    'users', 'user_profiles', 'purchases', 'course_progress',
    'lesson_completions', 'exam_attempts', 'certificates', 
    'certificate_verifications', 'admin_actions'
)
ORDER BY tablename, indexname;

-- Test 5: Check table permissions
SELECT 
    table_schema,
    table_name,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND table_name IN (
    'users', 'user_profiles', 'purchases', 'course_progress',
    'lesson_completions', 'exam_attempts', 'certificates', 
    'certificate_verifications', 'admin_actions'
)
ORDER BY table_name, grantee, privilege_type;

-- Test 6: Validate foreign key constraints
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- Test 7: Security function test queries (requires actual user context)
-- These would be run in the application context:

/*
-- Test as regular user
SELECT public.user_has_completed_course('business-fundamentals');
SELECT public.user_can_take_exam('business-fundamentals');
SELECT public.get_remaining_exam_attempts('business-fundamentals');

-- Test admin functions
SELECT auth.is_admin();
SELECT auth.is_support_or_admin();

-- Test data access
SELECT * FROM public.users WHERE id = auth.uid();
SELECT * FROM public.purchases WHERE user_id = auth.uid();
*/

-- Summary report
SELECT 
    'RLS Security Audit Summary' as audit_type,
    COUNT(DISTINCT tablename) as tables_with_rls,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE schemaname = 'public';

COMMENT ON SCRIPT IS 'Run this script to validate that all RLS policies are properly configured and security is enabled';
