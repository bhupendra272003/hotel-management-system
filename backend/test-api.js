const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/billing/statistics',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response from /api/billing/statistics:');
    console.log(data);
    console.log('\n✅ Endpoint is working!');
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('\nMake sure backend is running on port 5000');
});

req.end();