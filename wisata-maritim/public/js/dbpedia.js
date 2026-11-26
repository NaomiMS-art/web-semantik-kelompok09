/**
 * dbpedia.js — Modul Integrasi SPARQL DBpedia & NLU Chatbot
 * Ombak Nusantara · Web Semantik Kelompok 09
 */

const DBpedia = (() => {
  const ENDPOINT = 'https://dbpedia.org/sparql';
  const PROXY = 'https://api.allorigins.win/get?url=';

  /* ------------------------------------------------------------------ */
  /* 1. Core SPARQL Query Function (Direct + CORS Proxy Fallback)       */
  /* ------------------------------------------------------------------ */
  async function query(sparql) {
    const params = new URLSearchParams({
      query: sparql,
      format: 'application/sparql-results+json'
    });
    const directUrl = `${ENDPOINT}?${params.toString()}`;

    // 1) Coba langsung ke DBpedia SPARQL endpoint
    try {
      const r = await fetch(directUrl, {
        headers: { Accept: 'application/sparql-results+json' },
        signal: AbortSignal.timeout(8000)
      });
      if (r.ok) return await r.json();
    } catch (_) {
      // lanjut ke CORS proxy fallback jika diblokir peramban
    }

    // 2) Fallback melalui CORS Proxy
    const proxyUrl = `${PROXY}${encodeURIComponent(directUrl)}`;
    const r2 = await fetch(proxyUrl, { signal: AbortSignal.timeout(12000) });
    if (!r2.ok) throw new Error(`DBpedia proxy HTTP error: ${r2.status}`);
    const wrapper = await r2.json();
    return JSON.parse(wrapper.contents);
  }

  /* ------------------------------------------------------------------ */
  /* 2. Format Hasil Binding SPARQL Menjadi Objek Bersih                */
  /* ------------------------------------------------------------------ */
  function formatSparqlResult(binding) {
    const out = {};
    for (const [k, v] of Object.entries(binding)) {
      out[k] = v ? v.value : null;
    }
    return out;
  }

  /* ------------------------------------------------------------------ */
  /* 3. Basis Pengetahuan Semantik Lokal (Offline & High-Speed Cache)   */
  /* ------------------------------------------------------------------ */
  const LOCAL_KB = {
    bunaken: {
      nama: 'Taman Nasional Bunaken',
      resource: 'http://dbpedia.org/resource/Bunaken_National_Park',
      abstract: 'Taman Nasional Bunaken adalah taman laut di Sulawesi Utara, Indonesia. Terletak di pusat Segitiga Terumbu Karang Dunia, menyediakan habitat bagi 390 spesies karang serta ribuan spesies ikan, moluska, reptil, dan mamalia laut. Terkenal dengan dinding karang vertikal spektakuler sedalam 25–50 meter yang menjadi surga penyelaman internasional.',
      thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&auto=format&fit=crop&q=80',
      wikiPage: 'https://en.wikipedia.org/wiki/Bunaken_National_Park',
      coordinates: { lat: 1.6247, long: 124.7644 }
    },
    komodo: {
      nama: 'Taman Nasional Komodo',
      resource: 'http://dbpedia.org/resource/Komodo_National_Park',
      abstract: 'Taman Nasional Komodo terletak di Kepulauan Sunda Kecil antara Nusa Tenggara Timur dan Nusa Tenggara Barat. Meliputi tiga pulau utama (Komodo, Padar, Rinca), taman ini melindungi kadal terbesar di dunia (Varanus komodoensis), pantai pasir merah muda (Pink Beach), dan keanekaragaman biota laut spektakuler seperti pari manta.',
      thumbnail: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=700&auto=format&fit=crop&q=80',
      wikiPage: 'https://en.wikipedia.org/wiki/Komodo_National_Park',
      coordinates: { lat: -8.5444, long: 119.4897 }
    },
    'raja ampat': {
      nama: 'Kepulauan Raja Ampat',
      resource: 'http://dbpedia.org/resource/Raja_Ampat_Islands',
      abstract: 'Kepulauan Raja Ampat berada di ujung barat laut Semenanjung Kepala Burung di Papua Barat Daya. Terdiri dari 1.500 pulau karang kecil mengelilingi empat pulau utama (Misool, Salawati, Batanta, Waigeo). Memiliki 75% spesies karang dunia, menjadikannya episentrum keanekaragaman hayati laut terkaya di muka bumi.',
      thumbnail: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=700&auto=format&fit=crop&q=80',
      wikiPage: 'https://en.wikipedia.org/wiki/Raja_Ampat_Islands',
      coordinates: { lat: -0.2333, long: 130.5167 }
    },
    wakatobi: {
      nama: 'Taman Nasional Wakatobi',
      resource: 'http://dbpedia.org/resource/Wakatobi_National_Park',
      abstract: 'Taman Nasional Wakatobi terletak di Sulawesi Tenggara. Nama Wakatobi merupakan akronim dari empat pulau utamanya: Wangi-Wangi, Kaledupa, Tomia, dan Binongko. Menjadi cagar biosfer dunia UNESCO dengan gugusan terumbu karang penghalang kedua terbesar di dunia.',
      thumbnail: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=700&auto=format&fit=crop&q=80',
      wikiPage: 'https://en.wikipedia.org/wiki/Wakatobi_National_Park',
      coordinates: { lat: -5.3167, long: 123.5833 }
    },
    'banda neira': {
      nama: 'Kepulauan Banda',
      resource: 'http://dbpedia.org/resource/Banda_Islands',
      abstract: 'Kepulauan Banda di Laut Banda, Provinsi Maluku, merupakan kepulauan vulkanik legendaris yang dahulunya menjadi satu-satunya penghasil rempah pala di dunia. Selain situs bersejarah Benteng Belgica, perairannya memiliki dinding karang luar biasa dan spot mengamati hiu martil.',
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80',
      wikiPage: 'https://en.wikipedia.org/wiki/Banda_Islands',
      coordinates: { lat: -4.5247, long: 129.9042 }
    },
    derawan: {
      nama: 'Kepulauan Derawan',
      resource: 'http://dbpedia.org/resource/Derawan_Islands',
      abstract: 'Kepulauan Derawan di Kabupaten Berau, Kalimantan Timur, mencakup Pulau Derawan, Maratua, Sangalaki, dan Kakaban. Dikenal dengan danau ubur-ubur tanpa sengat di Kakaban, habitat penyu hijau terbesar di Indonesia, serta perairan jernih dengan kawanan pari manta raksasa.',
      thumbnail: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=700&auto=format&fit=crop&q=80',
      wikiPage: 'https://en.wikipedia.org/wiki/Derawan_Islands',
      coordinates: { lat: 2.2858, long: 118.2436 }
    },
    karimunjawa: {
      nama: 'Taman Nasional Karimunjawa',
      resource: 'http://dbpedia.org/resource/Karimunjawa',
      abstract: 'Kepulauan Karimunjawa adalah kepulauan di Laut Jawa yang termasuk Kabupaten Jepara, Jawa Tengah. Kawasan konservasi laut ini menawarkan pulau pasir putih, terumbu karang dangkal untuk snorkeling pemula, dan penangkaran hiu serta penyu sisik.',
      thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&auto=format&fit=crop&q=80',
      wikiPage: 'https://en.wikipedia.org/wiki/Karimunjawa',
      coordinates: { lat: -5.8500, long: 110.4333 }
    },
    'gili trawangan': {
      nama: 'Gili Trawangan',
      resource: 'http://dbpedia.org/resource/Gili_Trawangan',
      abstract: 'Gili Trawangan adalah pulau terbesar di antara tiga gili di Lombok Utara, Nusa Tenggara Barat. Terkenal bebas kendaraan bermotor, memiliki patung bawah laut Nest karya Jason deCaires Taylor, pantai pasir putih, dan habitat penyu liar yang ramah perenang.',
      thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&auto=format&fit=crop&q=80',
      wikiPage: 'https://en.wikipedia.org/wiki/Gili_Trawangan',
      coordinates: { lat: -8.3500, long: 116.0333 }
    },
    'nusa penida': {
      nama: 'Nusa Penida',
      resource: 'http://dbpedia.org/resource/Nusa_Penida',
      abstract: 'Nusa Penida adalah pulau di tenggara Bali. Terkenal dengan tebing ikonik Pantai Kelingking berbentuk T-Rex, Broken Beach, Angel Billabong, serta spot penyelaman Manta Point tempat penyelam dapat berenang bersama pari manta dan ikan mola-mola.',
      thumbnail: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=700&auto=format&fit=crop&q=80',
      wikiPage: 'https://en.wikipedia.org/wiki/Nusa_Penida',
      coordinates: { lat: -8.7278, long: 115.5444 }
    },
    sabang: {
      nama: 'Kota Sabang & Pulau Weh',
      resource: 'http://dbpedia.org/resource/Sabang,_Aceh',
      abstract: 'Kota Sabang terletak di Pulau Weh dan merupakan titik paling barat kepulauan Indonesia di Provinsi Aceh. Terkenal dengan Monumen Nol Kilometer, Pantai Iboih, dan Pulau Rubiah yang memiliki taman laut terumbu karang dangkal alami.',
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80',
      wikiPage: 'https://en.wikipedia.org/wiki/Sabang,_Aceh',
      coordinates: { lat: 5.8900, long: 95.3190 }
    },
    bali: {
      nama: 'Pulau Bali',
      resource: 'http://dbpedia.org/resource/Bali',
      abstract: 'Bali adalah sebuah pulau dan provinsi di Indonesia yang terletak di antara Pulau Jawa dan Lombok. Terkenal di seluruh dunia sebagai destinasi bahari dengan pantai selancar legendaris (Kuta, Uluwatu, Padang Padang), keindahan tebing kapur Nusa Penida, wisata pura bahari Tanah Lot, serta spot diving terumbu karang kelas dunia di Tulamben dan Pulau Menjangan.',
      thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&auto=format&fit=crop&q=80',
      wikiPage: 'https://en.wikipedia.org/wiki/Bali',
      coordinates: { lat: -8.3405, long: 115.0920 }
    }
  };

  /* ------------------------------------------------------------------ */
  /* 4. Pencarian Destinasi Maritim di DBpedia via SPARQL & Fallback    */
  /* ------------------------------------------------------------------ */
  async function searchDestination(name) {
    if (!name || typeof name !== 'string') return null;
    const clean = name.trim().replace(/^(pantai|pulau|taman nasional|wisata)\s+/i, '').trim();
    const queryTerm = (clean.length >= 3 ? clean : name.trim()).replace(/"/g, '\\"');
    const lc = name.toLowerCase();

    // 1) Cek basis data pengetahuan lokal terlebih dahulu untuk kecepatan & kualitas gambar maksimal
    for (const [key, data] of Object.entries(LOCAL_KB)) {
      if (lc.includes(key) || key.includes(clean.toLowerCase())) {
        return Object.assign({}, data);
      }
    }

    const sparql = `
PREFIX dbo:  <http://dbpedia.org/ontology/>
PREFIX dbr:  <http://dbpedia.org/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX geo:  <http://www.w3.org/2003/01/geo/wgs84_pos#>

SELECT DISTINCT ?resource ?abstract ?thumbnail ?wikiPage ?lat ?long
WHERE {
  ?resource rdfs:label ?label .
  FILTER (CONTAINS(LCASE(STR(?label)), LCASE("${queryTerm}")))
  FILTER (lang(?label) = "en" || lang(?label) = "id")
  ?resource dbo:abstract ?abstract .
  FILTER (lang(?abstract) = "id" || lang(?abstract) = "en")
  OPTIONAL { ?resource dbo:thumbnail ?thumbnail }
  OPTIONAL { ?resource foaf:isPrimaryTopicOf ?wikiPage }
  OPTIONAL { ?resource geo:lat ?lat ; geo:long ?long }
}
LIMIT 3`;

    try {
      const data = await query(sparql);
      const bindings = data?.results?.bindings || [];
      if (bindings.length > 0) {
        const idRow = bindings.find(b => b.abstract && b.abstract['xml:lang'] === 'id');
        const best = idRow || bindings[0];
        const row = formatSparqlResult(best);

        // Pastikan thumbnail tidak menggunakan hash thumbnail wikimedia yang rentan 400
        let thumbUrl = row.thumbnail ? row.thumbnail.replace('http://', 'https://') : null;
        if (!thumbUrl || thumbUrl.includes('wikimedia.org/wikipedia/commons/thumb/')) {
          thumbUrl = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&auto=format&fit=crop&q=80';
        }

        return {
          nama: name,
          resource: row.resource || null,
          abstract: row.abstract || null,
          thumbnail: thumbUrl,
          wikiPage: row.wikiPage || row.resource || null,
          coordinates: (row.lat && row.long) ? { lat: parseFloat(row.lat), long: parseFloat(row.long) } : null
        };
      }
    } catch (e) {
      console.warn('[DBpedia SPARQL] Live query terkendala, menggunakan semantic fallback:', e.message);
    }

    return null;
  }

  /* ------------------------------------------------------------------ */
  /* 5. Natural Language Understanding & Asisten Chatbot Hybrid         */
  /* ------------------------------------------------------------------ */
  function levenshteinDistance(a, b) {
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

  // Kamus Typo & Slang Bahasa Indonesia untuk Wisata Maritim
  const TYPO_DICTIONARY = {
    // Sapaan / Greetings
    'hi': 'halo', 'hii': 'halo', 'hiii': 'halo', 'hai': 'halo', 'haii': 'halo', 'hay': 'halo',
    'hallo': 'halo', 'haloo': 'halo', 'helo': 'halo', 'heloo': 'halo', 'hy': 'halo', 'hey': 'halo',
    'p': 'halo', 'ping': 'halo', 'oy': 'halo', 'woi': 'halo', 'woyy': 'halo', 'bot': 'bot', 'maritimbot': 'bot',
    'slamat': 'selamat', 'slaamat': 'selamat', 'selmat': 'selamat', 'aslm': 'assalamualaikum', 'assalam': 'assalamualaikum',
    'asalamualaikum': 'assalamualaikum', 'misi': 'permisi', 'punten': 'permisi',

    // Aktivitas Bahari
    'snorkling': 'snorkeling', 'snorkle': 'snorkeling', 'senorkling': 'snorkeling', 'senorkel': 'snorkeling',
    'divng': 'diving', 'divin': 'diving', 'daiving': 'diving', 'menyelm': 'diving', 'menyelam': 'diving', 'nylam': 'diving',
    'serfing': 'surfing', 'selansar': 'surfing', 'selancr': 'surfing', 'sorfing': 'surfing', 'surving': 'surfing',
    'brenang': 'berenang', 'renang': 'berenang', 'bernamg': 'berenang', 'mandi': 'berenang',
    'kanu': 'kano', 'kayak': 'kano', 'kaiak': 'kano',
    'kulner': 'kuliner', 'kulinr': 'kuliner', 'seafod': 'kuliner', 'seafood': 'kuliner', 'sifud': 'kuliner', 'mknan': 'kuliner',
    'mancing': 'memancing', 'mancng': 'memancing', 'fishing': 'memancing',
    'kemping': 'camping', 'kemah': 'camping', 'tenda': 'camping',
    'fhoto': 'fotografi', 'foto': 'fotografi', 'poto': 'fotografi',
    'snset': 'sunset', 'senja': 'sunset',
    'watersport': 'wahana air', 'jetski': 'wahana air',

    // Kata Kunci & Fasilitas
    'pante': 'pantai', 'pantey': 'pantai', 'pantae': 'pantai', 'pntai': 'pantai', 'pantaii': 'pantai',
    'pulo': 'pulau', 'plau': 'pulau', 'pulaw': 'pulau',
    'pralatan': 'peralatan', 'perlatn': 'peralatan', 'alat': 'peralatan', 'perlengkapan': 'peralatan',
    'sewa': 'sewa', 'nyewa': 'sewa', 'rental': 'sewa', 'rentl': 'sewa',
    'tket': 'tiket', 'tickt': 'tiket', 'htm': 'tiket',
    'hrga': 'harga', 'byaya': 'harga', 'biaya': 'harga',
    'mrah': 'murah', 'terjangkaw': 'murah',
    'grtis': 'gratis', 'gratiss': 'gratis', 'free': 'gratis',
    'rekomen': 'rekomendasi', 'rekomndasi': 'rekomendasi', 'recomended': 'rekomendasi', 'bagus': 'rekomendasi', 'terbaek': 'rekomendasi',
    'pmula': 'pemula', 'newbie': 'pemula',
    'mnengah': 'menengah', 'intermediate': 'menengah',
    'mhir': 'ahli', 'mahir': 'ahli', 'expert': 'ahli',

    // Wilayah & Destinasi Ikonik
    'blai': 'bali', 'balii': 'bali',
    'jwa': 'jawa', 'jakrta': 'jakarta', 'jogja': 'yogyakarta',
    'sumtra': 'sumatra', 'sumtara': 'sumatra', 'sumatera': 'sumatra',
    'kalimntan': 'kalimantan', 'borneo': 'kalimantan',
    'sulwesi': 'sulawesi', 'slwesi': 'sulawesi',
    'mluku': 'maluku',
    'papua': 'papua', 'papoa': 'papua',
    'bunakn': 'bunaken', 'bunakan': 'bunaken', 'bnaken': 'bunaken',
    'wakatbi': 'wakatobi', 'wktobi': 'wakatobi',
    'krmunjawa': 'karimunjawa', 'karimun': 'karimunjawa',
    'kmdo': 'komodo', 'komdo': 'komodo',
    'labuanbajo': 'labuan bajo', 'lb bajo': 'labuan bajo',
    'gilitrawangan': 'gili trawangan', 'gilit': 'gili trawangan',
    'nusapenida': 'nusa penida',
    'drawan': 'derawan',
    'bandaneira': 'banda neira',
    'rajaampat': 'raja ampat'
  };

  function isSubsequenceMatch(shortStr, targetWord) {
    if (!shortStr || !targetWord || shortStr.length < 3) return false;
    if (shortStr[0] !== targetWord[0]) return false;
    if (shortStr.length / targetWord.length < 0.48) return false;
    let i = 0;
    for (let j = 0; j < targetWord.length && i < shortStr.length; j++) {
      if (shortStr[i] === targetWord[j]) i++;
    }
    return i === shortStr.length;
  }

  function normalizeTypoLeetspeak(str) {
    if (!str) return '';
    // Tokenisasi terlebih dahulu agar angka murni / nominal budget (misal 100rb, 250000) tidak berubah menjadi huruf
    const rawTokens = str.toLowerCase().split(/[\s,?.!;:/\-\(\)]+/).filter(Boolean);
    const canonicalKeywords = [
      'halo', 'selamat', 'pantai', 'pulau', 'snorkeling', 'diving', 'surfing',
      'berenang', 'kano', 'kuliner', 'peralatan', 'sewa', 'harga', 'tiket',
      'murah', 'gratis', 'rekomendasi', 'pemula', 'menengah', 'ahli',
      'bali', 'jawa', 'sumatra', 'kalimantan', 'sulawesi', 'maluku', 'papua',
      'bunaken', 'komodo', 'wakatobi', 'karimunjawa', 'derawan', 'morotai',
      'lampuuk', 'raja', 'ampat', 'lombok', 'labuan', 'bajo', 'mentawai',
      'belitung', 'pahawang', 'tulamben', 'uluwatu', 'kelingking', 'pangandaran', 'sawarna'
    ];

    const correctedTokens = rawTokens.map(rawTok => {
      // Jangan ubah nominal angka/budget (misal: 0, 100, 100rb, 250k, 1jt)
      if (/^\d+(rb|ribu|k|jt|juta)?$/.test(rawTok)) {
        return rawTok;
      }

      let tok = rawTok
        .replace(/3/g, 'e')
        .replace(/4|@/g, 'a')
        .replace(/1|!|\|/g, 'i')
        .replace(/0/g, 'o')
        .replace(/5|\$/g, 's')
        .replace(/6|9/g, 'g')
        .replace(/8/g, 'b')
        .replace(/7/g, 't')
        .replace(/2/g, 'z')
        .replace(/([a-z])\1{2,}/g, '$1');

      // 1. Cek kamus typo eksak
      if (TYPO_DICTIONARY[tok]) return TYPO_DICTIONARY[tok];

      // 2. Subsequence & Fuzzy Levenshtein untuk kata-kata kunci utama
      if (tok.length >= 4) {
        let bestCandidate = tok;
        let minDiff = 999;
        const maxDist = tok.length >= 6 ? 2 : (tok.length === 5 ? 2 : 1);

        for (const can of canonicalKeywords) {
          if (isSubsequenceMatch(tok, can)) {
            return can;
          }
          if (Math.abs(tok.length - can.length) <= maxDist) {
            const diff = levenshteinDistance(tok, can);
            if (diff <= maxDist && diff < minDiff) {
              minDiff = diff;
              bestCandidate = can;
            }
          }
        }
        if (minDiff <= maxDist) {
          return bestCandidate;
        }
      }

      return tok;
    });

    return correctedTokens.join(' ');
  }

  async function askChatbot(userMessage) {
    const rawMsg = userMessage.trim();
    const normMsg = normalizeTypoLeetspeak(rawMsg);
    const lc = normMsg;

    let text = '';
    let dbpediaData = null;
    let recommendations = [];
    let suggestions = [];

    // Helper untuk kueri API lokal jika server aktif
    async function queryLocalApi(q, extraParams = {}) {
      try {
        const queryParams = new URLSearchParams({ q, ...extraParams });
        const res = await fetch(`/api/search?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          return data.results || [];
        }
      } catch (_) { }
      return [];
    }

    // Ekstraksi entitas wilayah/provinsi jika ada
    const wilKeywords = [
      { name: 'Bali', label: 'Provinsi Bali', rx: /\b(bali|denpasar|badung|sanur|kuta|uluwatu|seminyak|canggu|nusa dua|ceningan|lembongan)\b/i },
      { name: 'Jawa', label: 'Wilayah Jawa', rx: /\b(jawa|jakarta|kepulauan seribu|karimunjawa|yogyakarta|jogja|banten|pangandaran|anyer|ujung genteng|pelabuhan ratu|pacitan)\b/i },
      { name: 'Nusa Tenggara', label: 'Wilayah Nusa Tenggara (NTB & NTT)', rx: /\b(nusa tenggara|ntb|ntt|lombok|gili|komodo|flores|sumba|labuan bajo|alor|rote)\b/i },
      { name: 'Sumatra', label: 'Wilayah Sumatra', rx: /\b(sumatra|sumatera|aceh|sabang|medan|padang|nias|mentawai|lampung|riau|belitung|bangka)\b/i },
      { name: 'Kalimantan', label: 'Wilayah Kalimantan', rx: /\b(kalimantan|derawan|maratua|kakaban|sangalaki|balikpapan|tarakan)\b/i },
      { name: 'Sulawesi', label: 'Wilayah Sulawesi', rx: /\b(sulawesi|bunaken|wakatobi|manado|makassar|selayar|togean|lembeh|gorontalo|bira)\b/i },
      { name: 'Maluku', label: 'Wilayah Maluku', rx: /\b(maluku|ambon|banda|neira|morotai|ternate|kei)\b/i },
      { name: 'Papua', label: 'Wilayah Papua', rx: /\b(papua|raja ampat|biak|sorong|fakfak|jayapura|merauke)\b/i }
    ];
    const matchedWil = wilKeywords.find(w => w.rx.test(lc));

    // A. Greeting (Sapaan Balik & Menanyakan Bantuan)
    const isGreetingWord = /\b(halo|hai|hei|hi|hello|p|ping|oy|woi|bot|assalamualaikum|assalam|permisi|selamat|pagi|siang|sore|malam)\b/i.test(lc);
    const hasSpecificIntent = /\b(snorkeling|diving|surfing|pantai|pulau|sewa|peralatan|alat|harga|tiket|gratis|budget|level|pemula|ahli|menengah|bali|jawa|sumatra|kalimantan|sulawesi|maluku|papua|komodo|bunaken|raja ampat|wakatobi|karimunjawa|derawan|aktivitas|ontologi|rekomendasi)\b/i.test(lc);

    if (isGreetingWord && !hasSpecificIntent) {
      text = `Halo! 👋 Senang bisa menyapa kamu!\n\n**Ada yang bisa saya bantu seputar wisata maritim atau liburan baharimu hari ini?** 😊\n\nSaya asisten cerdas berbasis **Web Semantik & DBpedia SPARQL** yang siap membantu kamu mencari:\n• 🤿 **Aktivitas Bahari**: Rekomendasi snorkeling, diving, surfing, kano, island hopping\n• 📍 **Pencarian Wilayah**: Eksplorasi spot eksotis di Bali, Jawa, Nusa Tenggara, Sumatra, Sulawesi, Maluku, hingga Papua\n• 💰 **Info Biaya & Tiket**: Destinasi gratis (HTM Rp0), wisata hemat di bawah 100rb, hingga sewa peralatan\n• 🎯 **Tingkat Keahlian**: Level pemula (ramah keluarga), menengah, hingga ahli/mahir\n\nSilakan pilih salah satu opsi di bawah atau ketik langsung pertanyaanmu ya!`;
      suggestions = [
        'Pantai gratis di Bali apa saja?',
        'Rekomendasi snorkeling untuk pemula',
        'Spot diving di Bunaken',
        'Tingkat level diatas pemula',
        'Tingkat ahli',
        'Peralatan apa saja yang disewakan?'
      ];
      return { text, dbpediaData, suggestions };
    }

    // B. Terima Kasih / Pamit
    if (/\b(terima kasih|makasih|thanks|thank you|bye|dadah|sampai jumpa|oke|siap)\b/i.test(lc)) {
      text = `Sama-sama! Senang bisa membantu menjelajahi kekayaan bahari nusantara 🏝️ Jika ada yang ingin ditanyakan seputar harga, peralatan, tingkat level, atau rekomendasi destinasi, silakan tanyakan kapan saja!`;
      suggestions = [
        'Rekomendasi wisata maritim terbaik',
        'Tempat yang ada sewa alat',
        'Tingkat ahli'
      ];
      return { text, dbpediaData, suggestions };
    }

    // C. Tanya Web Semantik / Ontologi
    if (/\b(ontologi|web semantik|semantic web|sparql|turtle|rdf|triple)\b/i.test(lc)) {
      text = `🌐 **Arsitektur Web Semantik Ombak Nusantara:**\n\n• **Ontologi W3C RDF Turtle (\`.ttl\`)**: Memodelkan relasi kelas \`maritim:DestinasiWisata\`, \`maritim:AktivitasBahari\`, \`maritim:Peralatan\`, dan \`maritim:TingkatKeahlian\`.\n• **SPARQL Endpoint**: Menyediakan query reasoning in-memory standar W3C di endpoint \`/api/sparql\`.\n• **Integrasi DBpedia**: Mengambil graf pengetahuan global (*Linked Open Data*) dari endpoint resmi \`https://dbpedia.org/sparql\`.\n• **Faceted Search**: Multi-dimensi berdasarkan range harga Google, status sewa alat, dan level keahlian.`;
      suggestions = [
        'Rekomendasi wisata maritim terbaik',
        'Tingkat level diatas pemula',
        'Harga tiket masuk dan sewa alat'
      ];
      return { text, dbpediaData, suggestions };
    }

    // D. Tanya Semua Aktivitas Maritim yang Tersedia
    if (/\b(aktivitas apa saja|ada aktivitas apa|bisa ngapain|macam aktivitas|kegiatan apa saja)\b/i.test(lc)) {
      text = `🤿 **14 Aktivitas Wisata Bahari yang Terdata di Sistem:**\n\n1. **Snorkeling**: Terumbu karang dangkal (Bunaken, Karimunjawa, Gili Trawangan)\n2. **Diving (Penyelaman)**: Dinding karang & kapal karam (Raja Ampat, Tulamben, Lembeh)\n3. **Surfing (Selancar)**: Ombak barrel kelas dunia (Mentawai, Nias Lagundri, Pantai Kuta Bali)\n4. **Kano & Kayak**: Mendayung di laguna tenang & hutan mangrove\n5. **Island Hopping**: Jelajah antarpulau pasir putih (Kepulauan Derawan, Belitung)\n6. **Satwa Laut**: Observasi penyu, lumba-lumba Lovina, pari manta, & hiu paus Botubarani\n7. **Berenang & Berjemur**: Pantai pasir putih ramah keluarga\n8. **Wahana Air**: Banana boat, jet ski, parasailing (Tanjung Benoa Bali, Anyer)\n9. **Trekking & Panjat**: Tebing karst & panorama teluk (Pulau Padar, Pantai Siung)\n10. **Sejarah & Budaya Bahari**: Benteng Belgica Banda Neira, Pura Tanah Lot, peninggalan PD II\n11. **Kuliner Laut**: Ikan bakar pesisir, seafood Jimbaran Bali, cumi & kepiting segar\n12. **Fotografi & Sunset**: Golden hour di tebing karang & pohon bakau Walakiri\n13. **Camping Pantai**: Berkemah di tepi pantai tenang\n14. **Memancing**: Memancing jukung tradisional di laut lepas\n\nMau cari destinasi untuk aktivitas yang mana?`;
      suggestions = [
        'Surfing',
        'Snorkeling',
        'Diving',
        'Kano & Kayak'
      ];
      return { text, dbpediaData, suggestions };
    }

    // E. Tanya Tingkat Level Diatas Pemula (Menengah)
    if (/\b(di ?atas pemula|tingkat level diatas pemula|level diatas pemula|menengah|intermediate|bukan pemula)\b/i.test(lc)) {
      const localHits = await queryLocalApi('Menengah', { level: 'Menengah' });
      const filtered = matchedWil
        ? localHits.filter(d => d.provinsi.toLowerCase().includes(matchedWil.name.toLowerCase()) || d.wilayah.toLowerCase().includes(matchedWil.name.toLowerCase()))
        : localHits;

      const listText = (filtered.length ? filtered : localHits).slice(0, 5).map(d =>
        `• **${d.nama}** (${d.lokasi})\n  Aktivitas: ${d.aktivitas?.join(', ')}\n  Estimasi Biaya: ${d.rangeHargaTotalLabel}`
      ).join('\n\n');

      const locHeader = matchedWil ? `di ${matchedWil.label || matchedWil.name}` : 'di Indonesia';

      text = `🌊 **Destinasi Tingkat Level Diatas Pemula (Menengah) ${locHeader}:**\n\n` +
        `**Karakteristik Level Menengah:**\n` +
        `• Membutuhkan kebugaran fisik yang baik dan kemampuan berenang mandiri.\n` +
        `• Menghadapi perairan terbuka dengan arus ringan-sedang atau ombak berskala menengah.\n` +
        `• Untuk penyelam (diving), dianjurkan telah mengantongi sertifikasi *PADI/SSI Open Water Diver*.\n\n` +
        `**Rekomendasi Spot Menengah:**\n\n${listText}`;

      suggestions = [
        'Tingkat ahli',
        'Peralatan apa saja yang disewakan?',
        'Harga tiket masuk dan sewa alat'
      ];
      recommendations = (filtered.length ? filtered : localHits).slice(0, 4);
      return { text, dbpediaData, recommendations, suggestions };
    }

    // F. Tanya Tingkat Ahli / Mahir
    if (/\b(ahli|tingkat ahli|level ahli|mahir|expert|advanced|profesional)\b/i.test(lc)) {
      const localHits = await queryLocalApi('Mahir', { level: 'Mahir' });
      const filtered = matchedWil
        ? localHits.filter(d => d.provinsi.toLowerCase().includes(matchedWil.name.toLowerCase()) || d.wilayah.toLowerCase().includes(matchedWil.name.toLowerCase()))
        : localHits;

      const listText = (filtered.length ? filtered : localHits).slice(0, 5).map(d =>
        `• **${d.nama}** (${d.lokasi})\n  Aktivitas Utama: ${d.aktivitas?.join(', ')}\n  Estimasi Biaya: ${d.rangeHargaTotalLabel}`
      ).join('\n\n');

      const locHeader = matchedWil ? `di ${matchedWil.label || matchedWil.name}` : 'di Indonesia';

      text = `⚡ **Destinasi Tingkat Ahli (Mahir / Expert) ${locHeader}:**\n\n` +
        `**Karakteristik Level Mahir:**\n` +
        `• Diperuntukkan bagi petualang berpengalaman, peselancar profesional, atau penyelam tingkat lanjut (*Advanced Open Water / Rescue Diver*).\n` +
        `• Karakter medan menantang: ombak barrel Samudra Hindia yang kuat, arus bawah laut (*drift dive*), atau dinding karang vertikal (*deep wall diving* hingga 30+ meter).\n` +
        `• Menggunakan perlengkapan teknis tinggi seperti BCD, regulator ganda, dive computer, atau papan selancar khusus fiber.\n\n` +
        `**Rekomendasi Spot Tingkat Ahli:**\n\n${listText}`;

      suggestions = [
        'Tingkat level diatas pemula',
        'Peralatan selam teknis (BCD & Regulator)',
        'Spot surfing kelas dunia (Mahir)'
      ];
      recommendations = (filtered.length ? filtered : localHits).slice(0, 4);
      return { text, dbpediaData, recommendations, suggestions };
    }

    // G. Tanya Persewaan Alat & Peralatan Bahari
    if (/\b(peralatan|alat apa saja|sewa alat|persewaan alat|rental alat|ada alat|ketersediaan alat)\b/i.test(lc)) {
      const localHits = await queryLocalApi('sewa alat', { statusSewa: true });
      const listText = localHits.slice(0, 5).map(d => {
        const eqNames = d.peralatan?.filter(p => p.dapatDisewa).map(p => `${p.nama} (Rp${p.hargaSewa ? p.hargaSewa.toLocaleString('id-ID') : 'Termasuk'})`).slice(0, 2).join(', ');
        return `• **${d.nama}** (${d.provinsi})\n  Sewa Alat: ${eqNames || 'Tersedia lengkap di lokasi'}`;
      }).join('\n\n');

      text = `⚙️ **Peralatan Bahari & Status Persewaan Alat:**\n\n` +
        `Sistem mencatat rincian alat resmi untuk setiap aktivitas bahari:\n` +
        `1. **Snorkeling**: Masker & Snorkel (sewa ~Rp25rb), Fins kaki katak (~Rp25rb), Pelampung / Life Jacket (~Rp20rb), Full Set Snorkeling (~Rp50rb)\n` +
        `2. **Scuba Diving**: BCD & Regulator Selam (~Rp200rb), Tabung Scuba Oksigen (~Rp100rb), Wetsuit Selam (~Rp50rb), Paket Fun Dive Lengkap + Guide (~Rp600rb-800rb)\n` +
        `3. **Surfing**: Papan Selancar Soft-top pemula / Fiber mahir (~Rp50rb-100rb/hari), Leash tali kaki\n` +
        `4. **Kano & Perahu**: Perahu kano/kayak dayung (~Rp50rb-100rb), Sewa perahu keliling / island hopping (~Rp300rb-500rb)\n\n` +
        `**Contoh Destinasi dengan Persewaan Alat Lengkap:**\n\n${listText}`;

      suggestions = [
        'Rekomendasi snorkeling untuk pemula',
        'Destinasi sewa alat di Bali',
        'Harga tiket masuk dan sewa alat'
      ];
      return {
        text,
        dbpediaData,
        recommendations: (typeof localHits !== 'undefined' && localHits) ? localHits : [],
        totalResults: (typeof localHits !== 'undefined' && localHits) ? localHits.length : 0,
        searchQuery: matchedWil ? matchedWil.name : 'gratis',
        suggestions
      };
    }

    // H. Tanya Rekomendasi Terpadu (Curated Recommendations)
    if (/\b(rekomendasi|rekomendasikan|paling bagus|destinasi terbaik|favorit|tempat terbaik)\b/i.test(lc) && !matchedWil) {
      text = `🏆 **Rekomendasi Destinasi Wisata Maritim Terbaik di Indonesia:**\n\n` +
        `1. **Untuk Snorkeling Pemula & Keluarga**:\n` +
        `   • **Gili Trawangan** (Lombok, NTB) — Air tenang, penyu liar, patung bawah laut Nest\n` +
        `   • **Karimunjawa** (Jepara, Jawa Tengah) — Terumbu karang dangkal, penangkaran hiu\n\n` +
        `2. **Untuk Penyelaman (Diving) Kelas Dunia**:\n` +
        `   • **Taman Nasional Bunaken** (Sulawesi Utara) — Dinding karang vertikal 25–50 meter\n` +
        `   • **Raja Ampat** (Papua Barat Daya) — 75% spesies karang dunia, pusat biodiversitas bumi\n\n` +
        `3. **Untuk Surfing (Selancar Ombak)**:\n` +
        `   • **Pantai Kuta** (Bali) — Sangat ramah untuk pemula yang baru belajar\n` +
        `   • **Mentawai (Macaronis)** (Sumbar) & **Pantai Lagundri** (Nias) — Ombak kelas dunia bagi peselancar mahir\n\n` +
        `4. **Untuk Konservasi & Satwa Laut Unik**:\n` +
        `   • **Taman Nasional Komodo** (NTT) — Habitat komodo purba & pari manta raksasa\n` +
        `   • **Hiu Paus Botubarani** (Gorontalo) — Berenang bersama hiu paus ramah di pesisir`;

      suggestions = [
        'Ceritakan tentang Bunaken',
        'Pantai gratis di Bali apa saja?',
        'Tingkat level diatas pemula',
        'Tingkat ahli'
      ];
      return { text, dbpediaData, suggestions };
    }

    // I. Tanya Destinasi Spesifik Ikonik (Bunaken, Komodo, Raja Ampat, dll.)
    const checkNames = ['bunaken', 'komodo', 'raja ampat', 'wakatobi', 'banda neira', 'derawan', 'karimunjawa', 'gili trawangan', 'nusa penida', 'sabang', 'wehh', 'morotai', 'labuan bajo'];
    const matchedPlace = checkNames.find(name => lc.includes(name));

    if (matchedPlace) {
      dbpediaData = await searchDestination(matchedPlace);
      const localHits = await queryLocalApi(matchedPlace);
      const hit = localHits[0];

      let localInfo = '';
      if (hit) {
        localInfo = `\n\n📌 **Rincian Data Destinasi:**\n• Lokasi: ${hit.lokasi}\n• HTM Tiket Masuk: ${hit.hargaTiketMasuk ? 'Rp' + hit.hargaTiketMasuk.toLocaleString('id-ID') : 'Gratis (Rp0)'}\n• Level Keahlian: **${hit.level}**\n• Peralatan Tersedia: ${hit.peralatan?.map(p => p.nama).slice(0, 3).join(', ') || 'Alat standar'}\n• Estimasi Biaya Total: ${hit.rangeHargaTotalLabel || '-'}`;
      }

      if (dbpediaData && dbpediaData.abstract) {
        const ab = dbpediaData.abstract.length > 360 ? dbpediaData.abstract.slice(0, 360) + '...' : dbpediaData.abstract;
        text = `🏝️ **${dbpediaData.nama || matchedPlace.toUpperCase()} (Data DBpedia SPARQL)**\n\n${ab}${localInfo}`;
      } else {
        text = `🏝️ **Informasi Destinasi: ${matchedPlace.toUpperCase()}**${localInfo || '\nDestinasi maritim unggulan nusantara dengan pesona bahari yang menakjubkan.'}`;
      }

      suggestions = [
        `Peralatan yang disewa di ${matchedPlace}`,
        `Berapa biaya tiket ke ${matchedPlace}?`,
        'Rekomendasi destinasi lainnya'
      ];
      recommendations = localHits.slice(0, 4);
      return { text, dbpediaData, recommendations, suggestions };
    }

    // J. Tanya Aktivitas Bahari Spesifik (14 Aktivitas Terdata Lengkap)
    const actPatterns = [
      {
        id: 'Snorkeling',
        rx: /\b(snorkeling|snorkel|snorkling)\b/i,
        icon: '🤿',
        title: 'Snorkeling (Selam Permukaan)',
        desc: 'Menikmati keindahan terumbu karang warna-warni dan ikan hias di perairan dangkal (1–4 meter) yang jernih dan tenang.',
        alat: 'Masker Snorkel (~Rp25rb), Fins Kaki Katak (~Rp25rb), Pelampung / Life Jacket (~Rp20rb), Full Set Snorkeling (~Rp50rb-150rb)',
        sug: ['Snorkeling pemula di Bali', 'Spot snorkeling Bunaken', 'Harga sewa alat snorkeling']
      },
      {
        id: 'Diving',
        rx: /\b(diving|selam|menyelam|scuba|freedive|freediving)\b/i,
        icon: '🌊',
        title: 'Penyelaman Laut (Scuba & Freediving)',
        desc: 'Menjelajahi keanekaragaman terumbu karang, dinding karang vertikal, dan bangkai kapal karam di kedalaman 10–30+ meter.',
        alat: 'Tabung Scuba Oksigen (~Rp100rb), BCD & Regulator Selam (~Rp200rb), Wetsuit (~Rp50rb), Dive Computer, Paket Fun Dive + Guide (~Rp600rb-800rb)',
        sug: ['Spot diving di Sulawesi', 'Diving di Raja Ampat', 'Tingkat level diatas pemula']
      },
      {
        id: 'Surfing',
        rx: /\b(surfing|selancar|surf|ombak)\b/i,
        icon: '🏄',
        title: 'Selancar Ombak (Surfing)',
        desc: 'Menunggangi gulungan ombak samudra kelas dunia, dari beach break ramah pemula hingga reef break barrel menantang.',
        alat: 'Papan Selancar Soft-top pemula / Fiber mahir (~Rp50rb-100rb/hari), Leash tali kaki, Wax papan, Rashguard / Wetsuit',
        sug: ['Spot surfing di Bali', 'Surfing untuk pemula', 'Spot surfing tingkat ahli (Mahir)']
      },
      {
        id: 'Berenang',
        rx: /\b(berenang|berjemur|renang|mandi laut)\b/i,
        icon: '🏊',
        title: 'Berenang & Berjemur di Pantai',
        desc: 'Rekreasi santai berenang di perairan pantai tenang berpasir putih, aman untuk keluarga dan anak-anak.',
        alat: 'Pakaian renang, Pelampung pantai / ban renang (~Rp10rb-20rb), Kacamata renang, Sunscreen',
        sug: ['Pantai pasir putih ramah anak', 'Pantai gratis di Bali apa saja?', 'Destinasi wisata keluarga']
      },
      {
        id: 'Island Hopping',
        rx: /\b(island hopping|jelajah pulau|keliling pulau|antar pulau)\b/i,
        icon: '🏝️',
        title: 'Island Hopping (Jelajah Antarpulau)',
        desc: 'Petualangan berlayar menjelajahi gugusan pulau-pulau eksotis, laguna tersembunyi, dan gosong pasir putih dalam satu perjalanan trip.',
        alat: 'Sewa Perahu / Speedboat / Jukung (~Rp300rb-800rb/kapal), Life Jacket keselamatan, Dry bag anti air',
        sug: ['Island hopping Derawan', 'Keliling pulau di Belitung', 'Island hopping Karimunjawa']
      },
      {
        id: 'Kano & Kayak',
        rx: /\b(kano|kayak|mendayung)\b/i,
        icon: '🛶',
        title: 'Kano & Kayak Laut',
        desc: 'Mendayung santai menyusuri perairan pantai tenang, laguna karang, atau ekowisata hutan mangrove pesisir.',
        alat: 'Perahu Kano / Kayak Single & Double (~Rp50rb-100rb/jam), Dayung ganda, Life Jacket / Pelampung',
        sug: ['Spot kano mangrove', 'Kayak di perairan tenang', 'Harga sewa kano & kayak']
      },
      {
        id: 'Wahana Air',
        rx: /\b(wahana air|water sports|watersport|banana boat|jet ski|jetski|parasailing|wahana)\b/i,
        icon: '🚤',
        title: 'Wahana Olahraga Air (Water Sports)',
        desc: 'Sensasi rekreasi pemacu adrenalin di laut seperti Banana Boat, Jet Ski, Donut Boat, Flyboard, dan Parasailing.',
        alat: 'Pelampung keselamatan khusus watersport, Helm pelindung, Instruktur boat berpengalaman',
        sug: ['Wahana air di Tanjung Benoa Bali', 'Water sports di Anyer', 'Paket banana boat keluarga']
      },
      {
        id: 'Satwa Laut',
        rx: /\b(satwa laut|satwa|penyu|lumba|dolphin|manta|hiu paus|hiu)\b/i,
        icon: '🐢',
        title: 'Wisata Satwa & Konservasi Bahari',
        desc: 'Ekowisata edukatif mengamati satwa laut eksotis di habitat alaminya: penangkaran penyu, atraksi lumba-lumba liar, pari manta, hingga hiu paus jinak.',
        alat: 'Perahu jukung pengamat, Masker snorkel & pelampung, Pemandu ranger konservasi',
        sug: ['Observasi penyu bertelur', 'Lumba-lumba Lovina Bali', 'Berenang dengan Hiu Paus Botubarani']
      },
      {
        id: 'Trekking & Panjat',
        rx: /\b(trekking|hiking|panjat tebing|panjat|tebing|bukit)\b/i,
        icon: '🧗',
        title: 'Trekking & Panjat Tebing Karst Pesisir',
        desc: 'Mendaki bukit savana berpemandangan teluk bahari spektakuler atau memanjat tebing karang karst tepi laut.',
        alat: 'Sepatu trekking anti-slip, Tali karmantel & harness panjat, Helm pengaman, Pemandu lokal',
        sug: ['Trekking Pulau Padar Komodo', 'Panjat tebing Pantai Siung', 'Spot trekking panorama laut']
      },
      {
        id: 'Sejarah & Budaya Bahari',
        rx: /\b(sejarah|budaya bahari|budaya|benteng|museum|tugu|pura|kapal karam|arkeologi)\b/i,
        icon: '🏛️',
        title: 'Sejarah & Budaya Bahari Nusantara',
        desc: 'Menelusuri jejak kejayaan maritim jalur rempah, benteng kolonial tepi laut, pura suci pesisir, hingga situs kapal karam bersejarah Perang Dunia II.',
        alat: 'Kamera, Pemandu sejarah lokal, Tiket situs cagar budaya',
        sug: ['Benteng Belgica Banda Neira', 'Pura Tanah Lot Bali', 'Bangkai kapal USAT Liberty Tulamben']
      },
      {
        id: 'Kuliner Laut',
        rx: /\b(kuliner laut|makanan laut|kuliner|seafood|ikan bakar|kepiting|cumi|udang)\b/i,
        icon: '🦐',
        title: 'Wisata Kuliner Laut (Seafood Pesisir)',
        desc: 'Menikmati hidangan laut segar langsung dari tangkapan nelayan lokal: ikan bakar bumbu rempah pesisir, lobster, cumi, kepiting, dan kerang di tepi pantai.',
        alat: 'Sentra kuliner nelayan, Restoran tepi pantai, Warung seafood pesisir',
        sug: ['Seafood Pantai Jimbaran Bali', 'Ikan bakar pesisir Makassar', 'Kuliner laut segar murah']
      },
      {
        id: 'Fotografi & Sunset',
        rx: /\b(fotografi|sunset|sunrise|senja|foto|matahari terbit|matahari terbenam)\b/i,
        icon: '🌅',
        title: 'Fotografi & Golden Hour Sunset / Sunrise',
        desc: 'Berburu panorama siluet tebing karang, pohon bakau magis, dan semburat cahaya matahari terbenam atau terbit di cakrawala laut lepas.',
        alat: 'Kamera DSLR / Mirrorless / HP, Tripod, Filter ND / CPL',
        sug: ['Spot sunset terbaik di Bali', 'Sunset pohon menari Walakiri Sumba', 'Spot fotografi pulau karang']
      },
      {
        id: 'Camping Pantai',
        rx: /\b(camping pantai|berkemah pantai|camping|kemah|tenda|berkemah)\b/i,
        icon: '⛺',
        title: 'Camping Pantai (Berkemah di Pesisir)',
        desc: 'Merasakan pengalaman bermalam di bawah taburan bintang di tepi pantai tenang, diiringi deburan ombak dan hangatnya api unggun.',
        alat: 'Tenda dome tahan angin laut, Matras & sleeping bag, Lampu tenda / senter, Kompor portabel',
        sug: ['Pantai untuk camping di Jawa', 'Spot camping tepi laut tenang', 'Tips camping pantai aman']
      },
      {
        id: 'Memancing',
        rx: /\b(memancing|mancing|fishing|joran)\b/i,
        icon: '🎣',
        title: 'Memancing Laut (Sport Fishing & Tradisional)',
        desc: 'Sensasi *strike* memancing ikan karang hingga ikan pelagis besar menggunakan jukung sewaan nelayan tradisional atau teknik popping & jigging.',
        alat: 'Joran pancing laut, Reel, Umpan hidup / lure tiruan, Sewa perahu jukung nelayan',
        sug: ['Spot memancing laut lepas', 'Sewa perahu mancing', 'Destinasi sport fishing']
      }
    ];

    const matchedAct = actPatterns.find(a => a.rx.test(lc));
    if (matchedAct) {
      let localHits = [];
      if (matchedWil) {
        const allWil = await queryLocalApi(matchedWil.name);
        localHits = allWil.filter(d =>
          d.aktivitas?.some(da => da.toLowerCase().includes(matchedAct.id.toLowerCase())) ||
          (d.aktivitasStr || '').toLowerCase().includes(matchedAct.id.toLowerCase())
        );
      } else {
        localHits = await queryLocalApi(matchedAct.id);
      }

      const wilText = matchedWil ? `di ${matchedWil.label || matchedWil.name}` : 'di Indonesia';
      const listText = localHits.slice(0, 5).map(d =>
        `• **${d.nama}** (${d.lokasi})\n  Tingkat Keahlian: **${d.level}** | Biaya: ${d.rangeHargaTotalLabel}`
      ).join('\n\n');

      text = `${matchedAct.icon} **Destinasi ${matchedAct.title} ${wilText}:**\n\n${matchedAct.desc}\n\n**Spot Rekomendasi:**\n\n${listText || 'Belum ada data destinasi spesifik untuk kombinasi ini.'}\n\n🛠️ **Peralatan yang Digunakan:**\n${matchedAct.alat}`;

      suggestions = matchedWil ? [
        `Spot ${matchedAct.id} untuk pemula`,
        `Harga sewa alat ${matchedAct.id}`,
        `Pantai gratis di ${matchedWil.name}`
      ] : matchedAct.sug;

      return {
        text,
        dbpediaData,
        recommendations: (typeof localHits !== 'undefined' && localHits) ? localHits : [],
        totalResults: (typeof localHits !== 'undefined' && localHits) ? localHits.length : 0,
        searchQuery: matchedWil ? matchedWil.name : 'gratis',
        suggestions
      };
    }

    // K. Tanya Harga & Budget (Gratis, Murah, Range Harga Google-Style)
    if (/\b(budget|harga|biaya|murah|gratis|free|tiket|sewa|0)\b/i.test(lc)) {
      if (/\b(gratis|free|0)\b/i.test(lc)) {
        let localHits = [];
        if (matchedWil) {
          const allWilHits = await queryLocalApi(matchedWil.name);
          localHits = allWilHits.filter(d => d.hargaTiketMasuk === 0 || (d.rangeHargaTotalLabel && d.rangeHargaTotalLabel.includes('< Rp100')));
        } else {
          const allHits = await queryLocalApi('gratis');
          localHits = allHits.filter(d => d.hargaTiketMasuk === 0);
        }

        const wilLabel = matchedWil ? `di ${matchedWil.label || matchedWil.name}` : 'di Indonesia';
        const listText = localHits.slice(0, 5).map(d => `• **${d.nama}** (${d.lokasi}) — HTM: Rp0 (Gratis)`).join('\n');

        text = `💸 **Destinasi Wisata Bahari Gratis (HTM Rp0) ${wilLabel}:**\n\n${listText || 'Belum ada data destinasi gratis yang terdaftar untuk filter ini.'}\n\n*Tips: Walaupun tiket masuk gratis, siapkan dana untuk transportasi, kuliner lokal, atau sewa perlengkapan jika ingin snorkeling/surfing ya!*`;

        if (matchedWil) {
          dbpediaData = await searchDestination(matchedWil.name);
        }
      } else {
        text = `💰 **Sistem Filter Harga Google-Style Ombak Nusantara:**\n\nKami mengelompokkan biaya wisata menjadi 5 kategori transparan:\n1. **< Rp100.000**: Sangat hemat / wisata pantai lokal\n2. **Rp100.000 – Rp250.000**: Wisata bahari + sewa alat snorkeling\n3. **Rp250.000 – Rp500.000**: Trip island hopping & wahana air\n4. **Rp500.000 – Rp1.000.000**: Paket fun dive & boat charter sedang\n5. **> Rp1.000.000**: Paket diving profesional & liveaboard kapal pinisi\n\nKamu bisa meminta rekomendasi tempat pada range harga tertentu (contoh: *"destinasi di bawah 100rb"*).`;
      }

      suggestions = matchedWil ? [
        `Spot snorkeling di ${matchedWil.name}`,
        `Spot surfing di ${matchedWil.name}`,
        `Diving di ${matchedWil.name}`
      ] : [
        'Destinasi budget di bawah 100rb',
        'Pantai gratis di Bali apa saja?',
        'Snorkeling pemula budget 250rb'
      ];
      return {
        text,
        dbpediaData,
        recommendations: (typeof localHits !== 'undefined' && localHits) ? localHits : [],
        totalResults: (typeof localHits !== 'undefined' && localHits) ? localHits.length : 0,
        searchQuery: matchedWil ? matchedWil.name : 'gratis',
        suggestions
      };
    }

    // L. Tanya Berdasarkan Wilayah / Daerah
    if (matchedWil) {
      const localHits = await queryLocalApi(matchedWil.name);

      if (!dbpediaData) {
        dbpediaData = await searchDestination(matchedWil.name);
      }

      let extraDesc = '';
      if (dbpediaData && dbpediaData.abstract) {
        const shortAbs = dbpediaData.abstract.length > 250 ? dbpediaData.abstract.slice(0, 250) + '...' : dbpediaData.abstract;
        extraDesc = `_${shortAbs}_\n\n`;
      }

      const listText = localHits.slice(0, 5).map(d => `• **${d.nama}** (${d.lokasi})\n  Aktivitas: ${d.aktivitas?.slice(0, 2).join(', ')} | Biaya: ${d.rangeHargaTotalLabel}`).join('\n\n');

      text = `🗺️ **Destinasi Wisata Bahari di ${matchedWil.label || matchedWil.name}:**\n\n${extraDesc}${listText || 'Banyak destinasi eksotis tersebar di daerah ini.'}\n\nMau rekomendasi aktivitas khusus seperti snorkeling, diving, surfing, atau mencari pantai gratis di ${matchedWil.name}?`;
      suggestions = [
        `Pantai gratis di ${matchedWil.name} apa saja?`,
        `Spot snorkeling di ${matchedWil.name}`,
        `Spot surfing di ${matchedWil.name}`
      ];
      recommendations = localHits.slice(0, 4);
      return { text, dbpediaData, recommendations, suggestions };
    }

    // M. Fallback: Cari dengan API Lokal & DBpedia
    const searchHits = await queryLocalApi(normMsg || rawMsg);
    if (searchHits.length > 0) {
      text = `🔍 **Ditemukan ${searchHits.length} Destinasi Terkait "${rawMsg}":**\nBerikut destinasi bahari pilihan yang cocok untukmu:`;
      recommendations = searchHits;
      suggestions = [
        'Tingkat level diatas pemula',
        'Tingkat ahli',
        'Peralatan apa saja yang disewakan?'
      ];
      return {
        text,
        dbpediaData,
        recommendations,
        totalResults: searchHits.length,
        searchQuery: rawMsg,
        suggestions
      };
    }

    // Default Fallback
    text = `Saya mengerti kamu sedang mencari info tentang **"${rawMsg}"** 🌊\n\nKamu bisa menanyakan:\n• **Harga**: *"Pantai gratis di Bali"*, *"Wisata di bawah 100rb"*\n• **Peralatan**: *"Peralatan apa saja yang disewakan?"*, *"Sewa alat snorkeling"*\n• **Tingkat Keahlian**: *"Tingkat level diatas pemula"*, *"Tingkat ahli"*\n• **Aktivitas**: *"Aktivitas apa saja yang ada?"*, *"Surfing"*, *"Diving"*\n• **Rekomendasi**: *"Rekomendasi wisata maritim terbaik"*`;
    suggestions = [
      'Rekomendasi wisata maritim terbaik',
      'Tingkat level diatas pemula',
      'Tingkat ahli',
      'Aktivitas apa saja yang ada?'
    ];

    return { text, dbpediaData, suggestions };
  }

  return {
    query,
    searchDestination,
    askChatbot,
    LOCAL_KB
  };
})();

if (typeof window !== 'undefined') {
  window.DBpedia = DBpedia;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DBpedia;
}
