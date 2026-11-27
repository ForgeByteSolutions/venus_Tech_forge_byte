const path = require('path');
const { PrismaClient } = require(path.join(__dirname, '../node_modules/@prisma/client'));
const prisma = new PrismaClient();

async function main() {
  console.log('Activating all companies in database...');
  const res = await prisma.company.updateMany({
    data: {
      isActive: true
    }
  });
  console.log(`Updated ${res.count} companies to isActive = true.`);

  // Also verify/ensure Venus Clean Energy and ForgeByte Solar exist as active companies
  const c1 = await prisma.company.upsert({
    where: { cid: 1 },
    update: {
      companyId: 'C100001',
      companyName: 'Venus Clean Energy Corp',
      fullName: 'Venus Clean Energy Corp',
      tradingName: 'Venus Clean Energy Corp',
      aid: 1,
      agid: 1,
      isActive: true
    },
    create: {
      cid: 1,
      companyId: 'C100001',
      companyName: 'Venus Clean Energy Corp',
      fullName: 'Venus Clean Energy Corp',
      tradingName: 'Venus Clean Energy Corp',
      aid: 1,
      agid: 1,
      isActive: true
    }
  });
  console.log('Company 1 verified:', c1.companyName, c1.companyId);

  const c2 = await prisma.company.upsert({
    where: { cid: 2 },
    update: {
      companyId: 'C100002',
      companyName: 'ForgeByte Solar Ventures LLC',
      fullName: 'ForgeByte Solar Ventures LLC',
      tradingName: 'ForgeByte Solar Ventures LLC',
      aid: 1,
      agid: 1,
      isActive: true
    },
    create: {
      cid: 2,
      companyId: 'C100002',
      companyName: 'ForgeByte Solar Ventures LLC',
      fullName: 'ForgeByte Solar Ventures LLC',
      tradingName: 'ForgeByte Solar Ventures LLC',
      aid: 1,
      agid: 1,
      isActive: true
    }
  });
  console.log('Company 2 verified:', c2.companyName, c2.companyId);

  // Also ensure Account Groups have active status
  await prisma.accountGroup.updateMany({
    where: { aid: 1 },
    data: { isActive: true }
  });
  console.log('Account groups for aid 1 marked active.');

  // Check final companies
  const finalComps = await prisma.company.findMany({ where: { isActive: true } });
  console.log('Active companies in DB:', finalComps.map(c => `${c.cid}: ${c.companyName} (${c.companyId})`));
}

main().finally(() => prisma.$disconnect());
