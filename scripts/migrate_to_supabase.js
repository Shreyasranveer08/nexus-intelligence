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

// Ensure you use the SERVICE_ROLE_KEY to bypass RLS during migration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY is required to bypass RLS for migration.");
  console.error("Please add it to your .env.local file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  console.log("🚀 Starting data migration to Supabase...");
  const dataPath = path.join(__dirname, '../data.json');
  if (!fs.existsSync(dataPath)) {
    console.error("❌ data.json not found!");
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // 1. Migrate Users
  if (db.users && db.users.length > 0) {
    console.log(`Migrating ${db.users.length} Users...`);
    const { error } = await supabase.from('users').upsert(
      db.users.map(u => ({
        id: u.id,
        email: u.email || '',
        name: u.name || '',
        role: u.role || 'founder',
        onboarding_status: u.onboarding_status || 'pending',
        onboarding_step: u.onboarding_step || 1,
        timezone: u.timezone || 'UTC'
      }))
    );
    if (error) console.error("❌ Error migrating users:", error.message);
    else console.log("✅ Users migrated.");
  }

  // 2. Migrate Companies
  if (db.companies && db.companies.length > 0) {
    console.log(`Migrating ${db.companies.length} Companies...`);
    const { error } = await supabase.from('companies').upsert(
      db.companies.map(c => ({
        id: c.id,
        user_id: c.user_id,
        name: c.name,
        website: c.website || null,
        industry: c.industry || null,
        product_description: c.product_description || null,
        key_features: c.key_features || [],
        target_audience: c.target_audience || null,
        pricing: c.pricing || null,
        positioning_statement: c.positioning_statement || null
      }))
    );
    if (error) console.error("❌ Error migrating companies:", error.message);
    else console.log("✅ Companies migrated.");
  }

  // 3. Migrate Competitors
  if (db.competitors && db.competitors.length > 0) {
    console.log(`Migrating ${db.competitors.length} Competitors...`);
    const { error } = await supabase.from('competitors').upsert(
      db.competitors.map(c => ({
        id: c.id,
        user_id: c.user_id,
        name: c.name,
        category: c.category || 'Uncategorized',
        status: c.status || 'active',
        created_at: c.created_at
      }))
    );
    if (error) console.error("❌ Error migrating competitors:", error.message);
    else console.log("✅ Competitors migrated.");
  }

  // 4. Migrate Tracked URLs
  if (db.tracked_urls && db.tracked_urls.length > 0) {
    console.log(`Migrating ${db.tracked_urls.length} Tracked URLs...`);
    const { error } = await supabase.from('tracked_urls').upsert(
      db.tracked_urls.map(t => ({
        id: t.id,
        user_id: t.user_id,
        competitor_id: t.competitor_id,
        url: t.url,
        url_type: (t.url_type || 'homepage').toLowerCase(),
        created_at: t.created_at
      }))
    );
    if (error) console.error("❌ Error migrating tracked URLs:", error.message);
    else console.log("✅ Tracked URLs migrated.");
  }

  // 5. Migrate Synthesized Insights
  if (db.synthesized_insights && db.synthesized_insights.length > 0) {
    console.log(`Migrating ${db.synthesized_insights.length} Synthesized Insights...`);
    
    const mapScore = (score) => {
      if (!score) return 5;
      if (typeof score === 'number') return score;
      if (score.toLowerCase() === 'high') return 8;
      if (score.toLowerCase() === 'medium') return 5;
      if (score.toLowerCase() === 'low') return 3;
      return parseInt(score) || 5;
    };

    const { error } = await supabase.from('synthesized_insights').upsert(
      db.synthesized_insights.map(i => ({
        id: i.id,
        user_id: i.user_id, 
        competitor_id: i.competitor_id,
        what_changed: i.what_changed || i.strategic_narrative || '',
        why_it_matters: i.why_it_matters || '',
        strategic_narrative: i.strategic_narrative || '',
        recommended_action: i.recommended_action || '',
        impact_score: mapScore(i.impact_score),
        confidence_score: mapScore(i.confidence_score),
        change_categories: i.change_categories || [],
        affected_urls: i.affected_urls || [],
        created_at: i.created_at
      }))
    );
    if (error) console.error("❌ Error migrating insights:", error.message);
    else console.log("✅ Insights migrated.");
  }

  // 6. Migrate Intelligence Reports
  if (db.intelligence_reports && db.intelligence_reports.length > 0) {
    console.log(`Migrating ${db.intelligence_reports.length} Reports...`);
    const { error } = await supabase.from('intelligence_reports').upsert(
      db.intelligence_reports.map(r => ({
        id: r.id,
        user_id: r.user_id,
        type: r.type || 'market',
        title: r.title,
        summary: r.summary,
        markdown_body: r.markdown_body,
        structured_data: r.structured_data,
        competitor_snapshot: r.competitor_snapshot,
        start_date: r.start_date,
        end_date: r.end_date,
        created_at: r.created_at
      }))
    );
    if (error) console.error("❌ Error migrating reports:", error.message);
    else console.log("✅ Reports migrated.");
  }

  console.log("🎉 Migration script completed!");
}

migrateData();
