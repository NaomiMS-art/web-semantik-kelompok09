const STOP_WORDS = new Set([
  'untuk', 'dengan', 'dan', 'di', 'yang', 'ke', 'dari', 'tersedia', 'wisata', 'tempat',
  'cari', 'saya', 'mau', 'ada', 'atau', 'dgn', 'buat', 'yg', 'lokasi', 'destinasi',
  'rekomendasi', 'tolong', 'carikan', 'butuh', 'ingin', 'dong', 'apakah', 'spot',
  'menyediakan', 'harga', 'budget', 'bujet', 'maksimal', 'maks', 'minimal', 'min',
  'apa', 'saja', 'aja', 'laut', 'pantai', 'air', 'bahari', 'pesisir', 'pulau'
]);

// Normalisasi leetspeak & angka yang mewakili huruf (misal: 3->e, 4/@->a, 1/!->i, 0->o, 5/$->s, 8->b, 7->t)
function normalizeTypoLeetspeak(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/3/g, 'e')
    .replace(/4|@/g, 'a')
    .replace(/1|!|\|/g, 'i')
    .replace(/0/g, 'o')
    .replace(/5|\$/g, 's')
    .replace(/8/g, 'b')
    .replace(/7/g, 't');
}

// Levenshtein distance sederhana untuk typo tolerance kata tunggal
function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Cek apakah keyword cocok dengan text haystack (dengan leetspeak + typo tolerance)
function matchKeywordFuzzy(kw, haystack) {
  if (!kw || !haystack) return false;
  const kwRaw = kw.toLowerCase().trim();
  const kwNorm = normalizeTypoLeetspeak(kwRaw);
  const hayRaw = haystack.toLowerCase();
  const hayNorm = normalizeTypoLeetspeak(hayRaw);

  // 1. Direct substring match (raw or leetspeak normalized)
  if (hayRaw.includes(kwRaw) || hayRaw.includes(kwNorm) || hayNorm.includes(kwNorm)) {
    return true;
  }

  // 2. Token-level fuzzy match
  const hayWords = hayNorm.split(/[^a-z0-9]+/).filter(w => w.length >= 2);
  for (const hw of hayWords) {
    if (hw === kwNorm || hw.startsWith(kwNorm) || hw.includes(kwNorm)) {
      return true;
    }
    // Typo tolerance Levenshtein jika panjang kata >= 4
    if (kwNorm.length >= 4 && hw.length >= 4) {
      const maxDist = kwNorm.length > 5 ? 2 : 1;
      if (levenshtein(hw, kwNorm) <= maxDist) {
        return true;
      }
    }
  }

  return false;
}

class SemanticSearch {
  constructor(destinasiList) {
    this.destinasiList = destinasiList;
  }

  // Parse natural language query menjadi parameter semantik
  parseNaturalQuery(queryStr) {
    const defaultParsed = {
      raw: queryStr || '',
      aktivitas: [],
      tingkatKeahlian: null,
      maxBudget: null,
      rangeHarga: null,
      peralatan: [],
      wajibSewa: false,
      fasilitas: [],
      wilayah: null,
      provinsi: null,
      keywords: []
    };

    if (!queryStr || !queryStr.trim()) return defaultParsed;

    let q = " " + queryStr.toLowerCase() + " ";
    const parsed = { ...defaultParsed };

    // 1. Ekstraksi Budget & Range Harga
    const budgetRegex = /(?:budget|bujet|biaya|maksimal|maks|≤|<=|di ?bawah|kurang dari|under|harga|rp\.?)\s*(\d[\d.,]*)\s*(rb|ribu|k|jt|juta)?|(\d[\d.,]*)\s*(rb|ribu|jt|juta)\b/i;
    const bMatch = q.match(budgetRegex);
    if (bMatch) {
      const numPart = bMatch[1] || bMatch[3];
      const unitPart = bMatch[2] || bMatch[4];
      if (unitPart) {
        parsed.maxBudget = /jt|juta/i.test(unitPart)
          ? parseFloat(numPart.replace(',', '.')) * 1000000
          : parseFloat(numPart.replace(',', '.')) * 1000;
      } else {
        parsed.maxBudget = parseInt(numPart.replace(/[.,]/g, ''), 10);
      }
      q = q.replace(bMatch[0], ' ');
    }

    if (/gratis|tanpa biaya/i.test(q)) {
      parsed.maxBudget = 0;
      parsed.rangeHarga = 'di-bawah-100k';
      q = q.replace(/gratis|tanpa biaya/ig, ' ');
    } else if (parsed.maxBudget !== null) {
      if (parsed.maxBudget < 100000) parsed.rangeHarga = 'di-bawah-100k';
      else if (parsed.maxBudget <= 250000) parsed.rangeHarga = '100k-250k';
      else if (parsed.maxBudget <= 500000) parsed.rangeHarga = '250k-500k';
      else if (parsed.maxBudget <= 1000000) parsed.rangeHarga = '500k-1jt';
      else parsed.rangeHarga = 'di-atas-1jt';
    }

    // Normalisasikan leetspeak pada teks query yang tersisa (misal: b3l -> bel, sn0rkeling -> snorkeling, p4nt4i -> pantai)
    q = normalizeTypoLeetspeak(q);

    // 2. Ekstraksi Tingkat Keahlian
    if (/di ?atas pemula|bukan pemula|setelah pemula/i.test(q)) {
      parsed.tingkatKeahlian = 'Menengah';
      q = q.replace(/di ?atas pemula|bukan pemula|setelah pemula/ig, ' ');
    } else if (/mahir|expert|advanced|profesional|ahli|tingkat ahli|level ahli/i.test(q)) {
      parsed.tingkatKeahlian = 'Mahir';
      q = q.replace(/mahir|expert|advanced|profesional|ahli|tingkat ahli|level ahli/ig, ' ');
    } else if (/menengah|intermediate/i.test(q)) {
      parsed.tingkatKeahlian = 'Menengah';
      q = q.replace(/menengah|intermediate/ig, ' ');
    } else if (/pemula|beginner|baru belajar/i.test(q)) {
      parsed.tingkatKeahlian = 'Pemula';
      q = q.replace(/pemula|beginner|baru belajar/ig, ' ');
    }

    // 3. Deteksi Permintaan Sewa / Ketersediaan Alat
    if (/sewa|penyewaan|menyediakan alat|ada alat|rental/i.test(q)) {
      parsed.wajibSewa = true;
      q = q.replace(/sewa|penyewaan|menyediakan alat|ada alat|rental/ig, ' ');
    }

    // 4. Deteksi Aktivitas Bahari (diproses sebelum peralatan agar snorkel/diving terdeteksi aktivitasnya)
    const actDict = [
      { name: 'Snorkeling', terms: ['snorkeling', 'snorkel', 'snorkling'] },
      { name: 'Diving', terms: ['diving', 'selam', 'menyelam', 'scuba', 'freedive', 'freediving'] },
      { name: 'Surfing', terms: ['surfing', 'selancar', 'berselancar', 'surf'] },
      { name: 'Berenang', terms: ['berenang & berjemur', 'berenang dan berjemur', 'berenang', 'berjemur', 'renang', 'mandi laut'] },
      { name: 'Island Hopping', terms: ['island hopping', 'jelajah pulau', 'keliling pulau', 'antar pulau'] },
      { name: 'Kano & Kayak', terms: ['kano & kayak', 'kano dan kayak', 'kayak', 'kano', 'mendayung'] },
      { name: 'Wahana Air', terms: ['wahana air', 'water sports', 'watersport', 'banana boat', 'jet ski', 'jetski', 'parasailing', 'wahana'] },
      { name: 'Satwa Laut', terms: ['satwa laut', 'satwa', 'penyu', 'lumba-lumba', 'lumba', 'dolphin', 'manta', 'hiu paus', 'hiu'] },
      { name: 'Trekking & Panjat', terms: ['trekking & panjat', 'trekking dan panjat', 'panjat tebing', 'trekking', 'hiking', 'panjat'] },
      { name: 'Sejarah & Budaya Bahari', terms: ['sejarah & budaya bahari', 'sejarah dan budaya bahari', 'sejarah bahari', 'budaya bahari', 'sejarah', 'benteng', 'budaya', 'museum', 'tugu', 'pura', 'kapal karam'] },
      { name: 'Kuliner Laut', terms: ['kuliner laut', 'makanan laut', 'kuliner', 'seafood', 'ikan bakar', 'kepiting', 'cumi', 'udang'] },
      { name: 'Fotografi & Sunset', terms: ['fotografi & sunset', 'fotografi dan sunset', 'fotografi', 'sunset', 'sunrise', 'senja', 'foto'] },
      { name: 'Camping Pantai', terms: ['camping pantai', 'berkemah pantai', 'camping', 'kemah', 'tenda', 'berkemah'] },
      { name: 'Memancing', terms: ['memancing', 'mancing', 'fishing'] }
    ];

    actDict.forEach(act => {
      const match = act.terms.some(t => {
        const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp('(^|[^a-zA-Z0-9])' + escaped + '([^a-zA-Z0-9]|$)', 'i');
        return re.test(q);
      });
      if (match && !parsed.aktivitas.includes(act.name)) {
        parsed.aktivitas.push(act.name);
      }
    });

    // 5. Ekstraksi Peralatan Spesifik
    const eqDict = [
      { id: 'masker-snorkel', terms: ['alat snorkeling', 'masker', 'snorkel', 'kacamata renang'] },
      { id: 'fins-snorkeling', terms: ['fins', 'kaki katak', 'fin'] },
      { id: 'life-jacket', terms: ['life jacket', 'pelampung', 'rompi pelampung'] },
      { id: 'bcd-regulator', terms: ['bcd', 'regulator', 'alat diving', 'alat selam'] },
      { id: 'tabung-scuba', terms: ['tabung', 'scuba', 'tabung oksigen'] },
      { id: 'wetsuit-diving', terms: ['wetsuit', 'baju selam', 'pakaian selam'] },
      { id: 'papan-selancar', terms: ['papan selancar', 'surfboard', 'papan surfing', 'papan'] },
      { id: 'kano-kayak', terms: ['kayak', 'kano', 'dayung'] },
      { id: 'sewa-perahu', terms: ['sewa perahu', 'sewa kapal', 'sewa boat', 'perahu jukung', 'jukung', 'perahu', 'kapal'] }
    ];

    eqDict.forEach(eq => {
      const match = eq.terms.some(t => {
        const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp('(^|[^a-zA-Z0-9])' + escaped + '([^a-zA-Z0-9]|$)', 'i');
        return re.test(q);
      });
      if (match && !parsed.peralatan.includes(eq.id)) {
        parsed.peralatan.push(eq.id);
      }
    });

    // Bersihkan terms aktivitas & peralatan yang sudah terdeteksi dari string sisa keywords
      // Diurutkan dari yang terpanjang ke terpendek agar frasa majemuk terhapus bersih
      const allActTerms = actDict.flatMap(a => a.terms).sort((a, b) => b.length - a.length);
      allActTerms.forEach(t => {
        const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        q = q.replace(new RegExp('(^|[^a-zA-Z0-9])' + escaped + '(?=[^a-zA-Z0-9]|$)', 'ig'), ' ');
      });

        const allEqTerms = eqDict.flatMap(eq => eq.terms).sort((a, b) => b.length - a.length);
        allEqTerms.forEach(t => {
          const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          q = q.replace(new RegExp('(^|[^a-zA-Z0-9])' + escaped + '(?=[^a-zA-Z0-9]|$)', 'ig'), ' ');
        });

        // 6. Ekstraksi Fasilitas
        const facDict = [
          { name: 'Dive center', terms: ['dive center', 'dive shop', 'operator selam'] },
          { name: 'Homestay', terms: ['homestay', 'penginapan', 'resort', 'hotel'] },
          { name: 'Dermaga', terms: ['dermaga', 'pelabuhan'] },
          { name: 'Warung', terms: ['warung', 'restoran', 'kafe'] }
        ];

        facDict.forEach(fac => {
          const match = fac.terms.some(t => q.includes(t));
          if (match) {
            parsed.fasilitas.push(fac.name);
            fac.terms.forEach(t => {
              q = q.replace(new RegExp(t, 'ig'), ' ');
            });
          }
        });

        // 7. Ekstraksi Wilayah
        const wilList = ['sumatra', 'jawa', 'kalimantan', 'bali', 'nusa tenggara', 'ntb', 'ntt', 'sulawesi', 'maluku', 'papua'];
        wilList.forEach(w => {
          if (q.includes(w)) {
            parsed.wilayah = w.toUpperCase();
            q = q.replace(new RegExp(w, 'ig'), ' ');
          }
        });

        // Sisa kata kunci bebas (dengan normalisasi leetspeak & typo tolerance)
        parsed.keywords = q.split(/[^a-zA-Z0-9]+/)
          .map(k => k.trim())
          .filter(k => k.length >= 2 && !STOP_WORDS.has(k) && !STOP_WORDS.has(normalizeTypoLeetspeak(k)));

        return parsed;
      }

  // Generate representasi SPARQL otomatis dari parameter semantik
  generateSparqlQuery(parsed, filters = {}) {
        let whereClauses =[
          "?dest a maritim:DestinasiWisata .",
          "?dest maritim:namaDestinasi ?nama .",
          "?dest maritim:beradaDiProvinsi ?provUri .",
          "?provUri rdfs:label ?provinsi .",
          "?dest maritim:cocokUntukTingkat ?tingkatUri .",
          "?tingkatUri rdfs:label ?level .",
          "?dest maritim:hargaTiketMasuk ?hargaTiket .",
          "?dest maritim:estimasiTotalBiaya ?totalBiaya ."
        ];

        let filterClauses =[];

        const activeAktivitas = filters.aktivitas || (parsed.aktivitas && parsed.aktivitas[0]);
        if(activeAktivitas) {
          whereClauses.push(`?dest maritim:memilikiAktivitas data:aktivitas_${activeAktivitas.replace(/\s+/g, '_')} .`);
        }

    const activeLevel = filters.level || parsed.tingkatKeahlian;
        if(activeLevel) {
          whereClauses.push(`?dest maritim:cocokUntukTingkat data:Tingkat_${activeLevel} .`);
        }

    const activeBudget = filters.maxBudget !== undefined ? filters.maxBudget : parsed.maxBudget;
        if(activeBudget !== null && activeBudget !== undefined) {
        filterClauses.push(`?totalBiaya <= ${activeBudget}`);
      }

      const activeRange = filters.rangeHarga || parsed.rangeHarga;
      if (activeRange) {
        const rangeMap = {
          'di-bawah-100k': 'data:Range_Under100k',
          '100k-250k': 'data:Range_100k_250k',
          '250k-500k': 'data:Range_250k_500k',
          '500k-1jt': 'data:Range_500k_1M',
          'di-atas-1jt': 'data:Range_Above1M'
        };
        if (rangeMap[activeRange]) {
          whereClauses.push(`?dest maritim:kategoriHargaTotal ${rangeMap[activeRange]} .`);
        }
      }

      const activeAlat = filters.alat || (parsed.peralatan && parsed.peralatan[0]);
      if (activeAlat) {
        whereClauses.push(`?dest maritim:memilikiPenawaranAlat ?penawaran .`);
        whereClauses.push(`?penawaran maritim:alatTerkait data:alat_${activeAlat} .`);
        if (filters.statusSewa || parsed.wajibSewa) {
          whereClauses.push(`?penawaran maritim:statusSewa "Tersedia Disewa" .`);
        }
      }

      let sparql = `PREFIX maritim: <http://wisatamaritim.id/ontology#>\nPREFIX data: <http://wisatamaritim.id/resource/>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\nSELECT DISTINCT ?dest ?nama ?provinsi ?level ?hargaTiket ?totalBiaya\nWHERE {\n  ${whereClauses.join('\n  ')}`;
      if (filterClauses.length) {
        sparql += `\n  FILTER(${filterClauses.join(' && ')})`;
      }
      sparql += `\n}\nORDER BY ASC(?totalBiaya)\nLIMIT 25`;

      return sparql;
    }

  // Buat Rantai Penalaran Semantik (Semantic Reasoning Chain) untuk UI
  buildReasoningSteps(parsed, filters = {}) {
      const steps = [];

      // Step 1: Aktivitas
      const acts = filters.aktivitas ? [filters.aktivitas] : (parsed.aktivitas || []);
      if(acts && acts.length) {
      steps.push({
        type: 'aktivitas',
        icon: '🤿',
        title: 'Aktivitas Bahari',
        value: acts.join(', '),
        relation: 'maritim:memilikiAktivitas'
      });
    }

    // Step 2: Tingkat Keahlian
    const lvl = filters.level || parsed.tingkatKeahlian;
    if (lvl) {
      steps.push({
        type: 'keahlian',
        icon: '🎯',
        title: 'Tingkat Keahlian',
        value: lvl,
        relation: 'maritim:cocokUntukTingkat'
      });
    }

    // Step 3: Range Harga / Budget
    const bud = filters.maxBudget !== undefined ? filters.maxBudget : parsed.maxBudget;
    const rng = filters.rangeHarga || parsed.rangeHarga;
    if (bud !== null || rng) {
      let valStr = '';
      if (bud !== null) valStr = `Budget ≤ Rp${bud.toLocaleString('id-ID')}`;
      if (rng) {
        const labels = {
          'di-bawah-100k': '< Rp100.000',
          '100k-250k': 'Rp100.000–Rp250.000',
          '250k-500k': 'Rp250.000–Rp500.000',
          '500k-1jt': 'Rp500.000–Rp1.000.000',
          'di-atas-1jt': '> Rp1.000.000'
        };
        valStr += (valStr ? ` (${labels[rng]})` : labels[rng]);
      }
      steps.push({
        type: 'harga',
        icon: '💰',
        title: 'Range Harga / Budget',
        value: valStr,
        relation: 'maritim:kategoriHargaTotal / maritim:estimasiTotalBiaya'
      });
    }

    // Step 4: Peralatan & Ketersediaan
    const eqList = filters.alat ? [filters.alat] : (parsed.peralatan || []);
    if (eqList && eqList.length) {
      steps.push({
        type: 'peralatan',
        icon: '⚙️',
        title: 'Peralatan & Persewaan',
        value: eqList.join(', ') + (parsed.wajibSewa || filters.statusSewa ? ' (Tersedia Disewa)' : ''),
        relation: 'maritim:memilikiPenawaranAlat ➔ maritim:alatTerkait'
      });
    }

    // Step 5: Fasilitas
    const facs = filters.fasilitas ? [filters.fasilitas] : (parsed.fasilitas || []);
    if (facs && facs.length) {
      steps.push({
        type: 'fasilitas',
        icon: '🏨',
        title: 'Fasilitas Pendukung',
        value: facs.join(', '),
        relation: 'maritim:memilikiFasilitas'
      });
    }

    // Step 6: Lokasi / Wilayah
    const loc = filters.wilayah || filters.provinsi || parsed.wilayah || parsed.provinsi;
    if (loc) {
      steps.push({
        type: 'lokasi',
        icon: '📍',
        title: 'Lokasi Geografis',
        value: loc,
        relation: 'maritim:beradaDiWilayah / maritim:beradaDiProvinsi'
      });
    }

    return steps;
  }

  // Pencarian Terpadu (Semantic Search + Faceted Filter)
  search(params = {}) {
    const query = params.q || '';
    const parsed = this.parseNaturalQuery(query);

    // Ambil parameter filter eksplisit (dari faceted filter bar)
    const filters = {
      jenis: params.jenis || params.kat,
      aktivitas: params.akt || params.aktivitas,
      level: params.lv || params.level,
      rangeHarga: params.rangeHarga || params.range,
      priceType: params.priceType || 'total', // 'total' | 'tiket' | 'aktivitas'
      maxBudget: params.maxBudget ? parseInt(params.maxBudget, 10) : parsed.maxBudget,
      alat: params.alat,
      statusSewa: params.statusSewa === 'true' || params.statusSewa === true || parsed.wajibSewa,
      fasilitas: params.fasilitas,
      provinsi: params.prov || params.provinsi,
      wilayah: params.wil || params.wilayah,
      favOnly: params.favOnly === 'true' || params.favOnly === true,
      favIds: Array.isArray(params.favIds) ? params.favIds : (params.favIds ? params.favIds.split(',') : [])
    };

    // Filter seluruh destinasi
    let matches = this.destinasiList.filter(d => {
      // 1. Jenis Wisata
      if (filters.jenis && filters.jenis !== '') {
        const jLower = (d.jenisWisata || '').toLowerCase();
        const fLower = filters.jenis.toLowerCase();
        if (!jLower.includes(fLower) && !d.nama.toLowerCase().includes(fLower)) return false;
      }

      // 2. Aktivitas Bahari (dari faceted atau natural language)
      const targetActs = filters.aktivitas ? [filters.aktivitas] : (parsed.aktivitas || []);
      if (targetActs && targetActs.length > 0) {
        const hasAct = targetActs.some(a =>
          d.aktivitas.some(da => da.toLowerCase().includes(a.toLowerCase())) ||
          (d.aktivitasStr || '').toLowerCase().includes(a.toLowerCase())
        );
        if (!hasAct) return false;
      }

      // 3. Tingkat Keahlian
      const targetLevel = filters.level || parsed.tingkatKeahlian;
      if (targetLevel && targetLevel !== 'Semua level' && targetLevel !== 'Semua') {
        if (d.level !== 'Semua level' && d.level.toLowerCase() !== targetLevel.toLowerCase()) {
          return false;
        }
      }

      // 4. Range Harga (Google-style multi-bucket)
      const targetRange = filters.rangeHarga || parsed.rangeHarga;
      if (targetRange && targetRange !== 'semua' && targetRange !== '') {
        if (filters.priceType === 'tiket') {
          if (d.rangeHargaTiket !== targetRange) return false;
        } else if (filters.priceType === 'aktivitas') {
          if (d.rangeHargaAktivitas !== targetRange) return false;
        } else {
          // Default estimasi total
          if (d.rangeHargaTotal !== targetRange) return false;
        }
      }

      // 5. Budget Maksimum Numerik
      if (filters.maxBudget !== null && filters.maxBudget !== undefined) {
        if (filters.priceType === 'tiket') {
          if (d.hargaTiketMasuk > filters.maxBudget) return false;
        } else {
          if (d.estimasiTotalPerOrang > filters.maxBudget) return false;
        }
      }

      // 6. Peralatan
      const targetAlat = filters.alat || (parsed.peralatan && parsed.peralatan[0]);
      if (targetAlat) {
        const hasEq = d.peralatan.some(eq =>
          eq.id === targetAlat ||
          eq.nama.toLowerCase().includes(targetAlat.toLowerCase()) ||
          eq.kategoriAktivitas.toLowerCase().includes(targetAlat.toLowerCase())
        );
        if (!hasEq) return false;
      }

      // 7. Status Sewa Alat
      if (filters.statusSewa) {
        const canRent = d.peralatan.some(eq => eq.dapatDisewa);
        if (!canRent) return false;
      }

      // 8. Fasilitas
      const targetFac = filters.fasilitas || (parsed.fasilitas && parsed.fasilitas[0]);
      if (targetFac) {
        const hasFac = d.fasilitas.some(f => f.toLowerCase().includes(targetFac.toLowerCase())) ||
          (d.fasilitasStr || '').toLowerCase().includes(targetFac.toLowerCase());
        if (!hasFac) return false;
      }

      // 9. Provinsi & Wilayah
      const targetProv = filters.provinsi || parsed.provinsi;
      if (targetProv && targetProv !== '') {
        const provParts = targetProv.split(',').map(s => s.trim().toLowerCase());
        const match = provParts.some(p => d.provinsi.toLowerCase() === p || d.provinsi.toLowerCase().includes(p));
        if (!match) return false;
      }

      const targetWil = filters.wilayah || parsed.wilayah;
      if (targetWil && targetWil !== '') {
        if (!d.wilayah.toLowerCase().includes(targetWil.toLowerCase())) return false;
      }

      // 10. Favorit only
      if (filters.favOnly && filters.favIds && filters.favIds.length) {
        if (!filters.favIds.includes(d.id)) return false;
      }

      // 11. Sisa kata kunci bebas (mendukung leetspeak b3l -> bel dan typo tolerance)
      if (parsed.keywords && parsed.keywords.length > 0) {
        const searchHaystack = (d.nama + ' ' + d.lokasi + ' ' + (d.kabKota || '') + ' ' + d.provinsi + ' ' + d.wilayah + ' ' + d.jenisWisata + ' ' + d.aktivitasStr + ' ' + d.atraksi + ' ' + d.fasilitasStr).toLowerCase();
        const matchesAll = parsed.keywords.every(kw => matchKeywordFuzzy(kw, searchHaystack));
        if (!matchesAll) return false;
      }

      return true;
    });

    const reasoning = this.buildReasoningSteps(parsed, filters);
    const sparql = this.generateSparqlQuery(parsed, filters);

    return {
      total: matches.length,
      results: matches,
      parsedQuery: parsed,
      appliedFilters: filters,
      reasoningSteps: reasoning,
      sparqlQuery: sparql
    };
  }
}

module.exports = SemanticSearch;
