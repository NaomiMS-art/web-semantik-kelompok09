# Pertemuan 5 - Ontologi dan Arsitektur Web Semantik

## Kampus mini Ontologi
- IRI dasar: `https://NaomiMS-art.github.io/web-semantik/251402026/kampus`
- Domain: Kampus

## Komponen ontology 

- Pizza.owl
  
| Komponen | Isi yang dibuat |
| --- | --- |
| Class | Pizza (subclass dari Food, dengan restriksi hasBase some PizzaBase) |
| Subclass | Capricciosa (subclass dari NamedPizza, dengan restriksi hasTopping some AnchoviesTopping, hasTopping some HamTopping, hasTopping some MozzarellaTopping, hasTopping some OliveTopping, hasTopping some PeperonataTopping, hasTopping some TomatoTopping) |
| Object property | hasTopping (domain: Pizza, range: PizzaTopping; InverseFunctionalProperty; sub-property dari hasIngredient; inverse: isToppingOf) |
| Datatype property | Tidak ada di ontologi asli (Data property count = 0). Jika ditambahkan manual: hasCalories (domain: Pizza, range: xsd:integer) |
| Individual | France (instance dari class Country, dideklarasikan sebagai owl:NamedIndividual) |
| Axiom/disjointness | AllDisjointClasses pada CheeseTopping, FishTopping, FruitTopping, HerbSpiceTopping, MeatTopping, NutTopping, SauceTopping, VegetableTopping (kategori topping tidak boleh saling tumpang tindih) |

- Ontology Kampus
  
| Komponen | Isi yang dibuat |
|---|---|
| **Kelas** | `Course`, `Department`, `Lecturer`, `Person`, `Student` |
| **Subkelas** | `Lecturer` subClassOf `Person`, `Student` subClassOf `Person` |
| **Properti Objek** | `belongsToDepartment`, `takesCourse`, `teachesCourse` |
| **Properti tipe data** | `hasNIM`, `hasName` |
| **Individu** | `Dara`, `Naomi`, `Raja`, `Vedder`, `Yessica` (mahasiswa) — `dosen_1` (dosen) — `web_semantik` (mata kuliah) |
| **Aksioma/ketidakterpisahan** | `Student` disjointWith `Lecturer` |

## Kue Lapis

Menjelaskan posisi ontologi dalam Semantic Web Layer Cake: RDF/RDFS menjadi dasar untuk merepresentasikan data dan hubungan (graph dan kosakata dasar), kemudian di atasnya Ontology/OWL dibutuhkan untuk menambahkan makna domain dan penalaran yang lebih kaya (class, subclass, disjoint, dsb — seperti yang dibangun pada ontologi kampus ini). Sedangkan SPARQL berada di lapis berikutnya, digunakan untuk melakukan query terhadap data yang sudah memiliki makna tersebut.

## Perbandingan serialisasi

- **Turtle** (`ontology-kampus.ttl`): menuliskan triple dalam bentuk `subjek predikat objek` yang ringkas, misalnya:
  \`\`\`turtle
  :Dara rdf:type owl:NamedIndividual , :Student ;
      :takesCourse :web_semantik .
  \`\`\`
  Deklarasi prefix/namespace memakai `@prefix` sederhana di bagian atas file.

- **RDF/XML** (`ontology-kampus.rdf`): menuliskan hal yang sama sebagai elemen XML bersarang, di mana predikat menjadi nama tag dan objek menjadi atribut/elemen anak, misalnya:
  \`\`\`xml
  <owl:NamedIndividual rdf:about="#Dara">
      <rdf:type rdf:resource="#Student"/>
      <takesCourse rdf:resource="#web_semantik"/>
  </owl:NamedIndividual>
  \`\`\`
  Deklarasi namespace memakai atribut XML (`xmlns:...`) di dalam tag pembuka `<rdf:RDF>`.

- **Kesamaan makna**: Meskipun sintaksnya berbeda, kedua file merepresentasikan model triple RDF yang sama persis — class `Course`, `Department`, `Lecturer`, `Person`, `Student`, property `belongsToDepartment`, `takesCourse`, `teachesCourse`, `hasNIM`, `hasName`, individual `Dara`, `Naomi`, `Raja`, `Vedder`, `Yessica`, `dosen_1`, `web_semantik`, serta IRI dasar `https://NaomiMS-art.github.io/web-semantik/251402026/kampus` tetap identik secara semantik. Jika dimuat ke reasoner atau triple store, keduanya akan menghasilkan graf RDF yang sama.

## Refleksi

1. **Apa perbedaan ontologi dan taksonomi?**

   Taksonomi merupakan suatu pengelompokkan atau klasifikasi/kelas-kelas yang ada akan suatu hal, sedangkan ontologi merupakan hubungan interkoneksi akan suatu hal. Fokus utama dari taksonomi sendiri ialah hierarki, sedangkan ontologi ialah pemodelan (kategori).

   Misal, Hewan - Unggas - Terbang - Burung: ini merupakan taksonomi, karena memiliki tingkatannya mulai dari hewan sampai burung itu sendiri. Namun, apabila ontologi maka akan dimodelkan satu per satu, yaitu Burung adalah Unggas, Burung bisa terbang, Burung dipelihara oleh Manusia, Burung adalah hewan, dsb.

   Dengan kata lain, taksonomi memberikan struktur dasar, ontologi menambahkan aturan main atau logika.

2. **Mengapa domain pada OWL bukan database kendala?**

   - **Database Relasional** menggunakan **Closed World Assumption (CWA)** sebagai alat validasi/batasan. Jika kita memasukkan data yang tidak sesuai dengan *constraint* domain, database akan menolak (*error*).
   - **OWL** menggunakan **Open World Assumption (OWA)**. Penentuan `rdfs:domain` di OWL bukan untuk menolak data, melainkan untuk penalaran logika (*inference*). Jika suatu objek dihubungkan dengan properti tersebut, sistem/reasoner akan otomatis menyimpulkan (*infer*) bahwa objek tersebut bertipe kelas domain itu, bukan menganggap data salah.

3. **Mengapa pemahaman yang sudah ada sebaiknya dipakai kembali sebelum membuat yang baru?**

   - **Interoperabilitas**: Jika semua orang memakai istilah yang sama (misalnya `foaf:name` untuk nama orang, bukan membuat properti baru sendiri), data dari sumber berbeda bisa langsung saling terhubung dan dipahami oleh sistem lain tanpa perlu pemetaan (mapping) tambahan.
   - **Menghindari duplikasi makna**: Membuat kosakata baru untuk konsep yang sudah ada (misalnya membuat `punyaNama` padahal sudah ada `foaf:name`) hanya menambah kebingungan dan membuat data menjadi terfragmentasi.
   - **Standar yang sudah teruji**: Kosakata populer seperti `FOAF`, `Dublin Core`, atau `schema.org` sudah dipakai luas dan dipahami oleh banyak reasoner/aplikasi, sehingga ontologi kita otomatis lebih mudah diintegrasikan dan divalidasi.
   - **Efisiensi**: Menghemat waktu pengembangan karena tidak perlu mendefinisikan ulang konsep dasar yang sebenarnya sudah dipikirkan matang oleh komunitas sebelumnya.

   Prinsip ini dikenal sebagai *"Don't reinvent the wheel"* dalam pengembangan ontologi — sebaiknya cari dulu apakah kosakata yang dibutuhkan sudah tersedia sebelum membuat istilah baru.
