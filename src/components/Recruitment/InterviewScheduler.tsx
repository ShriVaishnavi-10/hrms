'use client'

import { useState } from 'react'
import { scheduleInterview } from '@/app/recruitment/actions'
import { Calendar, User, Clock, CheckCircle2, Loader2, Save, XCircle, AlertCircle, TrendingUp, Info } from 'lucide-react'

export default function InterviewScheduler({ applicants, employees }: { applicants: any[], employees: any[] }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    
    // Construct local ISO date string
    const date = fd.get('date') as string
    const time = fd.get('time') as string
    const scheduled_at = new Date(`${date}T${time}`).toISOString()

    const res = await scheduleInterview({
      applicant_id: fd.get('applicant_id') as string,
      interviewer_id: fd.get('interviewer_id') as string,
      scheduled_at
    })
    
    if (res.success) {
      setSuccess(true)
      e.currentTarget.reset()
      setTimeout(() => setSuccess(false), 3000)
    } else {
      alert(res.error || 'Failed to schedule interview.')
    }
    setLoading(false)
  }

  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm space-y-10 animate-in fade-in zoom-in-95 duration-500 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[60px] bg-foreground/5 opacity-40 pointer-events-none"></div>
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold shadow-lg shadow-primary/5">
          <Calendar className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-foreground tracking-tight uppercase leading-none">Schedule Talent Acquisition</h3>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Interview Coordination & Assessment</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Candidate Selected</label>
              <select name="applicant_id" required className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer">
                 <option value="">Select Candidate...</option>
                 {applicants.map(a => (
                    <option key={a.id} value={a.id}>{a.full_name} ({a.job?.title || 'Unknown'})</option>
                 ))}
              </select>
           </div>
           
           <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Assigned Interviewer</label>
              <select name="interviewer_id" required className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer">
                 <option value="">Select Internal Lead...</option>
                 {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.full_name} ({e.designation})</option>
                 ))}
              </select>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Proposed Sync Date</label>
              <div className="relative">
                 <Calendar className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                 <input type="date" name="date" required className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 pl-12 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Proposed Sync Time</label>
              <div className="relative">
                 <Clock className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                 <input type="time" name="time" required className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 pl-12 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
           </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                 <Info className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-relaxed max-w-[300px] italic">
                 Confirming this will update the candidate status to "Interview" and notify the assigned lead.
              </p>
           </div>
           
           <div className="flex flex-col items-center gap-3 w-full md:w-fit">
              {success && <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Interview Logged!</p>}
              <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full md:w-fit px-12 py-5 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-foreground/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2 justify-center"
              >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                 Finalize Synchronization
              </button>
           </div>
        </div>
      </form>
    </div>
  )
}
