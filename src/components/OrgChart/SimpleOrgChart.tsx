'use client'

import { 
  Users, 
  ChevronDown, 
  ArrowDown, 
  User as UserIcon,
  Briefcase
} from 'lucide-react'

type OrgNode = {
  id: string
  full_name: string
  designation: string
  avatar_url?: string | null
}

export default function SimpleOrgChart({ 
  employee, 
  manager 
}: { 
  employee: OrgNode, 
  manager?: OrgNode | null 
}) {
  return (
    <div className="space-y-6">
      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
        <Users className="w-3.5 h-3.5" />
        Reporting Hierarchy
      </h4>

      <div className="flex flex-col items-center gap-10 relative">
        {/* Manager Node (Optional) */}
        {manager && (
          <>
            <div className="w-full max-w-[280px] bg-card border border-border/80 rounded-3xl p-5 shadow-sm hover:border-primary/30 transition-all relative group">
              {/* Connector Down */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-primary/20 group-hover:bg-primary transition-all"></div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center font-black text-primary overflow-hidden border border-border/50">
                   {manager.avatar_url ? (
                     <img src={manager.avatar_url} alt={manager.full_name} className="w-full h-full object-cover" />
                   ) : (
                     manager.full_name?.split(' ').map(n => n[0]).join('')
                   )}
                </div>
                <div>
                  <p className="text-sm font-black text-foreground tracking-tight leading-none">{manager.full_name}</p>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{manager.designation || 'Manager'}</p>
                </div>
              </div>
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-[8px] font-black uppercase tracking-widest">
                 REPORTS TO
              </div>
            </div>
            <div className="w-2 h-2 bg-primary rounded-full relative z-10 -mt-2"></div>
          </>
        )}

        {/* Current Employee Node */}
        <div className="w-full max-w-[320px] bg-primary text-primary-foreground rounded-3xl p-6 shadow-2xl shadow-primary/20 relative group scale-110">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center font-black text-primary text-xl shadow-lg border-2 border-primary/20 overflow-hidden">
                 {employee.avatar_url ? (
                    <img src={employee.avatar_url} alt={employee.full_name} className="w-full h-full object-cover" />
                 ) : (
                    employee.full_name?.split(' ').map(n => n[0]).join('')
                 )}
              </div>
              <div>
                <p className="text-lg font-black tracking-tight leading-tight mb-1">{employee.full_name}</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{employee.designation || 'Staff'}</p>
              </div>
           </div>
           <div className="absolute -top-3 -right-3 p-3 bg-white text-primary rounded-2xl shadow-xl border border-primary/5">
              <UserIcon className="w-5 h-5" />
           </div>
        </div>

        {/* Footer info/legend */}
        <div className="pt-4 text-center">
           <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em] italic">
             {manager ? 'Reporting Line Active' : 'End of Management Chain'}
           </p>
        </div>
      </div>
    </div>
  )
}
