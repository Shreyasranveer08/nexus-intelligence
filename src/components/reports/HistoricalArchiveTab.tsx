'use client'

import React from 'react'
import { Archive, RotateCcw, Clock, Building2, FolderArchive, ArrowRight } from 'lucide-react'
import { restoreCompetitor } from '@/app/actions'
import toast from 'react-hot-toast'

export default function HistoricalArchiveTab({ 
  reports, 
  archivedCompetitors 
}: { 
  reports: any[], 
  archivedCompetitors: any[] 
}) {
  
  const handleRestore = async (id: string, name: string) => {
    try {
      await restoreCompetitor(id);
      toast.success(`${name} has been restored to active monitoring.`);
    } catch (e) {
      toast.error('Failed to restore competitor.');
    }
  }

  return (
    <div className="space-y-12">
      
      {/* Archived Competitors Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Archive className="w-5 h-5 text-slate-500" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Archived Competitors</h3>
        </div>
        
        {archivedCompetitors.length === 0 ? (
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">No competitors have been archived.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {archivedCompetitors.map(comp => (
              <div key={comp.id} className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <h4 className="font-semibold text-slate-900 dark:text-white">{comp.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Archived: {comp.archived_at ? new Date(comp.archived_at).toLocaleDateString() : 'Unknown Date'}
                  </p>
                </div>
                <button 
                  onClick={() => handleRestore(comp.id, comp.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Historical Reports Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <FolderArchive className="w-5 h-5 text-slate-500" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Historical Reports</h3>
        </div>
        
        {reports.length === 0 ? (
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">No historical reports available.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div key={report.id} className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {report.title || 'Weekly Intelligence Report'}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Generated: {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
                
                {report.competitor_snapshot && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Competitors in this report</p>
                    <div className="flex flex-wrap gap-2">
                      {report.competitor_snapshot.map((c: any) => (
                        <span key={c.id} className="text-xs px-2 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-white/10">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
