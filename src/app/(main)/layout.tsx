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
                <Link href="/copilot" className="flex items-center px-2 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors group">
                  <div className="w-5 h-5 mr-3 flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                      <path d="M5 3v4"/>
                      <path d="M19 17v4"/>
                      <path d="M3 5h4"/>
                      <path d="M17 19h4"/>
                    </svg>
                  </div>
                  Copilot
                </Link>
              </nav>
            </div>
            
            <div className="mt-auto p-4 flex flex-col gap-2">
              <Link href="/settings" className="flex items-center px-2 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
              
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 px-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3">Connect with Creator</p>
                <div className="flex items-center gap-4">
                  <a href="https://x.com/umbracore_r" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="X (Twitter)">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://github.com/Shreyasranveer08" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="GitHub">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/shreyas-ranveer-949b9b29a/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="LinkedIn">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                </div>
              </div>
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
