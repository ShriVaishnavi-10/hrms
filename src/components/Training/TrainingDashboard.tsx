'use client'

import { useState } from 'react'
import { updateTrainingStatus } from '@/app/training/actions'
import { GraduationCap, BookOpen, CheckCircle2, Clock, PlayCircle, ExternalLink, Loader2, Trophy, Award, Search, ListFilter } from 'lucide-react'

export default function TrainingDashboard({ trainings }: { trainings: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case 'in_progress': return <PlayCircle className="w-5 h-5 text-blue-500" />
      default: return <Clock className="w-5 h-5 text-amber-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'in_progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    }
  }

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    setLoadingId(id)
    const newStatus = currentStatus === 'assigned' ? 'in_progress' : 'completed'
    await updateTrainingStatus(id, newStatus)
    setLoadingId(null)
  }

  const completedCount = trainings.filter(t => t.status === 'completed').length
  const progressPercent = trainings.length === 0 ? 0 : Math.round((completedCount / trainings.length) * 100)

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-foreground text-background p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Trophy className="w-48 h-48 rotate-12 scale-110" />
            </div>
            <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-black uppercase tracking-tight">Professional Development</h3>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                     <span>Global Competency Progress</span>
                     <span>{progressPercent}% Complete</span>
                  </div>
                  <div className="h-2 w-full bg-background/10 rounded-full overflow-hidden border border-background/5">
                     <div className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary),0.5)] transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
                  </div>
               </div>
               <p className="text-[10px] font-bold text-background/40 uppercase tracking-widest italic pt-2">
                  Completed {completedCount} / {trainings.length} Professional Certifications
               </p>
            </div>
         </div>

         <div className="bg-card border border-border p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden flex flex-col justify-center">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary font-bold shadow-lg shadow-primary/5">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="text-xl font-black text-foreground tracking-tight leading-none uppercase">Learning Catalog</h4>
               </div>
               <div className="flex items-center gap-6">
                  <div className="space-y-1">
                     <p className="text-4xl font-black text-foreground tracking-tighter tabular-nums">{trainings.length}</p>
                     <p className="text-[9px] font-black text-muted uppercase tracking-widest">Enrolled Programs</p>
                  </div>
                  <div className="h-12 w-px bg-border/50 mx-2"></div>
                  <div className="space-y-1">
                     <p className="text-4xl font-black text-blue-600 tracking-tighter tabular-nums">{trainings.filter(t => t.status === 'in_progress').length}</p>
                     <p className="text-[9px] font-black text-muted uppercase tracking-widest">Active Sessions</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
               <ListFilter className="w-5 h-5 text-primary" />
               <h4 className="text-sm font-black text-foreground uppercase tracking-[0.2em]">Active Curriculums</h4>
            </div>
            <div className="flex items-center gap-2">
               <Search className="w-4 h-4 text-muted" />
               <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Awaiting Verification</span>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainings.length === 0 ? (
               <div className="col-span-full py-24 flex flex-col items-center justify-center bg-muted/5 border-2 border-dashed border-border rounded-[3rem] opacity-40">
                  <Award className="w-16 h-16 text-muted mb-4 opacity-20" />
                  <p className="text-xs font-black text-muted uppercase tracking-widest italic tracking-widest">No assigned professional training found.</p>
               </div>
            ) : (
               trainings.map((training) => (
                  <div key={training.id} className="group bg-card border border-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
                     <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 transition-opacity group-hover:opacity-30 ${getStatusColor(training.status).split(' ')[0]}`}></div>
                     
                     <div className="space-y-6 relative z-10">
                        <div className="flex items-center justify-between">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusColor(training.status)}`}>
                              {training.status.replace('_', ' ')}
                           </span>
                           <div className="p-3 bg-muted/10 rounded-2xl text-muted group-hover:scale-110 transition-transform">
                              {getStatusIcon(training.status)}
                           </div>
                        </div>
                        
                        <div className="space-y-2">
                           <h5 className="text-2xl font-black text-foreground tracking-tighter leading-tight uppercase group-hover:text-primary transition-colors">{training.title}</h5>
                           <p className="text-xs font-medium text-muted/60 leading-relaxed uppercase tracking-widest italic line-clamp-3">{training.description}</p>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-border group-hover:border-primary/20 flex items-center justify-between relative z-10 transition-colors">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-muted uppercase tracking-widest leading-none">Enrollment Cycle</p>
                           <p className="text-xs font-black text-foreground tracking-tight uppercase italic">{new Date(training.created_at).toLocaleDateString()}</p>
                        </div>
                        
                        {training.status !== 'completed' ? (
                           <button 
                              onClick={() => handleUpdateStatus(training.id, training.status)}
                              className="px-6 py-3 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-foreground/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
                              disabled={loadingId === training.id}
                           >
                              {loadingId === training.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                              Advance Log
                           </button>
                        ) : (
                           <div className="flex items-center gap-2">
                              {training.completion_url && (
                                 <a 
                                    href={training.completion_url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                                    title="View Portfolio Integration"
                                 >
                                    <ExternalLink className="w-4 h-4" />
                                 </a>
                              )}
                              <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl shadow-sm">
                                 <CheckCircle2 className="w-5 h-5" />
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
    </div>
  )
}
