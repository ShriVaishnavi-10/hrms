'use client'

import { DollarSign, Clock, CheckCircle2, XCircle, FileText, ExternalLink } from 'lucide-react'

export default function ExpenseTracker({ expenses }: { expenses: any[] }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />
      case 'reimbursed': return <DollarSign className="w-5 h-5 text-blue-500" />
      default: return <Clock className="w-5 h-5 text-amber-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'reimbursed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2 px-2">
         <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Historical Claim Records</h4>
         <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full border border-primary/10">{expenses.length} Total Claims</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expenses.length === 0 ? (
           <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl opacity-40">
              <FileText className="w-12 h-12 text-muted mb-4" />
              <p className="text-xs font-bold text-muted uppercase tracking-widest italic tracking-widest">No active expense claims found.</p>
           </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="group bg-card border border-border rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
               {/* Background Glow */}
               <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-10 transition-opacity group-hover:opacity-20 ${getStatusColor(expense.status).split(' ')[0]}`}></div>
               
               <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(expense.status)}`}>
                        {expense.status}
                     </span>
                     <p className="text-[10px] font-bold text-muted uppercase tracking-widest italic">{new Date(expense.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="space-y-1">
                     <h5 className="text-lg font-black text-foreground tracking-tight leading-none truncate uppercase">{expense.title}</h5>
                     <p className="text-[10px] font-bold text-muted uppercase tracking-widest pl-0.5">{expense.category}</p>
                  </div>
               </div>

               <div className="pt-6 border-t border-border/50 flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-muted uppercase tracking-widest leading-none">Net Amount</p>
                     <p className="text-2xl font-black text-foreground tracking-tighter tabular-nums">${Number(expense.amount).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     {expense.receipt_url && (
                        <a 
                          href={expense.receipt_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-3 bg-muted/10 rounded-xl text-muted hover:bg-primary hover:text-white transition-all shadow-sm"
                          title="View Proof"
                        >
                           <ExternalLink className="w-4.5 h-4.5" />
                        </a>
                     )}
                     <div className="p-3 bg-muted/5 rounded-xl text-muted group-hover:scale-110 transition-transform">
                        {getStatusIcon(expense.status)}
                     </div>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
