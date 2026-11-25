const fs = require('fs');

console.log('=== Checking Accounts, Company, Account Groups, and Assets components ===');

const targets = [
  { name: 'Account', file: 'frontend/src/app/features/account/account-page.component.ts' },
  { name: 'Company', file: 'frontend/src/app/features/company/company-page.component.ts' },
  { name: 'Company Admin', file: 'frontend/src/app/features/company/admin-company.component.ts' },
  { name: 'Assets', file: 'frontend/src/app/features/assets/assets-page.component.ts' }
];

for (const t of targets) {
  if (!fs.existsSync(t.file)) {
    console.log(`[${t.name}] File not found: ${t.file}`);
    continue;
  }
  const content = fs.readFileSync(t.file, 'utf8');
  console.log(`\n================ ${t.name} (${t.file}) ================`);
  const lines = content.split('\n');

  // Find edit method
  lines.forEach((l, i) => {
    if (l.match(/(onEdit|openEdit|editCompany|editAccount|editAsset)\s*\(/i)) {
      console.log(`EDIT: line ${i+1}: ${l.trim()}`);
    }
    if (l.match(/(onDelete|deleteCompany|deleteAccount|deleteAsset|deleteAccountGroup)\s*\(/i)) {
      console.log(`DELETE: line ${i+1}: ${l.trim()}`);
    }
    if (l.match(/(saveAccount|saveCompany|saveAsset|onSave|submit)\s*\(/i)) {
      console.log(`SAVE: line ${i+1}: ${l.trim()}`);
    }
  });
}
