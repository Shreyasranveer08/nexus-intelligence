'use client'

import React, { useState } from 'react'

const INDUSTRIES = [
  "SaaS", "AI / Machine Learning", "Cybersecurity", "FinTech", "HealthTech", "EdTech", 
  "E-commerce", "Marketplace", "Developer Tools", "DevOps", "Cloud Infrastructure", 
  "Data & Analytics", "Business Intelligence", "CRM", "Marketing Technology", "Sales Technology", 
  "HR Tech", "Legal Tech", "Real Estate", "Logistics", "Manufacturing", "Gaming", "Media", 
  "Content Creation", "Social Media", "Telecommunications", "Travel", "Hospitality", 
  "Automotive", "Energy", "Construction", "Agriculture", "Nonprofit", "Government", 
  "Consulting", "Agency", "Consumer Apps", "Web3 / Blockchain", "Other"
]
import { motion, AnimatePresence } from 'framer-motion'
import { Hexagon, ArrowRight, Briefcase, Code, User, Megaphone, Zap, Building2, Globe, Target, AlertTriangle, Shield, TrendingUp, Search, Plus, Trash2, CheckCircle2, Loader2, Sparkles, Lock, Activity } from 'lucide-react'
import { updateOnboardingProgress, completeOnboarding, addCompetitor } from '@/app/actions'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

// --- RIGHT PANEL DYNAMIC PREVIEW ---
function RightPreviewPanel({ step, company, competitors, scanStatus, scanProgress }: any) {
  if (step === 1 || step === 2) {
    return (
      <motion.div key="p-1" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="w-full max-w-2xl">
        <div className="bg-white/50 dark:bg-[#111]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Your Intelligence Workspace</h3>
              <p className="text-slate-500 dark:text-slate-400">Complete setup to unlock your dashboard.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl p-5">
               <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4"><Lock className="w-4 h-4 text-slate-400" /> Features Locked</h4>
               <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div> Competitor Tracking</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div> Threat Detection Alerts</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div> Strategic Recommendations</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div> Market Trend Reports</li>
               </ul>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl p-5 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
               <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-blue-500" /> Sample Insight</h4>
               <div className="bg-slate-50 dark:bg-[#222] p-3 rounded-lg border border-slate-200 dark:border-white/5 mb-2">
                 <div className="h-2 w-1/3 bg-slate-200 dark:bg-white/10 rounded-full mb-2"></div>
                 <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full"></div>
               </div>
               <div className="bg-slate-50 dark:bg-[#222] p-3 rounded-lg border border-slate-200 dark:border-white/5">
                 <div className="h-2 w-1/2 bg-slate-200 dark:bg-white/10 rounded-full mb-2"></div>
                 <div className="h-2 w-4/5 bg-slate-200 dark:bg-white/10 rounded-full"></div>
               </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center px-4 pt-4 border-t border-slate-100 dark:border-white/10">
             <div className="flex gap-2">
                <div className="w-10 h-2 bg-blue-500 rounded-full"></div>
                <div className={`w-10 h-2 rounded-full ${step > 1 ? 'bg-blue-500' : 'bg-slate-200 dark:bg-white/10'}`}></div>
                <div className={`w-10 h-2 rounded-full ${step > 2 ? 'bg-blue-500' : 'bg-slate-200 dark:bg-white/10'}`}></div>
                <div className={`w-10 h-2 rounded-full ${step > 3 ? 'bg-blue-500' : 'bg-slate-200 dark:bg-white/10'}`}></div>
                <div className={`w-10 h-2 rounded-full ${step > 4 ? 'bg-blue-500' : 'bg-slate-200 dark:bg-white/10'}`}></div>
             </div>
             <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Step {step} of 5</span>
          </div>
        </div>
      </motion.div>
    )
  }

  if (step === 3) {
    const isTyping = company.website.length > 3;
    return (
      <motion.div key="p-3" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="w-full max-w-2xl">
        <div className="bg-white/50 dark:bg-[#111]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {isTyping && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-[gradient_2s_linear_infinite] bg-[length:200%_100%]"></div>}
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Discovery Active</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Scanning digital footprint...</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 rounded-xl p-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Detected Entity</span>
                <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  {company.name || (isTyping ? <span className="animate-pulse">Extracting...</span> : 'Awaiting input')}
                </div>
              </div>
              <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 rounded-xl p-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Target Audience</span>
                <div className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {company.target_audience || (isTyping ? <span className="animate-pulse">Analyzing...</span> : 'Awaiting input')}
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 rounded-xl p-5">
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-2 block">Synthesized Summary</span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  {company.product_description 
                    ? `"${company.product_description}"` 
                    : (isTyping ? <span className="animate-pulse text-slate-400">Generating AI summary based on available web data...</span> : 'Waiting for website context...')}
                </p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (step === 4) {
    return (
      <motion.div key="p-4" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="w-full max-w-2xl">
        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Target className="w-6 h-6 text-blue-500"/> Intelligence Preview</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Live insights based on your selection.</p>
            </div>
            <div className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Feed
            </div>
          </div>

          {competitors.length > 0 ? (
             <div className="space-y-4">
                <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl p-5">
                   <div className="flex items-center gap-2 mb-2">
                     <AlertTriangle className="w-5 h-5 text-rose-500" />
                     <h4 className="font-bold text-rose-700 dark:text-rose-400">Biggest Threat</h4>
                   </div>
                   <p className="text-sm text-rose-600 dark:text-rose-300/80"><strong className="text-rose-700 dark:text-rose-300 font-bold">{competitors[0].name}</strong> is currently expanding their core feature set aggressively in your sector.</p>
                </div>
                {competitors.length > 1 && (
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-5">
                     <div className="flex items-center gap-2 mb-2">
                       <Zap className="w-5 h-5 text-emerald-500" />
                       <h4 className="font-bold text-emerald-700 dark:text-emerald-400">Market Opportunity</h4>
                     </div>
                     <p className="text-sm text-emerald-600 dark:text-emerald-300/80"><strong className="text-emerald-700 dark:text-emerald-300 font-bold">{competitors[1].name}</strong> has received negative feedback on pricing recently. Opportunity to emphasize value.</p>
                  </div>
                )}
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-5">
                   <div className="flex items-center gap-2 mb-2">
                     <ArrowRight className="w-5 h-5 text-blue-500" />
                     <h4 className="font-bold text-blue-700 dark:text-blue-400">Recommended Action</h4>
                   </div>
                   <p className="text-sm text-blue-600 dark:text-blue-300/80">Monitor their upcoming product launches. We will alert you immediately if they release competing features.</p>
                </div>
             </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
              <Shield className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Add a competitor to see live insights</p>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  if (step >= 5) {
    return (
      <motion.div key="p-5" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="w-full max-w-md">
        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 animate-pulse pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
             <div className="w-20 h-20 mb-6 relative">
               <svg className="w-full h-full text-blue-500 animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="141.37" strokeDashoffset="0"></circle>
               </svg>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Hexagon className="w-8 h-8 text-blue-600 dark:text-blue-400 fill-blue-500/20" />
               </div>
             </div>
             
             <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Generating Intelligence</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">{scanProgress}% complete</p>

             <div className="w-full space-y-3 text-left">
                {[
                  { text: 'Analyzing competitors', threshold: 10 },
                  { text: 'Detecting changes', threshold: 30 },
                  { text: 'Building strategic insights', threshold: 50 },
                  { text: 'Generating recommendations', threshold: 70 },
                  { text: 'Creating weekly intelligence package', threshold: 90 }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {scanProgress >= item.threshold ? (
                       <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                       <div className="w-5 h-5 border-2 border-slate-200 dark:border-white/20 rounded-full"></div>
                    )}
                    <span className={`text-sm ${scanProgress >= item.threshold ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return null
}

export default function OnboardingFlow({ initialStep }: { initialStep: number }) {
  const [step, setStep] = useState(initialStep)
  const [role, setRole] = useState('')
  const [company, setCompany] = useState({
    name: '',
    website: '',
    industry: '',
    custom_industry: '',
    product_description: '',
    target_audience: '',
    pricing: '',
    positioning_statement: ''
  })
  
  const [competitors, setCompetitors] = useState<{name: string, url: string}[]>([])
  const [compName, setCompName] = useState('')
  const [compUrl, setCompUrl] = useState('')
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [suggestions, setSuggestions] = useState<{name: string, url: string}[]>([])
  
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStatus, setScanStatus] = useState('Initializing AI engine...')
  
  const router = useRouter()

  React.useEffect(() => {
    // Check if we came from the Website Analyzer
    const prefillDataStr = localStorage.getItem('nexus_prefill')
    if (prefillDataStr) {
      try {
        const prefill = JSON.parse(prefillDataStr)
        setCompany(prev => ({
          ...prev,
          name: prefill.company || '',
          website: prefill.website || '',
          industry: INDUSTRIES.includes(prefill.industry) ? prefill.industry : 'Other',
          custom_industry: !INDUSTRIES.includes(prefill.industry) ? prefill.industry : ''
        }))
        
        if (prefill.competitors && prefill.competitors.length > 0) {
          setCompetitors(prefill.competitors.map((c: string) => ({ name: c, url: `https://${c.toLowerCase().replace(/[^a-z0-9]/g, '')}.com` })))
        }
        
        // Clean up so it only pre-fills once
        localStorage.removeItem('nexus_prefill')
      } catch (e) {
        console.error('Failed to parse prefill data', e)
      }
    }
  }, [])

  const handleNext = async () => {
    if (step === 2 && !role) {
      toast.error('Please select a role'); return;
    }
    if (step === 3) {
      if (!company.name || !company.website || !company.industry) {
        toast.error('Please fill in the required fields'); return;
      }
      if (company.industry === 'Other' && !company.custom_industry) {
        toast.error('Please specify your custom industry'); return;
      }
    }

    const nextStep = step + 1;
    setStep(nextStep);
    
    try {
      const finalCompany = { ...company };
      if (finalCompany.industry === 'Other' && finalCompany.custom_industry) {
        finalCompany.industry = finalCompany.custom_industry;
      }
      await updateOnboardingProgress(nextStep, { role, company: finalCompany });
    } catch (e) {
      console.error(e)
    }

    if (nextStep === 5) {
      runInitialScan();
    }
  }

  const addComp = () => {
    if (!compName || !compUrl) return;
    setCompetitors([...competitors, { name: compName, url: compUrl }])
    setCompName('')
    setCompUrl('')
  }
  
  const addSuggestion = (s: {name: string, url: string}) => {
    if (competitors.some(c => c.name === s.name)) return;
    setCompetitors([...competitors, s])
    setSuggestions(suggestions.filter(sugg => sugg.name !== s.name))
  }
  
  const removeComp = (idx: number) => {
    setCompetitors(competitors.filter((_, i) => i !== idx))
  }

  const getAISuggestions = () => {
    setIsSuggesting(true)
    setTimeout(() => {
      const mockSuggestions = [
        { name: 'Acme Corp', url: 'https://acmecorp.com' },
        { name: 'Globex', url: 'https://globex.io' },
        { name: 'Initech', url: 'https://initech.software' }
      ]
      setSuggestions(mockSuggestions)
      setIsSuggesting(false)
    }, 2000)
  }

  const runInitialScan = async () => {
    if (competitors.length > 0) {
      for (const comp of competitors) {
        await addCompetitor(comp.name, [{ url: comp.url, type: 'Homepage' }]);
      }
    }

    const statuses = [
      'Initializing AI engine...',
      'Analyzing your company profile...',
      'Crawling competitor footprints...',
      'Extracting pricing models and positioning...',
      'Synthesizing actionable insights...',
      'Generating first market report...'
    ]
    
    for (let i = 0; i < statuses.length; i++) {
      setScanStatus(statuses[i])
      setScanProgress((i + 1) * (100 / statuses.length))
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    
    await completeOnboarding()
    setStep(6) 
  }

  const finishOnboarding = () => {
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-slate-50 dark:bg-[#0a0a0a]">
      {/* LEFT FORM PANEL (40%) */}
      <div className="w-full lg:w-[40%] flex flex-col bg-white dark:bg-[#111111] border-r border-slate-200 dark:border-white/10 relative shadow-2xl lg:shadow-none z-10 min-h-[50vh] lg:min-h-screen">
        
        {/* Progress Bar (Mobile/Desktop Top Edge) */}
        <div className="absolute top-0 left-0 h-1.5 w-full bg-slate-100 dark:bg-white/5 z-20">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${(Math.min(step, 5) / 5) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex-1 flex flex-col p-8 md:p-12 lg:p-16 overflow-y-auto">
          {step < 5 && (
            <div className="absolute top-8 md:top-12 lg:top-16 left-8 md:left-12 lg:left-16 flex items-center text-sm font-medium text-slate-400 tracking-wider uppercase z-30">
              Step {step} of 4
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: WELCOME */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center py-16 md:py-24"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  <Hexagon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Welcome to NexusIntel</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                  Your AI-powered strategic advisor. In the next few minutes, we'll map your competitive landscape and deliver your first actionable market intelligence report.
                </p>
                
                <div className="mt-auto pt-8">
                  <button 
                    onClick={handleNext}
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-semibold py-4 rounded-xl flex items-center justify-center transition-colors"
                  >
                    Get Started <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ROLE */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center py-16 md:py-24"
              >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">What best describes you?</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">This helps us tailor the intelligence insights to your specific needs.</p>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'Founder', icon: Target, label: 'Founder / CEO' },
                    { id: 'Product Manager', icon: Code, label: 'Product Manager' },
                    { id: 'Marketing', icon: Megaphone, label: 'Marketing Leader' },
                    { id: 'Agency', icon: Building2, label: 'Agency' },
                    { id: 'Consultant', icon: Briefcase, label: 'Consultant' },
                    { id: 'Startup Team', icon: User, label: 'Startup Team Member' }
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`p-4 rounded-xl border flex items-center text-left transition-all ${
                        role === r.id 
                          ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm' 
                          : 'bg-white dark:bg-[#1a1a1a] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <r.icon className="w-5 h-5 mr-3 opacity-80" />
                      <span className="font-medium">{r.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-10 flex gap-4">
                  <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    Back
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={!role}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    Continue <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: COMPANY PROFILE */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center py-16 md:py-24"
              >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Your Company Profile</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">We use this to analyze threats and opportunities relative to your position.</p>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
                    <input 
                      type="text" 
                      value={company.name} onChange={e => setCompany({...company, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
                      placeholder="e.g. NexusIntel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Website *</label>
                    <input 
                      type="text" 
                      value={company.website} onChange={e => setCompany({...company, website: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
                      placeholder="e.g. nexusintel.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Industry *</label>
                    <input 
                      list="industries-list"
                      type="text"
                      value={company.industry} onChange={e => setCompany({...company, industry: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
                      placeholder="Search or enter industry..."
                    />
                    <datalist id="industries-list">
                      {INDUSTRIES.map(ind => <option key={ind} value={ind} />)}
                    </datalist>
                  </div>
                  
                  {company.industry === 'Other' && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Specify Industry *</label>
                      <input 
                        type="text" 
                        value={company.custom_industry || ''}
                        onChange={e => setCompany({...company, custom_industry: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
                        placeholder="e.g. Space Exploration"
                      />
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Description</label>
                    <textarea 
                      value={company.product_description} onChange={e => setCompany({...company, product_description: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 h-24 resize-none" 
                      placeholder="What does your product do?"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Audience</label>
                    <input 
                      type="text" 
                      value={company.target_audience} onChange={e => setCompany({...company, target_audience: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
                      placeholder="e.g. Enterprise B2B, SMBs, Consumers"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex gap-4">
                  <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    Back
                  </button>
                  <button 
                    onClick={handleNext}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center transition-colors"
                  >
                    Continue <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: COMPETITORS */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center py-16 md:py-24"
              >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Track Competitors</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Who are you up against? Add them below or let AI suggest them.</p>
                
                <div className="bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 mb-6 shadow-sm">
                  <div className="flex flex-col gap-3 mb-5">
                    <input 
                      type="text" 
                      placeholder="Competitor Name"
                      value={compName} onChange={e => setCompName(e.target.value)}
                      className="w-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                    <input 
                      type="url" 
                      placeholder="Website URL"
                      value={compUrl} onChange={e => setCompUrl(e.target.value)}
                      className="w-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                    <button onClick={addComp} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                      Add Competitor
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-3 pt-5 border-t border-slate-200 dark:border-white/10">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">Or let our AI find them:</span>
                    <button 
                      onClick={getAISuggestions}
                      disabled={isSuggesting}
                      className="w-full bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 text-sm font-medium text-purple-600 dark:text-purple-400 py-2.5 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 border border-purple-100 dark:border-purple-500/20"
                    >
                      {isSuggesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                      Suggest Competitors
                    </button>
                  </div>

                  {suggestions.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {suggestions.map((s, i) => (
                        <div key={i} className="bg-white dark:bg-white/5 border border-purple-200 dark:border-purple-500/20 shadow-sm rounded-lg px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:border-purple-500 transition-colors" onClick={() => addSuggestion(s)}>
                          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">{s.name}</span>
                          <Plus className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto pr-2 max-h-[250px]">
                  {competitors.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                      No competitors added yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {competitors.map((c, i) => (
                        <div key={i} className="flex items-center justify-between bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg p-3">
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">{c.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{c.url}</div>
                          </div>
                          <button onClick={() => removeComp(i)} className="text-slate-400 hover:text-rose-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex gap-4">
                  <button onClick={() => setStep(3)} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    Back
                  </button>
                  {competitors.length === 0 ? (
                    <button 
                      onClick={handleNext}
                      className="flex-1 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-xl flex items-center justify-center transition-colors"
                    >
                      Skip for now <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleNext}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center transition-colors"
                    >
                      Start Initial Scan <Zap className="w-5 h-5 ml-2" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 5: SCANNING */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-20"
              >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Analyzing the Market</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto h-6">{scanStatus}</p>
                
                <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${scanProgress}%` }}
                  ></motion.div>
                </div>
              </motion.div>
            )}

            {/* STEP 6: SUCCESS */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Your first report is ready</h2>
                  <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-8">
                    We've completed the initial baseline scan of your competitive landscape.
                  </p>

                  <div className="w-full text-left bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-purple-500" />
                      <span className="font-bold text-slate-900 dark:text-white">Quick Insights</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">Competitors are heavily investing in AI capabilities.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Target className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">Opportunity to differentiate on execution speed.</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={finishOnboarding}
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center transition-colors shadow-xl"
                  >
                    Enter Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT PREVIEW PANEL (60%) */}
      <div className="hidden lg:flex w-[60%] flex-col items-center justify-center p-12 relative overflow-hidden bg-slate-50 dark:bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0a0a0a]/0 to-[#0a0a0a]/0 dark:opacity-100 opacity-0 pointer-events-none"></div>
        <RightPreviewPanel 
          step={step} 
          company={company} 
          competitors={competitors} 
          scanStatus={scanStatus}
          scanProgress={scanProgress}
        />
      </div>
    </div>
  )
}
