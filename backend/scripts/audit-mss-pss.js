const fs = require('fs');

console.log('=== Checking Indicative MSS & PSS implementation ===');
for (const screen of ['indicative-mss', 'indicative-pss']) {
  const file = `frontend/src/app/features/entities/pages/${screen}/${screen}.component.ts`;
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\n---------------- ${screen} ----------------`);
  
  // Find save method
  const lines = content.split('\n');
  const saveStart = lines.findIndex(l => l.includes('saveData()'));
  console.log(`saveData() starting at line ${saveStart + 1}:`);
  console.log(lines.slice(saveStart, saveStart + 45).join('\n'));

  // Find parameter management
  const paramStart = lines.findIndex(l => l.includes('saveStudyParameters') || l.includes('openStudyParameters'));
  if (paramStart !== -1) {
    console.log(`\nStudy Parameters starting at line ${paramStart + 1}:`);
    console.log(lines.slice(paramStart, paramStart + 40).join('\n'));
  }
}
