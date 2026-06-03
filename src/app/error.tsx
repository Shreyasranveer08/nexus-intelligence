'use client'

import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white dark:bg-[#111111] border border-rose-200 dark:border-rose-500/20 p-8 rounded-2xl shadow-sm dark:shadow-2xl flex flex-col items-center max-w-md text-center transition-colors">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Intelligence Engine Error</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
          {error.message || "We encountered a temporary issue while retrieving market data."}
        </p>
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      </div>
    </div>
  )
}
