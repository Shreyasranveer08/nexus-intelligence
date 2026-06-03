import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function GET(req: Request) {
  try {
    // Authenticate CRON securely, verify via header in a real setup.
    // For now, use the service role client to fetch all data for all users.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, message: "Missing Supabase admin credentials" }, { status: 500 })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

    const { data: activeCompetitors, error: compErr } = await supabaseAdmin.from('competitors')
      .select('*')
      .eq('status', 'active')

    if (compErr) throw new Error(compErr.message)

    // Get unique user IDs who have active competitors
    const userIds = Array.from(new Set((activeCompetitors || []).map((c: any) => c.user_id).filter(Boolean)))

    const generatedReports = []

    for (const userId of userIds) {
      const userCompetitors = activeCompetitors!.filter((c: any) => c.user_id === userId)
      const compIds = userCompetitors.map((c: any) => c.id)

      // Weekly reports only look at the last 7 days
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { data: insights, error: insightErr } = await supabaseAdmin.from('synthesized_insights')
        .select('*')
        .eq('user_id', userId as string)
        .in('competitor_id', compIds)
        .gte('created_at', sevenDaysAgo.toISOString())

      if (insightErr) throw new Error(insightErr.message)

      if (!insights || insights.length === 0) continue;

      // Map insights to readable text for the prompt
      const insightsContext = insights.map((insight: any) => {
        const comp = userCompetitors.find((c: any) => c.id === insight.competitor_id)
        return `
COMPETITOR: ${comp?.name || 'Unknown'}
WHAT CHANGED: ${insight.what_changed || insight.strategic_narrative}
WHY IT MATTERS: ${insight.why_it_matters}
RECOMMENDED ACTION: ${insight.recommended_action}
IMPACT SCORE: ${insight.impact_score}/10
CATEGORIES: ${insight.change_categories?.join(', ')}
        `
      }).join('\n---\n')

      const prompt = `You are a Chief Strategy Officer and Market Intelligence Analyst.
We have collected recent strategic moves from the last 7 days exclusively from the competitors tracked in our private workspace.

TRACKED COMPETITORS:
${userCompetitors.map((c: any) => c.name).join(', ')}

RECENT COMPETITOR INSIGHTS:
${insightsContext}

Synthesize these individual insights into a single holistic Market Intelligence Report.
Identify cross-competitor trends, market shifts, risks, and opportunities.

CRITICAL CONSTRAINT: 
You MUST scope your entire analysis ONLY to the competitors listed above. Do NOT mention any other companies, global market trends, or outside examples that are not directly derived from the provided insights. This is a private intelligence workspace.

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

      const { generateWithFallback, QuotaExhaustedError } = await import('@/lib/llmFallback');
      
      let parsedData;
      try {
        const { text } = await generateWithFallback("gemini-2.5-flash", prompt);
        const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
        let rawJson = jsonMatch ? jsonMatch[1] : text;
        const startIdx = rawJson.indexOf('{');
        const endIdx = rawJson.lastIndexOf('}');
        if (startIdx !== -1 && endIdx !== -1) {
          rawJson = rawJson.substring(startIdx, endIdx + 1);
        }
        parsedData = JSON.parse(rawJson);
      } catch (error: any) {
        if (error.name === "QuotaExhaustedError") {
          console.error("Quota exhausted during report generation. Queueing pending_llm_job...");
          
          await supabaseAdmin.from('pending_llm_jobs').insert({
            user_id: userId as string,
            competitor_id: null,
            tracked_url_id: null,
            prompt_type: 'report',
            payload: { prompt }
          });
          return NextResponse.json({ success: false, error: "QuotaExhaustedError - saved to pending_llm_jobs" });
        } else {
          throw error;
        }
      }

      const competitor_snapshot = userCompetitors.map((c: any) => ({ id: c.id, name: c.name }))

      const { data: newReport, error: insertError } = await supabaseAdmin.from('intelligence_reports').insert({
        user_id: userId as string,
        type: 'market',
        competitor_snapshot,
        title: parsedData.title,
        summary: parsedData.summary,
        markdown_body: parsedData.markdown_body,
        structured_data: parsedData.structured_data,
        start_date: sevenDaysAgo.toISOString(),
        end_date: new Date().toISOString(),
        generation_source: 'scheduled'
      }).select().single()

      if (insertError) throw new Error(insertError.message)

      generatedReports.push(newReport)
    }

    if (generatedReports.length > 0) {
      return NextResponse.json({ success: true, count: generatedReports.length, reports: generatedReports })
    } else {
      return NextResponse.json({ success: true, message: "No recent insights to report on for any users." })
    }

  } catch (err: any) {
    console.error("Failed to generate weekly reports:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
