import { signup } from '../login/actions'
import { UserPlus, ShieldCheck, Mail, Lock, User as UserIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string; error: string }>
}) {
  const { message, error } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-sans">
      {/* Subtle Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl border border-primary/20 mb-4 shadow-sm">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Create Account</h1>
          <p className="text-muted font-medium mt-2">Join your organization's HRMS portal</p>
        </div>

        <div className="bg-card rounded-3xl border border-border p-8 shadow-xl overflow-hidden relative">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 ml-1" htmlFor="full_name">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-muted/5 border border-border rounded-xl text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-muted/5 border border-border rounded-xl text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="block w-full pl-10 pr-3 py-3 bg-muted/5 border border-border rounded-xl text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm text-center font-medium">
                {error}
              </div>
            )}
            
            {message && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 text-sm text-center font-medium">
                {message}
              </div>
            )}

            <div className="flex flex-col gap-4 py-2">
              <button
                formAction={signup}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-semibold shadow-md shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                <UserPlus className="w-5 h-5" />
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-border/50 pt-6">
            <p className="text-sm text-muted font-medium">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary font-bold hover:underline transition-all"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-muted text-sm font-medium">
          Registration is restricted to authorized organization emails.
        </p>
      </div>
    </div>
  )
}
