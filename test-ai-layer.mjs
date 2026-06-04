import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, embed, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';


const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for bypass auth in test
);

async function run() {
  console.log("1. Starting AI Layer Test...");
  const prompt = "Compare our features to our main competitors: Acme Corp and Globex. We score 9 on AI, they score 7.";
  console.log("User Prompt:", prompt);

  try {
    console.log("\n2. Generating Embedding using gemini-embedding-2...");
    const { embedding } = await embed({
      model: google.textEmbeddingModel('gemini-embedding-2'),
      value: prompt,
    });
    console.log(`✅ Embedding generated successfully. Dimensions: ${embedding.length}`);

    console.log("\n3. Retrieving RAG Context from Supabase...");
    // Mock user ID since we don't have a real one in this script context
    const mockUserId = '00000000-0000-0000-0000-000000000000';
    const { data: relevantDocs, error: rpcError } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.1,
      match_count: 5,
      p_user_id: mockUserId
    });
    
    if (rpcError) {
      console.warn("⚠️ RAG RPC Error:", rpcError);
    } else {
      console.log(`✅ RAG Retrieval successful. Found ${relevantDocs?.length || 0} documents.`);
    }

    console.log("\n4. Testing Tool Calling & Generation with gemini-2.5-flash...");
    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: "You are an elite strategic intelligence advisor. If the user asks to compare competitors, you MUST call the generateComparisonChart tool.",
      messages: [{ role: 'user', content: prompt }],
      tools: {
        generateComparisonChart: tool({
          description: 'Generates a visual comparison chart of features or metrics between competitors.',
          parameters: z.object({
            title: z.string(),
            data: z.array(z.object({
              category: z.string(),
              ourScore: z.number(),
              competitorScore: z.number(),
              competitorName: z.string()
            }))
          }),
        }),
      }
    });

    console.log("Streaming response chunks:\n-----------------------------------");
    for await (const chunk of result.fullStream) {
      if (chunk.type === 'text-delta') {
        process.stdout.write(chunk.textDelta);
      } else if (chunk.type === 'tool-call') {
        console.log(`\n\n🛠️ TOOL CALLED: ${chunk.toolName}`);
        console.log(`🔧 ARGUMENTS: ${JSON.stringify(chunk.args, null, 2)}\n`);
      }
    }
    console.log("\n-----------------------------------\n✅ AI Layer Test Completed Successfully.");

  } catch (error) {
    console.error("❌ Test Failed:", error);
  }
}

run();
