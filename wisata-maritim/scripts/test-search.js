const fs = require('fs');
const path = require('path');
const assert = require('assert');
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

console.log("\n=== TEST 4: Kategori Harga dari Kata Kunci ===");
const priceCategoryCases = [
  ['murah', 'di-bawah-100k'],
  ['terjangkau', '100k-250k'],
  ['standar', '250k-500k'],
  ['mahal', '500k-1jt'],
  ['premium', 'di-atas-1jt'],
  ['gratis', 'di-bawah-100k']
];

for (const [q, expectedRange] of priceCategoryCases) {
  const result = searchEngine.search({ q });
  assert.strictEqual(result.parsedQuery.rangeHarga, expectedRange, `Kategori harga untuk "${q}"`);
  assert.deepStrictEqual(result.parsedQuery.keywords, [], `Kata harga tidak tersisa sebagai keyword: "${q}"`);
  assert.ok(result.total > 0, `Pencarian "${q}" memiliki hasil`);
}

const numericBudgetResult = searchEngine.search({ q: 'terjangkau maksimal 250rb' });
assert.strictEqual(numericBudgetResult.parsedQuery.maxBudget, 250000);
assert.strictEqual(numericBudgetResult.parsedQuery.rangeHarga, '100k-250k');

const budgetOnlyResult = searchEngine.search({ q: 'maksimal 250rb' });
const explicitBudgetResult = searchEngine.search({ maxBudget: 250000 });
assert.strictEqual(budgetOnlyResult.parsedQuery.rangeHarga, null);
assert.ok(budgetOnlyResult.results.some(destination => destination.rangeHargaTotal === 'di-bawah-100k'));
assert.deepStrictEqual(
  budgetOnlyResult.results.map(destination => destination.id),
  explicitBudgetResult.results.map(destination => destination.id)
);

const intermediateLevelResult = searchEngine.search({ q: 'level menengah' });
assert.strictEqual(intermediateLevelResult.parsedQuery.tingkatKeahlian, 'Menengah');
assert.strictEqual(intermediateLevelResult.parsedQuery.rangeHarga, null);

const priceRangeBounds = sparqlEngine.triples
  .filter(triple => triple.p === 'maritim:minPrice')
  .map(triple => {
    const maxTriple = sparqlEngine.triples.find(item =>
      item.s === triple.s && item.p === 'maritim:maxPrice'
    );
    return { min: Number(triple.o), max: Number(maxTriple.o) };
  })
  .sort((a, b) => a.min - b.min);

for (let index = 1; index < priceRangeBounds.length; index += 1) {
  assert.ok(
    priceRangeBounds[index - 1].max < priceRangeBounds[index].min,
    'Range harga RDF tidak tumpang tindih'
  );
}
console.log("Kategori harga, batas budget, level Menengah, dan range RDF: lulus");
