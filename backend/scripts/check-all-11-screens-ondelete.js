const fs = require('fs');
const path = require('path');

const base = 'frontend/src/app/features/entities/pages';
const dirs = fs.readdirSync(base);

console.log('=== Checking onDelete in All 11 Screens ===');

for (const d of dirs) {
  const filePath = path.join(base, d, `${d}.component.ts`);
  if (!fs.existsSync(filePath)) continue;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^\s*(async\s+)?(onDelete\w*|delete\w*)\s*\(/)) {
      console.log(`\n--- [${d}] ${line.trim()} at line ${i+1} ---`);
      console.log(lines.slice(i, i + 15).join('\n'));
      break;
    }
  }
}
