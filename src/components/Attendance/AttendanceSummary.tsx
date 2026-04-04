'use client'

import { useState, useEffect } from 'react'
import { getAttendanceSummary } from '@/app/attendance/actions'
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react'

type AttendanceRecord = {
  id: string
  clock_in: string
  clock_out: string | null
  status: string
}

export default function AttendanceSummary() {
  const [date, setDate] = useState(new Date())
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  const month = date.getMonth() + 1
  const year = date.getFullYear()

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true)
      const data = await getAttendanceSummary(month, year)
      setRecords(data as AttendanceRecord[])
      setLoading(false)
    }
    fetchSummary()
  }, [month, year])

  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()

  const prevMonth = () => setDate(new Date(year, month - 2, 1))
  const nextMonth = () => setDate(new Date(year, month, 1))

  const getRecordForDay = (day: number) => {
    return records.find(r => new Date(r.clock_in).getDate() === day)
  }

  const renderStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'on_time': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      case 'late': return <AlertCircle className="w-4 h-4 text-amber-500" />
      case 'pending_approval': return <Clock className="w-4 h-4 text-blue-500" />
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />
      default: return null
    }
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Monthly Summary</h3>
        <div className="flex items-center gap-4 bg-muted/50 p-1 rounded-xl border border-border">
          <button onClick={prevMonth} className="p-2 hover:bg-background rounded-lg transition-all"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-xs font-black uppercase tracking-widest min-w-[120px] text-center">
            {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-background rounded-lg transition-all"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-7 gap-4 animate-pulse">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-[10px] font-black text-muted uppercase text-center py-2">{d}</div>
          ))}
          
          {[...Array(firstDayOfMonth)].map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1
            const record = getRecordForDay(day)
            const isToday = day === new Date().getDate() && month === new Date().getMonth() + 1 && year === new Date().getFullYear()

            return (
              <div 
                key={day} 
                className={`
                  aspect-square rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all group relative
                  ${isToday ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                  ${record ? 'bg-card' : 'bg-muted/10'}
                `}
              >
                <span className={`text-xs font-bold ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>{day}</span>
                {renderStatusIcon(record?.status)}
                
                {record && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-background/95 rounded-2xl flex flex-col items-center justify-center text-[8px] font-bold transition-all z-20">
                    <p className="text-primary">{new Date(record.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    {record.clock_out && (
                      <p className="text-muted-foreground">{new Date(record.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-6 border-t border-border/50 pt-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span className="text-[10px] font-bold text-muted uppercase">On Time</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] font-bold text-muted uppercase">Late / Issue</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-blue-500" />
          <span className="text-[10px] font-bold text-muted uppercase">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="w-3 h-3 text-red-500" />
          <span className="text-[10px] font-bold text-muted uppercase">Rejected</span>
        </div>
      </div>
    </div>
  )
}
