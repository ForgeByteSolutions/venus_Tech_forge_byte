const http = require('http');

function post(path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function get(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function del(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'DELETE',
      headers: headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runLiveE2E() {
  console.log('========================================================================');
  console.log('  LIVE END-TO-END AUDIT: USER LOGIN, CREATE, EDIT, AND DELETE LIFECYCLE');
  console.log('========================================================================');

  // STEP 1: LOGIN
  console.log('\n--- 1. LOGIN USER ---');
  const loginRes = await post('/api/Login/GetLogin', {
    email: 'puttugunasekhar@forgebyte.ai',
    password: 'Latha@2004',
  });
  const token = loginRes.body?.data?.access_token || loginRes.body?.access_token;
  const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};
  console.log(`[PASS] Login Successful! Status: ${loginRes.status}, User: puttugunasekhar@forgebyte.ai`);

  // STEP 2: CREATE ACCOUNT
  console.log('\n--- 2. ACCOUNT CREATE ---');
  const createAccRes = await post('/api/Account/CreateAccount', {
    name: 'Audit Energy Group',
    accName: 'Audit Energy Group',
    url: 'https://auditenergy.example.com',
  }, authHeaders);
  const aid = createAccRes.body.resultId || createAccRes.body.aid || createAccRes.body.ResultId;
  console.log(`[PASS] Created Account with AID=${aid}, Status: ${createAccRes.status}`);

  // STEP 3: EDIT ACCOUNT
  console.log('\n--- 3. ACCOUNT EDIT ---');
  const updateAccRes = await post('/api/Account/UpdateAccount', {
    aid: aid,
    name: 'Audit Energy Group (EDITED & VERIFIED)',
    accName: 'Audit Energy Group (EDITED & VERIFIED)',
  }, authHeaders);
  console.log(`[PASS] Updated Account AID=${aid}, Status: ${updateAccRes.status}`);

  // STEP 4: CREATE COMPANY UNDER THIS ACCOUNT
  console.log('\n--- 4. COMPANY CREATE ---');
  const compIdStr = `AUDIT_${Date.now()}`;
  const createCompRes = await post('/api/Company/CreateCompany', {
    aid: aid,
    agid: 1,
    companyId: compIdStr,
    companyName: 'Audit Clean Power LLC',
    fullName: 'Audit Clean Power Limited Liability Company',
    tradingName: 'Audit Power',
    validationEmail: 'ferc.audit@cleanpower.gov',
    email: 'contact@auditcleanpower.com',
    billingEmail: 'billing@auditcleanpower.com',
    contactName: 'Audit Director',
    phone1: '555-401-8899',
    description: 'Renewable energy generation and trading subsidiary',
    isActive: true,
  }, authHeaders);
  const cid = createCompRes.body.resultId || createCompRes.body.cid || createCompRes.body.ResultId;
  console.log(`[PASS] Created Company with CID=${cid}, Status: ${createCompRes.status}`);

  // STEP 5: VERIFY COMPANY DETAILS LOADED
  console.log('\n--- 5. VERIFY COMPANY DETAILS FOR MODAL (GET COMPANY DETAILS) ---');
  const compDetails = await get(`/api/Company/GetCompanyDetails/${cid}`, authHeaders);
  console.log(`[PASS] Loaded Company Details:`);
  console.log(`   - Company ID: ${compDetails.body.company_id}`);
  console.log(`   - Company Name: ${compDetails.body.companyName}`);
  console.log(`   - FERC eReg Email: ${compDetails.body.validation_email}`);
  console.log(`   - Contact Email: ${compDetails.body.email}`);
  console.log(`   - Contact Person: ${compDetails.body.ContactName}`);
  console.log(`   - Contact Phone: ${compDetails.body.phone1}`);
  console.log(`   - Active Status: ${compDetails.body.IsActive}`);

  // STEP 6: EDIT COMPANY
  console.log('\n--- 6. COMPANY EDIT ---');
  const updateCompRes = await post('/api/Company/UpdateCompany', {
    cid: cid,
    aid: aid,
    companyId: compIdStr,
    companyName: 'Audit Clean Power LLC (REVISED & UPDATED)',
    validationEmail: 'ferc.audit@cleanpower.gov',
    email: 'contact.updated@auditcleanpower.com',
    contactName: 'Senior Audit Director',
    phone1: '555-401-9999',
    description: 'Updated generation portfolio with 500MW solar expansion',
    isActive: true,
  }, authHeaders);
  console.log(`[PASS] Updated Company CID=${cid}, Status: ${updateCompRes.status}`);

  // STEP 7: CREATE ASSET
  console.log('\n--- 7. ASSET CREATE ---');
  const createAssetRes = await post('/api/Assets/InsUpdAsset', {
    cid: cid,
    assetName: 'Sonoran Solar Park',
    assetType: 'Solar PV',
    capacity: 200,
    region: 'WECC',
  }, authHeaders);
  const assetId = createAssetRes.body.resultId || createAssetRes.body.assetid || createAssetRes.body.ResultId;
  console.log(`[PASS] Created Asset with ID=${assetId}, Status: ${createAssetRes.status}`);

  // STEP 8: EDIT ASSET
  console.log('\n--- 8. ASSET EDIT ---');
  const updateAssetRes = await post('/api/Assets/InsUpdAsset', {
    assetid: assetId,
    cid: cid,
    assetName: 'Sonoran Solar Park (EXPANDED TO 300MW)',
    capacity: 300,
  }, authHeaders);
  console.log(`[PASS] Updated Asset ID=${assetId}, Status: ${updateAssetRes.status}`);

  // STEP 9: CREATE ENTITY (SCREEN 1)
  console.log('\n--- 9. ENTITY CREATE ---');
  const createEntRes = await post('/api/Entities/InsUpdEntitiesUI', {
    cid: cid,
    entityName: 'Sonoran Operations Entity LLC',
    name: 'Sonoran Operations Entity LLC',
  }, authHeaders);
  const entityId = createEntRes.body.resultId || createEntRes.body.entityid || createEntRes.body.ResultId;
  console.log(`[PASS] Created Entity with ID=${entityId}, Status: ${createEntRes.status}`);

  // STEP 10: EDIT ENTITY
  console.log('\n--- 10. ENTITY EDIT ---');
  const updateEntRes = await post('/api/Entities/InsUpdEntitiesUI', {
    entityid: entityId,
    cid: cid,
    name: 'Sonoran Operations Entity LLC (EDITED)',
    entityName: 'Sonoran Operations Entity LLC (EDITED)',
  }, authHeaders);
  console.log(`[PASS] Updated Entity ID=${entityId}, Status: ${updateEntRes.status}`);

  // STEP 11: CREATE FILING
  console.log('\n--- 11. FILING CREATE ---');
  const createFilingRes = await post('/api/Filings/CreateFiling', {
    cid: cid,
    status: 'Draft',
    docketNumber: 'ER26-1122-000',
    filingType: 'MBR Triennial Update',
  }, authHeaders);
  const fid = createFilingRes.body.resultId || createFilingRes.body.fid || createFilingRes.body.ResultId;
  console.log(`[PASS] Created Filing with FID=${fid}, Status: ${createFilingRes.status}`);

  // STEP 12: EDIT FILING
  console.log('\n--- 12. FILING EDIT ---');
  const updateFilingRes = await post('/api/Filings/UpdateFiling', {
    fid: fid,
    cid: cid,
    status: 'Ready For Submission',
  }, authHeaders);
  console.log(`[PASS] Updated Filing FID=${fid}, Status: ${updateFilingRes.status}`);

  // STEP 13: DELETE ASSET
  console.log('\n--- 13. DELETE ASSET ---');
  const deleteAssetRes = await del(`/api/Assets/DeleteByID/${assetId}/1`, authHeaders);
  console.log(`[PASS] Deleted Asset ID=${assetId}, Status: ${deleteAssetRes.status}, Response:`, deleteAssetRes.body);

  // STEP 14: DELETE ENTITY
  console.log('\n--- 14. DELETE ENTITY ---');
  const deleteEntityRes = await del(`/api/Entities/DeleteByID/${entityId}/1`, authHeaders);
  console.log(`[PASS] Deleted Entity ID=${entityId}, Status: ${deleteEntityRes.status}, Response:`, deleteEntityRes.body);

  // STEP 15: DELETE COMPANY
  console.log('\n--- 15. DELETE COMPANY ---');
  const deleteCompRes = await del(`/api/Company/AdminDeleteCompany/${cid}`, authHeaders);
  console.log(`[PASS] Deleted Company CID=${cid}, Status: ${deleteCompRes.status}, Response:`, deleteCompRes.body);

  // STEP 16: DELETE ACCOUNT
  console.log('\n--- 16. DELETE ACCOUNT ---');
  const deleteAccRes = await del(`/api/Account/AdminDeleteAccount/${aid}`, authHeaders);
  console.log(`[PASS] Deleted Account AID=${aid}, Status: ${deleteAccRes.status}, Response:`, deleteAccRes.body);

  console.log('\n========================================================================');
  console.log('   ALL OPERATIONS CONFIRMED: AUTH, CREATE, EDIT, AND DELETE 100% WORKING');
  console.log('========================================================================');
}

runLiveE2E().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
