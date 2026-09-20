# Pertemuan 4 — Metadata dan Interoperabilitas

Tautan folder: https://github.com/NaomiMS-art/web-semantik-kelompok09/tree/main/pertemuan-04

## Identitas sumber
- Judul: Mengenal Metadata Sumber Belajar dengan Dublin Core, Turtle, dan JSON-LD
- Pembuat: Rodotua Naomi Mutiara Simamora
- URI sumber: https://naomims-art.github.io/web-semantik-kelompok09/251402030/sumber-belajar
- Jenis sumber: Teks (artikel pengantar)

## Pemetaan Dublin Core
| Properti | Nilai | Alasan pemilihan |
| --- | --- | --- |
| dcterms:title | Mengenal Metadata Sumber Belajar dengan Dublin Core, Turtle, dan JSON-LD | Nama sumber adalah identitas paling dasar yang dicari pengguna. |
| dcterms:creator | Rodotua Naomi Mutiara Simamora | Menunjukkan pihak yang membuat sumber sehingga bisa dirujuk dan dimintai pertanggungjawaban. |
| dcterms:description | Pengantar singkat tentang metadata sumber belajar ... Turtle dan JSON-LD. | Ringkasan membantu orang dan mesin menilai relevansi sumber tanpa membuka isinya. |
| dcterms:created | 2026-09-20 | Tanggal dibuat (ISO 8601) menunjukkan seberapa baru sumber ini. |
| dcterms:type | Teks | Menjelaskan bentuk sumber sehingga bisa disaring berdasarkan jenis. |
| dcterms:language | id | Menunjukkan bahasa sumber (Indonesia) agar cocok dengan kebutuhan pembaca. |
| dcterms:rights | CC BY 4.0 | Menyatakan syarat penggunaan ulang sumber. |

Perbedaan dcterms:creator dan dcterms:publisher: creator adalah pihak yang membuat isi sumber, sedangkan publisher adalah pihak yang menerbitkan atau menyediakannya. Pada latihan ini keduanya orang yang sama, sehingga publisher tidak dipakai.

## Hasil validasi
- JSON-LD Playground: [isi setelah menjalankan] — target: tidak ada galat sintaks dan subjek URI yang sama dengan Turtle muncul pada tampilan triple.
- Validator Markup Skema: [isi setelah menjalankan] — target: tipe LearningResource terdeteksi tanpa galat.
- Bukti: screenshots/jsonld-playground.png dan screenshots/schema-validator.png

## Refleksi
1. Mengapa URI sama penting untuk Turtle dan JSON-LD?
   URI adalah identitas sumber. Jika URI sama, sistem lain tahu bahwa pernyataan di Turtle dan JSON-LD membicarakan satu sumber yang sama dan dapat menggabungkannya. Jika berbeda, keduanya dianggap dua sumber terpisah.
2. Apa perbedaan peran DC Terms dan Schema.org pada pekerjaan ini?
   DC Terms dipakai untuk deskripsi metadata sumber yang bersifat umum dan baku di dunia perpustakaan dan repositori (Turtle dan JSON-LD pertama). Schema.org dipakai agar sumber dikenali mesin pencari dan validator markup, dengan tipe LearningResource yang lebih spesifik untuk materi belajar.
3. Satu risiko jika metadata HTML, Turtle, dan JSON-LD tidak konsisten:
   Sistem yang mengumpulkan data bisa menemukan judul, pembuat, atau tanggal yang saling bertentangan, sehingga sulit menentukan mana yang benar. Sumber bisa salah tercatat atau gagal digabungkan dengan data lain.

## Catatan akhir
Metadata sumber ini konsisten di HTML, Turtle, dan JSON-LD. Judul, pembuat, deskripsi, tanggal (2026-09-20), jenis (Teks), bahasa (id), dan lisensi (CC BY 4.0) bernilai sama di semua file, dan isi halaman `sumber-belajar.html` sejalan dengan metadata di bagian `head`. Turtle dan JSON-LD memakai URI subjek yang sama, sehingga keduanya menghasilkan graf RDF yang setara. Berkas `metadata-schema.jsonld` memakai kosakata schema.org (LearningResource) untuk sumber dan URI yang sama, dengan pemetaan `name`, `description`, `inLanguage`, `dateCreated`, dan `license`. Bentuk penulisannya berbeda: lisensi di skema ditulis sebagai URL CC BY 4.0, sedangkan di DC berupa teks "CC BY 4.0", tetapi maknanya sama.
