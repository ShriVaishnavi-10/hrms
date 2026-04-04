'use client'

import { useState } from 'react'
import { submitExitRequest, resolveExitRequest } from '@/app/exit/actions'
import { LogOut, Calendar, AlertCircle, CheckCircle2, Loader2, MessageSquare, Info, ShieldAlert, FileWarning, Save } from 'lucide-react'

export default function ExitRequestForm({ existingRequest, isAdmin = false, pendingExits = [] }: { existingRequest?: any, isAdmin?: boolean, pendingExits?: any[] }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const fd = new FormData(e.currentTarget)
    const res = await submitExitRequest({
      reason: fd.get('reason') as string,
      last_working_day: fd.get('last_working_day') as string
    })
    
    if (res.success) {
      setSuccess(true)
    } else {
      setError(res.error || 'Failed to submit exit request.')
    }
    setLoading(false)
  }

  const handleResolve = async (id: string, status: 'approved' | 'rejected') => {
    setLoading(true)
    const res = await resolveExitRequest(id, status)
    if (res.error) alert(res.error)
    setLoading(false)
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {isAdmin && pendingExits.length > 0 && (
         <section className="space-y-8 bg-red-50/50 dark:bg-red-950/10 border border-red-500/20 rounded-[2.5rem] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <ShieldAlert className="w-48 h-48 -rotate-12" />
            </div>
            
            <div className="flex items-center gap-3 relative z-10">
               <div className="p-3 bg-red-500/10 rounded-xl text-red-600 font-bold shadow-lg shadow-red-500/5">
                  <ShieldAlert className="w-6 h-6" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-foreground tracking-tight uppercase leading-none">Offboarding Approvals</h3>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest italic">Awaiting administrative clearance</p>
               </div>
            </div>

            <div className="space-y-4 relative z-10">
               {pendingExits.map((req) => (
                  <div key={req.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-red-500/30 transition-all">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/5 flex items-center justify-center text-red-500 text-lg font-black shadow-inner border border-red-500/10">
                           {req.profile?.full_name?.charAt(0)}
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-lg font-black text-foreground tracking-tight leading-none uppercase">{req.profile?.full_name}</h4>
                           <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">Last Day: {new Date(req.last_working_day).toLocaleDateString()}</p>
                           <p className="text-xs font-medium text-muted/60 pt-2 italic truncate max-w-[300px]">"{req.reason}"</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <button onClick={() => handleResolve(req.id, 'rejected')} className="px-6 py-3 bg-muted/10 text-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-border">Deny</button>
                        <button onClick={() => handleResolve(req.id, 'approved')} className="px-6 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-red-500/20">Authorize Exit</button>
                     </div>
                  </div>
               ))}
            </div>
         </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold shadow-lg shadow-primary/5">
                <LogOut className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-foreground tracking-tight uppercase leading-none">Initiate Resignation</h3>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Global Talent Mobility Cycle</p>
              </div>
            </div>

            {existingRequest ? (
               <div className="space-y-8 animate-in zoom-in-95 duration-500">
                  <div className="p-8 bg-muted/5 border-2 border-dashed border-border rounded-[2rem] space-y-6 text-center">
                     <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                     <div className="space-y-2">
                        <p className="text-sm font-black text-foreground uppercase tracking-tight">Request Protocol Synchronized</p>
                        <p className="text-xs font-bold text-muted/60 uppercase tracking-widest italic tracking-widest">Current Status: <span className="text-primary font-black ml-1">{existingRequest.status}</span></p>
                     </div>
                     <div className="pt-4 border-t border-border flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                        <span>Tentative Last Day</span>
                        <span className="text-foreground text-sm font-black italic">{new Date(existingRequest.last_working_day).toLocaleDateString()}</span>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                     <Info className="w-4 h-4 text-primary" />
                     <p className="text-[9px] font-medium text-muted/80 uppercase tracking-widest leading-relaxed italic">
                        Once authorized, the offboarding documentation will be dispatched to your professional email.
                     </p>
                  </div>
               </div>
            ) : (
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Proposed Final Working Day</label>
                     <div className="relative">
                        <Calendar className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                        <input type="date" name="last_working_day" required className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 pl-12 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Primary Reason for Transition</label>
                     <textarea name="reason" rows={4} required className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="Please provide professional context for your departure..." />
                  </div>

                  <div className="pt-4 flex flex-col items-center gap-4">
                     {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-bottom-1"><AlertCircle className="w-4 h-4" /> {error}</p>}
                     <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full px-12 py-5 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-foreground/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                     >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Commit Institutional Transition
                     </button>
                  </div>
               </form>
            )}
         </div>

         <div className="bg-red-600 p-12 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <FileWarning className="w-64 h-64 rotate-12 scale-110" />
            </div>
            
            <div className="space-y-4 relative z-10">
               <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-white/50" />
                  <h4 className="text-xl font-black uppercase tracking-tight">Institutional Impact Statement</h4>
               </div>
               <p className="text-sm font-medium leading-relaxed opacity-80 uppercase tracking-widest italic tracking-widest">
                  Transitioning from HRMS signifies the formal conclusion of your professional alignment. All intellectual property, global assets, and institutional identities must be synchronized prior to the final working cycle.
               </p>
               <div className="pt-8 border-t border-white/20">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4">Post-Transition Protocol</p>
                  <ul className="space-y-3">
                     {['Asset Recovery Synchronization', 'Identity Access Termination', 'Compensation Finalization Log', 'Certification Clearance'].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest opacity-60">
                           <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                           {item}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
