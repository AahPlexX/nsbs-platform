import { createClient } from '@/utils/supabase/server'

export async function testSupabaseConnection() {
    try {
        console.log('🧪 Testing Supabase connection...')

        const supabase = await createClient()

        // Test basic connection
        const { data: _data, error } = await supabase
            .from('courses')
            .select('count')
            .limit(1)

        if (error) {
            console.error('❌ Supabase connection failed:', error)
            return false
        }

        console.log('✅ Supabase connection successful')
        return true

    } catch (error) {
        console.error('❌ Supabase test error:', error)
        return false
    }
}

export async function testSupabaseAuth() {
    try {
        console.log('🔐 Testing Supabase auth...')

        const supabase = await createClient()

        // Test auth endpoint
        const { data: _data, error } = await supabase.auth.getSession()

        if (error) {
            console.error('❌ Supabase auth test failed:', error)
            return false
        }

        console.log('✅ Supabase auth working')
        return true

    } catch (error) {
        console.error('❌ Supabase auth test error:', error)
        return false
    }
}
