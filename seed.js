const fs = require('fs');

function generateId() {
  return require('crypto').randomUUID();
}

function seedDB() {
  const data = {
    competitors: [],
    tracked_urls: [],
    page_snapshots: [],
    changes_detected: [],
    synthesized_insights: [],
    intelligence_reports: []
  };

  const comps = [
    { name: 'Asana', urls: ['https://asana.com', 'https://asana.com/pricing'] },
    { name: 'ClickUp', urls: ['https://clickup.com', 'https://clickup.com/pricing'] },
    { name: 'Monday.com', urls: ['https://monday.com', 'https://monday.com/pricing'] }
  ];

  for (const c of comps) {
    const compId = generateId();
    data.competitors.push({ id: compId, name: c.name, created_at: new Date().toISOString() });
    
    for (const url of c.urls) {
      data.tracked_urls.push({
        id: generateId(),
        competitor_id: compId,
        url: url,
        url_type: url.includes('pricing') ? 'Pricing' : 'Homepage',
        created_at: new Date().toISOString()
      });
    }
  }

  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
  console.log('Database seeded with 3 competitors.');
}

seedDB();
