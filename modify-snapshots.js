const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

// Find linear homepage snapshot
const hpSnap = data.page_snapshots.find(s => s.tracked_url_id === 'url_linear_home');
if (hpSnap) {
  hpSnap.extracted_text = hpSnap.extracted_text.replace(/Linear is a better way/gi, 'Linear is a standard tool');
  hpSnap.content_hash = 'fakehash_home_123';
}

// Find linear pricing snapshot
const pricingSnap = data.page_snapshots.find(s => s.tracked_url_id === 'url_linear_pricing');
if (pricingSnap) {
  // Replace current price numbers with lower ones
  // We'll just prefix the extracted text with a fake old price statement
  pricingSnap.extracted_text = "Business plan was $8/month. " + pricingSnap.extracted_text;
  pricingSnap.content_hash = 'fakehash_pricing_123';
}

fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
console.log('Snapshots modified to simulate a past state.');
