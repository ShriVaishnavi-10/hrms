'use server'

import { createClient } from '@/utils/supabase/server'
import { getProfile } from '@/utils/supabase/profiles'
import { revalidatePath } from 'next/cache'

/**
 * Updates a user's role.
 * Only allows 'super_admin' or 'hr_manager' to perform this action.
 */
export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createClient()
  const callerProfile = await getProfile()

  if (!callerProfile || (callerProfile.role !== 'super_admin' && callerProfile.role !== 'hr_manager')) {
    return { error: 'Unauthorized: Only Admins can change roles.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('SERVER_ACTION_UPDATE_ROLE_ERROR:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  revalidatePath('/', 'layout') // Ensure dashboard also updates
  return { success: true }
}

/**
 * Updates a user's department and designation.
 * Only allows 'super_admin' or 'hr_manager' to perform this action.
 */
export async function updateUserAssignment(userId: string, data: { department?: string, designation?: string }) {
  const supabase = await createClient()
  const callerProfile = await getProfile()

  if (!callerProfile || (callerProfile.role !== 'super_admin' && callerProfile.role !== 'hr_manager')) {
    return { error: 'Unauthorized: Only Admins can assign departments.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)

  if (error) {
    console.error('Error updating assignment:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

/**
 * Deactivates a user (Deletes their profile and potentially auth account).
 * For now, just deletes from profiles table.
 */
export async function deleteUser(userId: string) {
  const supabase = await createClient()
  const callerProfile = await getProfile()

  if (!callerProfile || callerProfile.role !== 'super_admin') {
    return { error: 'Unauthorized: Only Super Admins can delete users.' }
  }

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}
