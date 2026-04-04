'use client'

import { useState } from 'react'
import { updateSalaryStructure } from '@/app/payroll/actions'
import { ReceiptCent, Save, Calculator, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export default function SalaryStructure({ employeeId, existingData }: { employeeId: string, existingData?: any }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Local state for calculation
  const [basic, setBasic] = useState(existingData?.basic || 0)
  const [hra, setHra] = useState(existingData?.hra || 0)
  const [conveyance, setConveyance] = useState(existingData?.conveyance || 0)
  const [allowances, setAllowances] = useState(existingData?.allowances || 0)

  const totalCTC = Number(basic) + Number(hra) + Number(conveyance) + Number(allowances)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const res = await updateSalaryStructure(employeeId, {
      basic: Number(basic),
      hra: Number(hra),
      conveyance: Number(conveyance),
      allowances: Number(allowances),
      total_ctc: totalCTC
    })

    if (res.success) {
      setSuccess(true)
    } else {
      setError(res.error || 'Failed to update salary structure.')
    }
    setLoading(false)
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center gap-4 border-b border-border/50 pb-6">
        <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold shadow-lg shadow-primary/5">
          <Calculator className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-foreground tracking-tight uppercase leading-none">Salary Structure (CTC)</h3>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Define annual compensation breakdown</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-6 bg-muted/5 p-6 rounded-2xl border border-border/50">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Earnings Breakdown</h4>
              
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Basic Salary (Annual)</label>
                    <input 
                      type="number" 
                      value={basic} 
                      onChange={(e) => setBasic(Number(e.target.value))}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="e.g., 600000"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">House Rent Allowance (HRA)</label>
                    <input 
                      type="number" 
                      value={hra} 
                      onChange={(e) => setHra(Number(e.target.value))}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Conveyance Allowance</label>
                    <input 
                      type="number" 
                      value={conveyance} 
                      onChange={(e) => setConveyance(Number(e.target.value))}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Special Allowances</label>
                    <input 
                      type="number" 
                      value={allowances} 
                      onChange={(e) => setAllowances(Number(e.target.value))}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                 </div>
              </div>
           </div>

           <div className="flex flex-col justify-between space-y-8 bg-foreground p-8 rounded-[2.5rem] text-background border border-foreground/10 group shadow-2xl shadow-foreground/10 relative overflow-hidden">
              {/* Decorative Accent */}
              <Calculator className="w-48 h-48 absolute -right-16 -top-16 text-background/5 rotate-12 transition-transform group-hover:scale-110" />
              
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-background/50 uppercase tracking-[0.3em] mb-2">Total Calculated CTC</p>
                 <h2 className="text-5xl font-black tabular-nums tracking-tighter">
                   ${totalCTC.toLocaleString()}
                 </h2>
                 <p className="text-[10px] font-medium text-background/40 italic uppercase tracking-widest mt-2 border-l-2 border-primary/40 pl-3">
                   Gross Annual Remuneration
                 </p>
              </div>

              <div className="space-y-6 relative z-10 pt-10 border-t border-background/10">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-background/60">
                     <span>Estimated Monthly Gross</span>
                     <span className="text-sm text-primary font-black">${(totalCTC / 12).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                  </div>
                  
                  {error && <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-bottom-2"><AlertCircle className="w-4 h-4" /> {error}</p>}
                  {success && <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-bottom-2"><CheckCircle2 className="w-4 h-4" /> Structure Synchronized!</p>}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (
                       <div className="flex items-center justify-center gap-2 px-4">
                          <Save className="w-4 h-4" />
                          Update Structure
                       </div>
                    )}
                  </button>
              </div>
           </div>
        </div>
      </form>
    </div>
  )
}
