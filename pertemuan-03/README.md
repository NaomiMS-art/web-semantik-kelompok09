Latihan Pertemuan 3 - JSON-LD dan Data Terstruktur

## Identitas

| No. | Nama                               | NIM       | 
| --- | ---------------------------------- | --------- | 
| 1   | **Rodotua Naomi Mutiara Simamora** | 251402030 |
| 2   | **Vedder Timothy Simbolon**        | 251402072 | 
| 3   | **Yessica Jaklin**                 | 251402001 | 
| 4   | **M. Rajadinata Nasution**         | 251402107 | 
| 5   | **Daradira Vonna**                 | 251402026 | 

## Struktur

- `profil-saya.jsonld`
- `pertemuan-03/seminar.html`
- `seminar.html`
  - tangkapan layar

## 1. JSON Biasa dan JSON-LD

1. Perbedaan fungsi kunci `nama` / `pekerjaan` dan `name` / `jobTitle` adalah:
   Pada JSON biasa, `nama` dan `pekerjaan` hanya merupakan nama kunci yang maknanya ditentukan oleh aplikasi atau pembuat data. Sedangkan pada JSON-LD, `name` dan `jobTitle` merupakan properti yang memiliki makna semantik berdasarkan kosakata seperti Schema.org sehingga dapat dipahami oleh mesin.
   
2. Fungsi `@context`, `@type`, dan `@id` adalah:
   a. `@context` menentukan kosakata yang digunakan dan memberikan konteks terhadap properti dalam JSON-LD.
   b. `@type` menentukan tipe atau jenis entitas yang dideskripsikan, misalnya `Person`.
   c. `@id` memberikan identitas unik berupa IRI/URL sehingga suatu entitas dapat dikenali dan dirujuk secara konsisten.
   
3. Node tanpa `@id` adalah:
   Node tanpa `@id` tetap dapat digunakan dan memiliki informasi berdasarkan `@type` dan properti yang dimilikinya. Namun, node tersebut tidak memiliki identitas global yang unik sehingga tidak dapat dirujuk dengan mudah dari bagian lain data.
   
## 2. Peran schema.org

1. Alasan memilih tipe paling spesifik: ...
2. Nama properti dan bahasa alami: ...
3. Rangkuman format pada Rich Result: ...

## 3. Perbaikan Lima Kesalahan

| No | Bagian Salah | Alasan | Perbaikan |
|----|--------------|--------|-----------|
| 1 | "person" | Tipe di Schema.org menggunakan huruf kapital | "@type": "**Person**" |
| 2 | 'name' | JSON-LD harus menggunakan tanda kutip ganda | **"**name**"**: "Rina Anggraini" |
| 3 | "12 September 2004" | Penulisan tanggal wajib menggunakan format tanggal ISO 8601 | "birthDate": "**2004-09-12**" |
| 4 | "nomorInduk" | Properti tersebut tidak terdaftar di Schema.org, harus diganti | "**identifier**": "221401001" |
| 5 | "221401001", | Koma pada properti terakhir harus dihapus karena tidak valid dalam JSON-LD | "identifier": **"221401001"** |

## 4. Triplet dari JSON-LD Playground
satu baris N-Quads yang terbentuk:
### Isi Triple
<https://usu.ac.id/mhs/251402001> <http://schema.org/name> "Yessica Jaklin" .

## 5. Hasil Validasi

- Schema Markup Validator: Valid. `profil_saya.jsonld` berhasil divalidasi dengan 0 error dan 0 warning.
  
- Rich Result Test: `seminar.html` berhasil dikenali sebagai **Event**. Terdapat **8 masalah non-kritis** berupa properti opsional yang belum dicantumkan.
  
- JSON-LD Playground: `profil_saya.jsonld` berhasil diproses dan menghasilkan struktur JSON-LD pada bagian **Expanded**.
  
## 6. Refleksi

### 1. Apa perbedaan fungsi Schema Markup Validator dan Rich Results Test?

Schema Markup Validator digunakan untuk memeriksa apakah struktur data terstruktur, seperti JSON-LD, sudah ditulis dengan benar sesuai standar schema.org. Validator ini dapat mendeteksi kesalahan pada properti, tipe data, maupun struktur schema yang digunakan.

Sedangkan Rich Results Test digunakan untuk memeriksa apakah data terstruktur pada halaman web memenuhi syarat untuk ditampilkan sebagai rich results di Google. Jadi, sebuah JSON-LD dapat saja valid secara struktur pada Schema Markup Validator, tetapi belum tentu memenuhi persyaratan untuk menghasilkan rich results.

### 2. Mengapa `@id` harus sama dengan konten yang terlihat di halaman?

`@id` digunakan sebagai identitas unik untuk suatu entitas dalam JSON-LD. Informasi yang terdapat pada data terstruktur harus sesuai dengan konten yang benar-benar terlihat di halaman agar tidak terjadi perbedaan informasi antara data untuk mesin dan data untuk pengunjung.

Dengan demikian, mesin pencari dapat memahami bahwa data JSON-LD benar-benar merepresentasikan konten pada halaman tersebut. Jika informasi JSON-LD berbeda dengan isi halaman, data tersebut dapat dianggap tidak konsisten atau menyesatkan.

## Bukti

![Validator Markup Schema](screenshots/profil-schema-validator.png)

![Teman Seminar](screenshots/profil-peserta.png)

![Tes Hasil Kaya](screenshots/seminar-rich-results.png)
