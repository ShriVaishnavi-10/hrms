'use client'

import { useState, useEffect } from 'react'
import { getHolidays, deleteHoliday } from '@/app/holidays/actions'
import { Calendar, Trash2, ShieldCheck, Palmtree, Tent, PartyPopper } from 'lucide-react'

type Holiday = {
    id: string
    name: string
    date: string
    type: string
    description?: string
}

export default function HolidayList({ isAdmin }: { isAdmin: boolean }) {
    const [holidays, setHolidays] = useState<Holiday[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchHolidays() {
            const data = await getHolidays()
            setHolidays(data as Holiday[])
            setLoading(false)
        }
        fetchHolidays()
    }, [])

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return
        const res = await deleteHoliday(id)
        if (res.success) {
            setHolidays(prev => prev.filter(h => h.id !== id))
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'company': return <ShieldCheck className="w-4 h-4 text-primary" />
            case 'festival': return <PartyPopper className="w-4 h-4 text-amber-500" />
            case 'regional': return <Tent className="w-4 h-4 text-emerald-500" />
            default: return <Calendar className="w-4 h-4 text-muted" />
        }
    }

    if (loading) return <div className="p-10 text-center text-xs font-bold text-muted uppercase animate-pulse">Loading holidays...</div>

    return (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-muted/30 border-b border-border">
                            <th className="text-left py-4 px-6 text-[10px] font-black text-muted uppercase">Holiday Name</th>
                            <th className="text-left py-4 px-6 text-[10px] font-black text-muted uppercase">Date</th>
                            <th className="text-left py-4 px-6 text-[10px] font-black text-muted uppercase">Type</th>
                            {isAdmin && <th className="text-right py-4 px-6 text-[10px] font-black text-muted uppercase">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {holidays.length === 0 ? (
                           <tr>
                             <td colSpan={isAdmin ? 4 : 3} className="py-20 text-center">
                                <Palmtree className="w-12 h-12 text-muted/20 mx-auto mb-4" />
                                <p className="text-xs font-bold text-muted uppercase tracking-widest">No holidays scheduled</p>
                             </td>
                           </tr>
                        ) : (
                            holidays.map((h) => (
                                <tr key={h.id} className="border-b border-border/50 hover:bg-muted/5 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-foreground uppercase tracking-tight">{h.name}</span>
                                            {h.description && <span className="text-[10px] font-medium text-muted-foreground italic mt-0.5">{h.description}</span>}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-xs font-bold text-foreground">
                                        {new Date(h.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full w-fit">
                                            {getTypeIcon(h.type)}
                                            <span className="text-[10px] font-black text-muted uppercase">{h.type}</span>
                                        </div>
                                    </td>
                                    {isAdmin && (
                                        <td className="py-4 px-6 text-right">
                                            <button 
                                                onClick={() => handleDelete(h.id, h.name)}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
