# Pertemuan 11 - Tugas Mandiri: Dari Endpoint ke Graf Lokal

## Bagian A - LIMIT dan triple
- **Triple dengan LIMIT 10:** 30
- **Triple dengan LIMIT 30:** 90
- **Baris SELECT LIMIT 10 / kota berbeda:** 10 / 5
- **Mengapa tidak (atau mengapa tepat) 30 triple:** 
  Hasil saya mencapai batas atas, yaitu 30 triple. Hal ini karena 10 baris hasil dari klausa `WHERE` menghasilkan 10 entitas kota yang berbeda, sehingga setiap kota memiliki tiga triple berdasarkan pola template yang digunakan. Tidak ada triple kembar yang dihapus oleh graf RDF karena setiap kota memiliki identitas yang berbeda. Oleh karena itu, hasil akhirnya adalah 10 x 3 = 30 triple, tanpa ada selisih maupun pola template yang mencetak triple kembar.

## Bagian B - DBpedia ke Turtle
- **Output demo_c.py:** 48 triple, film tanpa tanggal: 16
- **Sumber data:** DBpedia / data contoh `film.ttl`
- **Triple yang tetap tercetak untuk film tanpa tanggal: 16**
  Triple yang tetap tercetak adalah definisi entitas (`?f a schema:Movie`), judul, dan sutradara karena variabel tersebut memiliki nilai (*bound*). Sementara itu, triple tanggal rilis (`schema:datePublished`) tidak tercetak karena variabel tanggal tidak memiliki nilai. Hal ini tidak menimbulkan error karena SPARQL `CONSTRUCT` secara otomatis melewati triple yang mengandung variabel kosong.
- **Query lokal tanpa internet:** 
  Query lokal tetap berhasil karena `rdflib` membaca dan memproses file `film_nolan.ttl` yang sudah tersimpan di komputer, sehingga tidak membutuhkan koneksi internet. Namun, jika seluruh `demo_c.py` dijalankan ulang tanpa internet, bagian query ke DBpedia akan mengalami error jaringan karena `SPARQLWrapper` membutuhkan koneksi internet untuk mengakses endpoint DBpedia.
- **Mengapa dbo:Film memberi 0 pada film_nolan.ttl:** 
  Query dengan `dbo:Film` menghasilkan 0 karena tipe entitas tersebut sudah tidak terdapat di dalam file `film_nolan.ttl`. File tersebut merupakan hasil dari query `CONSTRUCT` sebelumnya yang mengubah (mapping) ontologi DBpedia menjadi ontologi Schema.org. Akibatnya, seluruh entitas film menggunakan tipe `schema:Movie` (ditampilkan sebagai `ns1:Movie`), bukan lagi `dbo:Film`. Oleh karena itu, ketika query lokal mencari `dbo:Film`, tidak ditemukan kecocokan sehingga hasilnya 0.

## Bagian C - Materialisasi
- Output demo_d.py: 
Sebelum: 0
Sesudah: 3
Ada Rina: 3
- Mengapa Ada Rina bernilai 3: 
Rina memiliki nilai 3 karena Rina ditambahkan ke dalam graf setelah query materialisasi CONSTRUCT selesai dijalankan. Library rdflib tidak memiliki live reasoner yang dapat melakukan inferensi secara otomatis ketika ada data baru. Oleh karena itu, tipe foaf:Person belum disimpulkan untuk Rina meskipun ex:DosenTetap merupakan turunan dari foaf:Person.
- Output materialisasi_ulang.py: 
Putaran 1: 4 triple baru | Person: 3
Rina masuk | Person: 3
Putaran 2 | Person: 4
Triple turunan disimpan terpisah: 6
- Tiga triple yang bukan baru: 
iga triple lainnya merupakan tipe asli (explicit types) dari entitas yang sudah ada di kampus.ttl. Triple tersebut ikut tercetak karena operator * pada jalur a/rdfs:subClassOf* mencakup jalur nol langkah (zero-length path), sehingga tipe asli entitas tetap dicocokkan tanpa harus melewati relasi rdfs:subClassOf.
- Kegunaan kampus_turunan.ttl dan langkah manual yang tersisa: 
Berkas kampus_turunan.ttl berguna untuk memisahkan hasil inferensi dari data asli, sehingga ketika aturan ontologi berubah, hasil inferensi lama dapat dibuang tanpa mengubah data master. Jika ex:Dosen tidak lagi menjadi subkelas foaf:Person, kita perlu memperbarui ontologi, menghapus atau mengganti berkas kampus_turunan.ttl yang lama, lalu menjalankan ulang script materialisasi agar hasil inferensi sesuai dengan aturan terbaru.

## Bagian D - Diagnosis
| Query | Hasil mesin | Gejala | Penyebab (baris yang salah) | Hasil setelah diperbaiki |
|-------|-------------|--------|-----------------------------|--------------------------|
| rusak_a | 0 triple | Satu properti hilang | CONSTRUCT { ?film ex:judul ?j . } | 3 triple
  dbr:Following ex:judul "Following"@en .
  dbr:Insomnia ex:judul "Insomnia"@en .
  dbr:Memento ex:judul "Memento"@en . |
| rusak_b | 4 triple
  dbr:Christopher_Nolan ex:nama "Christopher Nolan" .
  dbr:Christopher_Nolan ex:nama "Christopher Nolan"@en .
  dbr:Joko_Anwar ex:nama "Joko Anwar"@id .
  dbr:Mira_Lesmana ex:nama "Mira Lesmana" . | Dua nilai yang tampak sama | ?o foaf:name|rdfs:label|schema:name ?n | 3 triple
  dbr:Christopher_Nolan ex:nama "Christopher Nolan" .
  dbr:Joko_Anwar ex:nama "Joko Anwar" .
  dbr:Mira_Lesmana ex:nama "Mira Lesmana" . |
| rusak_c | 0 triple | Superkelas tidak ditemukan | WHERE {?x a ex:Permukiman .} | 3 triple
  ex:Medan rdf:type ex:Permukiman .
  ex:Surabaya rdf:type ex:Permukiman .
  ex:Tomok rdf:type ex:Permukiman . |

## Bagian E - Etika dan diskusi
| Aturan | a_kota_limit.rq | demo_c.py |
|--------|-----------------|-----------|
| 1 User-Agent | Tidak relevan. File .rq hanya berisi teks query SPARQL murni; header HTTP request seperti User-Agent dikelola oleh aplikasi yang mengeksekusinya (misal web browser). | Terpenuhi. Terdapat pada baris UA = "KelasWebSemantik/1.0 (veddertimothy@students.usu.ac.id)" dan baris penerapannya di sp = SPARQLWrapper("[https://dbpedia.org/sparql](https://dbpedia.org/sparql)", agent=UA) |
| 2 LIMIT | Terpenuhi. Terdapat klausa LIMIT 10 di baris paling bawah. | Tidak relevan. Pembatasan hasil adalah urusan sintaks query yang dimuat (dalam hal ini Q_NOLAN_GRAF atau Q_TANPA_TANGGAL), bukan logika skrip Python secara langsung. |
| 3 Simpan, jangan ulangi | Tidak relevan. Logika penyimpanan ke diska (disk) dan pembacaan ulang offline dilakukan di level bahasa pemrograman, bukan di sintaks query. | Terpenuhi. Skrip mengambil data dari internet dan menyimpannya melalui baris g.serialize("film_nolan.ttl", format="turtle"), lalu memprosesnya secara lokal melalui baris lokal = Graph().parse("film_nolan.ttl"). |
| 4 Jangkar jalur | [isi] | [isi] |
- Versi yang melanggar aturan 4 (tidak dijalankan) dan alasannya: 
PREFIX ex: <http://contoh.id/>;
CONSTRUCT {
  ?kota a ex:Kota ;
        rdfs:label ?namaKota ;
        ex:populasi ?populasi .
}
WHERE {
  ?kota wdt:P31/wdt:P279* ?tipe ;    # PELANGGARAN: wd:Q515 diganti menjadi variabel tak terikat
        wdt:P17 wd:Q252 ;
        wdt:P1082 ?populasi ;
        rdfs:label ?namaKota .
  FILTER ( LANG(?namaKota) = "id" )
}
LIMIT 10

Versi a_kota_limit.rq yang melanggar Aturan 4 jauh lebih mahal bagi endpoint karena mengganti IRI yang sudah pasti (wd:Q515) dengan variabel bebas (?tipe). Akibatnya, jalur properti wdt:P279* harus mencari seluruh kemungkinan hubungan subkelas dari berbagai kelas, bukan hanya menelusuri kelas kota. Hal ini membuat ruang pencarian dan kombinasi data menjadi jauh lebih besar, sehingga membebani komputasi server dan berisiko menyebabkan timeout.


### Diskusi 1 - Taksonomi berubah
Pada kasus Bagian C1 (Demo D), triple asli dan hasil materialisasi digabungkan ke dalam satu graf kampus_v4.ttl. Jika suatu saat taksonomi berubah, misalnya ex:DosenTetap tidak lagi menjadi subkelas dari foaf:Person, maka triple kesimpulan seperti ex:rina a foaf:Person menjadi tidak valid.

Masalahnya, ketika data asli dan triple kesimpulan sudah digabung, kita akan kesulitan membedakan mana triple yang memang diinput sejak awal dan mana yang merupakan triple kesimpulan. Akibatnya, saat ingin menghapus kesimpulan yang sudah tidak valid, ada risiko fakta asli ikut terhapus.

Berbeda dengan pendekatan C2 yang menyimpan triple kesimpulan secara terpisah di kampus_turunan.ttl. Jika taksonomi berubah, kita cukup menghapus berkas triple kesimpulan yang lama, memperbarui aturan ontologi pada graf utama, lalu menjalankan ulang proses materialisasi. Dengan begitu, triple kesimpulan akan dibentuk kembali sesuai aturan terbaru tanpa mengganggu data asli. Pemisahan ini juga membuat pengelolaan data lebih mudah karena kita bisa membedakan fakta asli dan triple kesimpulan.

### Diskusi 2 - SELECT atau CONSTRUCT
Untuk membangun dashboard populasi kota, query SELECT lebih tepat digunakan karena hasilnya berbentuk tabel yang terdiri dari baris dan kolom. Format ini lebih mudah digunakan untuk menampilkan data dalam bentuk tabel maupun grafik pada antarmuka dashboard.

Namun, jika tujuannya menggabungkan data kota dari tiga sumber yang berbeda menjadi satu knowledge graph, CONSTRUCT lebih tepat digunakan. Hal ini karena CONSTRUCT menghasilkan graf RDF berupa kumpulan triple dan secara otomatis menggabungkan triple yang identik.

Berdasarkan pengerjaan sebelumnya, pada Bagian A ditemukan kasus populasi kembar, yaitu satu kota di Wikidata memiliki beberapa rekaman data populasi. Jika menggunakan SELECT, data tersebut dapat menghasilkan banyak baris berulang yang perlu dibersihkan terlebih dahulu. Sementara itu, CONSTRUCT akan menggabungkan triple yang identik sehingga tidak terjadi duplikasi pada graf RDF.

### Cek diri

| Pernyataan | Bukti dari tugas ini |
|---|---|
| 1 | `LIMIT 10` menghasilkan 30 triple (10 solution x 3 triple). Pada `film.ttl`, *Memento* punya dua `dbo:releaseDate` (dua solution), tetapi triple tipe, nama, dan sutradara tidak berlipat: total `q_demo_b.rq` adalah 12 triple (4+5+3). Pada `perbaikan_c.rq`, Medan punya dua jalur ke `ex:Permukiman` namun hanya dicetak satu triple, total 3. |
| 2 | `film_nolan.ttl`: 16 film hanya punya 3 triple (total 48), tanpa `datePublished`, dan "Film tanpa tanggal: 16". *Insomnia* di `film.ttl` juga 3 triple. Pada `rusak_a.rq`: `?film` tidak pernah terikat, hasil 0 triple tanpa pesan error. |
| 3 | Pada `perbaikan_b.rq`: `VALUES` + `rdfs:label\|schema:name` menyatukan Nolan dan Joko Anwar (yang memakai `rdfs:label`) dengan Mira Lesmana (`schema:name`) menjadi bentuk seragam 3 triple `ex:nama`. |
| 4 | Pada `perbaikan_c.rq`: `a/rdfs:subClassOf*` menemukan Tomok (1 tingkat via `ex:Desa`) dan Surabaya (2 tingkat via `ex:KotaDiIndonesia`, `ex:Kota`): dari 0 triple menjadi 3. Pada `a_kota_limit.rq` memakai `wdt:P279*` dari `wd:Q515`. |
| 5 | Pada `materialisasi_ulang.py`: Putaran 1 menghasilkan 4 triple baru (Person: 3); setelah Rina masuk, Person tetap 3; setelah dihitung ulang (Putaran 2), Person menjadi 4 dan `kampus_turunan.ttl` berisi 6 triple. |