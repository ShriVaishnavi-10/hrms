'use client'

import { useState, useEffect } from 'react'
import { getPendingAppraisals } from '@/app/performance/appraisals/actions'
import { FileSearch, ArrowRight, UserCircle, MapPin, Briefcase } from 'lucide-react'

export default function ReviewList() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      const data = await getPendingAppraisals()
      setReviews(data as any[])
      setLoading(false)
    }
    fetchReviews()
  }, [])

  if (loading) return <div className="p-10 animate-pulse bg-muted/20 rounded-3xl h-60" />

  if (reviews.length === 0) return (
     <div className="bg-card border border-border rounded-3xl p-12 text-center group transition-all">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
           <FileSearch className="w-8 h-8 text-muted" />
        </div>
        <h4 className="text-sm font-black text-foreground uppercase tracking-widest mb-2">No Reviews Pending</h4>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.1em]">All employee assessments are up to date.</p>
     </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((rev) => (
        <div key={rev.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:border-primary/50 transition-all group">
           <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                 <UserCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-sm font-black text-foreground uppercase tracking-tight leading-none">{rev.profiles.full_name}</h4>
                 <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{rev.profiles.designation}</p>
              </div>
           </div>

           <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
                 <Briefcase className="w-3 h-3" />
                 {rev.profiles.department}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
                 <MapPin className="w-3 h-3" />
                 Period: {rev.period}
              </div>
           </div>

           <button 
              onClick={() => {}} // Integration logic to open the specific appraisal
              className="w-full flex items-center justify-center gap-2 py-3 bg-muted hover:bg-primary hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
           >
              Review Now
              <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      ))}
    </div>
  )
}
