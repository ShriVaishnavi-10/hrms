'use client'

import { useState } from 'react'
import { resolveLeave } from '@/app/leaves/actions'
import { Check, X, Calendar, User, FileText, AlertCircle } from 'lucide-react'

type PendingLeave = {
  id: string
  user_id: string
  type: string
  start_date: string
  end_date: string
  reason: string | null
  profiles: { full_name: string } | null
}

export default function ManagerLeaveApproval({ pendingLeaves }: { pendingLeaves: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleResolve = async (id: string, newStatus: 'approved' | 'rejected') => {
    setLoadingId(id)
    setError(null)
    const result = await resolveLeave(id, newStatus)
    if (!result.success) {
      setError(result.error || 'Failed to resolve leave request')
    }
    setLoadingId(null)
  }

  if (!pendingLeaves || pendingLeaves.length === 0) return null

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-border/50 bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-foreground tracking-tight">Pending Leave Approvals</h3>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Employee Requests</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black rounded-full">
          {pendingLeaves.length} NEW
        </span>
      </div>

      <div className="divide-y divide-border/30">
        {pendingLeaves.map((record) => (
          <div key={record.id} className="p-6 hover:bg-muted/5 transition-colors group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <User className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-foreground">{record.profiles?.full_name || 'Unknown Employee'}</p>
                    <span className="px-1.5 py-0.5 bg-muted/10 text-muted-foreground text-[9px] font-black uppercase rounded tracking-tight">{record.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-muted uppercase tracking-tighter">
                    <span className="flex items-center gap-1 text-foreground/80">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(record.start_date).toLocaleDateString()} 
                      {' - '}
                      {new Date(record.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1 font-medium italic max-w-md">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    "{record.reason || 'No reason provided'}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleResolve(record.id, 'rejected')}
                  disabled={loadingId === record.id}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-red-600 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all active:scale-[0.95]"
                >
                  <X className="w-4 h-4 text-red-500" />
                  Reject
                </button>
                <button
                  onClick={() => handleResolve(record.id, 'approved')}
                  disabled={loadingId === record.id}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.95]"
                >
                  <Check className="w-4 h-4" />
                  Approve Leave
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="p-3 bg-red-500/10 text-red-600 text-xs font-bold text-center border-t border-red-500/20 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  )
}
