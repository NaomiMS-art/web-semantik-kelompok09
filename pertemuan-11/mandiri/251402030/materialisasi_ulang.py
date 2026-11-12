from rdflib import Graph

PFX = """PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
"""
ATURAN = PFX + """CONSTRUCT { ?x a ?super }
WHERE { ?x a/rdfs:subClassOf* ?super }"""
Q_ORANG = PFX + "SELECT ?x WHERE { ?x a foaf:Person }"

def materialisasi(g):
    """Jalankan ATURAN pada g, tambahkan hasil ke g,
    lalu kembalikan graf yang berisi triple yang BARU saja."""
    baru = Graph()
    for t in g.query(ATURAN):
        if t not in g:          # simpan hanya yang belum ada
            baru.add(t)
    for t in baru:
        g.add(t)
    return baru

g = Graph().parse("kampus.ttl")
turunan = materialisasi(g)
print("Putaran 1:", len(turunan), "triple baru | Orang:", len(g.query(Q_ORANG)))

RINA = "@prefix ex: <http://contoh.id/kampus/> . ex:rina a ex:DosenTetap ."
g.parse(data=RINA, format="turtle")
print("Rina masuk | Orang:", len(g.query(Q_ORANG)))

turunan += materialisasi(g)     # jalankan ulang aturan
print("Putaran 2 | Orang:", len(g.query(Q_ORANG)))

turunan.serialize("kampus_turunan.ttl", format="turtle")
g.serialize("kampus_v4.ttl", format="turtle")
print("Tiga turunan disimpan terpisah:", len(turunan))
