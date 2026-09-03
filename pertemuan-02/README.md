# Pertemuan 2 — Format Dokumen XML

## 1. Profil XML

Jelaskan secara singkat struktur XML yang dibuat, meliputi:

* Elemen root: merupakan elemen paling luar dan menjadi induk dari seluruh elemen lainnya.
* Elemen-elemen di dalam root: berisi data atau informasi yang ingin disimpan, seperti nama, angkatan, deskripsi, dan elemen lainnya sesuai struktur XML.
* Atribut yang digunakan: atribut digunakan untuk memberikan informasi tambahan pada suatu elemen, misalnya id, ISBN, atau atribut lainnya.
* Hubungan antar elemen: elemen-elemen XML memiliki hubungan hierarkis, yaitu elemen yang berada di dalam elemen lain disebut sebagai elemen anak (child), sedangkan elemen yang membungkusnya disebut elemen induk (parent).
* Struktur data: data disimpan secara terstruktur dan hierarkis menggunakan elemen, atribut, serta nilai (text content). Struktur ini membuat data dapat dibaca dan diproses oleh manusia maupun komputer.

---

## 2. Analisis Kesalahan XML

Identifikasi kesalahan yang terdapat pada dokumen XML dan jelaskan alasan serta perbaikannya.

| No. | Bagian yang Salah | Alasan | Perbaikan |
|:-:|---|---|---|
| 1 | `<nama>Budi Santoso</Nama>` | Tag elemen penutup salah karena menggunakan huruf kapital di awal kata. Hal ini bertentangan dengan aturan *well-formed* yang bersifat *case-sensitive*, di mana `Nama != nama`. | `<nama>Budi Santoso</nama>` |
| 2 | `<angkatan>2024` | Elemen `angkatan` tidak memiliki tag penutup. | `<angkatan>2024</angkatan>` |
| 3 | `<deskripsi>Saya suka AI & Web Semantik</deskripsi>` | Dalam aturan XML, karakter `&` (ampersand) tidak boleh digunakan langsung karena merupakan karakter khusus. | `<deskripsi>Saya suka AI &amp; Web Semantik</deskripsi>` |

---

## 3. Analisis XML Schema (XSD)

Analisis struktur dan tipe data yang digunakan dalam XML Schema.

1. **Root Element:** buku
2. **Tipe Data `judul`:** string
3. **Tipe Data `tahun`:** gYear
4. **Tipe Data `harga`:** decimal
5. **Apakah atribut `ISBN` boleh tidak dituliskan?:** Tidak, karena atribut `ISBN` menggunakan `use="required"` sehingga mutlak harus ada. Jika tidak, maka dokumen XML tidak akan valid karena tidak sesuai dengan skema.

---

## 4. Analisis Namespace

Jawab pertanyaan berikut berdasarkan penggunaan namespace pada dokumen XML.

1. **Mengapa kedua elemen title tersebut tidak dianggap sama?**
   Karena kedua elemen title tersebut berada pada namespace yang berbeda. Elemen pertama menggunakan namespace buku, sedangkan elemen kedua menggunakan namespace web, sehingga walaupun nama elemennya sama, keduanya tetap dianggap berbeda.

2. **Apa fungsi prefix buku: dan web:?**
   Prefix buku: dan web: digunakan untuk membedakan elemen yang berasal dari namespace atau kosakata yang berbeda. Prefix tersebut menjadi penanda agar sistem mengetahui elemen itu berasal dari namespace yang mana.

3. **Apa fungsi atribut xmlns?**
   Atribut xmlns digunakan untuk mendeklarasikan namespace dan menghubungkan suatu prefix dengan URI tertentu. Contohnya, xmlns:buku menghubungkan prefix buku: dengan URI namespace buku.

4. **Apakah URI namespace harus dapat dibuka sebagai halaman web? Jelaskan.**
   Tidak. URI pada namespace hanya berfungsi sebagai identifier atau identitas unik untuk suatu namespace. Jadi, URI tersebut tidak harus dapat dibuka di browser sebagai halaman web.

---

## 5. Pertanyaan Evaluasi

### 5.1 Perbedaan XML dan HTML

**Jawaban:**
   XML (eXtensible Markup Language) dan HTML (HyperText Markup Language) sama-sama menggunakan struktur tag, tetapi memiliki tujuan yang berbeda.

   XML digunakan untuk menyimpan, menyusun, dan bertukar data secara terstruktur. Nama elemen XML dapat dibuat sesuai kebutuhan data dan aturan XML harus dipatuhi agar dokumen menjadi well-formed.

   Sedangkan HTML digunakan untuk menampilkan dan menyusun konten pada halaman web. HTML memiliki elemen-elemen yang sudah ditentukan, seperti  `html`,  `head`,  `body`,  `p`, dan  `h1`.

   Jadi, secara sederhana:
   XML: berfokus pada struktur dan penyimpanan data.
   HTML: berfokus pada penyajian atau tampilan data pada halaman web.

### 5.2 Apa yang Dimaksud dokumen XML yang Well-Formed?

**Jawaban:**
   Dokumen XML yang terbentuk dengan baik (well-formed) adalah dokumen XML yang mengikuti aturan sintaks XML dengan benar, seperti memiliki tepat satu elemen root, setiap elemen memiliki tag pembuka dan penutup yang sesuai, serta penulisan atribut dan elemen dilakukan dengan benar.

### 5.3 Perbedaan Well-Formed dan Valid

**Jawaban:**
   Dokumen XML yang terbentuk dengan baik (well-formed) berarti dokumen tersebut mengikuti aturan dasar sintaks XML sehingga dapat dibaca oleh parser XML. Sedangkan dokumen XML yang valid berarti dokumen tersebut tidak hanya terbentuk dengan baik, tetapi juga mengikuti aturan struktur yang ditentukan oleh schema seperti XML Schema (XSD) atau DTD.

### 5.4 Mengapa XSD Lebih Kuat Dibandingkan DTD?

**Jawaban:**
Karena XSD mendukung penggunaan namespace (sebagai identifier untuk membedakan elemen atau atribut yang memiliki nama yang sama), serta memiliki banyak tipe data (seperti string, integer, date, gYear, decimal, boolean). Sedangkan DTD tidak mempunyai dua hal tersebut (tidak mendukung namespace dan tidak ada tipe data spesifik).


### 5.5 Mengapa Namespace Penting?

**Jawaban:**
Namespace penting supaya nama elemen yang sama di dalam XML tidak saling tertukar. Misalnya, ada dua elemen bernama title, tetapi yang satu digunakan untuk judul buku dan yang satu lagi untuk judul halaman web. Dengan namespace seperti buku:title dan web:title, sistem bisa mengetahui bahwa kedua elemen tersebut memiliki arti dan sumber yang berbeda. Jadi, namespace membantu membuat struktur XML lebih jelas dan menghindari konflik nama.


### 5.6 Apa Kegunaan XPath?

**Jawaban:**
XPath merupakan dasar XSLT, XQuery, dan library. XPath ini berfungsi untuk navigasi, memilih, dan mencari bagian elem/atribut tertentu. XPath membantu untuk menentukan lokasi data berdasarkan struktur hierarki XML, sehingga data dapat diakses dengan lebih mudah dan spesifik. Seperti halnya, dalam katalog buku, terdapat hierarki mulau dari semua bukuu, kemudian semua judul, buku pertama (index), atribut isbn-nya, lalu Harga, dan nilai dari text dalam buku tersebut.Dengan XPath, kita dapat memilih elemen, atribut, atau bagian tertentu dari XML katalog tersebut secara lebih terarah.

---
