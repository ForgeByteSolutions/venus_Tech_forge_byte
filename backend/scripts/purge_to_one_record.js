const { PrismaClient } = require('../node_modules/@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://postgres:postgres@localhost:5435/venu_tech_db' } }
});

const MODULES = [
  { name: 'asset', label: 'Assets (Generation Assets)' },
  { name: 'entity', label: 'Entities' },
  { name: 'mbrAuthorization', label: 'MBR Authorizations' },
  { name: 'categoryStatus', label: 'Category Status' },
  { name: 'mitigation', label: 'Mitigations' },
  { name: 'operatingReserve', label: 'Operating Reserves' },
  { name: 'selfLimitation', label: 'Self Limitations' },
  { name: 'entityToEntity', label: 'Entities to Entities' },
  { name: 'entityToGeneratorAsset', label: 'Entities to Generator Assets' },
  { name: 'entityToPpa', label: 'Entities to PPAs' },
  { name: 'entityToVerticalAsset', label: 'Entities to Vertical Assets' },
  { name: 'indicativeMarketScreenStudy', label: 'Indicative MSS Studies' },
  { name: 'imssParameter', label: 'IMSS Parameters' },
  { name: 'indicativePowerSupplyStudy', label: 'Indicative PSS Studies' },
  { name: 'ipssParameter', label: 'IPSS Parameters' },
  { name: 'filing', label: 'FERC Filings' },
  { name: 'invoice', label: 'Invoices' },
];

async function purgeToOneRecord() {
  console.log('====================================================');
  console.log(' PURGING DATABASE: KEEP EXACTLY 1 RECORD PER MODULE ');
  console.log('====================================================\n');

  for (const mod of MODULES) {
    try {
      // Find all records
      const allRecords = await prisma[mod.name].findMany({
        orderBy: [{ id: 'asc' }]
      });

      if (allRecords.length === 0) {
        console.log(`[${mod.label}] Count: 0 - No records found to keep.`);
        continue;
      }

      // Choose the single best record to keep: prefer cid == 1 and isActive == true
      let keepRecord = allRecords.find(r => r.cid === 1 && r.isActive === true);
      if (!keepRecord) {
        keepRecord = allRecords.find(r => r.cid === 1) || allRecords[0];
      }

      // Ensure the kept record is active if it has isActive field
      if (keepRecord.isActive === false) {
        await prisma[mod.name].update({
          where: { id: keepRecord.id },
          data: { isActive: true }
        });
      }

      // Delete all OTHER records
      const deleteResult = await prisma[mod.name].deleteMany({
        where: {
          id: { not: keepRecord.id }
        }
      });

      const remainingCount = await prisma[mod.name].count();
      console.log(`✓ [${mod.label.padEnd(30)}] Kept ID: ${keepRecord.id.slice(0, 15)}... | Deleted: ${deleteResult.count} | Remaining: ${remainingCount}`);
    } catch (err) {
      console.error(`✗ Error processing ${mod.label}:`, err.message);
    }
  }

  // Clean temporary automation users
  console.log('\n--- Cleaning Temporary Test Users ---');
  try {
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { startsWith: 'auto.test.' } },
          { email: { startsWith: 'tester_' } }
        ]
      }
    });
    console.log(`✓ Deleted ${deletedUsers.count} temporary test users.`);
    const remainingUsers = await prisma.user.findMany({
      select: { uid: true, email: true, name: true, role: true }
    });
    console.log('Active permanent users:', remainingUsers);
  } catch (err) {
    console.error('Error cleaning users:', err.message);
  }

  console.log('\n====================================================');
  console.log(' FINAL MODULE COUNTS (VERIFICATION)');
  console.log('====================================================');
  for (const mod of MODULES) {
    try {
      const count = await prisma[mod.name].count();
      console.log(`  ${mod.label.padEnd(32)}: ${count} record(s)`);
    } catch (e) {
      console.log(`  ${mod.label.padEnd(32)}: ERR`);
    }
  }
}

purgeToOneRecord().finally(() => prisma.$disconnect());
