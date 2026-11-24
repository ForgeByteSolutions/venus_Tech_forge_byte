const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

function waitForDb(retries = 20) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      if (n <= 0) return reject(new Error('Backend did not start in time'));
      const req = http.get('http://127.0.0.1:3000/api/diagnostics/db', (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          setTimeout(() => attempt(n - 1), 500);
        }
      });
      req.on('error', () => {
        setTimeout(() => attempt(n - 1), 500);
      });
    };
    attempt(retries);
  });
}

async function main() {
  console.log('Starting backend server for test verification...');
  const server = spawn('node', [path.join(__dirname, '..', 'dist', 'main.js')], {
    stdio: 'inherit',
    env: process.env,
  });

  try {
    await waitForDb();
    console.log('Backend ready. Running test-all-crud.js...');
    // Run test script
    await new Promise((resolve, reject) => {
      const testProcess = spawn('node', [path.join(__dirname, 'test-all-crud.js')], {
        stdio: 'inherit',
      });
      testProcess.on('exit', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Test exited with code ${code}`));
      });
      testProcess.on('error', reject);
    });
    console.log('All CRUD tests finished!');
  } finally {
    console.log('Stopping test backend...');
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
