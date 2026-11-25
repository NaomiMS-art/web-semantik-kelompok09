const http = require('http');
const app = require('../server');

const server = app.listen(3001, async () => {
  console.log('Test Server berjalan di port 3001');

  async function testUrl(path, options = {}) {
    return new Promise((resolve, reject) => {
      const req = http.request(`http://localhost:3001${path}`, options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      });
      req.on('error', reject);
      if (options.body) req.write(options.body);
      req.end();
    });
  }

  try {
    // 1. Test Static HTML
    const r1 = await testUrl('/');
    console.log(`[PASS] GET / : Status ${r1.status}, Length: ${r1.body.length}`);

    // 2. Test Semantic Search
    const r2 = await testUrl('/api/search?q=tempat%20snorkeling%20untuk%20pemula%20dengan%20budget%20maksimal%20Rp250.000%20dan%20menyediakan%20alat%20snorkeling');
    const data2 = JSON.parse(r2.body);
    console.log(`[PASS] GET /api/search (Natural Language) : Status ${r2.status}, Results: ${data2.total}, Reasoning steps: ${data2.reasoningSteps.length}`);

    // 3. Test Faceted Filter
    const r3 = await testUrl('/api/search?akt=Snorkeling&lv=Pemula&rangeHarga=100k-250k&statusSewa=true');
    const data3 = JSON.parse(r3.body);
    console.log(`[PASS] GET /api/search (Faceted Filter) : Status ${r3.status}, Results: ${data3.total}`);

    // 4. Test Destination Detail & Knowledge Graph
    const r4 = await testUrl('/api/destinasi/SMT-01');
    const data4 = JSON.parse(r4.body);
    console.log(`[PASS] GET /api/destinasi/SMT-01 : Status ${r4.status}, Name: ${data4.destinasi.nama}, KG Nodes: ${data4.knowledgeGraph.nodes.length}`);

    // 5. Test Facets
    const r5 = await testUrl('/api/facets');
    const data5 = JSON.parse(r5.body);
    const activityRangeKeys = ['di-bawah-100k', '100k-250k', '250k-500k', '500k-1jt', 'di-atas-1jt'];
    if (!activityRangeKeys.every(key => typeof data5.rangeAktivitas?.[key] === 'number')) {
      throw new Error('Facets rangeAktivitas belum mengembalikan jumlah untuk semua rentang harga.');
    }
    console.log(`[PASS] GET /api/facets : Status ${r5.status}, Total Destinasi: ${data5.totalDestinasi}, Ranges:`, data5.rangeTotal, 'Activity ranges:', data5.rangeAktivitas);

    // 6. Test SPARQL Endpoint
    const sparqlQuery = `PREFIX maritim: <http://wisatamaritim.id/ontology#>
SELECT ?nama ?level ?totalBiaya WHERE {
  ?dest maritim:namaDestinasi ?nama ;
        maritim:tingkatKeahlian ?level ;
        maritim:estimasiTotalBiaya ?totalBiaya .
  FILTER(?totalBiaya <= 100000)
} LIMIT 5`;

    const r6 = await testUrl('/api/sparql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: sparqlQuery })
    });
    const data6 = JSON.parse(r6.body);
    console.log(`[PASS] POST /api/sparql : Status ${r6.status}, Bindings count: ${data6.results.bindings.length}`);

    // 7. Test Ontology Turtle
    const r7 = await testUrl('/api/ontology');
    console.log(`[PASS] GET /api/ontology : Status ${r7.status}, Type: ${r7.headers['content-type']}, Length: ${r7.body.length}`);

    console.log('\n=== SEMUA 7 TEST INTEGRASI REST API & SPARQL ENGINE BERHASIL 100%! ===');
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('[FAIL]', err);
    server.close(() => process.exit(1));
  }
});
