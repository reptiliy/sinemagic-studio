
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hyccxhsbmrpguftdajyb.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_Xf5zWYMVSQQuMW3eMUJjDA_QHPMG2Rj'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function diagnose() {
  console.log('--- DIAGNOSTIC START ---')

  // 1. Check Products
  console.log('\nChecking Products...')
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, name, is_visible, image')
  
  if (prodError) {
    console.error('❌ Products Error:', prodError.message)
  } else {
    console.log(`✅ Found ${products.length} products.`)
    products.forEach(p => {
      console.log(` - [${p.is_visible ? 'VISIBLE' : 'HIDDEN'}] ${p.name} (${p.id})`)
      console.log(`   Image: ${p.image ? p.image.substring(0, 50) + '...' : 'NULL'}`)
    })
  }

  // 2. Check Sections
  console.log('\nChecking Sections...')
  const { data: sections, error: sectError } = await supabase
    .from('sections')
    .select('id, is_visible')

  if (sectError) {
    console.error('❌ Sections Error:', sectError.message)
  } else {
    console.log(`✅ Found ${sections.length} sections.`)
    sections.forEach(s => {
      console.log(` - [${s.is_visible ? 'VISIBLE' : 'HIDDEN'}] ${s.id}`)
    })
  }

  console.log('\n--- DIAGNOSTIC END ---')
}

diagnose()
