'use client'

import { useState, useEffect } from 'react'
import { getGoals } from '@/app/performance/goals/actions'
import GoalCard from './GoalCard'
import { Loader2, Plus, Target, CheckCircle2 } from 'lucide-react'

export default function GoalList({ isAdmin }: { isAdmin: boolean }) {
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCompleted, setShowCompleted] = useState(false)

  useEffect(() => {
    async function fetchGoals() {
      const data = await getGoals()
      setGoals(data as any[])
      setLoading(false)
    }
    fetchGoals()
  }, [])

  const activeGoals = goals.filter(g => (g.current_value / g.target_value) < 1)
  const completedGoals = goals.filter(g => (g.current_value / g.target_value) >= 1)

  const displayedGoals = showCompleted ? completedGoals : activeGoals

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4 text-muted">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest">Fetching performance data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border/50 pb-6">
        <div className="flex items-center gap-6">
          <button 
             onClick={() => setShowCompleted(false)}
             className={`flex items-center gap-2 pb-2 transition-all border-b-2 ${!showCompleted ? 'border-primary text-foreground' : 'border-transparent text-muted hover:text-foreground'}`}
          >
             <Target className="w-4 h-4" />
             <span className="text-xs font-black uppercase tracking-widest">Active Goals ({activeGoals.length})</span>
          </button>
          <button 
             onClick={() => setShowCompleted(true)}
             className={`flex items-center gap-2 pb-2 transition-all border-b-2 ${showCompleted ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-muted hover:text-foreground'}`}
          >
             <CheckCircle2 className="w-4 h-4" />
             <span className="text-xs font-black uppercase tracking-widest">Completed ({completedGoals.length})</span>
          </button>
        </div>

        {isAdmin && (
           <button 
             onClick={() => {}} // Placeholder for modal trigger
             className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5"
           >
             <Plus className="w-4 h-4" />
             Create Goal
           </button>
        )}
      </div>

      {displayedGoals.length === 0 ? (
         <div className="p-20 text-center border-2 border-dashed border-border/50 rounded-3xl group hover:border-primary/20 transition-all">
            <Target className="w-12 h-12 text-muted/20 mx-auto mb-4 group-hover:scale-110 group-hover:text-primary/20 transition-all" />
            <p className="text-xs font-black text-muted uppercase tracking-widest">No goals assigned for this period</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  )
}
