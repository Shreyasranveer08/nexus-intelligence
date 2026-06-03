import LiveIntelligenceEngine from '@/components/LiveIntelligenceEngine'
import IntelligenceEnvironment from '@/components/IntelligenceEnvironment'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-slate-300 flex font-sans selection:bg-blue-500/30">
      
      {/* Left Side: 40% Authentication */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center relative z-20 border-r border-white/5 bg-[#0a0a0a] px-8 sm:px-12 lg:px-20 xl:px-24">
        {children}
      </div>
      
      {/* Right Side: 60% Live Intelligence Platform */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden bg-[#050505] flex-col p-16 xl:p-24 justify-center items-center">
        
        {/* Subtle Environmental Depth Background */}
        <IntelligenceEnvironment />

        {/* Live Product Experience */}
        <div className="relative z-10 w-full max-w-2xl">
          <LiveIntelligenceEngine />
        </div>
        
      </div>
    </div>
  )
}
