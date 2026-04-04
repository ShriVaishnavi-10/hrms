import { getProfile } from '@/utils/supabase/profiles'
import { getPendingLeaves } from '@/app/leaves/actions'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import LeaveRequestForm from '@/components/Leaves/LeaveRequestForm'
import LeaveHistory from '@/components/Leaves/LeaveHistory'
import ManagerLeaveApproval from '@/components/Leaves/ManagerLeaveApproval'
import LeaveBalanceCard from '@/components/Leaves/LeaveBalanceCard'
import LeaveCalendar from '@/components/Leaves/LeaveCalendar'
import { CalendarRange, Info, BarChart3, Calendar } from 'lucide-react'

export default async function LeavesPage() {
  const profile = await getProfile()
  const role = profile?.role || 'employee'
  const isAdmin = role === 'super_admin' || role === 'hr_manager'
  const isManager = role === 'dept_manager'

  // Fetch Leave Data
  const pendingLeaveRequests = (isAdmin || isManager) ? await getPendingLeaves() : []

  return (
    <DashboardLayout activePage="leaves">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl text-primary font-bold">
            <CalendarRange className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Leave Management</h2>
        </div>
        <p className="text-muted font-bold text-xs uppercase tracking-widest ml-1">
           Submit time-off requests and track your leave balance.
        </p>
      </header>

      <div className="space-y-10">
        {/* Manager Approvals Section */}
        {(isAdmin || isManager) && pendingLeaveRequests.length > 0 && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-500">
            <ManagerLeaveApproval pendingLeaves={pendingLeaveRequests} />
          </section>
        )}

        {/* Leave Overview: Calendar & Balances */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                 <Calendar className="w-5 h-5 text-primary" />
                 <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Absence Calendar</h3>
              </div>
              <LeaveCalendar />
           </div>
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <BarChart3 className="w-5 h-5 text-primary" />
                 <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Your Balances</h3>
              </div>
              <LeaveBalanceCard />
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start pt-10 border-t border-border/50">
          {/* Main Content: History */}
          <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
             <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Application History</h3>
             </div>
             <LeaveHistory />
          </div>

          {/* Sidebar: Request Form & Policy */}
          <div className="space-y-8 order-1 lg:order-2">
             <div className="flex items-center gap-3">
                <CalendarRange className="w-5 h-5 text-primary" />
                <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Request Time-Off</h3>
             </div>
             
             {role !== 'super_admin' ? (
                <LeaveRequestForm />
             ) : (
                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 text-center space-y-4">
                   <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                      <Info className="w-6 h-6" />
                   </div>
                   <p className="text-xs font-bold text-primary uppercase tracking-widest leading-relaxed">
                      Super Admin Mode
                   </p>
                   <p className="text-[10px] text-muted-foreground font-medium italic">
                      As a Super Admin, you are exempt from formal leave requests. Your dashboard is focused on approvals and management.
                   </p>
                </div>
             )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
