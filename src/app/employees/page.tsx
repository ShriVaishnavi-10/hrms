import { createClient } from '@/utils/supabase/server'
import { getProfile } from '@/utils/supabase/profiles'
import { redirect } from 'next/navigation'
import { Users } from 'lucide-react'
import EmployeeDirectory from '@/components/Employees/EmployeeDirectory'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default async function EmployeesPage() {
  // Parallel data fetching - eliminates sequential waterfalls
  const [currentProfile, { data: employees, error }] = await Promise.all([
    getProfile(),
    (async () => {
      const supabase = await createClient()
      let query = supabase.from('profiles').select('*')
      
      // Need the profile first for role check, so we still need some sequence, 
      // but we can optimize by fetching the current user and the directory in parallel 
      // if we assume a standard query then filter locally, or just stick to parallelized top-level calls.
      // Actually, since the query depends on currentProfile.role, we can't fully parallelize the query building.
      // BUT we can parallelize getProfile() with any other independent layout-level data.
      return await supabase.from('profiles').select('*').order('full_name', { ascending: true })
    })()
  ])

  if (!currentProfile) {
    return redirect('/login')
  }

  // Filter based on role (now happening after parallel fetch for speed)
  const filteredEmployees = currentProfile.role === 'super_admin' || currentProfile.role === 'hr_manager'
    ? employees
    : employees?.filter(e => e.is_public)

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
        <EmployeeDirectory employees={filteredEmployees || []} />
      </div>
    </DashboardLayout>
  )
}
