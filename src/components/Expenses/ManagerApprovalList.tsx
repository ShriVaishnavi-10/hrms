'use client'

import { useState } from 'react'
import { resolveExpenseClaim } from '@/app/expenses/actions'
import { CheckCircle2, XCircle, ExternalLink, Loader2, User, AlertCircle, TrendingUp } from 'lucide-react'

export default function ManagerApprovalList({ pendingExpenses }: { pendingExpenses: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleResolve = async (id: string, status: 'approved' | 'rejected') => {
    if (!confirm(`Are you sure you want to ${status} this claim?`)) return
    
    setLoadingId(id)
    const res = await resolveExpenseClaim(id, status)
    if (res.error) {
      alert(res.error)
    }
    setLoadingId(null)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between border-b border-border pb-6">
         <div className="space-y-1">
            <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Pending Reimbursements</h3>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest pl-0.5 italic">Awaiting administrative validation</p>
         </div>
         <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
            <TrendingUp className="w-4 h-4" />
            {pendingExpenses.length} Claims Total
         </div>
      </div>

      <div className="space-y-4">
        {pendingExpenses.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-muted/5 border-2 border-dashed border-border rounded-[2.5rem] opacity-40">
             <CheckCircle2 className="w-12 h-12 text-muted mb-4 opacity-30" />
             <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] italic tracking-widest">Global Synchronization Complete</p>
          </div>
        ) : (
          pendingExpenses.map((expense) => (
            <div key={expense.id} className="group bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
               {/* Identity Section */}
               <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary text-xl font-black shadow-inner border border-primary/10 group-hover:scale-105 transition-transform">
                     {expense.profile?.full_name?.charAt(0) || <User className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1 min-w-0">
                     <h4 className="text-lg font-black text-foreground tracking-tight truncate leading-none uppercase">{expense.profile?.full_name}</h4>
                     <p className="text-[10px] font-bold text-muted uppercase tracking-widest truncate">{expense.profile?.designation || 'Staff Member'}</p>
                     <div className="flex items-center gap-2 pt-2">
                        <span className="px-2 py-0.5 bg-muted/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-primary border border-primary/10">{expense.category}</span>
                        <span className="text-[9px] font-medium text-muted/60 uppercase italic tracking-widest">{new Date(expense.created_at).toLocaleDateString()}</span>
                     </div>
                  </div>
               </div>

               {/* Claim Details */}
               <div className="flex flex-col items-center md:items-end gap-1">
                  <p className="text-[9px] font-black text-muted uppercase tracking-widest leading-none">Global Claim Amount</p>
                  <h3 className="text-3xl font-black text-foreground tracking-tighter tabular-nums leading-none">
                     ${Number(expense.amount).toLocaleString()}
                  </h3>
                  <p className="text-[11px] font-bold text-primary uppercase tracking-tight truncate mt-1 italic pl-1 border-l-2 border-primary/20">{expense.title}</p>
               </div>

               {/* Actions */}
               <div className="flex items-center gap-3">
                  {expense.receipt_url && (
                    <a 
                      href={expense.receipt_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-3 bg-muted/10 rounded-2xl text-muted hover:bg-primary hover:text-white transition-all shadow-sm border border-border group-hover:border-primary/30"
                      title="View Receipt Proof"
                    >
                       <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  
                  <div className="h-10 w-px bg-border/50 mx-2 hidden md:block"></div>
                  
                  <div className="flex items-center gap-2">
                     <button 
                        onClick={() => handleResolve(expense.id, 'rejected')}
                        disabled={loadingId === expense.id}
                        className="p-3 bg-red-500/10 text-red-600 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-500/20 disabled:opacity-50"
                     >
                        <XCircle className="w-5 h-5" />
                     </button>
                     <button 
                        onClick={() => handleResolve(expense.id, 'approved')}
                        disabled={loadingId === expense.id}
                        className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-emerald-500/20 disabled:opacity-50"
                     >
                        {loadingId === expense.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                     </button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
