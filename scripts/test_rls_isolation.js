import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required Supabase environment variables.");
  process.exit(1);
}

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runTest() {
  console.log("=== 1. Creating Test Users ===");
  const emailA = `testA_${Date.now()}@example.com`;
  const emailB = `testB_${Date.now()}@example.com`;
  const password = "Password123!";

  const { data: userAData, error: userAError } = await adminClient.auth.admin.createUser({
    email: emailA,
    password: password,
    email_confirm: true
  });
  if (userAError) throw new Error("Failed to create User A: " + userAError.message);

  const { data: userBData, error: userBError } = await adminClient.auth.admin.createUser({
    email: emailB,
    password: password,
    email_confirm: true
  });
  if (userBError) throw new Error("Failed to create User B: " + userBError.message);

  const userA_id = userAData.user.id;
  const userB_id = userBData.user.id;
  
  const { error: userInsertErr } = await adminClient.from('users').insert([
    { id: userA_id, email: emailA, name: "User A" }, 
    { id: userB_id, email: emailB, name: "User B" }
  ]);
  
  if (userInsertErr) {
    console.error("Failed to insert into public.users:", userInsertErr);
  }
  
  console.log(`✅ User A created: ${userA_id}`);
  console.log(`✅ User B created: ${userB_id}`);

  console.log("\\n=== 2. Creating Dummy Data with Admin Client ===");
  
  // Create Competitors
  const resA = await adminClient.from('competitors').insert({
    user_id: userA_id,
    name: "Competitor A",
    website: "https://compa.com",
    status: "active"
  }).select().single();
  if (resA.error) {
    console.error("compA error:", resA.error);
    process.exit(1);
  }
  const compA = resA.data;
  
  const resB = await adminClient.from('competitors').insert({
    user_id: userB_id,
    name: "Competitor B",
    website: "https://compb.com",
    status: "active"
  }).select().single();
  if (resB.error) {
    console.error("compB error:", resB.error);
    process.exit(1);
  }
  const compB = resB.data;
  
  // Create Insights
  const { error: insAError } = await adminClient.from('synthesized_insights').insert({
    user_id: userA_id,
    competitor_id: compA.id,
    what_changed: "User A Insight",
    why_it_matters: "A",
    confidence_score: 9,
    impact_score: 5
  });
  if (insAError) console.error("insAError:", insAError);

  const { error: insBError } = await adminClient.from('synthesized_insights').insert({
    user_id: userB_id,
    competitor_id: compB.id,
    what_changed: "User B Insight",
    why_it_matters: "B",
    confidence_score: 9,
    impact_score: 8
  });
  if (insBError) console.error("insBError:", insBError);
  
  // Create Reports
  const { error: repAError } = await adminClient.from('intelligence_reports').insert({
    user_id: userA_id,
    title: "User A Report",
    summary: "Summary A",
    markdown_body: "Test",
    structured_data: {},
    competitor_snapshot: [],
    type: "market",
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString()
  });
  if (repAError) console.error("repAError:", repAError);

  const { error: repBError } = await adminClient.from('intelligence_reports').insert({
    user_id: userB_id,
    title: "User B Report",
    summary: "Summary B",
    markdown_body: "Test",
    structured_data: {},
    competitor_snapshot: [],
    type: "market",
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString()
  });
  if (repBError) console.error("repBError:", repBError);

  console.log(`✅ Dummy data inserted for both users.`);

  console.log("\\n=== 3. Simulating Logged-In Sessions ===");
  const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { error: loginAError } = await clientA.auth.signInWithPassword({ email: emailA, password });
  if (loginAError) throw new Error("Failed to login User A: " + loginAError.message);
  
  const clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { error: loginBError } = await clientB.auth.signInWithPassword({ email: emailB, password });
  if (loginBError) throw new Error("Failed to login User B: " + loginBError.message);
  
  console.log(`✅ Successfully signed in as both users.`);

  console.log("\\n=== 4. Testing RLS Isolation ===");

  async function testIsolation(client, userName, expectedUserId) {
    let success = true;
    
    // Test Competitors
    const { data: comps } = await client.from('competitors').select('name, user_id');
    if (comps.some(c => c.user_id !== expectedUserId)) {
      console.error(`❌ FAILURE: ${userName} can see competitors belonging to another user!`);
      success = false;
    } else if (comps.length !== 1) {
      console.error(`❌ FAILURE: ${userName} sees ${comps.length} competitors instead of exactly 1!`);
      success = false;
    } else {
      console.log(`✅ PASS: ${userName} competitor view is perfectly isolated.`);
    }

    // Test Insights
    const { data: insights, error: insightsErr } = await client.from('synthesized_insights').select('what_changed, user_id');
    if (insightsErr) console.error("insightsErr:", insightsErr);
    if (!insightsErr) {
      if (insights.some(i => i.user_id !== expectedUserId)) {
        console.error(`❌ FAILURE: ${userName} can see insights belonging to another user!`);
        success = false;
      } else if (insights.length !== 1) {
        console.error(`❌ FAILURE: ${userName} sees ${insights.length} insights instead of exactly 1!`);
        success = false;
      } else {
        console.log(`✅ PASS: ${userName} insight view is perfectly isolated.`);
      }
    }

    // Test Reports
    const { data: reports, error: reportsErr } = await client.from('intelligence_reports').select('title, user_id');
    if (reportsErr) console.error("reportsErr:", reportsErr);
    if (!reportsErr) {
      if (reports.some(r => r.user_id !== expectedUserId)) {
        console.error(`❌ FAILURE: ${userName} can see reports belonging to another user!`);
        success = false;
      } else if (reports.length !== 1) {
        console.error(`❌ FAILURE: ${userName} sees ${reports.length} reports instead of exactly 1!`);
        success = false;
      } else {
        console.log(`✅ PASS: ${userName} report view is perfectly isolated.`);
      }
    }

    return success;
  }

  const resultA = await testIsolation(clientA, "User A", userA_id);
  const resultB = await testIsolation(clientB, "User B", userB_id);

  console.log("\\n=== 5. Cleaning Up ===");
  // Delete users (which cascades due to foreign keys, or at least cleans up the users)
  await adminClient.auth.admin.deleteUser(userA_id);
  await adminClient.auth.admin.deleteUser(userB_id);
  console.log("✅ Test users deleted.");

  if (resultA && resultB) {
    console.log("\\n🎉 SUCCESS: All RLS policies are strictly isolating user data! The platform is completely secure.");
  } else {
    console.log("\\n⚠️ FAILED: Data leak detected! RLS policies need adjustment.");
  }
}

runTest().catch(console.error);
