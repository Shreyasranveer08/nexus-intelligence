'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addCompetitor } from '@/app/actions'
import { Plus, X, ArrowLeft, Loader2, Building2 } from 'lucide-react'
import Link from 'next/link'

type UrlEntry = { url: string; type: string }

export default function NewCompetitorPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [urls, setUrls] = useState<UrlEntry[]>([{ url: '', type: 'homepage' }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const urlTypes = ['homepage', 'pricing', 'features', 'blog', 'changelog']

  const handleAddUrl = () => {
    setUrls([...urls, { url: '', type: 'pricing' }])
  }

  const handleRemoveUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index))
  }

  const handleUrlChange = (index: number, field: keyof UrlEntry, value: string) => {
    const newUrls = [...urls]
    newUrls[index][field] = value
    setUrls(newUrls)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || urls.some(u => !u.url.trim())) {
      setError('Please fill in all fields with valid URLs.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await addCompetitor(name, urls, category)
      router.push('/competitors')
    } catch (err: any) {
      setError(err.message || 'Failed to add competitor to the database.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="mb-8">
        <Link href="/competitors" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6 bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-white/5">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Competitors
        </Link>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Add New Competitor</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Configure a new company to track in the intelligence engine.</p>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-white/10 p-8 shadow-sm dark:shadow-2xl">
        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm flex items-start">
            <div className="mt-0.5 mr-3 w-4 h-4 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">!</div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                <Building2 className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
                Company Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
                placeholder="e.g. Acme Corp"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                <span className="w-4 h-4 mr-2 flex items-center justify-center text-slate-400 dark:text-slate-500">🏷️</span>
                Category / Industry
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
                placeholder="e.g. Project Management"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-white/5 pt-8">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">URLs to Monitor</label>
              <span className="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">{urls.length} target(s)</span>
            </div>
            
            <div className="space-y-4">
              {urls.map((url, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={url.url}
                      onChange={(e) => handleUrlChange(index, 'url', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <div className="w-40 relative">
                    <select
                      value={url.type}
                      onChange={(e) => handleUrlChange(index, 'type', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-slate-700 dark:text-slate-300 appearance-none cursor-pointer"
                    >
                      {urlTypes.map(type => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(index)}
                      className="p-2.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Remove URL"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddUrl}
              className="mt-4 flex items-center px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white rounded-md transition-colors border border-slate-200 dark:border-white/5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add another URL
            </button>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-blue-600 text-white dark:bg-white dark:text-black px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-slate-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white dark:text-slate-600" />
                  Saving...
                </>
              ) : (
                'Save Competitor'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
