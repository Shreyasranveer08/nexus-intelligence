// @ts-nocheck
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { streamText, embed, tool } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

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

    // 1. Generate Embedding for User Query (Fault-Tolerant)
    let embedding = null;
    try {
      const result = await embed({
        model: google.textEmbeddingModel('gemini-embedding-2'),
        value: latestMessage,
      });
      embedding = result.embedding;
    } catch (e: any) {
      console.warn("Embedding failed, falling back to non-RAG mode:", e.message);
    }

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
    const systemInstruction = `You are Nexus Copilot, an elite strategic intelligence advisor. 
You are speaking directly to the founder/executive. Use a sharp, professional, and highly actionable tone.
Do not use generic fluff. Dive straight into strategic insights.

You have access to the user's secure database via Retrieval-Augmented Generation (RAG).
Use the retrieved knowledge base below to answer the user's query.

If the user asks to compare competitors, you MUST call the \`generateComparisonChart\` tool in addition to your text explanation.
If the user asks for a battlecard or strategic overview of a specific competitor, you MUST call the \`createBattlecard\` tool.
If the user asks for an execution plan or next steps, you MUST call the \`generateExecutionPlan\` tool.

${contextText}`;

    // 4. Stream Response with Vercel AI SDK
    try {
      const result = await streamText({
        model: google('gemini-2.5-flash'),
        system: systemInstruction,
        messages: messages,
        tools: {
          generateComparisonChart: tool({
            description: 'Generates a visual comparison chart of features or metrics between competitors. Call this when asked to compare competitors.',
            parameters: z.object({
              title: z.string().describe('Title of the chart (e.g., Feature Comparison)'),
              data: z.array(z.object({
                category: z.string().describe('The feature or metric being compared (e.g., Pricing, AI Features)'),
                ourScore: z.number().min(0).max(10).describe('Our score out of 10'),
                competitorScore: z.number().min(0).max(10).describe('Competitor score out of 10'),
                competitorName: z.string().describe('Name of the competitor being compared against')
              }))
            }),
          }),
          createBattlecard: tool({
            description: 'Generates a strategic battlecard for a specific competitor. Call this when asked for a deep dive, battlecard, or profile on a competitor.',
            parameters: z.object({
              competitorName: z.string().describe('Name of the competitor'),
              strengths: z.array(z.string()).describe('Top 3 strengths of the competitor'),
              weaknesses: z.array(z.string()).describe('Top 3 weaknesses of the competitor'),
              ourAdvantage: z.string().describe('Our key competitive advantage against them'),
              pricingStrategy: z.string().describe('Summary of their pricing strategy')
            }),
          }),
          generateExecutionPlan: tool({
            description: 'Generates a structured execution plan. Call this when the user asks for an action plan or next steps.',
            parameters: z.object({
              title: z.string().describe('Title of the execution plan'),
              objective: z.string().describe('The primary goal'),
              steps: z.array(z.object({
                title: z.string().describe('Step title'),
                description: z.string().describe('Detailed action required'),
                owner: z.string().describe('Who should own this (e.g., Marketing, Product, Sales)')
              }))
            }),
          })
        },
      });

      return result.toDataStreamResponse();
    } catch (e: any) {
      console.error("AI Streaming Error:", e);
      
      // FALLBACK: When Quota Exhausted, return a mock response that Vercel AI SDK can parse
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const message = "⚠️ **Nexus Copilot (Mock Mode):** It looks like the Gemini API quota has been exhausted. To ensure you can still test the UI, I'm returning a simulated response. \n\nIf you asked for a competitor comparison, execution plan, or battlecard, those tools are structurally wired and ready to trigger once the quota resets or a new key is provided.";
          
          // AI SDK format: 0:"text chunk"
          controller.enqueue(encoder.encode(`0:${JSON.stringify(message)}\n`));
          
          // Optionally, simulate a mock tool call for generateComparisonChart if the user asked for "compare"
          if (latestMessage.toLowerCase().includes("compare")) {
             const mockToolCall = {
               toolCallId: "call_mock_123",
               toolName: "generateComparisonChart",
               args: {
                 title: "Mock Feature Comparison",
                 data: [
                   { category: "AI Features", ourScore: 9, competitorScore: 7, competitorName: "Acme Corp" },
                   { category: "Pricing", ourScore: 8, competitorScore: 6, competitorName: "Acme Corp" }
                 ]
               }
             };
             // AI SDK format for tool call: 9:{"toolCallId":...,"toolName":...,"args":...}
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
    }

  } catch (error: any) {
    console.error('Copilot Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
