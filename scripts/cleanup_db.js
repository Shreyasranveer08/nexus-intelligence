import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
  console.log("--- STARTING DATABASE CLEANUP ---");

  // 1. Delete the 3 legacy insights
  const legacyInsightIds = [
    '40773361-9230-4947-a83c-966f365e3e47',
    'a220e34c-3638-4140-9079-165f63c502fe',
    '274c201d-2079-4cfb-8cdc-0bf110dfce06'
  ];
  
  const { error: insErr } = await supabase
    .from('synthesized_insights')
    .delete()
    .in('id', legacyInsightIds);
    
  if (insErr) console.error("Error deleting insights:", insErr);
  else console.log(`✅ Deleted ${legacyInsightIds.length} legacy insights.`);

  // 2. Find and delete duplicate Vercel competitors
  const { data: vercels } = await supabase
    .from('competitors')
    .select('id, created_at')
    .eq('name', 'Vercel')
    .order('created_at', { ascending: true });

  if (vercels && vercels.length > 1) {
    // Keep the first one, delete the rest
    const duplicates = vercels.slice(1).map(v => v.id);
    const { error: compErr } = await supabase
      .from('competitors')
      .delete()
      .in('id', duplicates);
      
    if (compErr) console.error("Error deleting competitors:", compErr);
    else console.log(`✅ Deleted ${duplicates.length} duplicate Vercel entries.`);
  }

  console.log("\\n--- VERIFICATION REPORT ---");

  // Fetch active competitors
  const { data: activeCompetitors } = await supabase
    .from('competitors')
    .select('id, name')
    .eq('status', 'active');
    
  console.log("ACTIVE COMPETITORS:");
  console.table(activeCompetitors);

  // Fetch synthesized insights count
  const { data: insights, count } = await supabase
    .from('synthesized_insights')
    .select('id, competitor_id', { count: 'exact' });

  console.log(`TOTAL SYNTHESIZED INSIGHTS: ${count}`);
  
  // Show mappings
  if (insights && insights.length > 0) {
    console.log("COMPETITOR TO INSIGHT MAPPINGS:");
    const mappings = insights.map(i => {
      const comp = activeCompetitors?.find(c => c.id === i.competitor_id);
      return { InsightID: i.id, Competitor: comp ? comp.name : 'Unknown/Archived' };
    });
    console.table(mappings);
  } else {
    console.log("MAPPINGS: No insights exist in the database. (Ready for fresh data)");
  }
}

cleanup().catch(console.error);
