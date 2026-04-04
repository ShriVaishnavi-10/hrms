import { createClient } from '@/utils/supabase/server'
import { CalendarRange, CheckCircle2, AlertCircle, XCircle, Clock } from 'lucide-react'

type LeaveRecord = {
  id: string
  type: string
  start_date: string
  end_date: string
  reason: string | null
  status: string
  created_at: string
}

export default async function LeaveHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch leave history
  const { data: history, error } = await supabase
    .from('leaves')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching leave history:', error)
    return null
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase rounded-md flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Approved</span>
      case 'rejected':
        return <span className="px-2 py-1 bg-red-500/10 text-red-600 text-[10px] font-bold uppercase rounded-md flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> Rejected</span>
      case 'pending':
        return <span className="px-2 py-1 bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase rounded-md flex items-center gap-1 w-fit"><Clock className="w-3 h-3 text-amber-500" /> Pending</span>
      default:
        return <span className="px-2 py-1 bg-muted/10 text-muted-foreground text-[10px] font-bold uppercase rounded-md w-fit">{status}</span>
    }
  }

  const getLeaveTypeLabel = (type: string) => {
    return type.toUpperCase()
  }

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm h-full">
      <div className="p-6 border-b border-border/50 bg-muted/5 flex items-center justify-between">
        <h3 className="font-extrabold text-foreground flex items-center gap-2 tracking-tight">
          <CalendarRange className="w-5 h-5 text-primary" />
          My Leave History
        </h3>
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest text-right">Self Service</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-muted/5 border-b border-border/50">
            <tr>
              <th className="py-4 px-6 text-[10px] font-bold text-muted uppercase tracking-widest">Type & Duration</th>
              <th className="py-4 px-6 text-[10px] font-bold text-muted uppercase tracking-widest">Reason</th>
              <th className="py-4 px-6 text-[10px] font-bold text-muted uppercase tracking-widest">Status</th>
              <th className="py-4 px-6 text-[10px] font-bold text-muted uppercase tracking-widest">Applied On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {history?.map((record) => (
              <tr key={record.id} className="hover:bg-muted/5 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1">
                    <p className="font-extrabold text-foreground">{getLeaveTypeLabel(record.type)}</p>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-tight">
                      {new Date(record.start_date).toLocaleDateString()} - {new Date(record.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6 max-w-[200px]">
                  <p className="text-muted text-xs line-clamp-2 italic font-medium">"{record.reason || 'No reason provided'}"</p>
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(record.status)}
                </td>
                <td className="py-4 px-6">
                  <p className="text-[10px] text-muted font-bold tracking-tight">
                    {new Date(record.created_at).toLocaleDateString()}
                  </p>
                </td>
              </tr>
            ))}
            {(!history || history.length === 0) && (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                   <div className="flex flex-col items-center gap-2 opacity-30">
                      <CalendarRange className="w-12 h-12 text-muted" />
                      <p className="text-muted font-bold tracking-tight italic">No leave requests found.</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
