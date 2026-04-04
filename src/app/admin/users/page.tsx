import { createClient } from '@/utils/supabase/server'
import { getProfile } from '@/utils/supabase/profiles'
import { redirect } from 'next/navigation'
import UserRow from './UserRow'
import { Users, ShieldCheck, Search, Filter, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const profile = await getProfile()

  // 1. Authorization check
  if (!profile || (profile.role !== 'super_admin' && profile.role !== 'hr_manager')) {
    return redirect('/')
  }

  // 2. Fetch all profiles
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500 font-bold text-lg">Error loading user database.</p>
        <Link href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold">Go Back</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumbs & Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-widest mb-2 group">
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-foreground/60">Admin Settings</span>
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              User & Role Management
            </h1>
            <p className="text-muted text-sm font-medium">Assign roles, departments, and manage access levels for your organization.</p>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/10 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <div className="text-[10px] leading-tight">
              <p className="font-bold text-primary uppercase tracking-tight">Admin Access Active</p>
              <p className="text-muted lowercase font-medium">{profile.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Filters/Search (Visual only for now) */}
        <div className="flex items-center gap-4 bg-card/50 p-4 border border-border/50 rounded-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search employees by name, role or department..." 
              className="w-full bg-muted/10 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border shadow-sm rounded-xl text-xs font-bold text-foreground hover:bg-muted/10 transition-all cursor-pointer">
            <Filter className="w-3.5 h-3.5" />
            Advanced Filters
          </button>
        </div>

        {/* User Table */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/5 border-b border-border/50">
                <tr>
                  <th className="py-4 px-6 text-[11px] font-bold text-muted uppercase tracking-widest uppercase">Employee Details</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-muted uppercase tracking-widest uppercase">Assigned Role</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-muted uppercase tracking-widest uppercase">Department</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-muted uppercase tracking-widest uppercase">Joined Date</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-muted uppercase tracking-widest uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {users.map((user: any) => (
                  <UserRow key={user.id} user={user} currentAdminRole={profile.role} />
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-muted/5 border-t border-border/50 text-center">
            <p className="text-xs font-semibold text-muted tracking-tight">Showing {users.length} total employees in organization database.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
