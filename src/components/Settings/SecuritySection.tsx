'use client'

import { useState } from 'react'
import { updatePassword } from '@/app/employees/actions'
import { useToast } from '@/components/UI/Toast'
import { Lock, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react'

export default function SecuritySection() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const fd = new FormData(e.currentTarget)
    const newPass = fd.get('new_password') as string
    const confirmPass = fd.get('confirm_password') as string

    if (newPass !== confirmPass) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    if (newPass.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    const result = await updatePassword(newPass)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Security credentials updated!")
      e.currentTarget.reset()
    }
    setLoading(false)
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-md space-y-8">
        <div>
          <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
             <Lock className="w-5 h-5 text-primary" />
             Password & Security
          </h3>
          <p className="text-xs font-medium text-muted mt-2">
            Keep your account secure by following best practices for password strength.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100">
             <ShieldAlert className="w-5 h-5" />
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">New Password</label>
              <input 
                name="new_password" 
                type="password" 
                required 
                className="w-full bg-muted/5 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                placeholder="••••••••"
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Confirm New Password</label>
              <input 
                name="confirm_password" 
                type="password" 
                required 
                className="w-full bg-muted/5 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                placeholder="••••••••"
              />
           </div>

           <button 
             disabled={loading} 
             type="submit" 
             className="w-full py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
           >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Update Security Credentials'
              )}
           </button>
        </form>
      </div>
    </div>
  )
}
