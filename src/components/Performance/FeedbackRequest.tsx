'use client'

import { useState } from 'react'
import { submitPeerFeedback } from '@/app/performance/appraisals/actions'
import { Star, MessageSquareShare, Send, CheckCircle2, UserCircle, Loader2 } from 'lucide-react'

type FeedbackProps = {
  request: {
    id: string
    feedback: string | null
    rating: number | null
    status: string
    profiles: {
      full_name: string
    }
  }
}

export default function FeedbackRequest({ request }: FeedbackProps) {
  const [rating, setRating] = useState(request.rating || 0)
  const [feedback, setFeedback] = useState(request.feedback || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const canSubmit = request.status === 'pending'

  const handleSubmit = async () => {
    if (rating === 0 || !feedback) return
    setLoading(true)
    const res = await submitPeerFeedback(request.id, rating, feedback)
    if (res.success) {
      setSuccess(true)
      window.location.reload()
    }
    setLoading(false)
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
           <UserCircle className="w-5 h-5" />
        </div>
        <div>
           <h4 className="text-sm font-black text-foreground uppercase tracking-tight leading-none">Review Request</h4>
           <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">From: {request.profiles.full_name}</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-[10px] font-black text-muted uppercase tracking-widest ml-1">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button 
              key={s}
              disabled={!canSubmit}
              onClick={() => setRating(s)}
              className={`p-2.5 rounded-xl transition-all ${
                rating >= s ? 'bg-primary text-white scale-110' : 'bg-muted text-muted-foreground'
              }`}
            >
              <Star className={`w-4 h-4 ${rating >= s ? 'fill-current' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-[10px] font-black text-muted uppercase tracking-widest ml-1">Peer Feedback</label>
        <textarea 
          placeholder="Share constructive feedback about your peer's performance..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          readOnly={!canSubmit}
          className="w-full bg-muted/50 border border-border rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[100px] resize-none"
        />
      </div>

      {canSubmit && (
        <button 
          onClick={handleSubmit}
          disabled={loading || rating === 0 || !feedback}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Submit Feedback
        </button>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 text-[10px] font-bold">
           <CheckCircle2 className="w-4 h-4" />
           Feedback submitted successfully!
        </div>
      )}
    </div>
  )
}
