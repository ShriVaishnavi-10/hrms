'use client'

import { useState, useEffect } from 'react'
import { getHolidays } from '@/app/holidays/actions'
import { Calendar, PartyPopper, ShieldCheck, Tent, Clock } from 'lucide-react'

type Holiday = {
    id: string
    name: string
    date: string
    type: string
}

export default function HolidayOverview() {
    const [upcoming, setUpcoming] = useState<Holiday[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUpcoming() {
            const data = await getHolidays()
            const now = new Date().toISOString().split('T')[0]
            const future = (data as Holiday[]).filter(h => h.date >= now).slice(0, 3)
            setUpcoming(future)
            setLoading(false)
        }
        fetchUpcoming()
    }, [])

    if (loading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-muted rounded-3xl" />)}
    </div>

    if (upcoming.length === 0) return null

    const getColors = (type: string) => {
        switch (type) {
            case 'company': return 'bg-primary text-primary-foreground shadow-primary/20'
            case 'festival': return 'bg-amber-500 text-white shadow-amber-500/20'
            case 'regional': return 'bg-emerald-500 text-white shadow-emerald-500/20'
            default: return 'bg-muted text-muted-foreground'
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcoming.map((h) => {
                const date = new Date(h.date)
                return (
                    <div key={h.id} className={`p-8 rounded-3xl shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden group ${getColors(h.type)}`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                            {h.type === 'festival' ? <PartyPopper className="w-20 h-20" /> : <ShieldCheck className="w-20 h-20" />}
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 opacity-70" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Upcoming</span>
                            </div>
                            <h4 className="text-xl font-black uppercase tracking-tight leading-tight">{h.name}</h4>
                            <div className="pt-2">
                                <p className="text-xs font-bold opacity-90">
                                   {date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">
                                   {date.toLocaleDateString('en-US', { weekday: 'long' })}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
