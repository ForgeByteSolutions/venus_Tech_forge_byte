const fs = require('fs');
const content = fs.readFileSync('backend/src/modules/compatibility/compatibility.controller.ts', 'utf8');

const areas = [
  'MBRAuth',
  'CatStatus',
  'Mitigation',
  'Mitigations',
  'SelfLimit',
  'OR',
  'EtoE',
  'EtoGen',
  'EtoPPAs',
  'EtoVA',
  'IMSS',
  'IPSS'
];

areas.forEach(a => {
  const regex = new RegExp(`['"]${a}['"]|${a.toLowerCase()}`, 'i');
  const count = (content.match(regex) || []).length;
  console.log(`${a}: found regex match ${count > 0}`);
});

// Check where GetListByCID is implemented
const listMatches = content.match(/GetListByCID[\s\S]*?(?=\n\s*(?:async|private|@))/g);
if (listMatches) {
  console.log('\nGetListByCID matches count:', listMatches.length);
  listMatches.forEach((m, idx) => console.log(`--- Match ${idx} ---\n`, m.slice(0, 300)));
}

// Check where InsUpd is implemented
const insUpdMatches = content.match(/InsUpd[\s\S]*?(?=\n\s*(?:async|private|@))/g);
if (insUpdMatches) {
  console.log('\nInsUpd matches count:', insUpdMatches.length);
  insUpdMatches.forEach((m, idx) => console.log(`--- Match ${idx} ---\n`, m.slice(0, 300)));
}
