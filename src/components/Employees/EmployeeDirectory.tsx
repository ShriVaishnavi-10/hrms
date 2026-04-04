'use client'

import { useState, useMemo } from 'react'
import { Users, Search, Filter, Mail, Briefcase, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type Profile = {
  id: string
  full_name: string | null
  role: string
  department: string | null
  designation: string | null
  avatar_url: string | null
}

export default function EmployeeDirectory({ employees }: { employees: Profile[] }) {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const nameMatch = emp.full_name?.toLowerCase().includes(search.toLowerCase())
      const deptMatch = !deptFilter || emp.department === deptFilter
      const designationMatch = emp.designation?.toLowerCase().includes(search.toLowerCase())
      
      return (nameMatch || designationMatch) && deptMatch
    })
  }, [employees, search, deptFilter])

  return (
    <div className="space-y-10">
      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-card border border-border rounded-3xl shadow-sm sticky top-4 z-20 backdrop-blur-md bg-card/90">
        <div className="md:col-span-2 relative flex items-center">
          <Search className="w-4.5 h-4.5 text-muted absolute left-4" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, designation..." 
            className="w-full bg-muted/5 border-none rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>
        <div className="relative flex items-center col-span-1 md:col-span-2">
           <Filter className="w-4 h-4 text-muted absolute left-4" />
           <select 
             value={deptFilter}
             onChange={(e) => setDeptFilter(e.target.value)}
             className="w-full bg-muted/5 border-none rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer"
           >
              <option value="">All Departments</option>
              <option value="it">IT & Engineering</option>
              <option value="hr">Human Resources</option>
              <option value="ops">Operations</option>
              <option value="sales">Sales & Marketing</option>
           </select>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="group bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center">
            {/* Decorative Accent */}
            <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-10 transition-opacity">
              <Users className="w-20 h-20 rotate-12 translate-x-4 -translate-y-4 text-primary" />
            </div>

            {/* Avatar/Initial */}
            <div className="w-20 h-20 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary text-2xl font-black mb-4 group-hover:scale-110 transition-transform duration-500">
              {emp.full_name?.charAt(0) || '?'}
            </div>

            {/* Info */}
            <div className="space-y-1 mb-6">
              <h3 className="font-extrabold text-foreground text-lg cursor-pointer hover:text-primary transition-colors">{emp.full_name}</h3>
              <p className="text-primary text-xs font-bold uppercase tracking-widest">{emp.designation || 'Specialist'}</p>
              <p className="text-muted text-[11px] font-medium tracking-tight">@{emp.department || 'General'}</p>
            </div>

            {/* Contact Icons Placeholder */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-muted/10 rounded-xl text-muted hover:text-primary hover:bg-primary/10 transition-all cursor-pointer">
                <Mail className="w-4 h-4" />
              </div>
              <div className="p-2.5 bg-muted/10 rounded-xl text-muted hover:text-primary hover:bg-primary/10 transition-all cursor-pointer">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="p-2.5 bg-muted/10 rounded-xl text-muted hover:text-primary hover:bg-primary/10 transition-all cursor-pointer">
                <MapPin className="w-4 h-4" />
              </div>
            </div>

            {/* View Profile Button */}
            <Link 
              href={`/employees/${emp.id}`}
              className="w-full py-3 px-4 bg-muted/10 border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary rounded-xl text-xs font-black uppercase tracking-widest transition-all mt-auto flex items-center justify-center gap-2"
            >
              View Full Profile
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/5 border border-dashed border-border rounded-3xl">
          <Users className="w-16 h-16 text-muted mb-4 opacity-20" />
          <p className="text-muted font-bold tracking-tight">No employees found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
