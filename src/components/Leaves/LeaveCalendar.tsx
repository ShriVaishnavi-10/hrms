'use client'

import { useState, useEffect } from 'react'
import { getLeaveCalendar } from '@/app/leaves/actions'
import { ChevronLeft, ChevronRight, Calendar, Palmtree, Tent, Plane } from 'lucide-react'

type LeaveRecord = {
  id: string
  start_date: string
  end_date: string
  type: string
  profiles: {
    full_name: string
  }
}

type HolidayRecord = {
  id: string
  name: string
  date: string
  type: string
}

export default function LeaveCalendar() {
  const [date, setDate] = useState(new Date())
  const [data, setData] = useState<{ leaves: LeaveRecord[], holidays: HolidayRecord[] }>({ leaves: [], holidays: [] })
  const [loading, setLoading] = useState(true)

  const month = date.getMonth() + 1
  const year = date.getFullYear()

  useEffect(() => {
    async function fetchCalendar() {
      setLoading(true)
      const res = await getLeaveCalendar(month, year)
      setData(res as any)
      setLoading(false)
    }
    fetchCalendar()
  }, [month, year])

  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()

  const prevMonth = () => setDate(new Date(year, month - 2, 1))
  const nextMonth = () => setDate(new Date(year, month, 1))

  const getEventsForDay = (day: number) => {
    const dayStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    
    const dayHolidays = data.holidays.filter(h => h.date === dayStr)
    const dayLeaves = data.leaves.filter(l => {
        const start = l.start_date
        const end = l.end_date
        return dayStr >= start && dayStr <= end
    })

    return { holidays: dayHolidays, leaves: dayLeaves }
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Presence Calendar</h3>
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.1em]">Leaves & Holidays</p>
        </div>
        <div className="flex items-center gap-4 bg-muted/50 p-1 rounded-xl border border-border">
          <button onClick={prevMonth} className="p-2 hover:bg-background rounded-lg transition-all"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-xs font-black uppercase tracking-widest min-w-[120px] text-center">
            {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-background rounded-lg transition-all"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border border border-border rounded-2xl overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="bg-muted/50 text-[10px] font-black text-muted uppercase text-center py-4">{d}</div>
        ))}
        
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={`empty-${i}`} className="bg-card min-h-[100px]" />
        ))}

        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1
          const { holidays, leaves } = getEventsForDay(day)
          const isToday = day === new Date().getDate() && month === new Date().getMonth() + 1 && year === new Date().getFullYear()

          return (
            <div 
              key={day} 
              className={`
                bg-card min-h-[100px] p-2 flex flex-col gap-1 transition-all group relative
                ${isToday ? 'ring-1 ring-primary inset-0 z-10' : ''}
                ${holidays.length > 0 ? 'bg-primary/[0.02]' : ''}
              `}
            >
              <span className={`text-[10px] font-bold ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>{day}</span>
              
              <div className="space-y-1 overflow-hidden">
                {holidays.map(h => (
                   <div key={h.id} className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 rounded text-[7px] font-black uppercase truncate flex items-center gap-1">
                      <Palmtree className="w-2 h-2" />
                      {h.name}
                   </div>
                ))}
                {leaves.map(l => (
                   <div key={l.id} className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[7px] font-black uppercase truncate flex items-center gap-1">
                      <Plane className="w-2 h-2" />
                      {l.profiles.full_name.split(' ')[0]}
                   </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-6 border-t border-border/50 pt-6">
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase">
          <div className="w-3 h-3 bg-amber-500/10 border border-amber-500/20 rounded"></div>
          Holiday
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase">
          <div className="w-3 h-3 bg-primary/10 border border-primary/20 rounded"></div>
          Approved Leave
        </div>
      </div>
    </div>
  )
}
