const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DEST_JSON = path.join(DATA_DIR, 'destinasi.json');

const NS = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  schema: 'https://schema.org/',
  maritim: 'http://wisatamaritim.id/ontology#',
  data: 'http://wisatamaritim.id/resource/'
};

function cleanUri(str) {
  return String(str || '').replace(/[^a-zA-Z0-9_-]/g, '_');
}

function escTtl(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, ' ');
}

function escXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function rangeKey(rangeId) {
  switch (rangeId) {
    case 'di-bawah-100k': return 'Range_Under100k';
    case '100k-250k': return 'Range_100k_250k';
    case '250k-500k': return 'Range_250k_500k';
    case '500k-1jt': return 'Range_500k_1M';
    case 'di-atas-1jt': return 'Range_Above1M';
    default: return 'Range_Under100k';
  }
}

function levelKey(lvl) {
  if (lvl === 'Pemula') return 'Tingkat_Pemula';
  if (lvl === 'Menengah') return 'Tingkat_Menengah';
  if (lvl === 'Mahir') return 'Tingkat_Mahir';
  return 'Tingkat_SemuaLevel';
}

function generateTurtle(destinasiList) {
  let ttl = `# ==============================================================================
# Ontologi Wisata Maritim Indonesia (Semantic Web Knowledge Base)
# Dibuat untuk Tugas Web Semantik - Kelompok 09
# Memuat relasi: Destinasi, Jenis Wisata, Aktivitas, Tingkat Keahlian,
#               Range Harga (Google-style), Peralatan & Persewaan, Fasilitas, Lokasi, Kuliner
# ==============================================================================

@prefix rdf: <${NS.rdf}> .
@prefix rdfs: <${NS.rdfs}> .
@prefix owl: <${NS.owl}> .
@prefix xsd: <${NS.xsd}> .
@prefix schema: <${NS.schema}> .
@prefix maritim: <${NS.maritim}> .
@prefix data: <${NS.data}> .

# ------------------------------------------------------------------------------
# KELAS (CLASSES)
# ------------------------------------------------------------------------------
maritim:DestinasiWisata a owl:Class ;
    rdfs:subClassOf schema:TouristAttraction ;
    rdfs:label "Destinasi Wisata Maritim"@id, "Maritime Tourism Destination"@en ;
    rdfs:comment "Entitas destinasi wisata pesisir, laut, dan pulau di Indonesia."@id .

maritim:JenisWisata a owl:Class ;
    rdfs:label "Jenis Wisata"@id ;
    rdfs:comment "Klasifikasi kategori wisata bahari (cth: Wisata Bawah Laut, Pantai, Resor)."@id .

maritim:Aktivitas a owl:Class ;
    rdfs:label "Aktivitas Bahari"@id ;
    rdfs:comment "Aktivitas rekreasi atau olahraga laut (cth: Snorkeling, Diving, Surfing)."@id .

maritim:TingkatKeahlian a owl:Class ;
    rdfs:label "Tingkat Keahlian"@id ;
    rdfs:comment "Level kompetensi fisik atau keahlian bahari (Pemula, Menengah, Mahir)."@id .

maritim:KategoriRangeHarga a owl:Class ;
    rdfs:label "Kategori Range Harga"@id ;
    rdfs:comment "Klasifikasi rentang budget Google-style (<100k, 100k-250k, 250k-500k, 500k-1M, >1M)."@id .

maritim:Peralatan a owl:Class ;
    rdfs:label "Peralatan Bahari"@id ;
    rdfs:comment "Peralatan rekreasi laut (cth: Masker, Snorkel, Fins, BCD, Papan Selancar)."@id .

maritim:PenawaranAlat a owl:Class ;
    rdfs:label "Penawaran / Persewaan Alat"@id ;
    rdfs:comment "Ketersediaan dan tarif persewaan alat di lokasi destinasi."@id .

maritim:Fasilitas a owl:Class ;
    rdfs:label "Fasilitas Wisata"@id ;
    rdfs:comment "Sarana pendukung di lokasi (cth: Dive Center, Homestay, Dermaga)."@id .

maritim:Wilayah a owl:Class ;
    rdfs:label "Wilayah Indonesia"@id .

maritim:Provinsi a owl:Class ;
    rdfs:label "Provinsi"@id .

maritim:KulinerSekitar a owl:Class ;
    rdfs:subClassOf schema:FoodEstablishment ;
    rdfs:label "Kuliner Sekitar Destinasi"@id .

# ------------------------------------------------------------------------------
# PROPERTI (PROPERTIES)
# ------------------------------------------------------------------------------
maritim:namaDestinasi a owl:DatatypeProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range xsd:string .

maritim:memilikiJenisWisata a owl:ObjectProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range maritim:JenisWisata .

maritim:memilikiAktivitas a owl:ObjectProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range maritim:Aktivitas .

maritim:cocokUntukTingkat a owl:ObjectProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range maritim:TingkatKeahlian .

maritim:memilikiPenawaranAlat a owl:ObjectProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range maritim:PenawaranAlat .

maritim:alatTerkait a owl:ObjectProperty ;
    rdfs:domain maritim:PenawaranAlat ;
    rdfs:range maritim:Peralatan .

maritim:hargaSewa a owl:DatatypeProperty ;
    rdfs:domain maritim:PenawaranAlat ;
    rdfs:range xsd:integer .

maritim:statusSewa a owl:DatatypeProperty ;
    rdfs:domain maritim:PenawaranAlat ;
    rdfs:range xsd:string .

maritim:tingkatAlat a owl:ObjectProperty ;
    rdfs:domain maritim:PenawaranAlat ;
    rdfs:range maritim:TingkatKeahlian .

maritim:memilikiFasilitas a owl:ObjectProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range maritim:Fasilitas .

maritim:hargaTiketMasuk a owl:DatatypeProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range xsd:integer .

maritim:hargaAktivitasMulai a owl:DatatypeProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range xsd:integer .

maritim:estimasiTotalBiaya a owl:DatatypeProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range xsd:integer .

maritim:kategoriHargaTiket a owl:ObjectProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range maritim:KategoriRangeHarga .

maritim:kategoriHargaTotal a owl:ObjectProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range maritim:KategoriRangeHarga .

maritim:beradaDiProvinsi a owl:ObjectProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range maritim:Provinsi .

maritim:beradaDiWilayah a owl:ObjectProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range maritim:Wilayah .

maritim:latitude a owl:DatatypeProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range xsd:decimal .

maritim:longitude a owl:DatatypeProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range xsd:decimal .

maritim:memilikiKulinerSekitar a owl:ObjectProperty ;
    rdfs:domain maritim:DestinasiWisata ;
    rdfs:range maritim:KulinerSekitar .

# ------------------------------------------------------------------------------
# INDIVIDU TINGKAT KEAHLIAN
# ------------------------------------------------------------------------------
data:Tingkat_Pemula a maritim:TingkatKeahlian ;
    rdfs:label "Pemula"@id, "Beginner"@en ;
    rdfs:comment "Cocok untuk wisatawan tanpa sertifikasi, perairan tenang atau berpanduan."@id .

data:Tingkat_Menengah a maritim:TingkatKeahlian ;
    rdfs:label "Menengah"@id, "Intermediate"@en ;
    rdfs:comment "Membutuhkan keahlian dasar, ketahanan fisik, atau sertifikasi Open Water."@id .

data:Tingkat_Mahir a maritim:TingkatKeahlian ;
    rdfs:label "Mahir"@id, "Advanced"@en ;
    rdfs:comment "Untuk penyelam berpengalaman (Advanced/Rescue) atau peselancar ombak besar."@id .

data:Tingkat_SemuaLevel a maritim:TingkatKeahlian ;
    rdfs:label "Semua level"@id, "All Levels"@en .

# ------------------------------------------------------------------------------
# INDIVIDU RANGE HARGA (GOOGLE FILTER STYLE)
# ------------------------------------------------------------------------------
data:Range_Under100k a maritim:KategoriRangeHarga ;
    rdfs:label "Di bawah Rp100.000"@id ;
    maritim:minPrice 0 ;
    maritim:maxPrice 99999 .

data:Range_100k_250k a maritim:KategoriRangeHarga ;
    rdfs:label "Rp100.000 – Rp250.000"@id ;
    maritim:minPrice 100000 ;
    maritim:maxPrice 250000 .

data:Range_250k_500k a maritim:KategoriRangeHarga ;
    rdfs:label "Rp250.000 – Rp500.000"@id ;
    maritim:minPrice 250001 ;
    maritim:maxPrice 500000 .

data:Range_500k_1M a maritim:KategoriRangeHarga ;
    rdfs:label "Rp500.000 – Rp1.000.000"@id ;
    maritim:minPrice 500001 ;
    maritim:maxPrice 1000000 .

data:Range_Above1M a maritim:KategoriRangeHarga ;
    rdfs:label "Di atas Rp1.000.000"@id ;
    maritim:minPrice 1000001 ;
    maritim:maxPrice 999999999 .

# ------------------------------------------------------------------------------
# DATA INSTANSI DESTINASI WISATA MARITIM
# ------------------------------------------------------------------------------
`;

  const seenProv = new Set();
  const seenWil = new Set();

  destinasiList.forEach(d => {
    const provUri = `data:provinsi_${cleanUri(d.provinsi)}`;
    if (!seenProv.has(provUri)) {
      seenProv.add(provUri);
      ttl += `\n${provUri} a maritim:Provinsi ; rdfs:label "${escTtl(d.provinsi)}"@id .`;
    }
    const wilUri = `data:wilayah_${cleanUri(d.wilayah)}`;
    if (!seenWil.has(wilUri)) {
      seenWil.add(wilUri);
      ttl += `\n${wilUri} a maritim:Wilayah ; rdfs:label "${escTtl(d.wilayah)}"@id .`;
    }

    const destUri = `data:destinasi_${cleanUri(d.id)}`;
    ttl += `\n${destUri} a maritim:DestinasiWisata ;\n`;
    ttl += `    rdfs:label "${escTtl(d.nama)}"@id ;\n`;
    ttl += `    maritim:kode "${escTtl(d.id)}" ;\n`;
    ttl += `    maritim:namaDestinasi "${escTtl(d.nama)}" ;\n`;
    ttl += `    maritim:lokasiLengkap "${escTtl(d.lokasi)}" ;\n`;
    if (d.foto) {
      ttl += `    schema:image "${escTtl(d.foto)}" ;\n`;
    }
    ttl += `    maritim:beradaDiProvinsi ${provUri} ;\n`;
    ttl += `    maritim:beradaDiWilayah ${wilUri} ;\n`;
    ttl += `    maritim:cocokUntukTingkat data:${levelKey(d.level)} ;\n`;
    ttl += `    maritim:hargaTiketMasuk ${d.hargaTiketMasuk || 0} ;\n`;
    ttl += `    maritim:kategoriHargaTiket data:${rangeKey(d.rangeHargaTiket)} ;\n`;
    ttl += `    maritim:estimasiTotalBiaya ${d.estimasiTotalPerOrang || 0} ;\n`;
    ttl += `    maritim:kategoriHargaTotal data:${rangeKey(d.rangeHargaTotal)} ;\n`;
    ttl += `    maritim:latitude ${d.latitude || 0} ;\n`;
    ttl += `    maritim:longitude ${d.longitude || 0} ;\n`;

    if (d.hargaAktivitasMulai) {
      ttl += `    maritim:hargaAktivitasMulai ${d.hargaAktivitasMulai} ;\n`;
      ttl += `    maritim:kategoriHargaAktivitas data:${rangeKey(d.rangeHargaAktivitas)} ;\n`;
    }

    (d.aktivitas || []).forEach(act => {
      ttl += `    maritim:memilikiAktivitas data:aktivitas_${cleanUri(act)} ;\n`;
    });

    (d.fasilitas || []).forEach(f => {
      ttl += `    maritim:memilikiFasilitas data:fasilitas_${cleanUri(f)} ;\n`;
    });

    (d.peralatan || []).forEach((eq, idx) => {
      ttl += `    maritim:memilikiPenawaranAlat data:offer_${cleanUri(d.id)}_${idx} ;\n`;
    });

    (d.kuliner || []).forEach((cul, cIdx) => {
      ttl += `    maritim:memilikiKulinerSekitar data:kuliner_${cleanUri(d.id)}_${cIdx} ;\n`;
    });

    ttl = ttl.replace(/ ;\n$/, ' .\n');

    (d.peralatan || []).forEach((eq, idx) => {
      const offerUri = `data:offer_${cleanUri(d.id)}_${idx}`;
      ttl += `${offerUri} a maritim:PenawaranAlat ;\n`;
      ttl += `    maritim:alatTerkait data:alat_${cleanUri(eq.id)} ;\n`;
      ttl += `    rdfs:label "${escTtl(eq.nama)}" ;\n`;
      ttl += `    maritim:hargaSewa ${eq.hargaSewa || 0} ;\n`;
      ttl += `    maritim:statusSewa "${eq.dapatDisewa ? 'Tersedia Disewa' : 'Termasuk Tiket'}" ;\n`;
      ttl += `    maritim:tingkatAlat data:${levelKey(eq.tingkatKeahlian)} .\n`;
    });

    (d.kuliner || []).forEach((cul, cIdx) => {
      const culUri = `data:kuliner_${cleanUri(d.id)}_${cIdx}`;
      ttl += `${culUri} a maritim:KulinerSekitar ;\n`;
      ttl += `    rdfs:label "${escTtl(cul.nama)}" ;\n`;
      ttl += `    maritim:kategoriKuliner "${escTtl(cul.kategori)}" ;\n`;
      ttl += `    maritim:menuAndalan "${escTtl(cul.menuAndalan)}" ;\n`;
      ttl += `    maritim:estimasiHarga "${escTtl(cul.estimasiHarga)}" ;\n`;
      ttl += `    maritim:rating ${cul.rating || 0} ;\n`;
      ttl += `    maritim:jarakKm ${cul.jarakKm || 0} ;\n`;
      ttl += `    maritim:latitude ${cul.latitude || 0} ;\n`;
      ttl += `    maritim:longitude ${cul.longitude || 0} .\n`;
    });
  });

  return ttl;
}

function generateRdfXml(destinasiList) {
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(`<rdf:RDF`);
  lines.push(`    xmlns:rdf="${NS.rdf}"`);
  lines.push(`    xmlns:rdfs="${NS.rdfs}"`);
  lines.push(`    xmlns:owl="${NS.owl}"`);
  lines.push(`    xmlns:xsd="${NS.xsd}"`);
  lines.push(`    xmlns:schema="${NS.schema}"`);
  lines.push(`    xmlns:maritim="${NS.maritim}"`);
  lines.push(`    xmlns:data="${NS.data}">`);
  lines.push('');
  lines.push(`  <owl:Ontology rdf:about="${NS.maritim}">`);
  lines.push(`    <rdfs:label xml:lang="id">Ontologi Wisata Maritim Indonesia (Kelompok 09)</rdfs:label>`);
  lines.push(`    <rdfs:comment xml:lang="id">Basis pengetahuan Web Semantik wisata maritim Indonesia dengan 336 destinasi, range harga, aktivitas, peralatan, dan kuliner.</rdfs:comment>`);
  lines.push(`  </owl:Ontology>`);
  lines.push('');

  // Classes
  const classes = [
    { id: 'DestinasiWisata', label: 'Destinasi Wisata Maritim', sub: `${NS.schema}TouristAttraction` },
    { id: 'JenisWisata', label: 'Jenis Wisata' },
    { id: 'Aktivitas', label: 'Aktivitas Bahari' },
    { id: 'TingkatKeahlian', label: 'Tingkat Keahlian' },
    { id: 'KategoriRangeHarga', label: 'Kategori Range Harga' },
    { id: 'Peralatan', label: 'Peralatan Bahari' },
    { id: 'PenawaranAlat', label: 'Penawaran / Persewaan Alat' },
    { id: 'Fasilitas', label: 'Fasilitas Wisata' },
    { id: 'Wilayah', label: 'Wilayah Indonesia' },
    { id: 'Provinsi', label: 'Provinsi' },
    { id: 'KulinerSekitar', label: 'Kuliner Sekitar Destinasi', sub: `${NS.schema}FoodEstablishment` }
  ];
  for (const c of classes) {
    lines.push(`  <owl:Class rdf:about="${NS.maritim}${c.id}">`);
    lines.push(`    <rdfs:label xml:lang="id">${escXml(c.label)}</rdfs:label>`);
    if (c.sub) lines.push(`    <rdfs:subClassOf rdf:resource="${escXml(c.sub)}"/>`);
    lines.push(`  </owl:Class>`);
  }
  lines.push('');

  // Object Properties
  const objProps = [
    ['memilikiJenisWisata', 'DestinasiWisata', 'JenisWisata'],
    ['memilikiAktivitas', 'DestinasiWisata', 'Aktivitas'],
    ['cocokUntukTingkat', 'DestinasiWisata', 'TingkatKeahlian'],
    ['memilikiPenawaranAlat', 'DestinasiWisata', 'PenawaranAlat'],
    ['alatTerkait', 'PenawaranAlat', 'Peralatan'],
    ['tingkatAlat', 'PenawaranAlat', 'TingkatKeahlian'],
    ['memilikiFasilitas', 'DestinasiWisata', 'Fasilitas'],
    ['kategoriHargaTiket', 'DestinasiWisata', 'KategoriRangeHarga'],
    ['kategoriHargaTotal', 'DestinasiWisata', 'KategoriRangeHarga'],
    ['beradaDiProvinsi', 'DestinasiWisata', 'Provinsi'],
    ['beradaDiWilayah', 'DestinasiWisata', 'Wilayah'],
    ['memilikiKulinerSekitar', 'DestinasiWisata', 'KulinerSekitar']
  ];
  for (const [prop, dom, rng] of objProps) {
    lines.push(`  <owl:ObjectProperty rdf:about="${NS.maritim}${prop}">`);
    lines.push(`    <rdfs:domain rdf:resource="${NS.maritim}${dom}"/>`);
    lines.push(`    <rdfs:range rdf:resource="${NS.maritim}${rng}"/>`);
    lines.push(`  </owl:ObjectProperty>`);
  }

  // Datatype Properties
  const dataProps = [
    ['kode', 'DestinasiWisata', 'string'],
    ['namaDestinasi', 'DestinasiWisata', 'string'],
    ['lokasiLengkap', 'DestinasiWisata', 'string'],
    ['hargaTiketMasuk', 'DestinasiWisata', 'integer'],
    ['hargaAktivitasMulai', 'DestinasiWisata', 'integer'],
    ['estimasiTotalBiaya', 'DestinasiWisata', 'integer'],
    ['latitude', 'DestinasiWisata', 'decimal'],
    ['longitude', 'DestinasiWisata', 'decimal'],
    ['hargaSewa', 'PenawaranAlat', 'integer'],
    ['statusSewa', 'PenawaranAlat', 'string']
  ];
  for (const [prop, dom, xsdType] of dataProps) {
    lines.push(`  <owl:DatatypeProperty rdf:about="${NS.maritim}${prop}">`);
    lines.push(`    <rdfs:domain rdf:resource="${NS.maritim}${dom}"/>`);
    lines.push(`    <rdfs:range rdf:resource="${NS.xsd}${xsdType}"/>`);
    lines.push(`  </owl:DatatypeProperty>`);
  }
  lines.push('');

  // Tingkat Keahlian & Range Harga Individuals
  const levels = [
    ['Tingkat_Pemula', 'Pemula'],
    ['Tingkat_Menengah', 'Menengah'],
    ['Tingkat_Mahir', 'Mahir'],
    ['Tingkat_SemuaLevel', 'Semua level']
  ];
  for (const [id, lbl] of levels) {
    lines.push(`  <maritim:TingkatKeahlian rdf:about="${NS.data}${id}">`);
    lines.push(`    <rdfs:label xml:lang="id">${escXml(lbl)}</rdfs:label>`);
    lines.push(`  </maritim:TingkatKeahlian>`);
  }

  const ranges = [
    ['Range_Under100k', 'Di bawah Rp100.000', 0, 99999],
    ['Range_100k_250k', 'Rp100.000 – Rp250.000', 100000, 250000],
    ['Range_250k_500k', 'Rp250.000 – Rp500.000', 250001, 500000],
    ['Range_500k_1M', 'Rp500.000 – Rp1.000.000', 500001, 1000000],
    ['Range_Above1M', 'Di atas Rp1.000.000', 1000001, 999999999]
  ];
  for (const [id, lbl, minP, maxP] of ranges) {
    lines.push(`  <maritim:KategoriRangeHarga rdf:about="${NS.data}${id}">`);
    lines.push(`    <rdfs:label xml:lang="id">${escXml(lbl)}</rdfs:label>`);
    lines.push(`    <maritim:minPrice rdf:datatype="${NS.xsd}integer">${minP}</maritim:minPrice>`);
    lines.push(`    <maritim:maxPrice rdf:datatype="${NS.xsd}integer">${maxP}</maritim:maxPrice>`);
    lines.push(`  </maritim:KategoriRangeHarga>`);
  }
  lines.push('');

  const seenProv = new Set();
  const seenWil = new Set();

  destinasiList.forEach(d => {
    const provId = `provinsi_${cleanUri(d.provinsi)}`;
    if (!seenProv.has(provId)) {
      seenProv.add(provId);
      lines.push(`  <maritim:Provinsi rdf:about="${NS.data}${provId}">`);
      lines.push(`    <rdfs:label xml:lang="id">${escXml(d.provinsi)}</rdfs:label>`);
      lines.push(`  </maritim:Provinsi>`);
    }

    const wilId = `wilayah_${cleanUri(d.wilayah)}`;
    if (!seenWil.has(wilId)) {
      seenWil.add(wilId);
      lines.push(`  <maritim:Wilayah rdf:about="${NS.data}${wilId}">`);
      lines.push(`    <rdfs:label xml:lang="id">${escXml(d.wilayah)}</rdfs:label>`);
      lines.push(`  </maritim:Wilayah>`);
    }

    const destId = `destinasi_${cleanUri(d.id)}`;
    lines.push(`  <maritim:DestinasiWisata rdf:about="${NS.data}${destId}">`);
    lines.push(`    <rdfs:label xml:lang="id">${escXml(d.nama)}</rdfs:label>`);
    lines.push(`    <maritim:kode>${escXml(d.id)}</maritim:kode>`);
    lines.push(`    <maritim:namaDestinasi>${escXml(d.nama)}</maritim:namaDestinasi>`);
    lines.push(`    <maritim:lokasiLengkap>${escXml(d.lokasi)}</maritim:lokasiLengkap>`);
    if (d.foto) {
      lines.push(`    <schema:image>${escXml(d.foto)}</schema:image>`);
    }
    lines.push(`    <maritim:beradaDiProvinsi rdf:resource="${NS.data}${provId}"/>`);
    lines.push(`    <maritim:beradaDiWilayah rdf:resource="${NS.data}${wilId}"/>`);
    lines.push(`    <maritim:cocokUntukTingkat rdf:resource="${NS.data}${levelKey(d.level)}"/>`);
    lines.push(`    <maritim:hargaTiketMasuk rdf:datatype="${NS.xsd}integer">${d.hargaTiketMasuk || 0}</maritim:hargaTiketMasuk>`);
    lines.push(`    <maritim:kategoriHargaTiket rdf:resource="${NS.data}${rangeKey(d.rangeHargaTiket)}"/>`);
    lines.push(`    <maritim:estimasiTotalBiaya rdf:datatype="${NS.xsd}integer">${d.estimasiTotalPerOrang || 0}</maritim:estimasiTotalBiaya>`);
    lines.push(`    <maritim:kategoriHargaTotal rdf:resource="${NS.data}${rangeKey(d.rangeHargaTotal)}"/>`);
    lines.push(`    <maritim:latitude rdf:datatype="${NS.xsd}decimal">${d.latitude || 0}</maritim:latitude>`);
    lines.push(`    <maritim:longitude rdf:datatype="${NS.xsd}decimal">${d.longitude || 0}</maritim:longitude>`);

    if (d.hargaAktivitasMulai) {
      lines.push(`    <maritim:hargaAktivitasMulai rdf:datatype="${NS.xsd}integer">${d.hargaAktivitasMulai}</maritim:hargaAktivitasMulai>`);
      lines.push(`    <maritim:kategoriHargaAktivitas rdf:resource="${NS.data}${rangeKey(d.rangeHargaAktivitas)}"/>`);
    }

    (d.aktivitas || []).forEach(act => {
      lines.push(`    <maritim:memilikiAktivitas rdf:resource="${NS.data}aktivitas_${cleanUri(act)}"/>`);
    });

    (d.fasilitas || []).forEach(f => {
      lines.push(`    <maritim:memilikiFasilitas rdf:resource="${NS.data}fasilitas_${cleanUri(f)}"/>`);
    });

    (d.peralatan || []).forEach((_, idx) => {
      lines.push(`    <maritim:memilikiPenawaranAlat rdf:resource="${NS.data}offer_${cleanUri(d.id)}_${idx}"/>`);
    });

    (d.kuliner || []).forEach((_, cIdx) => {
      lines.push(`    <maritim:memilikiKulinerSekitar rdf:resource="${NS.data}kuliner_${cleanUri(d.id)}_${cIdx}"/>`);
    });

    lines.push(`  </maritim:DestinasiWisata>`);

    (d.peralatan || []).forEach((eq, idx) => {
      lines.push(`  <maritim:PenawaranAlat rdf:about="${NS.data}offer_${cleanUri(d.id)}_${idx}">`);
      lines.push(`    <maritim:alatTerkait rdf:resource="${NS.data}alat_${cleanUri(eq.id)}"/>`);
      lines.push(`    <rdfs:label>${escXml(eq.nama)}</rdfs:label>`);
      lines.push(`    <maritim:hargaSewa rdf:datatype="${NS.xsd}integer">${eq.hargaSewa || 0}</maritim:hargaSewa>`);
      lines.push(`    <maritim:statusSewa>${eq.dapatDisewa ? 'Tersedia Disewa' : 'Termasuk Tiket'}</maritim:statusSewa>`);
      lines.push(`    <maritim:tingkatAlat rdf:resource="${NS.data}${levelKey(eq.tingkatKeahlian)}"/>`);
      lines.push(`  </maritim:PenawaranAlat>`);
    });

    (d.kuliner || []).forEach((cul, cIdx) => {
      lines.push(`  <maritim:KulinerSekitar rdf:about="${NS.data}kuliner_${cleanUri(d.id)}_${cIdx}">`);
      lines.push(`    <rdfs:label>${escXml(cul.nama)}</rdfs:label>`);
      lines.push(`    <maritim:kategoriKuliner>${escXml(cul.kategori)}</maritim:kategoriKuliner>`);
      lines.push(`    <maritim:menuAndalan>${escXml(cul.menuAndalan)}</maritim:menuAndalan>`);
      lines.push(`    <maritim:estimasiHarga>${escXml(cul.estimasiHarga)}</maritim:estimasiHarga>`);
      lines.push(`    <maritim:rating rdf:datatype="${NS.xsd}decimal">${cul.rating || 0}</maritim:rating>`);
      lines.push(`    <maritim:jarakKm rdf:datatype="${NS.xsd}decimal">${cul.jarakKm || 0}</maritim:jarakKm>`);
      lines.push(`    <maritim:latitude rdf:datatype="${NS.xsd}decimal">${cul.latitude || 0}</maritim:latitude>`);
      lines.push(`    <maritim:longitude rdf:datatype="${NS.xsd}decimal">${cul.longitude || 0}</maritim:longitude>`);
      lines.push(`  </maritim:KulinerSekitar>`);
    });
  });

  lines.push('</rdf:RDF>');
  return lines.join('\n') + '\n';
}

const destinasiList = JSON.parse(fs.readFileSync(DEST_JSON, 'utf8'));
const ttlContent = generateTurtle(destinasiList);
const rdfContent = generateRdfXml(destinasiList);

const ttlOut = path.join(DATA_DIR, 'maritim.ttl');
const rdfOut = path.join(DATA_DIR, 'maritim.rdf');

fs.writeFileSync(ttlOut, ttlContent, 'utf8');
fs.writeFileSync(rdfOut, rdfContent, 'utf8');

console.log(`Berhasil menulis ${ttlOut} (${ttlContent.length} bytes)`);
console.log(`Berhasil menulis ${rdfOut} (${rdfContent.length} bytes)`);
