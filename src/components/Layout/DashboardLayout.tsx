import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProfile } from '@/utils/supabase/profiles'
import { 
  LogOut, 
  User as UserIcon, 
  LayoutDashboard, 
  Settings, 
  Users, 
  Calendar, 
  Briefcase, 
  ReceiptCent, 
  TrendingUp, 
  Handshake, 
  Clock,
  CalendarRange,
  Sun,
  Receipt,
  GraduationCap,
  DoorOpen
} from 'lucide-react'

export default async function DashboardLayout({ 
  children,
  activePage = 'dashboard'
}: { 
  children: React.ReactNode,
  activePage?: 'dashboard' | 'employees' | 'leaves' | 'attendance' | 'admin' | 'payroll' | 'performance' | 'recruitment' | 'profile' | 'settings' | 'holidays'
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const profile = await getProfile()
  const role = profile?.role || 'employee'
  const isAdmin = role === 'super_admin' || role === 'hr_manager'
  const isManager = role === 'dept_manager'

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-primary/5 relative">
              <Image 
                src="/logo.png" 
                alt="Zen HRMS Logo" 
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">HRMS</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/10 border border-border rounded-full text-xs font-medium text-muted">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            System Online
          </div>
          
          <div className="h-8 w-px bg-border mx-1"></div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground leading-none">{profile?.full_name || user.email?.split('@')[0]}</p>
              <p className="text-[10px] text-muted uppercase tracking-widest mt-1 font-bold">
                {role.replace('_', ' ')}
              </p>
            </div>
            <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary">
              <UserIcon className="w-6 h-6" />
            </div>
            <form action="/auth/logout" method="post">
              <button className="p-2 hover:bg-muted/10 rounded-lg text-muted hover:text-red-600 transition-colors cursor-pointer">
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border h-[calc(100vh-64px)] p-6 hidden lg:block sticky top-16 overflow-y-auto bg-card/50">
          <div className="space-y-8">
            <div>
              <p className="text-[11px] font-bold text-muted uppercase tracking-[0.1em] mb-4 ml-1">Main Menu</p>
              <div className="space-y-1">
                <NavItem icon={<LayoutDashboard className="w-4.5 h-4.5" />} label="Dashboard" href="/" active={activePage === 'dashboard'} />
                <NavItem icon={<Users className="w-4.5 h-4.5" />} label="Employees" href="/employees" active={activePage === 'employees'} />
                <NavItem icon={<CalendarRange className="w-4.5 h-4.5" />} label="Leaves" href="/leaves" active={activePage === 'leaves'} />
                <NavItem icon={<Clock className="w-4.5 h-4.5" />} label="Attendance" href="/attendance" active={activePage === 'attendance'} />
                <NavItem icon={<Sun className="w-4.5 h-4.5" />} label="Holidays" href="/holidays" active={activePage === 'holidays'} />
              </div>
            </div>

            {(isAdmin || isManager) && (
              <div>
                <p className="text-[11px] font-bold text-muted uppercase tracking-[0.1em] mb-4 ml-1">Management</p>
                <div className="space-y-1">
                  {isAdmin && <NavItem icon={<Users className="w-4.5 h-4.5" />} label="Manage Users" href="/admin/users" active={activePage === 'admin'} />}
                  {(isAdmin || isManager) && <NavItem icon={<Briefcase className="w-4.5 h-4.5" />} label="Departments" href="/admin/departments" active={activePage === 'admin'} />}
                  {isAdmin && <NavItem icon={<ReceiptCent className="w-4.5 h-4.5" />} label="Payroll" href="/payroll" active={activePage === 'payroll'} />}
                  <NavItem icon={<Receipt className="w-4.5 h-4.5" />} label="Expenses" href="/expenses" active={activePage === 'payroll'} />
                  <NavItem icon={<TrendingUp className="w-4.5 h-4.5" />} label="Performance" href="/performance" active={activePage === 'performance'} />
                  {isAdmin && <NavItem icon={<Handshake className="w-4.5 h-4.5" />} label="Recruitment" href="/recruitment" active={activePage === 'recruitment'} />}
                  <NavItem icon={<GraduationCap className="w-4.5 h-4.5" />} label="Training" href="/training" active={activePage === 'recruitment'} />
                  <NavItem icon={<DoorOpen className="w-4.5 h-4.5" />} label="Exit Management" href="/exit" active={activePage === 'recruitment'} />
                </div>
              </div>
            )}

            <div>
              <p className="text-[11px] font-bold text-muted uppercase tracking-[0.1em] mb-4 ml-1">Settings</p>
              <div className="space-y-1">
                <NavItem icon={<UserIcon className="w-4.5 h-4.5" />} label="My Profile" href="/settings" active={activePage === 'settings'} />
                <NavItem icon={<Settings className="w-4.5 h-4.5" />} label="Settings" href="/settings" active={activePage === 'settings'} />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function NavItem({ 
  icon, 
  label, 
  active = false, 
  href = "#" 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  href?: string 
}) {
  const baseClasses = `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer`
  const activeClasses = `bg-primary text-primary-foreground shadow-sm`
  const inactiveClasses = `text-muted hover:text-foreground hover:bg-muted/10`

  if (href !== "#") {
    return (
      <Link href={href} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
        {icon}
        {label}
      </Link>
    )
  }
  return (
    <button className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
      {icon}
      {label}
    </button>
  )
}
