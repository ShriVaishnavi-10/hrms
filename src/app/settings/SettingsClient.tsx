'use client'

import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  User as UserIcon, 
  Lock, 
  Bell, 
  Globe,
  Loader2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import ProfileDetails from '@/components/Profile/ProfileDetails'
import SecuritySection from '@/components/Settings/SecuritySection'
import VisibilitySection from '@/components/Settings/VisibilitySection'

type SettingsTab = 'profile' | 'security' | 'notifications' | 'visibility'

export default function SettingsClient({ 
  employee, 
  isAdmin, 
  allEmployees, 
  allDepartments 
}: { 
  employee: any, 
  isAdmin: boolean,
  allEmployees: any[],
  allDepartments: any[]
}) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  const tabs = [
    { id: 'profile', label: 'Personal Profile', icon: UserIcon, desc: 'Manage your digital employee file' },
    { id: 'security', label: 'Security', icon: Lock, desc: 'Update your access credentials' },
    { id: 'notifications', label: 'Alerts', icon: Bell, desc: 'Choose what you want to hear' },
    { id: 'visibility', label: 'Privacy', icon: Globe, desc: 'Directory and internal presence' },
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm text-primary">
                <SettingsIcon className="w-8 h-8" />
             </div>
             Control Center
          </h1>
          <p className="text-muted text-sm font-medium mt-2 max-w-lg">
             Customize your account experience and ensure your organizational profile is accurate and private.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/20 border border-border/50 rounded-xl">
           <ShieldCheck className="w-4 h-4 text-primary" />
           <span className="text-[10px] font-black font-mono text-muted uppercase tracking-widest">
              Authenticated Access
           </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-2">
           {tabs.map((tab) => (
              <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as SettingsTab)}
                 className={`w-full group text-left px-5 py-4 rounded-3xl transition-all border-2 flex items-center justify-between ${
                   activeTab === tab.id 
                     ? 'bg-primary text-white border-primary shadow-xl shadow-primary/10' 
                     : 'bg-card border-border hover:border-primary/20 hover:bg-primary/5'
                 }`}
              >
                 <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl group-hover:scale-110 transition-transform ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-muted/10 text-muted'
                    }`}>
                       <tab.icon className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[11px] font-black uppercase tracking-widest tracking-tight leading-none mb-1">
                         {tab.label}
                       </p>
                       <p className={`text-[9px] font-bold uppercase transition-colors opacity-60 ${
                         activeTab === tab.id ? 'text-white' : 'text-muted'
                       }`}>
                         {tab.id}
                       </p>
                    </div>
                 </div>
                 {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
              </button>
           ))}
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3 min-h-[600px]">
           {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                   <UserIcon className="w-5 h-5 text-primary" />
                   <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Profile Dashboard</h3>
                </div>
                <ProfileDetails 
                   employee={employee} 
                   isAdmin={isAdmin} 
                   isSelf={true} 
                   allEmployees={allEmployees}
                   allDepartments={allDepartments}
                />
              </div>
           )}

           {activeTab === 'security' && <SecuritySection />}

           {activeTab === 'visibility' && (
              <VisibilitySection 
                 userId={employee.id} 
                 initialVisibility={employee.is_public ?? true} 
              />
           )}

           {activeTab === 'notifications' && (
              <div className="bg-card border border-border rounded-3xl p-16 text-center space-y-6 opacity-40 grayscale pointer-events-none select-none">
                 <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                    <Bell className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-foreground tracking-tight">Notification Channels</h3>
                    <p className="text-xs font-bold text-muted uppercase tracking-widest mt-2">Currently being optimized for your experience</p>
                 </div>
              </div>
           )}
        </main>
      </div>
    </div>
  )
}
