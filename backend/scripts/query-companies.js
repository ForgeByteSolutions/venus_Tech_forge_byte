const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const companies = await prisma.company.findMany();
  console.log('Total companies in DB:', companies.length);
  for (const c of companies) {
    console.log(`cid: ${c.cid}, name: ${c.name}, companyId: ${c.companyId}, tradingName: ${c.tradingName}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
