# Pertemuan 6 - RDF Dasar

# IRI, Literal, Blank Node, dan Prefix
1. Identifikasi jenis node untuk ex:ida, "Ida Adi"@id, dan [ ex:kota "Medan" ].

| Elemen | Jenis Node | Penjelasan |
|---|---|---|
| `ex:ida` | **IRI (Internationalized Resource Identifier)** | Merupakan singkatan (prefixed name) dari sebuah IRI penuh yang mengidentifikasi suatu resource secara unik dan global. Karena diawali prefix (`ex:`) dan mengacu pada sebuah entitas bernama, ini adalah IRI. |
| `"Ida Adi"@id` | **Literal (dengan language tag)** | Merupakan nilai string biasa yang diberi tag bahasa `@id` (Bahasa Indonesia). Literal digunakan untuk merepresentasikan data konkret seperti nama, angka, atau tanggal - bukan resource. |
| `[ ex:kota "Medan" ]` | **Blank Node (Anonymous Node)** | Ditandai dengan tanda kurung siku `[ ... ]` dalam sintaks Turtle. Node ini tidak memiliki IRI/identitas global, hanya berlaku secara lokal dalam graf, dan digunakan untuk merepresentasikan resource yang tidak perlu diberi nama eksplisit (misalnya alamat yang hanya relevan sebagai bagian dari data lain).

2. Mengapa literal tidak boleh menjadi subject RDF?

   -> **Tidak memiliki identitas (identity)** - Literal hanya merepresentasikan nilai data mentah (string, angka, tanggal, dsb.), bukan sebuah *resource* yang dapat dirujuk atau diidentifikasi secara unik.

   -> **Tidak dapat dijadikan target rujukan** - Karena literal bukan resource, tidak ada IRI yang menunjuk kepadanya, sehingga triple lain tidak bisa "berbicara tentang" sebuah literal sebagaimana ia berbicara tentang sebuah resource.

   -> **Sesuai model data RDF** - Model RDF mendefinisikan triple sebagai *(subject, predicate, object)*, di mana subject dan predicate harus berupa IRI atau blank node (entitas yang bisa diberi pernyataan/statement), sedangkan object boleh berupa IRI, blank node, **atau** literal (karena object adalah "nilai akhir" dari suatu pernyataan).

   -> **Konsistensi semantik** - Literal berfungsi sebagai "nilai akhir" dari sebuah fakta (contoh: `ex:ida foaf:name "Ida Adi"@id`), sehingga secara logis ia berada di posisi object, bukan sebagai sesuatu yang memiliki properti sendiri.

3. Buat IRI dasar untuk graf Anda dengan pola HTTP, misalnya https://contoh.github.io/web-semantik/ISI_NIM/kampus#.

   -> https://contoh.github.io/web-semantik/251402001/kampus#

   -> @prefix ex: <https://contoh.github.io/web-semantik/251402001/kampus#> .
   
4. Tuliskan kepanjangan namespace rdf, rdfs, xsd, dan foaf.

| Prefix | Kepanjangan (IRI Lengkap) | Kegunaan |
|---|---|---|
| `rdf:` | `http://www.w3.org/1999/02/22-rdf-syntax-ns#` | Menyediakan istilah dasar model RDF (misalnya `rdf:type`, `rdf:Property`). |
| `rdfs:` | `http://www.w3.org/2000/01/rdf-schema#` | Menyediakan kosakata untuk mendeskripsikan skema/ontologi (misalnya `rdfs:Class`, `rdfs:label`, `rdfs:subClassOf`). |
| `xsd:` | `http://www.w3.org/2001/XMLSchema#` | Menyediakan tipe data standar untuk literal (misalnya `xsd:string`, `xsd:integer`, `xsd:date`). |
| `foaf:` | `http://xmlns.com/foaf/0.1/` | *Friend of a Friend* - kosakata untuk mendeskripsikan orang dan relasi sosial (misalnya `foaf:name`, `foaf:knows`, `foaf:Person`). |

## IRI dasar graf
[isi IRI dasar]

## Ringkasan graf
- Jumlah triple: [isi]
- Namespace yang digunakan: [isi]
- Entitas: [isi]

## Contoh triple
1. [subject] - [predicate] - [object]
2. [subject] - [predicate] - [object]
3. [subject] - [predicate] - [object]

## Perbandingan serialisasi
- Turtle: [pengamatan]
- JSON-LD: [pengamatan]
- Pernyataan yang sama: [isi]

## Refleksi
1. Kapan object harus berupa IRI dan kapan berupa literal?
2. Mengapa prefix membantu keterbacaan tanpa mengubah IRI?
3. Sebutkan satu kesalahan pemodelan yang Anda hindari pada graf ini.
