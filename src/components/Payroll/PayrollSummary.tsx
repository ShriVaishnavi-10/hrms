'use client'

import { useState } from 'react'
import { processPayroll } from '@/app/payroll/actions'
import { TrendingUp, CreditCard, CalendarCheck, Loader2, PlayCircle, ShieldCheck } from 'lucide-react'

export default function PayrollSummary({ employeesWithStructures }: { employeesWithStructures: any[] }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  
  const totalLiability = employeesWithStructures.reduce((sum, e) => sum + (Number(e.salary_structures?.[0]?.total_ctc || 0) / 12), 0)
  const totalTax = totalLiability * 0.1
  const totalNet = totalLiability - totalTax

  const handleRunPayroll = async () => {
    if (!confirm('Execute payroll for the current month? This will generate records for all employees.')) return
    
    setLoading(true)
    const now = new Date()
    const res = await processPayroll(now.getMonth() + 1, now.getFullYear())
    
    if (res.success) {
      setStatus('Payroll records synchronized successfully.')
      setTimeout(() => setStatus(null), 5000)
    } else {
      alert(res.error || 'Failed to process payroll.')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <TrendingUp className="w-24 h-24 rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Total Monthly Liability</p>
            <h3 className="text-3xl font-black text-foreground tracking-tighter tabular-nums mb-1">${totalLiability.toLocaleString()}</h3>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest pl-1">Gross Annual Estimate Projection</p>
         </div>

         <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <CreditCard className="w-24 h-24 -rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Estimated Tax Withholding</p>
            <h3 className="text-3xl font-black text-blue-600 tracking-tighter tabular-nums mb-1">${totalTax.toLocaleString()}</h3>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest pl-1">10% Standard Rate Applied</p>
         </div>

         <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-emerald-500/20 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <ShieldCheck className="w-24 h-24 rotate-12 translate-x-4 -translate-y-4 text-emerald-500" />
            </div>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Net Disbursement Total</p>
            <h3 className="text-3xl font-black text-emerald-600 tracking-tighter tabular-nums mb-1">${totalNet.toLocaleString()}</h3>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest pl-1">Transfer-ready liquidity</p>
         </div>
      </div>

      <div className="bg-foreground p-10 rounded-[2.5rem] text-background flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-foreground/20 relative overflow-hidden group">
         {/* Decorative Element */}
         <div className="absolute left-0 bottom-0 w-64 h-64 bg-background/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none"></div>
         
         <div className="space-y-4 relative z-10 max-w-lg">
            <div className="flex items-center gap-3">
               <CalendarCheck className="w-6 h-6 text-primary" />
               <h2 className="text-4xl font-black tracking-tight leading-none uppercase">Execute Monthly Payroll</h2>
            </div>
            <p className="text-xs font-medium text-background/60 leading-relaxed uppercase tracking-widest">
               Execute payroll records for <span className="text-background font-black">{employeesWithStructures.length}</span> employees for the current billing cycle. This will finalize all liabilities.
            </p>
         </div>

         <div className="flex flex-col items-center gap-4 relative z-10">
            {status && <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">{status}</p>}
            <button 
               onClick={handleRunPayroll}
               disabled={loading || employeesWithStructures.length === 0}
               className="px-12 py-5 bg-primary text-primary-foreground rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-3"
            >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
               Run Sync Finalization
            </button>
            <p className="text-[10px] font-bold text-background/40 uppercase tracking-widest italic">Authorization Required: Admin/HR Level</p>
         </div>
      </div>
    </div>
  )
}
