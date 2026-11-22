const fs = require('fs');
const path = require('path');

// Baca data.js asli
const dataJsPath = path.join(__dirname, '..', 'js', 'data.js');
const rawCode = fs.readFileSync(dataJsPath, 'utf8');
const { RAW, WIL } = new Function(rawCode + '; return {RAW, WIL};')();

console.log(`Memproses ${RAW.length} destinasi wisata maritim...`);

function parsePriceRange(price) {
  if (price === null || price === undefined) return "di-bawah-100k";
  if (price < 100000) return "di-bawah-100k";
  if (price <= 250000) return "100k-250k";
  if (price <= 500000) return "250k-500k";
  if (price <= 1000000) return "500k-1jt";
  return "di-atas-1jt";
}

function getPriceRangeLabel(rangeId) {
  switch (rangeId) {
    case "di-bawah-100k": return "< Rp100.000";
    case "100k-250k": return "Rp100.000 – Rp250.000";
    case "250k-500k": return "Rp250.000 – Rp500.000";
    case "500k-1jt": return "Rp500.000 – Rp1.000.000";
    case "di-atas-1jt": return "> Rp1.000.000";
    default: return rangeId;
  }
}

// Analisis fasilitas
function extractFacilities(fStr) {
  if (!fStr || fStr === "-") return ["Pemandangan Alam"];
  const list = fStr.split(/[,;]/).map(s => s.trim()).filter(Boolean);
  return list.length ? list : ["Pemandangan Alam"];
}

// Analisis aktivitas
function extractActivities(aStr, jStr) {
  const combined = (aStr + " " + jStr).toLowerCase();
  const acts = [];
  if (/snorkel/i.test(combined)) acts.push("Snorkeling");
  if (/diving|selam|freedive/i.test(combined)) acts.push("Diving");
  if (/surf|selancar/i.test(combined)) acts.push("Surfing");
  if (/renang|berenang/i.test(combined)) acts.push("Berenang");
  if (/island hopping|hopping/i.test(combined)) acts.push("Island Hopping");
  if (/kayak|kano/i.test(combined)) acts.push("Kano & Kayak");
  if (/banana boat|parasailing|jet ski|water sports|olahraga air/i.test(combined)) acts.push("Wahana Air");
  if (/penyu|manta|hiu|lumba|dolphin|satwa|bekantan/i.test(combined)) acts.push("Satwa Laut");
  if (/trek|hiking|puncak|panjat/i.test(combined)) acts.push("Trekking & Panjat");
  if (/sunset|sunrise|foto|fotografi/i.test(combined)) acts.push("Fotografi & Sunset");
  if (/sejarah|benteng|budaya|museum|tugu|pura|tsunami|perahu tradisional/i.test(combined)) acts.push("Sejarah & Budaya Bahari");
  if (/kuliner|seafood|ikan bakar/i.test(combined)) acts.push("Kuliner Laut");
  if (/camping|kemah/i.test(combined)) acts.push("Camping Pantai");
  if (/memancing|mancing/i.test(combined)) acts.push("Memancing");

  if (!acts.length) acts.push("Wisata Pantai");
  return acts;
}

// Generate equipment per destination
function generateEquipment(d) {
  const acts = d.aktivitas;
  const teksAlat = (d.teksAlat || "").toLowerCase();
  const eqList = [];

  const hasSnorkel = acts.includes("Snorkeling") || /snorkel/i.test(teksAlat);
  const hasDiving = acts.includes("Diving") || /dive|selam/i.test(teksAlat);
  const hasSurfing = acts.includes("Surfing") || /surf|papan/i.test(teksAlat);
  const hasKayak = acts.includes("Kano & Kayak") || /kayak|kano/i.test(teksAlat);
  const hasBoat = acts.includes("Island Hopping") || acts.includes("Satwa Laut") || /perahu/i.test(teksAlat);
  const hasClimb = /panjat/i.test(d.aktivitasStr);

  if (hasSnorkel) {
    eqList.push({
      id: "masker-snorkel",
      nama: "Masker & Snorkel",
      kategoriAktivitas: "Snorkeling",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: 25000,
      tingkatKeahlian: "Pemula",
      keterangan: "Alat bernafas dasar di permukaan laut, sangat ramah pemula."
    });
    eqList.push({
      id: "fins-snorkeling",
      nama: "Fins (Kaki Katak)",
      kategoriAktivitas: "Snorkeling",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: 25000,
      tingkatKeahlian: "Pemula",
      keterangan: "Membantu mobilitas berenang di permukaan dan kedalaman dangkal."
    });
    eqList.push({
      id: "life-jacket",
      nama: "Pelampung / Life Jacket",
      kategoriAktivitas: "Snorkeling",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: 20000,
      tingkatKeahlian: "Pemula",
      keterangan: "Wajib untuk pemula yang belum mahir berenang agar tetap aman dan nyaman mengapung."
    });
    eqList.push({
      id: "snorkel-set-lengkap",
      nama: "Full Set Snorkeling (Masker, Snorkel, Fins, Pelampung)",
      kategoriAktivitas: "Snorkeling",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: d.biayaAlatMin || 50000,
      tingkatKeahlian: "Pemula",
      keterangan: "Paket lengkap alat snorkeling siap pakai."
    });
  }

  if (hasDiving) {
    eqList.push({
      id: "masker-fins-diving",
      nama: "Masker & Fins Diving",
      kategoriAktivitas: "Diving",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: 50000,
      tingkatKeahlian: "Semua Level",
      keterangan: "Masker silikon kedap air bertekanan dan open-heel fins."
    });
    eqList.push({
      id: "wetsuit-diving",
      nama: "Wetsuit Selam",
      kategoriAktivitas: "Diving",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: 50000,
      tingkatKeahlian: "Semua Level",
      keterangan: "Pakaian selam neoprena pelindung suhu tubuh dan sengatan ubur-ubur."
    });
    eqList.push({
      id: "tabung-scuba",
      nama: "Tabung Scuba (Oksigen)",
      kategoriAktivitas: "Diving",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: 100000,
      tingkatKeahlian: d.level === "Mahir" ? "Mahir" : "Menengah",
      keterangan: "Tabung udara terkompresi dengan pengisian udara bersih standar PADI/SSI."
    });
    eqList.push({
      id: "bcd-regulator",
      nama: "BCD & Regulator Selam",
      kategoriAktivitas: "Diving",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: 200000,
      tingkatKeahlian: d.level === "Mahir" ? "Mahir" : "Menengah",
      keterangan: "Buoyancy Control Device dan sistem pernafasan regulator 1st & 2nd stage."
    });
    eqList.push({
      id: "paket-fun-dive",
      nama: "Paket Fun Dive Lengkap (Alat + Guide + Kapal)",
      kategoriAktivitas: "Diving",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: d.biayaAktivitasMulai || 750000,
      tingkatKeahlian: d.level === "Pemula" ? "Pemula" : "Menengah",
      keterangan: d.level === "Pemula" 
        ? "Discovery Scuba Dive (DSD) dengan bimbingan instruktur langsung untuk pemula non-sertifikasi." 
        : "Fun dive berpemandu divemaster untuk penyelam bersertifikasi Open Water / Advanced."
    });
  }

  if (hasSurfing) {
    const isPemula = d.level === "Pemula";
    eqList.push({
      id: "papan-selancar",
      nama: isPemula ? "Papan Selancar Soft-top (Pemula)" : "Papan Selancar Fiber / Hardboard",
      kategoriAktivitas: "Surfing",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: d.biayaAlatMin || 75000,
      tingkatKeahlian: isPemula ? "Pemula" : (d.level || "Menengah"),
      keterangan: isPemula 
        ? "Papan busa empuk (soft-top) stabil dan aman dari benturan saat latihan." 
        : "Papan selancar performa tinggi untuk ombak bertenaga."
    });
    eqList.push({
      id: "leash-surfing",
      nama: "Leash (Tali Pengaman Kaki) & Wax",
      kategoriAktivitas: "Surfing",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: 0, // Include papan
      tingkatKeahlian: "Semua Level",
      keterangan: "Sudah termasuk dalam persewaan papan selancar."
    });
    eqList.push({
      id: "rashguard-surfing",
      nama: "Baju Renang / Rashguard",
      kategoriAktivitas: "Surfing",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: 35000,
      tingkatKeahlian: "Pemula",
      keterangan: "Pelindung kulit dari gesekan papan selancar dan terik matahari."
    });
  }

  if (hasKayak) {
    eqList.push({
      id: "kano-kayak",
      nama: "Perahu Kano / Kayak & Dayung",
      kategoriAktivitas: "Kano & Kayak",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: d.biayaAlatMin || 75000,
      tingkatKeahlian: "Pemula",
      keterangan: "Perahu santai untuk menjelajah laguna tenang atau hutan mangrove."
    });
  }

  if (hasBoat) {
    eqList.push({
      id: "sewa-perahu",
      nama: "Sewa Perahu Nelayan / Wisata Keliling",
      kategoriAktivitas: "Island Hopping",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: d.biayaPaketWisata || (d.biayaAktivitasMulai && d.biayaAktivitasMulai >= 200000 ? d.biayaAktivitasMulai : 350000),
      tingkatKeahlian: "Pemula",
      keterangan: "Perahu motor tradisional / speed boat untuk trip hopping dan melihat atraksi bahari."
    });
  }

  if (hasClimb) {
    eqList.push({
      id: "alat-panjat",
      nama: "Harness, Tali & Helm Panjat Tebing",
      kategoriAktivitas: "Trekking & Panjat",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: 100000,
      tingkatKeahlian: "Menengah",
      keterangan: "Set alat panjat pengaman tebing karst."
    });
  }

  // Jika tidak ada alat spesifik tapi ada pantai
  if (eqList.length === 0) {
    eqList.push({
      id: "pelampung-pantai",
      nama: "Ban Renang / Pelampung Santai",
      kategoriAktivitas: "Berenang",
      tersedia: true,
      dapatDisewa: true,
      hargaSewa: 20000,
      tingkatKeahlian: "Pemula",
      keterangan: "Pelampung rekreasi untuk bermain ombak tenang di tepi pantai."
    });
  }

  return eqList;
}

// Transform RAW
const destinasiList = RAW.map(r => {
  const k = r[0];
  const nama = r[1];
  const lokasi = r[2];
  const jenisWisata = r[3];
  const aktivitasStr = r[4];
  const atraksi = r[5];
  const fasilitasStr = r[6];
  const teksTiket = r[7];
  const teksAlat = r[8];
  const level = r[9];
  const sumber = r[10];
  const tiketNumerik = r[11] || 0;
  const biayaAlatMin = r[12];
  const wilayahIdx = r[13];

  const wilayah = WIL[wilayahIdx];
  const provinsi = lokasi.split(',').pop().trim();
  const kabKota = lokasi.split(',')[0].trim();

  // Biaya aktivitas & paket
  let biayaAktivitasMulai = null;
  let biayaPaketWisata = null;

  if (teksAlat && teksAlat !== "-") {
    // Cari angka fun dive atau boat
    const diveMatch = teksAlat.match(/dive\s*Rp?([0-9.,]+)(?:–([0-9.,]+))?(rb|jt)/i);
    if (diveMatch) {
      const mult = /jt/i.test(diveMatch[3]) ? 1000000 : 1000;
      biayaAktivitasMulai = parseFloat(diveMatch[1].replace(',', '.')) * mult;
    } else if (biayaAlatMin) {
      biayaAktivitasMulai = biayaAlatMin;
    }

    const paketMatch = teksAlat.match(/(?:paket|perahu|charter|liveaboard)\s*Rp?([0-9.,]+)(?:–([0-9.,]+))?(rb|jt)/i);
    if (paketMatch) {
      const mult = /jt/i.test(paketMatch[3]) ? 1000000 : 1000;
      biayaPaketWisata = parseFloat(paketMatch[1].replace(',', '.')) * mult;
    }
  }

  const aktivitas = extractActivities(aktivitasStr, jenisWisata);
  const fasilitas = extractFacilities(fasilitasStr);

  // Estimasi biaya total per orang (tiket + sewa alat termurah atau aktivitas dasar)
  const alatTermurah = biayaAlatMin || (biayaAktivitasMulai ? Math.min(biayaAktivitasMulai, 100000) : 0);
  const estimasiTotal = tiketNumerik + alatTermurah;

  const itemObj = {
    id: k,
    nama,
    lokasi,
    kabKota,
    provinsi,
    wilayah,
    wilayahIdx,
    jenisWisata,
    aktivitasStr,
    aktivitas,
    atraksi,
    fasilitasStr,
    fasilitas,
    teksTiket,
    teksAlat,
    level,
    sumber,
    hargaTiketMasuk: tiketNumerik,
    rangeHargaTiket: parsePriceRange(tiketNumerik),
    rangeHargaTiketLabel: getPriceRangeLabel(parsePriceRange(tiketNumerik)),
    hargaAktivitasMulai: biayaAktivitasMulai,
    rangeHargaAktivitas: biayaAktivitasMulai !== null ? parsePriceRange(biayaAktivitasMulai) : null,
    rangeHargaAktivitasLabel: biayaAktivitasMulai !== null ? getPriceRangeLabel(parsePriceRange(biayaAktivitasMulai)) : null,
    hargaPaketWisata: biayaPaketWisata,
    rangeHargaPaket: biayaPaketWisata !== null ? parsePriceRange(biayaPaketWisata) : null,
    biayaAlatMin,
    estimasiTotalPerOrang: estimasiTotal,
    rangeHargaTotal: parsePriceRange(estimasiTotal),
    rangeHargaTotalLabel: getPriceRangeLabel(parsePriceRange(estimasiTotal)),
  };

  itemObj.peralatan = generateEquipment(itemObj);
  itemObj.adaAlatDisewa = itemObj.peralatan.some(e => e.dapatDisewa);

  return itemObj;
});

// Simpan JSON
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

fs.writeFileSync(path.join(dataDir, 'destinasi.json'), JSON.stringify(destinasiList, null, 2), 'utf8');
console.log(`Berhasil menyimpan ${destinasiList.length} destinasi ke data/destinasi.json`);

// Generate Ontologi Turtle RDF (W3C Standard)
function generateTurtle(destinasiList) {
  let ttl = `# ==============================================================================
# Ontologi Wisata Maritim Indonesia (Semantic Web Knowledge Base)
# Dibuat untuk Tugas Web Semantik - Kelompok 09
# Memuat relasi: Destinasi, Jenis Wisata, Aktivitas, Tingkat Keahlian,
#               Range Harga (Google-style), Peralatan & Persewaan, Fasilitas, Lokasi
# ==============================================================================

@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix schema: <https://schema.org/> .
@prefix maritim: <http://wisatamaritim.id/ontology#> .
@prefix data: <http://wisatamaritim.id/resource/> .

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
    maritim:maxPrice 100000 .

data:Range_100k_250k a maritim:KategoriRangeHarga ;
    rdfs:label "Rp100.000 – Rp250.000"@id ;
    maritim:minPrice 100000 ;
    maritim:maxPrice 250000 .

data:Range_250k_500k a maritim:KategoriRangeHarga ;
    rdfs:label "Rp250.000 – Rp500.000"@id ;
    maritim:minPrice 250000 ;
    maritim:maxPrice 500000 .

data:Range_500k_1M a maritim:KategoriRangeHarga ;
    rdfs:label "Rp500.000 – Rp1.000.000"@id ;
    maritim:minPrice 500000 ;
    maritim:maxPrice 1000000 .

data:Range_Above1M a maritim:KategoriRangeHarga ;
    rdfs:label "Di atas Rp1.000.000"@id ;
    maritim:minPrice 1000000 ;
    maritim:maxPrice 999999999 .

# ------------------------------------------------------------------------------
# DATA INSTANSI DESTINASI WISATA MARITIM
# ------------------------------------------------------------------------------
`;

  function cleanUri(str) {
    return str.replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  function rangeUri(rangeId) {
    switch (rangeId) {
      case "di-bawah-100k": return "data:Range_Under100k";
      case "100k-250k": return "data:Range_100k_250k";
      case "250k-500k": return "data:Range_250k_500k";
      case "500k-1jt": return "data:Range_500k_1M";
      case "di-atas-1jt": return "data:Range_Above1M";
      default: return "data:Range_Under100k";
    }
  }

  function levelUri(lvl) {
    if (lvl === "Pemula") return "data:Tingkat_Pemula";
    if (lvl === "Menengah") return "data:Tingkat_Menengah";
    if (lvl === "Mahir") return "data:Tingkat_Mahir";
    return "data:Tingkat_SemuaLevel";
  }

  destinasiList.forEach(d => {
    const destUri = `data:destinasi_${cleanUri(d.id)}`;
    ttl += `\n${destUri} a maritim:DestinasiWisata ;\n`;
    ttl += `    maritim:kode "${d.id}" ;\n`;
    ttl += `    maritim:namaDestinasi "${d.nama.replace(/"/g, '\\"')}" ;\n`;
    ttl += `    maritim:lokasiLengkap "${d.lokasi.replace(/"/g, '\\"')}" ;\n`;
    ttl += `    maritim:beradaDiProvinsi data:provinsi_${cleanUri(d.provinsi)} ;\n`;
    ttl += `    maritim:beradaDiWilayah data:wilayah_${cleanUri(d.wilayah)} ;\n`;
    ttl += `    maritim:cocokUntukTingkat ${levelUri(d.level)} ;\n`;
    ttl += `    maritim:hargaTiketMasuk ${d.hargaTiketMasuk} ;\n`;
    ttl += `    maritim:kategoriHargaTiket ${rangeUri(d.rangeHargaTiket)} ;\n`;
    ttl += `    maritim:estimasiTotalBiaya ${d.estimasiTotalPerOrang} ;\n`;
    ttl += `    maritim:kategoriHargaTotal ${rangeUri(d.rangeHargaTotal)} ;\n`;

    if (d.hargaAktivitasMulai) {
      ttl += `    maritim:hargaAktivitasMulai ${d.hargaAktivitasMulai} ;\n`;
      ttl += `    maritim:kategoriHargaAktivitas ${rangeUri(d.rangeHargaAktivitas)} ;\n`;
    }

    // Aktivitas
    d.aktivitas.forEach(act => {
      ttl += `    maritim:memilikiAktivitas data:aktivitas_${cleanUri(act)} ;\n`;
    });

    // Fasilitas
    d.fasilitas.forEach(f => {
      ttl += `    maritim:memilikiFasilitas data:fasilitas_${cleanUri(f)} ;\n`;
    });

    // Penawaran Alat
    d.peralatan.forEach((eq, idx) => {
      const offerUri = `data:offer_${cleanUri(d.id)}_${idx}`;
      ttl += `    maritim:memilikiPenawaranAlat ${offerUri} ;\n`;
    });

    ttl = ttl.replace(/ ;\n$/, ' .\n');

    // Tulis individu penawaran alat
    d.peralatan.forEach((eq, idx) => {
      const offerUri = `data:offer_${cleanUri(d.id)}_${idx}`;
      ttl += `${offerUri} a maritim:PenawaranAlat ;\n`;
      ttl += `    maritim:alatTerkait data:alat_${cleanUri(eq.id)} ;\n`;
      ttl += `    rdfs:label "${eq.nama.replace(/"/g, '\\"')}" ;\n`;
      ttl += `    maritim:hargaSewa ${eq.hargaSewa} ;\n`;
      ttl += `    maritim:statusSewa "${eq.dapatDisewa ? 'Tersedia Disewa' : 'Termasuk Tiket'}" ;\n`;
      ttl += `    maritim:tingkatAlat ${levelUri(eq.tingkatKeahlian)} .\n`;
    });
  });

  return ttl;
}

const ttlContent = generateTurtle(destinasiList);
fs.writeFileSync(path.join(dataDir, 'maritim.ttl'), ttlContent, 'utf8');
console.log(`Berhasil membangkitkan Ontologi RDF/Turtle ke data/maritim.ttl (${ttlContent.length} bytes)`);
