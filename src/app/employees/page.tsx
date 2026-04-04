import { createClient } from '@/utils/supabase/server'
import { getProfile } from '@/utils/supabase/profiles'
import { redirect } from 'next/navigation'
import { Users } from 'lucide-react'
import EmployeeDirectory from '@/components/Employees/EmployeeDirectory'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default async function EmployeesPage() {
  const supabase = await createClient()
  const currentProfile = await getProfile()

  if (!currentProfile) {
    return redirect('/login')
  }

  // Fetch all profiles for the directory
  let query = supabase.from('profiles').select('*')
  
  if (currentProfile.role !== 'super_admin' && currentProfile.role !== 'hr_manager') {
    query = query.eq('is_public', true)
  }

  const { data: employees, error } = await query.order('full_name', { ascending: true })

  if (error) {
    console.error('Error fetching employees:', error)
  }

  return (
    <DashboardLayout activePage="employees">
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm">
                <Users className="w-8 h-8 text-primary" />
              </div>
              Employee Directory
            </h1>
            <p className="text-muted text-sm font-medium max-w-lg">
              Find and connect with your colleagues across all departments and roles.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-2xl font-black text-foreground">{employees?.length || 0}</p>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Total Staff</p>
             </div>
          </div>
        </div>

        {/* Interactive Directory Component */}
        <EmployeeDirectory employees={employees || []} />
      </div>
    </DashboardLayout>
  )
}
