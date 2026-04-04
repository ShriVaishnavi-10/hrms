'use client'

import { useState } from 'react'
import { updateProfileVisibility } from '@/app/employees/actions'
import { useToast } from '@/components/UI/Toast'
import { Globe, ShieldCheck, EyeOff, Eye, Loader2, CheckCircle2 } from 'lucide-react'

export default function VisibilitySection({ userId, initialVisibility }: { userId: string, initialVisibility: boolean }) {
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(initialVisibility)
  const toast = useToast()

  const handleToggle = async () => {
    setLoading(true)
    const nextStatus = !isVisible
    const result = await updateProfileVisibility(userId, nextStatus)
    
    if (result.success) {
      setIsVisible(nextStatus)
      toast.success(nextStatus ? "Profile is now public." : "Profile is now hidden.")
    } else {
      toast.error(result.error || "Update failed.")
    }
    setLoading(false)
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-2xl space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
               <Globe className="w-5 h-5 text-primary" />
               Presence & Visibility
            </h3>
            <p className="text-xs font-medium text-muted">
              Control your visibility in the company directory and internal searches.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Public Profile Card */}
           <div 
             onClick={handleToggle}
             className={`cursor-pointer p-6 rounded-3xl border-2 transition-all group relative overflow-hidden ${
               isVisible 
                 ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' 
                 : 'bg-muted/5 border-border hover:border-primary/20'
             }`}
           >
              {loading && (
                <div className="absolute inset-0 bg-card/40 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
                   <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                 <div className={`p-3 rounded-2xl transition-all ${
                   isVisible ? 'bg-primary text-white shadow-xl' : 'bg-muted text-muted-foreground'
                 }`}>
                    {isVisible ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                 </div>
                 <div className={`w-12 h-6 rounded-full p-1 transition-all ${
                   isVisible ? 'bg-primary' : 'bg-muted-foreground/30'
                 }`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-all shadow-sm ${
                      isVisible ? 'translate-x-6' : 'translate-x-0'
                    }`}></div>
                 </div>
              </div>

              <h4 className={`text-sm font-black mb-1 transition-colors ${isVisible ? 'text-primary' : 'text-foreground'}`}>
                 Public Directory Presence
              </h4>
              <p className="text-[10px] font-bold text-muted uppercase tracking-tight leading-relaxed">
                 {isVisible 
                   ? 'Your profile is visible to colleagues in the employee directory.' 
                   : 'Your profile is hidden from the directory. Only Admins can see you.'}
              </p>
           </div>

           {/* Informational Card */}
           <div className="p-6 bg-muted/5 border border-border rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-primary" />
                 <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Privacy Standards</span>
              </div>
              <ul className="space-y-3">
                 <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-primary rounded-full mt-1.5"></div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-tight">Hiding your profile prevents non-admin search.</p>
                 </li>
                 <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-primary rounded-full mt-1.5"></div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-tight">System tasks & payroll are unaffected.</p>
                 </li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  )
}
