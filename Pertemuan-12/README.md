# Pertemuan 12 - Inferensi dan Reasoning

## Langkah 1 - Closure dengan tangan

| # | Triple turunan | Aturan | Premis |
|---|----------------|--------|--------|
| 1 | `ex:budi a ex:Dosen` | rdfs2 | domain `ex:membimbing` + `ex:budi ex:membimbing ex:andi` |
| 2 | `ex:andi a ex:Mahasiswa` | rdfs3 | range `ex:membimbing` + `ex:budi ex:membimbing ex:andi` |
| 3 | `ex:budi ex:mengenal ex:andi` | rdfs7 | `ex:membimbing rdfs:subPropertyOf ex:mengenal` + `ex:budi ex:membimbing ex:andi` |
| 4 | `ex:sari a ex:Dosen` | rdfs9 | `ex:DosenTamu rdfs:subClassOf ex:Dosen` + `ex:sari a ex:DosenTamu` |
| 5 | `ex:DosenTamu rdfs:subClassOf ex:Pegawai` | rdfs11 | `ex:DosenTamu rdfs:subClassOf ex:Dosen` + `ex:Dosen rdfs:subClassOf ex:Pegawai` |
| 6 | `ex:Dosen rdfs:subClassOf ex:Orang` | rdfs11 | `ex:Dosen rdfs:subClassOf ex:Pegawai` + `ex:Pegawai rdfs:subClassOf ex:Orang` |
| 7 | `ex:budi a ex:Pegawai` | rdfs9 | `ex:Dosen rdfs:subClassOf ex:Pegawai` + `ex:budi a ex:Dosen` (#1) |
| 8 | `ex:sari a ex:Pegawai` | rdfs9 | `ex:Dosen rdfs:subClassOf ex:Pegawai` + `ex:sari a ex:Dosen` (#4) |
| 9 | `ex:andi a ex:Orang` | rdfs9 | `ex:Mahasiswa rdfs:subClassOf ex:Orang` + `ex:andi a ex:Mahasiswa` (#2) |
| 10 | `ex:DosenTamu rdfs:subClassOf ex:Orang` | rdfs11 | `ex:DosenTamu rdfs:subClassOf ex:Pegawai` (#5) + `ex:Pegawai rdfs:subClassOf ex:Orang` |
| 11 | `ex:budi a ex:Orang` | rdfs9 | `ex:Dosen rdfs:subClassOf ex:Orang` (#6) + `ex:budi a ex:Dosen` (#1) |
| 12 | `ex:sari a ex:Orang` | rdfs9 | `ex:Dosen rdfs:subClassOf ex:Orang` (#6) + `ex:sari a ex:Dosen` (#4) |

- Jumlah triple turunan bermakna: **12** (6 di putaran 1, 6 di putaran 2). Triple umum seperti `x a rdfs:Resource` dan `p a rdf:Property` serta triple refleksif tidak dihitung.
- Triple yang baru ditemukan di putaran kedua: **7 sampai 12** (`ex:budi a ex:Pegawai`, `ex:sari a ex:Pegawai`, `ex:andi a ex:Orang`, `ex:DosenTamu rdfs:subClassOf ex:Orang`, `ex:budi a ex:Orang`, `ex:sari a ex:Orang`), karena masing-masing membutuhkan minimal satu premis hasil putaran 1.
- Triple asserted yang tidak menurunkan apa pun, dan alasannya: `ex:andi a ex:MahasiswaBerprestasi`. Kelas `ex:MahasiswaBerprestasi` tidak punya `rdfs:subClassOf`, `rdfs:domain`, maupun `rdfs:range` di data, sehingga tidak ada aturan RDFS yang cocok dengan triple ini. Hubungan `ex:MahasiswaBerprestasi rdfs:subClassOf ex:Mahasiswa` tidak ada, dan RDFS tidak menyimpulkan keanggotaan ke arah sebaliknya.

## Langkah 2 - Tebak lalu cek
| Soal | Profil | Tebakan | Hasil mesin | Penjelasan bila meleset |
|------|--------|---------|-------------|-------------------------|
| A | RDFS | [isi] | [isi] | [isi] |
| B | OWL RL | [isi] | [isi] | [isi] |
| C | RDFS | [isi] | [isi] | [isi] |
| C | OWL RL | [isi] | [isi] | [isi] |
| D | OWL RL | [isi] | [isi] | [isi] |

## Langkah 3 - Reasoner pada graf kampus
- Berkas sumber dan IRI dasar graf: [isi]
- Asserted / closure / inferred / bermakna: [isi] / [isi] / [isi] / [isi]
- Triple di v4 yang tidak ada di asserted: [isi]
- Turunan yang muncul karena domain dan range ex:mengajar: [jawaban]
- Bila menambah dosen baru: [jawaban]

## Langkah 4 - Wikidata
- ?n Q8 / Q9: [isi] / [isi]
- Penyebab selisih: [isi]
- Satu subkelas yang menyumbang selisih: [isi]
- WDQS: materialisasi, saat query, atau tidak keduanya: [jawaban]

## Langkah 5 - Konsistensi
- Pesan galat RDFS / OWL RL: [isi] / [isi]
- Individu yang disebut pesan: [isi]
- Setelah baris terbalik dihapus: [isi]
- Isi laporan_kelas.csv sebelum dan sesudah: [isi]
- Dari mana dosen menjadi mata kuliah: [jawaban]

## Refleksi
1. Mengapa graf asserted disimpan terpisah dari graf inferred, dan apa akibatnya bila keduanya dicampur seperti kampus_usu_v4.ttl?
2. Pada Langkah 2, profil RDFS tidak memberi tahu bahwa aksioma OWL diabaikan. Bagaimana Anda akan memastikan profil yang dipakai sudah tepat untuk data Anda?
3. Kapan Anda memilih menulis jalur seperti wdt:P279* di query, dan kapan memilih menjalankan reasoner lalu menyimpan closure?