import { getProfile } from '@/utils/supabase/profiles'
import { getEmployeeFullProfile, getAllEmployees, getDepartments } from '../employees/actions'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const profile = await getProfile()
  
  if (!profile) {
    return redirect('/login')
  }

  // Fetch full details of the logged-in user
  const employee = await getEmployeeFullProfile(profile.id)
  const isAdmin = profile.role === 'super_admin' || profile.role === 'hr_manager'

  // Only fetch full list if Admin, otherwise keep empty for security
  const allEmployees = isAdmin ? await getAllEmployees() : []
  const allDepartments = isAdmin ? await getDepartments() : []

  return (
    <DashboardLayout activePage="settings">
      <div className="max-w-7xl mx-auto px-6">
        <SettingsClient 
          employee={employee} 
          isAdmin={isAdmin} 
          allEmployees={allEmployees} 
          allDepartments={allDepartments}
        />
      </div>
    </DashboardLayout>
  )
}
