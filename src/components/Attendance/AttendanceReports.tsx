'use client'

import { useState } from 'react'
import { getAttendanceReport } from '@/app/attendance/actions'
import { FileText, Search, Download, AlertCircle, Clock, CheckCircle2 } from 'lucide-react'

type ReportRecord = {
  id: string
  clock_in: string
  clock_out: string | null
  status: string
  profiles: {
    full_name: string
    department: string
  }
}

export default function AttendanceReports() {
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [type, setType] = useState<'late' | 'all'>('all')
  const [records, setRecords] = useState<ReportRecord[]>([])
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    const data = await getAttendanceReport(`${startDate}T00:00:00`, `${endDate}T23:59:59`, type)
    setRecords(data as any[])
    setLoading(false)
  }

  const renderStatus = (status: string) => {
    switch (status) {
      case 'on_time': return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase">On Time</span>
      case 'late': return <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase">Late</span>
      default: return <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-black uppercase">{status}</span>
    }
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Attendance Reports</h3>
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.1em]">Analyze employee punctuality</p>
        </div>
        <button 
           onClick={() => {}} // Placeholder for CSV export
           className="p-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 items-end">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-muted uppercase ml-1">Start Date</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-muted uppercase ml-1">End Date</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-muted uppercase ml-1">Filter</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
          >
            <option value="all">All Records</option>
            <option value="late">Late Arrivals ONLY</option>
          </select>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 text-[10px] font-black text-muted uppercase">Employee</th>
              <th className="text-left py-4 text-[10px] font-black text-muted uppercase">Date</th>
              <th className="text-left py-4 text-[10px] font-black text-muted uppercase">Clock In</th>
              <th className="text-left py-4 text-[10px] font-black text-muted uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
               <tr>
                 <td colSpan={4} className="py-20 text-center">
                    <FileText className="w-12 h-12 text-muted/20 mx-auto mb-4" />
                    <p className="text-xs font-bold text-muted uppercase tracking-widest">No reports generated yet</p>
                 </td>
               </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-b border-border/50 hover:bg-muted/5 transition-colors">
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-foreground">{record.profiles.full_name}</span>
                      <span className="text-[10px] font-bold text-muted">{record.profiles.department}</span>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-bold text-foreground">
                    {new Date(record.clock_in).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="py-4 text-xs font-bold text-foreground">
                    {new Date(record.clock_in).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-4">{renderStatus(record.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
