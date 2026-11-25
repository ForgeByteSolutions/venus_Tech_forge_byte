const fs = require('fs');
const path = require('path');

const base = 'frontend/src/app/features/entities/pages';
const dirs = fs.readdirSync(base);

console.log('--- Deep Check of onEdit and onDelete for all 11 screens ---');

for (const d of dirs) {
  const filePath = path.join(base, d, `${d}.component.ts`);
  if (!fs.existsSync(filePath)) continue;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Find edit method
  const editIdx = lines.findIndex(l => l.match(/^\s*(async\s+)?(onEdit|openEdit|onEditCategory)\s*\(/));
  const delIdx = lines.findIndex(l => l.match(/^\s*(async\s+)?(onDelete|delete\w*)\s*\(/));

  console.log(`\n================== [ ${d} ] ==================`);
  if (editIdx !== -1) {
    console.log(`EDIT: line ${editIdx + 1}: ${lines[editIdx].trim()}`);
    console.log(lines.slice(editIdx, editIdx + 20).join('\n'));
  } else {
    console.log('NO EDIT METHOD!');
  }

  if (delIdx !== -1) {
    console.log(`\nDELETE: line ${delIdx + 1}: ${lines[delIdx].trim()}`);
    console.log(lines.slice(delIdx, delIdx + 10).join('\n'));
  } else {
    console.log('NO DELETE METHOD!');
  }
}
