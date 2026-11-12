# Demo C (Pertemuan 11) - graf dari endpoint DBpedia disimpan sebagai Turtle, lalu di-query lokal.
# pip install rdflib sparqlwrapper; jalankan dari folder yang berisi q_demo_b.rq
from SPARQLWrapper import SPARQLWrapper, TURTLE
from rdflib import Graph

Q_NOLAN_GRAF = open("q_demo_b.rq", encoding="utf-8").read()   # query Demo B
Q_TANPA_TANGGAL = """PREFIX schema: <https://schema.org/>
SELECT ?f WHERE { ?f a schema:Movie .
  FILTER NOT EXISTS { ?f schema:datePublished ?d } }"""

UA = "KelasWebSemantik/1.0 (email@kampus.ac.id)"   # TODO: ganti dengan email Anda
sp = SPARQLWrapper("https://dbpedia.org/sparql", agent=UA)
sp.setQuery(Q_NOLAN_GRAF)
sp.setReturnFormat(TURTLE)
data = sp.queryAndConvert()
if isinstance(data, bytes):
    data = data.decode("utf-8")
g = Graph().parse(data=data, format="turtle")
print(len(g), "triple")
g.serialize("film_nolan.ttl", format="turtle")

lokal = Graph().parse("film_nolan.ttl")   # tanpa internet
for b in lokal.query(Q_TANPA_TANGGAL):
    print("Film tanpa tanggal:", b[0])
