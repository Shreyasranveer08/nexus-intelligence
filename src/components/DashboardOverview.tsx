'use client'

import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Target, Zap, TrendingUp } from 'lucide-react'



export default function DashboardOverview({ feedCount = 0, stats }: { feedCount: number, stats: any }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mb-12 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 p-5 rounded-2xl relative overflow-hidden group shadow-sm dark:shadow-none transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 dark:bg-blue-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Signals Detected</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{feedCount}</h3>
            </div>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center font-medium relative z-10">
            <TrendingUp className="w-3 h-3 mr-1" /> +12% from last week
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 p-5 rounded-2xl relative overflow-hidden group shadow-sm dark:shadow-none transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Competitors Tracked</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.competitorsCount}</h3>
            </div>
            <div className="p-2.5 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center font-medium relative z-10">
            Across {stats.urlsCount} web properties
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 p-5 rounded-2xl relative overflow-hidden group shadow-sm dark:shadow-none transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100 dark:bg-rose-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">High Impact Shifts</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.highImpactCount}</h3>
            </div>
            <div className="p-2.5 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center font-medium relative z-10">
            Requires immediate review
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-500/30 p-5 rounded-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="text-white font-semibold mb-1">Generate Report</h3>
            <p className="text-blue-100 dark:text-blue-200 text-sm leading-tight">Compile this week's data into an executive summary.</p>
          </div>
          <button 
            onClick={async (e) => {
              const btn = e.currentTarget;
              const originalText = btn.innerText;
              btn.innerText = 'Generating...';
              btn.disabled = true;
              try {
                const res = await fetch('/api/cron/report');
                const data = await res.json();
                if (data.success) {
                  alert(data.message || 'Report generated successfully!');
                } else {
                  alert('Error: ' + data.error);
                }
              } catch (err) {
                alert('Failed to generate report.');
              } finally {
                btn.innerText = originalText;
                btn.disabled = false;
              }
            }}
            className="relative z-10 mt-4 w-full bg-white text-blue-900 py-2 rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-70"
          >
            Create Brief
          </button>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-2xl p-6 h-80 shadow-sm dark:shadow-none transition-colors">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-slate-900 dark:text-white font-medium">Intelligence Activity (7 Days)</h3>
            <p className="text-sm text-slate-500">Volume and impact of detected competitor changes.</p>
          </div>
          <select className="bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-slate-300 rounded-md px-3 py-1.5 outline-none transition-colors">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="h-52 w-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <AreaChart data={stats.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--tw-colors-slate-900)', borderColor: 'transparent', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="impact" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorImpact)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  )
}
