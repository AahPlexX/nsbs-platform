import { testSupabaseAuth, testSupabaseConnection } from '@/lib/test-supabase'

export async function GET() {
    const results = {
        connection: false,
        auth: false,
        timestamp: new Date().toISOString()
    }

    try {
        results.connection = await testSupabaseConnection()
        results.auth = await testSupabaseAuth()

        return Response.json({
            success: results.connection && results.auth,
            results,
            message: results.connection && results.auth
                ? 'All Supabase tests passed ✅'
                : 'Some Supabase tests failed ❌'
        })
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            results,
            message: 'Supabase test failed with exception ❌'
        }, { status: 500 })
    }
}
