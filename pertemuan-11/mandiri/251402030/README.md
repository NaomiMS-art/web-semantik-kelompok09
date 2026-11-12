# Pertemuan 11 - Tugas Mandiri: Dari Endpoint ke Graf Lokal

> Nama / NIM: [isi]
>
> **Catatan kejujuran data:** angka Bagian A dan B1 berasal dari endpoint publik (Wikidata / DBpedia) dan harus diambil dari tangkapan layar Anda sendiri (ditandai **[ISI]**). Bagian B2, C, D, dan E memakai data contoh lokal (`film.ttl`, `kota.ttl`, `kampus.ttl`); angkanya sudah dihitung dari data tersebut, tetapi jalankan sekali di laptop untuk memastikan cocok sebelum dikumpulkan.

## Bagian A - LIMIT dan tiga kali lipat
- Triple dengan LIMIT 10: [ISI dari `a-limit10.png`; batas atas 3 x 10 = 30]
- Triple dengan LIMIT 30: [ISI; batas atas 3 x 30 = 90]
- Baris SELECT LIMIT 10 / kota berbeda: 10 / [ISI jumlah kota berbeda]
- Mengapa tidak (atau mengapa tepat) 30 triple: Template `a_kota_limit.rq` punya 3 pola (`?kota a ex:Kota`, `rdfs:label`, `ex:populasi`), jadi setiap baris solusi mencetak paling banyak 3 triple dan LIMIT 10 memberi batas atas 30. Angka 30 hanya tercapai bila 10 baris itu berasal dari 10 kota berbeda. Bila hasil Anda kurang dari 30, tunjukkan dari tabel SELECT kota mana yang muncul di lebih dari satu baris (biasanya karena punya beberapa nilai `wdt:P1082` dari tahun berbeda): untuk kota itu pola `?kota a ex:Kota` dan `rdfs:label ?namaKota` menghasilkan triple yang sama persis pada setiap barisnya, sehingga CONSTRUCT menggabungkannya menjadi satu (graf adalah himpunan). Pola yang mencetak triple kembar adalah dua pola pertama (type dan label); pola populasi tetap berbeda karena nilainya berbeda.

> Catatan: angka bisa berbeda dari teman karena Wikidata terus disunting dan hasil tanpa `ORDER BY` tidak berurutan tetap.

## Bagian B - DBpedia ke Turtle
- Output demo_c.py: [ISI dari `b-dbpedia.png` / terminal Anda] triple, film tanpa tanggal: [ISI]
  - Dengan data contoh (tanpa internet): `python jalankan.py film.ttl q_demo_b.rq` menghasilkan **12 triple**, film tanpa tanggal: `Following_film`. (**Saya memakai data contoh.**)
- Sumber data: DBpedia / data contoh film.ttl
- Triple yang tetap tercetak untuk film tanpa tanggal: tiga triple, yaitu `a schema:Movie`, `schema:name`, dan `schema:director dbr:Christopher_Nolan`. Hanya `schema:datePublished ?rilis` yang tidak tercetak. Tidak ada pesan error karena pola template yang memuat variabel tak terikat (`?rilis` dari OPTIONAL kosong) dilewati begitu saja oleh CONSTRUCT.
- Permintaan lokal tanpa internet: [ISI hasil Anda setelah internet dimatikan]. Seharusnya berhasil karena `Graph().parse("film_nolan.ttl")` hanya membaca berkas di disk dan `Q_TANPA_TANGGAL` hanya dijalankan pada graf lokal itu. Bila seluruh `demo_c.py` dijalankan ulang tanpa internet, program gagal pada `sp.queryAndConvert()` (koneksi ke `dbpedia.org` tidak ada) sebelum sempat menyimpan atau membaca apa pun; berkas `film_nolan.ttl` lama tetap ada, jadi hanya bagian lokalnya yang bisa dijalankan terpisah.
- Mengapa dbo:Film memberi 0 pada film_nolan.ttl: `dbo:Film` hanya muncul di klausa WHERE (untuk mencari data di DBpedia). Template CONSTRUCT mencetak `a schema:Movie`, jadi `film_nolan.ttl` hanya berisi `schema:Movie` dan tidak ada satu pun triple bertipe `dbo:Film`.

## Bagian C - Materialisasi
- Output demo_d.py:
  ```
  Sebelumnya: 0
  Sesudah: 3
  Ada Rina: 3
  ```
- Mengapa Ada Rina bernilai 3: `demo_d.py` menjalankan CONSTRUCT hanya satu kali, sebelum Rina ada. Ketika Rina ditambahkan, ia hanya punya triple asli `ex:rina a ex:DosenTetap`. Triple turunan `ex:rina a foaf:Person` belum pernah dihitung, sehingga `SELECT ?x WHERE { ?x a foaf:Person }` tetap mengembalikan 3 orang (Budi, Sari, Andi). Materialisasi menyimpan kesimpulan pada saat itu saja; data baru harus melalui aturan lagi.
- Output materialisasi_ulang.py:
  ```
  Putaran 1: 4 triple baru | Orang: 3
  Rina masuk | Orang: 3
  Putaran 2 | Orang: 4
  Tiga turunan disimpan terpisah: 6
  ```
- Tiga triple yang lain: `ex:budi a ex:DosenTetap`, `ex:sari a ex:Dosen`, dan `ex:andi a ex:Mahasiswa`, yaitu triple asli yang sudah ada di `kampus.ttl`. Mereka dicetak oleh bagian `*` dengan nol langkah (zero-length) pada `a/rdfs:subClassOf*`: dengan nol langkah `subClassOf`, `?super` sama dengan tipe asli. Empat triple baru berasal dari satu atau lebih langkah (Dosen, Person untuk Budi; Person untuk Sari dan Andi).
- Kegunaan kampus_turunan.ttl dan langkah manual yang tersisa: berkas ini hanya berisi 6 kesimpulan, terpisah dari fakta asli, sehingga bila `ex:Dosen` tidak lagi subkelas `foaf:Person`, kesimpulan lama bisa dibuang sekaligus (hapus atau abaikan berkasnya) tanpa mengganggu `kampus.ttl`. Langkah manual yang tetap perlu dilakukan: mengubah taksonomi di `kampus.ttl` lalu menjalankan ulang `materialisasi_ulang.py` agar turunan dihitung ulang dari taksonomi yang baru; materialisasi tidak menghapus kesimpulan lama dengan sendirinya.

## Bagian D - Diagnosis
Perintah: `python jalankan.py film.ttl rusak_a.rq`, `python jalankan.py film.ttl rusak_b.rq`, `python jalankan.py kota.ttl rusak_c.rq`.

| Kueri | Hasil mesin | Gejala | Penyebab (baris salah) | Hasil setelah diperbaiki |
|-------|-------------|--------|-----------------------------|--------------------------|
| rusak_a | 0 triple | Graf kosong, tanpa error | `CONSTRUCT { ?film ex:judul ?j . }`: template memakai `?film`, padahal WHERE hanya mengikat `?f` | 3 triple (satu judul per film Nolan) |
| rusak_b | 5 triple (Nolan 2, Joko Anwar 2, Mira 1) | Dua nilai yang tampak sama | `?o foaf:name\|rdfs:label\|schema:name ?n .`: nilai sama dengan tag bahasa / tipe berbeda dianggap literal berbeda | 3 triple (tepat satu `ex:nama` per orang) |
| rusak_c | 0 triple | Superkelas tidak ditemukan (graf kosong) | `?x a ex:Permukiman .` di WHERE: tanpa jalur `rdfs:subClassOf*`, sehingga `ex:Kota` dan `ex:Desa` tidak terhitung | 3 triple (Medan, Surabaya, Tomok) |

Perbaikan: `perbaikan_a.rq` (`?film` jadi `?f`), `perbaikan_b.rq` (`BIND(STR(?n0) AS ?n)`), `perbaikan_c.rq` (`?x a/rdfs:subClassOf* ex:Permukiman`).

## Bagian E - Etika dan diskusi
| Aturan | a_kota_limit.rq | demo_c.py |
|--------|-----------------|-----------|
| 1 Agen Pengguna | Tidak relevan: query ditempel di UI query.wikidata.org, bukan klien program; yang mengirim identitas adalah browser | `UA = "KelasWebSemantik/1.0 (email@kampus.ac.id)"` dan `SPARQLWrapper(..., agent=UA)` |
| 2 LIMIT | Baris terakhir `LIMIT 10` | Tidak ada `LIMIT`; himpunan hasil dibatasi oleh IRI sutradara yang tetap (`dbr:Christopher_Nolan`), jadi hasilnya kecil |
| 3 Simpan, jangan ulangi | Tidak relevan: eksplorasi sekali jalan di UI | `g.serialize("film_nolan.ttl", ...)` lalu `lokal = Graph().parse("film_nolan.ttl")`; endpoint dipanggil satu kali, query kedua dijalankan lokal |
| 4 Jangkar jalur | `?kota wdt:P31/wdt:P279* wd:Q515`: ujung jalur dijangkarkan pada IRI tetap `wd:Q515` (kota), bukan dua variabel | Tidak ada jalur `*` atau `+` |

- Versi yang melanggar aturan 4 (tidak dijalankan) dan logika:
  ```sparql
  WHERE { ?kota wdt:P31/wdt:P279* ?kelas .
          ?kelas wdt:P279* ?induk . }   # tanpa IRI tetap, dan tanpa LIMIT
  ```
  Jalur `*` berangkat dari dua variabel bebas: endpoint harus menelusuri hierarki `P279` dari setiap item di Wikidata (puluhan juta) ke semua leluhurnya, lalu menggabungkannya. Jumlah kombinasi meledak, hampir pasti kena batas waktu, dan membebani server bersama.

### Diskusi 1 - Taksonomi berubah
Misalkan ex:Dosen tidak lagi menjadi subkelas foaf:Person. Pada data saya, tiga dari enam triple turunan menjadi salah: ex:budi a foaf:Person, ex:sari a foaf:Person, dan ex:rina a foaf:Person, karena ketiganya hanya mencapai foaf:Person lewat ex:Dosen. Triple ex:andi a foaf:Person tetap benar karena jalurnya lewat ex:Mahasiswa, begitu pula ex:budi a ex:Dosen dan ex:rina a ex:Dosen. Di kampus_v4.ttl dari C1, kesimpulan dan fakta asli bercampur dalam satu graf, sehingga saya tidak bisa membedakan mana yang asli dan mana hasil inferensi tanpa membandingkannya dengan kampus.ttl. Rina juga belum tercatat sebagai foaf:Person di sana karena demo_d.py menjalankan aturan hanya sekali. Di kampus_turunan.ttl dari C2, enam triple turunan sudah terpisah, jadi saya cukup membuang berkas itu, mengubah satu baris subClassOf di kampus.ttl, lalu menjalankan ulang materialisasi_ulang.py agar turunan dihitung dari taksonomi baru. Dengan kata lain, memisahkan turunan membuat pembersihan menjadi satu operasi sederhana, sedangkan data yang sudah bercampur harus dibersihkan triple demi triple dengan risiko ikut menghapus fakta asli. Materialisasi memang cepat dibaca, tetapi ia membawa utang perawatan: setiap perubahan taksonomi menuntut penghitungan ulang.

### Diskusi 2 - SELECT atau CONSTRUCT
Untuk dashboard populasi kota saya memakai SELECT. Dashboard membutuhkan baris yang bisa dihitung dan diurutkan, sedangkan CONSTRUCT mengembalikan graf yang menggabungkan triple kembar. Bagian A menunjukkan akibatnya: template a_kota_limit.rq punya tiga pola, sehingga LIMIT 10 memberi paling banyak 30 triple. Namun bila satu kota muncul di beberapa baris karena punya beberapa nilai populasi, triple tipe dan labelnya menyatu, jadi jumlah triple tidak sama dengan tiga kali jumlah baris. Dengan SELECT setiap baris tetap tampil dan jumlah kota berbeda dapat dihitung langsung, tanpa kehilangan informasi akibat penggabungan. Untuk menggabungkan data kota dari tiga sumber saya memakai CONSTRUCT, karena hasilnya sudah berada dalam satu kosakata, misalnya ex:nama, dan dapat langsung dimasukkan ke satu Graph. Bagian D rusak_b membuktikan pentingnya penyeragaman itu: foaf:name, rdfs:label, dan schema:name membawa tag bahasa atau tipe data berbeda, sehingga hasil awal 5 triple untuk 3 orang. Setelah memakai STR() hasilnya menjadi 3 triple, tepat satu ex:nama per orang. Jadi saya memakai SELECT untuk membaca dan menghitung, dan CONSTRUCT untuk menyeragamkan lalu menggabungkan, sambil selalu membandingkan jumlah triple dengan jumlah yang masuk akal dari data.

### Cek diri
| Pernyataan | Bukti dari tugas ini |
|------------|----------------------|
| 1 | Bagian B: `q_demo_b.rq` pada `film.ttl` menghasilkan 4 solusi (Inception 2x, Interstellar, Following) dengan 15 pencetakan template, tetapi hanya 12 triple karena triple kembar Inception digabung. Bagian A: LIMIT 10 dengan 3 pola, batas atas 30. |
| 2 | Bagian B: film Following tidak punya `dbo:releaseDate`, `?rilis` tak terikat, sehingga hanya 3 triple tercetak tanpa pesan error. Bagian D: `rusak_a` memberi 0 triple tanpa error. |
| 3 | Bagian D: `rusak_b` memakai jalur `foaf:name\|rdfs:label\|schema:name` (predikat berbeda) dan `VALUES ?o {...}` (subjek berbeda); 5 triple, setelah STR() menjadi 3. |
| 4 | Bagian C: `a/rdfs:subClassOf*` menelusuri DosenTetap ke Dosen ke Person tanpa memilih perantara. Bagian D: `perbaikan_c.rq` menemukan Kota dan Desa sebagai Permukiman. |
| 5 | Bagian C2: setelah Rina masuk, Orang tetap 3 sampai aturan dijalankan ulang (Putaran 2: Orang 4). |
