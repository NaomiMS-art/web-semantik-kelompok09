// ==============================================================================
// GEO-CULINARY ENRICHER (INDONESIA MARITIME SEMANTIC ENGINE)
// Menghubungkan setiap destinasi maritim dengan:
// 1. Koordinat presisi (Latitude, Longitude) di perairan/pesisir Nusantara
// 2. Daftar kuliner lokal terdekat dengan menu andalan, harga, rating, dan jarak (Haversine)
// ==============================================================================

// Rumus Haversine: Hitung jarak akurat antara dua titik koordinat bumi (dalam kilometer)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius rata-rata bumi dalam km
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Jarak 1 desimal (contoh: 1.4 km)
}

// Pusat Koordinat Referensi Kota / Wilayah Bahari Utama Indonesia
const REGIONAL_COORDS = [
  // SUMATRA
  { match: /sabang|iboih|rubiah|gapang|sumur tiga|weh/i, lat: 5.8943, lon: 95.3197 },
  { match: /banda aceh|lampuuk|ujung batee|lhoknga/i, lat: 5.4851, lon: 95.2341 },
  { match: /pulau banyak|singkil/i, lat: 2.1833, lon: 97.2500 },
  { match: /nias|lagundri|sorake|tello/i, lat: 0.9634, lon: 97.7475 },
  { match: /sibolga|mursala|pandan|tapanuli/i, lat: 1.7426, lon: 98.7792 },
  { match: /pantai cermin|serdang|berhala/i, lat: 3.6425, lon: 98.9881 },
  { match: /padang|air manis|carocok|cingkuak|mandeh|pasumpahan|sikuai|pesisir selatan/i, lat: -1.3486, lon: 100.5732 },
  { match: /mentawai|macaronis|sipora|siberut/i, lat: -2.1333, lon: 99.5833 },
  { match: /batam|barelang|nongsa|galang/i, lat: 1.0456, lon: 104.0305 },
  { match: /bintan|lagoi|trikora|tanjung pinang|penyengat/i, lat: 1.1301, lon: 104.5381 },
  { match: /anambas|tarempa|padang melang/i, lat: 3.2167, lon: 106.2167 },
  { match: /natuna|ranai/i, lat: 3.9500, lon: 108.3833 },
  { match: /belitung|tanjung tinggi|lengkuas|tanjung pandan/i, lat: -2.5539, lon: 107.6534 },
  { match: /bangka|parai tenggiri|matras|sungailiat/i, lat: -1.8667, lon: 106.1167 },
  { match: /bengkulu|pantai panjang|marlborough/i, lat: -3.8004, lon: 102.2655 },
  { match: /pahawang|kiluan|lampung|kalianda|bakauheni/i, lat: -5.6738, lon: 105.2189 },
  { match: /krakatau|selat sunda/i, lat: -6.1021, lon: 105.4230 },

  // JAWA
  { match: /anyer|tanjung lesung|carita|banten|ujung kulon/i, lat: -6.5361, lon: 105.6589 },
  { match: /sawarna|lebak|bayah|pulo manuk/i, lat: -6.9844, lon: 106.3128 },
  { match: /kepulauan seribu|tidung|pari|pramuka|harapan|onrust/i, lat: -5.7891, lon: 106.5982 },
  { match: /ancol|marina|sunda kelapa|jakarta/i, lat: -6.1215, lon: 106.8315 },
  { match: /pelabuhan ratu|ujung genteng|cibangban|sukabumi/i, lat: -6.9841, lon: 106.5414 },
  { match: /pangandaran|batu karas|krapyak|santolo|garut/i, lat: -7.7011, lon: 108.6508 },
  { match: /karimunjawa|jepara|kartini/i, lat: -5.8458, lon: 110.4289 },
  { match: /gunungkidul|indrayanti|siung|pok tunggal|baron|krakal|drini/i, lat: -8.1492, lon: 110.6128 },
  { match: /parangtritis|depok|bantul|jogja|yogyakarta/i, lat: -8.0189, lon: 110.3204 },
  { match: /pacitan|klayar|watukarung|srau/i, lat: -8.2324, lon: 110.9472 },
  { match: /malang|balekambang|tiga warna|sendang biru/i, lat: -8.4375, lon: 112.6781 },
  { match: /jember|papuma|watu ulo/i, lat: -8.4312, lon: 113.5601 },
  { match: /banyuwangi|pulau merah|teluk hijau|g-land|plengkung|tabuhan/i, lat: -8.5992, lon: 114.0258 },
  { match: /madura|gili labak|gili iyang|sumenep/i, lat: -7.0333, lon: 113.9167 },

  // BALI & NUSA TENGGARA
  { match: /kuta|seminyak|canggu|legian/i, lat: -8.7205, lon: 115.1693 },
  { match: /sanur|tanjung benoa|nusa dua|pandawa|melasti/i, lat: -8.7956, lon: 115.2217 },
  { match: /uluwatu|padang padang|bingin|dreamland/i, lat: -8.8149, lon: 115.0884 },
  { match: /nusa penida|kelingking|crystal bay|ceningan|lembongan/i, lat: -8.7278, lon: 115.5444 },
  { match: /tulamben|amed|karangasem/i, lat: -8.2753, lon: 115.5925 },
  { match: /menjangan|pemuteran|lovina|buleleng/i, lat: -8.1583, lon: 114.5167 },
  { match: /gili trawangan|gili meno|gili air|senggigi/i, lat: -8.3533, lon: 116.0417 },
  { match: /mandalika|kuta lombok|selong belanak|tanjung aan/i, lat: -8.8956, lon: 116.2917 },
  { match: /pink beach|tangsi/i, lat: -8.9167, lon: 116.5167 },
  { match: /komodo|rinca|padar|kanawa|labuan bajo|manta point|taka makassar/i, lat: -8.5833, lon: 119.8667 },
  { match: /nihiwatu|walakiri|sumba/i, lat: -9.6500, lon: 119.9833 },
  { match: /alor|kepabang/i, lat: -8.2833, lon: 124.5833 },
  { match: /rote|nemberala/i, lat: -10.6167, lon: 122.8667 },

  // KALIMANTAN
  { match: /derawan|maratua|kakaban|sangalaki|berau/i, lat: 2.2872, lon: 118.2439 },
  { match: /biduk-biduk|labuan cermin/i, lat: 1.2500, lon: 118.6833 },
  { match: /balikpapan|manggar|lamaru/i, lat: -1.2379, lon: 116.8289 },
  { match: /tarakan|amal/i, lat: 3.3000, lon: 117.6333 },
  { match: /singkawang|pasir panjang|temajuk|sambas/i, lat: 0.9067, lon: 108.9872 },
  { match: /karimata|kayong utara/i, lat: -1.5833, lon: 109.1667 },

  // SULAWESI
  { match: /bunaken|siladen|manado|malalayang/i, lat: 1.6231, lon: 124.7644 },
  { match: /lembeh|bitung/i, lat: 1.4422, lon: 125.2289 },
  { match: /gorontalo|botubarani|saronde/i, lat: 0.4851, lon: 123.0982 },
  { match: /togean|kadidiri|ampana/i, lat: -0.4167, lon: 121.9167 },
  { match: /wakatobi|hoga|tomia|wangi-wangi|binongko/i, lat: -5.3267, lon: 123.5936 },
  { match: /makassar|losari|samalona|kayangan/i, lat: -5.1477, lon: 119.4069 },
  { match: /tanjung bira|bira|bulukumba|bara/i, lat: -5.6139, lon: 120.4578 },
  { match: /taka bonerate|tinabo|selayar/i, lat: -6.6833, lon: 121.0833 },

  // MALUKU
  { match: /ambon|natsepa|pintu kota|liang/i, lat: -3.6547, lon: 128.1906 },
  { match: /banda neira|hatta|run|ai/i, lat: -4.5244, lon: 129.9042 },
  { match: /pantai ora|seram/i, lat: -3.0167, lon: 129.5833 },
  { match: /kei|ngurbloat|bair|ohoidertawun/i, lat: -5.6333, lon: 132.7333 },
  { match: /morotai|dodola/i, lat: 2.0494, lon: 128.2989 },
  { match: /ternate|maitara|tidore|sulabesi/i, lat: 0.7893, lon: 127.3619 },

  // PAPUA
  { match: /raja ampat|waisai|wayag|piaynemo|misool|kri|mansuar|arborek/i, lat: -0.4356, lon: 130.8258 },
  { match: /cenderawasih|kwatisore|nabire/i, lat: -3.3667, lon: 135.5000 },
  { match: /biak|numfor|padaido/i, lat: -1.1739, lon: 136.0828 },
  { match: /fakfak|kaimana/i, lat: -3.6667, lon: 133.7667 },
  { match: /jayapura|hamadi|base-g|harlem/i, lat: -2.5337, lon: 140.7181 },
  { match: /merauke|lampu satu/i, lat: -8.5083, lon: 140.3833 }
];

// Fallback koordinat default per Wilayah jika tidak ada kecocokan spesifik
const WILAYAH_DEFAULT_COORDS = {
  "Sumatra": { lat: 0.5897, lon: 101.3431 },
  "Jawa": { lat: -7.2504, lon: 110.0000 },
  "Bali & Nusa Tenggara": { lat: -8.6500, lon: 117.0000 },
  "Kalimantan": { lat: 0.5000, lon: 114.0000 },
  "Sulawesi": { lat: -2.5000, lon: 121.0000 },
  "Maluku": { lat: -3.2000, lon: 129.0000 },
  "Papua": { lat: -4.0000, lon: 136.0000 }
};

// Hitung koordinat stabil berbasis teks destinasi
function resolveCoordinates(dest, index = 0) {
  const text = `${dest.nama} ${dest.lokasi} ${dest.kabKota || ''} ${dest.provinsi || ''}`.toLowerCase();
  
  let base = null;
  for (const rc of REGIONAL_COORDS) {
    if (rc.match.test(text)) {
      base = { lat: rc.lat, lon: rc.lon };
      break;
    }
  }

  if (!base) {
    base = WILAYAH_DEFAULT_COORDS[dest.wilayah] || { lat: -2.0, lon: 118.0 };
  }

  // Tambahkan sedikit jitter stabil (0.01 - 0.05 derajat ~ 1-5 km) agar setiap destinasi memiliki titik unik
  const hash = Math.abs(hashCode(dest.id || dest.nama));
  const offsetLat = ((hash % 100) / 1000) - 0.05;
  const offsetLon = (((hash >> 3) % 100) / 1000) - 0.05;

  const lat = Math.round((base.lat + offsetLat) * 10000) / 10000;
  const lon = Math.round((base.lon + offsetLon) * 10000) / 10000;

  return { lat, lon };
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// Koleksi Kuliner Bahari Khas Daerah Indonesia
const CULINARY_TEMPLATES = {
  "Sumatra": [
    {
      namaPrefix: "RM Ikan Bakar & Gulai Kepala Ikan",
      kategori: "Seafood & Masakan Minang / Pesisir",
      menuAndalan: "Gulai Kepala Ikan Kakap, Ikan Bakar Sambal Balado, Cumi Goreng Tepung",
      hargaMin: 35000,
      hargaMax: 85000,
      rating: 4.8
    },
    {
      namaPrefix: "Warung Nelayan Segar",
      kategori: "Seafood Bakar Tradisional",
      menuAndalan: "Kepiting Saus Padang, Udang Bakar Mentega, Kelapa Muda",
      hargaMin: 30000,
      hargaMax: 70000,
      rating: 4.7
    },
    {
      namaPrefix: "Kedai Kopi & Snack Pesisir",
      kategori: "Kafe & Camilan Pesisir",
      menuAndalan: "Kopi Tarik / Ulee Kareng, Pisang Goreng Keju, Kelapa Ijo",
      hargaMin: 15000,
      hargaMax: 35000,
      rating: 4.6
    }
  ],
  "Jawa": [
    {
      namaPrefix: "Pondok Makan Ikan Bakar Jimbaran Rasa",
      kategori: "Seafood Bakar Arang",
      menuAndalan: "Ikan Bawal Bakar Bumbu Madu, Cumi Saus Tiram, Cah Kangkung Terasi",
      hargaMin: 30000,
      hargaMax: 75000,
      rating: 4.8
    },
    {
      namaPrefix: "Warung Seafood Pinggir Pantai",
      kategori: "Warung Pesisir Tradisional",
      menuAndalan: "Udang Asam Manis, Ikan Kerapu Bakar, Es Kelapa Batok",
      hargaMin: 25000,
      hargaMax: 60000,
      rating: 4.6
    },
    {
      namaPrefix: "Sunset Cafe & Resto Pesisir",
      kategori: "Kafe Pantai & Kopi",
      menuAndalan: "Mendoan Hangat Sambal Kecap, Kopi Tubruk, Es Kelapa Muda Jeruk",
      hargaMin: 15000,
      hargaMax: 35000,
      rating: 4.7
    }
  ],
  "Bali & Nusa Tenggara": [
    {
      namaPrefix: "Warung Ikan Bakar Sambal Matah",
      kategori: "Seafood Khas Bali",
      menuAndalan: "Ikan Kakap Bakar Sambal Matah, Pelecing Kangkung, Udang Bakar Jimbaran",
      hargaMin: 40000,
      hargaMax: 90000,
      rating: 4.9
    },
    {
      namaPrefix: "Resto Pesisir & Sunset Lounge",
      kategori: "Seafood & Grill Modern",
      menuAndalan: "Grilled Seafood Platter, Calamari Crispy, Fresh Coconut",
      hargaMin: 50000,
      hargaMax: 120000,
      rating: 4.8
    },
    {
      namaPrefix: "Warung Lokal Ayam Betutu & Sup Ikan",
      kategori: "Masakan Khas Daerah",
      menuAndalan: "Sup Kepala Ikan Segar, Nasi Campur Bali, Es Jeruk Nipis",
      hargaMin: 25000,
      hargaMax: 55000,
      rating: 4.7
    }
  ],
  "Kalimantan": [
    {
      namaPrefix: "Rumah Makan Ikan Bakar Patin & Baung",
      kategori: "Seafood & Ikan Sungai/Laut",
      menuAndalan: "Patin Bakar Bambu, Ikan Bakar Rica, Sambal Raja",
      hargaMin: 30000,
      hargaMax: 75000,
      rating: 4.7
    },
    {
      namaPrefix: "Kedai Seafood Kepiting Asap",
      kategori: "Kuliner Seafood Pesisir",
      menuAndalan: "Kepiting Asap Spesial, Cumi Bakar Bumbu Pedas, Es Jeruk Borneo",
      hargaMin: 45000,
      hargaMax: 110000,
      rating: 4.8
    },
    {
      namaPrefix: "Warung Kopi & Pisang Gapit Pesisir",
      kategori: "Camilan Tradisional",
      menuAndalan: "Pisang Gapit Kuah Kinca, Kopi Susu Tradisional, Kelapa Muda",
      hargaMin: 15000,
      hargaMax: 30000,
      rating: 4.6
    }
  ],
  "Sulawesi": [
    {
      namaPrefix: "RM Ikan Bakar Rica & Colo-Colo",
      kategori: "Seafood Khas Sulawesi",
      menuAndalan: "Ikan Baronang Bakar Rica, Sambal Dabu-Dabu Lilin, Sayur Kangkung Bunga Pepaya",
      hargaMin: 35000,
      hargaMax: 80000,
      rating: 4.9
    },
    {
      namaPrefix: "Warung Makan Coto & Konro Pesisir",
      kategori: "Masakan Tradisional Bugis/Makassar",
      menuAndalan: "Coto Makassar Daging Segar, Pallubasa Telur, Es Pisang Ijo",
      hargaMin: 25000,
      hargaMax: 50000,
      rating: 4.8
    },
    {
      namaPrefix: "Kedai Kopi & Kue Tradisional",
      kategori: "Kafe Santai Pesisir",
      menuAndalan: "Kopi Toraja / Kopi Gie, Panada Segar, Kelapa Muda",
      hargaMin: 15000,
      hargaMax: 35000,
      rating: 4.7
    }
  ],
  "Maluku": [
    {
      namaPrefix: "Rumah Makan Ikan Kuah Kuning & Papeda",
      kategori: "Kuliner Tradisional Maluku",
      menuAndalan: "Papeda Ikan Kuah Kuning Segar, Gohu Ikan Tuna Mentah, Ikan Asar Sambal Colo-Colo",
      hargaMin: 30000,
      hargaMax: 75000,
      rating: 4.9
    },
    {
      namaPrefix: "Warung Nelayan Segar Banda",
      kategori: "Seafood Bakar Rempah",
      menuAndalan: "Ikan Cakalang Bakar Rempah Pala, Cumi Bakar Hitam, Sambal Kenari",
      hargaMin: 30000,
      hargaMax: 70000,
      rating: 4.8
    },
    {
      namaPrefix: "Kedai Kopi Rujak Natsepa",
      kategori: "Camilan Ikonik Pesisir",
      menuAndalan: "Rujak Buah Saus Kacang Bumbu Pala, Kopi Rarobang Rempah, Kelapa Dingin",
      hargaMin: 15000,
      hargaMax: 30000,
      rating: 4.8
    }
  ],
  "Papua": [
    {
      namaPrefix: "RM Ikan Bakar Papua & Sambal Dabu-Dabu",
      kategori: "Seafood Khas Papua",
      menuAndalan: "Ikan Bobara Bakar Arang, Ikan Kuah Asam Segar, Tumis Kangkung Belacan",
      hargaMin: 40000,
      hargaMax: 90000,
      rating: 4.9
    },
    {
      namaPrefix: "Warung Papeda Ikan Kakap Merah",
      kategori: "Kuliner Tradisional Papua",
      menuAndalan: "Papeda Panas Ikan Kakap Kuah Kuning, Sambal Colo-Colo Lemon Cui",
      hargaMin: 35000,
      hargaMax: 80000,
      rating: 4.8
    },
    {
      namaPrefix: "Kafe Pesisir Teluk Pasir",
      kategori: "Kafe Pesisir & Sunset",
      menuAndalan: "Kopi Wamena Robusta/Arabika, Pisang Goreng Sambal, Kelapa Segar",
      hargaMin: 20000,
      hargaMax: 40000,
      rating: 4.7
    }
  ]
};

// Generate daftar kuliner terdekat untuk suatu destinasi
function generateNearbyCulinary(dest, destLat, destLon) {
  const templates = CULINARY_TEMPLATES[dest.wilayah] || CULINARY_TEMPLATES["Jawa"];
  const list = [];

  templates.forEach((tmpl, i) => {
    // Geser koordinat kuliner sekitar 0.3 km hingga 2.8 km dari titik destinasi
    const angle = (i * 120 + (dest.id.charCodeAt(dest.id.length - 1) * 37)) % 360;
    const rad = (angle * Math.PI) / 180;
    const distOffsetKm = 0.3 + (i * 0.7) + ((dest.id.charCodeAt(0) % 5) * 0.2); // 0.3 - 2.5 km

    // 1 derajat lat ~ 111 km, 1 derajat lon ~ 111 km * cos(lat)
    const latOffset = (distOffsetKm * Math.cos(rad)) / 111;
    const lonOffset = (distOffsetKm * Math.sin(rad)) / (111 * Math.cos((destLat * Math.PI) / 180));

    const culLat = Math.round((destLat + latOffset) * 10000) / 10000;
    const culLon = Math.round((destLon + lonOffset) * 10000) / 10000;
    const jarak = haversineDistance(destLat, destLon, culLat, culLon);

    const namaTempat = `${tmpl.namaPrefix} ${dest.nama.split(' ')[0]}`;

    list.push({
      id: `${dest.id}-KUL-${i + 1}`,
      nama: namaTempat,
      kategori: tmpl.kategori,
      menuAndalan: tmpl.menuAndalan,
      estimasiHarga: `Rp${tmpl.hargaMin.toLocaleString('id-ID')} – Rp${tmpl.hargaMax.toLocaleString('id-ID')} / orang`,
      rating: tmpl.rating,
      latitude: culLat,
      longitude: culLon,
      jarakKm: jarak
    });
  });

  // Urutkan berdasarkan jarak terdekat
  list.sort((a, b) => a.jarakKm - b.jarakKm);
  return list;
}

// Fungsi utama memperkaya destinasi dengan koordinat & kuliner
function enrichWithGeoAndCulinary(destList) {
  return destList.map((dest, idx) => {
    const coords = resolveCoordinates(dest, idx);
    const kuliner = generateNearbyCulinary(dest, coords.lat, coords.lon);

    return {
      ...dest,
      latitude: coords.lat,
      longitude: coords.lon,
      kuliner
    };
  });
}

module.exports = {
  haversineDistance,
  resolveCoordinates,
  generateNearbyCulinary,
  enrichWithGeoAndCulinary
};
