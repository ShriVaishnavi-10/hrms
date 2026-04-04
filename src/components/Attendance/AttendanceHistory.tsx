import { createClient } from '@/utils/supabase/server'
import { Calendar, CheckCircle2, AlertCircle, MapPin, Clock } from 'lucide-react'

type AttendanceRecord = {
  id: string
  clock_in: string
  clock_out: string | null
  status: string
  location: string | null
  created_at: string
}

export default async function AttendanceHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch last 7 days of attendance
  const { data: history, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', user.id)
    .order('clock_in', { ascending: false })
    .limit(7)

  if (error) {
    console.error('Error fetching attendance history:', error)
    return null
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_time':
        return <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> On Time</span>
      case 'late':
        return <span className="px-2 py-1 bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Late</span>
      case 'early_out':
        return <span className="px-2 py-1 bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><Clock className="w-3 h-3" /> Early Out</span>
      case 'pending_approval':
        return <span className="px-2 py-1 bg-purple-500/10 text-purple-600 text-[10px] font-bold uppercase rounded-md flex items-center gap-1">Pending Approval</span>
      default:
        return <span className="px-2 py-1 bg-muted/10 text-muted-foreground text-[10px] font-bold uppercase rounded-md">{status}</span>
    }
  }

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border/50 bg-muted/5 flex items-center justify-between">
        <h3 className="font-extrabold text-foreground flex items-center gap-2 tracking-tight">
          <Calendar className="w-5 h-5 text-primary" />
          Recent Activity
        </h3>
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Last 7 Records</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-muted/5 border-b border-border/50">
            <tr>
              <th className="py-4 px-6 text-[10px] font-bold text-muted uppercase tracking-widest uppercase">Date</th>
              <th className="py-4 px-6 text-[10px] font-bold text-muted uppercase tracking-widest uppercase">Duration</th>
              <th className="py-4 px-6 text-[10px] font-bold text-muted uppercase tracking-widest uppercase">Status</th>
              <th className="py-4 px-6 text-[10px] font-bold text-muted uppercase tracking-widest uppercase">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {history?.map((record) => {
              const start = new Date(record.clock_in)
              const end = record.clock_out ? new Date(record.clock_out) : null
              const duration = end ? ((end.getTime() - start.getTime()) / 3600000).toFixed(1) : '-'

              return (
                <tr key={record.id} className="hover:bg-muted/5 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-foreground">
                      {start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-[10px] text-muted font-medium">
                      {start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} 
                      {record.clock_out ? ` - ${new Date(record.clock_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : ''}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-foreground">{duration}h</p>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1 text-muted font-medium truncate max-w-[120px]">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {record.location || 'Unknown'}
                    </div>
                  </td>
                </tr>
              )
            })}
            {(!history || history.length === 0) && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-muted font-bold tracking-tight italic">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
