'use client'

import { useState, useEffect } from 'react'
import { Save, Building2, Globe, LayoutList, Target, DollarSign, Crosshair, Sparkles, User, Mail, Briefcase, Bell, Clock, BriefcaseBusiness, ListTree, Lightbulb, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'user' | 'company'>('user')
  
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: '',
    notification_preferences: 'email',
    timezone: 'UTC',
    appearance: 'system'
  })

  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    website: '',
    product_description: '',
    key_features: '',
    target_audience: '',
    pricing: '',
    positioning_statement: '',
    industry: '',
    company_stage: '',
    primary_competitor_category: '',
    strategic_goals: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserFormData({
            name: data.user.name || '',
            email: data.user.email || '',
            role: data.user.role || '',
            notification_preferences: data.user.notification_preferences || 'email',
            timezone: data.user.timezone || 'UTC',
            appearance: data.user.appearance || 'system'
          })
        }
        if (data.company) {
          setCompanyFormData({
            name: data.company.name || '',
            website: data.company.website || '',
            product_description: data.company.product_description || '',
            key_features: (data.company.key_features || []).join(', '),
            target_audience: data.company.target_audience || '',
            pricing: data.company.pricing || '',
            positioning_statement: data.company.positioning_statement || '',
            industry: data.company.industry || '',
            company_stage: data.company.company_stage || '',
            primary_competitor_category: data.company.primary_competitor_category || '',
            strategic_goals: data.company.strategic_goals || ''
          })
        }
        setLoading(false)
      })
  }, [])

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'appearance') {
      setTheme(e.target.value)
    }
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value })
  }

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCompanyFormData({ ...companyFormData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const payload = {
        user: userFormData,
        company: {
          ...companyFormData,
          key_features: companyFormData.key_features.split(',').map(f => f.trim()).filter(Boolean)
        }
      }
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setMessage('Profiles saved successfully.')
      } else {
        setMessage('Failed to save profiles.')
      }
    } catch (err) {
      setMessage('An error occurred while saving.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return null;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your account and configure your company's strategic intelligence profile.</p>
      </div>

      <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-white/10 pb-px">
        <button
          onClick={() => { setActiveTab('user'); setMessage('') }}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'user' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'}`}
        >
          <User className="w-4 h-4" /> User Profile
        </button>
        <button
          onClick={() => { setActiveTab('company'); setMessage('') }}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'company' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'}`}
        >
          <Building2 className="w-4 h-4" /> Company Profile
        </button>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm dark:shadow-2xl transition-colors">
        {activeTab === 'user' ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Account Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <User className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Full Name
                </label>
                <input type="text" name="name" value={userFormData.name} onChange={handleUserChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Mail className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Email
                </label>
                <input type="email" name="email" value={userFormData.email} onChange={handleUserChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. jane@acme.com" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Briefcase className="w-4 h-4 text-purple-500 dark:text-purple-400" /> Role
                </label>
                <input type="text" name="role" value={userFormData.role} onChange={handleUserChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. Founder, CMO" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Timezone
                </label>
                <select name="timezone" value={userFormData.timezone} onChange={handleUserChange} className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Bell className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Notification Preferences
                </label>
                <select name="notification_preferences" value={userFormData.notification_preferences} onChange={handleUserChange} className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                  <option value="email">Email</option>
                  <option value="push">Push Notifications</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Monitor className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Appearance
                </label>
                <select name="appearance" value={theme || 'system'} suppressHydrationWarning onChange={handleUserChange} className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                  <option value="system">System Default</option>
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-red-100 dark:border-red-900/30">
              <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
              <button 
                onClick={async () => {
                  if(confirm('Are you absolutely sure you want to delete your account? All your data will be permanently lost.')) {
                    try {
                      const { deleteUserAccount } = await import('@/app/actions');
                      const { createClient } = await import('@/lib/supabase/client');
                      await deleteUserAccount();
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      window.location.href = '/auth/login';
                    } catch (e) {
                      setMessage('Failed to delete account.');
                    }
                  }
                }}
                className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Strategic Intelligence Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Building2 className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Company Name
                </label>
                <input type="text" name="name" value={companyFormData.name} onChange={handleCompanyChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Globe className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Website
                </label>
                <input type="text" name="website" value={companyFormData.website} onChange={handleCompanyChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. acme.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <BriefcaseBusiness className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Industry
                </label>
                <input type="text" name="industry" value={companyFormData.industry} onChange={handleCompanyChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. B2B SaaS, E-commerce" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <ListTree className="w-4 h-4 text-purple-500 dark:text-purple-400" /> Company Stage
                </label>
                <select name="company_stage" value={companyFormData.company_stage} onChange={handleCompanyChange} className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                  <option value="">Select Stage...</option>
                  <option value="Startup">Startup</option>
                  <option value="Growth">Growth</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <LayoutList className="w-4 h-4 text-rose-500 dark:text-rose-400" /> Product Description
              </label>
              <textarea name="product_description" value={companyFormData.product_description} onChange={handleCompanyChange} rows={3} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="What does your product do?"></textarea>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Positioning Statement (Optional)
              </label>
              <textarea name="positioning_statement" value={companyFormData.positioning_statement} onChange={handleCompanyChange} rows={2} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="How do you differentiate from competitors?"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Target className="w-4 h-4 text-purple-500 dark:text-purple-400" /> Target Audience
                </label>
                <input type="text" name="target_audience" value={companyFormData.target_audience} onChange={handleCompanyChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. Enterprise marketing teams" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <DollarSign className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Pricing Model
                </label>
                <input type="text" name="pricing" value={companyFormData.pricing} onChange={handleCompanyChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. Freemium, B2B Enterprise" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Key Features (comma separated)
              </label>
              <input type="text" name="key_features" value={companyFormData.key_features} onChange={handleCompanyChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. AI summarization, Webhook integrations" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Crosshair className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Primary Competitor Category
                </label>
                <input type="text" name="primary_competitor_category" value={companyFormData.primary_competitor_category} onChange={handleCompanyChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. CRM, Project Management" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Target className="w-4 h-4 text-rose-500 dark:text-rose-400" /> Strategic Goals
                </label>
                <input type="text" name="strategic_goals" value={companyFormData.strategic_goals} onChange={handleCompanyChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. Expand into mid-market" />
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
          <p className="text-sm text-slate-500">{message}</p>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  )
}
