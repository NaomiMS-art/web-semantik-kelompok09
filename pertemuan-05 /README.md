# Pertemuan 5 - Ontology dan Arsitektur Web Semantik

## Ontology mini kampus
- IRI dasar: [isi IRI]
- Domain: Kampus

## Komponen ontology
| Komponen | Isi yang dibuat |
| --- | --- |
| Class | Pizza (subclass dari Food, dengan restriksi hasBase some PizzaBase) |
| Subclass | Capricciosa (subclass dari NamedPizza, dengan restriksi hasTopping some AnchoviesTopping, hasTopping some HamTopping, hasTopping some MozzarellaTopping, hasTopping some OliveTopping, hasTopping some PeperonataTopping, hasTopping some TomatoTopping) |
| Object property | hasTopping (domain: Pizza, range: PizzaTopping; InverseFunctionalProperty; sub-property dari hasIngredient; inverse: isToppingOf) |
| Datatype property | Tidak ada di ontologi asli (Data property count = 0). Jika ditambahkan manual: hasCalories (domain: Pizza, range: xsd:integer) |
| Individual | France (instance dari class Country, dideklarasikan sebagai owl:NamedIndividual) |
| Axiom/disjointness | AllDisjointClasses pada CheeseTopping, FishTopping, FruitTopping, HerbSpiceTopping, MeatTopping, NutTopping, SauceTopping, VegetableTopping (kategori topping tidak boleh saling tumpang tindih) |

## Layer Cake
Jelaskan posisi ontology dalam Semantic Web Layer Cake: [isi jawaban]

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
