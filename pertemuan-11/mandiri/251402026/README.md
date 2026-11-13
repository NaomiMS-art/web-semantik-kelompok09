# Pertemuan 11 - Tugas Mandiri: Dari Endpoint ke Graf Lokal

## Bagian A - LIMIT dan triple
- Triple dengan LIMIT 10: 30 Triple
- Triple dengan LIMIT 30: 90 Triple
- Baris SELECT LIMIT 10 / kota berbeda: 10 baris / 10 kota berbeda
- Mengapa tidak (atau mengapa tepat) 30 triple: Template CONSTRUCT punya 3 pola (a ex:Kota, rdfs:label, ex:populasi), sehingga satu solution mencetak maksimal 3 triple. LIMIT membatasi jumlah solution, bukan jumlah triple, jadi batas atasnya 10 x 3 = 30.
- Batas itu tercapai karena ke-10 solution berasal dari kota yang berbeda       (terlihat pada tabel SELECT: tiap baris punya ?kota yang berbeda, misalnya  Jakarta, Kupang, Pekalongan, Palu, Sangatta, Tual, Soreang, Cikarang Pusat),
sehingga tidak ada triple kembar yang digabung. Hal yang sama terjadi pada LIMIT 30, yang menghasilkan 30 x 3 = 90 triple. Pada run saya tidak ada selisih, jadi tidak ada kota penyebab selisih yang perlu ditunjukkan.
Seandainya satu kota punya dua nilai populasi (wdt:P1082), kota itu muncul di dua solution. Pola a ex:Kota dan rdfs:label untuk kota itu akan tercetak kembar dan digabung menjadi satu triple, sehingga total kurang dari 30.
Hanya pola ex:populasi yang tetap berbeda karena nilainya berbeda. Angka ini bisa berbeda dari teman karena Wikidata terus disunting dan hasil tanpa ORDER BY urutannya tidak dijamin.

## Bagian B - DBpedia ke Turtle
- Output demo_c.py: 48 triple, film tanpa tanggal: 16
- Sumber data: DBpedia
- Triple yang tetap tercetak untuk film tanpa tanggal: Untuk film tanpa dbo:releaseDate, variabel ?rilis tidak terikat karena OPTIONAL tidak menemukan apa-apa. Pola schema:datePublished ?rilis dilewati diam-diam sedangkan tiga pola lain (a schema:Movie, schema:name, schema:director) tetap tercetak karena variabelnya terikat. Tidak ada pesan error karena di SPARQL variabel tak terikat pada template CONSTRUCT bukan kesalahan, triple itu hanya tidak dibuat. Buktinya pada run saya: 16 film x 3 triple = 48 triple, sama dengan total output, jadi tidak ada satu pun datePublished yang tercetak.
- Query lokal tanpa internet: Query Q_TANPA_TANGGAL dijalankan pada film_nolan.ttl dengan internet mati dan tetap berhasil, hasilnya 16, sama dengan saat online. Query itu hanya membaca berkas Turtle yang sudah tersimpan di laptop lewat rdflib, tanpa menghubungi DBpedia. Sebaliknya, saat seluruh demo_c.py dijalankan ulang tanpa internet, program berhenti di baris 15 (queryAndConvert) dengan error URLError getaddrinfo failed, karena baris itu mengirim query ke
DBpedia. Akibatnya tahap berikutnya (menyimpan film_nolan.ttl dan menjalankan query lokal) tidak sempat dijalankan.
- Mengapa dbo:Film memberi 0 pada film_nolan.ttl: Template CONSTRUCT menerjemahkan tipe dbo:Film dari DBpedia menjadi schema:Movie, jadi film_nolan.ttl hanya berisi triple bertipe schema:Movie. Query yang mencari dbo:Film tidak menemukan satu pun triple yang cocok, sehingga hasilnya 0 tanpa error.

## Bagian C - Materialisasi
- Output demo_d.py: Sebelum: 0, Sesudah: 3, Ada Rina: 3
- Mengapa Ada Rina bernilai 3: Materialisasi hanya mencetak triple turunan (x a foaf:Person) untuk data yang ada saat aturan dijalankan. Rina ditambahkan sesudah aturan itu, sehingga hanya punya ex:rina a ex:DosenTetap, tanpa triple a foaf:Person. Query tidak menelusuri subClassOf sendiri (SELECT biasa tanpa jalur), jadi Rina tidak terhitung, dan hasilnya tetap 3 walau Rina adalah ex:DosenTetap dan ex:DosenTetap turunan foaf:Person. Aturan harus dijalankan ulang agar Rina ikut terhitung.
- Output materialisasi_ulang.py: 
Putaran 1: 4 triple baru | Person: 3
Rina masuk | Person: 3
Putaran 2 | Person: 4
- Tiga triple yang bukan baru: 
1. (ex:budi, rdf:type, ex:DosenTetap)
2. (ex:andi, rdf:type, ex:Mahasiswa)
3. (ex:sari, rdf:type, ex:Dosen)

Ketiganya dihasilkan melalui jalur a/rdfs:subClassOf* dengan nol kali penelusuran rdfs:subClassOf, karena tipe kelas tersebut sudah dimiliki individu secara langsung pada graf awal.
- Kegunaan kampus_turunan.ttl dan langkah manual yang tersisa: Berkas ini memisahkan triple hasil inferensi dari triple asli sehingga lebih mudah diperiksa dan diperbarui ketika struktur ontologi berubah. Jika ex:Dosen tidak lagi menjadi subkelas foaf:Person, triple hasil inferensi yang sudah tersimpan tidak otomatis terhapus. Kita harus memperbarui data asli, menghapus atau membangun ulang hasil inferensi yang sudah tidak valid, menjalankan kembali aturan materialisasi, kemudian menyimpan hasil terbarunya.

## Bagian D - Diagnosis
| Query | Hasil mesin | Gejala | Penyebab (baris yang salah) | Hasil setelah diperbaiki |
|-------|-------------|--------|-----------------------------|--------------------------|
| rusak_a | 0 triple | Hasil CONSTRUCT kosong meskipun data film ditemukan | Variabel `?film` pada bagian CONSTRUCT tidak sama dengan variabel `?f` pada WHERE | 3 triple |
| rusak_b | 4 triple | Terdapat dua nama Christopher Nolan yang tampak sama | Property path mengambil beberapa properti nama sehingga menghasilkan literal dengan tag bahasa berbeda | 3 triple |
| rusak_c | 0 triple | Tidak menemukan data permukiman | Pola WHERE hanya mencari tipe ex:Permukiman secara langsung dan tidak menelusuri kelas turunannya | 3 triple |

## Bagian E - Etika dan diskusi
| Aturan | a_kota_limit.rq | demo_c.py |
|--------|-----------------|-----------|
| 1 User-Agent | Tidak relevan karena file ini hanya berisi query SPARQL dan tidak mengatur identitas aplikasi. | Terpenuhi melalui UA = "KelasWebSemantik/1.0 (email@kampus.ac.id)" dan agent=UA. Email contoh perlu diganti dengan email yang benar. |
| 2 LIMIT | Terpenuhi melalui LIMIT 10 untuk membatasi hasil eksplorasi maksimal 10 solusi. | Terpenuhi melalui LIMIT 10 untuk membatasi hasil eksplorasi maksimal 10 solusi. | Tidak terlihat pengaturan LIMIT pada kode Python. Batas hasil bergantung pada isi query q_demo_b.rq. |
| 3 Simpan, jangan ulangi | Tidak relevan karena query SPARQL ini tidak melakukan penyimpanan file. | Terpenuhi melalui g.serialize("film_nolan.ttl", format="turtle") dan pembacaan kembali menggunakan Graph().parse("film_nolan.ttl"). |
| 4 Jangkar jalur | Terpenuhi melalui wdt:P31/wdt:P279* wd:Q515, karena menggunakan IRI tetap wd:Q515 sebagai tujuan jalur. | Tidak terlihat property path pada bagian kode Python yang ditampilkan. Query q_demo_b.rq perlu diperiksa terpisah untuk memastikan. |
- Versi yang melanggar aturan 4 (tidak dijalankan) dan alasannya: ?kota wdt:P31/wdt:P279* ?kelas .

Query tersebut melanggar aturan jangkar jalur karena kedua ujung property path menggunakan variabel (?kota dan ?kelas). Akibatnya, endpoint harus menelusuri banyak kemungkinan hubungan tanpa tujuan kelas yang spesifik. Hal ini dapat memperbesar ruang pencarian dan membebani endpoint. Versi yang lebih baik menggunakan IRI tetap wd:Q515 sebagai jangkar tujuan.

### Diskusi 1 - Taksonomi berubah
### Diskusi 1 - Taksonomi berubah

Jika hasil materialisasi Demo D disimpan ke graf produksi, triple yang berpotensi menjadi salah adalah triple hasil inferensi yang menyatakan suatu individu termasuk ke dalam kelas tertentu berdasarkan hubungan `rdfs:subClassOf`. Contohnya, individu bertipe `ex:DosenTetap` dapat disimpulkan sebagai `ex:Dosen` dan `foaf:Person`.

Berdasarkan perbandingan `kampus_v4.ttl` dari C1 dan `kampus_turunan.ttl` dari C2, terdapat perbedaan tipe kelas. Pada `kampus_v4.ttl`, Andi memiliki tipe `ex:Mahasiswa`, Budi dan Rina memiliki tipe `ex:DosenTetap`, sedangkan Sari memiliki tipe `ex:Dosen`. Pada `kampus_turunan.ttl`, tipe-tipe tersebut tidak semuanya muncul karena file tersebut berisi hasil penurunan kelas yang berbeda dari graf lengkap.

Jika taksonomi berubah, triple hasil inferensi yang tidak lagi didukung oleh hubungan subclass terbaru harus diperiksa. Caranya dengan membandingkan hasil materialisasi lama dengan hasil penelusuran berdasarkan taksonomi terbaru. Setelah ditemukan triple yang tidak lagi memiliki dasar, triple tersebut perlu dihapus atau diperbarui dan proses materialisasi dijalankan kembali. Hal ini penting agar graf produksi tidak menyimpan kesimpulan berdasarkan taksonomi yang sudah berubah.

### Diskusi 2 - SELECT atau CONSTRUCT
### Diskusi 2

Untuk membuat dashboard populasi kota dari tiga sumber data, saya akan menggunakan SELECT terlebih dahulu, kemudian CONSTRUCT. SELECT digunakan untuk mengambil dan memeriksa data dari setiap sumber sebelum digabungkan. Hal ini penting karena berdasarkan temuan Bagian A, terdapat populasi kota yang kembar. Artinya, satu kota dapat memiliki lebih dari satu data populasi sehingga perlu diperiksa agar tidak terjadi kesalahan informasi pada dashboard.

Selain itu, berdasarkan percobaan `rusak_b.rq`, ditemukan nama Christopher Nolan yang muncul dalam dua bentuk, yaitu `"Christopher Nolan"` dan `"Christopher Nolan"@en`. Walaupun teksnya sama, keduanya dianggap sebagai literal RDF yang berbeda karena memiliki tag bahasa yang berbeda. Hal ini menunjukkan bahwa data dari beberapa sumber perlu diseragamkan terlebih dahulu.

Setelah data diperiksa menggunakan SELECT, CONSTRUCT dapat digunakan untuk membentuk graf RDF baru dengan struktur dan format yang seragam. Misalnya, fungsi `STR()` dapat digunakan untuk menghilangkan perbedaan tag bahasa pada literal nama. Sementara itu, untuk data populasi yang memiliki nilai berbeda, perlu ditentukan sumber yang paling terpercaya atau aturan pemilihan nilai yang digunakan.

Dengan demikian, SELECT membantu memeriksa dan menemukan perbedaan data, sedangkan CONSTRUCT membantu membangun graf gabungan yang lebih konsisten dan siap digunakan pada dashboard.

### Cek diri
| Pernyataan | Bukti dari tugas ini |
|------------|----------------------|
| 1  CONSTRUCT mencetak template sekali per solution dan menggabungkan triple kembar. | Bagian A, percobaan LIMIT 10. Hasil CONSTRUCT dibandingkan dengan SELECT menunjukkan bahwa satu kota dapat muncul lebih dari sekali, tetapi triple yang identik hanya disimpan satu kali dalam graf RDF. |
| 2  Triple dengan variabel tak terikat tidak dicetak, tanpa error. | Bagian D, rusak_a.rq. Hasil awal 0 triple karena variabel ?film pada template tidak terikat di bagian WHERE, sedangkan variabel yang digunakan adalah ?f. |
| 3  UNION, jalur \|, dan VALUES menyatukan predikat berbeda.| Bagian D, rusak_b.rq. Query menggunakan VALUES ?o untuk memilih tiga orang dan jalur alternatif foaf:name\|rdfs:label\|schema:name untuk mengambil nama dari beberapa predikat. Penggunaan UNION secara langsung belum ditunjukkan dalam query ini. |
| 4  Jalur + dan * menelusuri hierarki tanpa menyebut perantara. | Bagian A, Demo A menggunakan wdt:P279*, sedangkan Bagian D, perbaikan rusak_c.rq menggunakan rdfs:subClassOf* untuk menelusuri hierarki kelas tanpa menyebut kelas perantara. Penggunaan jalur + belum ditunjukkan. |
| 5  Materialisasi menyimpan kesimpulan, tetapi harus dihitung ulang. | Bagian C1 dan C2. C1 menghasilkan Sebelum: 0, Sesudah: 3, dan Ada Rina: 3. Pada C2, materialisasi ulang membuat Rina ikut terhitung sehingga jumlah Person menjadi 4 pada Putaran 2. |
