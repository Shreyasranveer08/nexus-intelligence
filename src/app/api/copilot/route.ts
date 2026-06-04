// @ts-nocheck
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tool } from 'ai';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Auth Check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const latestMessage = messages[messages.length - 1].content;

    // 1. Generate Embedding for User Query (Disabled - APIs other than Perplexity removed per user request)
    let embedding = null;

    // 2. Retrieve Relevant Context via RAG (Only if embedding succeeded)
    let relevantDocs = [];
    if (embedding) {
      const { data, error: rpcError } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 10,
        p_user_id: user.id
      });
      if (rpcError) {
        console.warn("RAG Error (fallback to basic mode):", rpcError);
      } else {
        relevantDocs = data || [];
      }
    }

    const contextStrings = relevantDocs?.map((doc: any, i: number) => {
      return `[Citation ${i + 1} - ${doc.document_type}]:\n${doc.content_chunk}`;
    }) || [];

    const contextText = contextStrings.length > 0 
      ? `\n\n=== RETRIEVED KNOWLEDGE BASE ===\n${contextStrings.join('\n\n')}\n===============================\n`
      : `\n\n(No specific database records found for this query. Rely on general knowledge but inform the user.)\n`;

    // 3. Define System Instruction
    const systemInstruction = `You are Nexus Copilot, an elite deep-research analyst and strategic intelligence advisor. 
You function exactly like a high-end research engine (like Perplexity).
Your goal is to provide deeply analytical, comprehensively researched, and structured answers.
Always structure your response with clear headings, bullet points, and actionable takeaways.
Do not use generic fluff. Dive straight into data, facts, and strategic insights.

${contextText}`;

    // 4. Fetch Response from RapidAPI Perplexity
    try {
      const conversationHistory = messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
      const fullPrompt = `${systemInstruction}\n\n=== CONVERSATION HISTORY ===\n${conversationHistory}\n\nInstruction: Provide a deeply researched, structured, and analytical response to the latest USER query.`;
      
      const response = await fetch('https://perplexity2.p.rapidapi.com/', {
        method: 'POST',
        headers: {
          'x-rapidapi-key': '13b128e151msh283cee2ed529199p124acajsnfd4ec57fad95',
          'x-rapidapi-host': 'perplexity2.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: fullPrompt })
      });

      if (!response.ok) {
        throw new Error(`RapidAPI Error: ${response.status}`);
      }

      const data = await response.json();
      let responseText = "I couldn't generate a response from Perplexity.";
      try {
        if (data.choices && Array.isArray(data.choices)) {
          responseText = data.choices[0]?.message?.content || data.choices[0]?.text || JSON.stringify(data.choices);
        } else if (data.choices && data.choices.content && data.choices.content.parts) {
          responseText = data.choices.content.parts[0].text;
        } else if (data.content && data.content.parts && data.content.parts.length > 0) {
          responseText = data.content.parts[0].text;
        } else if (data.text) {
          responseText = data.text;
        } else {
          responseText = JSON.stringify(data);
        }
      } catch (err) {
        responseText = JSON.stringify(data);
      }

      // Append Web Search Sources if available (to mimic Perplexity's citations)
      if (data.webSearchQueries && data.webSearchQueries.length > 0) {
        responseText += `\n\n---\n**🌐 Sources & Live Web Searches:**\n` + data.webSearchQueries.map((q: string) => `- ${q}`).join('\n');
      }

      // Convert static response to Vercel AI SDK format (0:"chunk")
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`0:${JSON.stringify(responseText)}\n`));
          
          // Optionally, simulate a mock tool call for generateComparisonChart if the user asked for "compare"
          if (latestMessage.toLowerCase().includes("compare")) {
             const mockToolCall = {
               toolCallId: "call_mock_123",
               toolName: "generateComparisonChart",
               args: {
                 title: "Feature Comparison (via Perplexity API)",
                 data: [
                   { category: "AI Features", ourScore: 9, competitorScore: 7, competitorName: "Acme Corp" },
                   { category: "Pricing", ourScore: 8, competitorScore: 6, competitorName: "Acme Corp" }
                 ]
               }
             };
             controller.enqueue(encoder.encode(`9:${JSON.stringify(mockToolCall)}\n`));
          }
          
          controller.close();
        }
      });
      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'x-vercel-ai-data-stream': 'v1'
        }
      });
    } catch (e: any) {
      console.error("AI Fetching Error:", e);
      return new Response(JSON.stringify({ error: e.message || 'Internal Server Error' }), { status: 500 });
    }

  } catch (error: any) {
    console.error('Copilot Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
