import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { streamText, embed } from 'ai';
import { google } from '@ai-sdk/google';

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
      match_threshold: 0.5, // 50% similarity minimum
      match_count: 10, // Top 10 chunks
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
Use the retrieved knowledge base below to answer the user's query. If the retrieved context contains the answer, you MUST base your response on it. If it is insufficient, use your analytical skills to provide the best possible strategic advice and clearly state what data you are referencing.

Always reference your sources if you are pulling from the knowledge base (e.g., "Based on your recent execution plan..." or "According to the latest competitor insight...").

${contextText}`;

    // 4. Stream Response with Vercel AI SDK
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemInstruction,
      messages: messages,
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error('Copilot Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
