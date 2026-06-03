import React from 'react'
import { getExecutionPlan } from '@/app/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Clock, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default async function ExecutionPlanPage({ params }: { params: { id: string } }) {
  const plan = await getExecutionPlan(params.id);

  if (!plan) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6 bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-white/5">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Command Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-purple-200 dark:border-purple-500/20">
            Strategic Execution Plan
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${
            plan.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
            plan.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' :
            'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-400 border-slate-200 dark:border-white/10'
          }`}>
            {plan.status}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">{plan.title.replace('Execution Plan: ', '')}</h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{plan.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-white/5 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Generated</div>
            <div className="font-semibold text-slate-900 dark:text-white text-sm">{new Date(plan.created_at).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-white/5 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Priority Level</div>
            <div className="font-semibold text-slate-900 dark:text-white text-sm">{plan.priority}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-white/5 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Source Action ID</div>
            <div className="font-semibold text-slate-900 dark:text-white text-sm truncate max-w-[120px]">{plan.source_action_id}</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-white/5 p-8 md:p-10 shadow-sm">
        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200 dark:prose-h2:border-white/10 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-li:my-1 prose-ul:my-4 prose-strong:text-slate-900 dark:prose-strong:text-white">
          <ReactMarkdown
            components={{
              ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300" {...props} />,
              p: ({node, ...props}) => <p className="text-slate-700 dark:text-slate-300" {...props} />,
              h2: ({node, ...props}) => <h2 className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-3" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-slate-800 dark:text-slate-200 font-semibold" {...props} />,
            }}
          >
            {plan.content}
          </ReactMarkdown>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end gap-4">
        <button className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm">
          Mark In Progress
        </button>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> Mark Completed
        </button>
      </div>
    </div>
  )
}
