'use client'

import { useState, useEffect } from 'react'
import { getLeaveBalances } from '@/app/leaves/actions'
import { PieChart, Loader2, Info } from 'lucide-react'

type LeaveBalance = {
  leave_type: string
  total_days: number
  used_days: number
}

export default function LeaveBalanceCard() {
  const [balances, setBalances] = useState<LeaveBalance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBalances() {
      const data = await getLeaveBalances()
      setBalances(data as LeaveBalance[])
      setLoading(false)
    }
    fetchBalances()
  }, [])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-3xl p-8 flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Leave Balances</h3>
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.1em]">Current year allocation</p>
        </div>
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <PieChart className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {balances.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs font-bold text-muted uppercase">No balances found</p>
          </div>
        ) : (
          balances.map((bal) => {
            const remaining = bal.total_days - bal.used_days
            const percentage = (bal.used_days / bal.total_days) * 100

            return (
              <div key={bal.leave_type} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-foreground uppercase tracking-tight">{bal.leave_type}</span>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
                       {remaining} Days Remaining
                    </p>
                  </div>
                  <span className="text-xs font-black text-primary">{bal.used_days} / {bal.total_days}</span>
                </div>
                
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="mt-8 flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground font-medium italic leading-relaxed">
           Balances are reset annually. Unused casual leaves do not carry forward.
        </p>
      </div>
    </div>
  )
}
