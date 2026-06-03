const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

// Simulate changes for Asana
data.page_snapshots.forEach(s => {
  const url = data.tracked_urls.find(u => u.id === s.tracked_url_id)?.url;
  if (!url) return;
  
  if (url === 'https://asana.com') {
    // Simulate they just added AI
    s.extracted_text = s.extracted_text.replace(/AI/gi, 'Basic Automation');
    s.content_hash = 'fake_asana_home';
  } else if (url === 'https://asana.com/pricing') {
    // Simulate a price increase
    s.extracted_text = "Premium plan was $10.99. " + s.extracted_text;
    s.content_hash = 'fake_asana_price';
  }
  
  if (url === 'https://clickup.com') {
    // Simulate going upmarket
    s.extracted_text = s.extracted_text.replace(/Enterprise/gi, 'Small Business');
    s.content_hash = 'fake_clickup_home';
  } else if (url === 'https://clickup.com/pricing') {
    s.extracted_text = s.extracted_text.replace(/Contact Sales/gi, 'Try for free');
    s.content_hash = 'fake_clickup_price';
  }
  
  if (url === 'https://monday.com') {
    // Simulate dropping free plan
    s.extracted_text = "We have a completely free plan forever. " + s.extracted_text;
    s.content_hash = 'fake_monday_home';
  }
});

fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
console.log('Mutated snapshots to simulate past state.');
