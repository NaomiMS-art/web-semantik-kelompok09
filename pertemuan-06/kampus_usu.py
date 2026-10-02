from rdflib import Graph, Namespace, Literal
from rdflib.namespace import RDF, FOAF, XSD

g = Graph()
EX = Namespace("https://contoh.github.io/web-semantik/251402030/kampus#")

g.bind("ex", EX)
g.bind("foaf", FOAF)

# DOSEN
g.add((EX.ida, RDF.type, EX.Lecturer))
g.add((EX.ida, FOAF.name, Literal("Muhammad Isa Dadi Hasibuan, S.Kom., M.Kom", lang="id")))

g.add((EX.budi, RDF.type, EX.Lecturer))
g.add((EX.budi, FOAF.name, Literal("Budi", lang="id")))

g.add((EX.siti, RDF.type, EX.Lecturer))
g.add((EX.siti, FOAF.name, Literal("Siti", lang="id")))

# MATA KULIAH
g.add((EX.web_semantik, RDF.type, EX.Course))
g.add((EX.web_semantik, FOAF.name, Literal("Web Semantik", lang="id")))

g.add((EX.basis_data, RDF.type, EX.Course))
g.add((EX.basis_data, FOAF.name, Literal("Basis Data", lang="id")))

g.add((EX.pemrograman_web, RDF.type, EX.Course))
g.add((EX.pemrograman_web, FOAF.name, Literal("Pemrograman Web", lang="id")))

# RELASI DOSEN ke MATA KULIAH
g.add((EX.ida, EX.mengajar, EX.web_semantik))
g.add((EX.budi, EX.mengajar, EX.basis_data))
g.add((EX.siti, EX.mengajar, EX.pemrograman_web))

# MAHASISWA
g.add((EX.mhs251402030, RDF.type, EX.Student))
g.add((EX.mhs251402030, FOAF.name, Literal("Rodotua Naomi Mutiara Simamora", lang="id")))
g.add((EX.mhs251402030, EX.mengambil, EX.web_semantik))

g.add((EX.mhs251402001, RDF.type, EX.Student))
g.add((EX.mhs251402001, FOAF.name, Literal("Yessica Jaklin", lang="id")))
g.add((EX.mhs251402001, EX.mengambil, EX.basis_data))

g.add((EX.mhs251402026, RDF.type, EX.Student))
g.add((EX.mhs251402026, FOAF.name, Literal("Daradira Vonna", lang="id")))
g.add((EX.mhs251402026, EX.mengambil, EX.pemrograman_web))

g.add((EX.mhs251402072, RDF.type, EX.Student))
g.add((EX.mhs251402072, FOAF.name, Literal("Vedder Timothy Simbolon", lang="id")))
g.add((EX.mhs251402072, EX.mengambil, EX.web_semantik))

g.add((EX.mhs251402107, RDF.type, EX.Student))
g.add((EX.mhs251402107, FOAF.name, Literal("M. Rajadinata Nasution", lang="id")))
g.add((EX.mhs251402107, EX.mengambil, EX.basis_data))

# INFORMASI MATA KULIAH
g.add((EX.web_semantik, EX.jumlahKredit, Literal(3, datatype=XSD.integer)))
g.add((EX.web_semantik, EX.hariKuliah, Literal("Jumat", lang="id")))

g.add((EX.basis_data, EX.jumlahKredit, Literal(3, datatype=XSD.integer)))
g.add((EX.basis_data, EX.hariKuliah, Literal("Rabu", lang="id")))

g.add((EX.pemrograman_web, EX.jumlahKredit, Literal(3, datatype=XSD.integer)))
g.add((EX.pemrograman_web, EX.hariKuliah, Literal("Kamis", lang="id")))

# INFORMASI UNIVERSITAS
g.add((EX.ida, EX.bekerjaDi, EX.usu))
g.add((EX.usu, RDF.type, EX.University))
g.add((EX.usu, FOAF.name, Literal("Universitas Sumatera Utara", lang="id")))

# OUTPUT
print("Jumlah triple:", len(g))
print(g.serialize(format="turtle"))
g.serialize("kampus_usu.ttl", format="turtle")
g.serialize("kampus_usu.jsonld", format="json-ld", indent=2)

# LANGKAH 5 - MEMBACA DAN MENELUSURI GRAF
print("Daftar dosen:")
for subject, predicate, obj in g.triples((None, RDF.type, EX.Lecturer)):
    print(subject)
