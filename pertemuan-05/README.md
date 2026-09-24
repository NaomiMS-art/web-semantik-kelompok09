# Pertemuan 5 - Ontology dan Arsitektur Web Semantik

## Ontology mini kampus
- IRI dasar: `https://NaomiMS-art.github.io/web-semantik/251402026/kampus`
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

## Ekspor dan Bandingkan Serialisasi

Ontologi kampus (IRI dasar: `https://NaomiMS-art.github.io/web-semantik/251402026/kampus`) diekspor ke dua format serialisasi RDF/OWL yang berbeda:

- `ontology-kampus.ttl` — format Turtle
- `ontology-kampus.rdf` — format RDF/XML

### Isi yang tetap sama pada kedua file

- **Class**: `Course`, `Department`, `Lecturer`, `Person`, `Student`
- **Property**: `belongsToDepartment`, `takesCourse`, `teachesCourse` (object property), `hasNIM`, `hasName` (data property)
- **Individual**: `Dara`, `Naomi`, `Raja`, `Vedder`, `Yessica`, `dosen_1`, `web_semantik`
- **IRI dasar**: `https://NaomiMS-art.github.io/web-semantik/251402026/kampus`

### Dua Perbedaan Bentuk Sintaks

1. **Cara menuliskan tipe dan hubungan resource.** Turtle menuliskan triple dalam bentuk `subjek predikat objek` yang ringkas, misalnya:

   \`\`\`turtle
   :Dara rdf:type owl:NamedIndividual , :Student ;
       :takesCourse :web_semantik .
   \`\`\`

   Sedangkan RDF/XML menuliskan hal yang sama sebagai elemen XML bersarang, di mana predikat menjadi nama tag dan objek menjadi atribut atau elemen anak:

   \`\`\`xml
   <owl:NamedIndividual rdf:about="#Dara">
       <rdf:type rdf:resource="#Student"/>
       <takesCourse rdf:resource="#web_semantik"/>
   </owl:NamedIndividual>
   \`\`\`

2. **Cara mendeklarasikan prefix/namespace.** Turtle memakai deklarasi `@prefix` yang sederhana di bagian atas file (misalnya `@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .`), sedangkan RDF/XML mendeklarasikan namespace sebagai atribut XML (`xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"`) di dalam tag pembuka `<rdf:RDF>`. Turtle juga jauh lebih ringkas dan mudah dibaca manusia karena tidak memerlukan tag pembuka/penutup seperti XML.

### Satu Kesamaan Makna

Meskipun sintaksnya berbeda, kedua file merepresentasikan model triple RDF yang sama persis. Contohnya, fakta bahwa `Lecturer` dan `Student` adalah subclass dari `Person` serta bersifat saling lepas (disjoint), dan bahwa setiap mahasiswa (`Dara`, `Naomi`, `Raja`, `Vedder`, `Yessica`) mengambil mata kuliah `web_semantik` sementara `dosen_1` mengajarnya — semua fakta ini tetap identik secara semantik di kedua file, hanya berbeda cara penulisannya. Jika dimuat ke reasoner atau triple store, keduanya akan menghasilkan graf RDF yang sama.

## Refleksi

1. **Apa perbedaan ontology dan taksonomi?**

   Taksonomi merupakan suatu pengelompokkan atau klasifikasi/kelas-kelas yang ada akan suatu hal, sedangkan ontology merupakan hubungan interkoneksi akan suatu hal. Fokus utama dari taksonomi sendiri ialah hierarki, sedangkan ontology ialah pemodelan (kategori).

   Misal, Hewan - Unggas - Terbang - Burung: ini merupakan taksonomi, karena memiliki tingkatannya mulai dari hewan sampai burung itu sendiri. Namun, apabila ontology maka akan dimodelkan satu per satu, yaitu Burung adalah Unggas, Burung bisa terbang, Burung dipelihara oleh Manusia, Burung adalah hewan, dsb.

   Dengan kata lain, taksonomi memberikan struktur dasar, ontology menambahkan aturan main atau logika.

2. **Mengapa domain pada OWL bukan constraint database?**

   - **Database Relasional** menggunakan **Closed World Assumption (CWA)** sebagai alat validasi/batasan. Jika kita memasukkan data yang tidak sesuai dengan *constraint* domain, database akan menolak (*error*).
   - **OWL** menggunakan **Open World Assumption (OWA)**. Penentuan `rdfs:domain` di OWL bukan untuk menolak data, melainkan untuk penalaran logika (*inference*). Jika suatu objek dihubungkan dengan properti tersebut, sistem/reasoner akan otomatis menyimpulkan (*infer*) bahwa objek tersebut bertipe kelas domain itu, bukan menganggap data salah.

3. **Mengapa kosakata yang sudah ada sebaiknya dipakai kembali sebelum membuat yang baru?**

   - **Interoperabilitas**: Jika semua orang memakai istilah yang sama (misalnya `foaf:name` untuk nama orang, bukan membuat properti baru sendiri), data dari sumber berbeda bisa langsung saling terhubung dan dipahami oleh sistem lain tanpa perlu pemetaan (mapping) tambahan.
   - **Menghindari duplikasi makna**: Membuat kosakata baru untuk konsep yang sudah ada (misalnya membuat `punyaNama` padahal sudah ada `foaf:name`) hanya menambah kebingungan dan membuat data menjadi terfragmentasi (tersebar dengan istilah berbeda-beda untuk hal yang sama).
   - **Standar yang sudah teruji**: Kosakata populer seperti `FOAF`, `Dublin Core`, atau `schema.org` sudah dipakai luas dan dipahami oleh banyak reasoner/aplikasi, sehingga ontologi kita otomatis lebih mudah diintegrasikan dan divalidasi.
   - **Efisiensi**: Menghemat waktu pengembangan karena tidak perlu mendefinisikan ulang konsep dasar yang sebenarnya sudah dipikirkan matang oleh komunitas sebelumnya.

   Prinsip ini dikenal sebagai *"Don't reinvent the wheel"* dalam pengembangan ontologi — sebaiknya cari dulu apakah kosakata yang dibutuhkan sudah tersedia sebelum membuat istilah baru.