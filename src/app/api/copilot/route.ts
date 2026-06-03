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

    // 1. Generate Embedding for User Query
    const { embedding } = await embed({
      model: google.textEmbeddingModel('text-embedding-004'),
      value: latestMessage,
    });

    // 2. Retrieve Relevant Context via RAG
    const { data: relevantDocs, error: rpcError } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 10,
      p_user_id: user.id
    });

    if (rpcError) {
      console.warn("RAG Error (fallback to basic mode):", rpcError);
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
    const result = await streamText({
      model: google('gemini-1.5-flash'),
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
      }
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error('Copilot Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
