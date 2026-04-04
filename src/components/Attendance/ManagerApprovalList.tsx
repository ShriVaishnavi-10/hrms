'use client'

import { useState } from 'react'
import { resolveAttendanceRequest } from '@/app/attendance/actions'
import { Check, X, User, Clock, MessageSquare, AlertCircle } from 'lucide-react'

type PendingRequest = {
  id: string
  user_id: string
  clock_in: string
  clock_out: string | null
  location: string | null
  profiles: { full_name: string } | null
}

export default function ManagerApprovalList({ requests }: { requests: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleResolve = async (id: string, status: 'on_time' | 'rejected') => {
    setLoadingId(id)
    setError(null)
    const res = await resolveAttendanceRequest(id, status)
    if (!res.success) {
      setError(res.error || 'Failed to update request')
    }
    setLoadingId(null)
  }

  if (!requests || requests.length === 0) return null

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-border/50 bg-amber-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-xl text-amber-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-foreground tracking-tight">Pending Approvals</h3>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Attendance Corrections</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-full">
          {requests.length} NEW
        </span>
      </div>

      <div className="divide-y divide-border/30">
        {requests.map((request) => (
          <div key={request.id} className="p-6 hover:bg-muted/5 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="font-extrabold text-foreground">{request.profiles?.full_name || 'Unknown Employee'}</p>
                  <div className="flex items-center gap-3 text-xs font-bold text-muted uppercase tracking-tighter">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(request.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                      {' - '}
                      {request.clock_out ? new Date(request.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '??'}
                    </span>
                    <span className="h-1 w-1 bg-muted rounded-full"></span>
                    <span>{new Date(request.clock_in).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1 font-medium italic">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {request.location?.replace('Manual: ', '') || 'No reason provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleResolve(request.id, 'rejected')}
                  disabled={!!loadingId}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-red-600 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all active:scale-[0.95]"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleResolve(request.id, 'on_time')}
                  disabled={!!loadingId}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.95]"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="p-3 bg-red-500/10 text-red-600 text-xs font-bold text-center border-t border-red-500/20">
          {error}
        </div>
      )}
    </div>
  )
}
