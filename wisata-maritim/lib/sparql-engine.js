const fs = require('fs');
const path = require('path');

// Triplestore & SPARQL In-Memory Engine sederhana dan cepat untuk Web Semantik Wisata Maritim
class MaritimeSparqlEngine {
  constructor(destinasiList) {
    this.destinasiList = destinasiList;
    this.triples = [];
    this.prefixes = {
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      owl: 'http://www.w3.org/2002/07/owl#',
      xsd: 'http://www.w3.org/2001/XMLSchema#',
      schema: 'https://schema.org/',
      maritim: 'http://wisatamaritim.id/ontology#',
      data: 'http://wisatamaritim.id/resource/'
    };
    this.buildTriples();
  }

  buildTriples() {
    this.triples = [];
    const add = (s, p, o, isLiteral = false, datatype = null) => {
      this.triples.push({ s, p, o, isLiteral, datatype });
    };

    // Range harga entities
    const ranges = [
      { id: 'data:Range_Under100k', label: 'Di bawah Rp100.000', min: 0, max: 100000 },
      { id: 'data:Range_100k_250k', label: 'Rp100.000 – Rp250.000', min: 100000, max: 250000 },
      { id: 'data:Range_250k_500k', label: 'Rp250.000 – Rp500.000', min: 250000, max: 500000 },
      { id: 'data:Range_500k_1M', label: 'Rp500.000 – Rp1.000.000', min: 500000, max: 1000000 },
      { id: 'data:Range_Above1M', label: 'Di atas Rp1.000.000', min: 1000000, max: 999999999 }
    ];

    ranges.forEach(r => {
      add(r.id, 'rdf:type', 'maritim:KategoriRangeHarga');
      add(r.id, 'rdfs:label', r.label, true);
      add(r.id, 'maritim:minPrice', r.min.toString(), true, 'xsd:integer');
      add(r.id, 'maritim:maxPrice', r.max.toString(), true, 'xsd:integer');
    });

    const levelMap = {
      'Pemula': 'data:Tingkat_Pemula',
      'Menengah': 'data:Tingkat_Menengah',
      'Mahir': 'data:Tingkat_Mahir',
      'Semua level': 'data:Tingkat_SemuaLevel'
    };

    const rangeMap = {
      'di-bawah-100k': 'data:Range_Under100k',
      '100k-250k': 'data:Range_100k_250k',
      '250k-500k': 'data:Range_250k_500k',
      '500k-1jt': 'data:Range_500k_1M',
      'di-atas-1jt': 'data:Range_Above1M'
    };

    this.destinasiList.forEach(d => {
      const destUri = `data:destinasi_${d.id}`;
      add(destUri, 'rdf:type', 'maritim:DestinasiWisata');
      add(destUri, 'maritim:kode', d.id, true);
      add(destUri, 'maritim:namaDestinasi', d.nama, true);
      add(destUri, 'rdfs:label', d.nama, true);
      add(destUri, 'maritim:lokasiLengkap', d.lokasi, true);
      add(destUri, 'maritim:kabKota', d.kabKota, true);
      add(destUri, 'maritim:provinsi', d.provinsi, true);
      add(destUri, 'maritim:wilayah', d.wilayah, true);
      add(destUri, 'maritim:jenisWisata', d.jenisWisata, true);
      add(destUri, 'maritim:cocokUntukTingkat', levelMap[d.level] || 'data:Tingkat_Pemula');
      add(destUri, 'maritim:tingkatKeahlian', d.level, true);
      add(destUri, 'maritim:hargaTiketMasuk', d.hargaTiketMasuk.toString(), true, 'xsd:integer');
      add(destUri, 'maritim:kategoriHargaTiket', rangeMap[d.rangeHargaTiket] || 'data:Range_Under100k');
      add(destUri, 'maritim:estimasiTotalBiaya', d.estimasiTotalPerOrang.toString(), true, 'xsd:integer');
      add(destUri, 'maritim:kategoriHargaTotal', rangeMap[d.rangeHargaTotal] || 'data:Range_Under100k');

      if (d.hargaAktivitasMulai !== null) {
        add(destUri, 'maritim:hargaAktivitasMulai', d.hargaAktivitasMulai.toString(), true, 'xsd:integer');
        if (d.rangeHargaAktivitas) {
          add(destUri, 'maritim:kategoriHargaAktivitas', rangeMap[d.rangeHargaAktivitas]);
        }
      }

      if (d.hargaPaketWisata !== null) {
        add(destUri, 'maritim:hargaPaketWisata', d.hargaPaketWisata.toString(), true, 'xsd:integer');
      }

      // Aktivitas
      d.aktivitas.forEach(act => {
        const actUri = `data:aktivitas_${act.replace(/\s+/g, '_')}`;
        add(destUri, 'maritim:memilikiAktivitas', actUri);
        add(actUri, 'rdf:type', 'maritim:Aktivitas');
        add(actUri, 'rdfs:label', act, true);
        add(destUri, 'maritim:namaAktivitas', act, true);
      });

      // Fasilitas
      d.fasilitas.forEach(f => {
        const facUri = `data:fasilitas_${f.replace(/\s+/g, '_')}`;
        add(destUri, 'maritim:memilikiFasilitas', facUri);
        add(facUri, 'rdf:type', 'maritim:Fasilitas');
        add(facUri, 'rdfs:label', f, true);
        add(destUri, 'maritim:namaFasilitas', f, true);
      });

      // Peralatan
      d.peralatan.forEach((eq, idx) => {
        const offerUri = `data:offer_${d.id}_${idx}`;
        const eqUri = `data:alat_${eq.id}`;
        add(destUri, 'maritim:memilikiPenawaranAlat', offerUri);
        add(offerUri, 'rdf:type', 'maritim:PenawaranAlat');
        add(offerUri, 'maritim:alatTerkait', eqUri);
        add(offerUri, 'maritim:namaPeralatan', eq.nama, true);
        add(offerUri, 'maritim:kategoriAktivitas', eq.kategoriAktivitas, true);
        add(offerUri, 'maritim:hargaSewa', eq.hargaSewa.toString(), true, 'xsd:integer');
        add(offerUri, 'maritim:statusSewa', eq.dapatDisewa ? 'Tersedia Disewa' : 'Termasuk Tiket', true);
        add(offerUri, 'maritim:tingkatAlat', levelMap[eq.tingkatKeahlian] || 'data:Tingkat_Pemula');

        add(eqUri, 'rdf:type', 'maritim:Peralatan');
        add(eqUri, 'rdfs:label', eq.nama, true);
      });
    });
  }

  // Eksekusi SPARQL Query (subset standard W3C SPARQL SELECT)
  query(sparqlStr) {
    const startTime = Date.now();
    try {
      // Normalisasi spasi
      const cleanQuery = sparqlStr.replace(/#.*$/gm, '').trim();

      // Deteksi query variables: SELECT ?v1 ?v2 ...
      const selectMatch = cleanQuery.match(/SELECT\s+(DISTINCT\s+)?([\?\w\s\*\(\)]+?)\s+WHERE/i);
      if (!selectMatch) {
        // Fallback pencarian fleksibel
        return this.fallbackSearch(cleanQuery, startTime);
      }

      const isDistinct = !!selectMatch[1];
      const varsRaw = selectMatch[2].trim();
      let selectVars = [];
      if (varsRaw === '*') {
        selectVars = ['destinasi', 'nama', 'provinsi', 'level', 'hargaTiket', 'totalBiaya'];
      } else {
        selectVars = varsRaw.split(/\s+/).map(v => v.replace(/^\?/, '')).filter(Boolean);
      }

      // Ambil isi block WHERE { ... }
      const whereMatch = cleanQuery.match(/WHERE\s*\{([\s\S]*)\}/i);
      if (!whereMatch) {
        throw new Error("Klausa WHERE tidak valid.");
      }

      const whereBody = whereMatch[1];

      // Ambil triples pattern di WHERE
      const lines = whereBody.split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('FILTER') && !l.startsWith('OPTIONAL'));

      // Ekstraksi filter jika ada
      const filterMatches = whereBody.match(/FILTER\s*\((.*?)\)/gi) || [];
      const filters = filterMatches.map(f => {
        const inner = f.replace(/^FILTER\s*\(/i, '').replace(/\)$/, '').trim();
        return inner;
      });

      // Filter destinasi berdasarkan triple patterns & filters
      let results = [...this.destinasiList];

      // Cek filter teks / regex di SPARQL
      filters.forEach(filter => {
        // FILTER(regex(?nama, "sabang", "i"))
        const regexMatch = filter.match(/regex\s*\(\s*\?(\w+)\s*,\s*["'](.*?)["'](?:\s*,\s*["']i["'])?\s*\)/i);
        if (regexMatch) {
          const varName = regexMatch[1];
          const pattern = new RegExp(regexMatch[2], 'i');
          results = results.filter(d => {
            if (varName === 'nama') return pattern.test(d.nama);
            if (varName === 'provinsi') return pattern.test(d.provinsi);
            if (varName === 'lokasi') return pattern.test(d.lokasi);
            if (varName === 'aktivitas') return d.aktivitas.some(a => pattern.test(a));
            if (varName === 'alat') return d.peralatan.some(e => pattern.test(e.nama));
            return true;
          });
        }

        // FILTER(?hargaTiket <= 50000) atau FILTER(?totalBiaya <= 250000)
        const numMatch = filter.match(/\?(\w+)\s*(<=|<|>=|>|==|=)\s*(\d+)/i);
        if (numMatch) {
          const varName = numMatch[1];
          const op = numMatch[2];
          const val = parseInt(numMatch[3], 10);
          results = results.filter(d => {
            let fieldVal = 0;
            if (varName === 'hargaTiket' || varName === 'hargaTiketMasuk') fieldVal = d.hargaTiketMasuk;
            else if (varName === 'totalBiaya' || varName === 'estimasiTotalBiaya') fieldVal = d.estimasiTotalPerOrang;
            else if (varName === 'hargaAktivitas') fieldVal = d.hargaAktivitasMulai || 0;
            else if (varName === 'hargaSewa') fieldVal = d.biayaAlatMin || 0;

            if (op === '<=') return fieldVal <= val;
            if (op === '<') return fieldVal < val;
            if (op === '>=') return fieldVal >= val;
            if (op === '>') return fieldVal > val;
            if (op === '=' || op === '==') return fieldVal === val;
            return true;
          });
        }

        // FILTER(?level = "Pemula")
        const eqMatch = filter.match(/\?(\w+)\s*=\s*["'](.*?)["']/i);
        if (eqMatch) {
          const varName = eqMatch[1];
          const val = eqMatch[2];
          results = results.filter(d => {
            if (varName === 'level' || varName === 'tingkatKeahlian') return d.level.toLowerCase() === val.toLowerCase();
            if (varName === 'provinsi') return d.provinsi.toLowerCase() === val.toLowerCase();
            if (varName === 'wilayah') return d.wilayah.toLowerCase() === val.toLowerCase();
            return true;
          });
        }
      });

      // Pola Where match
      if (/maritim:memilikiAktivitas\s+data:aktivitas_(\w+)/i.test(whereBody)) {
        const actMatch = whereBody.match(/maritim:memilikiAktivitas\s+data:aktivitas_(\w+)/i);
        const actName = actMatch[1].replace(/_/g, ' ');
        results = results.filter(d => d.aktivitas.some(a => a.toLowerCase().includes(actName.toLowerCase())));
      }

      if (/maritim:cocokUntukTingkat\s+data:Tingkat_(\w+)/i.test(whereBody)) {
        const lvlMatch = whereBody.match(/maritim:cocokUntukTingkat\s+data:Tingkat_(\w+)/i);
        const lvlName = lvlMatch[1];
        results = results.filter(d => d.level.toLowerCase() === lvlName.toLowerCase() || d.level === "Semua level");
      }

      if (/maritim:kategoriHargaTotal\s+data:Range_(\w+)/i.test(whereBody)) {
        const rMatch = whereBody.match(/maritim:kategoriHargaTotal\s+data:Range_(\w+)/i);
        const rKey = rMatch[1];
        results = results.filter(d => {
          if (rKey === 'Under100k') return d.rangeHargaTotal === 'di-bawah-100k';
          if (rKey === '100k_250k') return d.rangeHargaTotal === '100k-250k';
          if (rKey === '250k_500k') return d.rangeHargaTotal === '250k-500k';
          if (rKey === '500k_1M') return d.rangeHargaTotal === '500k-1jt';
          if (rKey === 'Above1M') return d.rangeHargaTotal === 'di-atas-1jt';
          return true;
        });
      }

      // Order by & Limit
      let limit = 100;
      const limitMatch = cleanQuery.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) limit = parseInt(limitMatch[1], 10);

      if (/ORDER\s+BY\s+ASC\s*\(\s*\?(\w+)\s*\)/i.test(cleanQuery)) {
        const v = cleanQuery.match(/ORDER\s+BY\s+ASC\s*\(\s*\?(\w+)\s*\)/i)[1];
        results.sort((a, b) => (a[v] || 0) - (b[v] || 0));
      } else if (/ORDER\s+BY\s+DESC\s*\(\s*\?(\w+)\s*\)/i.test(cleanQuery)) {
        const v = cleanQuery.match(/ORDER\s+BY\s+DESC\s*\(\s*\?(\w+)\s*\)/i)[1];
        results.sort((a, b) => (b[v] || 0) - (a[v] || 0));
      }

      const pagedResults = results.slice(0, limit);

      // Format output W3C SPARQL JSON
      const bindings = pagedResults.map(d => {
        const row = {};
        selectVars.forEach(v => {
          if (v === 'destinasi' || v === 'dest') {
            row[v] = { type: 'uri', value: `http://wisatamaritim.id/resource/destinasi_${d.id}` };
          } else if (v === 'kode') {
            row[v] = { type: 'literal', value: d.id };
          } else if (v === 'nama' || v === 'namaDestinasi') {
            row[v] = { type: 'literal', value: d.nama };
          } else if (v === 'provinsi') {
            row[v] = { type: 'literal', value: d.provinsi };
          } else if (v === 'lokasi') {
            row[v] = { type: 'literal', value: d.lokasi };
          } else if (v === 'wilayah') {
            row[v] = { type: 'literal', value: d.wilayah };
          } else if (v === 'level' || v === 'tingkatKeahlian') {
            row[v] = { type: 'literal', value: d.level };
          } else if (v === 'jenisWisata') {
            row[v] = { type: 'literal', value: d.jenisWisata };
          } else if (v === 'aktivitas') {
            row[v] = { type: 'literal', value: d.aktivitas.join(', ') };
          } else if (v === 'fasilitas') {
            row[v] = { type: 'literal', value: d.fasilitas.join(', ') };
          } else if (v === 'hargaTiket' || v === 'hargaTiketMasuk') {
            row[v] = { type: 'typed-literal', datatype: 'http://www.w3.org/2001/XMLSchema#integer', value: d.hargaTiketMasuk.toString() };
          } else if (v === 'hargaAktivitas') {
            row[v] = { type: 'typed-literal', datatype: 'http://www.w3.org/2001/XMLSchema#integer', value: (d.hargaAktivitasMulai || 0).toString() };
          } else if (v === 'totalBiaya' || v === 'estimasiTotal') {
            row[v] = { type: 'typed-literal', datatype: 'http://www.w3.org/2001/XMLSchema#integer', value: d.estimasiTotalPerOrang.toString() };
          } else if (v === 'rangeHarga') {
            row[v] = { type: 'literal', value: d.rangeHargaTotalLabel };
          } else if (v === 'alatTersedia') {
            row[v] = { type: 'literal', value: d.peralatan.map(e => e.nama).join('; ') };
          } else {
            row[v] = { type: 'literal', value: d[v] !== undefined ? String(d[v]) : '-' };
          }
        });
        return row;
      });

      return {
        head: { vars: selectVars },
        results: { bindings },
        meta: {
          executionTimeMs: Date.now() - startTime,
          totalTriples: this.triples.length,
          resultCount: bindings.length,
          query: sparqlStr
        }
      };
    } catch (err) {
      return {
        error: true,
        message: err.message,
        executionTimeMs: Date.now() - startTime
      };
    }
  }

  fallbackSearch(query, startTime) {
    // Sederhana jika query langsung menyebutkan kata kunci
    const qLower = query.toLowerCase();
    const matched = this.destinasiList.filter(d => 
      d.nama.toLowerCase().includes(qLower) ||
      d.lokasi.toLowerCase().includes(qLower) ||
      d.aktivitas.some(a => a.toLowerCase().includes(qLower))
    ).slice(0, 20);

    return {
      head: { vars: ['destinasi', 'nama', 'lokasi', 'level', 'hargaTiket', 'totalBiaya'] },
      results: {
        bindings: matched.map(d => ({
          destinasi: { type: 'uri', value: `http://wisatamaritim.id/resource/destinasi_${d.id}` },
          nama: { type: 'literal', value: d.nama },
          lokasi: { type: 'literal', value: d.lokasi },
          level: { type: 'literal', value: d.level },
          hargaTiket: { type: 'literal', value: d.hargaTiketMasuk.toString() },
          totalBiaya: { type: 'literal', value: d.estimasiTotalPerOrang.toString() }
        }))
      },
      meta: {
        executionTimeMs: Date.now() - startTime,
        totalTriples: this.triples.length,
        resultCount: matched.length,
        query
      }
    };
  }
}

module.exports = MaritimeSparqlEngine;
