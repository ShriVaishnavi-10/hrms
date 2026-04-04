'use client'

import { FileText, Download, TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react'

export default function PayslipCard({ record }: { record: any }) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  
  return (
    <div className="group bg-card border border-border rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-full min-h-[300px]">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
         <FileText className="w-24 h-24 rotate-12 translate-x-4 -translate-y-4 text-primary" />
      </div>

      <div className="space-y-6 relative z-10">
         <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h4 className="text-xl font-black text-foreground tracking-tight leading-none uppercase">
                  {monthNames[record.month - 1]} {record.year}
               </h4>
               <p className="text-[10px] font-bold text-muted uppercase tracking-widest pl-0.5 italic">Monthly Disbursement Record</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
               record.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
            }`}>
               {record.payment_status}
            </div>
         </div>

         <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="flex justify-between items-center text-xs font-bold text-muted uppercase tracking-widest">
               <span>Gross Salary</span>
               <span className="text-foreground font-black tracking-tight">${Number(record.gross_salary).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-red-500 uppercase tracking-widest">
               <div className="flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Tax Withholding</span>
               </div>
               <span className="font-black tracking-tight">-${Number(record.tax_deduction).toLocaleString()}</span>
            </div>
         </div>
      </div>

      <div className="mt-8 relative z-10">
         <div className="bg-muted/30 p-6 rounded-2xl flex flex-col items-center justify-center gap-2 mb-6 border border-border/50 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100">Final Net Disbursed</p>
            <h3 className="text-4xl font-black tracking-tighter tabular-nums leading-none">
               ${Number(record.net_salary).toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 mt-1">
               <TrendingUp className="w-3.5 h-3.5" />
               Confirmed Payment
            </div>
         </div>

         {record.payment_status === 'paid' && (
           <button 
             onClick={() => window.print()}
             className="w-full py-4 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-foreground/10 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
           >
              <Download className="w-4 h-4" />
              Download Digital Payslip
           </button>
         )}
      </div>
    </div>
  )
}
