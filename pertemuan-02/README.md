# Pertemuan 2 — Format Dokumen XML

## 1. Profil XML

Jelaskan secara singkat struktur XML yang dibuat, meliputi:

* Elemen root.
* Elemen-elemen di dalam root.
* Atribut yang digunakan.
* Hubungan antar elemen.
* Struktur data yang disimpan dalam XML.

---

## 2. Analisis Kesalahan XML

Identifikasi kesalahan yang terdapat pada dokumen XML dan jelaskan alasan serta perbaikannya.

| No. | Bagian yang Salah | Alasan | Perbaikan |
| :-: | ----------------- | ------ | --------- |
|  1  | <<nama>>Budi Santoso</Nama>  | Tag elemen penutup salah karena menggunkan huruf kapital di awal kata. Hal ini bertentangan dengan aturan well-formed bersifat case-sensitive, dimana Nama != nama |<nama>Budi Santoso</nama>|
|  2  |<angkatan>2024|Elemen angkatan tidak memiliki tag penutup|<angkatan>2024</angkatan>|
|  3  |<deskripsi>Saya suka AI & Web Semantik</deskripsi>|Dalam aturan XML karakter &/ampersand tidak boleh digunakan langsung karena merupakan karakter khusus|<deskripsi>Saya suka AI &amp; Web Semantik</deskripsi>|

---

## 3. Analisis XML Schema (XSD)

Analisis struktur dan tipe data yang digunakan dalam XML Schema.

1. **Root Element:** ...
2. **Tipe Data `judul`:** ...
3. **Tipe Data `tahun`:** ...
4. **Tipe Data `harga`:** ...
5. **Atribut `ISBN`:** ...

---

## 4. Analisis Namespace

Jawab pertanyaan berikut berdasarkan penggunaan namespace pada dokumen XML.

1. **Mengapa kedua elemen `title` tidak dianggap sama?**
   ...

2. **Apa fungsi prefix pada namespace?**
   ...

3. **Apa fungsi `xmlns`?**
   ...

4. **Apakah URI namespace harus dapat dibuka di browser?**
   ...

---

## 5. Pertanyaan Evaluasi

### 5.1 Perbedaan XML dan HTML

**Jawaban:**
...

### 5.2 Apa yang Dimaksud dengan Well-Formed?

**Jawaban:**
...

### 5.3 Perbedaan Well-Formed dan Valid

**Jawaban:**
...

### 5.4 Mengapa XSD Lebih Kuat Dibandingkan DTD?

**Jawaban:**
...

### 5.5 Mengapa Namespace Penting?

**Jawaban:**
...

### 5.6 Apa Kegunaan XPath?

**Jawaban:**
XPath merupakan dasar XSLT, XQuery, dan library. XPath ini berfungsi untuk navigasi, memilih, dan mencari bagian elem/atribut tertentu. XPath membantu untuk menentukan lokasi data berdasarkan struktur hierarki XML, sehingga data dapat diakses dengan lebih mudah dan spesifik. Seperti halnya, dalam katalog buku, terdapat hierarki mulau dari semua bukuu, kemudian semua judul, buku pertama (index), atribut isbn-nya, lalu Harga, dan nilai dari text dalam buku tersebut.Dengan XPath, kita dapat memilih elemen, atribut, atau bagian tertentu dari XML katalog tersebut secara lebih terarah.

---

## 6. Kesimpulan

Tuliskan kesimpulan singkat mengenai pembelajaran pada Pertemuan 2, khususnya mengenai:

* Struktur dokumen XML.
* Konsep well-formed dan valid.
* XML Schema (XSD).
* Namespace.
* XPath.

