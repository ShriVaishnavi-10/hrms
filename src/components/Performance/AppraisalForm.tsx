'use client'

import { useState } from 'react'
import { submitSelfAssessment, submitManagerReview } from '@/app/performance/appraisals/actions'
import { Star, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

type AppraisalProps = {
  appraisal: {
    id: string
    period: string
    self_rating: number | null
    self_feedback: string | null
    manager_rating: number | null
    manager_feedback: string | null
    status: string
  }
  isManager: boolean
}

export default function AppraisalForm({ appraisal, isManager }: AppraisalProps) {
  const [rating, setRating] = useState(isManager ? (appraisal.manager_rating || 0) : (appraisal.self_rating || 0))
  const [feedback, setFeedback] = useState(isManager ? (appraisal.manager_feedback || '') : (appraisal.self_feedback || ''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmitSelf = !isManager && appraisal.status === 'initiated'
  const canSubmitManager = isManager && appraisal.status === 'self_done'
  const isReadOnly = (isManager && appraisal.status !== 'self_done') || (!isManager && appraisal.status !== 'initiated')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return setError('Please select a rating')
    
    setLoading(true)
    setError(null)

    const res = isManager 
      ? await submitManagerReview(appraisal.id, rating, feedback)
      : await submitSelfAssessment(appraisal.id, rating, feedback)

    if (res.error) {
      setError(res.error)
    } else {
      window.location.reload()
    }
    setLoading(false)
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-8">
      <div className="flex items-center justify-between border-b border-border/50 pb-6">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-foreground tracking-tight uppercase">{appraisal.period} Appraisal</h3>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
             {isManager ? 'Manager Review Phase' : 'Self-Assessment Phase'}
          </p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
          appraisal.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'
        }`}>
          {(appraisal.status || '').replace('_', ' ')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Self Assessment Section */}
        <section className={`space-y-6 ${isManager ? 'opacity-60' : ''}`}>
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Employee Input</span>
           </div>
           
           <div className="space-y-4">
              <label className="block text-xs font-black text-foreground uppercase">Self Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s}
                    disabled={isReadOnly || isManager}
                    onClick={() => setRating(s)}
                    className={`p-3 rounded-xl transition-all ${
                      (isManager ? (appraisal.self_rating || 0) : rating) >= s ? 'bg-primary text-white scale-110' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${ (isManager ? (appraisal.self_rating || 0) : rating) >= s ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-4">
              <label className="block text-xs font-black text-foreground uppercase">Self Feedback</label>
              <textarea 
                placeholder="Reflect on your achievements and areas for growth..."
                value={isManager ? (appraisal.self_feedback || '') : feedback}
                onChange={(e) => !isManager && setFeedback(e.target.value)}
                readOnly={isReadOnly || isManager}
                className="w-full bg-muted/50 border border-border rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[150px] resize-none"
              />
           </div>
        </section>

        {/* Manager Review Section */}
        <section className={`space-y-6 ${!isManager && appraisal.status !== 'completed' ? 'opacity-20 pointer-events-none' : ''}`}>
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Manager Input</span>
           </div>

           <div className="space-y-4">
              <label className="block text-xs font-black text-foreground uppercase">Manager Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s}
                    disabled={isReadOnly || !isManager}
                    onClick={() => setRating(s)}
                    className={`p-3 rounded-xl transition-all ${
                      (isManager ? rating : (appraisal.manager_rating || 0)) >= s ? 'bg-amber-500 text-white scale-110' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${ (isManager ? rating : (appraisal.manager_rating || 0)) >= s ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-4">
              <label className="block text-xs font-black text-foreground uppercase">Manager Feedback</label>
              <textarea 
                placeholder="Provide constructive feedback and growth opportunities..."
                value={isManager ? feedback : (appraisal.manager_feedback || '')}
                onChange={(e) => isManager && setFeedback(e.target.value)}
                readOnly={isReadOnly || !isManager}
                className="w-full bg-muted/50 border border-border rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[150px] resize-none"
              />
           </div>
        </section>
      </div>

      {(canSubmitSelf || canSubmitManager) && (
        <div className="pt-8 border-t border-border/50 flex flex-col items-center gap-4">
          {error && <p className="text-red-500 text-xs font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</p>}
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-fit flex items-center gap-3 px-12 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit {isManager ? 'Final Review' : 'Self-Assessment'}
          </button>
          <p className="text-[10px] font-bold text-muted uppercase italic">
            Once submitted, this assessment phase cannot be reopened.
          </p>
        </div>
      )}
    </div>
  )
}
