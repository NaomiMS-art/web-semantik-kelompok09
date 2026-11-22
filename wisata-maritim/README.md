# Mesin Pencari Wisata Maritim Indonesia Berbasis Web Semantik

Website mesin pencari wisata maritim Indonesia yang dibangun menggunakan **Node.js**, **Ontologi RDF Turtle (W3C Standard)**, dan **SPARQL In-Memory Query Engine**. Proyek ini dikembangkan untuk tugas mata kuliah **Web Semantik (Kelompok 09)**.

Sistem menghubungkan informasi **harga (range harga Google-style)**, **peralatan & persewaan**, **tingkat keahlian pengguna (skill level)**, **aktivitas bahari**, **fasilitas**, serta **lokasi geografis** menggunakan prinsip Semantic Web.

---

## 🌊 Fitur Utama

### 1. Sistem Filter Harga Google-Style (5 Kategori Budget)
Setiap destinasi memuat informasi harga transparan:
- **Harga Tiket Masuk (HTM)**
- **Harga Aktivitas** (cth: fun dive, snorkeling trip, banana boat)
- **Harga Paket Wisata** (cth: island hopping, liveaboard)
- **Harga Persewaan Alat** jika tersedia
- **Range Harga Google-Style**:
  1. `< Rp100.000` (Sangat terjangkau / gratis)
  2. `Rp100.000 – Rp250.000` (Budget hemat)
  3. `Rp250.000 – Rp500.000` (Budget menengah)
  4. `Rp500.000 – Rp1.000.000` (Paket tour & dive standard)
  5. `> Rp1.000.000` (Liveaboard, carter kapal privat, diving premium)
- Filter dapat diswitch antara: **Estimasi Total per Orang**, **Tiket Masuk Saja**, atau **Biaya Aktivitas/Sewa**.

### 2. Manajemen Peralatan Bahari & Status Persewaan
Setiap destinasi mencatat peralatan spesifik sesuai aktivitasnya:
- **Snorkeling**: Masker & Snorkel, Fins (Kaki Katak), Pelampung / Life Jacket, Full Snorkel Set.
- **Diving**: Masker & Fins Diving, BCD (Buoyancy Control Device), Regulator Selam, Tabung Scuba (Oksigen), Wetsuit Selam, Paket Fun Dive Lengkap.
- **Surfing**: Papan Selancar (Soft-top pemula / Fiber mahir), Leash tali pengikat kaki, Wetsuit/Rashguard.
- **Kano & Kayak**: Perahu Kano/Kayak & Dayung, Life jacket.
- **Island Hopping**: Sewa Perahu Nelayan / Speed boat.
- Setiap alat memiliki metadata semantik: **Ketersediaan**, **Status Sewa (Tersedia Disewa / Termasuk Tiket)**, **Harga Sewa**, dan **Level Keahlian yang Dianjurkan**.

### 3. Integrasi Tingkat Keahlian Pengguna (Skill Level)
- **Pemula**: Spot perairan tenang, ramah keluarga, wajib pelampung/life jacket, instruktur pendamping.
- **Menengah**: Membutuhkan kemampuan fisik dasar, perairan berarus ringan-sedang, sertifikasi Open Water untuk diving.
- **Mahir**: Ombak besar untuk peselancar profesional, deep dive / wall dive dengan sertifikasi Advanced, alat teknis BCD/Regulator.

### 4. Semantic Query Reasoning (Pencarian Bahasa Alami)
Memahami kebutuhan pengguna dalam kalimat bebas, contoh:
> *"tempat snorkeling untuk pemula dengan budget maksimal Rp250.000 dan menyediakan alat snorkeling"*

Sistem secara otomatis mengurai dan menelusuri rantai inferensi ontologi:
$$\text{Aktivitas (Snorkeling)} \longrightarrow \text{Tingkat (Pemula)} \longrightarrow \text{Budget} \le \text{250rb} \longrightarrow \text{Alat (Masker/Snorkel Disewa)} \longrightarrow \text{Destinasi}$$

Serta membangkitkan query **W3C SPARQL** otomatis yang dapat langsung diinspeksi.

### 5. Faceted Filter Terintegrasi 6 Dimensi
Pengguna dapat mengombinasikan filter secara bersamaan:
$$\text{Jenis Wisata} + \text{Aktivitas} + \text{Tingkat Keahlian} + \text{Range Harga} + \text{Peralatan} + \text{Fasilitas}$$

### 6. Interactive Knowledge Graph & RDF Explorer
- Visualisasi simpul interaktif menggunakan Canvas (bisa di-drag, di-hover, dan di-zoom).
- Viewer RDF Triples format **Turtle (`.ttl`)** dan endpoint SPARQL standar W3C.
- Kalkulator estimasi budget rombongan interaktif.

### 7. Konsol SPARQL & Competency Questions
Halaman playground query SPARQL dengan preset competency questions perkuliahan.

---

## 🛠️ Arsitektur Proyek (Node.js)

```
wisata-maritim/
├── data/
│   ├── destinasi.json       # Basis data 200 destinasi maritim terstruktur
│   └── maritim.ttl          # Ontologi W3C RDF Turtle (Classes, Properties, Triples)
├── lib/
│   ├── semantic-search.js   # NLP query parser, inferensi semantik & faceted search
│   └── sparql-engine.js     # W3C In-memory SPARQL triplestore execution engine
├── public/                  # Frontend Web App Modern
│   ├── css/
│   │   └── style.css        # Desain responsif, Google-style pills, Knowledge Graph UI
│   ├── js/
│   │   └── app.js           # Client controller, Knowledge Graph Canvas, kalkulator
│   └── index.html           # Single Page Application
├── scripts/
│   ├── build-data.js        # Script generator JSON & Ontologi RDF maritim.ttl
│   ├── test-search.js       # Unit test semantic search & query parsing
│   └── test-server.js       # Integration test REST API & SPARQL
├── package.json             # Dependensi Node.js (express, cors)
├── server.js                # Server Node.js & REST/SPARQL API Endpoints
└── README.md                # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan Aplikasi

### Persyaratan
- **Node.js** (v18 atau lebih baru)
- **NPM**

### Langkah Menjalankan
1. Buka terminal pada folder proyek:
   ```bash
   cd "c:\SEMESTER 3\Web Semantik\web-semantik-kelompok09\wisata-maritim"
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Jalankan server:
   ```bash
   npm start
   ```

4. Buka browser pada alamat:
   ```
   http://localhost:3000
   ```

---

## 🌐 Endpoint API

| Metode | Endpoint | Keterangan |
| :--- | :--- | :--- |
| `GET` | `/api/search` | Pencarian semantik & Faceted filter terpadu |
| `POST` / `GET` | `/api/sparql` | W3C SPARQL Endpoint (query runner) |
| `GET` | `/api/destinasi/:id` | Detail destinasi, rekomendasi serupa & node Knowledge Graph |
| `GET` | `/api/facets` | Rekapitulasi count seluruh opsi filter |
| `GET` | `/api/ontology` | Unduh file ontologi RDF Turtle (`maritim.ttl`) |
| `GET` | `/api/stats` | Statistik total destinasi dan triple ontologi |

---

## 📝 Contoh Query SPARQL (Competency Questions)

```sparql
PREFIX maritim: <http://wisatamaritim.id/ontology#>
PREFIX data: <http://wisatamaritim.id/resource/>

SELECT DISTINCT ?nama ?provinsi ?level ?hargaTiket ?totalBiaya
WHERE {
  ?dest a maritim:DestinasiWisata ;
        maritim:namaDestinasi ?nama ;
        maritim:provinsi ?provinsi ;
        maritim:tingkatKeahlian ?level ;
        maritim:hargaTiketMasuk ?hargaTiket ;
        maritim:estimasiTotalBiaya ?totalBiaya ;
        maritim:memilikiAktivitas data:aktivitas_Snorkeling ;
        maritim:cocokUntukTingkat data:Tingkat_Pemula ;
        maritim:memilikiPenawaranAlat ?penawaran .
  ?penawaran maritim:alatTerkait data:alat_masker-snorkel ;
             maritim:statusSewa "Tersedia Disewa" .
  FILTER(?totalBiaya <= 250000)
}
ORDER BY ASC(?totalBiaya)
LIMIT 15
```

---
**Kelompok 09 - Mata Kuliah Web Semantik**
Universitas Sumatera Utara (USU)
