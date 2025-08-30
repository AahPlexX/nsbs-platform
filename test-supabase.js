#!/usr/bin/env node

// Simple Node.js script to test Supabase connection
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ckdadactgselrtcgwkqi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZGFkYWN0Z3NlbHJ0Y2d3a3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MDg4NzMsImV4cCI6MjA2Mzk4NDg3M30.L4cjRQmimaZhqcjiL_n5nKst-zf2J_oIcltuQdHoPPA'

async function testSupabase() {
    console.log('🧪 Testing Supabase Connection...')
    console.log('📍 URL:', supabaseUrl)

    const supabase = createClient(supabaseUrl, supabaseKey)

    try {
        // Test 1: Basic connection
        console.log('🔌 Testing basic connection...')
        const { data, error } = await supabase
            .from('courses')
            .select('id, title')
            .limit(1)

        if (error) {
            console.error('❌ Connection failed:', error.message)
            return false
        }

        console.log('✅ Basic connection successful')
        console.log('📊 Sample data:', data)

        // Test 2: Auth status
        console.log('🔐 Testing auth status...')
        const { data: authData, error: authError } = await supabase.auth.getSession()

        if (authError) {
            console.error('❌ Auth test failed:', authError.message)
            return false
        }

        console.log('✅ Auth endpoint working')
        console.log('👤 Current session:', authData.session ? 'Active' : 'None')

        // Test 3: Table structure
        console.log('🗂️ Testing table access...')
        const { data: tableData, error: tableError } = await supabase
            .from('courses')
            .select('*')
            .limit(1)

        if (tableError) {
            console.error('❌ Table access failed:', tableError.message)
            return false
        }

        console.log('✅ Table access successful')
        console.log('📋 Available columns:', tableData?.[0] ? Object.keys(tableData[0]) : 'No data')

        console.log('\n🎉 All Supabase tests passed!')
        return true

    } catch (error) {
        console.error('❌ Unexpected error:', error.message)
        return false
    }
}

testSupabase()
    .then(success => {
        process.exit(success ? 0 : 1)
    })
    .catch(error => {
        console.error('💥 Fatal error:', error)
        process.exit(1)
    })
