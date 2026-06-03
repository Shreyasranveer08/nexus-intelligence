import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 p-8 rounded-2xl shadow-sm dark:shadow-2xl flex flex-col items-center transition-colors">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analyzing Intelligence</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs text-center">
          Loading market signals and latest competitor strategies...
        </p>
      </div>
    </div>
  )
}
