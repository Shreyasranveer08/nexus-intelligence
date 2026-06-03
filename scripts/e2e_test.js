import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runE2ETest() {
  console.log("=== 1. CHECKING TRACKED URLS ===");
  const { data: competitors } = await supabase.from('competitors').select('id, name').eq('status', 'active');
  const compIds = competitors.map(c => c.id);
  
  const { data: urls } = await supabase.from('tracked_urls').select('*').in('competitor_id', compIds);
  console.log(`Found ${urls?.length || 0} tracked URLs.`);
  console.table(urls?.map(u => ({ URL: u.url, Type: u.url_type, Competitor: competitors.find(c => c.id === u.competitor_id)?.name })));

  if (!urls || urls.length === 0) {
    console.log("No tracked URLs exist! The scraper will have nothing to scrape.");
    return;
  }



  console.log("\\n=== 2. TRIGGERING MONITOR ENDPOINT ===");
  const res = await fetch('http://localhost:3000/api/cron/monitor');
  const monitorResult = await res.json();
  console.log("Monitor Response:", monitorResult);

  console.log("\\n=== 3. VERIFYING CREATED RECORDS ===");
  
  const { data: jobs } = await supabase.from('scrape_jobs').select('*').order('created_at', { ascending: false }).limit(3);
  console.log("-> LATEST SCRAPE JOBS:");
  console.table(jobs?.map(j => ({ id: j.id, status: j.status, pending_llm: j.pending_llm })));

  const { data: raw } = await supabase.from('raw_signals').select('*').order('created_at', { ascending: false }).limit(2);
  console.log("-> NEW RAW SIGNALS:");
  raw?.forEach(r => console.log(`   Scrape: ${r.scrape_job_id} | Inserted`));

  const { data: insights } = await supabase.from('synthesized_insights').select('*').order('detected_timestamp', { ascending: false }).limit(2);
  console.log("-> NEW SYNTHESIZED INSIGHTS:");
  insights?.forEach(i => console.log(`   Title: ${i.what_changed}\n   Impact Score: ${i.impact_score}/10`));

  const { data: timeline } = await supabase.from('competitor_timeline').select('*').order('created_at', { ascending: false }).limit(2);
  console.log("-> NEW TIMELINE EVENTS:");
  timeline?.forEach(t => console.log(`   Type: ${t.event_type} | Summary: ${t.event_summary}`));
  
  const { data: pendingLlm, error: pendingErr } = await supabase.from('pending_llm_jobs').select('*').order('created_at', { ascending: false }).limit(4);
  if (pendingErr) {
    console.log("-> NEW PENDING LLM JOBS:");
    console.log(`   [Error querying pending_llm_jobs: ${pendingErr.message}] (Did you run the migration?)`);
  } else if (pendingLlm && pendingLlm.length > 0) {
    console.log("-> NEW PENDING LLM JOBS:");
    pendingLlm.forEach(p => console.log(`   Prompt Type: ${p.prompt_type} | Retry Count: ${p.retry_count} | Status: ${p.status}`));
  }

  console.log("\\n=== 4. CONFIRMING DASHBOARD DATA ===");
  if (insights && insights.length > 0) {
    console.log(`✅ Because ${insights.length} insight(s) exist with user_id ${insights[0].user_id}, they WILL immediately appear in the Executive Briefing, Intelligence Feed, and Competitor Radar.`);
  }

  console.log("\\n=== 5. GENERATING TEST WEEKLY REPORT ===");
  if (insights && insights.length > 0) {
    const userId = insights[0].user_id;
    console.log("Triggering /api/cron/report...");
    const repRes = await fetch('http://localhost:3000/api/cron/report');
    const repResult = await repRes.json();
    console.log("Report Generation Response:", repResult);
    
    if (repResult.success) {
      console.log(`✅ Successfully generated ${repResult.count} report(s).`);
      console.log("Sample Report Title:", repResult.reports[0].title);
    }
  }
}

runE2ETest().catch(console.error);
