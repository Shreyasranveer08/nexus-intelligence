import { getCompetitors, archiveCompetitor } from '@/app/actions'
import Link from 'next/link'
import { Plus, Globe, Archive, ExternalLink } from 'lucide-react'

export default async function CompetitorsPage() {
  const competitors = await getCompetitors()

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Tracked Competitors</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage the companies and specific web properties you are monitoring.</p>
        </div>
        <Link 
          href="/competitors/new" 
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-500 transition-colors font-medium text-sm shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Add Competitor
        </Link>
      </div>

      <div className="grid gap-6">
        {competitors.length === 0 ? (
          <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-white/5 p-16 text-center shadow-sm dark:shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-6 border border-slate-200 dark:border-white/10">
              <Globe className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-3">No competitors yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
              Start tracking your competitive landscape by adding your first competitor to the monitoring engine.
            </p>
            <Link 
              href="/competitors/new" 
              className="inline-flex items-center gap-2 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white px-5 py-2.5 rounded-md hover:bg-slate-200 dark:hover:bg-white/20 transition-colors text-sm font-medium"
            >
              Add Your First Competitor
            </Link>
          </div>
        ) : (
          competitors.map((comp: any) => (
            <div key={comp.id} className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-slate-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-lg">
              <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xl text-slate-800 dark:text-white">
                    {comp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{comp.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">Added {new Date(comp.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <form action={async () => {
                  'use server'
                  await archiveCompetitor(comp.id)
                }}>
                  <button type="submit" title="Archive Competitor" className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-md transition-colors group flex items-center gap-2 text-sm font-medium">
                    <Archive className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </form>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Tracked URLs ({comp.tracked_urls?.length || 0})</h4>
                {comp.tracked_urls?.length > 0 ? (
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                    {comp.tracked_urls.map((url: any) => (
                      <div key={url.id} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors group">
                        <div className="flex flex-col overflow-hidden w-full">
                          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">
                            {url.url_type}
                          </span>
                          <a href={url.url} target="_blank" rel="noreferrer" className="text-sm text-slate-300 hover:text-white truncate flex items-center justify-between">
                            <span className="truncate pr-4">{url.url}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 flex-shrink-0" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic bg-white/5 p-4 rounded-lg text-center border border-dashed border-white/10">No URLs currently tracked</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
