import { createClient } from '@/utils/supabase/server'
import { getProfile } from '@/utils/supabase/profiles'
import { 
  History, 
  Clock, 
  ShieldCheck, 
  CalendarRange, 
  PlusCircle 
} from 'lucide-react'
import Link from 'next/link'

// Attendance Components
import ClockWidget from '@/components/Attendance/ClockWidget'
import AttendanceHistory from '@/components/Attendance/AttendanceHistory'
import ManualEntryForm from '@/components/Attendance/ManualEntryForm'
import ManagerApprovalList from '@/components/Attendance/ManagerApprovalList'

// Actions
import { getTodayAttendance, getPendingRequests } from '@/app/attendance/actions'

// Shared Layout
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default async function Home() {
  const profile = await getProfile()
  const role = profile?.role || 'employee'
  const isAdmin = role === 'super_admin' || role === 'hr_manager'
  const isManager = role === 'dept_manager'

  // Fetch Attendance Data
  const todayAttendance = await getTodayAttendance()
  const pendingAttendanceRequests = (isAdmin || isManager) ? await getPendingRequests() : []

  return (
    <DashboardLayout activePage="dashboard">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight uppercase">Dashboard</h2>
          <p className="text-muted font-bold text-xs uppercase tracking-widest leading-none flex items-center gap-2">
             Welcome Back, <span className="text-primary font-black">{profile?.full_name?.split(' ')[0] || 'User'}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/leaves" 
            className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5"
          >
             <CalendarRange className="w-4 h-4" />
             Apply for Leave
          </Link>
        </div>
      </header>

      {/* Manager Attendance Approvals Section */}
      {(isAdmin || isManager) && pendingAttendanceRequests.length > 0 && (
        <section className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
           <ManagerApprovalList requests={pendingAttendanceRequests} />
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left/Main Column: Activity & Manual Entry */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary font-bold">
                  <History className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Recent Activity</h3>
              </div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Attendance Logs</p>
            </div>
            <AttendanceHistory />
          </section>

          {role !== 'super_admin' && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl text-primary font-bold">
                   <PlusCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Manual Adjustment</h3>
              </div>
              <ManualEntryForm />
            </section>
          )}
        </div>

        {/* Right/Sidebar: Tools & Info */}
        <div className="space-y-10">
          {/* Clock Tool */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Attendance Tool</h3>
            </div>
            <ClockWidget initialAttendance={todayAttendance} />
          </section>

          {/* Policy Info */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Work Policy</h3>
            </div>
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm group">
              <div className="space-y-6">
                <div className="flex justify-between items-center py-2 border-b border-border/50 group-hover:border-primary/20 transition-all">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-[0.1em]">Office Hours</span>
                  <span className="text-xs font-black text-foreground">10:00 AM - 07:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50 group-hover:border-primary/20 transition-all">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-[0.1em]">Grace Period</span>
                  <span className="text-xs font-black text-foreground">15 Minutes</span>
                </div>
                <div className="flex justify-between items-center py-4">
                   <p className="text-[10px] text-muted-foreground italic leading-relaxed text-center w-full bg-primary/5 p-4 rounded-2xl border border-primary/10">
                    * Super Admins are exempt from late marking. Regular staff are marked 'Late' after 10:15 AM.
                   </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
