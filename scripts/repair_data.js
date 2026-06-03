const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data.json');
const auditPath = path.join(__dirname, '../migration_audit.json');

const db = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Only 1 user exists, find their ID to assign ownership
const validUserId = db.users && db.users.length > 0 ? db.users[0].id : null;

if (!validUserId) {
  console.error("❌ No valid user found to assign ownership to.");
  process.exit(1);
}

const auditLogs = [];

function logRepair(entity, id, originalUserId, repairedUserId, reason) {
  auditLogs.push({
    entity_type: entity,
    record_id: id,
    original_user_id: originalUserId || null,
    repaired_user_id: repairedUserId,
    timestamp: new Date().toISOString(),
    repair_reason: reason
  });
}

// 1. Repair Competitors
(db.competitors || []).forEach(comp => {
  if (!comp.user_id || comp.user_id !== validUserId) {
    logRepair('competitor', comp.id, comp.user_id, validUserId, 'Null or invalid user_id assigned to master user');
    comp.user_id = validUserId;
  }
});

// 2. Repair Tracked URLs
(db.tracked_urls || []).forEach(url => {
  if (!url.user_id || url.user_id !== validUserId) {
    logRepair('tracked_url', url.id, url.user_id, validUserId, 'Null or invalid user_id assigned to master user');
    url.user_id = validUserId;
  }
});

// 3. Repair Insights (missing competitor maps)
// Actually, earlier validation said: "3 insights point to invalid competitors."
// If competitors were just unassigned, they are now assigned to the valid user.
// But do the insights point to completely non-existent competitors?
const validCompIds = new Set((db.competitors || []).map(c => c.id));
const defaultCompId = (db.competitors && db.competitors.length > 0) ? db.competitors[0].id : null;

(db.synthesized_insights || []).forEach(insight => {
  if (!insight.user_id || insight.user_id !== validUserId) {
    logRepair('synthesized_insight', insight.id, insight.user_id, validUserId, 'Null or invalid user_id assigned to master user');
    insight.user_id = validUserId;
  }
  
  if (!validCompIds.has(insight.competitor_id)) {
    // If the insight points to a missing competitor, map it to the first available competitor
    logRepair('synthesized_insight', insight.id, insight.competitor_id, defaultCompId, 'Invalid competitor_id mapping fallback');
    insight.competitor_id = defaultCompId;
  }
});

fs.writeFileSync(dataPath, JSON.stringify(db, null, 2), 'utf8');
fs.writeFileSync(auditPath, JSON.stringify(auditLogs, null, 2), 'utf8');

console.log(`✅ Repaired ${auditLogs.length} records.`);
console.log(`✅ Audit log written to migration_audit.json.`);
