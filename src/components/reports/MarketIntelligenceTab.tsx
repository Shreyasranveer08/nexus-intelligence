'use client'

import { FileText, Calendar, TrendingUp, Zap, AlertTriangle, Target, Shield, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function MarketIntelligenceTab({ reports }: { reports: any[] }) {
  if (reports.length === 0) {
    return (
      <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-2xl p-16 text-center shadow-sm dark:shadow-2xl transition-colors">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-3">No market reports yet</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Generate your first market intelligence report to uncover trends and cross-competitor strategies.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {reports.map((report: any) => (
        <div key={report.id} className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl transition-colors">
          {/* Header */}
          <div className="p-8 border-b border-slate-200 dark:border-white/5 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{report.title}</h3>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
                  <span suppressHydrationWarning>
                    {new Date(report.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Level 1: Executive Dashboard */}
          {report.executive_summary_data ? (
            <div className="p-8 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-blue-900/5 transition-colors">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center"><Zap className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" /> Executive Dashboard</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg transition-colors">
                  <p className="text-xs text-rose-500 dark:text-rose-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">🔥 Biggest Threat</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{report.executive_summary_data.biggest_threat || report.executive_summary_data.biggest_risk}</p>
                </div>
                <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg transition-colors">
                  <p className="text-xs text-emerald-500 dark:text-emerald-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">💡 Biggest Opportunity</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{report.executive_summary_data.biggest_opportunity}</p>
                </div>
                <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg transition-colors">
                  <p className="text-xs text-amber-500 dark:text-amber-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">🏆 Main Competitor</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{report.executive_summary_data.main_competitor || report.executive_summary_data.most_active_competitor}</p>
                </div>
                <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg transition-colors">
                  <p className="text-xs text-purple-500 dark:text-purple-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">📊 Overall Threat Level</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{report.executive_summary_data.overall_threat_level || 'N/A'}</p>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-500/10 p-5 rounded-xl border border-blue-200 dark:border-blue-500/20 shadow-sm dark:shadow-lg flex flex-col md:flex-row md:items-center gap-4 transition-colors">
                <p className="text-xs text-blue-600 dark:text-blue-300 font-semibold uppercase tracking-wider md:w-48 shrink-0 flex items-center gap-2">👉 Priority Action</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{report.executive_summary_data.priority_action || (report.executive_summary_data.recommended_actions?.[0] ?? 'N/A')}</p>
              </div>
            </div>
          ) : null}

          {/* Level 2: Detailed Analysis */}
          <div className="p-8 lg:flex gap-10">
            {/* Markdown Narrative */}
            <div className="lg:w-2/3">
              <div className="prose dark:prose-invert prose-blue max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-white">
                <ReactMarkdown>{report.markdown_body || report.summary}</ReactMarkdown>
              </div>

              {report.structured_data?.detailed_recommendations?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5">
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Explainable Recommendations</h4>
                  <div className="space-y-6">
                    {report.structured_data.detailed_recommendations.map((rec: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 transition-colors">
                        <div className="flex items-start justify-between mb-4 gap-4">
                          <h5 className="text-lg font-bold text-blue-600 dark:text-blue-400">{rec.action}</h5>
                          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${rec.priority === 'High' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300' : rec.priority === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'}`}>
                            {rec.priority} Priority
                          </span>
                        </div>
                        
                        <div className="space-y-4 text-sm">
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider text-xs">Why We Recommend This</p>
                            <p className="text-slate-700 dark:text-slate-200">{rec.why_we_recommend_this}</p>
                          </div>
                          
                          <div className="bg-white dark:bg-[#111111] p-4 rounded-lg border border-slate-200 dark:border-white/5 transition-colors">
                            <p className="text-slate-500 dark:text-slate-400 font-semibold mb-2 uppercase tracking-wider text-xs">Supporting Evidence</p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                              {rec.supporting_evidence?.map((ev: string, i: number) => (
                                <li key={i}>{ev}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider text-xs">Expected Impact</p>
                            <p className="text-emerald-600 dark:text-emerald-400 font-medium">{rec.expected_impact}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Structured Data Panel */}
            <div className="lg:w-1/3 mt-10 lg:mt-0 space-y-6 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/5 pt-8 lg:pt-0 lg:pl-10">
              
              {report.structured_data?.competitive_position && (
                <div className="mb-8">
                  <h4 className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold mb-4 text-lg">
                    <Shield className="w-5 h-5 text-purple-500 dark:text-purple-400" /> Competitive Position
                  </h4>
                  
                  <div className="space-y-4">
                    {report.structured_data.competitive_position.strengths?.length > 0 && (
                      <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/10 rounded-lg p-4">
                        <h5 className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><ArrowUpCircle className="w-3 h-3" /> Strengths</h5>
                        <ul className="list-disc pl-4 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          {report.structured_data.competitive_position.strengths.map((item: string, i: number) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    
                    {report.structured_data.competitive_position.weaknesses?.length > 0 && (
                      <div className="bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/10 rounded-lg p-4">
                        <h5 className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><ArrowDownCircle className="w-3 h-3" /> Weaknesses</h5>
                        <ul className="list-disc pl-4 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          {report.structured_data.competitive_position.weaknesses.map((item: string, i: number) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    
                    {report.structured_data.competitive_position.opportunities?.length > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/10 rounded-lg p-4">
                        <h5 className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Target className="w-3 h-3" /> Opportunities</h5>
                        <ul className="list-disc pl-4 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          {report.structured_data.competitive_position.opportunities.map((item: string, i: number) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    
                    {report.structured_data.competitive_position.threats?.length > 0 && (
                      <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-lg p-4">
                        <h5 className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Threats</h5>
                        <ul className="list-disc pl-4 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          {report.structured_data.competitive_position.threats.map((item: string, i: number) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {report.structured_data?.trends?.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold mb-4">
                    <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Emerging Trends
                  </h4>
                  <div className="space-y-3">
                    {report.structured_data.trends.map((trend: any, i: number) => (
                      <div key={i} className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 border border-slate-200 dark:border-white/5 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">{trend.trend_name}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">{trend.confidence_score}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Impact: {trend.impact_level}/10 • Affected: {trend.affected_competitors.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.structured_data?.market_opportunities?.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold mb-4">
                    <Target className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Opportunities
                  </h4>
                  <div className="space-y-3">
                    {report.structured_data.market_opportunities.map((opp: any, i: number) => (
                      <div key={i} className="bg-blue-50 dark:bg-blue-500/5 rounded-lg p-3 border border-blue-200 dark:border-blue-500/10">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-blue-900 dark:text-blue-100 text-sm">{opp.name}</span>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{opp.opportunity_score}/10</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{opp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.structured_data?.market_risks?.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold mb-4">
                    <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400" /> Risks
                  </h4>
                  <div className="space-y-3">
                    {report.structured_data.market_risks.map((risk: any, i: number) => (
                      <div key={i} className="bg-rose-50 dark:bg-rose-500/5 rounded-lg p-3 border border-rose-200 dark:border-rose-500/10">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-rose-900 dark:text-rose-100 text-sm">{risk.name}</span>
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">{risk.risk_score}/10</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{risk.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
