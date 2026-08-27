# [Pertemuan 1](https://kelas.usu.ac.id/mod/googlemeet/view.php?id=194278 "Pertemuan 1") - Pengenalan Web Semantik

## 1. Eksplorasi Wikidata

Entitas yang dipilih adalah **Universitas Sumatera Utara (USU)**.

* **Nama entitas:** Universitas Sumatera Utara
* **Identifier Wikidata:** Q1377349
* **Deskripsi:** Universitas negeri di Kota Medan, Sumatera Utara, Indonesia
* **Negara:** Indonesia
* **Lokasi:** Medan, Sumatera Utara, Indonesia
* **Tahun berdiri:** 1952
* **Website:** https://www.usu.ac.id/

## 2. Entitas, Atribut, dan Relasi

| Informasi                              | Kategori   | Alasan                                                                                  |
| -------------------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| Universitas Sumatera Utara             | Entitas    | Merupakan objek atau individu yang dapat diidentifikasi secara unik dalam Wikidata.     |
| Q1377349                               | Identifier | Merupakan identifier unik Wikidata untuk Universitas Sumatera Utara.                    |
| Indonesia                              | Atribut    | Menunjukkan negara tempat Universitas Sumatera Utara berada.                            |
| Medan                                  | Atribut    | Menunjukkan lokasi Universitas Sumatera Utara.                                          |
| 1952                                   | Atribut    | Menunjukkan tahun berdirinya Universitas Sumatera Utara.                                |
| Website resmi USU                      | Atribut    | Menunjukkan alamat situs web resmi yang berkaitan dengan Universitas Sumatera Utara.    |
| Universitas Sumatera Utara → Indonesia | Relasi     | Menunjukkan hubungan antara entitas Universitas Sumatera Utara dengan negara Indonesia. |
| Universitas Sumatera Utara → Medan     | Relasi     | Menunjukkan hubungan antara entitas Universitas Sumatera Utara dengan lokasi Medan.     |

## 3. Eksplorasi Schema.org

| Property | Fungsi | Contoh Nilai |
| --- | --- | --- |
| `name` | Menyatakan nama universitas. | Universitas Sumatera Utara |
| `description` | Memberikan penjelasan/ringkasan profil. | Universitas negeri di Kota Medan, Sumatera Utara, Indonesia |
| `url` | Menyatakan alamat web resmi. | [https://www.usu.ac.id/](https://www.usu.ac.id/) |
| `address` | Menyatakan alamat fisik atau lokasi universitas. | Jl. Dr. Mansyur No.9, Medan, Sumatera Utara |
| `foundingDate` | Menyatakan tanggal atau tahun pendirian. | 1952-06-04 |
| `logo` | Menautkan URL ke berkas gambar logo resmi entitas. | [https://upload.wikimedia.org/wikipedia/commons/9/90/Logo_of_North_Sumatra_University.svg](https://upload.wikimedia.org/wikipedia/commons/9/90/Logo_of_North_Sumatra_University.svg) |
| `department` | Menyatakan unit/sub-organisasi internal, seperti fakultas. | Fakultas Ilmu Komputer dan Teknologi Informasi |
| `alumni` | Menyatakan lulusan atau tokoh terkenal dari lembaga pendidikan. | Yasonna Laoly |
| `award` | Menyatakan penghargaan, sertifikasi, atau akreditasi resmi. | Akreditasi Unggul BAN-PT |
| `knowsAbout` | Menyatakan bidang riset, keahlian, atau topik keunggulan utama. | Tropical Medicine, Agroindustry, Local Wisdom |

## 4. Pertanyaan Evaluasi

### 1. Apa perbedaan web tradisional dan Web Semantik?

**Jawaban:**
Web tradisional berfokus pada penyajian informasi agar dapat dibaca dan dipahami oleh manusia, sedangkan Web Semantik menambahkan struktur dan makna pada data agar dapat dipahami dan diproses oleh mesin. Dengan Web Semantik, komputer tidak hanya menampilkan informasi, tetapi juga dapat memahami hubungan antar data dan entitas sehingga informasi lebih mudah dihubungkan, dicari, dan diproses.

### 2. Mengapa entitas membutuhkan identifier unik?

**Jawaban:**
Entitas membutuhkan identifier unik agar dapat dibedakan secara jelas dari entitas lain. Nama yang sama dapat digunakan oleh beberapa entitas, sedangkan identifier unik seperti `Q1377349` secara khusus merujuk pada Universitas Sumatera Utara. Hal ini membantu menghindari ambiguitas ketika data dihubungkan dan diproses oleh komputer.

### 3. Jelaskan subject, predicate, dan object.

**Jawaban:**
Subject adalah entitas yang menjadi pokok informasi. Predicate adalah hubungan atau properti yang menjelaskan hubungan antara subject dan object. Object adalah nilai atau entitas yang berhubungan dengan subject.

Contohnya:

```text
Universitas Sumatera Utara → locatedIn → Medan
```

* **Subject:** Universitas Sumatera Utara
* **Predicate:** locatedIn
* **Object:** Medan

Ketiga bagian tersebut membentuk sebuah **triple** yang menjadi dasar representasi data dalam RDF.

### 4. Apa keuntungan hubungan antarentitas?

**Jawaban:**
- Informasi menjadi lebih terstruktur dan mudah diproses. Entitas dapat disimpan secara terpisah dan dapat direlasikan dengan lebih jelas, sedangkan teks biasa, informasi disimpan secara keseluruhan (gabung) sehingga sulit untuk dijalankan, karena harus dilakukan pemisahan informasi lagi. Dengan adanya entitas tentu lebih memudahkan untuk dapat melakukan pencarian dan penelusuran relasi. Misal, jika ditanyakan "universitas apa saja yang ada di Sumatera Utara?" maka kita bisa langsung menjawab dengan menelusuri relasi tersebut. Namun, apabia dari teks biasa, kita harus membaca dan mencari manual satu per satu, sehingga ini dianggap tidak efisien dikarenakan boros tenaga dan boros Waktu. 

- Menghindari terjadinya duplikasi data dan menjaga konsistensi data, maksudnya ialah dalam sebuah entitas suatu data telah direpresentasikan sebagai satu data (misal, id_mahasiswa), semua relasi yang menyangkut id_mahasiswa maka akan merujuk ke entitas yang sama melalui relasi (foreign key), kita dapat memastikan data yang tehubung memang valid. Kalau ditulis sebagai teks, biasanya akan berulang-ulang di banyak kalimat, informasi yang ada dapat membinggungkan atau menjadi tidak konsisten.

- Memudahkan kita untuk memperbarui data yang ada. Dengan adanya entitas kita cukup mengubahnya di satu tempat, sedangkan apabila dengan teks biasa maka kita harus mengubah secara keseluruhan.

### 5. Bagaimana Knowledge Graph membantu AI?

**Jawaban:**
Knowledge Graph membantu AI dengan menyediakan data yang terstruktur serta hubungan antarentitas. AI dapat menggunakan hubungan tersebut untuk memahami konteks, menemukan keterkaitan antar informasi, melakukan pencarian dan penalaran terhadap data, serta menghasilkan jawaban yang lebih relevan dan informatif.
