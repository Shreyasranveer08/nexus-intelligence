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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
const anonClient = createClient(supabaseUrl, supabaseAnonKey);

async function runTests() {
  console.log("=== PHASE 1 VERIFICATION & RLS REPORT ===\n");

  // 1. RLS Verification
  console.log("1. RLS POLICIES VERIFICATION");
  console.log("----------------------------");
  const { data: anonData, error: anonError } = await anonClient.from('competitors').select('*');
  if (anonData && anonData.length === 0) {
    console.log("✅ SUCCESS: Anonymous user attempted to read competitors and got 0 rows. RLS is actively blocking unauthenticated access.");
  } else {
    console.log("❌ FAILED: Anonymous access is not blocked!");
  }

  // 2. Data Modification Verification (via Service Role to simulate successful auth)
  console.log("\n2. DATA INTEGRITY (Add / Archive / Restore)");
  console.log("------------------------------------------");
  
  const { data: users } = await serviceClient.from('users').select('id').limit(1);
  const testUserId = users[0].id;

  // Simulate updating company name
  const { data: companyUpdate } = await serviceClient.from('companies').update({ name: 'VERIFIED_TEST_COMPANY' }).eq('user_id', testUserId).select().single();
  console.log(`✅ Company Profile Update: Success. New Name: ${companyUpdate.name}`);

  // Simulate Add Competitor
  const { data: newComp } = await serviceClient.from('competitors').insert({
    user_id: testUserId,
    name: 'TEST_PHASE1_COMPETITOR',
    status: 'active'
  }).select().single();
  console.log(`✅ Add Competitor: Success. Inserted ID: ${newComp.id}`);

  // Simulate Archive Competitor
  const { data: archivedComp } = await serviceClient.from('competitors').update({ status: 'archived' }).eq('id', newComp.id).select().single();
  console.log(`✅ Archive Competitor: Success. Status changed to: ${archivedComp.status}`);

  // Simulate Restore Competitor
  const { data: restoredComp } = await serviceClient.from('competitors').update({ status: 'active' }).eq('id', newComp.id).select().single();
  console.log(`✅ Restore Competitor: Success. Status changed back to: ${restoredComp.status}`);

  // Clean up test competitor
  await serviceClient.from('competitors').delete().eq('id', newComp.id);

  // 3. Final Database Counts
  console.log("\n3. LIVE DATABASE COUNTS");
  console.log("-----------------------");
  const countTable = async (table) => {
    const { count } = await serviceClient.from(table).select('*', { count: 'exact', head: true });
    return count;
  };

  console.log(`- Users: ${await countTable('users')}`);
  console.log(`- Companies: ${await countTable('companies')}`);
  console.log(`- Competitors: ${await countTable('competitors')}`);
  console.log(`- Tracked URLs: ${await countTable('tracked_urls')}`);
  console.log(`- Insights: ${await countTable('synthesized_insights')}`);
}

runTests();
