from rdflib import Graph, Namespace, Literal
from rdflib.namespace import RDF, FOAF, XSD

g = Graph()
EX = Namespace("https://contoh.github.io/web-semantik/251402030/kampus#")

g.bind("ex", EX)
g.bind("foaf", FOAF)

# Dosen dan mata kuliah
g.add((EX.ida, RDF.type, EX.Lecturer))
g.add((EX.ida, FOAF.name, Literal("Muhammad Isa Dadi Hasibuan, S.Kom., M.Kom", lang="id")))
g.add((EX.web_semantik, RDF.type, EX.Course))
g.add((EX.web_semantik, FOAF.name, Literal("Web Semantik", lang="id")))
g.add((EX.ida, EX.mengajar, EX.web_semantik))

# Tambahkan triple Anda di bawah ini
# Mahasiswa dan relasi ke mata kuliah
g.add((EX.mhs251402030, RDF.type, EX.Student))
g.add((EX.mhs251402030, FOAF.name, Literal("Rodotua Naomi Mutiara Simamora", lang="id")))
g.add((EX.mhs251402030, EX.mengambil, EX.web_semantik))

# Informasi tambahan tentang mata kuliah dan dosen
g.add((EX.web_semantik, EX.sks, Literal(3, datatype=XSD.integer)))
g.add((EX.ida, EX.bekerjaDi, EX.usu))
g.add((EX.usu, RDF.type, EX.University))
g.add((EX.usu, FOAF.name, Literal("Universitas Sumatera Utara", lang="id")))

print(g.serialize(format="turtle"))
g.serialize("kampus_usu.ttl", format="turtle")
g.serialize("kampus_usu.jsonld", format="json-ld", indent=2)