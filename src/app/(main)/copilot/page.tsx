'use client'

import { useRef, useEffect } from 'react'
import { Send, Sparkles, MessageSquare, Hexagon, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useChat } from 'ai/react'

export default function CopilotPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, append } = useChat({
    api: '/api/copilot',
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  const handleSuggestedPrompt = (prompt: string) => {
    append({ role: 'user', content: prompt })
  }

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
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                
                <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white shadow-md' 
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
            disabled={!input.trim() || isLoading}
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
