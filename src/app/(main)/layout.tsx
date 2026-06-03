import Link from 'next/link'
import { Activity, Users, Settings, Hexagon, BarChart3, Bell } from 'lucide-react'
import ProfileMenu from '@/components/ProfileMenu'
import NotificationBell from '@/components/NotificationBell'
import { getUserProfile } from '@/app/actions'
import { redirect } from 'next/navigation'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userProfile = await getUserProfile()

  if (!userProfile?.is_authenticated) {
    redirect('/welcome')
  }

  if (userProfile?.onboarding_status !== 'completed') {
    redirect('/onboarding')
  }

  return (
    <div className="w-full flex min-h-screen">
      {/* Sidebar */}
          <aside className="w-64 bg-white dark:bg-[#0a0a0a] border-r border-slate-200 dark:border-white/10 flex flex-col fixed h-full z-10 transition-colors">
            <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-white/10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mr-3 shadow-sm dark:shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                <Hexagon className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">NexusIntel</span>
            </div>
            
            <div className="px-4 py-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Overview</p>
              <nav className="space-y-1">
                <Link href="/" className="flex items-center px-2 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors group">
                  <Activity className="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                  Intelligence Feed
                </Link>
                <Link href="/competitors" className="flex items-center px-2 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors group">
                  <Users className="w-5 h-5 mr-3 text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
                  Competitors
                </Link>
                <Link href="/reports" className="flex items-center px-2 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors group">
                  <BarChart3 className="w-5 h-5 mr-3 text-slate-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" />
                  Weekly Reports
                </Link>
              </nav>
            </div>
            
            <div className="mt-auto p-4">
              <Link href="/settings" className="flex items-center px-2 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col ml-64 min-h-screen bg-slate-50 dark:bg-[#0a0a0a] transition-colors">
            <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-transparent flex items-center justify-between px-8 backdrop-blur-md sticky top-0 z-10 transition-colors">
              <h1 className="text-sm font-medium text-slate-500 dark:text-slate-400">Dashboard</h1>
              <div className="flex items-center gap-4">
                <NotificationBell />
                <ProfileMenu userProfile={userProfile} />
              </div>
            </header>
            <div className="p-8 flex-1 w-full max-w-7xl mx-auto">
              {children}
            </div>
          </main>
    </div>
  )
}
