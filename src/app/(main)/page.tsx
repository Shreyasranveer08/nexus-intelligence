import { getCommandCenterData, getCompetitors } from '@/app/actions'
import { Shield } from 'lucide-react'
import Link from 'next/link'
import CommandCenterHighlights from '@/components/CommandCenterHighlights'
import IntelligenceFeed from '@/components/IntelligenceFeed'
import CompetitorRadar from '@/components/CompetitorRadar'
import ActionCenter from '@/components/ActionCenter'
import WeeklyIntelligence from '@/components/WeeklyIntelligence'

export default async function Dashboard() {
  const competitors = await getCompetitors()

  if (competitors.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Command Center</h2>
          <p className="text-slate-600 dark:text-slate-400">Real-time strategic intelligence and execution directives.</p>
        </div>
        
        <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-slate-300 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-white/5 text-center">
          <div className="p-4 bg-blue-100 dark:bg-blue-500/20 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Intelligence Data Yet</h3>
          <p className="text-slate-500 max-w-md mb-6">You are not tracking any competitors. Add your first competitor to start generating automated threat analysis and strategic insights.</p>
          <Link href="/onboarding" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
            Add Competitors
          </Link>
        </div>
      </div>
    )
  }

  const commandData = await getCommandCenterData();

  return (
    <div className="max-w-[1400px] mx-auto pb-24 px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Command Center</h2>
        <p className="text-slate-600 dark:text-slate-400">Real-time strategic intelligence and execution directives.</p>
      </div>

      {/* 1. Executive Briefing */}
      <CommandCenterHighlights data={commandData} />
      
      {/* 70/30 Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Side (70%) - Live Intelligence Feed */}
        <div className="lg:col-span-8">
          <IntelligenceFeed data={commandData} />
        </div>

        {/* Right Side (30%) - Radar & Action Center */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <CompetitorRadar data={commandData} />
          <ActionCenter data={commandData} />
        </div>
      </div>

      {/* 5. Weekly Intelligence */}
      <WeeklyIntelligence data={commandData} />

    </div>
  )
}
