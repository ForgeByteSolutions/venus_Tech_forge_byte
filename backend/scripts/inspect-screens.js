const fs = require('fs');
const path = require('path');

const dir = 'frontend/src/app/features/entities/pages';
const files = [
  'authorizations/authorizations.component.ts',
  'category-status/category-status.component.ts',
  'mitigations/mitigations.component.ts',
  'self-limitations/self-limitations.component.ts',
  'operating-reserves/operating-reserves.component.ts',
  'entities-to-entities/entities-to-entities.component.ts',
  'entities-to-generator-assets/entities-to-generator-assets.component.ts',
  'entities-to-ppas/entities-to-ppas.component.ts',
  'entities-to-vertical-assets/entities-to-vertical-assets.component.ts',
  'indicative-pss/indicative-pss.component.ts',
  'indicative-mss/indicative-mss.component.ts'
];

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  console.log('\n=============================');
  console.log('FILE:', f);
  console.log('=============================');
  
  // Find API call endpoints
  const matches = [...content.matchAll(/apiService\.(get|post|delete|put)\(([^,\)]+)/g)];
  const apis = matches.map(m => m[1].toUpperCase() + ' ' + m[2].trim().replace(/['"`]/g, ''));
  console.log('APIs:', Array.from(new Set(apis)));

  // Find ngModel bindings
  const models = [...content.matchAll(/\[\(ngModel\)\]="([^"]+)"/g)].map(m => m[1]);
  console.log('Form Fields (ngModel):', Array.from(new Set(models)));

  // Look for save method
  const saveMethodMatch = content.match(/save\w*\([^)]*\)\s*\{[\s\S]*?(?=\n\s{2}\w+\()/);
  if (saveMethodMatch) {
    const lines = saveMethodMatch[0].split('\n').slice(0, 30);
    console.log('Save Method snippet:\n' + lines.join('\n'));
  }
});
