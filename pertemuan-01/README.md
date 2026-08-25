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

| Property       | Fungsi                                                                     | Contoh Nilai                                                |
| -------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `name`         | Menyatakan nama suatu entitas.                                             | Universitas Sumatera Utara                                  |
| `description`  | Memberikan deskripsi mengenai suatu entitas.                               | Universitas negeri di Kota Medan, Sumatera Utara, Indonesia |
| `url`          | Menyatakan alamat URL suatu entitas.                                       | https://www.usu.ac.id/                                      |
| `address`      | Menyatakan alamat atau lokasi suatu entitas.                               | Medan, Sumatera Utara, Indonesia                            |
| `foundingDate` | Menyatakan tanggal atau tahun pendirian suatu entitas.                     | 1952                                                        |
| `identifier`   | Menyatakan identifier yang digunakan untuk mengidentifikasi suatu entitas. | Q1377349                                                    |

## 4. Pertanyaan Evaluasi

### 1. Apa perbedaan web tradisional dan Web Semantik?

**Jawaban:**
Web tradisional terutama menyajikan informasi agar dapat dibaca dan dipahami oleh manusia. Sementara itu, Web Semantik menambahkan struktur dan makna pada data sehingga informasi dapat dipahami, diproses, dan dihubungkan oleh mesin. Web Semantik memungkinkan komputer memahami hubungan antar data dan entitas, bukan hanya menampilkan teks atau halaman web.

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
Hubungan antarentitas memungkinkan informasi dari berbagai sumber untuk saling terhubung dan membentuk jaringan data. Dengan hubungan tersebut, komputer dapat menemukan keterkaitan antara berbagai entitas, melakukan penelusuran informasi, dan memperoleh konteks yang lebih lengkap.

### 5. Bagaimana Knowledge Graph membantu AI?

**Jawaban:**
Knowledge Graph membantu AI dengan menyediakan data yang terstruktur serta hubungan antarentitas. AI dapat menggunakan hubungan tersebut untuk memahami konteks, menemukan keterkaitan antar informasi, melakukan pencarian dan penalaran terhadap data, serta menghasilkan jawaban yang lebih relevan dan informatif.
