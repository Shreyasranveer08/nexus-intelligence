const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data.json');
const db = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log("=== PRE-MIGRATION VALIDATION REPORT ===\n");

// Helpers
const users = db.users || [];
const companies = db.companies || [];
const competitors = db.competitors || [];
const tracked_urls = db.tracked_urls || [];
const insights = db.synthesized_insights || [];
const reports = db.intelligence_reports || [];
const plans = db.execution_plans || [];

const userIds = new Set(users.map(u => u.id));
const compIds = new Set(competitors.map(c => c.id));
const reportIds = new Set(reports.map(r => r.id));
const insightIds = new Set(insights.map(i => i.id));

let fkViolations = 0;
let nullViolations = 0;
let duplicates = 0;

console.log("1. FOREIGN KEY VALIDATION");
console.log("--------------------------");

// Check competitors -> users
const invalidComps = competitors.filter(c => !userIds.has(c.user_id));
if (invalidComps.length > 0) {
  console.log(`❌ ${invalidComps.length} competitors point to invalid users.`);
  fkViolations += invalidComps.length;
} else console.log(`✅ All ${competitors.length} competitors have valid user_ids.`);

// Check tracked_urls -> competitors
const invalidUrls = tracked_urls.filter(u => !compIds.has(u.competitor_id));
if (invalidUrls.length > 0) {
  console.log(`❌ ${invalidUrls.length} tracked_urls point to invalid competitors.`);
  fkViolations += invalidUrls.length;
} else console.log(`✅ All ${tracked_urls.length} tracked_urls have valid competitor_ids.`);

// Check insights -> competitors
const invalidInsights = insights.filter(i => !compIds.has(i.competitor_id));
if (invalidInsights.length > 0) {
  console.log(`❌ ${invalidInsights.length} insights point to invalid competitors.`);
  fkViolations += invalidInsights.length;
} else console.log(`✅ All ${insights.length} insights have valid competitor_ids.`);

// Check execution_plans -> reports/insights
const invalidPlans = plans.filter(p => 
  (p.report_id && !reportIds.has(p.report_id)) || 
  (p.insight_id && !insightIds.has(p.insight_id))
);
if (invalidPlans.length > 0) {
  console.log(`❌ ${invalidPlans.length} execution plans point to invalid reports/insights.`);
  fkViolations += invalidPlans.length;
} else console.log(`✅ All ${plans.length} execution plans reference valid reports/insights.`);

console.log("\n2. NULLABILITY VALIDATION");
console.log("--------------------------");

const checkNulls = (arr, fields, entity) => {
  let count = 0;
  arr.forEach(item => {
    fields.forEach(f => {
      if (item[f] === undefined || item[f] === null || item[f] === '') {
        console.log(`❌ Null violation in ${entity} [ID: ${item.id}]: Field '${f}' is null/empty.`);
        count++;
      }
    });
  });
  return count;
};

let nulls = 0;
nulls += checkNulls(users, ['id', 'email', 'name'], 'users');
nulls += checkNulls(companies, ['id', 'user_id', 'name'], 'companies');
nulls += checkNulls(competitors, ['id', 'user_id', 'name'], 'competitors');
nulls += checkNulls(tracked_urls, ['id', 'competitor_id', 'user_id', 'url', 'url_type'], 'tracked_urls');
// Insights mapping handled gracefully in migration script, but let's check essential ones
nulls += checkNulls(insights, ['id', 'competitor_id'], 'synthesized_insights'); 
nulls += checkNulls(reports, ['id', 'user_id', 'type', 'title', 'summary', 'markdown_body', 'structured_data', 'competitor_snapshot', 'start_date', 'end_date'], 'intelligence_reports');

if (nulls === 0) console.log("✅ No NOT NULL violations detected. Migration mappings are safe.");
nullViolations = nulls;

console.log("\n3. DUPLICATE VALIDATION");
console.log("--------------------------");

const checkDuplicates = (arr, keyFn, entity) => {
  const seen = new Set();
  let count = 0;
  arr.forEach(item => {
    const k = keyFn(item);
    if (seen.has(k)) {
      console.log(`❌ Duplicate found in ${entity}: ${k}`);
      count++;
    }
    seen.add(k);
  });
  return count;
};

let dupes = 0;
dupes += checkDuplicates(competitors, c => `${c.user_id}-${c.name}`, 'competitors (user+name)');
dupes += checkDuplicates(tracked_urls, u => `${u.competitor_id}-${u.url}`, 'tracked_urls (comp+url)');
dupes += checkDuplicates(insights, i => `${i.competitor_id}-${i.what_changed || i.strategic_narrative}`, 'insights (comp+change)');

if (dupes === 0) console.log("✅ No duplicates detected in critical distinct fields.");
duplicates = dupes;

console.log("\n4. MIGRATION DRY RUN (Expected Inserts)");
console.log("-----------------------------------------");
console.log(`Users:                ${users.length}`);
console.log(`Companies:            ${companies.length}`);
console.log(`Competitors:          ${competitors.length}`);
console.log(`Tracked URLs:         ${tracked_urls.length}`);
console.log(`Raw Signals:          0`);
console.log(`Synthesized Insights: ${insights.length}`);
console.log(`Intelligence Reports: ${reports.length}`);
console.log(`Execution Plans:      ${plans.length}`);

console.log("\n=== VALIDATION SUMMARY ===");
if (fkViolations === 0 && nullViolations === 0 && duplicates === 0) {
  console.log("🚀 SUCCESS! Data is perfectly clean and ready for Supabase migration.");
} else {
  console.log("⚠️ WARNING! Issues detected. Please review logs before migrating.");
}
