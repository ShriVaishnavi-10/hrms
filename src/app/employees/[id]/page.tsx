import { getEmployeeFullProfile, getAllEmployees, getDepartments } from '../actions'
import { getProfile } from '@/utils/supabase/profiles'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Mail, 
  Globe,
  Award,
  Users,
  Link as LinkIcon
} from 'lucide-react'
import ProfileDetails from '@/components/Profile/ProfileDetails'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default async function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const employee = await getEmployeeFullProfile(id)
  const caller = await getProfile()
  const allEmployees = await getAllEmployees()
  const allDepartments = await getDepartments()

  if (!employee) {
    return notFound()
  }

  const isAdmin = caller?.role === 'super_admin' || caller?.role === 'hr_manager'

  return (
    <DashboardLayout activePage="employees">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Navigation / Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/employees" 
            className="p-2.5 bg-card border border-border rounded-xl text-muted hover:text-foreground transition-all shadow-sm group hover:border-primary/20"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-[0.2em]">
             Employees <span className="opacity-30">/</span> Profile <span className="opacity-30">/</span> <span className="text-primary">{employee.full_name}</span>
          </div>
        </div>

        {/* Main Identity Card */}
        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 mb-10 overflow-hidden relative group">
           {/* Abstract Design Elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/10 transition-all"></div>
           
           <div className="relative flex flex-col lg:flex-row items-center lg:items-end gap-10">
              {/* Profile Picture */}
              <div className="relative">
                 <div className="w-40 h-40 rounded-[2.5rem] bg-muted flex items-center justify-center border-4 border-card shadow-2xl overflow-hidden">
                    {employee.avatar_url ? (
                      <img src={employee.avatar_url} alt={employee.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl font-black text-primary/30 uppercase tracking-tighter">
                         {employee.full_name?.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    )}
                 </div>
                 <div className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-xl border-4 border-card">
                    <ShieldCheck className="w-5 h-5" />
                 </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center lg:text-left space-y-4">
                 <div>
                    <h2 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight mb-2">
                       {employee.full_name}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm font-bold text-muted uppercase tracking-tight">
                       <span className="flex items-center gap-1.5 px-3 py-1 bg-muted/10 rounded-lg text-primary">
                          <Briefcase className="w-4 h-4" />
                          {employee.designation || 'Specialist'}
                       </span>
                       <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          {employee.department || 'General'}
                       </span>
                       <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          India Office
                       </span>
                    </div>
                 </div>

                 {/* Social / External Links (Placeholders) */}
                 <div className="flex items-center justify-center lg:justify-start gap-3">
                    <button className="p-2.5 bg-muted/20 border border-border/50 rounded-xl text-muted hover:text-blue-600 transition-all">
                       <Globe className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-muted/20 border border-border/50 rounded-xl text-muted hover:text-sky-500 transition-all">
                       <LinkIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-muted/20 border border-border/50 rounded-xl text-muted hover:text-foreground transition-all">
                       <Globe className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-border mx-2"></div>
                    <a href={`mailto:${employee.email}`} className="px-4 py-2 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                       <Mail className="w-4 h-4" />
                       Send Message
                    </a>
                 </div>
              </div>

              {/* Stats Highlights */}
              <div className="hidden lg:grid grid-cols-2 gap-4 pb-4">
                 <div className="p-4 bg-muted/5 border border-border rounded-3xl text-center min-w-[120px]">
                    <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-1">Performance</p>
                    <p className="text-xl font-black text-foreground tracking-tight">9.2</p>
                 </div>
                 <div className="p-4 bg-muted/5 border border-border rounded-3xl text-center min-w-[120px]">
                    <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-1">Attendance</p>
                    <p className="text-xl font-black text-emerald-600 tracking-tight">98%</p>
                 </div>
              </div>
           </div>
        </div>

        {/* High-Detail Tabs Section */}
        <ProfileDetails 
          employee={employee} 
          isAdmin={isAdmin} 
          allEmployees={allEmployees} 
          allDepartments={allDepartments} 
        />
      </div>
    </DashboardLayout>
  )
}
