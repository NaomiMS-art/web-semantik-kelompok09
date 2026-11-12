# Pertemuan 11 - Tugas Mandiri: Dari Endpoint ke Graf Lokal

## Bagian A - LIMIT dan triple
- Triple dengan LIMIT 10: 30
- Triple dengan LIMIT 30: 90
- Baris SELECT LIMIT 10 / kota berbeda: 10 / 10
- Mengapa tidak (atau mengapa tepat) 30 triple: Karena kita menggunakan LIMIT, ia membatasi baris hasil, bukan triple. CONSTRUCT memuat 3 triple (kota, label, populasi) kemudian diikali dengan 10 (limitnya) 

## Bagian B - DBpedia ke Turtle
- Output demo_c.py: 48 triple, film tanpa tanggal: 16
- Sumber data: DBpedia 
- Triple yang tetap tercetak untuk film tanpa tanggal:

**?film a schema:Movie**
**schema:name ?judul** 
**schema:director dbr:Christopher_Nolan**
- Dan triple mana yang tidak? Mengapa tidak ada pesan error?

tanggal rilisnya (schema:datePublished). Tidak eror, karena ada bagian OPTIONAL artinya “kalau ada tanggalnya, ambil; kalau tidak ada, lewati saja”.

- Query lokal tanpa internet:
Q_TANPA_TANGGAL dalam film_nolan.tll (isinya hasil CONSTRUCT yang sudah diunduh dan disimpan sebelumnya). Di mana dissini kita juga mengguankan parse, berfungsi untuk membaca berkas dari disk ke memori awalaupun tidak ada koneksi jaringan.

- Mengapa ini berhasil, dan apa yang terjadi bila Anda menjalankan ulang seluruh demo_c.py tanpa internet?

Seluruh demo_c.py: gagal. Baris sp.queryAndConvert() harus mengirim query ke DBpedia. Tetapi, baris sesudahnya tidak jalan, dan film_nolan.ttl yang lama tetap utuh karena belum sempat tertimpa.

- Mengapa dbo:Film memberi 0 pada film_nolan.ttl?

Karena berkas itu adalah hasil CONSTRUCT, yang hanya berisi triple schema:Movie. dbo:Film hanya dipakai di WHERE untuk mencocokkan data sumber dan tidak ikut ditulis, sehingga COUNT mengembalikan 0.

## Bagian C - Materialisasi
- Output demo_d.py: 
Sebelum: 0           
Sesudah: 3
Ada Rina: 3

- Mengapa Ada Rina bernilai 3: karena materialisasi dijalankan sekali sebelum Rina masuk. ex:rina a ex:DosenTetap adalah fakta baru, dan tidak ada triple ex:rina a foaf:
Person karena kesimpulan itu tidak dihitung otomatis. Hasil materialisasi adalah salinan statis, bukan inferensi hidup.
  
- Output materialisasi_ulang.py: 
  Putaran 1: 4 triple baru | Person: 3
  Rina masuk | Person: 3
  Putaran 2 | Person: 4
  Triple turunan disimpan terpisah: 6
  
- Tiga triple yang bukan baru:

Pada Putaran 1, a/rdfs:subClassOf* (nol langkah atau lebih) juga menghasilkan tipe yang sudah tertulis di kampus.ttl, yaitu ex:budi a ex:DosenTetap, ex:sari a ex:Dosen, dan ex:andi a ex:Mahasiswa. Fungsi materialisasi membuangnya lewat if t not in g, sehingga hanya 4 triple baru yang tersisa: andi a foaf:Person, budi a ex:Dosen, budi a foaf:Person, dan sari a foaf:Person.

- Kegunaan kampus_turunan.ttl dan langkah manual yang tersisa:

berisi kesimpulan saja (6 triple), terpisah dari fakta asli. Hal ini membuat kesimpulan bisa dihapus atau dihitung ulang tanpa menyentuh fakta. Dengan menjalankan ulang materialisasi kemudian membandingkan hasil baru dengan kampus_turunan.ttl

## Bagian D - Diagnosis
| Query | Hasil mesin | Gejala | Penyebab (baris yang salah) | Hasil setelah diperbaiki |
|-------|-------------|--------|-----------------------------|--------------------------|
| rusak_a | 0 triple, tanpa error | Hasil kosong tanpa pesan kesalahan | Baris `?f dbo:director dbr:Christopher_Nolan ;` mengikat `?f`, sedangkan template `CONSTRUCT` memakai `?film`, yang tidak pernah terikat | 3 triple (`?f` diganti `?film`): Following, Memento, Insomnia |
| rusak_b | 4 triple | Hasil lebih banyak dari target; satu orang muncul dua kali | Baris `?o foaf:name\|rdfs:label\|schema:name ?n .` membuat Nolan cocok dua jalur: `"Christopher Nolan"` (tanpa tag) dan `"Christopher Nolan"@en` (literal berbeda, tidak digabung) | 3 triple (`foaf:name\|` dibuang) |
| rusak_c | 0 triple, tanpa error | Hasil kosong tanpa pesan kesalahan | Baris `?x a ex:Permukiman .` hanya cocok dengan tipe yang tertulis langsung, padahal Medan, Surabaya, dan Tomok bertipe subkelas | 3 triple (`a` diganti `a/rdfs:subClassOf*`): Medan, Surabaya, Tomok |


## Bagian E - Etika dan diskusi
| Aturan | a_kota_limit.rq | demo_c.py |
|--------|-----------------|-----------|
| 1 User-Agent | Tidak ada baris UA. Query dijalankan lewat antarmuka web Wikidata Query Service, yang sudah memakai identitas browser. Aturan ini berlaku untuk klien program. | `UA = "KelasWebSemantik/1.0 (yessicajaklin@students.usu.ac.id)"` dan `SPARQLWrapper(..., agent=UA)` |
| 2 LIMIT | Baris terakhir `LIMIT 10` membatasi solution saat eksplorasi | Tidak ada LIMIT, dan tidak perlu: pola dibatasi `dbo:director dbr:Christopher_Nolan` sehingga hasilnya hanya 16 film |
| 3 Simpan, jangan ulangi | Tidak relevan: dijalankan sekali untuk eksplorasi dan tidak diolah ulang | `queryAndConvert()` dipanggil sekali, lalu `g.serialize("film_nolan.ttl")` dan query kedua berjalan pada `Graph().parse("film_nolan.ttl")` |
| 4 Jangkar jalur | `wdt:P31/wdt:P279* wd:Q515`: jalur `*` berjangkar pada IRI `wd:Q515` (kota) | Tidak relevan: tidak ada jalur `*` atau `+`; pola sudah berjangkar pada `dbr:Christopher_Nolan` |

- Versi yang melanggar aturan 4 (tidak dijalankan) dan alasannya: 

  SELECT ?kota ?kelas
  WHERE { ?kota wdt:P31/wdt:P279* ?kelas . }
  LIMIT 10

wd:Q515 diganti ?kelas. Artinya jadi “carikan semua benda, beserta semua jenis induknya”. Endpoint tidak punya titik awal lagi, jadi harus memeriksa jutaan item Wikidata satu per satu, dan tiap item ditelusuri naik ke semua jenis induknya.

### Diskusi 1 - Taksonomi berubah
Dalam pengembangan knowledge graph, aturan taksonomi bisa berevolusi. Misalnya, awalnya sistem secara otomatis menyimpulkan bahwa kelas ex:Dosen adalah subkelas dari foaf:Person. Namun, bagaimana jika di masa depan aturan ini diubah dan relasi tersebut tidak lagi berlaku?

Jika kita sejak awal mencampur aduk data fakta asli dengan data hasil kesimpulan (inferensi) di dalam satu file yang sama (misalnya kampus_v4.ttl), kita akan menghadapi kendala besar. Saat query dijalankan, sistem akan tetap menghitung kesimpulan lama yang sebenarnya sudah tidak valid. Masalah utamanya adalah mesin tidak bisa lagi membedakan mana triple yang berupa fakta murni (fakta asli) dan mana triple yang hanya sekadar kesimpulan di masa lalu.

Praktik terbaik untuk mengatasi ini adalah dengan memisahkan tempat penyimpanannya:

1. File Fakta: Khusus menyimpan data aslinya (misalnya di kampus.ttl).

2. File Kesimpulan: Khusus untuk menyimpan data turunan hasil inferensi (misalnya di kampus_turunan.ttl).

Dengan pemisahan ini, saat taksonomi berubah, kita cukup menjalankan ulang sistem reasoner hanya ke data fakta asli. Setelah itu, kita tinggal membandingkan hasil yang baru dengan file kampus_turunan.ttl yang lama. Triple kesimpulan yang tidak muncul lagi di hasil baru berarti sudah kedaluwarsa dan bisa langsung dihapus, sementara data fakta asli kita dijamin tetap aman dan tidak ikut terhapus.

### Diskusi 2 - SELECT atau CONSTRUCT
Dalam pengerjaan SPARQL, pemilihan antara SELECT dan CONSTRUCT bergantung pada tujuan akhir data yang kita ambil. Keduanya sama-sama mencocokkan pola di blok WHERE, tetapi bentuk keluarannya berbeda jauh. Query SELECT menghasilkan data berbentuk tabel berisi baris dan kolom. Bentuk ini paling pas dipakai saat kita melakukan eksplorasi awal, menghitung agregasi seperti COUNT, atau langsung menampilkan daftar informasi ke pengguna. Namun, hasil SELECT sudah kehilangan struktur grafnya, sehingga tidak bisa langsung disimpan sebagai berkas RDF atau di-query ulang sebagai knowledge graph.

Sebaliknya, CONSTRUCT menghasilkan kumpulan triple RDF baru sesuai templat yang kita tentukan. Query ini sangat berguna ketika kita ingin menarik data dari endpoint publik lalu menyimpannya menjadi graf lokal, seperti saat mengunduh data film ke berkas film_nolan.ttl. Selain itu, CONSTRUCT memudahkan kita menyeragamkan kosakata, misalnya mengubah dbo:Film dari DBpedia menjadi schema:Movie agar lebih rapi dan sesuai kebutuhan sistem lokal.

Singkatnya, gunakan SELECT saat kita hanya butuh mengambil jawaban siap baca dalam bentuk daftar atau angka. Gunakan CONSTRUCT ketika tujuannya adalah membangun, merapikan, atau menyimpan ulang potongan knowledge graph ke penyimpanan lokal agar bisa diolah kembali secara luring (offline) tanpa membebani endpoint publik.

### Cek diri
| Pernyataan | Bukti dari tugas ini |
|------------|----------------------|
| 1 CONSTRUCT mencetak template sekali per solution dan menggabungkan triple kembar | `LIMIT 10` menghasilkan 30 triple (10 solution x 3 triple). Pada `film.ttl`, Memento punya dua `dbo:releaseDate` (dua solution), tetapi triple tipe, nama, dan sutradara tidak berlipat: total `q_demo_b.rq` adalah 12 triple (4+5+3). Pada `perbaikan_c.rq`, Medan punya dua jalur ke `ex:Permukiman` namun hanya satu triple, total 3. |
| 2 Variabel tak terikat tidak dicetak, tanpa error | `film_nolan.ttl`: 16 film hanya punya 3 triple (total 48), tanpa `datePublished`, dan `Film tanpa tanggal: 16`. Insomnia di `film.ttl` juga 3 triple. `rusak_a.rq`: `?film` tidak pernah terikat, hasil 0 triple tanpa error. |
| 3 UNION, jalur \| , dan VALUES menyatukan predikat berbeda | `perbaikan_b.rq`: `VALUES` + `rdfs:label\|schema:name` menyatukan Nolan dan Joko Anwar (`rdfs:label`) dengan Mira Lesmana (`schema:name`) menjadi 3 triple `ex:nama`. |
| 4 Jalur + dan * menelusuri hierarki tanpa menyebut perantara | `perbaikan_c.rq`: `a/rdfs:subClassOf*` menemukan Tomok (1 tingkat via `ex:Desa`) dan Surabaya (2 tingkat via `ex:KotaDiIndonesia`, `ex:Kota`): 0 triple menjadi 3. `a_kota_limit.rq` memakai `wdt:P279*` dari `wd:Q515`. |
| 5 Materialisasi menyimpan kesimpulan, tetapi harus dihitung ulang | `materialisasi_ulang.py`: Putaran 1 menghasilkan 4 triple baru (Person: 3); setelah Rina masuk, Person tetap 3; setelah dihitung ulang (Putaran 2), Person 4 dan `kampus_turunan.ttl` berisi 6 triple. |
