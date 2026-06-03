import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/app/actions'

export const dynamic = 'force-dynamic'

function escapeCsv(str: string | number | undefined | null) {
  if (str === undefined || str === null) return '""'
  const stringified = String(str)
  if (stringified.includes(',') || stringified.includes('"') || stringified.includes('\n')) {
    return `"${stringified.replace(/"/g, '""')}"`
  }
  return stringified
}

export async function GET(req: Request) {
  try {
    const user = await getUserProfile()
    if (!user || !user.is_authenticated) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const supabase = await createClient()
    
    // Fetch user's active competitors
    const { data: userCompetitors } = await supabase.from('competitors')
      .select('id, name')
      .eq('user_id', user.id)
      .eq('status', 'active')
    
    if (!userCompetitors || userCompetitors.length === 0) {
      return new NextResponse("No data available", { status: 404 })
    }

    const activeCompIds = userCompetitors.map(c => c.id)

    // Fetch insights for these competitors
    const { data: activeInsights } = await supabase.from('synthesized_insights')
      .select('*')
      .eq('user_id', user.id)
      .in('competitor_id', activeCompIds)
      .order('created_at', { ascending: false })

    if (!activeInsights || activeInsights.length === 0) {
      return new NextResponse("No data available", { status: 404 })
    }

    const feed = activeInsights.map((insight: any) => {
      const compInfo = userCompetitors.find((c: any) => c.id === insight.competitor_id)
      return {
        ...insight,
        competitor_name: compInfo!.name
      }
    })

    const headers = [
      'Date',
      'Competitor',
      'Strategic Narrative',
      'Impact Score',
      'Confidence Score',
      'Categories',
      'Recommended Monitoring',
      'Affected URLs'
    ]

    const csvRows = [headers.join(',')]

    for (const item of feed) {
      const row = [
        new Date(item.created_at).toISOString().split('T')[0],
        item.competitor_name,
        item.strategic_narrative,
        item.impact_score,
        item.confidence_score,
        (item.change_categories || []).join('; '),
        item.recommended_monitoring_areas,
        (item.affected_urls || []).join('; ')
      ]
      csvRows.push(row.map(escapeCsv).join(','))
    }

    const csvContent = csvRows.join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="nexus_intelligence_feed.csv"',
      },
    })
  } catch (err: any) {
    console.error("Failed to export CSV:", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
