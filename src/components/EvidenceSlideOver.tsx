'use client'

import React from 'react'
import { X, ExternalLink, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, BrainCircuit, Activity } from 'lucide-react'

export default function EvidenceSlideOver({ 
  isOpen, 
  onClose, 
  evidenceSignals = [], 
  aiReasoning 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  evidenceSignals: any[];
  aiReasoning?: string;
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-[#0f0f0f] border-l border-slate-200 dark:border-white/10 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#111111]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Evidence Explorer</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {aiReasoning && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BrainCircuit className="w-16 h-16 text-blue-500" />
              </div>
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-300">AI Reasoning</h3>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed relative z-10">
                {aiReasoning}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" /> 
              Supporting Signals
            </h3>
            
            <div className="space-y-4">
              {evidenceSignals.map((signal, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 rounded-xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-white/10 transition-colors group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-semibold text-slate-900 dark:text-white">{signal.competitor}</span>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded border ${
                      signal.confidence === 'High' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 
                      signal.confidence === 'Medium' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' :
                      'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
                    }`}>
                      {signal.confidence} Confidence
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {signal.content}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                    <span className="text-xs text-slate-500">
                      {new Date(signal.date).toLocaleDateString()}
                    </span>
                    {signal.url && (
                      <a 
                        href={signal.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                      >
                        Source URL <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {evidenceSignals.length === 0 && (
                <p className="text-sm text-slate-500 italic p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-dashed border-slate-200 dark:border-white/10 text-center">
                  No direct signals available.
                </p>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </>
  )
}
