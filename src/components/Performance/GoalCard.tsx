'use client'

import { useState } from 'react'
import { updateGoalProgress, deleteGoal } from '@/app/performance/goals/actions'
import { Target, Trash2, CheckCircle2, TrendingUp, AlertCircle, Edit3 } from 'lucide-react'

type GoalProps = {
  goal: {
    id: string
    title: string
    description?: string
    type: string
    target_value: number
    current_value: number
    status: string
    end_date: string
  }
  isAdmin: boolean
}

export default function GoalCard({ goal, isAdmin }: GoalProps) {
  const [currentValue, setCurrentValue] = useState(goal.current_value)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)

  const progress = Math.min(100, (currentValue / goal.target_value) * 100)

  const handleUpdate = async () => {
    setLoading(true)
    const res = await updateGoalProgress(goal.id, currentValue)
    if (res.success) {
      setUpdating(false)
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this goal?')) return
    await deleteGoal(goal.id)
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm group hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <div className={`p-1.5 rounded-lg ${goal.type === 'okr' ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-500'}`}>
                {goal.type === 'okr' ? <Target className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{goal.type}</span>
          </div>
          <h4 className="text-xl font-black text-foreground tracking-tight uppercase leading-tight">{goal.title}</h4>
          {goal.description && <p className="text-[10px] font-medium text-muted-foreground italic leading-relaxed">{goal.description}</p>}
        </div>

        {isAdmin && (
           <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
             <Trash2 className="w-4 h-4" />
           </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-end">
           <div className="space-y-1">
              <p className="text-[10px] font-black text-muted uppercase tracking-widest">Progress</p>
              <p className="text-2xl font-black text-foreground tabular-nums">
                 {progress.toFixed(0)}<span className="text-sm font-bold text-muted ml-0.5">%</span>
              </p>
           </div>
           
           {updating ? (
              <div className="flex items-center gap-2 mb-1 animate-in slide-in-from-right-4">
                 <input 
                    type="number" 
                    value={currentValue}
                    onChange={(e) => setCurrentValue(Number(e.target.value))}
                    className="w-20 bg-muted border border-border rounded-lg px-2 py-1 text-xs font-bold focus:ring-1 focus:ring-primary outline-none"
                    min="0"
                    max={goal.target_value}
                 />
                 <button 
                    onClick={handleUpdate}
                    disabled={loading}
                    className="p-1 px-2 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50"
                 >
                    {loading ? '...' : 'Save'}
                 </button>
              </div>
           ) : (
              <button 
                onClick={() => setUpdating(true)}
                className="flex items-center gap-1.5 mb-1 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
              >
                <Edit3 className="w-3 h-3" />
                Update
              </button>
           )}
        </div>

        <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${progress >= 100 ? 'bg-emerald-500' : 'bg-primary'}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold text-muted uppercase border-t border-border/50 pt-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            Deadline: {new Date(goal.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
          </div>
          <div className="flex items-center gap-2">
             <span className={`px-2 py-0.5 rounded ${progress >= 100 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                {progress >= 100 ? 'Completed' : 'Active'}
             </span>
             {progress >= 100 && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
          </div>
        </div>
      </div>
    </div>
  )
}
