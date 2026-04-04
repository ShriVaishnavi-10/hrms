'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getProfile } from '@/utils/supabase/profiles'

/**
 * Fetches appraisals for the current user.
 */
export async function getMyAppraisals() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('performance_appraisals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching appraisals:', error)
    return []
  }

  return data
}

/**
 * Fetches all appraisals for manager review.
 */
export async function getPendingAppraisals() {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager' && profile.role !== 'dept_manager')) {
    return []
  }

  const { data, error } = await supabase
    .from('performance_appraisals')
    .select('*, profiles(full_name, department, designation)')
    .eq('status', 'self_done')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pending appraisals:', error)
    return []
  }

  return data
}

/**
 * Initiates a new appraisal cycle (Admin only).
 */
export async function initiateAppraisal(employeeId: string, period: string) {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('performance_appraisals')
    .insert({
      user_id: employeeId,
      manager_id: profile.id,
      period: period,
      status: 'initiated'
    })

  if (error) return { error: error.message }

  revalidatePath('/performance')
  return { success: true }
}

/**
 * Submits self-assessment (Employee).
 */
export async function submitSelfAssessment(appraisalId: string, rating: number, feedback: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('performance_appraisals')
    .update({ 
        self_rating: rating,
        self_feedback: feedback,
        status: 'self_done',
        updated_at: new Date().toISOString()
    })
    .eq('id', appraisalId)

  if (error) return { error: error.message }

  revalidatePath('/performance')
  return { success: true }
}

/**
 * Submits manager review (Manager).
 */
export async function submitManagerReview(appraisalId: string, rating: number, feedback: string) {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager' && profile.role !== 'dept_manager')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('performance_appraisals')
    .update({ 
        manager_rating: rating,
        manager_feedback: feedback,
        status: 'completed',
        updated_at: new Date().toISOString()
    })
    .eq('id', appraisalId)

  if (error) return { error: error.message }

  revalidatePath('/performance')
  return { success: true }
}

/**
 * Submits feedback for a 360-degree request.
 */
export async function submitPeerFeedback(requestId: string, rating: number, feedback: string) {
   const supabase = await createClient()
   
   const { error } = await supabase
     .from('feedback_requests')
     .update({
        rating: rating,
        feedback: feedback,
        status: 'submitted'
     })
     .eq('id', requestId)

   if (error) return { error: error.message }

   revalidatePath('/performance')
   return { success: true }
}

/**
 * Fetches all feedback for a specific appraisal.
 */
export async function getAppraisalFeedback(appraisalId: string) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('feedback_requests')
      .select('*, profiles!feedback_requests_from_user_id_fkey(full_name)')
      .eq('appraisal_id', appraisalId)

    if (error) {
        console.error('Error fetching feedback requests:', error)
        return []
    }

    return data
}
