'use client'

import { useState } from 'react'
import { applyForLeave } from '@/app/leaves/actions'
import { Calendar, FileText, Send, CheckCircle2, Loader2 } from 'lucide-react'

export default function LeaveRequestForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    const type = formData.get('type') as string
    const startDate = formData.get('start_date') as string
    const endDate = formData.get('end_date') as string
    const reason = formData.get('reason') as string

    // Basic date validation
    if (new Date(startDate) > new Date(endDate)) {
      setError('End date cannot be before start date.')
      setLoading(false)
      return
    }

    const result = await applyForLeave({ type, startDate, endDate, reason })

    if (result.success) {
      setSuccess(true)
      form.reset()
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error || 'Failed to submit leave request')
    }
    setLoading(false)
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="font-extrabold text-foreground tracking-tight">Apply for Leave</h3>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Submit a new request for approval</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 ml-1">Leave Type</label>
          <select 
            name="type" 
            required 
            className="w-full bg-muted/5 border border-border rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
            <option value="earned">Earned Leave</option>
            <option value="unpaid">Unpaid Leave</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 ml-1">Start Date</label>
            <input 
              name="start_date" 
              type="date" 
              required 
              className="w-full bg-muted/5 border border-border rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 ml-1">End Date</label>
            <input 
              name="end_date" 
              type="date" 
              required 
              className="w-full bg-muted/5 border border-border rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 ml-1">Reason for Leave</label>
          <div className="relative">
            <FileText className="w-4 h-4 text-muted absolute left-4 top-4" />
            <textarea 
              name="reason" 
              required 
              rows={3}
              placeholder="Provide a brief reason for your leave request..." 
              className="w-full bg-muted/5 border border-border rounded-2xl pl-11 pr-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs font-bold px-1">{error}</p>}
        {success && (
          <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 text-xs font-bold animate-in fade-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4" />
            Leave request submitted successfully!
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Submit Application
        </button>
      </form>
    </div>
  )
}
