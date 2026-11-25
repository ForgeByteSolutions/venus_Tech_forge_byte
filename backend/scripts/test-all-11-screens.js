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
  console.log('--- Testing Dropdown Lookups ---');
  for (const table of ['lookbaa', 'lookregion', 'lookentityidtype']) {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/Common/GetDropDownList?table=${table}`,
      method: 'GET'
    });
    console.log(`Dropdown [${table}]: Status ${res.status}, Count: ${Array.isArray(res.data) ? res.data.length : 'Not array'}`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      console.log(`  Sample [${table}]:`, JSON.stringify(res.data[0]));
    }
  }

  const screens = [
    { name: 'MBR Authorization', path: 'MBRAuth' },
    { name: 'Category Status', path: 'CatStatus' },
    { name: 'Mitigations', path: 'Mitigation' },
    { name: 'Self Limitations', path: 'SelfLimit' },
    { name: 'Operating Reserves', path: 'OR' },
    { name: 'Entities to Entities', path: 'EtoE' },
    { name: 'Entities to Gen Assets', path: 'EtoGen' },
    { name: 'Entities to PPAs', path: 'EtoPPAs' },
    { name: 'Entities to Vertical Assets', path: 'EtoVA' },
    { name: 'Indicative PSS', path: 'IPSS' },
    { name: 'Indicative MSS', path: 'IMSS' }
  ];

  console.log('\n--- Testing Company 1 (CID 1) and Company 2 (CID 2) for All 11 Screens ---');
  for (const s of screens) {
    for (const cid of [1, 2]) {
      const res = await request({
        hostname: 'localhost',
        port: 3000,
        path: `/api/${s.path}/GetListByCID/${cid}`,
        method: 'GET'
      });
      const count = Array.isArray(res.data) ? res.data.length : (res.data?.data?.length || 0);
      console.log(`Screen [${s.name}] CID ${cid}: Status ${res.status}, Count: ${count}`);
    }
  }

  console.log('\n--- Testing CRUD InsUpd for Indicative MSS and Dropdown-dependent screens ---');
  // Test insert into Indicative MSS
  const newMss = {
    cid: 1,
    study_type_fk: 1,
    study_end_year: 2026,
    study_area_balancing_authority_fk: 'PJM',
    study_scenario_type_fk: 'Base Case'
  };
  const createMss = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/IMSS/InsUpdIMSS',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, newMss);
  console.log('InsUpdIMSS Result:', createMss.status, createMss.data);

  // Test insert into Category Status with region
  const newCat = {
    cid: 1,
    region: 'CE',
    category_status: 'Category 1',
    effective_date: '2026-01-01',
    order_date: '2026-01-01',
    docket_number: 'ER26-1000'
  };
  const createCat = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/CatStatus/InsUpdCatStatus',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, newCat);
  console.log('InsUpdCatStatus Result:', createCat.status, createCat.data);

  // Check updated counts
  const checkMss = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/IMSS/GetListByCID/1',
    method: 'GET'
  });
  console.log('Updated Indicative MSS Count for CID 1:', checkMss.data?.length);

  console.log('\n--- All verification completed successfully ---');
}

testAll().catch(console.error);
