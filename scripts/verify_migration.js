const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMigration() {
  console.log("=== SUPABASE POST-MIGRATION VERIFICATION ===");
  
  // 1. Database Counts
  const tables = ['users', 'companies', 'competitors', 'tracked_urls', 'raw_signals', 'synthesized_insights', 'intelligence_reports', 'execution_plans'];
  console.log("\n1. DATABASE COUNTS");
  console.log("------------------");
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.error(`Error querying ${table}: ${error.message}`);
    } else {
      console.log(`- ${table}: ${count}`);
    }
  }

  // 2. Data Integrity Verification (Orphans)
  console.log("\n2. DATA INTEGRITY VERIFICATION");
  console.log("------------------------------");
  
  const checkOrphans = async (table, fkey) => {
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true }).is(fkey, null);
    console.log(`- Orphaned ${table} (null ${fkey}): ${count}`);
  };

  await checkOrphans('competitors', 'user_id');
  await checkOrphans('tracked_urls', 'competitor_id');
  await checkOrphans('synthesized_insights', 'competitor_id');

  // 3. Read Test Verification (Sample Fetch)
  console.log("\n3. READ TEST VERIFICATION");
  console.log("-------------------------");
  
  const { data: testCompany } = await supabase.from('companies').select('name, industry').limit(1).single();
  console.log("Supabase Company Fetch:", testCompany);

  const { data: testCompetitors } = await supabase.from('competitors').select('name').limit(3);
  console.log("Supabase Competitors Fetch:", testCompetitors.map(c => c.name));

  const { data: testInsights } = await supabase.from('synthesized_insights').select('what_changed').limit(2);
  console.log("Supabase Insights Fetch:", testInsights.map(i => i.what_changed.substring(0, 30) + '...'));
}

verifyMigration();
