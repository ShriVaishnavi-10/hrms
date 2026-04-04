'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getProfile } from '@/utils/supabase/profiles'

/**
 * Fetches a full employee profile with its reporting manager and department details.
 */
export async function getEmployeeFullProfile(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      manager:manager_id(id, full_name, designation)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching full profile:', error)
    return null
  }

  return data
}

/**
 * Updates an employee profile's personal and professional details.
 * Protected: Only Admins/HR can modify others' profiles.
 */
export async function updateEmployeeProfile(id: string, updates: any) {
  const supabase = await createClient()
  const caller = await getProfile()
  
  // Security Check: Only Admin/HR or the self-user can update.
  // Note: RLS handles the deep security, but this is a first-pass check.
  const isSelf = caller?.id === id
  const isAdmin = caller?.role === 'super_admin' || caller?.role === 'hr_manager'
  
  if (!isSelf && !isAdmin) {
    return { error: 'Unauthorized profile update attempt.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/employees/${id}`)
  revalidatePath('/employees')
  return { success: true }
}

/**
 * Fetches all profiles for simplified selection (e.g. Manager identification).
 */
export async function getAllEmployees() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, designation')
    .order('full_name', { ascending: true })

  if (error) return []
  return data
}

/**
 * Fetches all departments for selection dropdowns.
 */
export async function getDepartments() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('departments')
    .select(`
      *,
      head:head_profile_id(id, full_name, designation)
    `)
    .order('name', { ascending: true })

  if (error) return []
  return data
}

/**
 * Management: Create a new organizational department.
 */
export async function createDepartment(name: string, costCenter?: string) {
  const supabase = await createClient()
  const caller = await getProfile()

  if (caller?.role !== 'super_admin' && caller?.role !== 'hr_manager') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('departments')
    .insert({ name, cost_center: costCenter })

  if (error) return { error: error.message }

  revalidatePath('/admin/departments')
  return { success: true }
}

/**
 * Management: Update an existing organizational department.
 */
export async function updateDepartment(id: string, updates: any) {
  const supabase = await createClient()
  const caller = await getProfile()

  if (caller?.role !== 'super_admin' && caller?.role !== 'hr_manager') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('departments')
    .update(updates)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/departments')
  return { success: true }
}

/**
 * Management: Delete an organizational department.
 */
export async function deleteDepartment(id: string) {
  const supabase = await createClient()
  const caller = await getProfile()

  if (caller?.role !== 'super_admin' && caller?.role !== 'hr_manager') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/departments')
  return { success: true }
}

/**
 * Handles profile picture and document metadata updates.
 */
export async function updateEmployeeAttachments(id: string, type: 'avatar' | 'document', url: string, metadata?: any) {
  const supabase = await createClient()
  
  if (type === 'avatar') {
    return await updateEmployeeProfile(id, { avatar_url: url })
  } else {
    // Append to documents JSONB array securely
    const profile = await getEmployeeFullProfile(id)
    const currentDocs = Array.isArray(profile?.documents) ? profile.documents : []
    const newDocs = [...currentDocs, { url, ...metadata, date: new Date().toISOString() }]
    
    return await updateEmployeeProfile(id, { documents: newDocs })
  }
}

/**
 * Account Security: Update the logged-in user's password.
 */
export async function updatePassword(newPassword: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) return { error: error.message }
  return { success: true }
}

/**
 * Privacy: Toggle whether an employee's profile is visible in the public directory.
 */
export async function updateProfileVisibility(id: string, isPublic: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('profiles')
    .update({ is_public: isPublic })
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath(`/employees/${id}`)
  revalidatePath('/employees')
  revalidatePath('/settings')
  return { success: true }
}

/**
 * Career: Update the employee's certifications list.
 */
export async function updateEmployeeCertifications(id: string, certifications: any[]) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('profiles')
    .update({ certifications })
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath(`/employees/${id}`)
  revalidatePath('/settings')
  return { success: true }
}
