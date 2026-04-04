'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getProfile } from '@/utils/supabase/profiles'

/**
 * Submits a new expense claim.
 */
export async function submitExpenseClaim(data: { title: string, amount: number, category: string, receipt_url?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('expenses')
    .insert({
      user_id: user.id,
      ...data,
      status: 'pending'
    })

  if (error) return { error: error.message }

  revalidatePath('/expenses')
  return { success: true }
}

/**
 * Fetches expense claims for the logged-in user.
 */
export async function getMyExpenses() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching my expenses:', error.message)
    return []
  }

  return data
}

/**
 * Fetches all pending expenses for manager approval.
 */
export async function getPendingExpenses() {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager' && profile.role !== 'dept_manager')) {
    return []
  }

  const { data, error } = await supabase
    .from('expenses')
    .select(`
       *,
       profile:user_id(full_name, designation)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pending expenses:', error.message)
    return []
  }

  return data
}

/**
 * Resolves an expense claim (Approve/Reject).
 */
export async function resolveExpenseClaim(id: string, status: 'approved' | 'rejected') {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager' && profile.role !== 'dept_manager')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('expenses')
    .update({
      status,
      approved_by: profile.id,
      reimbursed_at: status === 'approved' ? new Date().toISOString() : null
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/expenses')
  return { success: true }
}
