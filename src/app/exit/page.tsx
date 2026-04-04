import { getProfile } from '@/utils/supabase/profiles'
import { getMyExitRequest, getPendingExits } from './actions'
import { LogOut, ShieldAlert, FileWarning, Info, Trash2, HeartHandshake, History } from 'lucide-react'
import ExitRequestForm from '@/components/Exit/ExitRequestForm'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default async function ExitPage() {
  const profile = await getProfile()
  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'hr_manager' || profile?.role === 'dept_manager'
  
  const myExit = await getMyExitRequest()
  const pendingExits = isAdmin ? await getPendingExits() : []

  return (
    <DashboardLayout activePage="recruitment">
      <div className="space-y-16 pb-20 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 shadow-sm">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              Separation & Offboarding
            </h1>
            <p className="text-muted text-sm font-medium max-w-lg">
              Manage professional transitions, resignation protocols, and global institutional offboarding workflows.
            </p>
          </div>
        </div>

        <section className="space-y-10">
           <div className="flex items-center gap-3 px-2">
              <History className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Transition Protocol Status</h2>
           </div>
           <ExitRequestForm isAdmin={isAdmin} existingRequest={myExit} pendingExits={pendingExits} />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12 border-t border-border/50">
           <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trash2 className="w-24 h-24 rotate-12" />
              </div>
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Identity Termination</p>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-widest leading-relaxed">
                 Access to global HRMS assets will be synchronized with your final working day.
              </h4>
           </div>
           <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <HeartHandshake className="w-24 h-24 -rotate-12" />
              </div>
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Mutual Resolution</p>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-widest leading-relaxed">
                 The institutional separation is designed for professional continuity and legal compliance.
              </h4>
           </div>
           <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldAlert className="w-24 h-24 rotate-12" />
              </div>
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Global Security</p>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-widest leading-relaxed">
                 All security clearances and identity keys are revoked upon offboarding finalization.
              </h4>
           </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
