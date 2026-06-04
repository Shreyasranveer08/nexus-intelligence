const http = require('https');

const options = {
	method: 'POST',
	hostname: 'perplexity2.p.rapidapi.com',
	port: null,
	path: '/',
	headers: {
		'x-rapidapi-key': '13b128e151msh283cee2ed529199p124acajsnfd4ec57fad95',
		'x-rapidapi-host': 'perplexity2.p.rapidapi.com',
		'Content-Type': 'application/json'
	}
};

const req = http.request(options, function (res) {
	const chunks = [];

	res.on('data', function (chunk) {
		chunks.push(chunk);
	});

	res.on('end', function () {
		const body = Buffer.concat(chunks);
		try {
			const json = JSON.parse(body.toString());
			console.log("Keys:", Object.keys(json));
			if(json.content && json.content.parts) {
			    console.log("Text:", json.content.parts[0].text.substring(0, 50));
			}
			console.log(JSON.stringify(json, null, 2));
		} catch(e) {
			console.log("Raw:", body.toString().substring(0, 200));
		}
	});
});

req.write(JSON.stringify({
  content: 'What is todays news in america?'
}));
req.end();
