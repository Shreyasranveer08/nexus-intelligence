'use client'

import { useState, useRef, useEffect } from 'react'
import { LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'

export default function ProfileMenu({ userProfile }: { userProfile?: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 border border-slate-300 dark:border-white/10 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow flex items-center justify-center shadow-sm dark:shadow-none"
      >
        <User className="w-5 h-5 text-slate-500 dark:text-slate-300" />
        <span className="sr-only">Open user menu</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden z-50 transition-colors">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{userProfile?.name || 'User'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userProfile?.email || 'Set up profile in Settings'}</p>
          </div>
          <div className="p-1">
            <Link 
              href="/settings" 
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
            >
              <User className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-300" />
              Profile
            </Link>
            <Link 
              href="/settings" 
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-300" />
              Settings
            </Link>
          </div>
          <div className="p-1 border-t border-slate-100 dark:border-white/5">
            <button 
              onClick={async () => {
                setIsOpen(false)
                const { signOutUser } = await import('@/app/actions')
                await signOutUser()
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
