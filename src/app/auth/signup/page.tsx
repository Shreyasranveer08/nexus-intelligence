'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Hexagon, Loader2, ArrowRight } from 'lucide-react'
import { signUpUser, signInWithOAuthProvider } from '@/app/actions'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)

  const handleOAuth = async (provider: 'google' | 'github') => {
    setOauthLoading(provider)
    try {
      const data = await signInWithOAuthProvider(provider)
      if (data.url) {
        router.push(data.url)
      }
    } catch (e: any) {
      console.error(e)
      toast.error(e.message || `Failed to sign up with ${provider}`)
      setOauthLoading(null)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) return
    
    setIsLoading(true)
    try {
      await signUpUser(name, email, password)
      toast.success("Account created successfully!")
      router.push('/welcome')
    } catch (e: any) {
      console.error(e)
      toast.error(e.message || "Failed to create account")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto relative z-10 flex flex-col justify-center">
      <Link href="/welcome" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors mb-8 group w-fit">
        <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
        Back to Welcome
      </Link>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-10">
          <Hexagon className="w-6 h-6 text-blue-500" />
          <span className="font-semibold text-lg tracking-tight text-slate-200">NexusIntel</span>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">Create an account</h1>
        <p className="text-sm text-slate-400">Start monitoring your competitive landscape.</p>
      </div>

      <div className="flex gap-3 mb-8">
        <button 
          type="button" 
          onClick={() => handleOAuth('google')}
          disabled={oauthLoading !== null}
          className="flex-1 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-slate-300 text-sm font-medium py-2.5 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
        >
          {oauthLoading === 'google' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          )}
          Google
        </button>
        <button 
          type="button" 
          onClick={() => handleOAuth('github')}
          disabled={oauthLoading !== null}
          className="flex-1 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-slate-300 text-sm font-medium py-2.5 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
        >
          {oauthLoading === 'github' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (
            <svg className="w-4 h-4 mr-2 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          )}
          GitHub
        </button>
      </div>

      <div className="relative flex items-center py-2 mb-6">
        <div className="flex-grow border-t border-white/5"></div>
        <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase tracking-wider">Or continue with email</span>
        <div className="flex-grow border-t border-white/5"></div>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-white/10 rounded-md bg-transparent text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-white/10 rounded-md bg-transparent text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-white/10 rounded-md bg-transparent text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            placeholder="••••••••"
            minLength={8}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-white text-black hover:bg-slate-200 font-medium text-sm py-2.5 rounded-md shadow-[inset_0_-1px_0_rgba(0,0,0,0.1)] flex items-center justify-center transition-all disabled:opacity-75 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-slate-500">
        Already have an account? <Link href="/auth/login" className="font-medium text-slate-300 hover:text-white transition-colors">Sign in</Link>
      </p>
    </div>
  )
}
