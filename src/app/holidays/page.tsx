import { getProfile } from '@/utils/supabase/profiles'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import HolidayList from '@/components/Holidays/HolidayList'
import HolidayOverview from '@/components/Holidays/HolidayOverview'
import { Sun, Calendar, Plus } from 'lucide-react'
import { addHoliday } from './actions'
import { revalidatePath } from 'next/cache'

export default async function HolidaysPage() {
  const profile = await getProfile()
  const role = profile?.role || 'employee'
  const isAdmin = role === 'super_admin' || role === 'hr_manager'

  async function handleAddHoliday(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const date = formData.get('date') as string
    const type = formData.get('type') as string
    const description = formData.get('description') as string

    await addHoliday({ name, date, type, description })
    revalidatePath('/holidays')
  }

  return (
    <DashboardLayout activePage="holidays">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl text-primary font-bold">
            <Sun className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Holiday Calendar</h2>
        </div>
        <p className="text-muted font-bold text-xs uppercase tracking-widest ml-1">
           View upcoming company holidays and festival dates.
        </p>
      </header>

      <div className="space-y-12">
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Quick Overview</h3>
           </div>
           <HolidayOverview />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                 <Calendar className="w-5 h-5 text-primary" />
                 <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Full List</h3>
              </div>
              <HolidayList isAdmin={isAdmin} />
           </div>

           {isAdmin && (
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <Plus className="w-5 h-5 text-primary" />
                   <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Add New Holiday</h3>
                </div>
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                   <form action={handleAddHoliday} className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-muted uppercase ml-1">Holiday Name</label>
                         <input name="name" required className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground" placeholder="e.g. Christmas" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-muted uppercase ml-1">Date</label>
                         <input name="date" type="date" required className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-muted uppercase ml-1">Type</label>
                         <select name="type" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground appearance-none">
                            <option value="company">Company Holiday</option>
                            <option value="festival">Festival</option>
                            <option value="regional">Regional</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-muted uppercase ml-1">Description (Optional)</label>
                         <textarea name="description" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground min-h-[100px]" placeholder="Brief details..." />
                      </div>
                      <button type="submit" className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all">
                         Add Holiday
                      </button>
                   </form>
                </div>
             </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  )
}
