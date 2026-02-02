import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hyccxhsbmrpguftdajyb.supabase.co'
const supabaseKey = 'sb_publishable_Xf5zWYMVSQQuMW3eMUJjDA_QHPMG2Rj'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    const { data, error } = await supabase.from('test').select('*').limit(1)
    if (error) {
      // If table doesn't exist, we might get a 404 or specific error, but connection is OK if it's not 401
      console.log('Connection test result:', error.message, error.code)
    } else {
      console.log('Connection successful, data:', data)
    }
    
    // Test Auth (check session)
    const { data: authData, error: authError } = await supabase.auth.getSession()
    console.log('Auth check:', authError ? authError.message : 'Session OK')
    
  } catch (e) {
    console.error('Unexpected error:', e)
  }
}

testConnection()
