const fs = require('fs');
const path = require('path');

const base = 'frontend/src/app/features/entities/pages';
const dirs = fs.readdirSync(base);

console.log('Auditing 11 screens for onEdit, onDelete, and edit form data loading:');

for (const d of dirs) {
  const filePath = path.join(base, d, `${d}.component.ts`);
  if (!fs.existsSync(filePath)) continue;
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  const editFnMatch = content.match(/function\s+(\w+edit\w*)|(onEdit\w*|openEdit\w*|edit\w*)\s*\(/i);
  const deleteFnMatch = content.match(/function\s+(\w+delete\w*)|(onDelete\w*|delete\w*)\s*\(/i);
  
  // Find where edit method populates form
  const editMethods = [];
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.match(/(onEdit|openEdit|editItem|editRecord)\s*\(/i)) {
      editMethods.push({ line: i + 1, text: l.trim() });
    }
  });

  const deleteMethods = [];
  lines.forEach((l, i) => {
    if (l.match(/(onDelete|deleteItem|deleteRecord|deleteAuth|deleteCategory|deleteMitigation|deleteSelfLimit)\s*\(/i)) {
      deleteMethods.push({ line: i + 1, text: l.trim() });
    }
  });

  console.log(`\n=== [${d}] ===`);
  console.log(`  Edit methods:`, editMethods.map(m => m.text));
  console.log(`  Delete methods:`, deleteMethods.map(m => m.text));
}
