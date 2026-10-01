from rdflib import Graph, URIRef, Literal, Namespace, Dataset
from rdflib.namespace import RDF, DCTERMS, XSD

# Langkah 2: konversi
g = Graph()
g.parse("kampus_usu.ttl", format="turtle")
jumlah_awal = len(g)

g.serialize("kampus_usu.jsonld", format="json-ld", indent=2)
g.serialize("kampus_usu.nt", format="nt")

# Verifikasi: parse ulang hasil serialisasi, jumlah harus sama
g_nt = Graph().parse("kampus_usu.nt", format="nt")
g_json = Graph().parse("kampus_usu.jsonld", format="json-ld")
print(f"Jumlah triple (Turtle)  : {jumlah_awal}")
print(f"Jumlah triple (N-Triples): {len(g_nt)}")
print(f"Jumlah triple (JSON-LD)  : {len(g_json)}")
print(g.serialize(format="turtle"))

# Langkah 3: reifikasi klasik (tidak mengubah triple asli)
EX = Namespace("https://contoh.github.io/web-semantik/ISI_NIM/kampus#")
stmt = URIRef(EX + "stmt-01")

g.add((stmt, RDF.type, RDF.Statement))
g.add((stmt, RDF.subject, EX.ida))
g.add((stmt, RDF.predicate, EX.mengajar))
g.add((stmt, RDF.object, EX.web_semantik))
g.add((stmt, DCTERMS.creator, EX.ida))
g.add((stmt, DCTERMS.date, Literal("2026-10-01", datatype=XSD.date)))
g.add((stmt, DCTERMS.source, Literal("Data akademik kampus")))
print(f"Jumlah triple setelah reifikasi: {len(g)}")  # awal + 7

# Langkah 4: baca TriG (untuk screenshot output-named-graph.png)
ds = Dataset()
ds.parse("kampus_tergabung.trig", format="trig")
for graf in ds.graphs():
    if len(graf) > 0:
        print(f"\nGraf: {graf.identifier} ({len(graf)} triple)")
        print(graf.serialize(format="turtle"))