# Pertemuan 11 - Tugas Mandiri: Dari Endpoint ke Graf Lokal

**NIM: 251402107**

Sumber: Pertemuan_11_Data, Wikidata Query Service, dan DBpedia SPARQL Endpoint. Bagian A dan B diuji melalui endpoint publik pada 28 November 2026.

## Bagian A - LIMIT dan triple

- Triple dengan LIMIT 10: **30 triple**.
- Triple dengan LIMIT 30: **90 triple**.
- Baris SELECT LIMIT 10 / kota berbeda: **10 baris / 10 kota berbeda**.
- Mengapa tidak selalu tepat 30 triple: LIMIT membatasi jumlah solution, bukan jumlah triple. Template CONSTRUCT mempunyai tiga pola, yaitu tipe kota, label, dan populasi. Pada pengujian ini LIMIT 10 menghasilkan 30 triple dan LIMIT 30 menghasilkan 90 triple. Hasil SELECT menunjukkan 10 IRI kota berbeda. Namun, jika beberapa solution menghasilkan triple identik, graf RDF menggabungkannya menjadi satu triple sehingga hasilnya dapat kurang dari 30. Query tanpa ORDER BY juga tidak menjamin urutan atau pilihan kota yang sama pada setiap eksekusi.
- Bukti: `screenshots/a-limit10.png`.

## Bagian B - DBpedia ke Turtle

- Output `demo_c.py`: **48 triple**, film tanpa tanggal: **16**.
- Sumber data: DBpedia SPARQL Endpoint, menggunakan `q_demo_b.rq`. Hasil CONSTRUCT disimpan ke `film_nolan.ttl` dalam format Turtle.
- Triple yang tetap tercetak untuk film tanpa tanggal: misalnya `dbr:Inception` memiliki `rdf:type schema:Movie`, `schema:name "Inception"@en`, dan `schema:director dbr:Christopher_Nolan`. Triple `schema:datePublished` tidak tercetak karena `?rilis` tidak terikat dalam OPTIONAL. Film tetap muncul meskipun tanggal tidak tersedia dari pola query tersebut.
- Query lokal tanpa internet: bagian akhir `demo_c.py` membuka kembali `film_nolan.ttl` dan menjalankan SELECT dengan FILTER NOT EXISTS. Hasilnya 16 film tanpa tanggal. Mode `python demo_c.py --lokal` dapat digunakan untuk mengulangi query pada berkas yang sudah disimpan tanpa menghubungi DBpedia kembali.
- Mengapa `dbo:Film` memberi 0 pada `film_nolan.ttl`: hasil CONSTRUCT memetakan tipe `dbo:Film` menjadi `schema:Movie`; predikat tanggal dipetakan dari `dbo:releaseDate` menjadi `schema:datePublished`. Query terhadap tipe pada skema lama tidak cocok dengan graf keluaran.
- Bukti: `screenshots/b-dbpedia.png`.

## Bagian C - Materialisasi

- Output `demo_d.py`: Sebelum: 0; Sesudah: 3; Ada Rina: 3.
- Mengapa Ada Rina bernilai 3: Rina ditambahkan dengan tipe `ex:DosenTetap` setelah CONSTRUCT pertama. Meski rantai subkelas menyatakan DosenTetap -> Dosen -> foaf:Person, SELECT tipe eksplisit tidak menjalankan inferensi otomatis. Karena aturan belum diulang, Rina belum mempunyai triple eksplisit `a foaf:Person`.
- Output `materialisasi_ulang.py`: Putaran 1: 4 triple baru | Person: 3; Rina masuk | Person: 3; Putaran 2 | Person: 4; Triple turunan disimpan terpisah: 6.
- Tiga triple yang bukan baru pada putaran pertama: `ex:budi a ex:DosenTetap`, `ex:sari a ex:Dosen`, dan `ex:andi a ex:Mahasiswa`. Jalur `rdfs:subClassOf*` mengizinkan nol langkah sehingga tipe awal ikut muncul. Dari tujuh triple hasil CONSTRUCT, empat merupakan inferensi baru.
- Kegunaan `kampus_turunan.ttl` dan langkah manual yang tersisa: berkas ini berisi enam triple inferensi dari kedua putaran, terpisah dari data awal. Jika taksonomi berubah, inferensi lama bisa dibuang dan dihitung ulang dari fakta dasar dan aturan terkini. Perubahan aturan tidak otomatis menghapus triple lama dari graf produksi; pengelola harus menghapus hasil materialisasi sebelumnya, membangun kembali graf, lalu memvalidasinya. `kampus_v4.ttl` mula-mula dihasilkan Demo D sebelum penambahan Rina, kemudian diperbarui oleh `materialisasi_ulang.py` sesuai nama keluaran pada instruksi C2.
- Bukti: `screenshots/c-materialisasi.png`.

## Bagian D - Diagnosis

| Query | Hasil mesin | Gejala | Penyebab (baris yang salah) | Hasil setelah diperbaiki |
|---|---:|---|---|---:|
| rusak_a.rq | 0 triple | Graf kosong tanpa error | Template `?film ex:judul ?j` menggunakan `?film`, sedangkan WHERE mengikat `?f`. Ganti `?film` dengan `?f`. | 3 triple: Following, Insomnia, Memento |
| rusak_b.rq | 4 triple | Dua nilai nama untuk orang yang sama | Jalur `foaf:name\|rdfs:label\|schema:name` menghasilkan dua literal Nolan dengan teks sama namun tag bahasa berbeda. Tambahkan `BIND(STR(?n) AS ?nama)` dan gunakan `?nama` pada template. | 3 triple: Christopher Nolan, Joko Anwar, Mira Lesmana |
| rusak_c.rq | 0 triple | Superkelas tidak ditemukan | WHERE `?x a ex:Permukiman` hanya mencari tipe langsung. Ganti dengan `?x a/rdfs:subClassOf* ex:Permukiman`. | 3 triple: Medan, Surabaya, Tomok |

Perbaikan B menormalisasi tag bahasa pada data latihan sehingga tepat satu nama per orang. Jika pada data lain satu orang memiliki dua teks nama yang berbeda, STR saja tidak menjamin satu nama; perlu prioritas atau aturan pemilihan tambahan.

## Bagian E - Etika dan diskusi

| Aturan | a_kota_limit.rq | demo_c.py |
|---|---|---|
| 1 User-Agent | Query SPARQL tidak mengatur header HTTP; gunakan browser atau klien dengan identitas dan kontak yang benar. | `UA = "KelasWebSemantik/1.0 (muhammadrajadinata@students.usu.ac.id)"` dan `agent=UA`; kontak kampus telah diisi. |
| 2 LIMIT | `LIMIT 10` membatasi solution pada eksplorasi. | `q_demo_b.rq` asli tidak memakai LIMIT karena mengambil kumpulan film dari satu sutradara tertentu. Untuk eksplorasi endpoint, tambahkan LIMIT pada salinan query. |
| 3 Simpan, jangan ulangi | Hasil CONSTRUCT dapat diunduh sebagai Turtle untuk digunakan kembali tanpa meminta data yang sama ke endpoint. | `g.serialize("film_nolan.ttl", format="turtle")`; mode `--lokal` membaca berkas tanpa endpoint. |
| 4 Jangkar jalur | `wdt:P31/wdt:P279* wd:Q515` mempunyai jangkar IRI wd:Q515; negara juga dibatasi wd:Q252. | Query asli tidak memakai jalur `*`/`+`; `dbo:director dbr:Christopher_Nolan` membatasi pencarian. |

Versi pelanggaran aturan 4 (contoh tertulis saja; **tidak dijalankan**):

```sparql
PREFIX ex: <http://contoh.id/>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
CONSTRUCT { ?kota a ex:Kota ; rdfs:label ?namaKota ; ex:populasi ?populasi . }
WHERE {
  ?kota wdt:P31/wdt:P279* ?kelas ;
        wdt:P17 wd:Q252 ; wdt:P1082 ?populasi ; rdfs:label ?namaKota .
  FILTER(LANG(?namaKota) = "id")
}
LIMIT 10
```

Jalur dengan kedua ujung variabel menghilangkan jangkar kelas Q515. Endpoint dapat perlu menelusuri lebih banyak pasangan kelas dan entitas, menghasilkan solusi tambahan serta meningkatkan pekerjaan join. LIMIT tidak menjamin penelusuran di dalam WHERE menjadi murah.

### Diskusi 1 - Taksonomi berubah

Apabila hasil materialisasi Demo D disimpan pada graf produksi, perubahan taksonomi dapat membuat sebagian triple turunan tidak lagi benar. Sebagai contoh, apabila hubungan `ex:Dosen rdfs:subClassOf foaf:Person` dihapus dan tidak ada jalur pengganti, maka `ex:budi a foaf:Person`, `ex:sari a foaf:Person`, dan setelah materialisasi ulang `ex:rina a foaf:Person` menjadi tidak didukung oleh aturan tersebut. Triple `ex:andi a foaf:Person` tetap didukung oleh hubungan Mahasiswa ke Person. Ini adalah skenario perubahan, bukan perubahan yang dilakukan pada data asli.

Pada hasil C1, sebelum diperbarui oleh C2, `kampus_v4.ttl` mencampur fakta awal dengan empat triple baru. Jumlah Person berubah dari nol menjadi tiga, tetapi Rina yang ditambahkan setelahnya belum terhitung. Pada C2, `kampus_turunan.ttl` memisahkan enam triple inferensi dari kedua putaran. Pemisahan tersebut memudahkan pengelola mengetahui bagian mana yang perlu dibuang dan dibangun ulang tanpa menghapus fakta awal. Untuk menemukan triple yang salah, saya akan membangun graf dari data sumber dengan taksonomi terbaru, menjalankan aturan CONSTRUCT kembali, lalu membandingkan hasil baru dengan kumpulan triple inferensi sebelumnya. Selisih triple lama yang tidak ada di hasil baru merupakan kandidat yang harus dihapus setelah memeriksa apakah masih ada jalur lain yang mendukungnya. Dengan demikian, data tetap konsisten meskipun aturan kelas berubah.

### Diskusi 2 - SELECT atau CONSTRUCT

Untuk dashboard populasi kota, saya memilih SELECT karena hasil yang diperlukan berupa tabel nama kota dan nilai populasi. Dalam pengujian Bagian A, SELECT LIMIT 10 menghasilkan sepuluh baris dengan sepuluh IRI kota yang berbeda. Data tersebut dapat langsung ditampilkan sebagai tabel atau grafik. Meskipun demikian, jumlah baris tidak selalu sama dengan jumlah kota karena satu kota dapat memiliki lebih dari satu nilai populasi atau label. Oleh karena itu, dashboard sebaiknya menggunakan IRI sebagai identitas kota dan menerapkan aturan pemilihan nilai populasi apabila ditemukan beberapa nilai. Jika tersedia tanggal pencatatan, informasi tersebut juga perlu dipertimbangkan agar angka yang ditampilkan tidak menyesatkan.

Untuk menggabungkan data kota dari tiga sumber, saya memilih CONSTRUCT karena hasilnya berupa graf RDF dengan skema predikat yang seragam. Pada pengujian Bagian A, LIMIT 10 menghasilkan 30 triple dan LIMIT 30 menghasilkan 90 triple. Graf dapat disimpan dalam format Turtle dan digunakan kembali secara lokal. Bagian D menunjukkan bahwa penggabungan data juga perlu memperhatikan perbedaan bentuk literal. Pada `rusak_b.rq`, terdapat empat triple untuk tiga orang karena nama Nolan muncul dengan dan tanpa tag bahasa. Setelah menggunakan STR pada `perbaikan_b.rq`, jumlahnya menjadi tiga triple. Dengan demikian, penyatuan skema harus disertai pemeriksaan identitas dan nilai ganda. SELECT kemudian dapat digunakan untuk mengambil data dari graf gabungan sesuai kebutuhan dashboard.

### Cek diri

| Pernyataan | Bukti dari tugas ini |
|---|---|
| 1 | A: LIMIT 10 menghasilkan 30 triple dan LIMIT 30 menghasilkan 90 triple; SELECT menghasilkan 10 baris dari 10 kota berbeda. Triple identik pada graf RDF dapat bergabung. |
| 2 | B: 48 triple dan 16 film tanpa tanggal; triple yang memakai ?rilis tidak dicetak jika variabel tak terikat. D: rusak_a menghasilkan 0 tanpa error. |
| 3 | D: VALUES membatasi tiga orang dan jalur alternatif menyatukan tiga predikat nama; 4 triple menjadi 3 setelah STR. UNION dapat menyatakan alternatif yang setara untuk pola ini. |
| 4 | D: jalur `rdfs:subClassOf*` menemukan 3 permukiman, dibandingkan 0 pada pencarian tipe langsung. |
| 5 | C: Person 0 -> 3; setelah Rina masuk masih 3; materialisasi ulang menghasilkan 4 Person dan total 6 triple inferensi tersimpan. |

## Cara menjalankan

Dari folder `251402107`:

```bash
python -m pip install rdflib sparqlwrapper
python demo_c.py
python demo_c.py --lokal
python demo_d.py
python materialisasi_ulang.py
python jalankan.py film.ttl rusak_a.rq
python jalankan.py film.ttl perbaikan_a.rq
python jalankan.py film.ttl rusak_b.rq
python jalankan.py film.ttl perbaikan_b.rq
python jalankan.py kota.ttl rusak_c.rq
python jalankan.py kota.ttl perbaikan_c.rq
```
