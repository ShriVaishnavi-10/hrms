'use client'

import { useState } from 'react'
import { updateApplicantStatus } from '@/app/recruitment/actions'
import { User, Mail, Phone, FileText, ChevronRight, CheckCircle2, XCircle, Clock, Search, ListFilter, Download, Loader2 } from 'lucide-react'

export default function ApplicantTable({ applicants }: { applicants: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hired': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />
      case 'interview': return <Clock className="w-5 h-5 text-blue-500" />
      default: return <User className="w-5 h-5 text-muted" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hired': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'interview': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'offered': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    setLoadingId(id)
    await updateApplicantStatus(id, status)
    setLoadingId(null)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
         <div className="space-y-1">
            <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Talent Acquisition Tracker</h3>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] italic">Full Pipeline Lifecycle Monitoring</p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="relative">
               <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
               <input className="bg-muted/10 border border-border rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all w-64 uppercase tracking-widest placeholder:text-muted/40" placeholder="Global Search..." />
            </div>
            <button className="p-2.5 bg-muted/10 text-muted border border-border rounded-xl hover:bg-primary hover:text-white transition-all">
               <ListFilter className="w-4.5 h-4.5" />
            </button>
         </div>
      </div>

      <div className="space-y-4">
        {applicants.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center bg-card border border-border rounded-[2.5rem] shadow-sm opacity-40">
             <User className="w-16 h-16 text-muted mb-4 opacity-20" />
             <p className="text-xs font-bold text-muted uppercase tracking-[0.3em] italic tracking-widest leading-none">Applicant Repository Empty</p>
          </div>
        ) : (
          applicants.map((applicant) => (
            <div key={applicant.id} className="group bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
               {/* Candidate Identity */}
               <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className="w-16 h-16 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-center relative shadow-inner group-hover:scale-105 transition-transform">
                     <span className="text-xl font-black text-primary uppercase">{applicant.full_name?.charAt(0)}</span>
                     <div className="absolute -bottom-1 -right-1 p-1 bg-background border border-border rounded-lg shadow-sm">
                        {getStatusIcon(applicant.status)}
                     </div>
                  </div>
                  
                  <div className="space-y-1 min-w-0">
                     <h4 className="text-lg font-black text-foreground tracking-tight leading-none uppercase truncate">{applicant.full_name}</h4>
                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] truncate">{applicant.job?.title || 'Unknown Position'}</p>
                     
                     <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted uppercase tracking-widest">
                           <Mail className="w-3.5 h-3.5" />
                           {applicant.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted uppercase tracking-widest">
                           <Phone className="w-3.5 h-3.5" />
                           {applicant.phone || 'No Contact'}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Interview Metrics */}
               <div className="flex flex-col items-center md:items-end gap-1">
                  <p className="text-[9px] font-black text-muted uppercase tracking-widest leading-none opacity-40">Current Pipeline Position</p>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusColor(applicant.status)}`}>
                     {applicant.status}
                  </div>
                  <p className="text-[9px] font-medium text-muted/60 uppercase tracking-widest pt-1 italic">{new Date(applicant.created_at).toLocaleDateString()}</p>
               </div>

               {/* Pipeline Controls */}
               <div className="flex items-center gap-3">
                  {applicant.resume_url && (
                    <a 
                      href={applicant.resume_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-3 bg-muted/10 text-muted rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm border border-border"
                      title="View Resume Portfolio"
                    >
                       <FileText className="w-5 h-5" />
                    </a>
                  )}
                  
                  <div className="h-10 w-px bg-border/50 mx-2 hidden md:block"></div>
                  
                  <div className="flex items-center gap-2">
                     <select 
                        value={applicant.status}
                        onChange={(e) => handleStatusUpdate(applicant.id, e.target.value)}
                        disabled={loadingId === applicant.id}
                        className="bg-muted/10 border border-border rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer appearance-none min-w-[140px]"
                     >
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="offered">Offered</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                     </select>
                     
                     <button 
                        className="p-3 bg-primary text-primary-foreground rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                        title="Process Interview"
                     >
                        <ChevronRight className="w-5 h-5" />
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
