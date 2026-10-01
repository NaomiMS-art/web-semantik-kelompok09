# Pertemuan 6 - RDF Dasar

# IRI, Literal, Blank Node, dan Prefix

1. Identifikasi jenis node untuk ex:ida, "Ida Adi"@id, dan [ ex:kota "Medan" ].

| Elemen | Jenis Node | Penjelasan |
|---|---|---|
| `ex:ida` | **IRI (Internationalized Resource Identifier)** | Merupakan singkatan (prefixed name) dari sebuah IRI penuh yang mengidentifikasi suatu resource secara unik dan global. Karena diawali prefix (`ex:`) dan mengacu pada sebuah entitas bernama, ini adalah IRI. |
| `"Ida Adi"@id` | **Literal (dengan language tag)** | Merupakan nilai string biasa yang diberi tag bahasa `@id` (Bahasa Indonesia). Literal digunakan untuk merepresentasikan data konkret seperti nama, angka, atau tanggal — bukan resource. |
| `[ ex:kota "Medan" ]` | **Blank Node (Anonymous Node)** | Ditandai dengan tanda kurung siku `[ ... ]` dalam sintaks Turtle. Node ini tidak memiliki IRI/identitas global, hanya berlaku secara lokal dalam graf, dan digunakan untuk merepresentasikan resource yang tidak perlu diberi nama eksplisit (misalnya alamat yang hanya relevan sebagai bagian dari data lain). |

2. Mengapa literal tidak boleh menjadi subject RDF?

   -> **Tidak memiliki identitas (identity)** — Literal hanya merepresentasikan nilai data mentah (string, angka, tanggal, dsb.), bukan sebuah *resource* yang dapat dirujuk atau diidentifikasi secara unik.

   -> **Tidak dapat dijadikan target rujukan** — Karena literal bukan resource, tidak ada IRI yang menunjuk kepadanya, sehingga triple lain tidak bisa "berbicara tentang" sebuah literal sebagaimana ia berbicara tentang sebuah resource.

   -> **Sesuai model data RDF** — Model RDF mendefinisikan triple sebagai *(subject, predicate, object)*, di mana subject dan predicate harus berupa IRI atau blank node (entitas yang bisa diberi pernyataan/statement), sedangkan object boleh berupa IRI, blank node, **atau** literal (karena object adalah "nilai akhir" dari suatu pernyataan).

   -> **Konsistensi semantik** — Literal berfungsi sebagai "nilai akhir" dari sebuah fakta (contoh: `ex:ida foaf:name "Ida Adi"@id`), sehingga secara logis ia berada di posisi object, bukan sebagai sesuatu yang memiliki properti sendiri.

3. Buat IRI dasar untuk graf Anda dengan pola HTTP, misalnya https://contoh.github.io/web-semantik/ISI_NIM/kampus#.

   -> https://contoh.github.io/web-semantik/251402030/kampus#

   -> `@prefix ex: <https://contoh.github.io/web-semantik/251402030/kampus#> .`

4. Tuliskan kepanjangan namespace rdf, rdfs, xsd, dan foaf.

| Prefix | Kepanjangan (IRI Lengkap) | Kegunaan |
|---|---|---|
| `rdf:` | `http://www.w3.org/1999/02/22-rdf-syntax-ns#` | Menyediakan istilah dasar model RDF (misalnya `rdf:type`, `rdf:Property`). |
| `rdfs:` | `http://www.w3.org/2000/01/rdf-schema#` | Menyediakan kosakata untuk mendeskripsikan skema/ontologi (misalnya `rdfs:Class`, `rdfs:label`, `rdfs:subClassOf`). |
| `xsd:` | `http://www.w3.org/2001/XMLSchema#` | Menyediakan tipe data standar untuk literal (misalnya `xsd:string`, `xsd:integer`, `xsd:date`). |
| `foaf:` | `http://xmlns.com/foaf/0.1/` | *Friend of a Friend* — kosakata untuk mendeskripsikan orang dan relasi sosial (misalnya `foaf:name`, `foaf:knows`, `foaf:Person`). |

## IRI dasar graf
`https://contoh.github.io/web-semantik/251402030/kampus#`

## Ringkasan graf
- Jumlah triple: 12
- Namespace yang digunakan: `ex` (namespace kampus), `foaf`, `rdf`, `xsd`
- Entitas: `ex:ida` (dosen), `ex:web_semantik` (mata kuliah), `ex:mhs251402030` (mahasiswa), `ex:usu` (universitas)

## Contoh triple
1. `ex:ida` - `rdf:type` - `ex:Lecturer`
2. `ex:ida` - `ex:teaches` - `ex:WebSemantik`
3. `ex:WebSemantik` - `ex:name` - `"Web Semantik"`

## Perbandingan serialisasi
- Turtle: Lebih ringkas dan mudah dibaca manusia karena memakai prefix, mirip struktur kalimat subject-predicate-object, dan triple dengan subject yang sama bisa digabung dengan tanda `;`.
- JSON-LD: Berbentuk objek JSON yang lebih mudah diproses secara otomatis oleh aplikasi/bahasa pemrograman lain, tetapi lebih verbose (panjang) untuk dibaca manusia karena strukturnya bersarang (nested) dan memakai kunci khusus seperti `@context`, `@id`, `@type`.
- Pernyataan yang sama: Meski format teksnya sangat berbeda, kedua serialisasi merepresentasikan graf RDF (kumpulan triple) yang identik — IRI, literal, dan strukturnya sama persis, hanya cara penulisannya yang berbeda.

## Refleksi

1. **Kapan object harus berupa IRI dan kapan berupa literal?**

   Object berupa **IRI** ketika menyatakan hubungan/relasi antara dua resource yang masing-masing punya identitas sendiri dan bisa diberi properti tambahan — misalnya `ex:ida ex:mengajar ex:web_semantik` (baik dosen maupun mata kuliah adalah resource yang bisa dirujuk kembali dan dideskripsikan lebih lanjut).

   Object berupa **literal** ketika menyatakan nilai data konkret yang deskriptif dan tidak perlu dirujuk sebagai resource tersendiri — misalnya `foaf:name "Muhammad Isa..."` atau `ex:sks 3` (nama dan jumlah SKS adalah nilai akhir/atomic, bukan entitas yang punya relasi lain).

2. **Mengapa Prefix Membantu Keterbacaan Tanpa Mengubah IRI**

   Prefix (seperti `ex:` atau `foaf:`) hanyalah **singkatan tampilan (syntactic sugar)**, bukan bagian dari identitas data sebenarnya.

   **IRI Sesungguhnya Tetap Utuh**

   Ketika kita menulis:
```python
   g.bind("ex", EX)
```
   IRI `https://contoh.github.io/web-semantik/251402030/kampus#ida` **tidak berubah** menjadi apa pun yang lain. Fungsi `bind()` hanya memberi tahu *serializer* (misalnya saat memanggil `g.serialize(format="turtle")`) bahwa setiap kali muncul IRI berawalan `https://contoh.github.io/web-semantik/251402030/kampus#`, tampilkan sebagai `ex:` di file `.ttl`.

   **Contoh Perbandingan**

   Tanpa prefix (IRI panjang ditulis berulang):
```turtle
   <https://contoh.github.io/web-semantik/251402030/kampus#ida>
       a <https://contoh.github.io/web-semantik/251402030/kampus#Lecturer> ;
       <http://xmlns.com/foaf/0.1/name> "Muhammad Isa Dadi Hasibuan, S.Kom., M.Kom" .
```

   Dengan prefix (ringkas dan mudah dibaca manusia):
```turtle
   ex:ida a ex:Lecturer ;
       foaf:name "Muhammad Isa Dadi Hasibuan, S.Kom., M.Kom" .
```

   **Kesimpulan:** `ex:ida` dan `<https://contoh.github.io/web-semantik/251402030/kampus#ida>` merujuk ke **resource yang persis sama**. Parser RDF akan mengekspansi `ex:ida` kembali menjadi IRI lengkapnya saat membaca file. Prefix hanya memengaruhi *bagaimana IRI ditulis/dibaca oleh manusia*, sama sekali tidak memengaruhi *identitas* resource dalam graf — IRI penuh tetap menjadi kunci sebenarnya.

3. **Sebutkan satu kesalahan pemodelan yang Anda hindari pada graf ini.**

  Saya menghindari kesalahan dalam membedakan antara entitas dan nilai literal. Entitas seperti Web Semantik dibuat menggunakan EX.web_semantik karena masih dapat memiliki hubungan dan atribut lain, seperti dosen yang mengajar, mahasiswa yang mengambil, jumlah kredit, dan hari kuliah. Dengan begitu, struktur graf menjadi lebih jelas dan setiap entitas dapat dihubungkan dengan informasi yang relevan.
