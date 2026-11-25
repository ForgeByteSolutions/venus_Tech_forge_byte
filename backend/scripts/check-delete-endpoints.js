const fs = require('fs');

const path = 'backend/src/modules/compatibility/compatibility.controller.ts';
const content = fs.readFileSync(path, 'utf8');

console.log('Backend compatibility routes for DELETE:');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('@Delete') || (l.includes('delete') && l.includes('DeleteByID'))) {
    console.log(i + 1, l.trim());
  }
});
