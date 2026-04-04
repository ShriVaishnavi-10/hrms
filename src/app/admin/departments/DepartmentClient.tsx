'use client'

import { useState } from 'react'
import { createDepartment, updateDepartment, deleteDepartment } from '@/app/employees/actions'
import { useToast } from '@/components/UI/Toast'
import { Plus, Edit2, Trash2, Home, Hash, User, Loader2, X, Check } from 'lucide-react'

type Dept = {
  id: string
  name: string
  cost_center: string | null
  head_profile_id: string | null
  head?: { id: string, full_name: string, designation: string } | null
}

export default function DepartmentClient({ departments, employees }: { departments: Dept[], employees: any[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const toast = useToast()

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading('create')
    const fd = new FormData(e.currentTarget)
    const name = fd.get('name') as string
    const cc = fd.get('cost_center') as string
    
    const result = await createDepartment(name, cc)
    if (result.success) {
      toast.success(`Department "${name}" created.`)
      setIsAdding(false)
    } else {
      toast.error(result.error || "Failed to create department.")
    }
    setLoading(null)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    setLoading(id)
    const fd = new FormData(e.currentTarget)
    const name = fd.get('name') as string
    const cc = fd.get('cost_center') as string
    const headId = fd.get('head_profile_id') as string

    const result = await updateDepartment(id, { 
      name, 
      cost_center: cc, 
      head_profile_id: headId === 'none' ? null : headId 
    })

    if (result.success) {
      toast.success("Department updated successfully.")
      setEditingId(null)
    } else {
      toast.error(result.error || "Update failed.")
    }
    setLoading(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return
    setLoading(id)
    const result = await deleteDepartment(id)
    if (result.success) {
      toast.success("Department deleted.")
    } else {
      toast.error(result.error || "Delete failed.")
    }
    setLoading(null)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Department Management</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Dept
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-extrabold text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Initialize New Department
             </h3>
             <button onClick={() => setIsAdding(false)} className="text-muted hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Department Name</label>
                <input name="name" required placeholder="e.g., Engineering, Marketing" className="w-full bg-muted/5 border border-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Cost Center Code</label>
                <input name="cost_center" placeholder="e.g., CC-001" className="w-full bg-muted/5 border border-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
             </div>
             <div className="md:col-span-2 flex justify-end">
                <button disabled={loading === 'create'} type="submit" className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest">
                   {loading === 'create' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Creation'}
                </button>
             </div>
          </form>
        </div>
      )}

      {/* Dept List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            {editingId === dept.id ? (
              <form onSubmit={(e) => handleUpdate(e, dept.id)} className="space-y-4">
                 <div className="space-y-1">
                    <input name="name" defaultValue={dept.name} required className="w-full bg-muted/20 border border-primary/20 rounded-lg px-3 py-2 text-sm font-bold outline-none" />
                    <input name="cost_center" defaultValue={dept.cost_center || ''} placeholder="Cost Center" className="w-full bg-muted/20 border border-primary/20 rounded-lg px-3 py-2 text-xs font-bold outline-none" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest pl-1">Department Head</label>
                    <select name="head_profile_id" defaultValue={dept.head_profile_id || 'none'} className="w-full bg-muted/20 border border-primary/20 rounded-lg px-3 py-2 text-xs font-bold outline-none">
                       <option value="none">No Head Assigned</option>
                       {employees.map(emp => (
                         <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                       ))}
                    </select>
                 </div>
                 <div className="flex items-center gap-2">
                    <button type="submit" disabled={loading === dept.id} className="flex-1 py-2 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                       {loading === dept.id ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Save'}
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="p-2 bg-muted/20 text-muted rounded-lg"><X className="w-4 h-4" /></button>
                 </div>
              </form>
            ) : (
              <>
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all flex gap-3">
                   <button onClick={() => setEditingId(dept.id)} className="p-2 bg-muted/30 rounded-lg hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                   <button onClick={() => handleDelete(dept.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
                
                <div className="space-y-4">
                   <div className="space-y-1">
                      <h4 className="text-xl font-black text-foreground tracking-tight leading-none">{dept.name}</h4>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{dept.cost_center || 'General'}</p>
                   </div>
                   
                   <div className="pt-4 border-t border-border/50 space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-muted/30 rounded-lg">
                            <User className="w-4 h-4 text-muted" />
                         </div>
                         <div>
                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest">Dept Head</p>
                            <p className="text-xs font-extrabold text-foreground">{dept.head?.full_name || 'Unassigned'}</p>
                         </div>
                      </div>
                   </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
