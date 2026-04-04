'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getProfile } from '@/utils/supabase/profiles'

/**
 * Job Postings Management
 */
export async function getJobs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching jobs:', error.message)
    return []
  }
  return data
}

export async function createJob(data: { title: string, description: string, department: string, location: string, type: string }) {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('jobs')
    .insert(data)

  if (error) return { error: error.message }

  revalidatePath('/recruitment')
  return { success: true }
}

export async function updateJobStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('jobs')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/recruitment')
  return { success: true }
}

/**
 * Applicant Tracking
 */
export async function getApplicants(jobId?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('applicants')
    .select(`
       *,
       job:job_id(title, department)
    `)
    .order('created_at', { ascending: false })

  if (jobId) {
    query = query.eq('job_id', jobId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching applicants:', error.message)
    return []
  }
  return data
}

export async function updateApplicantStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('applicants')
    .update({ status })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/recruitment')
  return { success: true }
}

/**
 * Interview Scheduling
 */
export async function scheduleInterview(data: { applicant_id: string, interviewer_id: string, scheduled_at: string }) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('interviews')
    .insert({
      ...data,
      status: 'scheduled'
    })

  if (error) return { error: error.message }

  // Automatically update applicant status to 'interview'
  await updateApplicantStatus(data.applicant_id, 'interview')

  revalidatePath('/recruitment')
  return { success: true }
}

export async function getInterviews() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('interviews')
    .select(`
       *,
       applicant:applicant_id(full_name, email),
       interviewer:interviewer_id(full_name, designation)
    `)
    .order('scheduled_at', { ascending: true })

  if (error) {
    console.error('Error fetching interviews:', error.message)
    return []
  }
  return data
}
