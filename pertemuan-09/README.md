# Pertemuan 9 - SPARQL Dasar: Tell & Ask dan Endpoint

## Langkah 1 - Tabel binding
| Tahap | ?dosen | ?mk | ?namaMK |
|-------|--------|-----|---------|
| Pola 1, baris 1 | Budi | tif2305 | – |
| Pola 1, baris lain | Sari | tif2410 | – |
| Pola 1, baris lain | Sari | tif2305 | – |
| Pola 2 | – | tif2305 | "Web Semantik" |
| Pola 2 | – | tif2410 | "Penambangan Data" |
| Hasil akhir (gabung ?mk) | Budi | tif2305 | "Web Semantik" |
| Hasil akhir (gabung ?mk) | Sari | tif2410 | "Penambangan Data" |
| Hasil akhir (gabung ?mk) | Sari | tif2305 | "Web Semantik" |
- Jumlah baris hasil akhir: 3
- Peran ?mk: variabel penghubung antara pola 1 dan pola 2. Variabel yang sama di dua pola berarti harus node yang sama, sehingga hanya binding dengan ?mk identik yang digabung. ?mk tidak tampil karena tidak ada di klausa SELECT (dibuang saat proyeksi), tetapi tanpa ?mk setiap dosen akan dipasangkan dengan semua nama mata kuliah (hasil kali silang).

## Langkah 2 - ASK dan dunia terbuka
1. `ASK { ex:budi ex:mengajar ex:tif2410 }` menghasilkan **false**. Menurut asumsi dunia terbuka, false hanya berarti triple itu tidak ada di graf yang diperiksa. Itu tidak berarti Budi pasti tidak mengajar tif2410, karena fakta tersebut mungkin belum tercatat atau ada di sumber lain. Tafsir yang tepat adalah "tidak terbukti benar dari data ini", bukan "terbukti salah".
2. Hasilnya **5 baris**: untuk tif2305 ada (budi, budi), (budi, sari), (sari, budi), (sari, sari), dan untuk tif2410 ada (sari, sari). Baris dengan ?a sama dengan ?b muncul karena SPARQL tidak mewajibkan dua variabel berbeda berisi node yang berbeda. Satu triple yang sama boleh cocok dengan pola ?a dan pola ?b sekaligus. Untuk membuangnya, tambahkan `FILTER(?a != ?b)`, sehingga tersisa 2 baris: (budi, sari) dan (sari, budi).
3. Di data, `"Web Semantik"` adalah literal biasa tanpa tag bahasa, sedangkan `"Web Semantik"@id` adalah literal bertag bahasa. Dalam RDF keduanya dianggap nilai yang berbeda, dan pencocokan literal pada pola dasar menuntut kesamaan persis, termasuk tag bahasanya. Karena itu pola `?mk ex:nama "Web Semantik"` menghasilkan nol baris pada graf yang menulis `"Web Semantik"@id`. Solusinya adalah menulis pola sebagai `"Web Semantik"@id`, atau memakai `FILTER(STR(?nama) = "Web Semantik")` agar tag bahasa diabaikan.

## Langkah 3 - Query lokal
- IRI dasar graf: https://contoh.github.io/web-semantik/251402001/kampus#
- Jumlah triple awal / akhir: 39 / 41
- Fakta yang ditambahkan: ex:ida ex:mengajar ex:kecerdasan_buatan, dan ex:kecerdasan_buatan foaf:name "Kecerdasan_Buatan"@id

## Langkah 4 - Wikidata
- Jumlah baris Q1 dengan wdt:P31: [isi]
- Jumlah baris Q1 dengan wdt:P31/wdt:P279*: [isi]
- Penjelasan perbedaan: [isi]

## Langkah 5 - Endpoint dari Python
- agent=UA: [isi]
- setReturnFormat(JSON): [isi]
- b.get("kotaLabel", {}): [isi]

## Refleksi
1. Di titik mana SPARQL berbeda dari SQL?
SPARQL dan SQL sebenarnya terlihat mirip dipermukaan, tetapi memiliki banyak perbedaan mendasar di berbagai aspek, yaitu:
- *Model dan Identitas*: SQL menyimpan data dalam bentuk tabel, baris, dan kolom dengan primary key lokal, sedangkan SPARQL menggunakan graf triple dengan pengenal IRI global.
- *Skema*: SQL mewajibkan penentuan skema di awal, sementara pada SPARQL pembentukan skema bersifat opsional.
- *Penggabungan (Join)*: SQL memerlukan perintah JOIN ... ON secara eksplisit, sedangkan SPARQL melakukan penggabungan secara implisit menggunakan variabel bersama.
- *Ketiadaan Data*: SQL menggunakan asumsi dunia tertutup dengan nilai referensi NULL, sedangkan SPARQL menganut asumsi dunia terbuka di mana ketiadaan data berarti triple tersebut sekadar tidak ada atau tidak tercatat.
- *Lintas Sumber*: Penggabungan data dari sumber berbeda di SQL membutuhkan proses ETL terlebih dahulu, sedangkan SPARQL bisa langsung melakukan kueri terfederasi dengan fungsi SERVICE.
- *Bentuk Hasil*: Keluaran SQL selalu berbentuk tabel, sementara hasil SPARQL bisa berupa tabel, nilai boolean, maupun graf.

2. Kapan Anda memakai graf lokal (rdflib) dan kapan endpoint publik?

**Graf lokal (rdflib)** saya pakai ketika:
- Data adalah milik sendiri dan ukurannya kecil, misalnya `kampus_usu_v2.ttl`, sehingga bisa dimuat penuh ke memori.
- Saya perlu mengubah data, misalnya menambah triple baru lalu mengecek hasilnya (seperti penambahan `ex:ida ex:mengajar ex:kecerdasan_buatan`).
- Hasilnya harus stabil dan bisa diulang. Data tidak berubah di luar kendali saya, jadi hasil query sama setiap kali dijalankan.
- Saya bekerja offline, atau data bersifat privat dan tidak boleh dikirim ke server luar.
- Saya sedang belajar atau menguji query. Prosesnya cepat dan tidak ada batas permintaan (rate limit).

**Endpoint publik (Wikidata)** saya pakai ketika:
- Data yang dibutuhkan sangat besar dan berasal dari banyak pihak, seperti daftar universitas atau sungai di seluruh dunia, yang tidak mungkin saya unduh dan simpan sendiri.
- Saya butuh data terkini, karena endpoint selalu diperbarui oleh kontributornya.
- Saya ingin memanfaatkan pengetahuan lintas domain yang sudah saling terhubung lewat IRI global, termasuk hierarki kelas (misalnya `wdt:P31/wdt:P279*`).

**Trade-off:** graf lokal memberi kontrol penuh dan hasil yang dapat direproduksi, tetapi cakupannya terbatas pada data yang saya muat. Endpoint publik memberi cakupan luas dan data mutakhir, tetapi bergantung pada koneksi internet, tunduk pada batas waktu dan batas permintaan, serta hasilnya bisa berubah antar waktu karena datanya terus diedit. Karena itu pada tugas ini graf lokal dipakai untuk latihan dasar dan modifikasi data, sedangkan endpoint dipakai untuk menjawab pertanyaan yang membutuhkan data dunia nyata.

3. Sebutkan satu hasil query yang mengejutkan dan jelaskan penyebabnya.
