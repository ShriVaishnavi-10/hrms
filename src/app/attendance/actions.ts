'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getProfile } from '@/utils/supabase/profiles'

/**
 * Clocks in the current user.
 * Logic: Mark as 'late' if after 10:00 AM.
 */
export async function clockIn(locationData: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Check if they already clocked in today
  const today = new Date().toISOString().split('T')[0]
  const { data: existing } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', user.id)
    .gte('clock_in', `${today}T00:00:00`)
    .maybeSingle()

  if (existing) return { error: 'Already clocked in for today.' }

  // Calculate status (10:00 AM)
  const now = new Date()
  const tenAM = new Date()
  tenAM.setHours(10, 0, 0, 0)
  
  const callerProfile = await getProfile()
  const status = (callerProfile?.role === 'super_admin' || now <= tenAM) ? 'on_time' : 'late'

  const { error } = await supabase
    .from('attendance')
    .insert({
      user_id: user.id,
      clock_in: now.toISOString(),
      status: status,
      location: locationData,
    })

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/attendance')
  return { success: true }
}

/**
 * Clocks out the current user.
 * Verified: Ensures the calling user owns the attendance record.
 */
export async function clockOut(attendanceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const now = new Date()

  // Verify ownership before updating (Security + Logic)
  const { data: record, error: fetchError } = await supabase
    .from('attendance')
    .select('user_id')
    .eq('id', attendanceId)
    .single()

  if (fetchError || record.user_id !== user.id) {
    return { error: 'Unauthorized: Attendance record not found or inaccessible.' }
  }

  const { error } = await supabase
    .from('attendance')
    .update({ 
      clock_out: now.toISOString(),
    })
    .eq('id', attendanceId)

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/attendance')
  return { success: true }
}

/**
 * Fetches today's attendance record for the current user.
 */
export async function getTodayAttendance() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', user.id)
    .gte('clock_in', `${today}T00:00:00`)
    .order('clock_in', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) console.error('Error fetching today attendance:', error)
  return data
}

/**
 * Requests a manual entry (for approval)
 */
export async function requestManualEntry(data: { clockIn: string, clockOut: string, reason: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('attendance')
    .insert({
      user_id: user.id,
      clock_in: data.clockIn,
      clock_out: data.clockOut,
      status: 'pending_approval',
      is_manual: true
    })

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/attendance')
  return { success: true }
}

/**
 * Fetches all pending manual attendance requests (Admin only)
 */
export async function getPendingRequests() {
  const supabase = await createClient()
  const callerProfile = await getProfile()

  if (!callerProfile || (callerProfile.role !== 'super_admin' && callerProfile.role !== 'hr_manager')) {
    return []
  }

  const { data, error } = await supabase
    .from('attendance')
    .select('*, profiles(full_name)')
    .eq('status', 'pending_approval')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pending requests:', error)
    return []
  }

  return data
}

/**
 * Approves or Rejects a manual attendance request.
 */
export async function resolveAttendanceRequest(id: string, newStatus: 'on_time' | 'rejected') {
  const supabase = await createClient()
  const callerProfile = await getProfile()

  if (!callerProfile || (callerProfile.role !== 'super_admin' && callerProfile.role !== 'hr_manager')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('attendance')
    .update({ 
      status: newStatus,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/attendance')
  return { success: true }
}

/**
 * Fetches attendance summary for a specific month/year for the current user.
 */
export async function getAttendanceSummary(month: number, year: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const startDate = new Date(year, month - 1, 1).toISOString()
  const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()

  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', user.id)
    .gte('clock_in', startDate)
    .lte('clock_in', endDate)
    .order('clock_in', { ascending: true })

  if (error) {
    console.error('Error fetching attendance summary:', error)
    return []
  }

  return data
}

/**
 * Fetches attendance reports for admins/managers.
 * Filters for 'late' or 'early_out' status.
 */
export async function getAttendanceReport(startDate: string, endDate: string, type: 'late' | 'early_out' | 'all' = 'all') {
  const supabase = await createClient()
  const callerProfile = await getProfile()

  if (!callerProfile || (callerProfile.role !== 'super_admin' && callerProfile.role !== 'hr_manager')) {
    return []
  }

  let query = supabase
    .from('attendance')
    .select('*, profiles(full_name, department)')
    .gte('clock_in', startDate)
    .lte('clock_in', endDate)

  if (type === 'late') {
    query = query.eq('status', 'late')
  }

  const { data, error } = await query.order('clock_in', { ascending: false })

  if (error) {
    console.error('Error fetching attendance report:', error)
    return []
  }

  return data
}
