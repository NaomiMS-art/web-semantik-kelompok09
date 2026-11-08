# Pertemuan 11 - KONSTRUKSI dan Hierarki Data

## Langkah 1 - Solusi menjadi triple

| Solusi | ?d | ?mk | Tiga yang dicetak |
|--------|----|-----|-------------------|
| 1 | budi | tif2108 | `ex:tif2108 a ex:MatakuliahAktif`<br>`ex:tif2108 ex:diampuOleh ex:budi` |
| 2 | sari | tif2108 | `ex:tif2108 a ex:MatakuliahAktif`<br>`ex:tif2108 ex:diampuOleh ex:sari` |
| 3 | ida | tif2104 | `ex:tif2104 a ex:MatakuliahAktif`<br>`ex:tif2104 ex:diampuOleh ex:ida` |

- Jumlah solusi: **3**
- Jumlah cetakan tiga kali lipat: **6 triple** (3 solusi × 2 pola template).
- Jumlah tiga kali lipat dari hasil grafik: **5 triple unik**.
- Triple yang tercetak lebih dari sekali: **`ex:tif2108 a ex:MatakuliahAktif`**, karena muncul pada solusi 1 dan solusi 2. Di dalam graf hasil, triple identik tersebut hanya disimpan satu kali.

## Langkah 2 - Tebak lalu cek

| Garam | Tebakan | Hasil mesin | Penjelasan bila meleset |
|------|---------|-------------|-------------------------|
| A | [isi] | [isi] | [isi] |
| B | [isi] | [isi] | [isi] |
| C | [isi] | [isi] | [isi] |

## Langkah 3 - Graf kampus lokal

- Berkas sumber dan IRI dasar grafik: [isi]
- Nama kelas dosen dan properti: [isi]
- Tiga kali lipat hasil pemetaan: [isi]
- `foaf:Organization` sebelum / sesudah: [isi] / [isi]
- Triple asli vs triple turunan: [jawaban]
- Dosen baru setelah program selesai: [isi]

## Langkah 4 - Wikidata

- Jumlah triple Q6: [isi]
- Jumlah baris Q6 versi PILIH: [isi]
- Penjelasan perbedaan: [isi]
- Q7 dengan `+` vs `*`: [isi]
- Kelas yang mengejutkan dan mengejutkan: [isi]

## Langkah 5 - Graf dari Python
- Jumlah triple universitas.ttl: 1101
- Jumlah baris universitas_per_kota.csv: 116
  
- setReturnFormat(TURTLE): Memberi tahu SPARQLWrapper bahwa hasil query CONSTRUCT diminta dalam format RDF Turtle, bukan JSON. CONSTRUCT menghasilkan graf (kumpulan triple), bukan tabel, sehingga formatnya harus format RDF. Bersama setOnlyConneg(True), format ini diminta lewat header Accept saja.
  
- Graph().parse(data=...): Membuat graf rdflib kosong di memori lalu mengisinya dengan teks Turtle yang dikembalikan endpoint (data= berarti sumbernya string, bukan file atau URL). Setelah itu data Wikidata menjadi graf lokal yang bisa di-query dengan g.query(...) dan disimpan ke universitas.ttl.
  
- Mengapa q_kota tidak memanggil endpoint?
Karena Query ini dijalankan lewat g.query(q_kota) pada graf lokal di memori (hasil dari universitas.ttl), bukan lewat SPARQLWrapper. Endpoint Wikidata hanya dipanggil satu kali, sehingga lebih hemat beban server publik, lebih cepat, dan bisa diulang tanpa terkena batas permintaan.

## Refleksi

1. **Mengapa jumlah triple hasil CONSTRUCT bisa lebih kecil dari jumlah baris SELECT dengan WHERE yang sama?**

   Karena `SELECT` menghasilkan baris untuk setiap solusi atau kombinasi variabel yang cocok dengan pola `WHERE`. Jika dua solusi menghasilkan triple yang sama dari template `CONSTRUCT`, graf RDF hanya menyimpan satu salinan triple tersebut. Jadi, jumlah baris `SELECT` atau jumlah triple yang dicetak dari semua solusi bisa lebih banyak daripada jumlah triple unik pada graf hasil `CONSTRUCT`.

2. Bila taksonomi di grafik kampus Anda berubah bulan depan, apa yang terjadi pada triple turunan di `kampus_usu_v4.ttl`?

   [isi]

3. **Kapan Anda menyimpan hasil query sebagai tabel (CSV), dan kapan sebagai graf (Turtle)?**

   Saya menyimpan hasil sebagai tabel (CSV) ketika hasilnya berupa angka atau daftar ringkas yang akan dibaca manusia atau diolah di spreadsheet/pandas, misalnya jumlah universitas per kota dari query SELECT dengan COUNT dan GROUP BY. Formatnya datar (baris dan kolom), mudah dibuka, dan cocok untuk laporan, grafik, atau statistik, tetapi hubungan antar-entitas dan URI-nya hilang.

   Saya menyimpan hasil sebagai graf (Turtle) ketika hasilnya berupa data itu sendiri yang akan dipakai ulang: query CONSTRUCT yang menghasilkan triple lengkap dengan URI, label, dan relasi (misalnya universitas.ttl). Format ini mempertahankan struktur graf, bisa dimuat kembali ke rdflib, di-query berulang dengan SPARQL, digabung dengan graf lain, atau dipublikasikan sebagai Linked Data.

   Dalam program ini, keduanya dipakai berurutan: data mentah dari Wikidata disimpan sebagai graf (universitas.ttl) agar bisa di-query ulang tanpa mengakses endpoint, lalu hasil agregasinya disimpan sebagai tabel (universitas_per_kota.csv) untuk dibaca dan dilaporkan.
