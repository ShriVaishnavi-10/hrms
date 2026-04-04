'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getProfile } from '@/utils/supabase/profiles'

/**
 * Submits a resignation/exit request.
 */
export async function submitExitRequest(data: { reason: string, last_working_day: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('exit_requests')
    .insert({
      user_id: user.id,
      ...data,
      status: 'pending'
    })

  if (error) return { error: error.message }

  revalidatePath('/exit')
  return { success: true }
}

/**
 * Fetches the exit request for the logged-in user.
 */
export async function getMyExitRequest() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('exit_requests')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) return null
  return data
}

/**
 * Fetches all pending exit requests for manager approval.
 */
export async function getPendingExits() {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager' && profile.role !== 'dept_manager')) {
    return []
  }

  const { data, error } = await supabase
    .from('exit_requests')
    .select(`
       *,
       profile:user_id(full_name, designation)
    `)
    .eq('status', 'pending')

  if (error) {
    console.error('Error fetching pending exits:', error)
    return []
  }
  return data
}

/**
 * Resolves an exit request (Approve/Reject).
 */
export async function resolveExitRequest(id: string, status: 'approved' | 'rejected', manager_feedback?: string) {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager' && profile.role !== 'dept_manager')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('exit_requests')
    .update({
      status,
      manager_feedback,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/exit')
  return { success: true }
}
