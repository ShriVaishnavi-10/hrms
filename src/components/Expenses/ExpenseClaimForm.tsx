'use client'

import { useState } from 'react'
import { submitExpenseClaim } from '@/app/expenses/actions'
import { createClient as createBrowserClient } from '@/utils/supabase/client'
import { Receipt, Upload, Plus, AlertCircle, CheckCircle2, Loader2, DollarSign } from 'lucide-react'

export default function ExpenseClaimForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [receiptUrl, setReceiptUrl] = useState('')
  const supabase = createBrowserClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileName = `receipts/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from('documents').upload(fileName, file)
    
    if (error) {
      console.error('UPLOAD ERROR:', error)
      setError('Receipt upload failed. Ensure "documents" bucket exists.')
    } else {
      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName)
      setReceiptUrl(publicUrl)
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const fd = new FormData(e.currentTarget)
    const res = await submitExpenseClaim({
      title: fd.get('title') as string,
      amount: Number(fd.get('amount')),
      category: fd.get('category') as string,
      receipt_url: receiptUrl
    })

    if (res.success) {
      setSuccess(true)
      e.currentTarget.reset()
      setReceiptUrl('')
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(res.error || 'Failed to submit expense claim.')
    }
    setLoading(false)
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-8 animate-in fade-in zoom-in-95 duration-500 overflow-hidden relative">
      {/* Decorative Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30"></div>
      
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold shadow-lg shadow-primary/5">
          <Receipt className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-foreground tracking-tight uppercase leading-none">Submit Expense Claim</h3>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Reimbursement Request & Documentation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Expense Title</label>
              <input 
                 name="title" 
                 required 
                 className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                 placeholder="e.g., Client Lunch, Flight Tickets"
              />
           </div>
           
           <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Amount ($)</label>
              <div className="relative flex items-center">
                 <DollarSign className="w-4 h-4 text-muted absolute left-4" />
                 <input 
                    name="amount" 
                    type="number" 
                    required 
                    className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 pl-10 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="0.00"
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Claim Category</label>
              <select name="category" required className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer">
                 <option value="travel">✈️ Travel & Commute</option>
                 <option value="food">🍽️ Food & Meals</option>
                 <option value="medical">🏥 Medical Expenses</option>
                 <option value="supplies">📦 Office Supplies</option>
                 <option value="others">✨ Others</option>
              </select>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Proof of Purchase (Receipt)</label>
              <div className="relative">
                 <input type="file" onChange={handleUpload} className="hidden" id="receipt-upload" accept="image/*,application/pdf" />
                 <label 
                   htmlFor="receipt-upload" 
                   className={`flex items-center justify-between px-4 py-3 bg-muted/10 border border-dashed border-border rounded-xl text-xs font-bold text-muted cursor-pointer hover:bg-card hover:border-primary/30 transition-all ${receiptUrl ? 'border-primary/50 bg-primary/5' : ''}`}
                 >
                    <div className="flex items-center gap-2">
                       {uploading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Upload className="w-4 h-4" />}
                       {receiptUrl ? 'Receipt Attached ✓' : 'Click to Upload Receipt'}
                    </div>
                    {receiptUrl && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                 </label>
              </div>
           </div>
        </div>

        <div className="pt-4 border-t border-border flex flex-col items-center gap-4">
           {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</p>}
           {success && <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Claim Submitted Successfully!</p>}
           
           <button 
              type="submit" 
              disabled={loading || uploading}
              className="w-fit px-12 py-4 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
           >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Initiate Reimbursement Request
           </button>
           <p className="text-[10px] font-bold text-muted uppercase italic tracking-widest">Documentation is required for auditing purposes.</p>
        </div>
      </form>
    </div>
  )
}
