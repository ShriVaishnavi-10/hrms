import { createClient } from './src/utils/supabase/server'

async function testDB() {
  const supabase = await createClient()
  console.log('Testing connection to:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  
  const { data, error } = await supabase.from('profiles').select('*').limit(1)
  
  if (error) {
    console.error('Error selecting from profiles:', error.message, error.code, error.details)
  } else {
    console.log('Successfully connected to profiles table. Found:', data.length, 'rows.')
  }
}

testDB()
