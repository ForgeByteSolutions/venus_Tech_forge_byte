const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function testAll() {
  console.log('--- Testing Accounts, Companies, Groups, and Assets APIs ---');

  // 1. Account
  const accList = await request({ hostname: 'localhost', port: 3000, path: '/api/Account/GetAccountListByUID/1', method: 'GET' });
  console.log('Accounts count:', accList.status, Array.isArray(accList.data) ? accList.data.length : 'Not array');

  // 2. Company
  const compList = await request({ hostname: 'localhost', port: 3000, path: '/api/Company/GetCompanyListByUIDAGID/1/0', method: 'GET' });
  console.log('Companies count:', compList.status, Array.isArray(compList.data) ? compList.data.length : 'Not array');

  // 3. Account Groups
  const groupList = await request({ hostname: 'localhost', port: 3000, path: '/api/Account/GetAccountGroupsByAID/1', method: 'GET' });
  console.log('Account Groups for AID 1:', groupList.status, Array.isArray(groupList.data) ? groupList.data.length : 'Not array');

  // 4. Assets for Company 1 and Company 2
  const asset1 = await request({ hostname: 'localhost', port: 3000, path: '/api/Assets/GetAssetsListByCID/1', method: 'GET' });
  console.log('Assets for CID 1:', asset1.status, Array.isArray(asset1.data) ? asset1.data.length : 'Not array');

  const asset2 = await request({ hostname: 'localhost', port: 3000, path: '/api/Assets/GetAssetsListByCID/2', method: 'GET' });
  console.log('Assets for CID 2:', asset2.status, Array.isArray(asset2.data) ? asset2.data.length : 'Not array');

  // 5. Test CRUD on Asset: Add a new test asset, then delete it
  const newAsset = {
    cid: 1,
    asset_name: 'Test Wind Farm Alpha',
    asset_code: 'WIND-ALPHA-1',
    gen_asset_type: 'Wind',
    capacity_mw: 50,
    balancing_authority: 'CAISO'
  };
  const addAssetRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/Assets/InsUpdAsset',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, newAsset);
  console.log('Asset Create Result:', addAssetRes.status, addAssetRes.data?.resultId || addAssetRes.data?.id);

  const assetId = addAssetRes.data?.resultId || addAssetRes.data?.id || addAssetRes.data?.assetid;
  if (assetId) {
    const delAssetRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/Assets/DeleteByID/${assetId}/1`,
      method: 'DELETE'
    });
    console.log('Asset Delete Result:', delAssetRes.status, delAssetRes.data);
  }

  // 6. Test Indicative PSS and MSS study parameters loading
  const mssParams = await request({ hostname: 'localhost', port: 3000, path: '/api/IMSS/GetMSSStudyParameters/1/1', method: 'GET' });
  console.log('IMSS Parameters for study 1:', mssParams.status, Array.isArray(mssParams.data) ? mssParams.data.length : 'Not array');

  const pssParams = await request({ hostname: 'localhost', port: 3000, path: '/api/IPSS/GetPSSStudyParameters/1/1', method: 'GET' });
  console.log('IPSS Parameters for study 1:', pssParams.status, Array.isArray(pssParams.data) ? pssParams.data.length : 'Not array');
}

testAll().catch(console.error);
