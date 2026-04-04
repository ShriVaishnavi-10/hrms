import { getProfile } from '@/utils/supabase/profiles'
import { createClient } from '@/utils/supabase/server'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import GoalList from '@/components/Performance/GoalList'
import AppraisalForm from '@/components/Performance/AppraisalForm'
import ReviewList from '@/components/Performance/ReviewList'
import FeedbackSummary from '@/components/Performance/FeedbackSummary'
import FeedbackRequest from '@/components/Performance/FeedbackRequest'
import { getMyAppraisals, getAppraisalFeedback } from '@/app/performance/appraisals/actions'
import { TrendingUp, Target, BarChart3, Star, History, MessageSquareShare } from 'lucide-react'

export default async function PerformancePage() {
  const profile = await getProfile()
  const role = profile?.role || 'employee'
  const isAdmin = role === 'super_admin' || role === 'hr_manager'
  const isManager = role === 'dept_manager'

  // Fetch performance data
  const appraisals = await getMyAppraisals()
  const activeAppraisal = appraisals.find(a => a.status !== 'completed')
  const completedAppraisals = appraisals.filter(a => a.status === 'completed')

  // Fetch feedback for current appraisal
  const currentFeedback = activeAppraisal ? await getAppraisalFeedback(activeAppraisal.id) : []
  const feedbackRequests = currentFeedback.filter(f => f.status === 'pending' && f.from_user_id === profile?.id)

  return (
    <DashboardLayout activePage="performance">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl text-primary font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Performance Center</h2>
        </div>
        <p className="text-muted font-bold text-xs uppercase tracking-widest ml-1">
           Track goals, submit appraisals, and measure growth.
        </p>
      </header>

      <div className="space-y-16">
        {/* Manager Review List (If Manager) */}
        {(isAdmin || isManager) && (
           <section className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3">
                 <BarChart3 className="w-5 h-5 text-primary" />
                 <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Pending Manager Reviews</h3>
              </div>
              <ReviewList />
           </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
           <div className="lg:col-span-2 space-y-16">
              {/* Active Appraisal Section */}
              <section className="space-y-8">
                 <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-primary" />
                    <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Current Appraisal Process</h3>
                 </div>
                 {activeAppraisal ? (
                    <AppraisalForm appraisal={activeAppraisal} isManager={false} />
                 ) : (
                    <div className="bg-card border-2 border-dashed border-border p-12 rounded-3xl text-center group transition-all hover:border-primary/20">
                       <History className="w-12 h-12 text-muted/20 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                       <p className="text-xs font-black text-muted uppercase tracking-widest leading-relaxed">
                          No active appraisal cycles found for you.<br/>
                          <span className="opacity-60 text-[10px]">Contact HR for cycle registration.</span>
                       </p>
                    </div>
                 )}
              </section>

              {/* Goal Management Section */}
              <section className="space-y-8">
                 <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Objectives & Results</h3>
                 </div>
                 <GoalList isAdmin={isAdmin} />
              </section>
           </div>

           {/* Sidebar: Feedback & Summary */}
           <div className="space-y-12">
              <section className="space-y-6">
                 <div className="flex items-center gap-3">
                    <MessageSquareShare className="w-5 h-5 text-primary" />
                    <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Peer Feedback Summary</h3>
                 </div>
                 <FeedbackSummary feedback={currentFeedback} />
              </section>

              {feedbackRequests.length > 0 && (
                <section className="space-y-6 animate-in slide-in-from-right-10 duration-700">
                   <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-amber-500" />
                      <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Review Your Peers</h3>
                   </div>
                   {feedbackRequests.map((req) => (
                      <FeedbackRequest key={req.id} request={req} />
                   ))}
                </section>
              )}
           </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
