'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getProfile } from '@/utils/supabase/profiles'

/**
 * Fetches salary structure for a specific employee.
 */
export async function getSalaryStructure(employeeId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('salary_structures')
    .select('*')
    .eq('user_id', employeeId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching salary structure:', error.message)
    return null
  }
  return data
}

/**
 * Sets or updates an employee's salary structure (Admin only).
 */
export async function updateSalaryStructure(employeeId: string, data: { basic: number, hra: number, conveyance: number, allowances: number, total_ctc: number }) {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('salary_structures')
    .upsert({
      user_id: employeeId,
      ...data,
      updated_at: new Date().toISOString()
    })

  if (error) return { error: error.message }

  revalidatePath('/payroll')
  revalidatePath(`/employees/${employeeId}`)
  return { success: true }
}

/**
 * Processes payroll for the current month for all active employees.
 */
export async function processPayroll(month: number, year: number) {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager')) {
    return { error: 'Unauthorized' }
  }

  // 1. Fetch all salary structures
  const { data: structures, error: structError } = await supabase
    .from('salary_structures')
    .select('*')

  if (structError) return { error: structError.message }

  // 2. Generate payroll records
  const payrollRecords = structures.map(struct => {
    const gross = Number(struct.total_ctc) / 12
    const tax = gross * 0.1 // Standard 10% tax deduction
    const net = gross - tax

    return {
      user_id: struct.user_id,
      month,
      year,
      gross_salary: gross,
      tax_deduction: tax,
      net_salary: net,
      payment_status: 'pending'
    }
  })

  // 3. Batch insert (Upsert to avoid duplicates for the same month/year)
  const { error: insertError } = await supabase
    .from('payroll_records')
    .upsert(payrollRecords, { onConflict: 'user_id,month,year' })

  if (insertError) return { error: insertError.message }

  revalidatePath('/payroll')
  return { success: true }
}

/**
 * Fetches payroll history for the current user.
 */
export async function getMyPayroll() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('payroll_records')
    .select('*')
    .eq('user_id', user.id)
    .order('year', { ascending: false })
    .order('month', { ascending: false })

  if (error) {
    console.error('Error fetching my payroll:', error)
    return []
  }

  return data
}
