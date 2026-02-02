import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hyccxhsbmrpguftdajyb.supabase.co'
const supabaseKey = 'sb_publishable_Xf5zWYMVSQQuMW3eMUJjDA_QHPMG2Rj'
const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
  const email = 'admin2@sinemagic.com'
  const password = 'password123'

  console.log(`Attempting to register ${email}...`)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log('Registration successful!')
    if (data.session) {
        console.log('SUCCESS: Session created automatically. Email confirmation is OFF.')
    } else if (data.user && !data.session) {
        console.log('WARNING: User created but no session. Email confirmation might still be ON or required for this project tier.')
    }
  }
}

createAdmin()
