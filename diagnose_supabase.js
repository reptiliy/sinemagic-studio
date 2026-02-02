
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hyccxhsbmrpguftdajyb.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_Xf5zWYMVSQQuMW3eMUJjDA_QHPMG2Rj'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testConnection() {
  console.log('Testing connection to:', SUPABASE_URL)
  console.log('Using Key:', SUPABASE_ANON_KEY)

  try {
    const { data, error } = await supabase.from('products').select('*').limit(1)
    if (error) {
      console.error('❌ Connection Failed:', error.message)
      console.error('Error Code:', error.code)
      console.error('Details:', error.details)
    } else {
      console.log('✅ Connection Successful!')
      console.log('Data found:', data ? data.length : 0)
    }
  } catch (err) {
    console.error('❌ Unexpected Error:', err)
  }
}

testConnection()
