import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Check if session exists before logging out
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}
