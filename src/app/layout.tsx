import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Intelligence SaaS',
  description: 'Competitive intelligence for SaaS founders',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-300 min-h-screen flex selection:bg-blue-500/30`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="top-right" toastOptions={{ className: 'dark:bg-[#1a1a1a] dark:text-white dark:border-white/10 bg-white text-slate-900 border-slate-200 shadow-xl' }} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
