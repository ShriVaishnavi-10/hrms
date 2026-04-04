'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getProfile } from '@/utils/supabase/profiles'

/**
 * Fetches all trainings assigned to the logged-in user.
 */
export async function getMyTrainings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('trainings')
    .select('*')
    .eq('assigned_to', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching surveys:', error)
    return []
  }
  return data
}

/**
 * Assigns a new training to an employee (Admin only).
 */
export async function assignTraining(data: { title: string, description: string, assigned_to: string }) {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('trainings')
    .insert(data)

  if (error) return { error: error.message }

  revalidatePath('/training')
  return { success: true }
}

/**
 * Updates the status of a training assignment.
 */
export async function updateTrainingStatus(id: string, status: 'in_progress' | 'completed', completionUrl?: string) {
  const supabase = await createClient()
  const updates: any = { status }
  
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString()
    if (completionUrl) updates.completion_url = completionUrl
  }

  const { error } = await supabase
    .from('trainings')
    .update(updates)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/training')
  return { success: true }
}
