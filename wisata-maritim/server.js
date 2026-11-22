const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const SemanticSearch = require('./lib/semantic-search');
const MaritimeSparqlEngine = require('./lib/sparql-engine');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load Data Destinasi
const dataFile = path.join(__dirname, 'data', 'destinasi.json');
let destinasiList = [];
if (fs.existsSync(dataFile)) {
  destinasiList = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
} else {
  // Jika belum di-generate, panggil script build-data
  require('./scripts/build-data');
  destinasiList = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

const semanticSearch = new SemanticSearch(destinasiList);
const sparqlEngine = new MaritimeSparqlEngine(destinasiList);

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// ==============================================================================
// REST API ENDPOINTS
// ==============================================================================

// 1. API Search (Natural Language & Faceted Search)
app.get('/api/search', (req, res) => {
  try {
    const response = semanticSearch.search(req.query);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// 2. API SPARQL Endpoint (W3C Standard Endpoint)
const handleSparql = (req, res) => {
  const query = req.body.query || req.query.query;
  if (!query) {
    return res.status(400).json({ error: true, message: 'Parameter "query" SPARQL wajib diisi.' });
  }
  const result = sparqlEngine.query(query);
  res.json(result);
};

app.get('/api/sparql', handleSparql);
app.post('/api/sparql', handleSparql);

// 3. API Detail Destinasi & Knowledge Graph Nodes
app.get('/api/destinasi/:id', (req, res) => {
  const dest = destinasiList.find(d => d.id === req.params.id);
  if (!dest) {
    return res.status(404).json({ error: true, message: 'Destinasi tidak ditemukan.' });
  }

  // Hitung rekomendasi semantik serupa (berdasarkan aktivitas, level, wilayah yang sama)
  const recommendations = destinasiList
    .filter(d => d.id !== dest.id)
    .map(d => {
      let score = 0;
      // Aktivitas sama
      const sharedActs = d.aktivitas.filter(a => dest.aktivitas.includes(a)).length;
      score += sharedActs * 3;
      // Level sama
      if (d.level === dest.level) score += 2;
      // Wilayah sama
      if (d.wilayahIdx === dest.wilayahIdx) score += 1;
      // Range harga total sama
      if (d.rangeHargaTotal === dest.rangeHargaTotal) score += 2;
      return { destinasi: d, score };
    })
    .filter(item => item.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.destinasi);

  // Buat Visual Knowledge Graph Nodes & Links (untuk D3.js / Canvas visualization)
  const graphNodes = [
    { id: dest.id, label: dest.nama, type: 'destinasi', group: 1 }
  ];
  const graphLinks = [];

  // Node Tingkat Keahlian
  graphNodes.push({ id: `level_${dest.level}`, label: `Level: ${dest.level}`, type: 'keahlian', group: 2 });
  graphLinks.push({ source: dest.id, target: `level_${dest.level}`, label: 'cocokUntukTingkat' });

  // Node Range Harga Total & Tiket
  graphNodes.push({ id: `range_${dest.rangeHargaTotal}`, label: `Total: ${dest.rangeHargaTotalLabel}`, type: 'rangeHarga', group: 3 });
  graphLinks.push({ source: dest.id, target: `range_${dest.rangeHargaTotal}`, label: 'kategoriHargaTotal' });

  // Node Provinsi & Wilayah
  graphNodes.push({ id: `prov_${dest.provinsi}`, label: dest.provinsi, type: 'lokasi', group: 4 });
  graphLinks.push({ source: dest.id, target: `prov_${dest.provinsi}`, label: 'beradaDiProvinsi' });

  // Node Aktivitas
  dest.aktivitas.forEach((act, i) => {
    const actId = `act_${dest.id}_${i}`;
    graphNodes.push({ id: actId, label: act, type: 'aktivitas', group: 5 });
    graphLinks.push({ source: dest.id, target: actId, label: 'memilikiAktivitas' });
  });

  // Node Peralatan
  dest.peralatan.forEach((eq, i) => {
    const eqId = `eq_${dest.id}_${i}`;
    graphNodes.push({ 
      id: eqId, 
      label: `${eq.nama} (${eq.hargaSewa ? 'Rp' + eq.hargaSewa.toLocaleString('id-ID') : 'Include'})`, 
      type: 'peralatan', 
      group: 6 
    });
    graphLinks.push({ source: dest.id, target: eqId, label: 'memilikiPenawaranAlat' });
  });

  // Node Fasilitas
  dest.fasilitas.slice(0, 4).forEach((f, i) => {
    const fId = `fac_${dest.id}_${i}`;
    graphNodes.push({ id: fId, label: f, type: 'fasilitas', group: 7 });
    graphLinks.push({ source: dest.id, target: fId, label: 'memilikiFasilitas' });
  });

  res.json({
    destinasi: dest,
    recommendations,
    knowledgeGraph: {
      nodes: graphNodes,
      links: graphLinks
    }
  });
});

// 4. API Facet Data Summary (untuk sidebar filter)
app.get('/api/facets', (req, res) => {
  // Hitung jumlah untuk masing-masing opsi facet
  const jenisCount = {};
  const aktivitasCount = {};
  const levelCount = { Pemula: 0, Menengah: 0, Mahir: 0, 'Semua level': 0 };
  const rangeTotalCount = {
    'di-bawah-100k': 0,
    '100k-250k': 0,
    '250k-500k': 0,
    '500k-1jt': 0,
    'di-atas-1jt': 0
  };
  const rangeTiketCount = {
    'di-bawah-100k': 0,
    '100k-250k': 0,
    '250k-500k': 0,
    '500k-1jt': 0,
    'di-atas-1jt': 0
  };
  const peralatanCount = {};
  const wilayahCount = {};
  const provinsiCount = {};

  destinasiList.forEach(d => {
    // Jenis
    jenisCount[d.jenisWisata] = (jenisCount[d.jenisWisata] || 0) + 1;

    // Aktivitas
    d.aktivitas.forEach(a => {
      aktivitasCount[a] = (aktivitasCount[a] || 0) + 1;
    });

    // Level
    if (levelCount[d.level] !== undefined) levelCount[d.level]++;

    // Range Total
    if (rangeTotalCount[d.rangeHargaTotal] !== undefined) rangeTotalCount[d.rangeHargaTotal]++;

    // Range Tiket
    if (rangeTiketCount[d.rangeHargaTiket] !== undefined) rangeTiketCount[d.rangeHargaTiket]++;

    // Peralatan
    d.peralatan.forEach(eq => {
      peralatanCount[eq.nama] = (peralatanCount[eq.nama] || 0) + 1;
    });

    // Wilayah & Provinsi
    wilayahCount[d.wilayah] = (wilayahCount[d.wilayah] || 0) + 1;
    provinsiCount[d.provinsi] = (provinsiCount[d.provinsi] || 0) + 1;
  });

  res.json({
    totalDestinasi: destinasiList.length,
    jenis: jenisCount,
    aktivitas: aktivitasCount,
    level: levelCount,
    rangeTotal: rangeTotalCount,
    rangeTiket: rangeTiketCount,
    peralatan: peralatanCount,
    wilayah: wilayahCount,
    provinsi: Object.keys(provinsiCount).sort().reduce((acc, k) => {
      acc[k] = provinsiCount[k];
      return acc;
    }, {})
  });
});

// 5. API Download / View Ontologi Turtle
app.get('/api/ontology', (req, res) => {
  const ttlPath = path.join(__dirname, 'data', 'maritim.ttl');
  if (fs.existsSync(ttlPath)) {
    res.setHeader('Content-Type', 'text/turtle; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="maritim.ttl"');
    fs.createReadStream(ttlPath).pipe(res);
  } else {
    res.status(404).send('File ontologi maritim.ttl belum dibuat.');
  }
});

// 6. API Knowledge Base Stats
app.get('/api/stats', (req, res) => {
  res.json({
    totalDestinasi: destinasiList.length,
    totalTriples: sparqlEngine.triples.length,
    wilayahCount: 7,
    aktivitasCount: 12,
    rangeKategoriCount: 5,
    sparqlEndpoint: '/api/sparql',
    ontologyEndpoint: '/api/ontology'
  });
});

// 7. Fallback untuk Single Page Application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Jalankan Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`⛵ Mesin Pencari Wisata Maritim (Web Semantik) Berjalan!`);
    console.log(`🌐 URL Aplikasi    : http://localhost:${PORT}`);
    console.log(`⚡ SPARQL Endpoint : http://localhost:${PORT}/api/sparql`);
    console.log(`📜 Ontologi Turtle : http://localhost:${PORT}/api/ontology`);
    console.log(`📊 Triples Loaded  : ${sparqlEngine.triples.length} triples`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
