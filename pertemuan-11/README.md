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

| Soal | Tebakan | Hasil mesin | Penjelasan bila meleset |
|------|---------|-------------|-------------------------|
| A    | 3 baris | 3 baris | Tebakan tepat |
| B    | 3 baris | 4 baris | Sari muncul dua kali karena ia memiliki dua tipe (`ex:DosenTetap` dan `ex:DosenTamu`) yang keduanya merupakan jalur valid ke `ex:Pegawai`. `SELECT` tidak meleburkan baris ganda. |
| C    | 4 triple | 3 triple | Walaupun klausa `WHERE` menghasilkan 4 solusi (Sari ganda), keluaran `CONSTRUCT` adalah graf RDF. Graf secara otomatis meleburkan (deduplikasi) triple yang persis sama, sehingga Sari hanya dicetak sekali. |
| D    | Error | 0 triple | Program tidak error sama sekali. Pada `CONSTRUCT`, jika variabel di dalam template kosong (seperti `?n` milik Rudi), pembentukan triple tersebut dibatalkan secara otomatis tanpa melempar pesan error, sehingga hasilnya graf kosong (0). |

## Langkah 3 - Graf kampus lokal

- Berkas sumber dan IRI dasar grafik: `kampus_usu_v2.ttl`, dengan IRI `https://contoh.github.io/web-semantik/251402107/kampus#`.
- Nama kelas dosen dan properti: `ex:Lecturer` dan `foaf:name`.
- Tiga kali lipat hasil pemetaan: **6 triple** (3 dosen dengan masing-masing 2 triple, yaitu `schema:Person` dan `schema:name`).
- `foaf:Person` sebelum / sesudah: **0 / 3**.
- Triple asli vs triple turunan: Triple asli berasal dari data dosen yang sudah tersedia dalam `kampus_usu_v2.ttl`. Triple turunan diperoleh setelah menambahkan hierarki `ex:Lecturer` sebagai subclass dari `ex:Pegawai`, kemudian `ex:Pegawai` sebagai subclass dari `foaf:Person`. Proses materialisasi menghasilkan 6 triple baru.
- Dosen baru setelah program selesai: Dosen yang ditambahkan setelah program selesai tidak langsung memperoleh hasil pemetaan dan materialisasi. Program perlu dijalankan kembali agar data dosen terbaru ikut diproses dan menghasilkan triple berdasarkan hierarki kelas yang sudah dibuat.

## Langkah 4 - Wikidata

- Jumlah triple Q6: 112
- Jumlah baris Q6 versi SELECT: 50
- Penjelasan perbedaan: Jika tiap baris menghasilkan 3 triple, totalnya 3 × 50 = 150, tetapi hasil CONSTRUCT hanya 112. Penyebabnya, satu universitas bisa memiliki lebih dari satu nilai P131 (contoh: Politeknik Negeri Padang, wd:Q4027436, muncul di dua baris dengan kota berbeda). Hasil CONSTRUCT berupa himpunan triple, sehingga triple `a ex:Universitas` dan `ex:nama` yang identik hanya dihitung sekali. Hanya `ex:lokasi`yang berbeda per baris, sehingga total triple lebih sedikit dari 150.
- Q7 dengan `+` vs `*`: Keduanya menampilkan 30 hasil karena dibatasi LIMIT 30, tetapi isinya berbeda. `+` berarti satu atau lebih langkah subclass of, sehingga
 hanya subkelas sejati yang muncul. `*` berarti nol atau lebih langkah, sehingga Q3918 (universitas) itu sendiri ikut menjadi hasil. Tanpa LIMIT, `*` memiliki tepat satu hasil lebih banyak daripada `+`.
- Kelas yang mengejutkan: Jezuit seminary (wd:Q129844515). Seminari adalah lembaga pendidikan calon imam, bukan universitas dalam arti sehari-hari. Namun di Wikidata ia tetap muncul sebagai hasil `wdt:P279*` terhadap Q3918, artinya ada rantai `subclass of` yang menghubungkannya ke universitas. Karena P279 bersifat transitif, query dengan `*` (dan `+`) menelusuri seluruh rantai itu, jadi kelas yang hanya terhubung lewat beberapa tingkat perantara pun ikut tertangkap.

## Langkah 5 - Graf dari Python

- Jumlah triple universitas.ttl: 1115 (based on Wikidata)
- Jumlah baris universitas_per_kota.csv: 136 (based on CSV)
  
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
