import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testGenerate() {
  const { data: users } = await supabase.from('users').select('id').limit(1);
  if (!users || users.length === 0) {
    console.log("No users found");
    return;
  }
  const userId = users[0].id;

  console.log("Testing Report Generation API...");
  // But wait, the API requires the user to be authenticated via cookies/session! 
  // Let's test it by mimicking the DB logic directly.
  
  const type = 'market';
  
  const { data: competitors } = await supabase.from('competitors')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

  console.log("Active Competitors:", competitors?.length);

  const compIds = competitors.map(c => c.id);
  
  const { data: insights, error } = await supabase.from('synthesized_insights')
      .select('*')
      .eq('user_id', userId)
      .in('competitor_id', compIds);

  console.log("Insights found:", insights?.length);
  if (error) console.error("Error fetching insights:", error);
  
  if (!insights || insights.length === 0) {
    console.log("REASON FOR FAILURE: No insights available to generate this report.");
  } else {
    console.log("\\n--- INSIGHTS DATA ---");
    insights.forEach(i => {
      console.log(`- ${i.strategic_narrative}`);
    });
  }
}

testGenerate();
