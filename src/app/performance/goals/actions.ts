'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getProfile } from '@/utils/supabase/profiles'

/**
 * Fetches goals for the current user.
 */
export async function getGoals() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('performance_goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching goals:', error)
    return []
  }

  return data
}

/**
 * Fetches goals for a specific employee (Admin/Manager only).
 */
export async function getEmployeeGoals(employeeId: string) {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager' && profile.role !== 'dept_manager')) {
    return []
  }

  const { data, error } = await supabase
    .from('performance_goals')
    .select('*')
    .eq('user_id', employeeId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching employee goals:', error)
    return []
  }

  return data
}

/**
 * Adds a new performance goal.
 */
export async function addGoal(data: { user_id: string, title: string, description?: string, type: string, target_value: number, start_date: string, end_date: string }) {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager' && profile.role !== 'dept_manager')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('performance_goals')
    .insert(data)

  if (error) return { error: error.message }

  revalidatePath('/performance')
  return { success: true }
}

/**
 * Updates the current value of a goal.
 */
export async function updateGoalProgress(id: string, newValue: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('performance_goals')
    .update({ 
        current_value: newValue,
        status: newValue >= 100 ? 'completed' : 'active' // assuming 100 is max or we compare with target
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/performance')
  return { success: true }
}

/**
 * Deletes a goal (Admin/Manager only).
 */
export async function deleteGoal(id: string) {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('performance_goals')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/performance')
  return { success: true }
}
