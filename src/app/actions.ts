'use server'

// import { readDB, writeDB, generateId } from '@/lib/db' - Deprecated
import { revalidatePath } from 'next/cache'

export async function addCompetitor(name: string, urls: { url: string, type: string }[], category?: string) {
  const user = await getUserProfile()
  if (!user.is_authenticated) throw new Error('Unauthorized')
  
  const supabase = await createClient()
  
  const { data: competitor, error: compErr } = await supabase.from('competitors').insert({
    user_id: user.id,
    name,
    category: category || 'Uncategorized',
    status: 'active'
  }).select().single()
  
  if (compErr) throw new Error(compErr.message)

  const trackedUrls = urls.map(u => ({
    user_id: user.id,
    competitor_id: competitor.id,
    url: u.url,
    url_type: (u.type || 'homepage').toLowerCase()
  }))

  if (trackedUrls.length > 0) {
    const { error: urlErr } = await supabase.from('tracked_urls').insert(trackedUrls)
    if (urlErr) throw new Error(urlErr.message)
  }

  revalidatePath('/competitors')
  return competitor
}

export async function getCompetitors(statusFilter: 'active' | 'archived' | 'all' = 'active') {
  const user = await getUserProfile()
  if (!user.is_authenticated) return []
  
  const supabase = await createClient()
  
  let query = supabase.from('competitors').select(`
    *,
    tracked_urls (*)
  `).eq('user_id', user.id).order('created_at', { ascending: false })
  
  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }

  const { data, error } = await query
  if (error) {
    console.error("Error fetching competitors:", error.message)
    return []
  }
  
  return data || []
}

export async function archiveCompetitor(id: string) {
  const user = await getUserProfile()
  if (!user.is_authenticated) throw new Error('Unauthorized')
  
  const supabase = await createClient()
  const { error } = await supabase.from('competitors')
    .update({ status: 'archived', archived_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (!error) {
    revalidatePath('/competitors')
    revalidatePath('/reports')
    revalidatePath('/')
  }
}

export async function restoreCompetitor(id: string) {
  const user = await getUserProfile()
  if (!user.is_authenticated) throw new Error('Unauthorized')
  
  const supabase = await createClient()
  const { error } = await supabase.from('competitors')
    .update({ status: 'active', archived_at: null })
    .eq('id', id)
    .eq('user_id', user.id)

  if (!error) {
    revalidatePath('/competitors')
    revalidatePath('/reports')
    revalidatePath('/')
  }
}

// Keeping a true hard delete for safety/cleanup if ever needed
export async function deleteCompetitorHard(id: string) {
  const user = await getUserProfile()
  if (!user.is_authenticated) throw new Error('Unauthorized')
  
  const supabase = await createClient()
  await supabase.from('competitors').delete().eq('id', id).eq('user_id', user.id)
  // Cascade delete handles tracked_urls and synthesized_insights automatically via Postgres FKs
  
  revalidatePath('/competitors')
}

export async function getIntelligenceFeed() {
  const user = await getUserProfile()
  if (!user.is_authenticated) return []
  
  const supabase = await createClient()

  // Fetch active competitors for this user
  const { data: userCompetitors } = await supabase.from('competitors')
    .select('id, name')
    .eq('user_id', user.id)
    .eq('status', 'active')

  if (!userCompetitors || userCompetitors.length === 0) return []
  
  const activeCompIds = userCompetitors.map(c => c.id)

  // Fetch insights belonging to these competitors
  const { data: activeInsights } = await supabase.from('synthesized_insights')
    .select('*')
    .eq('user_id', user.id)
    .in('competitor_id', activeCompIds)
    .order('created_at', { ascending: false })
    .limit(50)

  if (!activeInsights) return []

  const feed = activeInsights.map((insight: any) => {
    const compInfo = userCompetitors.find((c: any) => c.id === insight.competitor_id)
    return {
      ...insight,
      competitors: { name: compInfo!.name }
    }
  })
  
  return feed
}

export async function getReports() {
  const user = await getUserProfile()
  if (!user.is_authenticated) return []
  
  const supabase = await createClient()
  const { data: reports } = await supabase.from('intelligence_reports')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return reports || []
}

export async function getDashboardStats() {
  const user = await getUserProfile()
  if (!user.is_authenticated) return { competitorsCount: 0, urlsCount: 0, highImpactCount: 0, chartData: [] }
  
  const supabase = await createClient()

  const [
    { count: competitorsCount },
    { count: urlsCount },
    { data: userCompetitors }
  ] = await Promise.all([
    supabase.from('competitors').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'active'),
    supabase.from('tracked_urls').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('competitors').select('id').eq('user_id', user.id).eq('status', 'active')
  ])
  
  if (!userCompetitors || userCompetitors.length === 0) {
    return { competitorsCount: competitorsCount || 0, urlsCount: urlsCount || 0, highImpactCount: 0, chartData: [] }
  }

  const compIds = userCompetitors.map(c => c.id)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0,0,0,0)

  const { data: activeInsights } = await supabase.from('synthesized_insights')
    .select('impact_score, created_at')
    .eq('user_id', user.id)
    .in('competitor_id', compIds)
    .gte('created_at', sevenDaysAgo.toISOString())

  const insightsList = activeInsights || []
  const highImpactCount = insightsList.filter((i: any) => i.impact_score >= 8).length
  
  const dayMap = new Map<string, { events: number, impact: number }>()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  for(let i=0; i<7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dayName = days[d.getDay()]
    dayMap.set(dayName, { events: 0, impact: 0 })
  }

  insightsList.forEach((insight: any) => {
    const d = new Date(insight.created_at)
    const dayName = days[d.getDay()]
    if(dayMap.has(dayName)) {
      const current = dayMap.get(dayName)!
      current.events += 1
      current.impact = Math.max(current.impact, (insight.impact_score || 0) * 10)
    }
  })

  const chartData = Array.from(dayMap.entries()).map(([name, data]) => ({
    name,
    ...data
  }))

  return {
    competitorsCount: competitorsCount || 0,
    urlsCount: urlsCount || 0,
    highImpactCount,
    chartData
  }
}

export async function getUserCompany() {
  const user = await getUserProfile();
  if (!user.is_authenticated) return null;
  const supabase = await createClient()
  const { data: company } = await supabase.from('companies').select('*').eq('user_id', user.id).single()
  return company || null;
}

import { createClient } from '@/lib/supabase/server'

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { is_authenticated: false, onboarding_status: 'pending', onboarding_step: 1 };
  }

  // Find user profile in Supabase
  const { data: userProfile } = await supabase.from('users').select('*').eq('id', user.id).single()
  
  if (!userProfile) {
    // This should usually be handled by Supabase Auth Triggers, but fallback here
    const newProfile = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || '',
      onboarding_status: 'pending',
      onboarding_step: 1
    }
    const { data: insertedProfile } = await supabase.from('users').insert(newProfile).select().single()
    return { ...insertedProfile, is_authenticated: true };
  }
  
  return { ...userProfile, is_authenticated: true };
}

export async function signUpUser(name: string, email: string, password: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signInUser(email: string, password: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signOutUser() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
}

export async function signInWithOAuthProvider(provider: 'google' | 'github') {
  const supabase = await createClient()
  
  // Try to use Vercel's provided URL variables, then custom site URL, then localhost
  const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
    return 'http://localhost:3000';
  };

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getBaseUrl()}/auth/callback`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  // data.url contains the redirect URL generated by Supabase
  return data
}

export async function updateOnboardingProgress(step: number, data?: any) {
  const user = await getUserProfile();
  if (!user.is_authenticated) throw new Error('Unauthorized');
  
  const supabase = await createClient();
  
  if (data?.role) {
    await supabase.from('users').update({ role: data.role }).eq('id', user.id);
  }
  
  if (data?.company) {
    // Upsert company
    const { data: existingCompany } = await supabase.from('companies').select('id').eq('user_id', user.id).single();
    if (existingCompany) {
      await supabase.from('companies').update(data.company).eq('id', existingCompany.id);
    } else {
      await supabase.from('companies').insert({ user_id: user.id, ...data.company });
    }
  }
  
  await supabase.from('users').update({ onboarding_step: step }).eq('id', user.id);
  
  revalidatePath('/');
  return { ...user, onboarding_step: step };
}

export async function completeOnboarding() {
  const user = await getUserProfile();
  if (!user.is_authenticated) throw new Error('Unauthorized');
  
  const supabase = await createClient();
  await supabase.from('users').update({ onboarding_status: 'completed' }).eq('id', user.id);
  
  revalidatePath('/');
  return { ...user, onboarding_status: 'completed' };
}

export async function getCommandCenterData() {
  const user = await getUserProfile();
  if (!user.is_authenticated) return null;
  
  const supabase = await createClient()

  const { data: userCompetitors } = await supabase.from('competitors')
    .select('id, name')
    .eq('user_id', user.id)
    .eq('status', 'active')

  if (!userCompetitors || userCompetitors.length === 0) return null;
  const compIds = userCompetitors.map(c => c.id)

  const [
    { data: activeInsights },
    { data: userReports }
  ] = await Promise.all([
    supabase.from('synthesized_insights').select('*').eq('user_id', user.id).in('competitor_id', compIds).order('created_at', { ascending: false }),
    supabase.from('intelligence_reports').select('id, title, type, created_at').eq('user_id', user.id).order('created_at', { ascending: false })
  ])

  const insightsList = activeInsights || []

  // 1. Executive Briefing
  const highImpact = insightsList.filter((i: any) => i.impact_score >= 7);
  const biggestThreat = highImpact.length > 0 ? highImpact[0] : insightsList[0];
  const biggestOpportunity = highImpact.length > 1 ? highImpact[1] : insightsList[1];
  
  const activityMap = new Map();
  insightsList.forEach((i: any) => {
    activityMap.set(i.competitor_id, (activityMap.get(i.competitor_id) || 0) + 1);
  });
  
  let mostActiveCompId: string | null = null;
  let maxActivity = 0;
  activityMap.forEach((count, id) => {
    if (count > maxActivity) { maxActivity = count; mostActiveCompId = id; }
  });

  const priorityActionInsight = highImpact.find((i: any) => i.recommended_action) || insightsList[0];

  const executiveBriefing = {
    biggestThreat: biggestThreat ? {
      headline: biggestThreat.strategic_narrative || biggestThreat.what_changed || 'No critical threats detected.',
      explanation: biggestThreat.why_it_matters || 'Keep monitoring competitors.',
      impact: biggestThreat.impact_score >= 8 ? 'Critical' : 'High'
    } : null,
    biggestOpportunity: biggestOpportunity ? {
      headline: biggestOpportunity.strategic_narrative || biggestOpportunity.what_changed || 'No opportunities detected.',
      explanation: biggestOpportunity.why_it_matters || '',
      impact: (biggestOpportunity.impact_score || 0) >= 8 ? 'High' : 'Medium'
    } : null,
    mostActive: mostActiveCompId ? {
      headline: `${userCompetitors.find((c: any) => c.id === mostActiveCompId)?.name} is highly active.`,
      explanation: `${maxActivity} signals detected recently.`,
      impact: 'Medium'
    } : null,
    priorityAction: priorityActionInsight ? {
      id: priorityActionInsight.id,
      headline: priorityActionInsight.recommended_action || 'Review recent intelligence.',
      explanation: priorityActionInsight.why_it_matters || '',
      impact: (priorityActionInsight.impact_score || 0) >= 8 ? 'Critical' : 'High'
    } : null
  };

  // 2. Live Feed
  const liveFeed = insightsList.slice(0, 10).map((insight: any) => ({
    id: insight.id,
    competitor: userCompetitors.find((c: any) => c.id === insight.competitor_id)?.name || 'Unknown',
    time: new Date(insight.created_at).toLocaleDateString(),
    whatChanged: insight.what_changed || insight.strategic_narrative,
    whyItMatters: insight.why_it_matters,
    recommendedAction: insight.recommended_action,
    impact: insight.impact_score >= 8 ? 'critical' : (insight.impact_score >= 5 ? 'high' : 'medium')
  }));

  // 3. Competitor Radar
  const competitorRadar = userCompetitors.map((comp: any) => {
    const compInsights = insightsList.filter((i: any) => i.competitor_id === comp.id);
    const score = compInsights.reduce((sum: number, i: any) => sum + (i.impact_score || 0), 0);
    const latest = compInsights[0];
    return {
      name: comp.name,
      threatLevel: score > 20 ? 'Critical' : (score > 10 ? 'High' : (score > 0 ? 'Medium' : 'Low')),
      activityScore: Math.min(score * 10, 100) || 10,
      lastChange: latest ? latest.change_categories?.[0] || 'Unknown' : 'None recently',
      lastSeen: latest ? new Date(latest.created_at).toLocaleDateString() : 'Never',
      recommendedResponse: latest?.recommended_action || 'Monitor closely'
    };
  }).sort((a: any, b: any) => b.activityScore - a.activityScore);

  // 4. Action Center
  const actionCenter = insightsList
    .filter((i: any) => i.recommended_action)
    .slice(0, 5)
    .map((insight: any, idx: number) => ({
      id: insight.id || `ac${idx}`,
      priority: insight.impact_score >= 8 ? 'Critical' : (insight.impact_score >= 5 ? 'High' : 'Medium'),
      sourceCompetitor: userCompetitors.find((c: any) => c.id === insight.competitor_id)?.name || 'Unknown',
      recommendedMove: insight.recommended_action,
      status: 'Open'
    }));

  // 5. Weekly Intelligence (from reports)
  const reportsList = userReports || []

  const competitorReports = reportsList
    .filter((r: any) => r.type === 'competitor')
    .slice(0, 3)
    .map((r: any) => ({ id: r.id, name: r.title, date: new Date(r.created_at).toLocaleDateString() }));

  const marketReports = reportsList
    .filter((r: any) => r.type === 'market' || !r.type)
    .slice(0, 3)
    .map((r: any) => ({ id: r.id, name: r.title, date: new Date(r.created_at).toLocaleDateString() }));

  return {
    executiveBriefing,
    liveFeed,
    competitorRadar,
    actionCenter,
    weeklyIntelligence: { competitorReports, marketReports }
  };
}

export async function getExecutionPlans() {
  const user = await getUserProfile()
  if (!user.is_authenticated) return []
  
  const supabase = await createClient()
  const { data: plans } = await supabase.from('execution_plans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return plans || []
}

export async function getExecutionPlan(id: string) {
  const user = await getUserProfile()
  if (!user.is_authenticated) return null
  
  const supabase = await createClient()
  const { data: plan } = await supabase.from('execution_plans')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  return plan || null
}

export async function generateExecutionPlan(actionId: string, title: string, description: string) {
  const user = await getUserProfile()
  if (!user.is_authenticated) throw new Error('Unauthorized')
  
  const supabase = await createClient()

  // Check if we already generated a plan for this action to avoid duplicates
  const { data: existing } = await supabase.from('execution_plans')
    .select('id')
    .eq('source_action_id', actionId)
    .eq('user_id', user.id)
    .single()

  if (existing) return existing.id

  // Simulate LLM strategic thinking delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  const generatedMarkdown = `
## 1. Objective
Counter competitor's aggressive Q3 push into AI workflows by repositioning our SMB offerings to highlight superior, native AI capabilities that do not require enterprise-level budgets or complex setups.

## 2. Why This Matters
Competitors are heavily targeting our core demographic (SMBs). Their new messaging directly overlaps with our unique value proposition. If left unaddressed, we risk a significant increase in churn and a drop in Q3 acquisition as prospects evaluate built-in AI alternatives.

## 3. Recommended Actions

### Marketing & Positioning
*   **Update Homepage Hero:** Shift messaging from "Powerful Workflows" to "AI-Native Workflows for Teams."
*   **Create Comparison Landing Page:** Publish a direct vs Competitor page focusing specifically on AI setup time and total cost of ownership.
*   **Email Campaign:** Launch a targeted campaign to at-risk SMB cohorts highlighting our proprietary AI features.

### Product & Engineering
*   **Feature Flag Toggle:** Accelerate the rollout of the "One-Click AI Setup" wizard to all active SMB accounts.
*   **In-App Tooltips:** Deploy a series of guided tours showcasing existing AI features that users might not be leveraging.


## 4. Expected Impact
*   **Retention:** Prevent an estimated 12% churn risk in the core SMB tier over the next 90 days.
*   **Acquisition:** Increase demo requests from SMBs evaluating competitors by 25%.

## 5. Success Metrics
*   Traffic volume to the new comparison landing page (>5,000 unique visitors in 30 days).
*   Engagement rate on the "One-Click AI Setup" wizard (>40% completion rate).
*   Win rate against competitors in active sales deals (Target: >60%).

## 6. Priority Level
**Critical** - Requires immediate cross-functional alignment between Marketing and Product teams before the end of the current quarter.
`;

  const { data: newPlan, error } = await supabase.from('execution_plans').insert({
    user_id: user.id,
    source_action_id: actionId,
    title: `Execution Plan: ${title}`,
    description: description,
    content: generatedMarkdown.trim(),
    status: 'Not Started',
    priority: 'Critical'
  }).select('id').single()

  if (error) throw new Error(error.message)

  revalidatePath('/reports')
  return newPlan.id
}

export async function analyzeWebsite(url: string) {
  // Extract domain name for the mock to feel personalized
  let domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
  let name = domain.charAt(0).toUpperCase() + domain.slice(1).split('.')[0];

  // In production, this would call a scraping service + LLM.
  // We simulate intelligence extraction delay here.
  // Wait is handled by the UI for the "intelligence steps" feeling.
  
  return {
    overview: {
      name: name,
      website: `https://${domain}`,
      industry: 'B2B Technology',
      productCategory: 'Enterprise Software',
      targetAudience: 'Mid-market to Enterprise IT leaders'
    },
    positioning: {
      valueProposition: `The unified platform that connects strategy to execution for modern teams.`,
      coreMessaging: 'Efficiency, Security, and Seamless Integration',
      marketPositioning: 'Premium enterprise alternative to fragmented point solutions.'
    },
    features: [
      { category: 'Workflow Automation', points: ['Visual drag-and-drop builder', 'Multi-step conditional logic', '100+ native integrations'] },
      { category: 'Data & Analytics', points: ['Real-time executive dashboards', 'Custom report builder', 'Predictive intelligence'] },
      { category: 'Enterprise Security', points: ['SOC2 Type II compliance', 'Granular RBAC', 'Audit logging'] }
    ],
    business: {
      pricingModel: 'Freemium with Usage-based Enterprise tiers',
      estimatedSegment: 'B2B, 100-5000 employees',
      competitiveAdvantages: ['Proprietary AI engine', 'Deep native integrations', 'Zero-setup deployment']
    },
    marketIntelligence: {
      suggestedCompetitors: ['Asana', 'Monday.com', 'ClickUp'],
      swot: {
        strengths: ['Strong enterprise compliance', 'Intuitive UI/UX'],
        weaknesses: ['Higher entry price point', 'Steep learning curve for advanced features'],
        opportunities: ['Expansion into SMB market with lite version', 'AI workflow generation'],
        threats: ['New AI-native startups', 'Aggressive pricing from legacy incumbents']
      }
    }
  };
}

export async function suggestRealCompetitors(companyName: string, industry: string) {
  try {
    const { generateWithFallback } = await import('@/lib/llmFallback');
    const prompt = `You are an expert business analyst. Suggest 3 well-known real-world competitors for a company named "${companyName}" operating in the "${industry}" industry.
Return ONLY a valid JSON array of objects, where each object has "name" and "url" properties. Provide the main homepage URL.
Do not include any markdown formatting, backticks, or extra text. Just the raw JSON array.
Example: [{"name":"Google","url":"https://google.com"},{"name":"Microsoft","url":"https://microsoft.com"}]`;

    const { text } = await generateWithFallback('gemini-2.5-flash', prompt);
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const suggestions = JSON.parse(cleanedText);
    if (Array.isArray(suggestions)) {
      return suggestions.slice(0, 3);
    }
    return [];
  } catch (error) {
    console.error("Failed to suggest competitors:", error);
    return [];
  }
}

export async function deleteUserAccount() {
  const user = await getUserProfile();
  if (!user.is_authenticated || !user.id) throw new Error('Unauthorized');

  const { createClient } = await import('@supabase/supabase-js');
  // Use Service Role Key to bypass RLS and delete the user from auth.users
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error('Failed to delete user account:', error);
    throw new Error('Failed to delete user account');
  }

  // Next.js will handle the client-side redirect in the UI when the session is lost, 
  // or the client component can sign them out explicitly.
  return { success: true };
}

export async function getRecentNotifications() {
  const user = await getUserProfile();
  if (!user.is_authenticated || !user.id) return [];

  const supabase = await createClient();
  const { data: insights } = await supabase
    .from('synthesized_insights')
    .select('id, what_changed, why_it_matters, created_at, impact_score')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (!insights || insights.length === 0) return [];

  return insights.map((insight: any) => {
    let type = 'info';
    if (insight.impact_score >= 8) type = 'alert';
    else if (insight.impact_score >= 5) type = 'report';

    return {
      id: insight.id,
      type,
      title: insight.what_changed,
      message: insight.why_it_matters,
      time: new Date(insight.created_at).toLocaleDateString(),
      read: false
    };
  });
}
