import { getProfile } from '@/utils/supabase/profiles'
import { getMyExpenses, getPendingExpenses } from './actions'
import { Receipt, ListFilter, ShieldCheck, TrendingUp, Info } from 'lucide-react'
import ExpenseClaimForm from '@/components/Expenses/ExpenseClaimForm'
import ExpenseTracker from '@/components/Expenses/ExpenseTracker'
import ManagerApprovalList from '@/components/Expenses/ManagerApprovalList'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default async function ExpensesPage() {
  const profile = await getProfile()
  const isApprover = profile?.role === 'super_admin' || profile?.role === 'hr_manager' || profile?.role === 'dept_manager'
  
  const myExpenses = await getMyExpenses()
  const pendingExpenses = isApprover ? await getPendingExpenses() : []

  return (
    <DashboardLayout activePage="payroll">
      <div className="space-y-12 pb-20 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm">
                <Receipt className="w-8 h-8 text-primary" />
              </div>
              Expense Management
            </h1>
            <p className="text-muted text-sm font-medium max-w-lg">
              Submit reimbursement claims, upload proofs, and monitor your disbursement status.
            </p>
          </div>
        </div>

        {isApprover && pendingExpenses.length > 0 && (
           <section className="space-y-8 bg-foreground/5 border border-foreground/10 rounded-[2.5rem] p-10 relative overflow-hidden backdrop-blur-md">
              {/* Decorative Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              
              <div className="flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Managerial Resolution Hub</h2>
                 </div>
                 <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-4 py-2 rounded-xl border border-primary/20 animate-pulse">
                    Action Required
                 </span>
              </div>
              
              <div className="relative z-10">
                 <ManagerApprovalList pendingExpenses={pendingExpenses} />
              </div>
           </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-border/50">
           {/* Submit Claim Section */}
           <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <TrendingUp className="w-5 h-5 text-primary" />
                 <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Initiate New Claim</h2>
              </div>
              <ExpenseClaimForm />
              
              <div className="bg-card border border-border rounded-3xl p-8 space-y-4 shadow-sm group">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                       <Info className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest leading-none">Global Policy Reminder</p>
                 </div>
                 <p className="text-xs font-medium text-muted/80 leading-relaxed uppercase tracking-widest italic tracking-widest">
                    All expense claims over $500 require higher-tier executive approvals and detailed itemized receipts.
                 </p>
              </div>
           </div>

           {/* History Section */}
           <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-3">
                    <ListFilter className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Personal Reimbursement History</h2>
                 </div>
                 <div className="h-px bg-border/50 flex-1 mx-6 hidden md:block"></div>
                 <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Global Auditor Log</span>
              </div>
              
              <ExpenseTracker expenses={myExpenses} />
           </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
