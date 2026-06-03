import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase keys");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log("1. Adding Vercel as a live competitor...");
  
  // Get the first user
  const { data: users } = await supabase.from('users').select('id').limit(1);
  const userId = users[0].id;
  
  // Insert Competitor
  const { data: comp } = await supabase.from('competitors').insert({
    user_id: userId,
    name: "Vercel",
    category: "Hosting",
    status: "active",
    website: "https://vercel.com"
  }).select().single();
  
  // Insert Tracked URL
  console.log("2. Tracking Vercel Changelog...");
  const { data: url } = await supabase.from('tracked_urls').insert({
    competitor_id: comp.id,
    user_id: userId,
    url: "https://vercel.com/changelog",
    url_type: "changelog",
    last_content_hash: "fakehash_to_force_change"
  }).select().single();

  console.log("3. Triggering Monitor Engine (Scraper -> AI -> DB)...");
  
  const res = await fetch('http://localhost:3000/api/cron/monitor');
  const result = await res.json();
  console.log("Engine Response:", result);

  if (result.success && result.signals_detected > 0) {
    const insightId = result.results[0].insight;
    
    console.log("\\n--- VERIFICATION OUTPUT ---");
    
    const { data: insight } = await supabase.from('synthesized_insights').select('*').eq('id', insightId).single();
    console.log("\\n[synthesized_insight] created:");
    console.log("- Strategic Narrative:", insight.strategic_narrative);
    console.log("- Category:", insight.signal_category);
    console.log("- Impact Score:", insight.impact_score);
    
    const { data: raw } = await supabase.from('raw_signals').select('*').eq('synthesized_insight_id', insightId).single();
    console.log("\\n[raw_signal] created:");
    console.log("- Source URL:", raw.source_url);
    console.log("- Evidence Snippet (First 100 chars):", raw.raw_diff.substring(0, 100) + '...');
    
    const { data: timeline } = await supabase.from('competitor_timeline').select('*').eq('insight_id', insightId).single();
    console.log("\\n[competitor_timeline] created:");
    console.log("- Event Type:", timeline.event_type);
    console.log("- Event Summary:", timeline.event_summary);
    
    console.log("\\n✅ Live test completed successfully!");
  } else {
    console.log("No signal was detected. The page might not have enough changes or the LLM decided it wasn't strategic enough.");
  }
}

runTest().catch(console.error);
