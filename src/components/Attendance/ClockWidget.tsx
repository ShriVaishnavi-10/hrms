'use client'

import { useState, useEffect } from 'react'
import { clockIn, clockOut } from '@/app/attendance/actions'
import { Clock, MapPin, Play, Square, Timer, AlertCircle } from 'lucide-react'

type AttendanceRecord = {
  id: string
  clock_in: string
  clock_out: string | null
  status: string
  location: string | null
}

export default function ClockWidget({ initialAttendance }: { initialAttendance: AttendanceRecord | null }) {
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(initialAttendance)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Update clock every second
  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Get location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
        },
        () => setLocation('Location Denied')
      )
    } else {
      setLocation('Not Supported')
    }
  }, [])

  const handleClockIn = async () => {
    setLoading(true)
    setError(null)
    const res = await clockIn(location || 'Unknown')
    if (res.success) {
      window.location.reload() // Simple revalidation
    } else {
      setError(res.error || 'Failed to clock in')
    }
    setLoading(false)
  }

  const handleClockOut = async () => {
    if (!attendance) return
    setLoading(true)
    setError(null)
    const res = await clockOut(attendance.id)
    if (res.success) {
      window.location.reload()
    } else {
      setError(res.error || 'Failed to clock out')
    }
    setLoading(false)
  }

  const isClockedIn = attendance && !attendance.clock_out

  // Calculate duration if clocked in
  const getDuration = () => {
    if (!attendance?.clock_in) return '00:00:00'
    const start = new Date(attendance.clock_in).getTime()
    const now = isClockedIn ? currentTime.getTime() : new Date(attendance.clock_out!).getTime()
    const diff = Math.max(0, now - start)
    
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-1 opacity-5">
        <Clock className="w-32 h-32 rotate-12 translate-x-8 -translate-y-8 text-primary" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">Attendance</h2>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
              <span className={`h-2 w-2 rounded-full ${isClockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              {isClockedIn ? 'Currently Working' : 'Off Duty'}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">
              {mounted ? currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '-- --, ----'}
            </p>
            <p className="text-2xl font-black text-primary tabular-nums">
              {mounted ? currentTime.toLocaleTimeString('en-US', { hour12: false }) : '--:--:--'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-6 bg-muted/5 rounded-2xl border border-border/50">
          <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-2">Shift duration</p>
          <div className="text-5xl font-black text-foreground tabular-nums tracking-tighter">
            {mounted ? getDuration() : '00:00:00'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted uppercase">Clock In</p>
            <p className="font-bold text-foreground">
              {attendance?.clock_in ? new Date(attendance.clock_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-bold text-muted uppercase">Clock Out</p>
            <p className="font-bold text-foreground">
              {attendance?.clock_out ? new Date(attendance.clock_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-xs font-bold animate-in fade-in zoom-in duration-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="pt-2">
          {!isClockedIn ? (
            <button
              onClick={handleClockIn}
              disabled={!!(loading || (attendance && attendance.clock_out !== null))}
              className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
            >
              <Play className="w-5 h-5 fill-current" />
              Clock In Now
            </button>
          ) : (
            <button
              onClick={handleClockOut}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-600/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Square className="w-5 h-5 fill-current" />
              Clock Out
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted font-bold pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {location || 'Detecting location...'}
          </div>
          <div className="flex items-center gap-1">
            <Timer className="w-3 h-3" />
            10 AM / 7 PM Shift
          </div>
        </div>
      </div>
    </div>
  )
}
