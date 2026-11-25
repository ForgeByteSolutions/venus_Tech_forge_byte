const fs = require('fs');
const path = require('path');

const base = 'frontend/src/app/features/entities/pages';
const dirs = fs.readdirSync(base);

console.log('--- Checking Form Mapping in onEdit for All 11 Screens ---');

for (const d of dirs) {
  const filePath = path.join(base, d, `${d}.component.ts`);
  if (!fs.existsSync(filePath)) continue;

  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n================== [ ${d} ] ==================`);

  const lines = content.split('\n');
  const editIdx = lines.findIndex(l => l.match(/(onEdit|openEdit|onEditCategory)\s*\(/));
  if (editIdx !== -1) {
    console.log(lines.slice(editIdx, editIdx + 20).map(l => l.trim()).join('\n'));
  } else {
    console.log('NO onEdit FOUND!');
  }
}
