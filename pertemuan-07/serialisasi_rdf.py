from rdflib import Graph, URIRef, Literal, Namespace, Dataset
#ditambahkan URIRef, Literal, dan Namespace
from rdflib.namespace import RDF, DCTERMS, XSD

g = Graph()
g.parse("kampus_usu.ttl", format="turtle")
jumlah_awal = len(g)

g.serialize("kampus_usu.jsonld", format="json-ld", indent=2)
g.serialize("kampus_usu.nt", format="nt", encoding="utf-8")

g_nt = Graph().parse("kampus_usu.nt", format="nt")
g_json = Graph().parse("kampus_usu.jsonld", format="json-ld")
print(f"Jumlah triple (Turtle)  : {jumlah_awal}")
print(f"Jumlah triple (N-Triples): {len(g_nt)}")
print(f"Jumlah triple (JSON-LD)  : {len(g_json)}")
print(g.serialize(format="turtle"))

#------------------- Potongan Kode Program yang Ditambahkan dari Langkah 3 ----------------------
EX = Namespace("https://contoh.github.io/web-semantik/251402030/kampus#")
stmt = URIRef(EX + "stmt-01")
 
g.add((stmt, RDF.type, RDF.Statement))
g.add((stmt, RDF.subject, EX.ida))
g.add((stmt, RDF.predicate, EX.mengajar))
g.add((stmt, RDF.object, EX.web_semantik))
g.add((stmt, DCTERMS.creator, EX.ida))
g.add((stmt, DCTERMS.date, Literal("2026-10-01", datatype=XSD.date)))
g.add((stmt, DCTERMS.source, Literal("Data akademik kampus")))
print(f"Jumlah triple setelah reifikasi: {len(g)}")  # awal + 7

g.bind("ex", EX)
g.bind("dcterms", DCTERMS)
print(g.serialize(format="turtle"))
#-----------------------------------------------------------------------------------------------

ds = Dataset()
ds.parse("kampus_tergabung.trig", format="trig")
for graf in ds.graphs():
    if len(graf) > 0:
        print(f"\nGraf: {graf.identifier} ({len(graf)} triple)")
        print(graf.serialize(format="turtle"))
