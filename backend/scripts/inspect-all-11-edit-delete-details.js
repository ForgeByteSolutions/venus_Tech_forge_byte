const fs = require('fs');
const path = require('path');

const base = 'frontend/src/app/features/entities/pages';
const dirs = fs.readdirSync(base);

console.log('--- Deep Check of onEdit and onDelete for all 11 screens ---');

for (const d of dirs) {
  const filePath = path.join(base, d, `${d}.component.ts`);
  if (!fs.existsSync(filePath)) continue;

  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n================== ${d} ==================`);

  // Check onEdit
  const lines = content.split('\n');
  const editStart = lines.findIndex(l => l.match(/(onEdit|openEdit)\s*\(/));
  if (editStart !== -1) {
    console.log(`[onEdit] (line ${editStart + 1}):`);
    console.log(lines.slice(editStart, editStart + 25).join('\n'));
  } else {
    console.log('[onEdit] MISSING!');
  }

  // Check onDelete
  const delStart = lines.findIndex(l => l.match(/(async\s+)?(onDelete|delete\w*)\s*\(/));
  if (delStart !== -1) {
    console.log(`\n[onDelete] (line ${delStart + 1}):`);
    console.log(lines.slice(delStart, delStart + 15).join('\n'));
  } else {
    console.log('\n[onDelete] MISSING!');
  }
}
