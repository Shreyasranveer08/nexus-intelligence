import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getUserProfile } from '@/app/actions'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const user = await getUserProfile()
    if (!user || !user.is_authenticated) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { type = 'market', competitor_id } = await req.json().catch(() => ({}))
    
    const supabase = await createClient()

    // STRICT DATA ISOLATION: Only fetch user's active competitors
    const { data: competitors } = await supabase.from('competitors')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (!competitors || competitors.length === 0) {
      return NextResponse.json({ success: false, message: "No active competitors found to generate a report." }, { status: 400 })
    }

    const compIds = competitors.map((c: any) => c.id)

    // Validate competitor if type is competitor
    if (type === 'competitor' && !competitor_id) {
      return NextResponse.json({ success: false, message: "competitor_id is required for competitor reports." }, { status: 400 })
    }

    // Filter insights based on type and user ownership
    let query = supabase.from('synthesized_insights').select('*').eq('user_id', user.id)
    if (type === 'competitor') {
      query = query.eq('competitor_id', competitor_id)
    } else {
      query = query.in('competitor_id', compIds)
    }

    const { data: insights } = await query

    if (!insights || insights.length === 0) {
      return NextResponse.json({ success: false, message: "No insights available to generate this report." }, { status: 400 })
    }

    const targetCompetitor = type === 'competitor' ? competitors.find((c: any) => c.id === competitor_id) : null

    // Map insights to readable text for the prompt
    const insightsContext = insights.map((insight: any) => {
      const comp = competitors.find((c: any) => c.id === insight.competitor_id)
      return `
COMPETITOR: ${comp?.name || 'Unknown'}
NARRATIVE: ${insight.strategic_narrative || insight.what_changed}
IMPACT SCORE: ${insight.impact_score}/10
CATEGORIES: ${insight.change_categories?.join(', ')}
      `
    }).join('\n---\n')

    let prompt = ''
    if (type === 'market') {
      prompt = `You are a Chief Strategy Officer and Market Intelligence Analyst.
We have collected recent strategic moves exclusively from the competitors tracked in our private workspace.

TRACKED COMPETITORS:
${competitors.map((c: any) => c.name).join(', ')}

RECENT COMPETITOR INSIGHTS:
${insightsContext}

Synthesize these individual insights into a single holistic Market Intelligence Report.
Identify cross-competitor trends, market shifts, risks, and opportunities.

CRITICAL CONSTRAINT: 
You MUST scope your entire analysis ONLY to the competitors listed above. Do NOT mention any other companies, global market trends, or outside examples that are not directly derived from the provided insights. This is a private intelligence workspace, not a global market feed.

Respond ONLY with a valid JSON object matching this schema exactly:
{
  "title": "A strong, executive title for the report",
  "summary": "1-2 paragraph executive summary",
  "markdown_body": "A detailed markdown report including sections: Key Market Shifts, Emerging Trends, Competitor Strategy Comparison, Opportunities, Risks, and Recommended Actions. DO NOT use H1 headers, start with H2 (##) or H3 (###).",
  "structured_data": {
    "trends": [
      {
        "name": "string",
        "impact": "High | Medium | Low"
      }
    ],
    "opportunities": [
      {
        "name": "string",
        "description": "string"
      }
    ],
    "risks": [
      {
        "name": "string",
        "description": "string"
      }
    ],
    "recommendations": [
      {
        "action": "string",
        "priority": "High | Medium | Low"
      }
    ]
  }
}`
    } else {
      prompt = `You are a Competitive Intelligence Analyst focusing exclusively on analyzing ${targetCompetitor?.name}.
We have collected their recent strategic moves and changes.

COMPETITOR: ${targetCompetitor?.name}

RECENT INSIGHTS:
${insightsContext}

Generate a focused Competitor Report analyzing ONLY ${targetCompetitor?.name}.

Respond ONLY with a valid JSON object matching this schema exactly:
{
  "title": "Full Intelligence Report: ${targetCompetitor?.name}",
  "summary": "1-2 paragraph executive summary of their recent moves",
  "markdown_body": "A detailed markdown analysis of their strategy. DO NOT use H1 headers, start with H2 (##) or H3 (###).",
  "structured_data": {
    "trends": [
      {
        "name": "string",
        "impact": "High | Medium | Low"
      }
    ],
    "opportunities": [
      {
        "name": "string",
        "description": "string"
      }
    ],
    "risks": [
      {
        "name": "string",
        "description": "string"
      }
    ],
    "recommendations": [
      {
        "action": "string",
        "priority": "High | Medium | Low"
      }
    ]
  }
}`
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/)
    let rawJson = jsonMatch ? jsonMatch[1] : text
    
    // Find first { and last } if still failing
    const startIdx = rawJson.indexOf('{')
    const endIdx = rawJson.lastIndexOf('}')
    if (startIdx !== -1 && endIdx !== -1) {
      rawJson = rawJson.substring(startIdx, endIdx + 1)
    }

    const parsedData = JSON.parse(rawJson)

    // Snapshot of active competitors
    const competitor_snapshot = type === 'competitor' 
      ? (targetCompetitor ? [{ id: targetCompetitor.id, name: targetCompetitor.name }] : [])
      : competitors.map((c: any) => ({ id: c.id, name: c.name }))

    // REPORT OWNERSHIP: Attach user_id to the generated report
    const { data: newReport, error: insertError } = await supabase.from('intelligence_reports').insert({
      user_id: user.id,
      type: type,
      competitor_id: type === 'competitor' ? competitor_id : null,
      competitor_snapshot,
      title: parsedData.title,
      summary: parsedData.summary,
      markdown_body: parsedData.markdown_body,
      structured_data: parsedData.structured_data,
      generation_source: 'manual'
    }).select().single()

    if (insertError) throw new Error(insertError.message)

    return NextResponse.json({ success: true, report: newReport })
  } catch (err: any) {
    console.error("Failed to generate report:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
