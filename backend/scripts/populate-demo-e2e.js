const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning up corrupted test companies and populating clean E2E demo data ---');

  // 1. ACCOUNTS
  const acc1 = await prisma.account.upsert({
    where: { aid: 1 },
    update: {
      name: 'Venus Demo Account',
      accName: 'Venus Demo Account',
      accountName: 'Venus Demo Account',
      url: 'https://venus.example.com',
      isActive: true,
    },
    create: {
      aid: 1,
      name: 'Venus Demo Account',
      accName: 'Venus Demo Account',
      accountName: 'Venus Demo Account',
      url: 'https://venus.example.com',
      isActive: true,
    },
  });

  const acc2 = await prisma.account.upsert({
    where: { aid: 2 },
    update: {
      name: 'ForgeByte Energy Partners',
      accName: 'ForgeByte Energy Partners',
      accountName: 'ForgeByte Energy Partners',
      url: 'https://forgebyte.ai',
      isActive: true,
    },
    create: {
      aid: 2,
      name: 'ForgeByte Energy Partners',
      accName: 'ForgeByte Energy Partners',
      accountName: 'ForgeByte Energy Partners',
      url: 'https://forgebyte.ai',
      isActive: true,
    },
  });

  // Account Groups
  await prisma.accountGroup.upsert({
    where: { agid: 1 },
    update: { aid: 1, gid: 1, name: 'Western Operations Group', groupname: 'Western Operations Group', isActive: true },
    create: { agid: 1, aid: 1, gid: 1, name: 'Western Operations Group', groupname: 'Western Operations Group', isActive: true },
  });

  await prisma.accountGroup.upsert({
    where: { agid: 2 },
    update: { aid: 1, gid: 2, name: 'Eastern Power Group', groupname: 'Eastern Power Group', isActive: true },
    create: { agid: 2, aid: 1, gid: 2, name: 'Eastern Power Group', groupname: 'Eastern Power Group', isActive: true },
  });

  // 2. COMPANIES (CLEAN & COMPLETE)
  // Delete corrupted dummy companies 3, 4, 5
  await prisma.company.deleteMany({
    where: { cid: { in: [3, 4, 5] } }
  });

  const comp1Data = {
    company_id: 'C100001',
    companyID: 'C100001',
    CompanyID: 'C100001',
    Title: 'Venus Clean Energy Corp',
    title: 'Venus Clean Energy Corp',
    companyName: 'Venus Clean Energy Corp',
    fullName: 'Venus Clean Energy Corporation',
    tradingName: 'Venus Energy',
    validation_email: 'ferc.ereg@venusenergy.com',
    validationEmail: 'ferc.ereg@venusenergy.com',
    email: 'guna@gmail.com',
    eMail: 'guna@gmail.com',
    billing_email: 'billing@venusenergy.com',
    billingEmail: 'billing@venusenergy.com',
    ContactName: 'Guna Sekhar',
    BillingName: 'Accounts Payable',
    phone1: '984-801-2345',
    phone2: '984-801-9988',
    description: 'Primary MBR operating entity in CAISO and WECC regions.',
    notes: 'Primary MBR operating entity in CAISO and WECC regions.',
    IsActive: true,
    isActive: true,
  };

  await prisma.company.upsert({
    where: { cid: 1 },
    update: {
      aid: 1,
      agid: 1,
      companyId: 'C100001',
      companyName: 'Venus Clean Energy Corp',
      fullName: 'Venus Clean Energy Corporation',
      tradingName: 'Venus Energy',
      isActive: true,
      data: comp1Data,
    },
    create: {
      cid: 1,
      aid: 1,
      agid: 1,
      companyId: 'C100001',
      companyName: 'Venus Clean Energy Corp',
      fullName: 'Venus Clean Energy Corporation',
      tradingName: 'Venus Energy',
      isActive: true,
      data: comp1Data,
    },
  });

  await prisma.companyFilingFlags.upsert({
    where: { cid: 1 },
    update: { includeAssets: true, includeEntities: true, includeFilings: true },
    create: { cid: 1, includeAssets: true, includeEntities: true, includeFilings: true },
  });

  const comp2Data = {
    company_id: 'C100002',
    companyID: 'C100002',
    CompanyID: 'C100002',
    Title: 'ForgeByte Solar Ventures LLC',
    title: 'ForgeByte Solar Ventures LLC',
    companyName: 'ForgeByte Solar Ventures LLC',
    fullName: 'ForgeByte Solar Ventures Limited Liability Company',
    tradingName: 'ForgeByte Solar',
    validation_email: 'ereg@forgebyte.ai',
    validationEmail: 'ereg@forgebyte.ai',
    email: 'puttugunasekhar@forgebyte.ai',
    eMail: 'puttugunasekhar@forgebyte.ai',
    billing_email: 'finance@forgebyte.ai',
    billingEmail: 'finance@forgebyte.ai',
    ContactName: 'Preetham Kantubhukta',
    BillingName: 'Corporate Finance',
    phone1: '984-801-9988',
    phone2: '984-801-2345',
    description: 'Solar generation asset holding affiliate operating under market-based rate authority.',
    notes: 'Solar generation asset holding affiliate operating under market-based rate authority.',
    IsActive: true,
    isActive: true,
  };

  await prisma.company.upsert({
    where: { cid: 2 },
    update: {
      aid: 1,
      agid: 1,
      companyId: 'C100002',
      companyName: 'ForgeByte Solar Ventures LLC',
      fullName: 'ForgeByte Solar Ventures Limited Liability Company',
      tradingName: 'ForgeByte Solar',
      isActive: true,
      data: comp2Data,
    },
    create: {
      cid: 2,
      aid: 1,
      agid: 1,
      companyId: 'C100002',
      companyName: 'ForgeByte Solar Ventures LLC',
      fullName: 'ForgeByte Solar Ventures Limited Liability Company',
      tradingName: 'ForgeByte Solar',
      isActive: true,
      data: comp2Data,
    },
  });

  await prisma.companyFilingFlags.upsert({
    where: { cid: 2 },
    update: { includeAssets: true, includeEntities: true, includeFilings: true },
    create: { cid: 2, includeAssets: true, includeEntities: true, includeFilings: true },
  });

  // 3. ASSETS
  await prisma.asset.upsert({
    where: { assetid: 1 },
    update: {
      cid: 1,
      assetName: 'Desert Sunlight Solar Array',
      name: 'Desert Sunlight Solar Array',
      isActive: true,
      data: { assetName: 'Desert Sunlight Solar Array', assetType: 'Solar', capacity: 150, region: 'CAISO', cod: '2024-06-01' },
    },
    create: {
      assetid: 1,
      cid: 1,
      assetName: 'Desert Sunlight Solar Array',
      name: 'Desert Sunlight Solar Array',
      isActive: true,
      data: { assetName: 'Desert Sunlight Solar Array', assetType: 'Solar', capacity: 150, region: 'CAISO', cod: '2024-06-01' },
    },
  });

  await prisma.asset.upsert({
    where: { assetid: 2 },
    update: {
      cid: 1,
      assetName: 'Sierra Wind Energy Park',
      name: 'Sierra Wind Energy Park',
      isActive: true,
      data: { assetName: 'Sierra Wind Energy Park', assetType: 'Wind', capacity: 85, region: 'WECC', cod: '2025-03-15' },
    },
    create: {
      assetid: 2,
      cid: 1,
      assetName: 'Sierra Wind Energy Park',
      name: 'Sierra Wind Energy Park',
      isActive: true,
      data: { assetName: 'Sierra Wind Energy Park', assetType: 'Wind', capacity: 85, region: 'WECC', cod: '2025-03-15' },
    },
  });

  // 4. ENTITIES (SCREEN 1)
  await prisma.entity.upsert({
    where: { entityid: 1 },
    update: {
      cid: 1,
      entityName: 'Venus Power Trading LLC',
      name: 'Venus Power Trading LLC',
      isActive: true,
      data: { entityName: 'Venus Power Trading LLC', entity_ID_type_cd: 'DUNS', entity_ID: 'DUNS-99201102' },
    },
    create: {
      entityid: 1,
      cid: 1,
      entityName: 'Venus Power Trading LLC',
      name: 'Venus Power Trading LLC',
      isActive: true,
      data: { entityName: 'Venus Power Trading LLC', entity_ID_type_cd: 'DUNS', entity_ID: 'DUNS-99201102' },
    },
  });

  // 5. MBR AUTHORIZATIONS (SCREEN 2)
  await prisma.mbrAuthorization.upsert({
    where: { mbrauthid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        mbrauthid: 1,
        cid: 1,
        tariff_affiliate_tariff_id: 'FERC-TAR-001',
        docket_num: 'ER26-100-000',
        order_date: '2026-01-15T00:00:00.000Z',
        description: 'FERC market-based rate authorization order',
      },
    },
    create: {
      mbrauthid: 1,
      cid: 1,
      isActive: true,
      data: {
        mbrauthid: 1,
        cid: 1,
        tariff_affiliate_tariff_id: 'FERC-TAR-001',
        docket_num: 'ER26-100-000',
        order_date: '2026-01-15T00:00:00.000Z',
        description: 'FERC market-based rate authorization order',
      },
    },
  });

  // 6. CATEGORY STATUS (SCREEN 3)
  await prisma.categoryStatus.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        region: 'CAISO',
        region_cd: 'CAISO',
        cat_status_desc: 'Category 1 Seller - CAISO',
        cat_status_in_region_fk: 1,
        cat_status_effective_date: '2026-01-01T00:00:00.000Z',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        region: 'CAISO',
        region_cd: 'CAISO',
        cat_status_desc: 'Category 1 Seller - CAISO',
        cat_status_in_region_fk: 1,
        cat_status_effective_date: '2026-01-01T00:00:00.000Z',
      },
    },
  });

  // 7. MITIGATIONS (SCREEN 4)
  await prisma.mitigation.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        docket_num: 'ER26-150-000',
        mitigation_desc: 'Market Power Mitigation Agreement & Cost-Based Rate Cap',
        order_date: '2026-02-01T00:00:00.000Z',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        docket_num: 'ER26-150-000',
        mitigation_desc: 'Market Power Mitigation Agreement & Cost-Based Rate Cap',
        order_date: '2026-02-01T00:00:00.000Z',
      },
    },
  });

  // 8. SELF LIMITATIONS (SCREEN 5)
  await prisma.selfLimitation.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        docket_num: 'ER26-200-000',
        description: 'Self-imposed 250MW capacity limitation in SPP balancing authority',
        effective_date: '2026-01-01T00:00:00.000Z',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        docket_num: 'ER26-200-000',
        description: 'Self-imposed 250MW capacity limitation in SPP balancing authority',
        effective_date: '2026-01-01T00:00:00.000Z',
      },
    },
  });

  // 9. OPERATING RESERVES (SCREEN 6)
  await prisma.operatingReserve.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        balancing_Authority_cd: 'CISO',
        description: 'Spinning and supplemental reserve commitment under CAISO tariff',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        balancing_Authority_cd: 'CISO',
        description: 'Spinning and supplemental reserve commitment under CAISO tariff',
      },
    },
  });

  // 10. ENTITY TO ENTITY (SCREEN 7)
  await prisma.entityToEntity.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        affiliate_name: 'Venus Power Trading LLC',
        ownership_percentage: 100,
        relationship_type: 'Wholly-Owned Subsidiary',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        affiliate_name: 'Venus Power Trading LLC',
        ownership_percentage: 100,
        relationship_type: 'Wholly-Owned Subsidiary',
      },
    },
  });

  // 11. ENTITY TO GEN ASSET (SCREEN 8)
  await prisma.entityToGeneratorAsset.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        gen_asset_name: 'Desert Sunlight Solar Array',
        capacity: 150,
        interconnection: 'CAISO 230kV Substation',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        gen_asset_name: 'Desert Sunlight Solar Array',
        capacity: 150,
        interconnection: 'CAISO 230kV Substation',
      },
    },
  });

  // 12. ENTITY TO PPA (SCREEN 9)
  await prisma.entityToPpa.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        ppa_contract_id: 'PPA-2026-CAISO-01',
        megawatts: 100,
        counterparty: 'Pacific Gas & Electric Company',
        contract_start: '2026-01-01',
        contract_end: '2036-12-31',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        ppa_contract_id: 'PPA-2026-CAISO-01',
        megawatts: 100,
        counterparty: 'Pacific Gas & Electric Company',
        contract_start: '2026-01-01',
        contract_end: '2036-12-31',
      },
    },
  });

  // 13. ENTITY TO VERTICAL ASSET (SCREEN 10)
  await prisma.entityToVerticalAsset.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        vertical_asset_name: 'Mojave Gas Lateral Pipeline',
        asset_type: 'Natural Gas Transmission',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        vertical_asset_name: 'Mojave Gas Lateral Pipeline',
        asset_type: 'Natural Gas Transmission',
      },
    },
  });

  // 14. MARKET STUDIES (SCREEN 11)
  await prisma.indicativeMarketScreenStudy.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        study_name: 'CAISO Delivered Price Test 2026',
        screen_type: 'Pivotal Supplier Analysis',
        result: 'PASSED',
        notes: 'Applicant passes both pivotal supplier and market share screens.',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        study_name: 'CAISO Delivered Price Test 2026',
        screen_type: 'Pivotal Supplier Analysis',
        result: 'PASSED',
        notes: 'Applicant passes both pivotal supplier and market share screens.',
      },
    },
  });

  await prisma.indicativePowerSupplyStudy.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        study_name: 'WECC Power Supply Assessment',
        screen_type: 'Market Share Analysis',
        result: 'PASSED',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        study_name: 'WECC Power Supply Assessment',
        screen_type: 'Market Share Analysis',
        result: 'PASSED',
      },
    },
  });

  // 15. FILINGS
  await prisma.filing.upsert({
    where: { fid: 1 },
    update: {
      cid: 1,
      uid: 1,
      status: 'Ready For Submission',
      isActive: true,
      data: {
        fid: 1,
        cid: 1,
        docketNumber: 'ER26-100-000',
        filingType: 'Baseline MBR Filing',
        status: 'Ready For Submission',
        description: 'Comprehensive 2026 Market-Based Rate Baseline Filing',
      },
    },
    create: {
      fid: 1,
      cid: 1,
      uid: 1,
      status: 'Ready For Submission',
      isActive: true,
      data: {
        fid: 1,
        cid: 1,
        docketNumber: 'ER26-100-000',
        filingType: 'Baseline MBR Filing',
        status: 'Ready For Submission',
        description: 'Comprehensive 2026 Market-Based Rate Baseline Filing',
      },
    },
  });

  // 16. INVOICES
  await prisma.invoice.upsert({
    where: { invoiceId: 1 },
    update: {
      cid: 1,
      aid: 1,
      agid: 1,
      isSent: true,
      isBilled: true,
      isPaid: true,
      isActive: true,
      data: {
        invoiceId: 1,
        invoiceNumber: 'VENUS-INV-2026-001',
        amount: 2500,
        status: 'Paid',
      },
    },
    create: {
      invoiceId: 1,
      cid: 1,
      aid: 1,
      agid: 1,
      isSent: true,
      isBilled: true,
      isPaid: true,
      isActive: true,
      data: {
        invoiceId: 1,
        invoiceNumber: 'VENUS-INV-2026-001',
        amount: 2500,
        status: 'Paid',
      },
    },
  });

  console.log('--- ALL CLEAN DEMO DATA SUCCESSFULLY SEEDED INTO POSTGRES ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
