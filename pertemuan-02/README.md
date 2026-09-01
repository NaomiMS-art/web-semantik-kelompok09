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

1. **Mengapa kedua elemen `title` tidak dianggap sama?**
   Kedua elemen title tidak dianggap sama karena masing-masing berada dalam namespace yang berbeda. Walaupun memiliki nama lokal (local name) yang sama, namespace memberikan identitas yang berbeda kepada elemen tersebut.

   Dengan demikian, title dari namespace pertama dan title dari namespace kedua merupakan dua elemen yang berbeda karena memiliki URI namespace yang berbeda.

2. **Apa fungsi prefix pada namespace?**
   Prefix berfungsi sebagai nama singkat atau alias untuk sebuah namespace URI. Prefix digunakan agar namespace dapat dituliskan dengan lebih mudah pada elemen atau atribut.

   Contohnya:

   <book:title>XML</book:title>

   Pada contoh tersebut, book merupakan prefix yang mengacu pada namespace tertentu. Prefix membantu membedakan elemen yang memiliki nama sama tetapi berasal dari namespace yang berbeda.

3. **Apa fungsi `xmlns`?**
   xmlns (XML Namespace) digunakan untuk mendeklarasikan namespace pada dokumen XML. Dengan xmlns, sebuah prefix dapat dihubungkan dengan URI namespace tertentu.

   Contoh:

   xmlns:book="http://example.com/book"

   Artinya, prefix book digunakan sebagai identitas untuk namespace http://example.com/book.

4. **Apakah URI namespace harus dapat dibuka di browser?**
   Tidak. URI namespace tidak harus dapat dibuka atau diakses melalui browser. URI tersebut terutama berfungsi sebagai identifier unik untuk membedakan suatu namespace dari namespace lainnya.

   Meskipun URI namespace sering menggunakan bentuk URL, URI tersebut tidak harus menunjuk ke halaman web yang aktif.

---

## 5. Pertanyaan Evaluasi

### 5.1 Perbedaan XML dan HTML

**Jawaban:**
XML (eXtensible Markup Language) dan HTML (HyperText Markup Language) sama-sama menggunakan struktur tag, tetapi memiliki tujuan yang berbeda.

XML digunakan untuk menyimpan, menyusun, dan bertukar data secara terstruktur. Nama elemen XML dapat dibuat sesuai kebutuhan data dan aturan XML harus dipatuhi agar dokumen menjadi well-formed.

Sedangkan HTML digunakan untuk menampilkan dan menyusun konten pada halaman web. HTML memiliki elemen-elemen yang sudah ditentukan, seperti <html>, <head>, <body>, <p>, dan <h1>.

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

