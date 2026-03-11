const http = require('http');

const data = JSON.stringify({
  pillars: [
    { filmId: 1, rank: 1 },
    { filmId: 2, rank: 2 }
  ],
  reactions: [
    { filmId: 3, reaction: 'loved' }
  ],
  timestamp: new Date().toISOString()
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/onboarding/complete',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
