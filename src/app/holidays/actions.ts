'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getProfile } from '@/utils/supabase/profiles'

/**
 * Fetches all holidays for the current year.
 */
export async function getHolidays(year: number = new Date().getFullYear()) {
  const supabase = await createClient()
  
  const startDate = `${year}-01-01`
  const endDate = `${year}-12-31`

  const { data, error } = await supabase
    .from('holidays')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching holidays:', error)
    return []
  }

  return data
}

/**
 * Adds a new holiday (Admin only).
 */
export async function addHoliday(data: { name: string, date: string, type: string, description?: string }) {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('holidays')
    .insert(data)

  if (error) return { error: error.message }

  revalidatePath('/holidays')
  revalidatePath('/leaves')
  return { success: true }
}

/**
 * Deletes a holiday (Admin only).
 */
export async function deleteHoliday(id: string) {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('holidays')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/holidays')
  revalidatePath('/leaves')
  return { success: true }
}
