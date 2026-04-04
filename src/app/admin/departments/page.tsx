import { getDepartments, getAllEmployees } from '@/app/employees/actions'
import { getProfile } from '@/utils/supabase/profiles'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import DepartmentClient from './DepartmentClient'

export default async function AdminDepartmentsPage() {
  const profile = await getProfile()
  
  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager')) {
    return redirect('/')
  }

  const departments = await getDepartments()
  const employees = await getAllEmployees()

  return (
    <DashboardLayout activePage="admin">
      <div className="max-w-7xl mx-auto px-6">
        <DepartmentClient departments={departments} employees={employees} />
      </div>
    </DashboardLayout>
  )
}
