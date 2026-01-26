const http = require('http');

const tests = [
  { name: 'Server Health', url: 'http://localhost:3000' },
  { name: 'Members API', url: 'http://localhost:3000/api/members' },
  { name: 'Class Leaders API', url: 'http://localhost:3000/api/class-leaders' },
  { name: 'Events API', url: 'http://localhost:3000/api/events' },
  { name: 'Executives API', url: 'http://localhost:3000/api/executives' },
  { name: 'Resources API', url: 'http://localhost:3000/api/resources' },
  { name: 'Static Files (index.html)', url: 'http://localhost:3000/index.html' },
  { name: 'Members Page', url: 'http://localhost:3000/members.html' },
  { name: 'Admin Page', url: 'http://localhost:3000/admin.html' }
];

let passed = 0;
let failed = 0;

console.log('\n=== CRITICAL TESTING RESULTS ===\n');

async function runTests() {
  for (const test of tests) {
    await new Promise(resolve => {
      http.get(test.url, (res) => {
        if (res.statusCode === 200) {
          console.log(`✓ ${test.name}: ${res.statusCode}`);
          passed++;
        } else {
          console.log(`✗ ${test.name}: ${res.statusCode}`);
          failed++;
        }
        res.on('data', () => {});
        res.on('end', resolve);
      }).on('error', (err) => {
        console.log(`✗ ${test.name}: FAILED - ${err.message}`);
        failed++;
        resolve();
      });
    });
  }

  console.log('\n================================');
  console.log(`Total Tests: ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

setTimeout(runTests, 1000);
