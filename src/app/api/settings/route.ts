import { NextResponse } from 'next/server'
import { getUserProfile } from '@/app/actions'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await getUserProfile()
    if (!user || !user.is_authenticated) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    
    const [userRes, companyRes] = await Promise.all([
      supabase.from('users').select('*').eq('id', user.id).single(),
      supabase.from('companies').select('*').eq('user_id', user.id).single()
    ])

    return NextResponse.json({ 
      success: true, 
      user: userRes.data || null,
      company: companyRes.data || null 
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserProfile()
    if (!user || !user.is_authenticated) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const supabase = await createClient()
    
    let updatedUser = null
    let updatedCompany = null

    if (data.user) {
      const { data: u, error: uErr } = await supabase.from('users').upsert({
        id: user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        notification_preferences: data.user.notification_preferences,
        timezone: data.user.timezone,
        appearance: data.user.appearance,
        updated_at: new Date().toISOString()
      }).select().single()
      
      if (uErr) throw new Error(uErr.message)
      updatedUser = u
    }

    if (data.company) {
      const { data: c, error: cErr } = await supabase.from('companies').upsert({
        user_id: user.id,
        name: data.company.name,
        website: data.company.website,
        product_description: data.company.product_description,
        key_features: data.company.key_features,
        target_audience: data.company.target_audience,
        pricing: data.company.pricing,
        positioning_statement: data.company.positioning_statement,
        industry: data.company.industry,
        company_stage: data.company.company_stage,
        primary_competitor_category: data.company.primary_competitor_category,
        strategic_goals: data.company.strategic_goals,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' }).select().single()
      
      if (cErr) throw new Error(cErr.message)
      updatedCompany = c
    }

    return NextResponse.json({ success: true, user: updatedUser, company: updatedCompany })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
