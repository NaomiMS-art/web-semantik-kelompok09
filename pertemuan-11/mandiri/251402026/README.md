# Pertemuan 11 - Tugas Mandiri: Dari Endpoint ke Graf Lokal

## Bagian A - LIMIT dan triple
- Triple dengan LIMIT 10: 30 Triple
- Triple dengan LIMIT 30: 90 Triple
- Baris SELECT LIMIT 10 / kota berbeda: 10 baris / 10 kota berbeda
- Mengapa tidak (atau mengapa tepat) 30 triple: Template CONSTRUCT punya 3 pola (a ex:Kota, rdfs:label, ex:populasi), sehingga satu solution mencetak maksimal 3 triple. LIMIT membatasi jumlah solution, bukan jumlah triple, jadi batas atasnya 10 x 3 = 30.
- Batas itu tercapai karena ke-10 solution berasal dari kota yang berbeda (terlihat pada tabel SELECT: tiap baris punya ?kota yang berbeda, misalnya Jakarta, Kupang, Pekalongan, Palu, Sangatta, Tual, Soreang, Cikarang Pusat),
  sehingga tidak ada triple kembar yang digabung. Hal yang sama terjadi pada LIMIT 30, yang menghasilkan 30 x 3 = 90 triple. Pada run saya tidak ada selisih, jadi tidak ada kota penyebab selisih yang perlu ditunjukkan.
  Seandainya satu kota punya dua nilai populasi (wdt:P1082), kota itu muncul di dua solution. Pola a ex:Kota dan rdfs:label untuk kota itu akan tercetak kembar dan digabung menjadi satu triple, sehingga total kurang dari 30.
  Hanya pola ex:populasi yang tetap berbeda karena nilainya berbeda. Angka ini bisa berbeda dari teman karena Wikidata terus disunting dan hasil tanpa ORDER BY urutannya tidak dijamin.

## Bagian B - DBpedia ke Turtle
- Output demo_c.py: 48 triple, film tanpa tanggal: 16
- Sumber data: DBpedia
- Triple yang tetap tercetak untuk film tanpa tanggal: Untuk film tanpa dbo:releaseDate, variabel ?rilis tidak terikat karena OPTIONAL tidak menemukan apa-apa. Pola schema:datePublished ?rilis dilewati diam-diam sedangkan tiga pola lain (a schema:Movie, schema:name, schema:director)
  tetap tercetak karena variabelnya terikat. Tidak ada pesan error karena di SPARQL variabel tak terikat pada template CONSTRUCT bukan kesalahan, triple itu hanya tidak dibuat. Buktinya pada run saya: 16 film x 3 triple = 48 triple, sama dengan total output, jadi tidak ada satu pun
  datePublished yang tercetak.
- Query lokal tanpa internet: Query Q_TANPA_TANGGAL dijalankan pada film_nolan.ttl dengan internet mati dan tetap berhasil, hasilnya 16, sama dengan saat online. Query itu hanya membaca berkas Turtle yang sudah tersimpan di laptop lewat rdflib,
  tanpa menghubungi DBpedia. Sebaliknya, saat seluruh demo_c.py dijalankan ulang tanpa internet, program berhenti di baris 15 (queryAndConvert) dengan error URLError getaddrinfo failed, karena baris itu mengirim query ke
  DBpedia. Akibatnya tahap berikutnya (menyimpan film_nolan.ttl dan menjalankan query lokal) tidak sempat dijalankan.
- Mengapa dbo:Film memberi 0 pada film_nolan.ttl: Template CONSTRUCT menerjemahkan tipe dbo:Film dari DBpedia menjadi schema:Movie, jadi film_nolan.ttl hanya berisi triple bertipe schema:Movie. Query yang mencari dbo:Film tidak menemukan satu pun triple yang cocok, sehingga
  hasilnya 0 tanpa error.

## Bagian C - Materialisasi
- Output demo_d.py: Sebelum: 0, Sesudah: 3, Ada Rina: 3
- Mengapa Ada Rina bernilai 3: Materialisasi hanya mencetak triple turunan (x a foaf:Person) untuk data yang ada saat aturan dijalankan. Rina ditambahkan sesudah aturan itu, sehingga hanya punya
  ex:rina a ex:DosenTetap, tanpa triple a foaf:Person. Query tidak menelusuri subClassOf sendiri (SELECT biasa tanpa jalur), jadi Rina tidak terhitung, dan hasilnya tetap 3 walau Rina adalah ex:DosenTetap
  dan ex:DosenTetap turunan foaf:Person. Aturan harus dijalankan ulang agar Rina ikut terhitung.
- Output materialisasi_ulang.py: [isi]
- Tiga triple yang bukan baru: [jawaban]
- Kegunaan kampus_turunan.ttl dan langkah manual yang tersisa: [jawaban]

## Bagian D - Diagnosis
| Query | Hasil mesin | Gejala | Penyebab (baris yang salah) | Hasil setelah diperbaiki |
|-------|-------------|--------|-----------------------------|--------------------------|
| rusak_a | [isi] | [isi] | [isi] | [isi] |
| rusak_b | [isi] | [isi] | [isi] | [isi] |
| rusak_c | [isi] | [isi] | [isi] | [isi] |

## Bagian E - Etika dan diskusi
| Aturan | a_kota_limit.rq | demo_c.py |
|--------|-----------------|-----------|
| 1 User-Agent | [isi] | [isi] |
| 2 LIMIT | [isi] | [isi] |
| 3 Simpan, jangan ulangi | [isi] | [isi] |
| 4 Jangkar jalur | [isi] | [isi] |
- Versi yang melanggar aturan 4 (tidak dijalankan) dan alasannya: [isi]

### Diskusi 1 - Taksonomi berubah
[150-250 kata]

### Diskusi 2 - SELECT atau CONSTRUCT
[150-250 kata]

### Cek diri
| Pernyataan | Bukti dari tugas ini |
|------------|----------------------|
| 1 | [isi] |
| 2 | [isi] |
| 3 | [isi] |
| 4 | [isi] |
| 5 | [isi] |
