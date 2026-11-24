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

async function run() {
  console.log('=== STARTING FULL CRUD TEST ===\n');
  let token = null;

  // 1. LOGIN
  try {
    const res = await request('POST', '/api/Login/GetLogin', {
      email: 'puttugunasekhar@forgebyte.ai',
      password: 'Latha@2004',
    });
    console.log('1. LOGIN:', res.status, res.data?.success ? 'SUCCESS' : 'FAILED');
    token = res.data?.data?.access_token || res.data?.access_token;
  } catch (e) {
    console.error('1. LOGIN ERROR:', e.message);
  }

  // 2. ACCOUNT CRUD
  try {
    const create = await request('POST', '/api/Account/CreateAccount', {
      name: 'Test Account',
      accName: 'Test Account',
      url: 'https://test.com',
    }, token);
    const aid = create.data?.data?.aid || create.data?.aid || 2;
    console.log('2a. CREATE ACCOUNT:', create.status, aid ? `AID=${aid}` : 'FAILED');

    const update = await request('POST', '/api/Account/UpdateAccount', {
      aid,
      name: 'Test Account Updated',
      accName: 'Test Account Updated',
    }, token);
    console.log('2b. UPDATE ACCOUNT:', update.status, update.data?.success ? 'SUCCESS' : 'FAILED');

    const get = await request('GET', `/api/Account/GetAccountDetailsByAID/${aid}`, null, token);
    console.log('2c. GET ACCOUNT:', get.status, Array.isArray(get.data) ? `Found ${get.data.length}` : 'OK');

    const del = await request('DELETE', `/api/Account/AdminDeleteAccount/${aid}`, null, token);
    console.log('2d. DELETE ACCOUNT:', del.status, del.data?.success ? 'SUCCESS' : 'FAILED');
  } catch (e) {
    console.error('2. ACCOUNT ERROR:', e.message);
  }

  // 3. COMPANY CRUD
  try {
    const create = await request('POST', '/api/Company/CreateCompany', {
      aid: 1,
      agid: 1,
      companyName: 'Test Company',
      companyId: 'TEST01',
    }, token);
    const cid = create.data?.data?.cid || create.data?.company?.cid || 2;
    console.log('3a. CREATE COMPANY:', create.status, cid ? `CID=${cid}` : 'FAILED');

    const update = await request('POST', '/api/Company/UpdateCompany', {
      cid,
      companyName: 'Test Company Updated',
    }, token);
    console.log('3b. UPDATE COMPANY:', update.status, update.data?.success ? 'SUCCESS' : 'FAILED');

    const get = await request('GET', `/api/Company/GetCompanyDetails/${cid}`, null, token);
    console.log('3c. GET COMPANY:', get.status, get.data ? 'OK' : 'FAILED');

    const del = await request('DELETE', `/api/Company/AdminDeleteCompany/${cid}`, null, token);
    console.log('3d. DELETE COMPANY:', del.status, del.data?.success ? 'SUCCESS' : 'FAILED');
  } catch (e) {
    console.error('3. COMPANY ERROR:', e.message);
  }

  // 4. USER CRUD
  try {
    const create = await request('POST', '/api/User/CreateUser', {
      name: 'John Doe',
      email: `john_${Date.now()}@test.com`,
      password: 'Password123',
      role: 'Company User',
      gid: 3,
      aid: 1,
      cid: 1,
    }, token);
    const uid = create.data?.data?.uid || create.data?.user?.uid;
    console.log('4a. CREATE USER:', create.status, uid ? `UID=${uid}` : 'FAILED');

    const update = await request('POST', '/api/User/UpdateUser', {
      uid,
      name: 'John Doe Updated',
    }, token);
    console.log('4b. UPDATE USER:', update.status, update.data?.success ? 'SUCCESS' : 'FAILED');

    const get = await request('GET', `/api/User/GetUserByUID/${uid}`, null, token);
    console.log('4c. GET USER:', get.status, (get.data?.uid || get.data?.data?.uid) ? 'OK' : 'FAILED');

    const del = await request('DELETE', `/api/User/DeleteByID/${uid}`, null, token);
    console.log('4d. DELETE USER:', del.status, del.data?.success ? 'SUCCESS' : 'FAILED');
  } catch (e) {
    console.error('4. USER ERROR:', e.message);
  }

  // 5. ASSET CRUD
  try {
    const create = await request('POST', '/api/Assets/InsUpdAsset', {
      cid: 1,
      assetName: 'Solar Unit 1',
      assetType: 'Solar',
      capacity: 50,
    }, token);
    const assetId = create.data?.data?.assetid || create.data?.assetid || create.data?.resultId;
    console.log('5a. CREATE ASSET:', create.status, assetId ? `ASSET_ID=${assetId}` : 'FAILED');

    const update = await request('POST', '/api/Assets/InsUpdAsset', {
      assetid: assetId,
      cid: 1,
      assetName: 'Solar Unit 1 Updated',
    }, token);
    console.log('5b. UPDATE ASSET:', update.status, update.data?.success ? 'SUCCESS' : 'FAILED');

    const get = await request('GET', `/api/Assets/GetAssetByID/${assetId}`, null, token);
    console.log('5c. GET ASSET:', get.status, get.data ? 'OK' : 'FAILED');

    const del = await request('DELETE', `/api/Assets/DeleteByID/${assetId}/1`, null, token);
    console.log('5d. DELETE ASSET:', del.status, del.data?.success ? 'SUCCESS' : 'FAILED');
  } catch (e) {
    console.error('5. ASSET ERROR:', e.message);
  }

  // 6. ENTITY CRUD
  try {
    const create = await request('POST', '/api/Entities/InsUpdEntitiesUI', {
      cid: 1,
      name: 'Energy Entity Alpha',
      entityName: 'Energy Entity Alpha',
    }, token);
    const entityId = create.data?.data?.entityid || create.data?.entityid || create.data?.resultId;
    console.log('6a. CREATE ENTITY:', create.status, entityId ? `ENTITY_ID=${entityId}` : 'FAILED');

    const update = await request('POST', '/api/Entities/InsUpdEntitiesUI', {
      entityid: entityId,
      cid: 1,
      name: 'Energy Entity Alpha Updated',
    }, token);
    console.log('6b. UPDATE ENTITY:', update.status, update.data?.success ? 'SUCCESS' : 'FAILED');

    const get = await request('GET', `/api/Entities/GetRecordByID/${entityId}`, null, token);
    console.log('6c. GET ENTITY:', get.status, get.data ? 'OK' : 'FAILED');

    const del = await request('DELETE', `/api/Entities/DeleteByID/${entityId}/1`, null, token);
    console.log('6d. DELETE ENTITY:', del.status, del.data?.success ? 'SUCCESS' : 'FAILED');
  } catch (e) {
    console.error('6. ENTITY ERROR:', e.message);
  }

  // 7. FILING CRUD
  try {
    const create = await request('POST', '/api/Filings/CreateFiling', {
      cid: 1,
      uid: 1,
      status: 'Draft',
      docketNumber: 'ER26-100-000',
    }, token);
    const fid = create.data?.data?.fid || create.data?.fid || create.data?.resultId;
    console.log('7a. CREATE FILING:', create.status, fid ? `FID=${fid}` : 'FAILED');

    const update = await request('POST', '/api/Filings/UpdateFiling', {
      fid,
      cid: 1,
      status: 'Submitted',
    }, token);
    console.log('7b. UPDATE FILING:', update.status, update.data?.success ? 'SUCCESS' : 'FAILED');

    const get = await request('GET', `/api/Filings/GetFilingByID/${fid}`, null, token);
    console.log('7c. GET FILING:', get.status, get.data ? 'OK' : 'FAILED');
  } catch (e) {
    console.error('7. FILING ERROR:', e.message);
  }

  // 8. INVOICE CRUD
  try {
    const create = await request('POST', '/api/Invoice/CreateInvoice', {
      cid: 1,
      aid: 1,
      invoiceNumber: 'INV-2026-001',
      amount: 1500,
    }, token);
    const invoiceId = create.data?.data?.invoiceId || create.data?.invoiceId || create.data?.resultId;
    console.log('8a. CREATE INVOICE:', create.status, invoiceId ? `INV_ID=${invoiceId}` : 'FAILED');

    const update = await request('POST', '/api/Invoice/UpdateInvoice', {
      invoiceId,
      isBilled: true,
    }, token);
    console.log('8b. UPDATE INVOICE:', update.status, update.data?.success ? 'SUCCESS' : 'FAILED');

    const get = await request('GET', `/api/Invoice/GetInvoiceByID/${invoiceId}`, null, token);
    console.log('8c. GET INVOICE:', get.status, get.data ? 'OK' : 'FAILED');
  } catch (e) {
    console.error('8. INVOICE ERROR:', e.message);
  }

  // 9. CATEGORY STATUS CRUD
  try {
    const create = await request('POST', '/api/CatStatus/InsUpdCatStatusUI', {
      cid: 1,
      cat_status_desc: 'Category 1 Status',
      region: 'CAISO',
    }, token);
    const pid = create.data?.data?.pid || create.data?.pid || create.data?.resultId;
    console.log('9a. CREATE CATSTATUS:', create.status, pid ? `PID=${pid}` : 'FAILED');

    const get = await request('GET', `/api/CatStatus/GetRecordByID/${pid}`, null, token);
    console.log('9b. GET CATSTATUS:', get.status, get.data ? 'OK' : 'FAILED');

    const del = await request('DELETE', `/api/CatStatus/DeleteByID/${pid}/1`, null, token);
    console.log('9c. DELETE CATSTATUS:', del.status, del.data?.success ? 'SUCCESS' : 'FAILED');
  } catch (e) {
    console.error('9. CATSTATUS ERROR:', e.message);
  }

  console.log('\n=== FULL CRUD TEST COMPLETED ===');
}

run();
