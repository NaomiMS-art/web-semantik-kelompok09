# Pertemuan 7 - Serialisasi RDF

## Artefak
- Graf asal: 8 triple (isi sesuai output `Jumlah triple` pada program)
- Format ekspor: Turtle, JSON-LD, N-Triples
- Nama graf: https://contoh.github.io/graph/kampus dan https://contoh.github.io/graph/fakultas

## Reifikasi dan provenance
- Triple yang dianotasi: ex:ida ex:mengajar ex:web_semantik
- Pencipta: ex:ida
- Tanggal: 2026-10-01
- Sumber: Data akademik kampus

## Tabel pemilihan format
| Format | Kekuatan utama | Skenario tepat |
|---|---|---|
| Turtle | Ringkas dan mudah dibaca manusia | Menulis dan memeriksa data secara manual, dokumentasi, bahan ajar |
| JSON-LD | Cocok untuk web/API dan HTML | Endpoint API, data terstruktur di halaman web (`<script type="application/ld+json">`) |
| RDF/XML | Kompatibilitas data lama | Integrasi dengan tool atau repositori lama yang hanya mendukung XML |
| N-Triples | Satu triple per baris; stabil untuk diff | Dataset besar, pemrosesan stream, perbandingan versi di git |
| N-Quads | Menyertakan graf konteks | Dataset dengan banyak named graph dalam format per baris |

## Perbandingan
- Format paling mudah dibaca manusia: **Turtle**, karena prefix dan tanda `;` serta `,` menghilangkan pengulangan sehingga struktur datanya terbaca seperti kalimat.
- Format untuk HTML/API: **JSON-LD**, karena berbasis JSON sehingga langsung bisa diproses JavaScript dan dapat disisipkan di HTML tanpa mengubah tampilan halaman.
- Perbedaan reifikasi klasik dan RDF-star: reifikasi klasik membuat node pernyataan dan empat triple (`rdf:type rdf:Statement`, `rdf:subject`, `rdf:predicate`, `rdf:object`) sebelum metadata bisa ditambahkan, dan triple aslinya tetap berdiri terpisah. RDF-star menyematkan triple langsung sebagai subjek (`<< ex:ida ex:mengajar ex:web_semantik >> dcterms:creator ex:ida .`), jadi lebih ringkas, tetapi belum didukung semua parser.

## Mengapa reifikasi klasik lebih verbose?
Karena satu pernyataan harus "dipecah" menjadi komponennya (subjek, predikat, objek) pada node baru, baru kemudian diberi anotasi. Satu triple dengan tiga metadata menjadi tujuh triple, sedangkan RDF-star cukup satu triple tertanam ditambah anotasinya.

## Refleksi
1. Graf bernama berguna saat menggabungkan data dari sumber berbeda karena triple dari tiap sumber tetap terpisah dalam konteksnya sendiri. Asal data tetap jelas, data bisa difilter atau diperbarui per sumber, dan konflik antar sumber tidak tercampur menjadi satu graf yang sulit dilacak.
2. Asal (provenance) penting untuk sebuah triple karena menentukan seberapa data bisa dipercaya: siapa yang menyatakannya, kapan, dan dari mana. Tanpa itu, data yang bertentangan atau sudah usang tidak bisa dinilai atau diaudit.
3. Untuk git diff saya memilih **N-Triples**, karena satu triple per baris tanpa prefix atau pengelompokan, sehingga perubahan satu triple muncul sebagai satu baris yang berubah dan urutan penulisan tidak membuat diff berantakan.

## Tangkapan layar
- `tangkapan layar/output-konversi.png`
- `tangkapan layar/output-named-graph.png`