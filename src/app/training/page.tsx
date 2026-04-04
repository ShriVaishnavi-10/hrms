import { getProfile } from '@/utils/supabase/profiles'
import { getMyTrainings, assignTraining } from './actions'
import { getAllEmployees } from '@/app/employees/actions'
import { GraduationCap, BookOpen, Award, Info, Plus, Loader2, Save, Users, History } from 'lucide-react'
import TrainingDashboard from '@/components/Training/TrainingDashboard'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default async function TrainingPage() {
  const profile = await getProfile()
  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'hr_manager'
  
  const myTrainings = await getMyTrainings()
  const employees = isAdmin ? await getAllEmployees() : []

  return (
    <DashboardLayout activePage="recruitment">
      <div className="space-y-16 pb-20 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              Learning & Development
            </h1>
            <p className="text-muted text-sm font-medium max-w-lg">
              Manage professional development, assigned curriculums, and institutional certification records.
            </p>
          </div>
        </div>

        <section className="space-y-10">
           <div className="flex items-center gap-3 px-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Active Curriculum Synchronization</h2>
           </div>
           <TrainingDashboard trainings={myTrainings} />
        </section>

        {isAdmin && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-border/50">
              {/* Assignment Form */}
              <div className="lg:col-span-8 bg-card border border-border rounded-[2.5rem] p-10 shadow-sm space-y-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Plus className="w-48 h-48 rotate-12 scale-110" />
                 </div>
                 
                 <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold shadow-lg shadow-primary/5">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-foreground tracking-tight uppercase leading-none">Assign Global Curriculum</h3>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Institutional Competency Management</p>
                    </div>
                 </div>

                 <form className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Curriculum Name</label>
                          <input name="title" required className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/40" placeholder="e.g., Senior Systems Architecture" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Assigned Employee</label>
                          <select name="assigned_to" required className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer">
                             <option value="">Select Professional...</option>
                             {employees.map(e => (
                                <option key={e.id} value={e.id}>{e.full_name}</option>
                             ))}
                          </select>
                       </div>
                       <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Instructional Description</label>
                          <textarea name="description" required rows={4} className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="Detail the core learning objectives and deliverables..." />
                       </div>
                    </div>

                    <div className="pt-6 border-t border-border flex justify-end items-center gap-6">
                       <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-relaxed max-w-[280px] italic">
                          Deployment will trigger an automated enrollment notification to the selected professional.
                       </p>
                       <button className="px-10 py-5 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-foreground/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2">
                          <Save className="w-5 h-5" />
                          Commit Enrollment
                       </button>
                    </div>
                 </form>
              </div>

              {/* Training Stats / Tips */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="bg-foreground p-10 rounded-[2.5rem] text-background shadow-2xl shadow-foreground/20 relative overflow-hidden group">
                    <Award className="w-48 h-48 absolute -right-16 -top-16 text-background/5 rotate-12 transition-transform group-hover:scale-110" />
                    <div className="relative z-10 space-y-6">
                       <div className="flex items-center gap-3">
                          <Trophy className="w-6 h-6 text-primary" />
                          <h4 className="text-xl font-black uppercase tracking-tight">Institutional Impact</h4>
                       </div>
                       <p className="text-xs font-medium opacity-60 uppercase tracking-widest leading-relaxed italic tracking-widest">
                          Continuous professional development synchronizes individual competency with global HRMS standards.
                       </p>
                       <div className="pt-6 border-t border-background/10 space-y-4">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                             <span>Certification Baseline</span>
                             <span>84% Global Average</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-card border border-border rounded-3xl p-8 space-y-4 group">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <History className="w-5 h-5" />
                       </div>
                       <p className="text-[10px] font-black text-foreground uppercase tracking-widest leading-none">Curriculum Lifecyle</p>
                    </div>
                    <p className="text-xs font-medium text-muted/80 leading-relaxed uppercase tracking-widest italic tracking-widest">
                       Training assignments are archived but remain accessible for institutional audits and career progression reviews.
                    </p>
                 </div>
              </div>
           </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
