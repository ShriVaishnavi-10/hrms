'use client'

import { useState } from 'react'
import { requestManualEntry } from '@/app/attendance/actions'
import { AlertTriangle, Send, CheckCircle2 } from 'lucide-react'

export default function ManualEntryForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const date = formData.get('date') as string
    const clockIn = formData.get('clock_in') as string
    const clockOut = formData.get('clock_out') as string
    const reason = formData.get('reason') as string

    // Combine date and time
    const clockInIso = new Date(`${date}T${clockIn}`).toISOString()
    const clockOutIso = new Date(`${date}T${clockOut}`).toISOString()

    const result = await requestManualEntry({
      clockIn: clockInIso,
      clockOut: clockOutIso,
      reason
    })

    if (result.success) {
      setSuccess(true)
      e.currentTarget.reset()
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error || 'Failed to submit request')
    }
    setLoading(false)
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="space-y-1">
          <h3 className="font-extrabold text-foreground tracking-tight">Manual Entry Request</h3>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest uppercase">Forgot to clock in? Submit a correction.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 ml-1">Date</label>
          <input 
            name="date" 
            type="date" 
            required 
            className="w-full bg-muted/5 border border-border rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 ml-1">Clock In Time</label>
            <input 
              name="clock_in" 
              type="time" 
              required 
              className="w-full bg-muted/5 border border-border rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 ml-1">Clock Out Time</label>
            <input 
              name="clock_out" 
              type="time" 
              required 
              className="w-full bg-muted/5 border border-border rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 ml-1">Reason for request</label>
          <textarea 
            name="reason" 
            required 
            rows={2}
            placeholder="e.g., Forgot to clock in due to meeting..." 
            className="w-full bg-muted/5 border border-border rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-xs font-bold px-1">{error}</p>}
        {success && (
          <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            Request submitted for approval.
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-foreground text-background rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          Submit Request
        </button>
      </form>
    </div>
  )
}
