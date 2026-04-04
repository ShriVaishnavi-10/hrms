import { createClient } from '@/utils/supabase/server'
import { getProfile } from '@/utils/supabase/profiles'
import { getSalaryStructure, getMyPayroll } from './actions'
import { getAllEmployees } from '@/app/employees/actions'
import { ReceiptCent, Calculator, History, TrendingUp, Users, Info } from 'lucide-react'
import SalaryStructure from '@/components/Payroll/SalaryStructure'
import PayrollSummary from '@/components/Payroll/PayrollSummary'
import PayslipCard from '@/components/Payroll/PayslipCard'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default async function PayrollPage() {
  // Optimized: Parallel data fetching for payroll dashboard
  const [profile, myPayroll] = await Promise.all([
    getProfile(),
    getMyPayroll()
  ])

  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'hr_manager'
  
  const [myStructure, allEmployees, { data: employeesWithStructures }] = await Promise.all([
    getSalaryStructure(profile?.id || ''),
    isAdmin ? getAllEmployees() : Promise.resolve([]),
    (async () => {
      if (!isAdmin) return { data: [] }
      const supabase = await createClient()
      return await supabase.from('profiles').select('*, salary_structures(*)').not('salary_structures', 'is', null)
    })()
  ])

  return (
    <DashboardLayout activePage="payroll">
      <div className="space-y-12 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm">
                <ReceiptCent className="w-8 h-8 text-primary" />
              </div>
              Payroll & Compensation
            </h1>
            <p className="text-muted text-sm font-medium max-w-lg">
              Manage your salary structures, view monthly earnings, and track tax deductions.
            </p>
          </div>
        </div>

        {isAdmin && (
           <div className="space-y-12">
              <section className="space-y-6">
                 <div className="flex items-center gap-3 px-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Executive Payroll Overview</h2>
                 </div>
                 <PayrollSummary employeesWithStructures={employeesWithStructures || []} />
              </section>

              <section className="space-y-6">
                 <div className="flex items-center gap-3 px-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Manage Staff Compensation</h2>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Placeholder for employee selection if needed, but for now we show current user structure as example/main tool */}
                    <SalaryStructure employeeId={profile?.id || ''} existingData={myStructure} />
                    <div className="bg-muted/5 border-2 border-dashed border-border rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-4">
                       <Info className="w-12 h-12 text-muted/40" />
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Compliance Requirement</p>
                          <p className="text-xs font-bold text-muted/60 uppercase italic tracking-widest max-w-[280px]">
                             Updates to salary structures are logged for auditing and tax compliance purposes.
                          </p>
                       </div>
                    </div>
                 </div>
              </section>
           </div>
        )}

        {/* User Specific Section */}
        <div className="pt-12 border-t border-border/50">
           <section className="space-y-8">
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-black text-foreground uppercase tracking-tight">My Earnings History</h2>
                 </div>
                 <span className="text-[10px] font-bold text-muted uppercase tracking-widest bg-muted/10 px-4 py-1.5 rounded-full border border-border">
                    Digital Payslips
                 </span>
              </div>

              {myPayroll.length === 0 ? (
                 <div className="py-24 flex flex-col items-center justify-center bg-card border border-border rounded-[2.5rem] shadow-sm opacity-60">
                    <History className="w-16 h-16 text-muted mb-4 opacity-20" />
                    <p className="text-xs font-bold text-muted uppercase tracking-widest italic tracking-widest">No historical payroll found for this account.</p>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {myPayroll.map((record) => (
                      <PayslipCard key={record.id} record={record} />
                   ))}
                </div>
              )}
           </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
