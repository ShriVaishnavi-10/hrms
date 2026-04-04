import { getProfile } from '@/utils/supabase/profiles'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import AttendanceSummary from '@/components/Attendance/AttendanceSummary'
import AttendanceReports from '@/components/Attendance/AttendanceReports'
import AttendanceHistory from '@/components/Attendance/AttendanceHistory'
import { Clock, BarChart3, History } from 'lucide-react'

export default async function AttendancePage() {
  const profile = await getProfile()
  const role = profile?.role || 'employee'
  const isAdmin = role === 'super_admin' || role === 'hr_manager'

  return (
    <DashboardLayout activePage="attendance">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl text-primary font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Attendance Tracking</h2>
        </div>
        <p className="text-muted font-bold text-xs uppercase tracking-widest ml-1">
          Monitor punctuality and view performance metrics.
        </p>
      </header>

      <div className="space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Monthly Overview</h3>
            </div>
            <AttendanceSummary />
          </section>

          {isAdmin && (
            <section className="space-y-6 lg:row-span-2">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Reporting Center</h3>
              </div>
              <AttendanceReports />
            </section>
          )}

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-primary" />
              <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Detailed Logs</h3>
            </div>
            <AttendanceHistory />
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
