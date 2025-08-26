-- NSBS Platform Database Seeding
-- Sample data for development and testing

-- Insert admin user (this will be created after first OAuth login)
-- The actual user record will be created by Supabase Auth
-- This is just a placeholder for the admin role assignment

-- Sample course data will be loaded from file system
-- No course data is stored in database - only progress tracking

-- Sample test data for development
-- Note: These are placeholder UUIDs for development only

-- Insert sample admin user profile (replace with actual UUID after first login)
-- INSERT INTO public.users (id, email, full_name, role) 
-- VALUES ('00000000-0000-0000-0000-000000000001', 'admin@nsbs-certified.com', 'NSBS Administrator', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Sample certificate number sequence
-- Certificate numbers follow format: NSBS-YYYY-NNNNNN
-- Example: NSBS-2025-000001

-- Create a function to generate certificate numbers
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
DECLARE
    current_year TEXT;
    next_number INTEGER;
    certificate_number TEXT;
BEGIN
    current_year := EXTRACT(YEAR FROM NOW())::TEXT;
    
    -- Get the next sequential number for this year
    SELECT COALESCE(MAX(
        CASE 
            WHEN certificate_number LIKE 'NSBS-' || current_year || '-%' 
            THEN CAST(SUBSTRING(certificate_number FROM 11) AS INTEGER)
            ELSE 0
        END
    ), 0) + 1
    INTO next_number
    FROM public.certificates;
    
    -- Format as NSBS-YYYY-NNNNNN
    certificate_number := 'NSBS-' || current_year || '-' || LPAD(next_number::TEXT, 6, '0');
    
    RETURN certificate_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate certificate numbers
CREATE OR REPLACE FUNCTION set_certificate_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.certificate_number IS NULL THEN
        NEW.certificate_number := generate_certificate_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_certificate_number
    BEFORE INSERT ON public.certificates
    FOR EACH ROW
    EXECUTE FUNCTION set_certificate_number();

-- Sample development data (commented out for production)
/*
-- Sample purchase for testing
INSERT INTO public.purchases (id, user_id, course_slug, amount_paid, status, stripe_payment_intent_id)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000001',
    'business-analytics',
    29900, -- $299.00
    'completed',
    'pi_test_1234567890'
) ON CONFLICT DO NOTHING;

-- Sample course progress
INSERT INTO public.course_progress (user_id, course_slug, purchase_id, total_lessons, progress_percentage)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'business-analytics',
    '11111111-1111-1111-1111-111111111111',
    10,
    100
) ON CONFLICT DO NOTHING;

-- Sample exam attempt
INSERT INTO public.exam_attempts (
    user_id, 
    course_slug, 
    attempt_number, 
    questions, 
    user_answers, 
    score, 
    passed, 
    time_taken_minutes,
    started_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'business-analytics',
    1,
    '[]'::jsonb,
    '[]'::jsonb,
    92,
    true,
    45,
    NOW() - INTERVAL '1 hour'
) ON CONFLICT DO NOTHING;
*/

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant limited permissions to anonymous users (for certificate verification)
GRANT SELECT ON public.certificates TO anon;
GRANT SELECT ON public.certificate_verifications TO anon;
GRANT INSERT ON public.certificate_verifications TO anon;
