# Pertemuan 11 - KONSTRUKSI dan Hierarki Data

## Langkah 1 - Solusi menjadi triple

| Solusi | ?d | ?mk | Tiga yang dicetak |
|--------|----|-----|-------------------|
| 1 | budi | tif2108 | `ex:tif2108 a ex:MatakuliahAktif`<br>`ex:tif2108 ex:diampuOleh ex:budi` |
| 2 | sari | tif2108 | `ex:tif2108 a ex:MatakuliahAktif`<br>`ex:tif2108 ex:diampuOleh ex:sari` |
| 3 | ida | tif2104 | `ex:tif2104 a ex:MatakuliahAktif`<br>`ex:tif2104 ex:diampuOleh ex:ida` |

- Jumlah solusi: **3**
- Jumlah cetakan tiga kali lipat: **6 triple** (3 solusi × 2 pola template).
- Jumlah tiga kali lipat dari hasil grafik: **5 triple unik**.
- Triple yang tercetak lebih dari sekali: **`ex:tif2108 a ex:MatakuliahAktif`**, karena muncul pada solusi 1 dan solusi 2. Di dalam graf hasil, triple identik tersebut hanya disimpan satu kali.

## Langkah 2 - Tebak lalu cek

| Garam | Tebakan | Hasil mesin | Penjelasan bila meleset |
|------|---------|-------------|-------------------------|
| A | [isi] | [isi] | [isi] |
| B | [isi] | [isi] | [isi] |
| C | [isi] | [isi] | [isi] |

## Langkah 3 - Graf kampus lokal

- Berkas sumber dan IRI dasar grafik: [isi]
- Nama kelas dosen dan properti: [isi]
- Tiga kali lipat hasil pemetaan: [isi]
- `foaf:Organization` sebelum / sesudah: [isi] / [isi]
- Triple asli vs triple turunan: [jawaban]
- Dosen baru setelah program selesai: [isi]

## Langkah 4 - Wikidata

- Jumlah triple Q6: [isi]
- Jumlah baris Q6 versi PILIH: [isi]
- Penjelasan perbedaan: [isi]
- Q7 dengan `+` vs `*`: [isi]
- Kelas yang mengejutkan dan mengejutkan: [isi]

## Langkah 5 - Graf dari Python

- Jumlah tiga kali lipat `universitas.ttl`: [isi]
- Jumlah baris `universitas_per_kota.csv`: [isi]
- `setReturnFormat(TURTLE)`: [isi]
- `Graph().parse(data=...)`: [isi]
- Mengapa `q_kota` tidak memanggil endpoint: [isi]

## Refleksi

1. **Mengapa jumlah triple hasil CONSTRUCT bisa lebih kecil dari jumlah baris SELECT dengan WHERE yang sama?**

   Karena `SELECT` menghasilkan baris untuk setiap solusi atau kombinasi variabel yang cocok dengan pola `WHERE`. Jika dua solusi menghasilkan triple yang sama dari template `CONSTRUCT`, graf RDF hanya menyimpan satu salinan triple tersebut. Jadi, jumlah baris `SELECT` atau jumlah triple yang dicetak dari semua solusi bisa lebih banyak daripada jumlah triple unik pada graf hasil `CONSTRUCT`.

2. Bila taksonomi di grafik kampus Anda berubah bulan depan, apa yang terjadi pada triple turunan di `kampus_usu_v4.ttl`?

   [isi]

3. Kapan Anda menyimpan hasil query sebagai tabel (CSV), dan kapan sebagai graf (Turtle)?

   [isi]
