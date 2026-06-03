'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { analyzeWebsite } from '@/app/actions'
import { Hexagon, Globe, ArrowRight, Activity, CheckCircle2, Search, Target, ShieldCheck, Zap, Lock, Unlock, MoveRight } from 'lucide-react'

const ANALYSIS_STEPS = [
  'Scraping DOM structure...',
  'Extracting feature matrix...',
  'Identifying target audience...',
  'Detecting positioning strategy...',
  'Mapping feature categories...',
  'Discovering market competitors...',
  'Generating SWOT analysis...',
  'Building intelligence report...'
]

export default function AnalyzePage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [state, setState] = useState<'landing' | 'analyzing' | 'results'>('landing')
  const [currentStep, setCurrentStep] = useState(0)
  const [analysisData, setAnalysisData] = useState<any>(null)

  useEffect(() => {
    if (state === 'analyzing') {
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= ANALYSIS_STEPS.length - 1) {
            clearInterval(stepInterval)
            return prev
          }
          return prev + 1
        })
      }, 800) // Each step takes 800ms to feel realistic
      
      return () => clearInterval(stepInterval)
    }
  }, [state])

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    
    // Add protocol if missing
    let targetUrl = url
    if (!/^https?:\/\//i.test(url)) {
      targetUrl = 'https://' + url
    }
    
    setState('analyzing')
    setCurrentStep(0)
    
    try {
      // Simulate network request + intelligence delay to let the animation play out
      const [data] = await Promise.all([
        analyzeWebsite(targetUrl),
        new Promise(resolve => setTimeout(resolve, ANALYSIS_STEPS.length * 800 + 500))
      ])
      
      setAnalysisData(data)
      setState('results')
    } catch (e) {
      console.error(e)
      setState('landing')
      alert("Analysis failed. Please check the URL.")
    }
  }

  const handleCreateAccount = () => {
    // Save to local storage for prefilling in onboarding
    if (analysisData) {
      localStorage.setItem('nexus_prefill', JSON.stringify({
        company: analysisData.overview.name,
        website: analysisData.overview.website,
        industry: analysisData.overview.industry,
        competitors: analysisData.marketIntelligence.suggestedCompetitors
      }))
    }
    // Route to auth -> welcome -> onboarding
    router.push('/auth/signup?source=analyzer')
  }

  return (
    <div className="w-full flex-1 min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Header */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 absolute top-0 w-full z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Hexagon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">NexusIntel</span>
        </div>
        <button 
          onClick={() => router.push('/auth/login')}
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Sign In
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative pt-20 pb-20">
        
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        {state === 'landing' && (
          <div className="w-full max-w-3xl mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-blue-400 mb-8 font-medium tracking-wide">
              <Zap className="w-4 h-4" /> Free Website Intelligence Analyzer
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
              Analyze any competitor in seconds.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Enter any company website below. Our intelligence engine will instantly extract their positioning, product features, SWOT, and market vulnerabilities.
            </p>

            <form onSubmit={handleAnalyze} className="relative max-w-xl mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center bg-[#111111] border border-white/10 rounded-2xl p-2 shadow-2xl">
                <div className="pl-4 pr-2">
                  <Globe className="w-6 h-6 text-slate-500" />
                </div>
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com" 
                  className="flex-1 bg-transparent text-white px-2 py-4 outline-none text-lg placeholder:text-slate-600"
                  required
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-colors">
                  Analyze <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {state === 'analyzing' && (
          <div className="w-full max-w-md mx-auto px-6 animate-in fade-in duration-500">
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 ease-out" 
                  style={{ width: `${((currentStep + 1) / ANALYSIS_STEPS.length) * 100}%` }}
                />
              </div>
              
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 mx-auto relative">
                <div className="absolute inset-0 border-2 border-blue-500/30 rounded-2xl animate-ping opacity-20"></div>
                <Search className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              
              <h3 className="text-xl font-bold text-center mb-6">Analyzing {url.replace(/^https?:\/\//i, '').split('/')[0]}</h3>
              
              <div className="space-y-4">
                {ANALYSIS_STEPS.map((step, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-3 transition-all duration-300 ${
                      idx < currentStep ? 'text-slate-400' : 
                      idx === currentStep ? 'text-white font-medium scale-105 transform origin-left' : 
                      'text-slate-700 opacity-50'
                    }`}
                  >
                    {idx < currentStep ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : idx === currentStep ? (
                      <Activity className="w-5 h-5 text-blue-500 animate-spin-slow flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-700 flex-shrink-0" />
                    )}
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {state === 'results' && analysisData && (
          <div className="w-full max-w-6xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-10">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-4">
                  <CheckCircle2 className="w-3 h-3" /> Analysis Complete
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">{analysisData.overview.name}</h1>
                <a href={analysisData.overview.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-sm font-medium">
                  <Globe className="w-4 h-4" /> {analysisData.overview.website}
                </a>
              </div>
              <button onClick={handleCreateAccount} className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                <Lock className="w-4 h-4" /> Track Continuously
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              
              {/* Overview & Positioning (Span 2) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Positioning Card */}
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-6">
                    <Target className="w-4 h-4" /> Positioning Analysis
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Value Proposition</div>
                      <div className="text-lg font-medium text-white">{analysisData.positioning.valueProposition}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Core Messaging</div>
                        <div className="text-slate-300 text-sm">{analysisData.positioning.coreMessaging}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Market Positioning</div>
                        <div className="text-slate-300 text-sm">{analysisData.positioning.marketPositioning}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Card */}
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-6">
                    <Hexagon className="w-4 h-4" /> Feature Taxonomy
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysisData.features.map((cat: any, idx: number) => (
                      <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4">
                        <div className="font-semibold text-white mb-3 text-sm">{cat.category}</div>
                        <ul className="space-y-2">
                          {cat.points.map((point: string, pIdx: number) => (
                            <li key={pIdx} className="text-sm text-slate-400 flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span> {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sidebar Info (Span 1) */}
              <div className="space-y-6">
                
                {/* Business Model */}
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-6">
                    <ShieldCheck className="w-4 h-4" /> Business Model
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-slate-500 font-semibold mb-1">Pricing</div>
                      <div className="text-sm text-slate-300">{analysisData.business.pricingModel}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-semibold mb-1">Target Segment</div>
                      <div className="text-sm text-slate-300">{analysisData.business.estimatedSegment}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-semibold mb-2">Competitive Advantages</div>
                      <div className="flex flex-wrap gap-2">
                        {analysisData.business.competitiveAdvantages.map((adv: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                            {adv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Intelligence */}
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Zap className="w-32 h-32 text-blue-500" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-6 relative z-10">
                    <Activity className="w-4 h-4" /> Market Intelligence
                  </h3>
                  
                  <div className="space-y-5 relative z-10">
                    <div>
                      <div className="text-xs text-slate-500 font-semibold mb-2">Detected Threats</div>
                      <ul className="space-y-2">
                        {analysisData.marketIntelligence.swot.threats.map((item: string, idx: number) => (
                          <li key={idx} className="text-sm text-red-400 flex items-start gap-2">
                            <span className="mt-1">×</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-semibold mb-2">Detected Opportunities</div>
                      <ul className="space-y-2">
                        {analysisData.marketIntelligence.swot.opportunities.map((item: string, idx: number) => (
                          <li key={idx} className="text-sm text-emerald-400 flex items-start gap-2">
                            <span className="mt-1">+</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Conversion CTA Footer */}
            <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 mb-6">
                  <Unlock className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Want continuous intelligence?</h2>
                <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-lg">
                  This snapshot is just the beginning. Create a free account to continuously monitor {analysisData.overview.name} and your entire competitive landscape.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                  {['Competitor Tracking', 'Weekly Intelligence Reports', 'Execution Plans', 'Real-time Notifications'].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-black/30 border border-white/5 px-4 py-2 rounded-full text-sm font-medium text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {feature}
                    </div>
                  ))}
                </div>

                <button onClick={handleCreateAccount} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center gap-2 mx-auto transition-all hover:scale-105">
                  Unlock Monitoring Dashboard <MoveRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
          </div>
        )}
      </main>
    </div>
  )
}
