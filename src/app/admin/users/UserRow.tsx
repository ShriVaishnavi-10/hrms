'use client'

import { useState } from 'react'
import { updateUserRole, updateUserAssignment, deleteUser } from '../actions'
import { Trash2, Check, X, ShieldAlert, Briefcase, User as UserIcon } from 'lucide-react'

type Profile = {
  id: string
  full_name: string | null
  role: 'super_admin' | 'hr_manager' | 'dept_manager' | 'employee'
  department: string | null
  designation: string | null
  created_at: string
}

export default function UserRow({ user, currentAdminRole }: { user: Profile; currentAdminRole: string }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRoleChange = async (newRole: string) => {
    setLoading(true)
    setError(null)
    const result = await updateUserRole(user.id, newRole)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } else {
      setError(result.error || 'Failed to update')
    }
    setLoading(false)
  }

  const handleDeptChange = async (dept: string) => {
    setLoading(true)
    setError(null)
    const result = await updateUserAssignment(user.id, { department: dept })
    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } else {
      setError(result.error || 'Failed to update')
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${user.full_name}?`)) return
    setLoading(true)
    const result = await deleteUser(user.id)
    if (result.success) {
      alert('User deleted successfully.')
    } else {
      alert(result.error || 'Failed to delete user.')
    }
    setLoading(false)
  }

  const roles = ['employee', 'dept_manager', 'hr_manager', 'super_admin']
  const departments = ['Engineering', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations']

  return (
    <tr className="border-b border-border/50 hover:bg-muted/5 transition-colors group">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {user.full_name?.[0] || '?'}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{user.full_name || 'Anonymous'}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">ID: {user.id.slice(0, 8)}</p>
          </div>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-muted shrink-0" />
          <select 
            value={user.role} 
            onChange={(e) => handleRoleChange(e.target.value)}
            disabled={loading || (currentAdminRole !== 'super_admin' && user.role === 'super_admin')}
            className="bg-muted/10 border border-border/10 rounded-lg text-xs font-semibold px-2 py-1 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
          >
            {roles.map(r => (
              <option key={r} value={r}>{r.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>
      </td>

      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-muted shrink-0" />
          <select 
            value={user.department || ''} 
            onChange={(e) => handleDeptChange(e.target.value)}
            disabled={loading}
            className="bg-muted/10 border border-border/10 rounded-lg text-xs font-semibold px-2 py-1 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
          >
            <option value="">Unassigned</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </td>

      <td className="py-4 px-6">
        <p className="text-xs text-muted font-medium">
          {new Date(user.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </td>

      <td className="py-4 px-6 text-right w-20">
        <div className="flex items-center justify-end gap-2">
          {success && <div className="text-emerald-500 animate-in fade-in zoom-in duration-300"><Check className="w-5 h-5" /></div>}
          {error && <div className="text-red-500 group-hover:block" title={error}><X className="w-5 h-5" /></div>}
          
          {currentAdminRole === 'super_admin' && (
            <button 
              onClick={handleDelete}
              disabled={loading}
              className="p-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}
