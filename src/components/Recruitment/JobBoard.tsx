'use client'

import { useState } from 'react'
import { createJob, updateJobStatus } from '@/app/recruitment/actions'
import { Briefcase, Plus, Search, MapPin, Building, Calendar, Loader2, Save, XCircle, CheckCircle2, ChevronRight, LayoutGrid, List } from 'lucide-react'

export default function JobBoard({ jobs }: { jobs: any[] }) {
  const [loading, setLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = await createJob({
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      department: fd.get('department') as string,
      location: fd.get('location') as string,
      type: fd.get('type') as string
    })
    
    if (res.success) {
      e.currentTarget.reset()
      setShowAdd(false)
    } else {
      alert(res.error || 'Failed to create job.')
    }
    setLoading(false)
  }

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open'
    await updateJobStatus(id, newStatus)
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
         <div className="space-y-1">
            <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">Global Job Postings</h3>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] italic">Awaiting administrative validation</p>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted/10 p-1.5 rounded-xl border border-border">
               <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted hover:text-foreground'}`}><LayoutGrid className="w-4 h-4" /></button>
               <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted hover:text-foreground'}`}><List className="w-4 h-4" /></button>
            </div>
            <button 
               onClick={() => setShowAdd(!showAdd)}
               className="px-6 py-3.5 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
               {showAdd ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
               {showAdd ? 'Cancel Creation' : 'Post New Opening'}
            </button>
         </div>
      </div>

      {showAdd && (
         <div className="bg-card border-2 border-primary/20 rounded-[2.5rem] p-10 shadow-2xl animate-in slide-in-from-top-4 duration-500 relative overflow-hidden group">
            {/* Decorative Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
            
            <form onSubmit={handleCreate} className="space-y-8 relative z-10">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold shadow-lg shadow-primary/5">
                     <Briefcase className="w-5 h-5" />
                  </div>
                  <h4 className="text-xl font-black text-foreground tracking-tight leading-none uppercase">Define Position Parameters</h4>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Job Title / Role</label>
                     <input name="title" required className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/40" placeholder="e.g., Lead Systems Engineer" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Assigned Department</label>
                     <input name="department" required className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/40" placeholder="e.g., Engineering & DevOps" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Geographic Location</label>
                     <input name="location" required className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/40" placeholder="e.g., London / Remote" />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                     <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Role Description & Requirements</label>
                     <textarea name="description" required rows={4} className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="Detail the core missions and required expertise..." />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Employment Type</label>
                     <select name="type" className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer">
                        <option value="full_time">✈️ Full Time Equivalent (FTE)</option>
                        <option value="part_time">🕒 Part Time Support</option>
                        <option value="contract">📦 Project Basis / Contract</option>
                        <option value="internship">🌱 Professional Internship</option>
                     </select>
                  </div>
               </div>

               <div className="pt-6 border-t border-border flex justify-end">
                  <button 
                     type="submit" 
                     disabled={loading}
                     className="px-10 py-5 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-foreground/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                     Finalize Job Publication
                  </button>
               </div>
            </form>
         </div>
      )}

      {jobs.length === 0 ? (
         <div className="py-32 flex flex-col items-center justify-center bg-muted/5 border-2 border-dashed border-border rounded-[3rem] opacity-40">
            <Search className="w-16 h-16 text-muted mb-6 opacity-30" />
            <div className="space-y-2 text-center">
               <p className="text-sm font-black text-muted uppercase tracking-[0.3em] italic tracking-widest">Global Positions Database Empty</p>
               <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Awaiting initial administrative population</p>
            </div>
         </div>
      ) : (
         <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
            {jobs.map((job) => (
               <div key={job.id} className="group bg-card border border-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[340px]">
                  {/* Decorative Gradient */}
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 transition-opacity group-hover:opacity-30 ${job.status === 'open' ? 'bg-primary' : 'bg-red-500'}`}></div>
                  
                  <div className="space-y-6 relative z-10">
                     <div className="flex items-center justify-between">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                           job.status === 'open' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                           {job.status}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest opacity-60">
                           <Calendar className="w-3.5 h-3.5" />
                           {new Date(job.created_at).toLocaleDateString()}
                        </div>
                     </div>

                     <div className="space-y-2">
                        <h5 className="text-2xl font-black text-foreground tracking-tighter leading-tight uppercase group-hover:text-primary transition-colors">{job.title}</h5>
                        <div className="flex flex-wrap gap-4 pt-2">
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                              <Building className="w-4 h-4" />
                              {job.department}
                           </div>
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                           </div>
                        </div>
                     </div>

                     <p className="text-xs font-medium text-muted/60 leading-relaxed line-clamp-3 uppercase tracking-widest italic group-hover:text-muted/80 transition-colors">
                        {job.description}
                     </p>
                  </div>

                  <div className="pt-8 flex items-center justify-between relative z-10 border-t border-border/50 group-hover:border-primary/20 transition-colors">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted uppercase tracking-widest leading-none">Internal Logistics</p>
                        <p className="text-sm font-black text-foreground tracking-tight uppercase">{job.type.replace('_', ' ')}</p>
                     </div>
                     <button 
                        onClick={() => handleStatusChange(job.id, job.status)}
                        className={`p-3.5 rounded-2xl transition-all shadow-sm ${
                           job.status === 'open' ? 'bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                        }`}
                        title={job.status === 'open' ? 'Close Position' : 'Reopen Position'}
                     >
                        {job.status === 'open' ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                     </button>
                  </div>
               </div>
            ))}
         </div>
      )}
    </div>
  )
}
