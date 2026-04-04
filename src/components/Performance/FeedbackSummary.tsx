'use client'

import { Star, MessageSquareQuote, TrendingUp, BarChart3, Loader2 } from 'lucide-react'

type FeedbackSummaryProps = {
  feedback: any[]
}

export default function FeedbackSummary({ feedback }: FeedbackSummaryProps) {
  const avgRating = feedback.reduce((acc, curr) => acc + (curr.rating || 0), 0) / (feedback.length || 1)
  const submittedFeedback = feedback.filter(f => f.status === 'submitted')

  if (feedback.length === 0) return (
     <div className="bg-card border border-border rounded-3xl p-12 text-center group transition-all">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
           <BarChart3 className="w-8 h-8 text-muted" />
        </div>
        <h4 className="text-sm font-black text-foreground uppercase tracking-widest mb-2">No Peer Feedback</h4>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.1em]">360-degree feedback requests will appear here.</p>
     </div>
  )

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-10">
      <div className="flex items-center justify-between border-b border-border/50 pb-6">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-foreground tracking-tight uppercase">360-Degree Feedback</h3>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Aggregate Peer Insights</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-muted uppercase tracking-widest">Avg. Peer Rating</p>
              <div className="flex items-center gap-1.5 justify-end">
                 <span className="text-2xl font-black text-foreground tabular-nums">{avgRating.toFixed(1)}</span>
                 <Star className="w-4 h-4 text-amber-500 fill-current" />
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-2">
           <TrendingUp className="w-4 h-4 text-primary" />
           <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Peer Comments</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submittedFeedback.length === 0 ? (
             <div className="col-span-full py-10 text-center text-[10px] font-bold text-muted uppercase tracking-widest italic opacity-50">
                Waiting for peer submissions...
             </div>
          ) : (
            submittedFeedback.map((f) => (
              <div key={f.id} className="relative p-6 bg-muted/5 border border-border rounded-2xl group hover:border-primary/20 transition-all">
                <MessageSquareQuote className="w-8 h-8 text-primary/5 absolute top-4 right-4 group-hover:scale-110 transition-transform" />
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3 h-3 ${ (f.rating || 0) >= s ? 'text-amber-500 fill-current' : 'text-muted-foreground/20'}`} />
                  ))}
                </div>
                <p className="text-xs font-medium text-foreground leading-relaxed italic">
                  "{f.feedback}"
                </p>
                <div className="mt-4 flex justify-end">
                   <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
                      — {f.profiles?.full_name?.split(' ')[0] || 'Anonymous'}
                   </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
