'use client'

import { useState } from 'react'
import { addGoal } from '@/app/performance/goals/actions'
import { Target, X, Target as TargetIcon, BarChart3, Calendar, FileText } from 'lucide-react'

export default function CreateGoalModal({ isOpen, onClose, employees }: { isOpen: boolean, onClose: () => void, employees: any[] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      user_id: formData.get('user_id') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as string,
      target_value: Number(formData.get('target_value')),
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
    }

    const res = await addGoal(data)
    if (res.success) {
      onClose()
      window.location.reload()
    } else {
      setError(res.error || 'Failed to create goal')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card border border-border w-full max-w-xl rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-border flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/20 rounded-xl text-primary font-bold">
                <TargetIcon className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Create New Goal</h3>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Assign OKR or KPI</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Assign To</label>
                    <select name="user_id" required className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none">
                       {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                       ))}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Goal Type</label>
                    <select name="type" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none">
                       <option value="okr">OKR (Objectives & Key Results)</option>
                       <option value="kpi">KPI (Key Performance Indicator)</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Title</label>
                 <input name="title" required className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="e.g. Increase sales in Q3" />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Description (Key Results)</label>
                 <textarea name="description" rows={3} className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="Detail the expected results..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Target Value (%)</label>
                    <input name="target_value" type="number" defaultValue={100} required className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                 </div>
                 <div className="space-y-2 text-right md:col-span-2">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2 text-left">
                          <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Start Date</label>
                          <input name="start_date" type="date" required className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                       </div>
                       <div className="space-y-2 text-left">
                          <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">End Date</label>
                          <input name="end_date" type="date" required className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                       </div>
                    </div>
                 </div>
              </div>

              {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

              <div className="pt-4">
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                 >
                   {loading ? 'Creating...' : 'Assign Goal'}
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  )
}
