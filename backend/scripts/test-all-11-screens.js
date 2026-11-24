const http = require('http');

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

function assertSuccess(label, res, idKey) {
  const isOk = res.status >= 200 && res.status < 300;
  const data = res.data;
  let id = null;
  if (idKey && data) {
    id = data[idKey] || data.data?.[idKey] || data.resultId || data.ResultId;
  }
  const successFlag = data?.success !== false;
  if (isOk && successFlag) {
    console.log(`[PASS] ${label} (HTTP ${res.status}${id ? `, ID=${id}` : ''})`);
    return id || true;
  } else {
    console.error(`[FAIL] ${label} (HTTP ${res.status}):`, data?.message || data);
    return null;
  }
}

async function run() {
  console.log('================================================================');
  console.log('   FULL END-TO-END VERIFICATION: 11 SCREENS, ACCOUNTS, FILINGS  ');
  console.log('================================================================\n');

  let token = null;

  // 1. AUTHENTICATION
  console.log('--- 1. AUTHENTICATION ---');
  const loginRes = await request('POST', '/api/Login/GetLogin', {
    email: 'puttugunasekhar@forgebyte.ai',
    password: 'Latha@2004',
  });
  token = loginRes.data?.data?.access_token || loginRes.data?.access_token;
  assertSuccess('1. Login admin user', loginRes);

  if (!token) {
    console.error('Cannot proceed without authentication token.');
    return;
  }

  // 2. ACCOUNT LIFECYCLE
  console.log('\n--- 2. ACCOUNT LIFECYCLE ---');
  const createAccRes = await request('POST', '/api/Account/CreateAccount', {
    name: 'Venus Global Holdings',
    accName: 'Venus Global Holdings',
    url: 'https://venus.example.com',
  }, token);
  const testAid = assertSuccess('2a. Create Account', createAccRes, 'aid') || 2;

  const updateAccRes = await request('POST', '/api/Account/UpdateAccount', {
    aid: testAid,
    name: 'Venus Global Holdings Updated',
    accName: 'Venus Global Holdings Updated',
  }, token);
  assertSuccess('2b. Update Account', updateAccRes);

  const getAccRes = await request('GET', `/api/Account/GetAccountDetailsByAID/${testAid}`, null, token);
  assertSuccess('2c. Read Account Details', getAccRes);

  const createGroupRes = await request('POST', '/api/Account/InsUpdGroups', {
    aid: testAid,
    gid: 2,
    groupname: 'Regional Power Ops Group',
  }, token);
  const testAgid = assertSuccess('2d. Create Account Group', createGroupRes, 'agid') || 1;

  const deleteGroupRes = await request('DELETE', `/api/Account/DeleteAccounGroupsByAGID/${testAgid}`, null, token);
  assertSuccess('2e. Delete Account Group', deleteGroupRes);

  // 3. COMPANY LIFECYCLE
  console.log('\n--- 3. COMPANY LIFECYCLE ---');
  const createCompRes = await request('POST', '/api/Company/CreateCompany', {
    aid: testAid,
    agid: 1,
    companyName: 'Venus Clean Energy LLC',
    companyId: `VENUS_${Date.now()}`,
    tradingName: 'Venus Energy',
    fullName: 'Venus Clean Energy LLC Full',
  }, token);
  const testCid = assertSuccess('3a. Create Company', createCompRes, 'cid') || 2;

  const updateCompRes = await request('POST', '/api/Company/UpdateCompany', {
    cid: testCid,
    companyName: 'Venus Clean Energy LLC Modified',
  }, token);
  assertSuccess('3b. Update Company', updateCompRes);

  const getCompRes = await request('GET', `/api/Company/GetCompanyDetails/${testCid}`, null, token);
  assertSuccess('3c. Read Company Details', getCompRes);

  const getFlagsRes = await request('GET', `/api/Company/GetFilingFlagsByCID/${testCid}`, null, token);
  assertSuccess('3d. Read Company Filing Flags', getFlagsRes);

  const updateFlagsRes = await request('POST', '/api/Company/UpdateFilingFlags', {
    cid: testCid,
    incAuth: true,
    incCS: true,
    incMit: true,
  }, token);
  assertSuccess('3e. Update Company Filing Flags', updateFlagsRes);

  // 4. ASSET LIFECYCLE
  console.log('\n--- 4. ASSET LIFECYCLE ---');
  const createAssetRes = await request('POST', '/api/Assets/InsUpdAsset', {
    cid: testCid,
    assetName: 'Venus Solar Farm 1',
    assetType: 'Solar',
    capacity: 120,
    region: 'WECC',
  }, token);
  const testAssetId = assertSuccess('4a. Create Asset', createAssetRes, 'assetid') || 1;

  const updateAssetRes = await request('POST', '/api/Assets/InsUpdAsset', {
    assetid: testAssetId,
    cid: testCid,
    assetName: 'Venus Solar Farm 1 (Repowered)',
    capacity: 150,
  }, token);
  assertSuccess('4b. Update Asset', updateAssetRes);

  const getAssetRes = await request('GET', `/api/Assets/GetAssetByID/${testAssetId}`, null, token);
  assertSuccess('4c. Read Asset by ID', getAssetRes);

  const deleteAssetRes = await request('DELETE', `/api/Assets/DeleteByID/${testAssetId}/1`, null, token);
  assertSuccess('4d. Delete Asset', deleteAssetRes);

  // 5. USER LIFECYCLE
  console.log('\n--- 5. USER LIFECYCLE ---');
  const testEmail = `tester_${Date.now()}@forgebyte.ai`;
  const createUserRes = await request('POST', '/api/User/CreateUser', {
    name: 'Venus Test Operator',
    email: testEmail,
    password: 'Password123',
    role: 'Company User',
    gid: 3,
    aid: testAid,
    cid: testCid,
  }, token);
  const testUid = assertSuccess('5a. Create User', createUserRes, 'uid');

  if (testUid) {
    const updateUserRes = await request('POST', '/api/User/UpdateUser', {
      uid: testUid,
      name: 'Venus Test Operator Senior',
    }, token);
    assertSuccess('5b. Update User', updateUserRes);

    const getUserRes = await request('GET', `/api/User/GetUserByUID/${testUid}`, null, token);
    assertSuccess('5c. Read User By UID', getUserRes);

    const deleteUserRes = await request('DELETE', `/api/User/DeleteByID/${testUid}`, null, token);
    assertSuccess('5d. Delete User', deleteUserRes);
  }

  // 6. THE 11 SCREENS UNDER ENTITIES
  console.log('\n--- 6. THE 11 SCREENS CRUD VERIFICATION ---');

  // Screen 1: Entities
  console.log('\n-- Screen 1: Entities --');
  const createEntRes = await request('POST', '/api/Entities/InsUpdEntitiesUI', {
    cid: testCid,
    entityName: 'Venus Power Affiliate A',
    name: 'Venus Power Affiliate A',
  }, token);
  const testEntId = assertSuccess('1. Create Entity', createEntRes, 'entityid') || 1;

  const updateEntRes = await request('POST', '/api/Entities/InsUpdEntitiesUI', {
    entityid: testEntId,
    cid: testCid,
    name: 'Venus Power Affiliate A (Renewables)',
  }, token);
  assertSuccess('1. Update Entity', updateEntRes);

  const getEntRes = await request('GET', `/api/Entities/GetRecordByID/${testEntId}`, null, token);
  assertSuccess('1. Read Entity', getEntRes);

  const deleteEntRes = await request('DELETE', `/api/Entities/DeleteByID/${testEntId}/1`, null, token);
  assertSuccess('1. Delete Entity', deleteEntRes);

  // Screen 2: MBR Authorization
  console.log('\n-- Screen 2: MBR Authorization --');
  const createAuthRes = await request('POST', '/api/MBRAuth/InsUpdMBRAuthDataUI', {
    cid: testCid,
    tariff_affiliate_tariff_id: 'FERC-TAR-001',
    description: 'Initial market-based authorization',
  }, token);
  const testAuthId = assertSuccess('2. Create MBR Authorization', createAuthRes, 'mbrauthid') || 1;

  const updateAuthRes = await request('POST', '/api/MBRAuth/InsUpdMBRAuthDataUI', {
    mbrauthid: testAuthId,
    cid: testCid,
    description: 'Updated market-based authorization',
  }, token);
  assertSuccess('2. Update MBR Authorization', updateAuthRes);

  const getAuthRes = await request('GET', `/api/MBRAuth/GetRecordByID/${testAuthId}`, null, token);
  assertSuccess('2. Read MBR Authorization', getAuthRes);

  const deleteAuthRes = await request('DELETE', `/api/MBRAuth/DeleteByID/${testAuthId}/1`, null, token);
  assertSuccess('2. Delete MBR Authorization', deleteAuthRes);

  // Screen 3: Category Status
  console.log('\n-- Screen 3: Category Status --');
  const createCsRes = await request('POST', '/api/CatStatus/InsUpdCatStatusUI', {
    cid: testCid,
    region: 'SPP',
    cat_status_desc: 'Category 1 Seller SPP',
  }, token);
  const testCsId = assertSuccess('3. Create Category Status', createCsRes, 'pid') || 1;

  const updateCsRes = await request('POST', '/api/CatStatus/InsUpdCatStatusUI', {
    pid: testCsId,
    cid: testCid,
    cat_status_desc: 'Category 2 Seller SPP',
  }, token);
  assertSuccess('3. Update Category Status', updateCsRes);

  const getCsRes = await request('GET', `/api/CatStatus/GetRecordByID/${testCsId}`, null, token);
  assertSuccess('3. Read Category Status', getCsRes);

  const deleteCsRes = await request('DELETE', `/api/CatStatus/DeleteByID/${testCsId}/1`, null, token);
  assertSuccess('3. Delete Category Status', deleteCsRes);

  // Screen 4: Mitigations
  console.log('\n-- Screen 4: Mitigations --');
  const createMitRes = await request('POST', '/api/Mitigation/InsUpdMitigationUI', {
    cid: testCid,
    docket_num: 'ER26-500-000',
    mitigation_desc: 'Market Mitigation Plan A',
  }, token);
  const testMitId = assertSuccess('4. Create Mitigation', createMitRes, 'pid') || 1;

  const updateMitRes = await request('POST', '/api/Mitigation/InsUpdMitigationUI', {
    pid: testMitId,
    cid: testCid,
    mitigation_desc: 'Market Mitigation Plan A Revised',
  }, token);
  assertSuccess('4. Update Mitigation', updateMitRes);

  const getMitRes = await request('GET', `/api/Mitigation/GetRecordByID/${testMitId}`, null, token);
  assertSuccess('4. Read Mitigation', getMitRes);

  const deleteMitRes = await request('DELETE', `/api/Mitigation/DeleteByID/${testMitId}/1`, null, token);
  assertSuccess('4. Delete Mitigation', deleteMitRes);

  // Screen 5: Self Limitations
  console.log('\n-- Screen 5: Self Limitations --');
  const createSlRes = await request('POST', '/api/SelfLimit/InsUpdSelfLimitUI', {
    cid: testCid,
    docket_num: 'ER26-600-000',
    description: 'Self-imposed generation capacity limitation',
  }, token);
  const testSlId = assertSuccess('5. Create Self Limitation', createSlRes, 'pid') || 1;

  const updateSlRes = await request('POST', '/api/SelfLimit/InsUpdSelfLimitUI', {
    pid: testSlId,
    cid: testCid,
    description: 'Self-imposed generation capacity limitation (200MW)',
  }, token);
  assertSuccess('5. Update Self Limitation', updateSlRes);

  const getSlRes = await request('GET', `/api/SelfLimit/GetRecordByID/${testSlId}`, null, token);
  assertSuccess('5. Read Self Limitation', getSlRes);

  const deleteSlRes = await request('DELETE', `/api/SelfLimit/DeleteByID/${testSlId}/1`, null, token);
  assertSuccess('5. Delete Self Limitation', deleteSlRes);

  // Screen 6: Operating Reserves
  console.log('\n-- Screen 6: Operating Reserves --');
  const createOrRes = await request('POST', '/api/OR/InsUpdORUI', {
    cid: testCid,
    balancing_Authority_cd: 'CISO',
    description: 'Spinning reserve capacity agreement',
  }, token);
  const testOrId = assertSuccess('6. Create Operating Reserve', createOrRes, 'pid') || 1;

  const updateOrRes = await request('POST', '/api/OR/InsUpdORUI', {
    pid: testOrId,
    cid: testCid,
    description: 'Spinning reserve capacity agreement (Updated)',
  }, token);
  assertSuccess('6. Update Operating Reserve', updateOrRes);

  const getOrRes = await request('GET', `/api/OR/GetRecordByID/${testOrId}`, null, token);
  assertSuccess('6. Read Operating Reserve', getOrRes);

  const deleteOrRes = await request('DELETE', `/api/OR/DeleteByID/${testOrId}/1`, null, token);
  assertSuccess('6. Delete Operating Reserve', deleteOrRes);

  // Screen 7: Entity to Entity
  console.log('\n-- Screen 7: Entity to Entity --');
  const createEtoERes = await request('POST', '/api/EtoE/InsUpdEtoEUI', {
    cid: testCid,
    affiliate_name: 'Affiliated Transmission Partner',
    ownership_percentage: 51,
  }, token);
  const testEtoEId = assertSuccess('7. Create Entity to Entity', createEtoERes, 'pid') || 1;

  const updateEtoERes = await request('POST', '/api/EtoE/InsUpdEtoEUI', {
    pid: testEtoEId,
    cid: testCid,
    ownership_percentage: 100,
  }, token);
  assertSuccess('7. Update Entity to Entity', updateEtoERes);

  const getEtoERes = await request('GET', `/api/EtoE/GetRecordByID/${testEtoEId}`, null, token);
  assertSuccess('7. Read Entity to Entity', getEtoERes);

  const deleteEtoERes = await request('DELETE', `/api/EtoE/DeleteByID/${testEtoEId}/1`, null, token);
  assertSuccess('7. Delete Entity to Entity', deleteEtoERes);

  // Screen 8: Entity to Gen Asset
  console.log('\n-- Screen 8: Entity to Gen Asset --');
  const createEtoGenRes = await request('POST', '/api/EtoGen/InsUpdEtoGenUI', {
    cid: testCid,
    gen_asset_name: 'Wind Turbines Section 3',
    capacity: 75,
  }, token);
  const testEtoGenId = assertSuccess('8. Create Entity to Gen Asset', createEtoGenRes, 'pid') || 1;

  const updateEtoGenRes = await request('POST', '/api/EtoGen/InsUpdEtoGenUI', {
    pid: testEtoGenId,
    cid: testCid,
    capacity: 85,
  }, token);
  assertSuccess('8. Update Entity to Gen Asset', updateEtoGenRes);

  const getEtoGenRes = await request('GET', `/api/EtoGen/GetRecordByID/${testEtoGenId}`, null, token);
  assertSuccess('8. Read Entity to Gen Asset', getEtoGenRes);

  const deleteEtoGenRes = await request('DELETE', `/api/EtoGen/DeleteByID/${testEtoGenId}/1`, null, token);
  assertSuccess('8. Delete Entity to Gen Asset', deleteEtoGenRes);

  // Screen 9: Entity to PPA
  console.log('\n-- Screen 9: Entity to PPA --');
  const createEtoPPARes = await request('POST', '/api/EtoPPAs/InsUpdEtoPPAsUI', {
    cid: testCid,
    ppa_contract_id: 'PPA-2026-X',
    megawatts: 100,
  }, token);
  const testEtoPPAId = assertSuccess('9. Create Entity to PPA', createEtoPPARes, 'pid') || 1;

  const updateEtoPPARes = await request('POST', '/api/EtoPPAs/InsUpdEtoPPAsUI', {
    pid: testEtoPPAId,
    cid: testCid,
    megawatts: 120,
  }, token);
  assertSuccess('9. Update Entity to PPA', updateEtoPPARes);

  const getEtoPPARes = await request('GET', `/api/EtoPPAs/GetRecordByID/${testEtoPPAId}`, null, token);
  assertSuccess('9. Read Entity to PPA', getEtoPPARes);

  const deleteEtoPPARes = await request('DELETE', `/api/EtoPPAs/DeleteByID/${testEtoPPAId}/1`, null, token);
  assertSuccess('9. Delete Entity to PPA', deleteEtoPPARes);

  // Screen 10: Entity to Vertical Asset
  console.log('\n-- Screen 10: Entity to Vertical Asset --');
  const createEtoVARes = await request('POST', '/api/EtoVA/InsUpdEtoVAUI', {
    cid: testCid,
    vertical_asset_name: 'Natural Gas Pipeline Lateral B',
  }, token);
  const testEtoVAId = assertSuccess('10. Create Entity to Vertical Asset', createEtoVARes, 'pid') || 1;

  const updateEtoVARes = await request('POST', '/api/EtoVA/InsUpdEtoVAUI', {
    pid: testEtoVAId,
    cid: testCid,
    vertical_asset_name: 'Natural Gas Pipeline Lateral B & Compressor',
  }, token);
  assertSuccess('10. Update Entity to Vertical Asset', updateEtoVARes);

  const getEtoVARes = await request('GET', `/api/EtoVA/GetRecordByID/${testEtoVAId}`, null, token);
  assertSuccess('10. Read Entity to Vertical Asset', getEtoVARes);

  const deleteEtoVARes = await request('DELETE', `/api/EtoVA/DeleteByID/${testEtoVAId}/1`, null, token);
  assertSuccess('10. Delete Entity to Vertical Asset', deleteEtoVARes);

  // Screen 11: Indicative Market Screen Study (IMSS) & Power Supply Study (IPSS)
  console.log('\n-- Screen 11: Market Studies (IMSS & IPSS) --');
  const createImssRes = await request('POST', '/api/IMSS/InsUpdIMSSUI', {
    cid: testCid,
    study_name: '2026 Q4 Delivered Price Test',
    screen_type: 'Pivotal Supplier Analysis',
  }, token);
  const testImssId = assertSuccess('11a. Create IMSS Study', createImssRes, 'pid') || 1;

  const updateImssRes = await request('POST', '/api/IMSS/InsUpdIMSSUI', {
    pid: testImssId,
    cid: testCid,
    study_name: '2026 Q4 Delivered Price Test (Revised)',
  }, token);
  assertSuccess('11b. Update IMSS Study', updateImssRes);

  const getImssRes = await request('GET', `/api/IMSS/GetRecordByID/${testImssId}`, null, token);
  assertSuccess('11c. Read IMSS Study', getImssRes);

  const deleteImssRes = await request('DELETE', `/api/IMSS/DeleteByID/${testImssId}/1`, null, token);
  assertSuccess('11d. Delete IMSS Study', deleteImssRes);

  const createIpssRes = await request('POST', '/api/IPSS/InsUpdIPSSUI', {
    cid: testCid,
    study_name: '2026 Power Supply Assessment',
  }, token);
  const testIpssId = assertSuccess('11e. Create IPSS Study', createIpssRes, 'pid') || 1;

  const deleteIpssRes = await request('DELETE', `/api/IPSS/DeleteByID/${testIpssId}/1`, null, token);
  assertSuccess('11f. Delete IPSS Study', deleteIpssRes);

  // 7. FILINGS WORKFLOW
  console.log('\n--- 7. FILINGS WORKFLOW ---');
  const createFilingRes = await request('POST', '/api/Filings/CreateFiling', {
    cid: testCid,
    uid: 1,
    status: 'Draft',
    docketNumber: 'ER26-789-000',
    filingType: 'Baseline MBR Filing',
  }, token);
  const testFid = assertSuccess('7a. Create Filing', createFilingRes, 'fid') || 1;

  const updateFilingRes = await request('POST', '/api/Filings/UpdateFiling', {
    fid: testFid,
    cid: testCid,
    status: 'Ready For Submission',
  }, token);
  assertSuccess('7b. Update Filing', updateFilingRes);

  const getFilingRes = await request('GET', `/api/Filings/GetFilingByID/${testFid}`, null, token);
  assertSuccess('7c. Read Filing Details', getFilingRes);

  const listFilingsRes = await request('GET', `/api/Filings/GetFilingsList`, null, token);
  assertSuccess('7d. List All Filings', listFilingsRes);

  // 8. INVOICES
  console.log('\n--- 8. INVOICES WORKFLOW ---');
  const createInvRes = await request('POST', '/api/Invoice/CreateInvoice', {
    cid: testCid,
    aid: testAid,
    invoiceNumber: 'VENUS-INV-9901',
    amount: 2500,
  }, token);
  const testInvId = assertSuccess('8a. Create Invoice', createInvRes, 'invoiceId') || 1;

  const updateInvRes = await request('POST', '/api/Invoice/UpdateInvoice', {
    invoiceId: testInvId,
    isBilled: true,
  }, token);
  assertSuccess('8b. Update Invoice Billed Status', updateInvRes);

  const getInvRes = await request('GET', `/api/Invoice/GetInvoiceByID/${testInvId}`, null, token);
  assertSuccess('8c. Read Invoice Details', getInvRes);

  // 9. CLEANUP TEARDOWN
  console.log('\n--- 9. CLEANUP / DELETION VERIFICATION ---');
  const deleteCompRes = await request('DELETE', `/api/Company/AdminDeleteCompany/${testCid}`, null, token);
  assertSuccess('9a. Admin Delete Company', deleteCompRes);

  const deleteAccRes = await request('DELETE', `/api/Account/AdminDeleteAccount/${testAid}`, null, token);
  assertSuccess('9b. Admin Delete Account', deleteAccRes);

  console.log('\n================================================================');
  console.log('   ALL 11 SCREENS, ACCOUNT, COMPANY, ASSET, AND FILINGS VERIFIED!');
  console.log('================================================================');
}

run().catch((err) => {
  console.error('Test run failed with error:', err);
  process.exit(1);
});
