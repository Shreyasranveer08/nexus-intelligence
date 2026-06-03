
const { readDB, writeDB, generateId } = require('./src/lib/db');
const { GET } = require('./src/app/api/cron/monitor/route'); // Note: GET is async, but we can't easily require Next.js route in plain Node without transpilation.

// We will write a plain JS script that imports the DB, adds Linear, and then we will use fetch() to trigger the Next.js API route.
async function runTest() {
  console.log("Adding Linear to DB...");
  const db = readDB();
  const compId = generateId();
  db.competitors.push({
    id: compId,
    name: "Linear",
    created_at: new Date().toISOString()
  });

  const url1Id = generateId();
  const url2Id = generateId();
  db.tracked_urls.push(
    { id: url1Id, competitor_id: compId, url: 'https://linear.app', url_type: 'Homepage', created_at: new Date().toISOString() },
    { id: url2Id, competitor_id: compId, url: 'https://linear.app/pricing', url_type: 'Pricing', created_at: new Date().toISOString() }
  );
  writeDB(db);

  console.log("Running Initial Scan (Snapshot creation)...");
  let res = await fetch('http://localhost:3000/api/cron/monitor');
  let data = await res.json();
  console.log("Initial Scan Response:", data);

  console.log("Modifying Snapshots to simulate previous state...");
  const db2 = readDB();
  db2.page_snapshots.forEach(snap => {
    if (snap.tracked_url_id === url1Id) {
      snap.extracted_text = snap.extracted_text.replace(/Linear is a better way to build products/i, "Linear is a standard way to manage tasks.");
      snap.content_hash = "fakehash1";
    }
    if (snap.tracked_url_id === url2Id) {
      snap.extracted_text = snap.extracted_text.replace(/\$8/g, "$4").replace(/\$14/g, "$10");
      snap.content_hash = "fakehash2";
    }
  });
  writeDB(db2);

  console.log("Running Second Scan (Change detection & Synthesis)...");
  res = await fetch('http://localhost:3000/api/cron/monitor');
  data = await res.json();
  console.log("Second Scan Response:", data);

  const dbFinal = readDB();
  console.log("Raw Events Generated:", dbFinal.changes_detected.length);
  console.log("Synthesized Insights Generated:", dbFinal.synthesized_insights.length);
}

runTest();
