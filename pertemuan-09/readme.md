# Pertemuan 9 - SPARQL Dasar: Tell & Ask dan Endpoint

## Langkah 1 - Tabel binding
| Tahap | ?dosen | ?mk | ?namaMK |
|-------|--------|-----|---------|
| [isi] | [isi]  | [isi] | [isi] |
- Jumlah baris hasil akhir: [isi]
- Peran ?mk: [isi]

## Langkah 2 - ASK dan dunia terbuka
1. [jawaban]
2. [jawaban]
3. [jawaban]

## Langkah 3 - Query lokal
- IRI dasar graf: https://contoh.github.io/web-semantik/251402001/kampus#
- Jumlah triple awal / akhir: 39 / 41
- Fakta yang ditambahkan: ex:ida ex:mengajar ex:kecerdasan_buatan, dan ex:kecerdasan_buatan foaf:name "Kecerdasan_Buatan"@id

## Langkah 4 - Wikidata
- Jumlah baris Q1 dengan wdt:P31: [isi]
- Jumlah baris Q1 dengan wdt:P31/wdt:P279*: [isi]
- Penjelasan perbedaan: [isi]

## Langkah 5 - Endpoint dari Python
- agent=UA: [isi]
- setReturnFormat(JSON): [isi]
- b.get("kotaLabel", {}): [isi]

## Refleksi
1. Di titik mana SPARQL berbeda dari SQL?
SPARQL dan SQL sebenarnya terlihat mirip dipermukaan, tetapi memiliki banyak perbedaan mendasar di berbagai aspek, yaitu:
- *Model dan Identitas*: SQL menyimpan data dalam bentuk tabel, baris, dan kolom dengan primary key lokal, sedangkan SPARQL menggunakan graf triple dengan pengenal IRI global.
- *Skema*: SQL mewajibkan penentuan skema di awal, sementara pada SPARQL pembentukan skema bersifat opsional.
- *Penggabungan (Join)*: SQL memerlukan perintah JOIN ... ON secara eksplisit, sedangkan SPARQL melakukan penggabungan secara implisit menggunakan variabel bersama.
- *Ketiadaan Data*: SQL menggunakan asumsi dunia tertutup dengan nilai referensi NULL, sedangkan SPARQL menganut asumsi dunia terbuka di mana ketiadaan data berarti triple tersebut sekadar tidak ada atau tidak tercatat.
- *Lintas Sumber*: Penggabungan data dari sumber berbeda di SQL membutuhkan proses ETL terlebih dahulu, sedangkan SPARQL bisa langsung melakukan kueri terfederasi dengan fungsi SERVICE.
- *Bentuk Hasil*: Keluaran SQL selalu berbentuk tabel, sementara hasil SPARQL bisa berupa tabel, nilai boolean, maupun graf.

3. Kapan Anda memakai graf lokal (rdflib) dan kapan endpoint publik?
4. Sebutkan satu hasil query yang mengejutkan dan jelaskan penyebabnya.
