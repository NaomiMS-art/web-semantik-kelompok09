# Latihan Pertemuan 3 - JSON-LD dan Data Terstruktur

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

1. Perbedaan fungsi: ...
2. `@context`, `@type`, dan `@id`: ...
3. Node tanpa `@id`: ...

## 2. Peran schema.org

1. Alasan memilih tipe paling spesifik: ...
2. Nama properti dan bahasa alami: ...
3. Rangkuman format pada Rich Result: ...

## Tabel Bagian Salah | Alasan | Perbaikan

| No | Bagian Salah | Alasan | Perbaikan |
|----|--------------|--------|-----------|
| 1 | ... | ... | ... |
| 2 | ... | ... | ... |
| 3 | ... | ... | ... |
| 4 | ... | ... | ... |
| 5 | ... | ... | ... |

## 4. Tiga Kali Input dan JSON-LD Playground

Tuliskan satu baris untuk setiap bentuk:

**Teks**

ISI TRIPLE

## 5. Hasil Validasi

- Validasi Schema: ...
- Tes Hasil Lengkap: ...
- Tes Semantik JSON-LD: ...

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