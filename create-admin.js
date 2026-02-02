import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hyccxhsbmrpguftdajyb.supabase.co'
const supabaseKey = 'sb_publishable_Xf5zWYMVSQQuMW3eMUJjDA_QHPMG2Rj'
const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
  const email = 'admin@sinemagic.com'
  const password = 'password123'

  console.log(`Attempting to register ${email}...`)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('Error:', error.message)
    
    // If user already exists, try to sign in
    if (error.message.includes('already registered')) {
        console.log('User exists. Trying to sign in...')
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        
        if (signInError) {
            console.error('Sign in failed:', signInError.message)
        } else {
            console.log('Sign in successful! Credentials are valid.')
        }
    }
  } else {
    console.log('Registration successful:', data)
    if (data.session) {
        console.log('Session created! You can log in now.')
    } else if (data.user && !data.session) {
        console.log('User created but email confirmation required.')
        console.log('Please check your email or disable "Confirm email" in Supabase Auth settings.')
    }
  }
}

createAdmin()
