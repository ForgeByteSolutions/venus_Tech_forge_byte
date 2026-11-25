const fs = require('fs');
const path = require('path');

const base = 'frontend/src/app/features/entities/pages';
const dirs = fs.readdirSync(base);

console.log('Auditing all 11 screens for onEdit field mapping & onDelete:');

for (const d of dirs) {
  const filePath = path.join(base, d, `${d}.component.ts`);
  if (!fs.existsSync(filePath)) continue;

  const content = fs.readFileSync(filePath, 'utf8');

  // Find onEdit implementation
  const editMatch = content.match(/(onEdit\w*|openEdit\w*)\s*\([^)]*\)\s*\{([^}]*)\}/s) ||
                    content.match(/(onEdit\w*|openEdit\w*)\s*\([^)]*\)\s*\{([\s\S]*?)(?=\n\s*(?:async\s+)?(?:onDelete|delete|save|close|open|get|set|\w+\s*\())/);

  // Find onDelete implementation
  const deleteMatch = content.match(/((?:async\s+)?(?:onDelete\w*|delete\w*))\s*\([^)]*\)\s*\{([\s\S]*?)(?=\n\s*(?:async\s+)?(?:onEdit|edit|save|close|open|toggle|\w+\s*\())/);

  console.log(`\n================== [ ${d} ] ==================`);
  if (editMatch) {
    console.log('EDIT SNIPPET:');
    console.log(editMatch[0].trim().substring(0, 500));
  } else {
    console.log('NO EDIT METHOD FOUND!');
  }

  if (deleteMatch) {
    console.log('\nDELETE SNIPPET:');
    console.log(deleteMatch[0].trim().substring(0, 300));
  } else {
    console.log('NO DELETE METHOD FOUND!');
  }
}
