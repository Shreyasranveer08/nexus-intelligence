// @ts-nocheck
'use client'

import React, { useRef, useEffect } from 'react'
import { Send, Sparkles, MessageSquare, Hexagon, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useChat } from 'ai/react'

export default function CopilotPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append, error } = useChat({
    api: '/api/copilot',
  })
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const suggestedPrompts = [
    "What is my biggest competitive threat?",
    "Compare our features to competitors.",
    "What happened in the last 30 days?",
    "Create an action plan based on recent competitor activity."
  ]

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSuggestedPrompt = (prompt: string) => {
    try {
      if (typeof append === 'function') {
        append({ role: 'user', content: prompt });
      }
    } catch (e) {
      console.error('Suggest prompt error:', e);
    }
  }

  const handleExportPDF = async () => {
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = typeof html2pdfModule.default === 'function' ? html2pdfModule.default : html2pdfModule;
    const element = document.getElementById('chat-container');
    
    if (element) {
      const opt = {
        margin:       0.5,
        filename:     'Nexus_Copilot_Intelligence_Report.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff' }, // Force white bg for PDF
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden relative">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Nexus Copilot</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Deep RAG Intelligence Engine</p>
          </div>
        </div>
        
        {messages.length > 0 && (
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-slate-300 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export PDF
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div id="chat-container" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-[#111]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6">
              <Hexagon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">How can I help you dominate your market?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
              I have full access to your synthesized insights, competitor tracking data, and execution plans via Semantic Vector Search. Ask me anything.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="text-left px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-sm transition-all group"
                >
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    "{prompt}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto w-full pb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role !== 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-shrink-0 items-center justify-center shadow-sm mt-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[85%] flex flex-col gap-3`}>
                  {/* Text Content */}
                  {msg.content && (
                    <div className={`rounded-2xl px-5 py-4 ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white shadow-md self-end' 
                        : 'bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200'
                    }`}>
                      {msg.role !== 'user' ? (
                        <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
                          <ReactMarkdown
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-4" {...props}/>,
                              h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-3 mt-4" {...props}/>,
                              h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-3" {...props}/>,
                              p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props}/>,
                              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props}/>,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props}/>,
                              li: ({node, ...props}) => <li className="leading-relaxed" {...props}/>,
                              strong: ({node, ...props}) => <strong className="font-bold text-slate-900 dark:text-white" {...props}/>,
                              a: ({node, ...props}) => <a className="text-indigo-600 dark:text-indigo-400 hover:underline" {...props}/>,
                              code: ({node, ...props}) => <code className="bg-slate-100 dark:bg-slate-800 rounded px-1 py-0.5 text-sm font-mono" {...props}/>,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  )}

                  {/* Tool Invocations (Generative UI) */}
                  {msg.toolInvocations?.map((toolInvocation: any) => {
                    if (toolInvocation.toolName === 'generateComparisonChart') {
                      return (
                        <div key={toolInvocation.toolCallId} className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm mt-2 w-full max-w-2xl">
                          <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                            <h3 className="font-semibold text-lg">{toolInvocation.args.title || 'Comparison Chart'}</h3>
                          </div>
                          <div className="space-y-4">
                            {toolInvocation.args.data?.map((item: any, idx: number) => (
                              <div key={idx} className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.category}</span>
                                  <span className="text-slate-500 text-xs">Our Score: {item.ourScore}/10 | {item.competitorName}: {item.competitorScore}/10</span>
                                </div>
                                <div className="flex h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div className="bg-blue-500 h-full" style={{ width: `${(item.ourScore / 10) * 100}%` }} title="Us" />
                                </div>
                                <div className="flex h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                                  <div className="bg-rose-500 h-full" style={{ width: `${(item.competitorScore / 10) * 100}%` }} title={item.competitorName} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    if (toolInvocation.toolName === 'createBattlecard') {
                      const args = toolInvocation.args;
                      return (
                        <div key={toolInvocation.toolCallId} className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl mt-2 w-full max-w-2xl text-white">
                          <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-4">
                            <h3 className="font-bold text-xl text-white flex items-center gap-2">
                              <svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                              Battlecard: {args.competitorName}
                            </h3>
                            <span className="text-xs bg-rose-500/20 text-rose-300 px-2.5 py-1 rounded-full border border-rose-500/30">Confidential</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                              <h4 className="text-emerald-400 font-semibold text-sm mb-2 flex items-center gap-1.5"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg> Their Strengths</h4>
                              <ul className="space-y-1.5">
                                {args.strengths?.map((s: string, i: number) => <li key={i} className="text-sm text-slate-300 flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">•</span> <span>{s}</span></li>)}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-rose-400 font-semibold text-sm mb-2 flex items-center gap-1.5"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg> Their Weaknesses</h4>
                              <ul className="space-y-1.5">
                                {args.weaknesses?.map((w: string, i: number) => <li key={i} className="text-sm text-slate-300 flex items-start gap-1.5"><span className="text-rose-500 mt-0.5">•</span> <span>{w}</span></li>)}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
                            <h4 className="text-indigo-300 font-semibold text-xs uppercase tracking-wider mb-1">Our Advantage (How to Win)</h4>
                            <p className="text-sm leading-relaxed">{args.ourAdvantage}</p>
                          </div>
                          
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <h4 className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">Pricing Strategy</h4>
                            <p className="text-sm leading-relaxed">{args.pricingStrategy}</p>
                          </div>
                        </div>
                      );
                    }

                    if (toolInvocation.toolName === 'generateExecutionPlan') {
                      const args = toolInvocation.args;
                      return (
                        <div key={toolInvocation.toolCallId} className="bg-white dark:bg-[#1a1a1a] border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-6 shadow-sm mt-2 w-full max-w-2xl">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            {args.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 pb-4 border-b border-slate-100 dark:border-white/5">{args.objective}</p>
                          
                          <div className="space-y-4">
                            {args.steps?.map((step: any, i: number) => (
                              <div key={i} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-100 dark:border-indigo-500/20">
                                  {i + 1}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                                    {step.title}
                                    <span className="text-[10px] uppercase tracking-wider bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{step.owner}</span>
                                  </h4>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{step.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={toolInvocation.toolCallId} className="flex items-center gap-2 text-slate-400 text-sm mt-2 bg-slate-50 dark:bg-white/5 px-3 py-2 rounded-lg w-fit border border-slate-200 dark:border-white/5">
                        <Loader2 className="w-4 h-4 animate-spin" /> Generating {toolInvocation.toolName}...
                      </div>
                    );
                  })}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/10 flex flex-shrink-0 items-center justify-center mt-1">
                    <MessageSquare className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-shrink-0 items-center justify-center shadow-sm mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-[80%] rounded-2xl px-5 py-4 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Retrieving secure context...
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex gap-4 justify-start mt-4">
                <div className="w-8 h-8 rounded-lg bg-rose-500 flex flex-shrink-0 items-center justify-center shadow-sm mt-1 text-white font-bold">
                  !
                </div>
                <div className="max-w-[80%] rounded-2xl px-5 py-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-200">
                  <div className="flex flex-col gap-1 text-sm">
                    <strong className="font-semibold">Error communicating with Nexus:</strong>
                    <span>{error.message || 'Unknown error occurred'}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-[#111] border-t border-slate-200 dark:border-white/10 z-10">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="Ask about competitors, strategies, or recent reports..."
            className="w-full pl-6 pr-14 py-4 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-1 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all disabled:opacity-50 shadow-sm"
          />
          <button
            type="submit"
            disabled={!input?.trim() || isLoading}
            className="absolute right-3 w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-white/5 text-white disabled:text-slate-400 flex items-center justify-center transition-colors shadow-sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-widest">
          Nexus Copilot can make mistakes. Verify critical strategic decisions.
        </p>
      </div>
    </div>
  )
}
