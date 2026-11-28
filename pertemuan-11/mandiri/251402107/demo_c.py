# Demo C Pertemuan 11 — graf dari endpoint DBpedia disimpan sebagai Turtle, lalu di-query lokal.
# pip install rdflib sparqlwrapper ; jalankan dari folder yang berisi q_demo_b.rq
import sys
from rdflib import Graph

Q_NOLAN_GRAF = open("q_demo_b.rq", encoding="utf-8").read()   # query Demo B
Q_TANPA_TANGGAL = """PREFIX schema: <https://schema.org/>
SELECT (COUNT(?f) AS ?n) WHERE { ?f a schema:Movie .
  FILTER NOT EXISTS { ?f schema:datePublished ?d } }"""

UA = "KelasWebSemantik/1.0 (muhammadrajadinata@students.usu.ac.id)"   # kontak mahasiswa
# Mode offline memakai data contoh dosen; mode lokal membaca hasil yang sudah tersimpan.
if "--lokal" not in sys.argv:
    if "--offline" in sys.argv:
        g = Graph().parse("film.ttl").query(Q_NOLAN_GRAF).graph
        print("Sumber: film.ttl (data contoh)")
    else:
        from SPARQLWrapper import SPARQLWrapper, TURTLE
        sp = SPARQLWrapper("https://dbpedia.org/sparql", agent=UA)
        sp.setQuery(Q_NOLAN_GRAF)
        sp.setReturnFormat(TURTLE)
        g = Graph().parse(data=sp.queryAndConvert(), format="turtle")
    print(len(g), "triple")
    g.serialize("film_nolan.ttl", format="turtle")

lokal = Graph().parse("film_nolan.ttl")   # tanpa internet
for b in lokal.query(Q_TANPA_TANGGAL):
    print("Film tanpa tanggal:", b.n)
