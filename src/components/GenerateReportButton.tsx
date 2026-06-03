'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function GenerateReportButton({ competitors = [] }: { competitors?: any[] }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' })
  const router = useRouter()

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true)
    
    const totalSteps = 1 + competitors.length
    setProgress({ current: 0, total: totalSteps, status: 'Starting generation...' })
    
    let successCount = 0

    try {
      // Step 1: Generate Market Report
      setProgress({ current: 1, total: totalSteps, status: 'Generating Market Intelligence Report...' })
      const marketRes = await fetch('/api/reports/generate', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'market' })
      })
      if (marketRes.ok) successCount++

      // Step 2: Generate Competitor Reports
      for (let i = 0; i < competitors.length; i++) {
        const comp = competitors[i]
        setProgress({ current: i + 2, total: totalSteps, status: `Analyzing ${comp.name}...` })
        
        const compRes = await fetch('/api/reports/generate', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'competitor', competitor_id: comp.id })
        })
        if (compRes.ok) successCount++
      }
      
      toast.success(`Generated ${successCount} report(s) successfully!`)
      router.refresh()
    } catch (err) {
      toast.error('Network error during generation.')
    } finally {
      setIsGenerating(false)
      setProgress({ current: 0, total: 0, status: '' })
    }
  }

  return (
    <div className="flex flex-col items-end gap-2 relative">
      <button 
        onClick={handleGenerate}
        disabled={isGenerating}
        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {isGenerating ? 'Generating...' : 'Generate Weekly Intelligence'}
      </button>

      {isGenerating && (
        <div className="absolute top-14 right-0 w-64 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 p-3 rounded-lg shadow-xl z-10 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{progress.status}</span>
            <span>{progress.current} / {progress.total}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
