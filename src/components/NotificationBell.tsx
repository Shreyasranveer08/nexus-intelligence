'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Zap, TrendingUp, AlertTriangle } from 'lucide-react'

// Dummy notifications for initial state
const dummyNotifications = [
  { id: 1, type: 'alert', title: 'High Threat Alert', message: 'A tracked competitor launched a new AI feature.', time: '2 hours ago', read: false },
  { id: 2, type: 'report', title: 'Weekly Report Generated', message: 'Your market intelligence report is ready.', time: '1 day ago', read: false },
  { id: 3, type: 'info', title: 'Competitor Added', message: 'A new competitor is now being tracked.', time: '2 days ago', read: true },
]

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(dummyNotifications)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4 text-rose-500" />
      case 'report': return <TrendingUp className="w-4 h-4 text-blue-500" />
      case 'info': return <Zap className="w-4 h-4 text-amber-500" />
      default: return <Bell className="w-4 h-4 text-slate-500" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse ring-2 ring-white dark:ring-[#0a0a0a]"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-xl shadow-lg dark:shadow-2xl z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
          <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-white/5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                No notifications right now.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {notifications.map(notification => (
                  <div key={notification.id} className={`p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3 ${!notification.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                    <div className="mt-0.5 shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium uppercase tracking-wider">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-1.5 ml-auto"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-center">
            <button className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
