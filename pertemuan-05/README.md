# Pertemuan 5 - Ontology dan Arsitektur Web Semantik

## Ontology mini kampus
- IRI dasar: [isi IRI]
- Domain: Kampus

## Komponen Ontology

| Komponen | Penjelasan | Contoh |
|---|---|---|
| **Class** | Digunakan untuk menggambarkan kelompok atau konsep utama dalam suatu domain. | `Mahasiswa`, `MataKuliah`, `Ruangan` |
| **Subclass** | Merupakan bagian yang lebih khusus dari sebuah class. | `MahasiswaAktif` subclassOf `Mahasiswa`, `MahasiswaAlumni` subclassOf `Mahasiswa` |
| **Individual** | Merupakan objek atau anggota tertentu dari sebuah class. | `Raja` bertipe `MahasiswaAlumni`, `Vimo` bertipe `MahasiswaAktif` |
| **Property** | Digunakan untuk menghubungkan satu entitas dengan entitas lain atau memberikan atribut tertentu. | `mengambilMataKuliah`, `menggunakanRuangan` |
| **Axiom** | Aturan yang digunakan untuk memberikan batasan atau hubungan tertentu dalam ontology. | `MahasiswaAktif` disjointWith `MahasiswaAlumni` |

## Layer Cake
Karena RDF/RDFS menjadi dasar untuk merepresentasikan data dan hubungan, kemudian setelah itu ontology dibutuhkan untuk menambahkan makna yang lebih kaya. Sedangkan SPARQL digunakan untuk melakukan query terhadap data yang sudah memiliki makna tersebut.

## Perbandingan serialisasi
- Turtle: [dua pengamatan sintaks]
- RDF/XML: [dua pengamatan sintaks]
- Kesamaan makna: [isi]

## Refleksi
1. Apa perbedaan ontology dan taksonomi?

   -> Taksonomi merupakan suatu pengelompokkan atau klasifikasi/kelas-kelas yang ada akan suatu hal, sedangkan ontology merupakan hubungan interkoneksi akan suatu hal. Fokus utama dari taksonomi sendiri ialah hiararki, sedangkan ontology ialah pemodelan (kategori).

    -> Misal, Hewan - Unggas - Terbang - Burung : ini merupakan tasonomi, karena memiliki tingkatannya mualai dari hewan sampai burung itu sendiri. Namun, apabila ontology maka akan dimodelkan satu per satu, yaitu Burung adalah Unggas, Burung bisa terbang, Burung dipelihara oleh Manusia, Burung adalah hewan, dsb.

    -> Dengan kata lain, topologi memberikan struktur dasar, ontology menambahkan aturan main atau logika.
   
2. Mengapa domain pada OWL bukan constraint database?
   - **Database Relasional** menggunakan **Closed World Assumption (CWA)** sebagai alat validasi/batasan. Jika kita memasukkan data yang tidak sesuai dengan *constraint* domain, database akan menolak (*error*).
   - **OWL** menggunakan **Open World Assumption (OWA)**. Penentuan `rdfs:domain` di OWL bukan untuk menolak data, melainkan untuk penalaran logika (*inference*). Jika suatu objek dihubungkan dengan properti tersebut, sistem/reasoner akan otomatis menyimpulkan (*infer*) bahwa objek tersebut bertipe kelas domain itu, bukan menganggap data salah.
4. Mengapa kosakata yang sudah ada sebaiknya dipakai kembali sebelum membuat yang baru?
