const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  console.log('--- Cleaning up and populating full production-grade E2E data for Company 1 & 2 ---');

  // Password hash for all demo users
  const passwordHash = await bcrypt.hash('Latha@2004', 10);

  // 1. ROLES
  const roles = [
    { gid: 1, name: 'Site Admin', rolename: 'Site Admin' },
    { gid: 2, name: 'Account Admin', rolename: 'Account Admin' },
    { gid: 3, name: 'Company User', rolename: 'Company User' },
    { gid: 4, name: 'Read Only User', rolename: 'Read Only User' },
  ];
  for (const r of roles) {
    await prisma.role.upsert({
      where: { gid: r.gid },
      update: { name: r.name, rolename: r.rolename, isActive: true },
      create: { gid: r.gid, name: r.name, rolename: r.rolename, isActive: true },
    });
  }

  // 2. ACCOUNTS
  await prisma.account.upsert({
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

  await prisma.account.upsert({
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

  // Clean up corrupted dummy companies 3, 4, 5
  await prisma.company.deleteMany({
    where: { cid: { in: [3, 4, 5] } }
  });

  // 3. COMPANIES
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
    email: 'puttuguna@gmail.com',
    eMail: 'puttuguna@gmail.com',
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

  // 4. USERS
  await prisma.user.upsert({
    where: { email: 'puttugunasekhar@forgebyte.ai' },
    update: {
      name: 'Guna Sekhar (Admin)',
      password: passwordHash,
      role: 'Site Admin',
      aid: 1,
      cid: 1,
      gid: 1,
      companyIds: '1,2',
      isActive: true,
    },
    create: {
      name: 'Guna Sekhar (Admin)',
      email: 'puttugunasekhar@forgebyte.ai',
      password: passwordHash,
      role: 'Site Admin',
      aid: 1,
      cid: 1,
      gid: 1,
      companyIds: '1,2',
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'puttuguna@gmail.com' },
    update: {
      name: 'Guna Sekhar',
      password: passwordHash,
      role: 'Account Admin',
      aid: 1,
      cid: 1,
      gid: 2,
      companyIds: '1,2',
      isActive: true,
    },
    create: {
      name: 'Guna Sekhar',
      email: 'puttuguna@gmail.com',
      password: passwordHash,
      role: 'Account Admin',
      aid: 1,
      cid: 1,
      gid: 2,
      companyIds: '1,2',
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'preetham@forgebyte.ai' },
    update: {
      name: 'Preetham Kantubhukta',
      password: passwordHash,
      role: 'Company User',
      aid: 1,
      cid: 2,
      gid: 3,
      companyIds: '2',
      isActive: true,
    },
    create: {
      name: 'Preetham Kantubhukta',
      email: 'preetham@forgebyte.ai',
      password: passwordHash,
      role: 'Company User',
      aid: 1,
      cid: 2,
      gid: 3,
      companyIds: '2',
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'audit@forgebyte.ai' },
    update: {
      name: 'Internal Auditor',
      password: passwordHash,
      role: 'Read Only User',
      aid: 1,
      cid: 2,
      gid: 4,
      companyIds: '2',
      isActive: true,
    },
    create: {
      name: 'Internal Auditor',
      email: 'audit@forgebyte.ai',
      password: passwordHash,
      role: 'Read Only User',
      aid: 1,
      cid: 2,
      gid: 4,
      companyIds: '2',
      isActive: true,
    },
  });

  // 5. ASSETS (BOTH COMPANIES)
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
    where: { assetid: 10 },
    update: {
      cid: 2,
      assetName: 'Mojave Solar Facility Alpha',
      name: 'Mojave Solar Facility Alpha',
      isActive: true,
      data: { assetName: 'Mojave Solar Facility Alpha', assetType: 'Solar', capacity: 250, region: 'PJM', cod: '2025-01-01' },
    },
    create: {
      assetid: 10,
      cid: 2,
      assetName: 'Mojave Solar Facility Alpha',
      name: 'Mojave Solar Facility Alpha',
      isActive: true,
      data: { assetName: 'Mojave Solar Facility Alpha', assetType: 'Solar', capacity: 250, region: 'PJM', cod: '2025-01-01' },
    },
  });

  // =========================================================================
  // ALL 11 ENTITY SCREENS FOR COMPANY 1 (CID: 1)
  // =========================================================================

  // Screen 1: Entities
  await prisma.entity.upsert({
    where: { entityid: 1 },
    update: {
      cid: 1,
      entityName: 'Venus Power Trading LLC',
      name: 'Venus Power Trading LLC',
      isActive: true,
      data: { entityName: 'Venus Power Trading LLC', entity_ID_type_cd: 'CID', entity_ID: 'C100001' },
    },
    create: {
      entityid: 1,
      cid: 1,
      entityName: 'Venus Power Trading LLC',
      name: 'Venus Power Trading LLC',
      isActive: true,
      data: { entityName: 'Venus Power Trading LLC', entity_ID_type_cd: 'CID', entity_ID: 'C100001' },
    },
  });

  // Screen 2: MBR Authorizations
  await prisma.mbrAuthorization.upsert({
    where: { mbrauthid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        mbrauthid: 1,
        cid: 1,
        authorization_docket_number: 'ER26-100-000',
        authorization_docket: 'ER26-100-000',
        authorization_effective_date: '2026-01-15',
        authorization_effective_date1: '2026-01-15',
        cancellation_docket_number: 'ER24-050-000',
        cancellation_effective_date: '2025-12-31',
        record_type_cd: 'New',
        reference_id: null,
      },
    },
    create: {
      mbrauthid: 1,
      cid: 1,
      isActive: true,
      data: {
        mbrauthid: 1,
        cid: 1,
        authorization_docket_number: 'ER26-100-000',
        authorization_docket: 'ER26-100-000',
        authorization_effective_date: '2026-01-15',
        authorization_effective_date1: '2026-01-15',
        cancellation_docket_number: 'ER24-050-000',
        cancellation_effective_date: '2025-12-31',
        record_type_cd: 'New',
        reference_id: null,
      },
    },
  });

  // Screen 3: Category Status
  await prisma.categoryStatus.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        region_cd: 'CAISO',
        region_desc: 'California ISO',
        cat_status_in_region_fk: 1,
        cat_status_in_region_desc: 'Category 1 Seller',
        cat_status_effective_date: '2026-01-01',
        cat_status_effective_date1: '2026-01-01',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        region_cd: 'CAISO',
        region_desc: 'California ISO',
        cat_status_in_region_fk: 1,
        cat_status_in_region_desc: 'Category 1 Seller',
        cat_status_effective_date: '2026-01-01',
        cat_status_effective_date1: '2026-01-01',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 4: Mitigations
  await prisma.mitigation.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        balancing_Authority_cd: 'CAISO',
        mitigation_narrative: 'Default Energy Bid Mitigation in CAISO Market',
        mitigation_effective_date: '2026-01-01',
        mitigation_effective_date1: '2026-01-01',
        mitigation_end_date: '2030-12-31',
        mitigation_end_date1: '2030-12-31',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        balancing_Authority_cd: 'CAISO',
        mitigation_narrative: 'Default Energy Bid Mitigation in CAISO Market',
        mitigation_effective_date: '2026-01-01',
        mitigation_effective_date1: '2026-01-01',
        mitigation_end_date: '2030-12-31',
        mitigation_end_date1: '2030-12-31',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 5: Self Limitations
  await prisma.selfLimitation.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        region_cd: 'CAISO',
        region_desc: 'California ISO',
        balancing_Authority_cd: 'CAISO',
        self_limit_effective_date: '2026-01-01',
        self_limit_effective_date1: '2026-01-01',
        self_limit_end_date: '2030-12-31',
        self_limit_end_date1: '2030-12-31',
        description: 'Voluntary power export limit in CAISO',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        region_cd: 'CAISO',
        region_desc: 'California ISO',
        balancing_Authority_cd: 'CAISO',
        self_limit_effective_date: '2026-01-01',
        self_limit_effective_date1: '2026-01-01',
        self_limit_end_date: '2030-12-31',
        self_limit_end_date1: '2030-12-31',
        description: 'Voluntary power export limit in CAISO',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 6: Operating Reserves
  await prisma.operatingReserve.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        balancing_Authority_cd: 'CAISO',
        or_authorization_effective_date: '2026-01-01',
        or_authorization_effective_date1: '2026-01-01',
        or_authorization_end_date: '2030-12-31',
        or_authorization_end_date1: '2030-12-31',
        description: 'Spinning and Supplemental Operating Reserves (100MW)',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        balancing_Authority_cd: 'CAISO',
        or_authorization_effective_date: '2026-01-01',
        or_authorization_effective_date1: '2026-01-01',
        or_authorization_end_date: '2030-12-31',
        or_authorization_end_date1: '2030-12-31',
        description: 'Spinning and Supplemental Operating Reserves (100MW)',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 7: Entities to Entities
  await prisma.entityToEntity.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        reportable_entity_ID_type_CD: 'CID',
        reportable_entity_ID: 'C100002',
        Blanket_Auth_Docket_Number: 'ER26-100-000',
        Utility_ID_Type_CD: 'CID',
        Utility_ID: 'C100001',
        relationship_start_date: '2026-01-01',
        relationship_start_date1: '2026-01-01',
        relationship_end_date: '2030-12-31',
        relationship_end_date1: '2030-12-31',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        reportable_entity_ID_type_CD: 'CID',
        reportable_entity_ID: 'C100002',
        Blanket_Auth_Docket_Number: 'ER26-100-000',
        Utility_ID_Type_CD: 'CID',
        Utility_ID: 'C100001',
        relationship_start_date: '2026-01-01',
        relationship_start_date1: '2026-01-01',
        relationship_end_date: '2030-12-31',
        relationship_end_date1: '2030-12-31',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 8: Entities to Generator Assets
  await prisma.entityToGeneratorAsset.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        generation_asset_type_id: 1,
        gen_asset_type: 'Solar',
        asset_code: '57822',
        eia_plant_code: '57822',
        eia_generator_id: 'GEN1',
        entity_ID_type_CD: 'CID',
        entity_ID: 'C100001',
        relationship_type: 'Owner',
        relationship_type_fk: 1,
        relationship_start_date: '2026-01-01',
        relationship_start_date1: '2026-01-01',
        relationship_end_date: '2035-12-31',
        relationship_end_date1: '2035-12-31',
        physical_location_Balancing_Authority_cd: 'CAISO',
        telemetered_location_Balancing_Authority_cd: 'CAISO',
        amount: '150',
        cap_rating_adjusted: '150',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        generation_asset_type_id: 1,
        gen_asset_type: 'Solar',
        asset_code: '57822',
        eia_plant_code: '57822',
        eia_generator_id: 'GEN1',
        entity_ID_type_CD: 'CID',
        entity_ID: 'C100001',
        relationship_type: 'Owner',
        relationship_type_fk: 1,
        relationship_start_date: '2026-01-01',
        relationship_start_date1: '2026-01-01',
        relationship_end_date: '2035-12-31',
        relationship_end_date1: '2035-12-31',
        physical_location_Balancing_Authority_cd: 'CAISO',
        telemetered_location_Balancing_Authority_cd: 'CAISO',
        amount: '150',
        cap_rating_adjusted: '150',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 9: Entities to PPAs
  await prisma.entityToPpa.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        ppa_agreement_id: 'PPA-VENUS-2026-01',
        entity_ID_type_CD: 'CID',
        entity_ID: 'C100001',
        counterparty_ID_type_CD: 'CID',
        counterparty_ID: 'C999999',
        start_date: '2026-01-01',
        start_date1: '2026-01-01',
        scheduled_end_date: '2036-12-31',
        scheduled_end_date1: '2036-12-31',
        source_balancing_authority_cd: 'CAISO',
        sink_balancing_authority_cd: 'CAISO',
        amount: '100',
        amount_adjusted: '100',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        ppa_agreement_id: 'PPA-VENUS-2026-01',
        entity_ID_type_CD: 'CID',
        entity_ID: 'C100001',
        counterparty_ID_type_CD: 'CID',
        counterparty_ID: 'C999999',
        start_date: '2026-01-01',
        start_date1: '2026-01-01',
        scheduled_end_date: '2036-12-31',
        scheduled_end_date1: '2036-12-31',
        source_balancing_authority_cd: 'CAISO',
        sink_balancing_authority_cd: 'CAISO',
        amount: '100',
        amount_adjusted: '100',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 10: Entities to Vertical Assets
  await prisma.entityToVerticalAsset.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        entity_ID_type_CD: 'CID',
        entity_ID: 'C100001',
        vertical_asset_description: 'Transmission Asset 500kV Interconnect',
        vertical_asset_type_fk: 1,
        balancing_Authority_cd: 'CAISO',
        relationship_start_date: '2026-01-01',
        relationship_start_date1: '2026-01-01',
        relationship_end_date: '2036-12-31',
        relationship_end_date1: '2036-12-31',
        explanatory_notes: 'Interconnection transmission line serving solar array',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        entity_ID_type_CD: 'CID',
        entity_ID: 'C100001',
        vertical_asset_description: 'Transmission Asset 500kV Interconnect',
        vertical_asset_type_fk: 1,
        balancing_Authority_cd: 'CAISO',
        relationship_start_date: '2026-01-01',
        relationship_start_date1: '2026-01-01',
        relationship_end_date: '2036-12-31',
        relationship_end_date1: '2036-12-31',
        explanatory_notes: 'Interconnection transmission line serving solar array',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 11: Market Studies (Indicative MSS & IPSS)
  await prisma.indicativeMarketScreenStudy.upsert({
    where: { pid: 1 },
    update: {
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        study_type_cd: 'New',
        study_end_year: '2026',
        study_area_balancing_authority_cd: 'CAISO',
        study_area_balancing_authority: 'CAISO - California ISO',
        scenario_type: 'Base Case',
        scenario_type_desc: 'Base Case',
        study_parameters_count: 4,
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        study_type_cd: 'New',
        study_end_year: '2026',
        study_area_balancing_authority_cd: 'CAISO',
        study_area_balancing_authority: 'CAISO - California ISO',
        scenario_type: 'Base Case',
        scenario_type_desc: 'Base Case',
        study_parameters_count: 4,
        record_type_cd: 'New',
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
        study_type_cd: 'New',
        study_end_year: '2026',
        study_area_balancing_authority_cd: 'CAISO',
        study_area_balancing_authority: 'CAISO - California ISO',
        scenario_type: 'Base Case',
        scenario_type_desc: 'Base Case',
        study_parameters_count: 4,
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 1,
      cid: 1,
      isActive: true,
      data: {
        pid: 1,
        cid: 1,
        study_type_cd: 'New',
        study_end_year: '2026',
        study_area_balancing_authority_cd: 'CAISO',
        study_area_balancing_authority: 'CAISO - California ISO',
        scenario_type: 'Base Case',
        scenario_type_desc: 'Base Case',
        study_parameters_count: 4,
        record_type_cd: 'New',
      },
    },
  });

  // Parameters for IMSS 1
  await prisma.imssParameter.deleteMany({ where: { imssId: 1 } });
  await prisma.imssParameter.createMany({
    data: [
      { cid: 1, imssId: 1, data: { study_parameter: 1, study_param: 'Peak Demand (MW)', study_parameter_value: 45000, study_parameter_reference: 1, season: 'Summer' } },
      { cid: 1, imssId: 1, data: { study_parameter: 2, study_param: 'Installed Capacity (MW)', study_parameter_value: 52000, study_parameter_reference: 1, season: 'Summer' } },
      { cid: 1, imssId: 1, data: { study_parameter: 3, study_param: 'Uncommitted Capacity (MW)', study_parameter_value: 8000, study_parameter_reference: 1, season: 'Summer' } },
      { cid: 1, imssId: 1, data: { study_parameter: 4, study_param: 'Market Share (%)', study_parameter_value: 12, study_parameter_reference: 1, season: 'Summer' } },
    ],
  });

  // =========================================================================
  // ALL 11 ENTITY SCREENS FOR COMPANY 2 (CID: 2) - ForgeByte Solar Ventures LLC
  // =========================================================================

  // Screen 1: Entities
  await prisma.entity.upsert({
    where: { entityid: 10 },
    update: {
      cid: 2,
      entityName: 'ForgeByte Renewable Holdings LLC',
      name: 'ForgeByte Renewable Holdings LLC',
      isActive: true,
      data: { entityName: 'ForgeByte Renewable Holdings LLC', entity_ID_type_cd: 'CID', entity_ID: 'C100002' },
    },
    create: {
      entityid: 10,
      cid: 2,
      entityName: 'ForgeByte Renewable Holdings LLC',
      name: 'ForgeByte Renewable Holdings LLC',
      isActive: true,
      data: { entityName: 'ForgeByte Renewable Holdings LLC', entity_ID_type_cd: 'CID', entity_ID: 'C100002' },
    },
  });

  // Screen 2: MBR Authorizations
  await prisma.mbrAuthorization.upsert({
    where: { mbrauthid: 10 },
    update: {
      cid: 2,
      isActive: true,
      data: {
        mbrauthid: 10,
        cid: 2,
        authorization_docket_number: 'ER26-200-000',
        authorization_docket: 'ER26-200-000',
        authorization_effective_date: '2026-02-01',
        authorization_effective_date1: '2026-02-01',
        cancellation_docket_number: 'ER23-010-000',
        cancellation_effective_date: '2025-11-30',
        record_type_cd: 'New',
        reference_id: null,
      },
    },
    create: {
      mbrauthid: 10,
      cid: 2,
      isActive: true,
      data: {
        mbrauthid: 10,
        cid: 2,
        authorization_docket_number: 'ER26-200-000',
        authorization_docket: 'ER26-200-000',
        authorization_effective_date: '2026-02-01',
        authorization_effective_date1: '2026-02-01',
        cancellation_docket_number: 'ER23-010-000',
        cancellation_effective_date: '2025-11-30',
        record_type_cd: 'New',
        reference_id: null,
      },
    },
  });

  // Screen 3: Category Status
  await prisma.categoryStatus.upsert({
    where: { pid: 10 },
    update: {
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        region_cd: 'PJM',
        region_desc: 'PJM Interconnection',
        cat_status_in_region_fk: 1,
        cat_status_in_region_desc: 'Category 1 Seller',
        cat_status_effective_date: '2026-02-01',
        cat_status_effective_date1: '2026-02-01',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 10,
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        region_cd: 'PJM',
        region_desc: 'PJM Interconnection',
        cat_status_in_region_fk: 1,
        cat_status_in_region_desc: 'Category 1 Seller',
        cat_status_effective_date: '2026-02-01',
        cat_status_effective_date1: '2026-02-01',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 4: Mitigations
  await prisma.mitigation.upsert({
    where: { pid: 10 },
    update: {
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        balancing_Authority_cd: 'PJM',
        mitigation_narrative: 'Default Energy Bid & Conduct Threshold Mitigation in PJM',
        mitigation_effective_date: '2026-02-01',
        mitigation_effective_date1: '2026-02-01',
        mitigation_end_date: '2031-12-31',
        mitigation_end_date1: '2031-12-31',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 10,
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        balancing_Authority_cd: 'PJM',
        mitigation_narrative: 'Default Energy Bid & Conduct Threshold Mitigation in PJM',
        mitigation_effective_date: '2026-02-01',
        mitigation_effective_date1: '2026-02-01',
        mitigation_end_date: '2031-12-31',
        mitigation_end_date1: '2031-12-31',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 5: Self Limitations
  await prisma.selfLimitation.upsert({
    where: { pid: 10 },
    update: {
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        region_cd: 'PJM',
        region_desc: 'PJM Interconnection',
        balancing_Authority_cd: 'PJM',
        self_limit_effective_date: '2026-02-01',
        self_limit_effective_date1: '2026-02-01',
        self_limit_end_date: '2031-12-31',
        self_limit_end_date1: '2031-12-31',
        description: 'Voluntary power export limit in PJM Interconnection',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 10,
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        region_cd: 'PJM',
        region_desc: 'PJM Interconnection',
        balancing_Authority_cd: 'PJM',
        self_limit_effective_date: '2026-02-01',
        self_limit_effective_date1: '2026-02-01',
        self_limit_end_date: '2031-12-31',
        self_limit_end_date1: '2031-12-31',
        description: 'Voluntary power export limit in PJM Interconnection',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 6: Operating Reserves
  await prisma.operatingReserve.upsert({
    where: { pid: 10 },
    update: {
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        balancing_Authority_cd: 'PJM',
        or_authorization_effective_date: '2026-02-01',
        or_authorization_effective_date1: '2026-02-01',
        or_authorization_end_date: '2031-12-31',
        or_authorization_end_date1: '2031-12-31',
        description: 'Spinning Reserve Authorization (50MW)',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 10,
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        balancing_Authority_cd: 'PJM',
        or_authorization_effective_date: '2026-02-01',
        or_authorization_effective_date1: '2026-02-01',
        or_authorization_end_date: '2031-12-31',
        or_authorization_end_date1: '2031-12-31',
        description: 'Spinning Reserve Authorization (50MW)',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 7: Entities to Entities
  await prisma.entityToEntity.upsert({
    where: { pid: 10 },
    update: {
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        reportable_entity_ID_type_CD: 'CID',
        reportable_entity_ID: 'C100001',
        Blanket_Auth_Docket_Number: 'ER26-200-000',
        Utility_ID_Type_CD: 'CID',
        Utility_ID: 'C100002',
        relationship_start_date: '2026-02-01',
        relationship_start_date1: '2026-02-01',
        relationship_end_date: '2031-12-31',
        relationship_end_date1: '2031-12-31',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 10,
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        reportable_entity_ID_type_CD: 'CID',
        reportable_entity_ID: 'C100001',
        Blanket_Auth_Docket_Number: 'ER26-200-000',
        Utility_ID_Type_CD: 'CID',
        Utility_ID: 'C100002',
        relationship_start_date: '2026-02-01',
        relationship_start_date1: '2026-02-01',
        relationship_end_date: '2031-12-31',
        relationship_end_date1: '2031-12-31',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 8: Entities to Generator Assets
  await prisma.entityToGeneratorAsset.upsert({
    where: { pid: 10 },
    update: {
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        generation_asset_type_id: 1,
        gen_asset_type: 'Solar',
        asset_code: '58901',
        eia_plant_code: '58901',
        eia_generator_id: 'SOL1',
        entity_ID_type_CD: 'CID',
        entity_ID: 'C100002',
        relationship_type: 'Owner',
        relationship_type_fk: 1,
        relationship_start_date: '2026-02-01',
        relationship_start_date1: '2026-02-01',
        relationship_end_date: '2036-12-31',
        relationship_end_date1: '2036-12-31',
        physical_location_Balancing_Authority_cd: 'PJM',
        telemetered_location_Balancing_Authority_cd: 'PJM',
        amount: '250',
        cap_rating_adjusted: '250',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 10,
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        generation_asset_type_id: 1,
        gen_asset_type: 'Solar',
        asset_code: '58901',
        eia_plant_code: '58901',
        eia_generator_id: 'SOL1',
        entity_ID_type_CD: 'CID',
        entity_ID: 'C100002',
        relationship_type: 'Owner',
        relationship_type_fk: 1,
        relationship_start_date: '2026-02-01',
        relationship_start_date1: '2026-02-01',
        relationship_end_date: '2036-12-31',
        relationship_end_date1: '2036-12-31',
        physical_location_Balancing_Authority_cd: 'PJM',
        telemetered_location_Balancing_Authority_cd: 'PJM',
        amount: '250',
        cap_rating_adjusted: '250',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 9: Entities to PPAs
  await prisma.entityToPpa.upsert({
    where: { pid: 10 },
    update: {
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        ppa_agreement_id: 'PPA-FORGE-2026-01',
        entity_ID_type_CD: 'CID',
        entity_ID: 'C100002',
        counterparty_ID_type_CD: 'CID',
        counterparty_ID: 'C888888',
        start_date: '2026-02-01',
        start_date1: '2026-02-01',
        scheduled_end_date: '2037-12-31',
        scheduled_end_date1: '2037-12-31',
        source_balancing_authority_cd: 'PJM',
        sink_balancing_authority_cd: 'PJM',
        amount: '80',
        amount_adjusted: '80',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 10,
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        ppa_agreement_id: 'PPA-FORGE-2026-01',
        entity_ID_type_CD: 'CID',
        entity_ID: 'C100002',
        counterparty_ID_type_CD: 'CID',
        counterparty_ID: 'C888888',
        start_date: '2026-02-01',
        start_date1: '2026-02-01',
        scheduled_end_date: '2037-12-31',
        scheduled_end_date1: '2037-12-31',
        source_balancing_authority_cd: 'PJM',
        sink_balancing_authority_cd: 'PJM',
        amount: '80',
        amount_adjusted: '80',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 10: Entities to Vertical Assets
  await prisma.entityToVerticalAsset.upsert({
    where: { pid: 10 },
    update: {
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        entity_ID_type_CD: 'CID',
        entity_ID: 'C100002',
        vertical_asset_description: 'Mojave Substation 230kV Interconnect',
        vertical_asset_type_fk: 1,
        balancing_Authority_cd: 'PJM',
        relationship_start_date: '2026-02-01',
        relationship_start_date1: '2026-02-01',
        relationship_end_date: '2037-12-31',
        relationship_end_date1: '2037-12-31',
        explanatory_notes: 'High-voltage substation step-up transformer facility',
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 10,
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        entity_ID_type_CD: 'CID',
        entity_ID: 'C100002',
        vertical_asset_description: 'Mojave Substation 230kV Interconnect',
        vertical_asset_type_fk: 1,
        balancing_Authority_cd: 'PJM',
        relationship_start_date: '2026-02-01',
        relationship_start_date1: '2026-02-01',
        relationship_end_date: '2037-12-31',
        relationship_end_date1: '2037-12-31',
        explanatory_notes: 'High-voltage substation step-up transformer facility',
        record_type_cd: 'New',
      },
    },
  });

  // Screen 11: Market Studies (Indicative MSS & IPSS)
  await prisma.indicativeMarketScreenStudy.upsert({
    where: { pid: 10 },
    update: {
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        study_type_cd: 'New',
        study_end_year: '2026',
        study_area_balancing_authority_cd: 'PJM',
        study_area_balancing_authority: 'PJM - PJM Interconnection',
        scenario_type: 'Base Case',
        scenario_type_desc: 'Base Case',
        study_parameters_count: 4,
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 10,
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        study_type_cd: 'New',
        study_end_year: '2026',
        study_area_balancing_authority_cd: 'PJM',
        study_area_balancing_authority: 'PJM - PJM Interconnection',
        scenario_type: 'Base Case',
        scenario_type_desc: 'Base Case',
        study_parameters_count: 4,
        record_type_cd: 'New',
      },
    },
  });

  await prisma.indicativePowerSupplyStudy.upsert({
    where: { pid: 10 },
    update: {
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        study_type_cd: 'New',
        study_end_year: '2026',
        study_area_balancing_authority_cd: 'PJM',
        study_area_balancing_authority: 'PJM - PJM Interconnection',
        scenario_type: 'Base Case',
        scenario_type_desc: 'Base Case',
        study_parameters_count: 4,
        record_type_cd: 'New',
      },
    },
    create: {
      pid: 10,
      cid: 2,
      isActive: true,
      data: {
        pid: 10,
        cid: 2,
        study_type_cd: 'New',
        study_end_year: '2026',
        study_area_balancing_authority_cd: 'PJM',
        study_area_balancing_authority: 'PJM - PJM Interconnection',
        scenario_type: 'Base Case',
        scenario_type_desc: 'Base Case',
        study_parameters_count: 4,
        record_type_cd: 'New',
      },
    },
  });

  // Parameters for IMSS 10
  await prisma.imssParameter.deleteMany({ where: { imssId: 10 } });
  await prisma.imssParameter.createMany({
    data: [
      { cid: 2, imssId: 10, data: { study_parameter: 1, study_param: 'Peak Demand (MW)', study_parameter_value: 38000, study_parameter_reference: 1, season: 'Summer' } },
      { cid: 2, imssId: 10, data: { study_parameter: 2, study_param: 'Installed Capacity (MW)', study_parameter_value: 46000, study_parameter_reference: 1, season: 'Summer' } },
      { cid: 2, imssId: 10, data: { study_parameter: 3, study_param: 'Uncommitted Capacity (MW)', study_parameter_value: 6500, study_parameter_reference: 1, season: 'Summer' } },
      { cid: 2, imssId: 10, data: { study_parameter: 4, study_param: 'Market Share (%)', study_parameter_value: 9, study_parameter_reference: 1, season: 'Summer' } },
    ],
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

  await prisma.filing.upsert({
    where: { fid: 10 },
    update: {
      cid: 2,
      uid: 10,
      status: 'Ready For Submission',
      isActive: true,
      data: {
        fid: 10,
        cid: 2,
        docketNumber: 'ER26-200-000',
        filingType: 'Triennial MBR Update',
        status: 'Ready For Submission',
        description: 'ForgeByte Solar Triennial Market-Based Rate Filing',
      },
    },
    create: {
      fid: 10,
      cid: 2,
      uid: 10,
      status: 'Ready For Submission',
      isActive: true,
      data: {
        fid: 10,
        cid: 2,
        docketNumber: 'ER26-200-000',
        filingType: 'Triennial MBR Update',
        status: 'Ready For Submission',
        description: 'ForgeByte Solar Triennial Market-Based Rate Filing',
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

  await prisma.invoice.upsert({
    where: { invoiceId: 10 },
    update: {
      cid: 2,
      aid: 1,
      agid: 1,
      isSent: true,
      isBilled: true,
      isPaid: true,
      isActive: true,
      data: {
        invoiceId: 10,
        invoiceNumber: 'FORGE-INV-2026-001',
        amount: 4500,
        status: 'Paid',
      },
    },
    create: {
      invoiceId: 10,
      cid: 2,
      aid: 1,
      agid: 1,
      isSent: true,
      isBilled: true,
      isPaid: true,
      isActive: true,
      data: {
        invoiceId: 10,
        invoiceNumber: 'FORGE-INV-2026-001',
        amount: 4500,
        status: 'Paid',
      },
    },
  });

  console.log('--- ALL 11 SCREENS AND DATA FOR BOTH COMPANIES SEEDED SUCCESSFULLY ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
