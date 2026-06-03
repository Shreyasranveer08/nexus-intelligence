import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { embed } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Determine what to embed. We'll start by backfilling recent insights.
    // In a real production system, this would be triggered by webhooks or DB triggers.
    const { data: insights } = await supabase
      .from('synthesized_insights')
      .select('id, what_changed, why_it_matters, recommended_action, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!insights || insights.length === 0) {
      return new Response(JSON.stringify({ message: 'No insights to embed' }), { status: 200 });
    }

    // Get existing embeddings for this user to avoid duplicates
    const { data: existingEmbeddings } = await supabase
      .from('document_embeddings')
      .select('reference_id')
      .eq('user_id', user.id)
      .eq('document_type', 'insight');

    const existingIds = new Set(existingEmbeddings?.map(e => e.reference_id) || []);

    let embeddedCount = 0;

    for (const insight of insights) {
      if (existingIds.has(insight.id)) continue;

      // Construct a dense string representing the insight chunk
      const contentChunk = `
TYPE: Competitor Insight
DATE: ${new Date(insight.created_at).toISOString()}
CHANGE: ${insight.what_changed}
IMPACT: ${insight.why_it_matters}
RECOMMENDATION: ${insight.recommended_action || 'None'}
      `.trim();

      // Generate embedding using Google Gemini embedding model
      const { embedding } = await embed({
        model: google.textEmbeddingModel('text-embedding-004'),
        value: contentChunk,
      });

      // Insert into Supabase
      await supabase.from('document_embeddings').insert({
        user_id: user.id,
        document_type: 'insight',
        reference_id: insight.id,
        content_chunk: contentChunk,
        embedding: embedding,
        metadata: { source: 'synthesized_insights', date: insight.created_at }
      });

      embeddedCount++;
    }

    // Do the same for Execution Plans
    const { data: plans } = await supabase
      .from('execution_plans')
      .select('id, title, status, priority, content, created_at')
      .eq('user_id', user.id);

    if (plans) {
      const { data: existingPlanEmbeddings } = await supabase
        .from('document_embeddings')
        .select('reference_id')
        .eq('user_id', user.id)
        .eq('document_type', 'execution_plan');

      const existingPlanIds = new Set(existingPlanEmbeddings?.map(e => e.reference_id) || []);

      for (const plan of plans) {
        if (existingPlanIds.has(plan.id)) continue;

        const contentChunk = `
TYPE: Execution Plan
TITLE: ${plan.title}
STATUS: ${plan.status}
PRIORITY: ${plan.priority}
CONTENT: ${plan.content}
        `.trim();

        const { embedding } = await embed({
          model: google.textEmbeddingModel('text-embedding-004'),
          value: contentChunk,
        });

        await supabase.from('document_embeddings').insert({
          user_id: user.id,
          document_type: 'execution_plan',
          reference_id: plan.id,
          content_chunk: contentChunk,
          embedding: embedding,
          metadata: { source: 'execution_plans', date: plan.created_at }
        });
        embeddedCount++;
      }
    }

    return new Response(JSON.stringify({ success: true, embeddedCount }), { status: 200 });

  } catch (error: any) {
    console.error('Embedding Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
