# Pertemuan 12 – Inferensi dan Penalaran

## Tujuan Praktikum

Praktikum ini bertujuan untuk memahami proses inferensi dan penalaran pada graf pengetahuan (*knowledge graph*) menggunakan aturan RDFS dan OWL RL. Melalui praktikum ini, mahasiswa mempelajari cara memperoleh fakta baru dari fakta yang sudah tersedia, membandingkan hasil beberapa profil penalaran, menggunakan Reasoner pada graf kampus, memanfaatkan hierarki kelas Wikidata, serta memeriksa konsistensi data.

## Langkah 1 - Closure dengan tangan

| # | Triple turunan | Aturan | Premis |
|---|----------------|--------|--------|
| 1 | `ex:budi a ex:Dosen` | rdfs2 | domain `ex:membimbing` + `ex:budi ex:membimbing ex:andi` |
| 2 | `ex:andi a ex:Mahasiswa` | rdfs3 | range `ex:membimbing` + `ex:budi ex:membimbing ex:andi` |
| 3 | `ex:budi ex:mengenal ex:andi` | rdfs7 | `ex:membimbing rdfs:subPropertyOf ex:mengenal` + `ex:budi ex:membimbing ex:andi` |
| 4 | `ex:sari a ex:Dosen` | rdfs9 | `ex:DosenTamu rdfs:subClassOf ex:Dosen` + `ex:sari a ex:DosenTamu` |
| 5 | `ex:DosenTamu rdfs:subClassOf ex:Pegawai` | rdfs11 | `ex:DosenTamu rdfs:subClassOf ex:Dosen` + `ex:Dosen rdfs:subClassOf ex:Pegawai` |
| 6 | `ex:Dosen rdfs:subClassOf ex:Orang` | rdfs11 | `ex:Dosen rdfs:subClassOf ex:Pegawai` + `ex:Pegawai rdfs:subClassOf ex:Orang` |
| 7 | `ex:budi a ex:Pegawai` | rdfs9 | `ex:Dosen rdfs:subClassOf ex:Pegawai` + `ex:budi a ex:Dosen` (#1) |
| 8 | `ex:sari a ex:Pegawai` | rdfs9 | `ex:Dosen rdfs:subClassOf ex:Pegawai` + `ex:sari a ex:Dosen` (#4) |
| 9 | `ex:andi a ex:Orang` | rdfs9 | `ex:Mahasiswa rdfs:subClassOf ex:Orang` + `ex:andi a ex:Mahasiswa` (#2) |
| 10 | `ex:DosenTamu rdfs:subClassOf ex:Orang` | rdfs11 | `ex:DosenTamu rdfs:subClassOf ex:Pegawai` (#5) + `ex:Pegawai rdfs:subClassOf ex:Orang` |
| 11 | `ex:budi a ex:Orang` | rdfs9 | `ex:Dosen rdfs:subClassOf ex:Orang` (#6) + `ex:budi a ex:Dosen` (#1) |
| 12 | `ex:sari a ex:Orang` | rdfs9 | `ex:Dosen rdfs:subClassOf ex:Orang` (#6) + `ex:sari a ex:Dosen` (#4) |

- Jumlah triple turunan bermakna: **12** (6 di putaran 1, 6 di putaran 2). Triple umum seperti `x a rdfs:Resource` dan `p a rdf:Property` serta triple refleksif tidak dihitung.
- Triple yang baru ditemukan di putaran kedua: **7 sampai 12** (`ex:budi a ex:Pegawai`, `ex:sari a ex:Pegawai`, `ex:andi a ex:Orang`, `ex:DosenTamu rdfs:subClassOf ex:Orang`, `ex:budi a ex:Orang`, `ex:sari a ex:Orang`), karena masing-masing membutuhkan minimal satu premis hasil putaran 1.
- Triple asserted yang tidak menurunkan apa pun, dan alasannya: `ex:andi a ex:MahasiswaBerprestasi`. Kelas `ex:MahasiswaBerprestasi` tidak punya `rdfs:subClassOf`, `rdfs:domain`, maupun `rdfs:range` di data, sehingga tidak ada aturan RDFS yang cocok dengan triple ini. Hubungan `ex:MahasiswaBerprestasi rdfs:subClassOf ex:Mahasiswa` tidak ada, dan RDFS tidak menyimpulkan keanggotaan ke arah sebaliknya.

## Langkah 2 – Tebak lalu Cek

Pada langkah ini, hasil inferensi diperkirakan terlebih dahulu, kemudian diperiksa menggunakan mesin Reasoner. Tujuannya adalah membandingkan pemahaman manual dengan hasil yang dihasilkan oleh sistem.

### Tabel Hasil Pengujian

| Graf | Profil | Tebakan | Hasil mesin | Penjelasan bila meleset |
|---|---|---|---|---|
| A | RDFS | `[Isi prediksi]` | `[Isi hasil mesin]` | `[Jelaskan perbedaan jika ada]` |
| B | OWL RL | `[Isi prediksi]` | `[Isi hasil mesin]` | `[Jelaskan perbedaan jika ada]` |
| C | RDFS | `[Isi prediksi]` | `[Isi hasil mesin]` | `[Jelaskan perbedaan jika ada]` |
| C | OWL RL | `[Isi prediksi]` | `[Isi hasil mesin]` | `[Jelaskan perbedaan jika ada]` |
| D | OWL RL | `[Isi prediksi]` | `[Isi hasil mesin]` | `[Jelaskan perbedaan jika ada]` |

### Analisis

RDFS dan OWL RL memiliki kemampuan inferensi yang berbeda. RDFS mendukung penalaran berdasarkan hierarki kelas, hierarki properti, domain, dan range. Sementara itu, OWL RL mendukung aturan yang lebih luas, termasuk beberapa aksioma OWL.

Perbedaan hasil antara tebakan dan hasil mesin dapat terjadi karena aturan yang diterapkan oleh Reasoner berbeda dari perkiraan awal. Selain itu, profil RDFS tidak menjalankan seluruh aksioma OWL. Oleh karena itu, pemilihan profil Reasoner harus disesuaikan dengan struktur dan kosakata yang digunakan dalam graf.

## Langkah 3 – Reasoner pada Graf Kampus

Pada langkah ini, Reasoner diterapkan pada graf kampus untuk menghasilkan triple baru berdasarkan hubungan dan aturan yang telah didefinisikan dalam ontologi.

### Sumber Data

- **Berkas sumber:** `[Isi nama berkas sumber]`.
- **IRI dasar graf:** `[Isi IRI dasar graf]`.
- **Profil Reasoner:** `[Isi profil yang digunakan]`.

### Hasil Inferensi

| Jenis data | Jumlah |
|---|---:|
| Triple ditegaskan (*asserted*) | `[Isi jumlah]` |
| Triple hasil penutupan (*closure*) | `[Isi jumlah]` |
| Triple disimpulkan (*inferred*) | `[Isi jumlah]` |
| Triple bermakna/unik | `[Isi jumlah]` |

### Triple Hasil Inferensi

- **Triple pada v4 yang tidak terdapat dalam graf ditegaskan:** `[Isi triple hasil perbandingan]`.

### Pengaruh Domain dan Range pada `ex:mengajar`

Domain dan range merupakan aturan yang digunakan untuk menyimpulkan tipe subjek dan objek dari suatu properti.

Misalnya, apabila didefinisikan:

```turtle
ex:mengajar rdfs:domain ex:Dosen ;
             rdfs:range ex:MataKuliah .
```

Kemudian terdapat triple:

```turtle
ex:DosenA ex:mengajar ex:Algoritma .
```

Reasoner dapat menyimpulkan bahwa:

```turtle
ex:DosenA rdf:type ex:Dosen .
ex:Algoritma rdf:type ex:MataKuliah .
```

Dengan demikian, penggunaan domain dan range memungkinkan Reasoner menambahkan informasi tipe individu tanpa harus menuliskannya secara langsung pada graf awal.

### Jika Menambahkan Dosis Baru

Jika menambahkan dosis atau data baru ke dalam graf, Reasoner perlu dijalankan kembali agar informasi tersebut ikut diproses dalam inferensi. Hasil penutupan sebelumnya belum tentu mencakup triple baru. Setelah proses inferensi selesai, hasil closure perlu diperbarui agar tetap sesuai dengan kondisi graf terbaru.

> Catatan: Jika istilah pada soal sebenarnya adalah *triple baru*, bukan *dosis baru*, bagian ini dapat disesuaikan menjadi penjelasan tentang penambahan triple baru ke graf.

## Langkah 4 – Wikidata

Pada langkah ini, hierarki kelas di Wikidata digunakan untuk memperoleh dan membandingkan hasil pencarian berdasarkan relasi subclass.

Properti `wdt:P279` pada Wikidata menunjukkan hubungan *subclass of*. Operator `*` pada property path SPARQL memungkinkan penelusuran hubungan tersebut secara berulang, termasuk hubungan langsung maupun tidak langsung.

### Hasil Query

| Keterangan | Hasil |
|---|---|
| Jumlah hasil query Q8 | `[Isi jumlah Q8]` |
| Jumlah hasil query Q9 | `[Isi jumlah Q9]` |
| Jumlah selisih | `[Isi selisih Q8 dan Q9]` |
| Salah satu subkelas yang menyumbang selisih | `[Isi nama subkelas]` |

### Analisis WDQS

WDQS (*Wikidata Query Service*) digunakan untuk menjalankan query SPARQL terhadap data Wikidata. Penelusuran hierarki dengan `wdt:P279*` dilakukan melalui property path pada saat query dijalankan.

**Kesimpulan:** `[Pilih dan jelaskan apakah hasil diperoleh melalui materialisasi, saat query dijalankan, atau keduanya berdasarkan mekanisme yang digunakan pada praktikum.]`

## Langkah 5 – Konsistensi

Pada langkah ini, pemeriksaan konsistensi dilakukan untuk mengetahui apakah terdapat pernyataan yang saling bertentangan dalam graf. Pemeriksaan dilakukan menggunakan profil RDFS dan OWL RL.

### Hasil Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| Pesan galat RDFS | `[Isi pesan galat atau tidak ada galat]` |
| Pesan galat OWL RL | `[Isi pesan galat atau tidak ada galat]` |
| Individu yang disebut dalam pesan | `[Isi nama individu]` |
| Kondisi setelah baris terbalik dihapus | `[Isi hasil pemeriksaan ulang]` |

### Pemeriksaan `laporan_kelas.csv`

| Kondisi | Isi laporan |
|---|---|
| Sebelum baris terbalik dihapus | `[Isi hasil atau jumlah laporan sebelum perbaikan]` |
| Sesudah baris terbalik dihapus | `[Isi hasil atau jumlah laporan sesudah perbaikan]` |

### Analisis

Pesan galat konsistensi dapat muncul ketika terdapat pernyataan yang bertentangan dengan aksioma atau batasan dalam ontologi. Salah satu penyebabnya adalah adanya relasi yang ditulis terbalik sehingga menghasilkan interpretasi yang tidak sesuai dengan definisi kelas atau properti.

Setelah baris yang terbalik dihapus, pemeriksaan perlu dijalankan kembali untuk mengetahui apakah konflik sudah terselesaikan. Perbandingan isi `laporan_kelas.csv` sebelum dan sesudah perbaikan membantu melihat perubahan hasil pemeriksaan.

### Dari Mana Dosen Menjadi Mata Kuliah?

Jika Reasoner menyimpulkan bahwa suatu individu yang sebelumnya dinyatakan sebagai dosen juga merupakan mata kuliah, kemungkinan terdapat aturan domain atau range yang diterapkan pada properti dengan arah yang tidak tepat.

Contohnya, apabila properti `ex:mengajar` memiliki domain `ex:MataKuliah`, maka setiap subjek dari triple yang menggunakan properti tersebut akan disimpulkan sebagai individu bertipe `ex:MataKuliah`. Jika subjek tersebut sebenarnya adalah dosen, hasil inferensi menjadi tidak sesuai dengan maksud model data.

Karena itu, definisi domain dan range harus diperiksa kembali agar sesuai dengan arah hubungan yang sebenarnya.

## Refleksi

### 1. Mengapa graf yang ditegaskan disimpan terpisah dari graf yang disimpulkan, dan apa akibatnya bila keduanya dicampur seperti `kampus_usu_v4.ttl`?

Graf yang ditegaskan (*asserted graph*) dan graf yang disimpulkan (*inferred graph*) sebaiknya disimpan secara terpisah agar dapat dibedakan antara fakta yang dimasukkan secara langsung dengan fakta yang diperoleh melalui proses inferensi Reasoner.

Pemisahan ini memudahkan proses pemeriksaan, pengelolaan, dan pembaruan data. Apabila keduanya dicampur, seperti pada `kampus_usu_v4.ttl`, akan sulit mengetahui apakah suatu triple merupakan fakta asli atau hasil inferensi. Selain itu, ketika proses inferensi dijalankan kembali, dapat terjadi duplikasi data dan kesulitan dalam melacak asal suatu informasi.

### 2. Pada Langkah 2, profil RDFS tidak memberi tahu bahwa aksioma OWL diabaikan. Bagaimana Anda memastikan profil yang dipakai sudah tepat untuk data Anda?

Untuk memastikan profil Reasoner yang digunakan sudah tepat, saya perlu memeriksa jenis ontologi, aturan, serta aksioma yang terdapat di dalam data.

Jika data hanya menggunakan konsep dasar seperti `rdfs:subClassOf`, `rdfs:subPropertyOf`, `rdfs:domain`, dan `rdfs:range`, profil RDFS sudah dapat digunakan.

Namun, apabila data menggunakan aksioma OWL seperti `owl:equivalentClass`, `owl:inverseOf`, atau karakteristik properti lainnya, saya perlu menggunakan profil OWL yang sesuai, misalnya OWL RL.

Saya juga dapat membandingkan hasil inferensi dari kedua profil untuk mengetahui apakah terdapat informasi yang tidak berhasil disimpulkan oleh profil RDFS.

### 3. Kapan Anda memilih menulis jalur seperti `wdt:P279*` di query, dan kapan memilih menjalankan Reasoner lalu menyimpan Closure?

Saya memilih menggunakan jalur `wdt:P279*` ketika hanya membutuhkan pencarian hubungan hierarki kelas secara langsung dalam query SPARQL, terutama ketika bekerja dengan Wikidata.

Sementara itu, saya memilih menjalankan Reasoner dan menyimpan *Closure* ketika membutuhkan hasil inferensi yang dapat digunakan berulang kali oleh berbagai query atau aplikasi.

Penggunaan `wdt:P279*` lebih praktis untuk kebutuhan pencarian tertentu, sedangkan Reasoner dan Closure lebih sesuai ketika membutuhkan kumpulan fakta hasil inferensi yang tersimpan dan dapat digunakan kembali.

## Kesimpulan

Berdasarkan praktikum Inferensi dan Penalaran, dapat dipahami bahwa Reasoner membantu memperoleh pengetahuan baru dari fakta dan aturan yang telah didefinisikan dalam graf pengetahuan. RDFS dan OWL RL memiliki kemampuan inferensi yang berbeda sehingga pemilihan profil harus disesuaikan dengan kebutuhan dan struktur ontologi.

Pemisahan graf yang ditegaskan dan graf hasil inferensi juga penting untuk menjaga keterlacakan data. Selain itu, penggunaan domain, range, hierarki subclass, serta pemeriksaan konsistensi membantu memastikan bahwa hasil inferensi sesuai dengan maksud model pengetahuan yang dibuat.
