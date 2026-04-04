import { getProfile } from '@/utils/supabase/profiles'
import { getJobs, getApplicants, getInterviews } from './actions'
import { getAllEmployees } from '@/app/employees/actions'
import { Briefcase, Users, Calendar, TrendingUp, Handshake, Info, ShieldCheck } from 'lucide-react'
import JobBoard from '@/components/Recruitment/JobBoard'
import ApplicantTable from '@/components/Recruitment/ApplicantTable'
import InterviewScheduler from '@/components/Recruitment/InterviewScheduler'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default async function RecruitmentPage() {
  const profile = await getProfile()
  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'hr_manager'
  
  if (!isAdmin) {
    return (
      <DashboardLayout activePage="recruitment">
         <div className="py-32 flex flex-col items-center justify-center bg-card border border-border rounded-[3rem] shadow-sm opacity-60">
            <ShieldCheck className="w-16 h-16 text-muted mb-4 opacity-20" />
            <p className="text-xs font-black text-muted uppercase tracking-widest italic tracking-widest leading-none">Global Recruitment Restricted Access</p>
         </div>
      </DashboardLayout>
    )
  }

  const jobs = await getJobs()
  const applicants = await getApplicants()
  const interviews = await getInterviews()
  const employees = await getAllEmployees()

  return (
    <DashboardLayout activePage="recruitment">
      <div className="space-y-16 pb-20 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm">
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              Recruitment Lifecycle
            </h1>
            <p className="text-muted text-sm font-medium max-w-lg">
              Manage global talent acquisition, job publication, applicant tracking, and interview synchronization.
            </p>
          </div>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Briefcase className="w-24 h-24 rotate-12 translate-x-4 -translate-y-4" />
              </div>
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Active Global Openings</p>
              <h3 className="text-4xl font-black text-foreground tracking-tighter tabular-nums">{jobs.filter(j => j.status === 'open').length}</h3>
           </div>
           <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users className="w-24 h-24 -rotate-12 translate-x-4 -translate-y-4" />
              </div>
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Total Talent Database</p>
              <h3 className="text-4xl font-black text-blue-600 tracking-tighter tabular-nums">{applicants.length}</h3>
           </div>
           <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-emerald-500/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Calendar className="w-24 h-24 rotate-12 translate-x-4 -translate-y-4 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Scheduled Assessments</p>
              <h3 className="text-4xl font-black text-emerald-600 tracking-tighter tabular-nums">{interviews.length}</h3>
           </div>
        </div>

        {/* Sub-Modules */}
        <section className="space-y-10">
           <div className="flex items-center gap-3 px-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Active Recruitment Synchronization</h2>
           </div>
           
           <div className="grid grid-cols-1 gap-12">
              {/* Job Board */}
              <div className="space-y-6">
                 <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest pl-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Job Publication Engine
                 </div>
                 <JobBoard jobs={jobs} />
              </div>

              {/* Applicant Tracker */}
              <div className="space-y-6 lg:col-span-2 pt-8 border-t border-border/50">
                 <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest pl-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Candidate Tracker Repository
                 </div>
                 <ApplicantTable applicants={applicants} />
              </div>

              {/* Scheduling Tool */}
              <div className="space-y-6 pt-8 border-t border-border/50">
                 <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest pl-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Interview Logistics Core
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                       <InterviewScheduler applicants={applicants} employees={employees} />
                    </div>
                    <div className="lg:col-span-4 bg-foreground p-10 rounded-[2.5rem] text-background shadow-2xl shadow-foreground/20 relative overflow-hidden group">
                       <Info className="w-48 h-48 absolute -right-16 -bottom-16 text-background/5 -rotate-12 transition-transform group-hover:scale-110" />
                       <div className="relative z-10 space-y-6">
                          <h4 className="text-xl font-black uppercase tracking-tight leading-none">Internal Protocol</h4>
                          <p className="text-xs font-medium opacity-60 uppercase tracking-widest leading-relaxed italic tracking-widest">
                             Scheduling an interview automatically notifies the interviewer and updates the talent baseline to "Interview" stage globally.
                          </p>
                          <div className="pt-6 border-t border-background/10 space-y-4">
                             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                <span>Recent Sync Log</span>
                                <span>{interviews.length} Entries</span>
                             </div>
                             <div className="space-y-3">
                                {interviews.slice(0, 3).map(i => (
                                   <div key={i.id} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest pb-3 border-b border-background/10 last:border-0 opacity-80">
                                      <Calendar className="w-3.5 h-3.5 text-primary" />
                                      {i.applicant?.full_name} | {new Date(i.scheduled_at).toLocaleDateString()}
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
