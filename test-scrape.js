const cheerio = require('cheerio');

async function testScrape() {
  const url = 'https://www.vivo.com/in';
  console.log('Fetching:', url);
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    console.log('Status:', response.status);
    const html = await response.text();
    console.log('HTML Length:', html.length);
    
    const $ = cheerio.load(html);
    $('script, style, nav, footer, header, noscript, iframe, svg').remove();
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    console.log('Extracted Text Length:', text.length);
    console.log('Extracted Text Preview:', text.substring(0, 500));
  } catch (err) {
    console.error(err);
  }
}

testScrape();
