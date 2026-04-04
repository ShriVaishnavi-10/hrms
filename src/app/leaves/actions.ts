'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getProfile } from '@/utils/supabase/profiles'

/**
 * Submits a new leave request for the current user.
 */
export async function applyForLeave(data: { type: string, startDate: string, endDate: string, reason: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('leaves')
    .insert({
      user_id: user.id,
      type: data.type,
      start_date: data.startDate,
      end_date: data.endDate,
      reason: data.reason,
      status: 'pending'
    })

  if (error) return { error: error.message }

  revalidatePath('/')
  return { success: true }
}

/**
 * Fetches leave balances for the current user.
 * Initializes with defaults if not found.
 */
export async function getLeaveBalances() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const currentYear = new Date().getFullYear()
  
  let { data, error } = await supabase
    .from('leave_balances')
    .select('*')
    .eq('user_id', user.id)
    .eq('year', currentYear)

  if (error) {
    console.error('Error fetching leave balances:', error)
    return []
  }

  // If no balances found, initialize them
  if (!data || data.length === 0) {
    const defaults = [
      { user_id: user.id, leave_type: 'sick', total_days: 12, used_days: 0, year: currentYear },
      { user_id: user.id, leave_type: 'casual', total_days: 12, used_days: 0, year: currentYear },
      { user_id: user.id, leave_type: 'paid', total_days: 15, used_days: 0, year: currentYear },
    ]
    const { data: inserted, error: insError } = await supabase
      .from('leave_balances')
      .insert(defaults)
      .select()
    
    if (insError) console.error('Error initializing balances:', insError)
    else data = inserted
  }

  return data || []
}

/**
 * Fetches leave history for the current user.
 */
export async function getLeaveHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('leaves')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching leave history:', error)
    return []
  }

  return data
}

/**
 * Fetches both approved leaves and holidays for a calendar view.
 */
export async function getLeaveCalendar(month: number, year: number) {
  const supabase = await createClient()
  
  const startDate = new Date(year, month - 1, 1).toISOString()
  const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()

  // Fetch approved leaves
  const { data: leaves, error: lError } = await supabase
    .from('leaves')
    .select('*, profiles(full_name)')
    .eq('status', 'approved')
    .gte('start_date', startDate.split('T')[0])
    .lte('start_date', endDate.split('T')[0])

  // Fetch holidays
  const { data: holidays, error: hError } = await supabase
    .from('holidays')
    .select('*')
    .gte('date', startDate.split('T')[0])
    .lte('date', endDate.split('T')[0])

  return {
    leaves: leaves || [],
    holidays: holidays || []
  }
}

/**
 * Fetches all pending leave requests (Admin/Manager only).
 */
export async function getPendingLeaves() {
  const supabase = await createClient()
  const callerProfile = await getProfile()

  if (!callerProfile || (callerProfile.role !== 'super_admin' && callerProfile.role !== 'hr_manager' && callerProfile.role !== 'dept_manager')) {
    return []
  }

  const { data, error } = await supabase
    .from('leaves')
    .select('*, profiles!leaves_user_id_fkey(full_name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`CRITICAL DB ERROR: ${error.message} | Details: ${error.details} | Hint: ${error.hint}`)
    return []
  }

  return data
}

/**
 * Approves or Rejects a leave request.
 * If approved, updates the leave_balances table.
 */
export async function resolveLeave(id: string, newStatus: 'approved' | 'rejected') {
  const supabase = await createClient()
  const callerProfile = await getProfile()

  if (!callerProfile || (callerProfile.role !== 'super_admin' && callerProfile.role !== 'hr_manager' && callerProfile.role !== 'dept_manager')) {
    return { error: 'Unauthorized' }
  }

  // Get the leave request details first
  const { data: leave, error: fetchError } = await supabase
    .from('leaves')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !leave) return { error: 'Leave request not found' }

  // Start Transaction (using RPC or sequential calls - Supabase doesn't have multi-table transactions in client SDK easily)
  // We'll update the leave status first
  const { error } = await supabase
    .from('leaves')
    .update({ 
      status: newStatus,
      approved_by: callerProfile.id
    })
    .eq('id', id)

  if (error) return { error: error.message }

  // If approved, update balance
  if (newStatus === 'approved') {
    const start = new Date(leave.start_date)
    const end = new Date(leave.end_date)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    const { error: balError } = await supabase.rpc('increment_leave_used', {
      u_id: leave.user_id,
      l_type: leave.type.toLowerCase(),
      days: diffDays,
      l_year: start.getFullYear()
    })

    // If RPC fails (e.g. not created yet), we fallback or ignore for now, 
    // but ideally we should have the RPC in Supabase.
    // Let's do a manual update for now if RPC is not preferred, but RPC is safer.
    if (balError) {
       console.error('RPC failed, falling back to manual update:', balError)
       // Manual update fallback
       const { data: bal } = await supabase
         .from('leave_balances')
         .select('used_days')
         .eq('user_id', leave.user_id)
         .eq('leave_type', leave.type.toLowerCase())
         .eq('year', start.getFullYear())
         .single()
       
       if (bal) {
         await supabase
           .from('leave_balances')
           .update({ used_days: (bal.used_days || 0) + diffDays })
           .eq('user_id', leave.user_id)
           .eq('leave_type', leave.type.toLowerCase())
           .eq('year', start.getFullYear())
       }
    }
  }

  revalidatePath('/')
  return { success: true }
}
