const fs = require('fs');
const path = require('path');
const SemanticSearch = require('../lib/semantic-search');
const MaritimeSparqlEngine = require('../lib/sparql-engine');

const destinasiList = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'destinasi.json'), 'utf8'));

const searchEngine = new SemanticSearch(destinasiList);
const sparqlEngine = new MaritimeSparqlEngine(destinasiList);

console.log("=== TEST 1: Natural Language Query dari User / Dosen ===");
const query1 = "tempat snorkeling untuk pemula dengan budget maksimal Rp250.000 dan menyediakan alat snorkeling";
const res1 = searchEngine.search({ q: query1 });
console.log(`Query: "${query1}"`);
console.log(`Parsed:`, JSON.stringify(res1.parsedQuery, null, 2));
console.log(`Total Hasil: ${res1.total}`);
console.log(`Reasoning Steps:`, res1.reasoningSteps);
console.log(`Sample 3 Destinasi:`, res1.results.slice(0, 3).map(d => ({ id: d.id, nama: d.nama, total: d.estimasiTotalPerOrang, level: d.level })));

console.log("\n=== TEST 2: Faceted Filter Kombinasi Lengkap ===");
// Wisata Bawah Laut + Snorkeling + Pemula + Rp100.000–Rp250.000 + Alat Snorkeling Tersedia + Penyewaan Alat
const res2 = searchEngine.search({
  akt: "Snorkeling",
  lv: "Pemula",
  rangeHarga: "100k-250k",
  alat: "masker-snorkel",
  statusSewa: true
});
console.log(`Faceted Results: ${res2.total} destinasi`);
console.log(`Sample 3 Destinasi:`, res2.results.slice(0, 3).map(d => ({ id: d.id, nama: d.nama, range: d.rangeHargaTotalLabel })));

console.log("\n=== TEST 3: Eksekusi SPARQL Query Otomatis ===");
console.log("Generated SPARQL:\n" + res1.sparqlQuery);
const sparqlRes = sparqlEngine.query(res1.sparqlQuery);
console.log(`SPARQL Execution time: ${sparqlRes.meta.executionTimeMs} ms, Results count: ${sparqlRes.results.bindings.length}`);
if (sparqlRes.results.bindings.length > 0) {
  console.log(`Sample SPARQL Result 1:`, sparqlRes.results.bindings[0]);
}
