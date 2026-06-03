import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Auth Check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // 1. Gather Context
    // Fetch last 30 days of insights
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [
      { data: insights },
      { data: competitors },
      { data: plans },
      { data: reports }
    ] = await Promise.all([
      supabase.from('synthesized_insights').select('what_changed, why_it_matters, recommended_action, created_at').eq('user_id', user.id).gte('created_at', thirtyDaysAgo.toISOString()).order('created_at', { ascending: false }).limit(20),
      supabase.from('competitors').select('name, industry').eq('user_id', user.id),
      supabase.from('execution_plans').select('title, status, priority, content').eq('user_id', user.id).limit(10),
      supabase.from('intelligence_reports').select('title, summary, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
    ]);

    const systemInstruction = `You are NexusIntel Copilot, an elite strategic intelligence advisor. 
You are speaking directly to the founder/executive. Use a sharp, professional, and highly actionable tone.
Do not use generic fluff. Dive straight into strategic insights based ONLY on the user's data provided below.

=== YOUR KNOWLEDGE BASE ===

[COMPETITORS BEING TRACKED]
${competitors?.map((c: any) => `- ${c.name} (${c.industry})`).join('\n') || 'None yet'}

[RECENT SYNTHESIZED INSIGHTS (Last 30 days)]
${insights?.map((i: any) => `Date: ${new Date(i.created_at).toLocaleDateString()}
Change: ${i.what_changed}
Impact: ${i.why_it_matters}
Recommended Action: ${i.recommended_action || 'None'}
`).join('\n') || 'No recent insights.'}

[RECENT REPORTS]
${reports?.map((r: any) => `- ${r.title} (${new Date(r.created_at).toLocaleDateString()}): ${r.summary}`).join('\n') || 'No recent reports.'}

[ONGOING EXECUTION PLANS]
${plans?.map((p: any) => `- ${p.title} (Status: ${p.status}, Priority: ${p.priority})`).join('\n') || 'No active execution plans.'}

===========================

Your goal is to answer the user's queries accurately using the data above. If a user asks a question that requires external knowledge about a tracked competitor, you can synthesize your general knowledge with the specific insights provided. If asked to summarize, provide clean, structured markdown.`;

    // 2. Setup Gemini Chat
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction
    });

    // Format history for Gemini SDK
    // Next.js client will send { role: 'user' | 'model', parts: [{ text: '...' }] } or simple { role, content }
    // Let's assume the standard { role: 'user' | 'assistant', content: string } format from the UI
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    
    const latestMessage = messages[messages.length - 1].content;

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(latestMessage);

    // 3. Stream Response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(new TextEncoder().encode(chunkText));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      }
    });

  } catch (error: any) {
    console.error('Copilot Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
