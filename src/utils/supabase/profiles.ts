import { createClient } from './server'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // 1. Try to fetch the profile
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 2. If no profile exists (PGRST116), create one on the fly (Self-Healing)
  if (error && error.code === 'PGRST116') {
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        role: 'employee'
      })
      .select('*')
      .single()

    if (createError) {
      const msg = `CODE: ${(createError as any).code} | MESSAGE: ${(createError as any).message} | DETAILS: ${(createError as any).details} | HINT: ${(createError as any).hint}`;
      console.error('CRITICAL_FAILED_TO_SELF_HEAL_PROFILE:', msg);
      return null
    }
    return newProfile
  }

  if (error) {
    const msg = `CODE: ${(error as any).code} | MESSAGE: ${(error as any).message} | DETAILS: ${(error as any).details}`;
    console.error('DATABASE_ERROR_FETCHING_PROFILE:', msg);
    return null
  }

  return data
}

export type Profile = {
  id: string
  full_name: string | null
  role: 'super_admin' | 'hr_manager' | 'dept_manager' | 'employee'
  department: string | null
  designation: string | null
  avatar_url: string | null
}
