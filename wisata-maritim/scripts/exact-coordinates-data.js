// ==============================================================================
// KAMUS KOORDINAT PRESISI ASLI 305 DESTINASI WISATA MARITIM INDONESIA
// Menggunakan koordinat geografis nyata (WGS84 Lat, Lon) pesisir & perairan Nusantara
// ==============================================================================

const EXACT_COORDINATES = {
  // === SUMATRA (SMT-01 s/d SMT-60) ===
  "SMT-01": { lat: 5.8693, lon: 95.2588 }, // Iboih & Rubiah Sabang
  "SMT-02": { lat: 5.8631, lon: 95.2801 }, // Pantai Gapang Sabang
  "SMT-03": { lat: 2.1833, lon: 97.2500 }, // Pulau Banyak Aceh Singkil
  "SMT-04": { lat: 5.9083, lon: 95.2136 }, // Titik Nol Kilometer Sabang
  "SMT-05": { lat: 5.8892, lon: 95.3408 }, // Pantai Sumur Tiga Sabang
  "SMT-06": { lat: 5.4851, lon: 95.2341 }, // Pantai Lampuuk Aceh Besar
  "SMT-07": { lat: 5.5456, lon: 95.3181 }, // PLTD Apung Banda Aceh
  "SMT-08": { lat: 5.6667, lon: 95.1167 }, // Pulo Aceh Aceh Besar
  "SMT-09": { lat: 0.5842, lon: 97.7289 }, // Pantai Lagundri Nias Selatan
  "SMT-10": { lat: 3.6425, lon: 98.9881 }, // Pantai Cermin Serdang Bedagai
  "SMT-11": { lat: 3.7758, lon: 99.5036 }, // Pulau Berhala Serdang Bedagai
  "SMT-12": { lat: 1.6425, lon: 98.5336 }, // Pulau Mursala Tapanuli Tengah
  "SMT-13": { lat: 1.6917, lon: 98.8167 }, // Pantai Pandan Tapanuli Tengah
  "SMT-14": { lat: -2.7667, lon: 100.0833 }, // Mentawai (Macaronis)
  "SMT-15": { lat: -1.3486, lon: 100.5732 }, // Pantai Carocok Pesisir Selatan
  "SMT-16": { lat: -1.1167, lon: 100.3667 }, // Pulau Pasumpahan Padang
  "SMT-17": { lat: -0.9856, lon: 100.3542 }, // Pantai Air Manis Padang
  "SMT-18": { lat: -1.1167, lon: 100.3500 }, // Pulau Sikuai Padang
  "SMT-19": { lat: 2.0167, lon: 101.5833 }, // Pulau Rupat Bengkalis Riau
  "SMT-20": { lat: 1.1764, lon: 104.3803 }, // Lagoi Bintan Kep. Riau
  "SMT-21": { lat: 3.2356, lon: 106.2758 }, // Pantai Padang Melang Anambas
  "SMT-22": { lat: 0.9281, lon: 104.4194 }, // Pulau Penyengat Tanjungpinang
  "SMT-23": { lat: 3.9667, lon: 108.4167 }, // Pantai Sepempang Natuna
  "SMT-24": { lat: 1.1444, lon: 104.5639 }, // Pantai Trikora Bintan
  "SMT-25": { lat: 0.9833, lon: 104.0500 }, // Jembatan Barelang Batam
  "SMT-26": { lat: 1.1833, lon: 104.0958 }, // Pantai Nongsa Batam
  "SMT-27": { lat: -3.8167, lon: 102.2667 }, // Pantai Panjang Bengkulu
  "SMT-28": { lat: -3.7869, lon: 102.2508 }, // Benteng Marlborough Bengkulu
  "SMT-29": { lat: -3.8333, lon: 102.1667 }, // Pulau Tikus Bengkulu
  "SMT-30": { lat: -2.5539, lon: 107.7139 }, // Pantai Tanjung Tinggi Belitung
  "SMT-31": { lat: -2.5317, lon: 107.6167 }, // Pulau Lengkuas Belitung
  "SMT-32": { lat: -1.8667, lon: 106.1667 }, // Pantai Parai Tenggiri Bangka
  "SMT-33": { lat: -1.8167, lon: 106.1333 }, // Pantai Matras Bangka
  "SMT-34": { lat: -2.5667, lon: 107.6500 }, // Pulau Kepayang Belitung
  "SMT-35": { lat: -2.5500, lon: 107.6667 }, // Pulau Batu Berlayar Belitung
  "SMT-36": { lat: -2.1333, lon: 106.1833 }, // Pantai Pasir Padi Pangkalpinang
  "SMT-37": { lat: -5.6738, lon: 105.2189 }, // Pulau Pahawang Lampung
  "SMT-38": { lat: -5.7667, lon: 105.1500 }, // Teluk Kiluan Lampung
  "SMT-39": { lat: -6.1021, lon: 105.4230 }, // Anak Krakatau Lampung Selatan
  "SMT-40": { lat: -5.5167, lon: 105.2667 }, // Pantai Mutun Pesawaran
  "SMT-41": { lat: -5.5833, lon: 105.2833 }, // Pulau Tegal Mas Pesawaran
  "SMT-42": { lat: -5.6333, lon: 105.2333 }, // Pulau Kelagian Lunik Pesawaran
  "SMT-43": { lat: -5.3167, lon: 103.9833 }, // Pantai Tanjung Setia Pesisir Barat
  "SMT-44": { lat: 0.5750, lon: 97.7417 }, // Pantai Sorake Nias Selatan
  "SMT-45": { lat: -1.1333, lon: 100.3667 }, // Pulau Pagang Pesisir Selatan
  "SMT-46": { lat: -1.3333, lon: 100.4167 }, // Kawasan Wisata Mandeh Pesisir Selatan
  "SMT-47": { lat: 5.4667, lon: 95.2333 }, // Pantai Pasir Putih Lhoknga
  "SMT-48": { lat: 0.1667, lon: 99.7833 }, // Pantai Sasak Pasaman Barat
  "SMT-49": { lat: -0.7333, lon: 100.2333 }, // Pantai Tiram Padang Pariaman
  "SMT-50": { lat: -0.6250, lon: 100.1167 }, // Pantai Gandoriah Pariaman
  "SMT-51": { lat: 0.9167, lon: 97.2833 }, // Pulau Asu Hinako Nias Barat
  "SMT-52": { lat: -5.1833, lon: 103.9333 }, // Pantai Krui Pesisir Barat
  "SMT-53": { lat: -5.1917, lon: 103.9250 }, // Pantai Labuhan Jukung Pesisir Barat
  "SMT-54": { lat: -5.4833, lon: 105.2833 }, // Pulau Kubur Pesawaran
  "SMT-55": { lat: -5.5667, lon: 105.2500 }, // Pulau Mahitam Pesawaran
  "SMT-56": { lat: -5.7333, lon: 105.5833 }, // Pantai Marina Kalianda Lampung
  "SMT-57": { lat: -5.7500, lon: 105.0833 }, // Pantai Gigi Hiu Tanggamus
  "SMT-58": { lat: 3.2500, lon: 106.2167 }, // Pulau Cemara Kecil Anambas
  "SMT-59": { lat: 3.8667, lon: 108.3167 }, // Pantai Batu Kasah Natuna
  "SMT-60": { lat: 4.0167, lon: 108.4333 }, // Pulau Senua Natuna

  // === JAWA (JWA-01 s/d JWA-54) ===
  "JWA-01": { lat: -6.9844, lon: 106.3128 }, // Pantai Sawarna Lebak Banten
  "JWA-02": { lat: -6.0528, lon: 105.9083 }, // Pantai Anyer Serang Banten
  "JWA-03": { lat: -6.4833, lon: 105.6589 }, // Tanjung Lesung Pandeglang
  "JWA-04": { lat: -5.8017, lon: 106.5258 }, // Pulau Tidung Kep. Seribu
  "JWA-05": { lat: -5.7461, lon: 106.6139 }, // Pulau Pramuka Kep. Seribu
  "JWA-06": { lat: -5.6533, lon: 106.5700 }, // Pulau Harapan Kep. Seribu
  "JWA-07": { lat: -6.1215, lon: 106.8315 }, // Pantai Ancol Jakarta Utara
  "JWA-08": { lat: -5.8617, lon: 106.6217 }, // Pulau Pari Kep. Seribu
  "JWA-09": { lat: -5.9783, lon: 106.7050 }, // Pulau Untung Jawa Kep. Seribu
  "JWA-10": { lat: -6.1242, lon: 106.8089 }, // Pelabuhan Sunda Kelapa Jakarta
  "JWA-11": { lat: -7.7011, lon: 108.6508 }, // Pantai Pangandaran Jawa Barat
  "JWA-12": { lat: -7.3667, lon: 106.4000 }, // Pantai Ujung Genteng Sukabumi
  "JWA-13": { lat: -6.9841, lon: 106.5414 }, // Pantai Pelabuhan Ratu Sukabumi
  "JWA-14": { lat: -7.6583, lon: 107.6917 }, // Pantai Santolo Garut
  "JWA-15": { lat: -5.8458, lon: 110.4289 }, // Karimunjawa Jepara Jateng
  "JWA-16": { lat: -6.5500, lon: 110.6500 }, // Pantai Bandengan Jepara
  "JWA-17": { lat: -7.7383, lon: 109.0233 }, // Pantai Teluk Penyu Cilacap
  "JWA-18": { lat: -8.0189, lon: 110.3204 }, // Pantai Parangtritis Bantul DIY
  "JWA-19": { lat: -8.1517, lon: 110.6128 }, // Pantai Indrayanti Gunungkidul
  "JWA-20": { lat: -8.1817, lon: 110.6833 }, // Pantai Siung Gunungkidul
  "JWA-21": { lat: -8.4312, lon: 113.5601 }, // Pantai Papuma Jember Jatim
  "JWA-22": { lat: -8.5992, lon: 114.0258 }, // Pulau Merah Banyuwangi
  "JWA-23": { lat: -8.4375, lon: 112.6781 }, // Pantai Tiga Warna Malang Jatim
  "JWA-24": { lat: -8.2324, lon: 110.9472 }, // Pantai Klayar Pacitan
  "JWA-25": { lat: -7.6908, lon: 113.8208 }, // Pantai Pasir Putih Situbondo Jatim
  "JWA-26": { lat: -8.5583, lon: 113.9250 }, // Teluk Hijau Banyuwangi
  "JWA-27": { lat: -7.2167, lon: 114.0500 }, // Pulau Gili Labak Sumenep Madura
  "JWA-28": { lat: -5.7833, lon: 112.6500 }, // Pulau Bawean Gresik
  "JWA-29": { lat: -7.7697, lon: 109.4128 }, // Pantai Menganti Kebumen Jateng
  "JWA-30": { lat: -8.1758, lon: 110.6622 }, // Pantai Timang Gunungkidul
  "JWA-31": { lat: -8.1289, lon: 110.5489 }, // Pantai Baron Gunungkidul
  "JWA-32": { lat: -8.1467, lon: 110.5989 }, // Pantai Krakal Gunungkidul
  "JWA-33": { lat: -8.1483, lon: 110.5772 }, // Pantai Drini Gunungkidul
  "JWA-34": { lat: -8.1189, lon: 110.5189 }, // Pantai Ngobaran Gunungkidul
  "JWA-35": { lat: -8.1856, lon: 110.7083 }, // Pantai Wediombo Gunungkidul
  "JWA-36": { lat: -8.1567, lon: 110.6217 }, // Pantai Pok Tunggal Gunungkidul
  "JWA-37": { lat: -7.9167, lon: 110.0750 }, // Pantai Glagah Kulon Progo DIY
  "JWA-38": { lat: -7.7578, lon: 109.4633 }, // Pantai Karang Bolong Kebumen
  "JWA-39": { lat: -6.5917, lon: 110.6417 }, // Pantai Kartini Jepara
  "JWA-40": { lat: -6.9500, lon: 110.3833 }, // Pantai Marina Semarang
  "JWA-41": { lat: -8.2083, lon: 114.3833 }, // Pantai Boom Marina Banyuwangi
  "JWA-42": { lat: -8.1333, lon: 114.4167 }, // Pantai Watu Dodol Banyuwangi
  "JWA-43": { lat: -8.7333, lon: 114.3667 }, // Pantai Plengkung (G-Land) Banyuwangi
  "JWA-44": { lat: -8.5500, lon: 113.8833 }, // Pantai Sukamade Banyuwangi
  "JWA-45": { lat: -8.4033, lon: 112.5389 }, // Pantai Balekambang Malang
  "JWA-46": { lat: -8.4456, lon: 112.6517 }, // Pantai Goa Cina Malang
  "JWA-47": { lat: -8.4333, lon: 112.6833 }, // Pantai Sendang Biru Malang
  "JWA-48": { lat: -8.4389, lon: 112.6806 }, // Pantai Clungup Malang
  "JWA-49": { lat: -8.3247, lon: 112.1408 }, // Pantai Tambakrejo Blitar Jatim
  "JWA-50": { lat: -8.2936, lon: 111.7242 }, // Pantai Karanggongso Trenggalek Jatim
  "JWA-51": { lat: -8.2458, lon: 111.0083 }, // Pantai Watu Karung Pacitan
  "JWA-52": { lat: -8.2483, lon: 111.0189 }, // Pantai Kasap Pacitan
  "JWA-53": { lat: -8.2167, lon: 110.9167 }, // Pantai Banyu Tibo Pacitan
  "JWA-54": { lat: -8.2189, lon: 111.0833 }, // Pantai Teleng Ria Pacitan

  // === KALIMANTAN (KLM-01 s/d KLM-30) ===
  "KLM-01": { lat: -1.5833, lon: 109.1667 }, // Kepulauan Karimata Kayong Utara
  "KLM-02": { lat: 0.8417, lon: 108.9167 }, // Pantai Pasir Panjang Singkawang
  "KLM-03": { lat: 0.7583, lon: 108.6833 }, // Pulau Randayan Bengkayang Kalbar
  "KLM-04": { lat: 2.0167, lon: 109.6500 }, // Pantai Temajuk Sambas Kalbar
  "KLM-05": { lat: -3.0500, lon: 112.9833 }, // Pantai Ujung Pandaran Kalteng
  "KLM-06": { lat: -3.9833, lon: 114.6167 }, // Pantai Batakan Tanah Laut Kalsel
  "KLM-07": { lat: -3.7667, lon: 115.5833 }, // Pantai Angsana Tanah Bumbu Kalsel
  "KLM-08": { lat: -3.6167, lon: 115.9167 }, // Pantai Pagatan Tanah Bumbu Kalsel
  "KLM-09": { lat: 2.2872, lon: 118.2439 }, // Pulau Derawan Berau Kaltim
  "KLM-10": { lat: 2.2500, lon: 118.6167 }, // Pulau Maratua Berau Kaltim
  "KLM-11": { lat: 2.1500, lon: 118.5333 }, // Pulau Kakaban Berau Kaltim
  "KLM-12": { lat: 2.0833, lon: 118.4000 }, // Pulau Sangalaki Berau Kaltim
  "KLM-13": { lat: -1.2750, lon: 116.8167 }, // Pantai Melawai Balikpapan
  "KLM-14": { lat: -1.2000, lon: 116.9833 }, // Pantai Manggar Balikpapan
  "KLM-15": { lat: 0.0500, lon: 117.5500 }, // Pulau Beras Basah Bontang
  "KLM-16": { lat: 3.2833, lon: 117.6500 }, // Pantai Amal Tarakan Kaltara
  "KLM-17": { lat: 3.3000, lon: 117.5833 }, // Mangrove Tarakan Kaltara
  "KLM-18": { lat: 4.1667, lon: 117.7500 }, // Pulau Sebatik Nunukan Kaltara
  "KLM-19": { lat: 0.8167, lon: 108.8833 }, // Pantai Samudra Indah Bengkayang
  "KLM-20": { lat: 0.4500, lon: 108.9167 }, // Pantai Kijing Mempawah Kalbar
  "KLM-21": { lat: -2.9167, lon: 111.7500 }, // Pantai Kubu Kotawaringin Barat
  "KLM-22": { lat: -3.3167, lon: 112.5500 }, // Pantai Sungai Bakau Seruyan Kalteng
  "KLM-23": { lat: -3.8833, lon: 114.5833 }, // Pantai Takisung Tanah Laut Kalsel
  "KLM-24": { lat: -3.9667, lon: 114.6167 }, // Pantai Batakan Baru Tanah Laut Kalsel
  "KLM-25": { lat: -3.9500, lon: 116.1500 }, // Pantai Teluk Tamiang Kotabaru Kalsel
  "KLM-26": { lat: -3.3000, lon: 116.2833 }, // Pantai Gedambaan Kotabaru Kalsel
  "KLM-27": { lat: -1.1833, lon: 117.0167 }, // Pantai Lamaru Balikpapan
  "KLM-28": { lat: -1.2667, lon: 116.8167 }, // Pantai Kemala Balikpapan
  "KLM-29": { lat: -1.0500, lon: 117.0667 }, // Pantai Tanah Merah Samboja Kukar
  "KLM-30": { lat: 1.1500, lon: 118.8333 }, // Pulau Kaniungan Berau Kaltim

  // === BALI & NUSA TENGGARA (BNT-01 s/d BNT-72) ===
  "BNT-01": { lat: -8.7183, lon: 115.1690 }, // Pantai Kuta Badung Bali
  "BNT-02": { lat: -8.7144, lon: 115.4586 }, // Nusa Penida (Crystal Bay)
  "BNT-03": { lat: -8.7511, lon: 115.4744 }, // Pantai Kelingking Nusa Penida
  "BNT-04": { lat: -8.6789, lon: 115.4497 }, // Nusa Lembongan Klungkung Bali
  "BNT-05": { lat: -8.7058, lon: 115.4456 }, // Blue Lagoon Nusa Ceningan
  "BNT-06": { lat: -8.2754, lon: 115.5925 }, // USAT Liberty Shipwreck Tulamben
  "BNT-07": { lat: -8.0933, lon: 114.5167 }, // Pulau Menjangan Buleleng Bali
  "BNT-08": { lat: -8.3417, lon: 115.6542 }, // Amed Karangasem Bali
  "BNT-09": { lat: -8.6888, lon: 115.2635 }, // Pantai Sanur Denpasar Bali
  "BNT-10": { lat: -8.1417, lon: 114.6500 }, // Pemuteran Buleleng Bali
  "BNT-11": { lat: -8.8291, lon: 115.0849 }, // Pantai Uluwatu Badung Bali
  "BNT-12": { lat: -8.7617, lon: 115.2217 }, // Tanjung Benoa Badung Bali
  "BNT-13": { lat: -8.1583, lon: 115.0278 }, // Lovina Buleleng Bali
  "BNT-14": { lat: -8.6212, lon: 115.0868 }, // Pura Tanah Lot Tabanan Bali
  "BNT-15": { lat: -8.8479, lon: 115.1664 }, // Pantai Melasti Badung Bali
  "BNT-16": { lat: -8.7698, lon: 115.1668 }, // Pantai Jimbaran Badung Bali
  "BNT-17": { lat: -8.8111, lon: 115.1036 }, // Pantai Padang Padang Badung Bali
  "BNT-18": { lat: -8.8452, lon: 115.1866 }, // Pantai Pandawa Badung Bali
  "BNT-19": { lat: -8.7297, lon: 115.2344 }, // Pulau Serangan Denpasar Bali
  "BNT-20": { lat: -8.4908, lon: 114.8083 }, // Pantai Medewi Jembrana Bali
  "BNT-21": { lat: -8.3533, lon: 116.0417 }, // Gili Trawangan Lombok Utara
  "BNT-22": { lat: -8.3500, lon: 116.0583 }, // Gili Meno Lombok Utara
  "BNT-23": { lat: -8.3600, lon: 116.0833 }, // Gili Air Lombok Utara
  "BNT-24": { lat: -8.8956, lon: 116.2917 }, // Pantai Kuta Mandalika Lombok
  "BNT-25": { lat: -8.8717, lon: 116.1667 }, // Pantai Selong Belanak Lombok
  "BNT-26": { lat: -8.2500, lon: 117.5500 }, // Pulau Moyo Sumbawa NTB
  "BNT-27": { lat: -8.7167, lon: 116.0167 }, // Gili Nanggu Lombok Barat
  "BNT-28": { lat: -8.9167, lon: 116.5167 }, // Pink Beach Lombok (Tangsi)
  "BNT-29": { lat: -8.5000, lon: 116.8333 }, // Pulau Kenawa Sumbawa Barat
  "BNT-30": { lat: -8.4958, lon: 116.0500 }, // Pantai Senggigi Lombok Barat
  "BNT-31": { lat: -8.8983, lon: 116.2333 }, // Pantai Mawun Lombok Tengah
  "BNT-32": { lat: -8.9100, lon: 116.3217 }, // Pantai Tanjung Aan Lombok
  "BNT-33": { lat: -8.4500, lon: 116.7167 }, // Gili Kondo Lombok Timur
  "BNT-34": { lat: -8.6833, lon: 118.4000 }, // Lakey Peak Dompu NTB
  "BNT-35": { lat: -8.1167, lon: 117.7500 }, // Pulau Satonda Dompu NTB
  "BNT-36": { lat: -8.5833, lon: 119.4833 }, // Pulau Komodo NTT
  "BNT-37": { lat: -8.6500, lon: 119.5667 }, // Pulau Padar Manggarai Barat NTT
  "BNT-38": { lat: -8.6000, lon: 119.5167 }, // Pink Beach Komodo NTT
  "BNT-39": { lat: -8.5500, lon: 119.6167 }, // Manta Point Komodo NTT
  "BNT-40": { lat: -8.4958, lon: 119.7667 }, // Pulau Kanawa Komodo NTT
  "BNT-41": { lat: -8.5500, lon: 119.8167 }, // Pulau Kelor Labuan Bajo NTT
  "BNT-42": { lat: -8.6833, lon: 119.6833 }, // Pulau Rinca Manggarai Barat NTT
  "BNT-43": { lat: -9.6500, lon: 119.9833 }, // Pantai Nihiwatu Sumba Barat NTT
  "BNT-44": { lat: -8.7167, lon: 122.1833 }, // Pantai Koka Sikka Flores NTT
  "BNT-45": { lat: -10.6167, lon: 122.8667 }, // Pantai Nemberala Rote Ndao NTT
  "BNT-46": { lat: -8.1833, lon: 124.5167 }, // Pantai Deere Alor NTT
  "BNT-47": { lat: -8.5167, lon: 119.8667 }, // Pantai Pede Labuan Bajo NTT
  "BNT-48": { lat: -8.4500, lon: 119.5667 }, // Gili Lawa Manggarai Barat NTT
  "BNT-49": { lat: -8.5500, lon: 119.6000 }, // Taka Makassar Komodo NTT
  "BNT-50": { lat: -8.5167, lon: 119.6667 }, // Pulau Siaba Komodo NTT
  "BNT-51": { lat: -8.4000, lon: 119.8833 }, // Pulau Seraya Labuan Bajo NTT
  "BNT-52": { lat: -9.6167, lon: 120.3500 }, // Pantai Walakiri Sumba Timur NTT
  "BNT-53": { lat: -9.4167, lon: 119.0167 }, // Pantai Mandorak Sumba Barat Daya
  "BNT-54": { lat: -10.1500, lon: 123.6667 }, // Pantai Lasiana Kupang NTT
  "BNT-55": { lat: -10.1833, lon: 123.4167 }, // Pulau Semau Kupang NTT
  "BNT-56": { lat: -8.4167, lon: 122.5000 }, // Pulau Babi Sikka Flores NTT
  "BNT-57": { lat: -8.6913, lon: 115.1557 }, // Pantai Seminyak Badung Bali
  "BNT-58": { lat: -8.6592, lon: 115.1301 }, // Pantai Canggu Badung Bali
  "BNT-59": { lat: -8.8056, lon: 115.1111 }, // Pantai Bingin Badung Bali
  "BNT-60": { lat: -8.7917, lon: 115.1236 }, // Pantai Balangan Badung Bali
  "BNT-61": { lat: -8.7986, lon: 115.1181 }, // Pantai Dreamland Badung Bali
  "BNT-62": { lat: -8.7956, lon: 115.2217 }, // Pantai Nusa Dua Badung Bali
  "BNT-63": { lat: -8.5333, lon: 115.5167 }, // Bias Tugel Padangbai Bali
  "BNT-64": { lat: -8.5000, lon: 115.6167 }, // Virgin Beach (Perasi) Karangasem
  "BNT-65": { lat: -8.5833, lon: 115.3333 }, // Pantai Keramas Gianyar Bali
  "BNT-66": { lat: -8.7500, lon: 115.9333 }, // Gili Asahan Sekotong Lombok Barat
  "BNT-67": { lat: -8.4833, lon: 116.0333 }, // Pantai Mangsit Lombok Barat
  "BNT-68": { lat: -8.9333, lon: 116.4833 }, // Pantai Tanjung Bloam Lombok Timur
  "BNT-69": { lat: -8.5167, lon: 119.8000 }, // Pulau Pasir Komodo Labuan Bajo
  "BNT-70": { lat: -9.9167, lon: 124.6167 }, // Pantai Oetune TTS NTT
  "BNT-71": { lat: -9.9667, lon: 124.5000 }, // Pantai Kolbano TTS NTT
  "BNT-72": { lat: -8.2167, lon: 124.5500 }, // Teluk Kabola Alor NTT

  // === SULAWESI (SLW-01 s/d SLW-40) ===
  "SLW-01": { lat: -2.6667, lon: 118.8833 }, // Pantai Manakarra Mamuju Sulbar
  "SLW-02": { lat: -2.6333, lon: 118.8667 }, // Pulau Karampuang Mamuju Sulbar
  "SLW-03": { lat: -6.6833, lon: 121.0833 }, // Taka Bonerate Selayar Sulsel
  "SLW-04": { lat: -5.1242, lon: 119.3436 }, // Pulau Samalona Makassar Sulsel
  "SLW-05": { lat: -4.7000, lon: 118.9500 }, // Pulau Kapoposang Pangkep Sulsel
  "SLW-06": { lat: -5.6139, lon: 120.4578 }, // Pantai Bira Bulukumba Sulsel
  "SLW-07": { lat: -5.1477, lon: 119.4069 }, // Pantai Losari Makassar Sulsel
  "SLW-08": { lat: -5.1333, lon: 119.3917 }, // Pulau Lae-Lae Makassar Sulsel
  "SLW-09": { lat: -5.1000, lon: 119.2833 }, // Kodingareng Keke Makassar Sulsel
  "SLW-10": { lat: -5.4667, lon: 123.7500 }, // Hoga Wakatobi Sultra
  "SLW-11": { lat: -5.7500, lon: 123.9500 }, // Tomia Wakatobi Sultra
  "SLW-12": { lat: -3.9056, lon: 122.6167 }, // Pantai Toronipa Konawe Sultra
  "SLW-13": { lat: -3.9167, lon: 122.6500 }, // Pulau Bokori Konawe Sultra
  "SLW-14": { lat: -5.9167, lon: 124.0167 }, // Pulau Binongko Wakatobi Sultra
  "SLW-15": { lat: -0.3667, lon: 121.8500 }, // Kadidiri Togean Tojo Una-Una
  "SLW-16": { lat: -0.8756, lon: 119.8667 }, // Pantai Talise Palu Sulteng
  "SLW-17": { lat: 0.4000, lon: 123.1500 }, // Olele Bone Bolango Gorontalo
  "SLW-18": { lat: 0.9167, lon: 122.8833 }, // Pulau Saronde Gorontalo Utara
  "SLW-19": { lat: 0.4667, lon: 122.3167 }, // Pulau Cinta Boalemo Gorontalo
  "SLW-20": { lat: 0.4851, lon: 123.0982 }, // Hiu Paus Botubarani Gorontalo
  "SLW-21": { lat: 1.6231, lon: 124.7644 }, // Taman Nasional Bunaken Manado
  "SLW-22": { lat: 1.4422, lon: 125.2289 }, // Selat Lembeh Bitung Sulut
  "SLW-23": { lat: 1.5833, lon: 125.1167 }, // Pantai Paal Minahasa Utara
  "SLW-24": { lat: 1.7456, lon: 125.1439 }, // Pulau Bangka Likupang Minahasa Utara
  "SLW-25": { lat: 1.6250, lon: 124.8000 }, // Pulau Siladen Manado Sulut
  "SLW-26": { lat: 1.6333, lon: 124.7000 }, // Pulau Manado Tua Manado Sulut
  "SLW-27": { lat: 1.7000, lon: 125.1333 }, // Tanjung Pulisan Minahasa Utara
  "SLW-28": { lat: 1.8333, lon: 125.0833 }, // Pulau Talise Minahasa Utara
  "SLW-29": { lat: -3.5333, lon: 118.9667 }, // Pantai Dato Majene Sulbar
  "SLW-30": { lat: -0.6278, lon: 119.7444 }, // Pantai Tanjung Karang Donggala
  "SLW-31": { lat: -0.6667, lon: 119.7333 }, // Pusat Laut Donggala Sulteng
  "SLW-32": { lat: -1.3333, lon: 123.3667 }, // Danau Paisupok Banggai Kepulauan
  "SLW-33": { lat: -0.9500, lon: 122.8000 }, // Pantai Kilo 5 Luwuk Banggai
  "SLW-34": { lat: -5.5000, lon: 122.5833 }, // Pantai Nirwana Baubau Sultra
  "SLW-35": { lat: -4.8333, lon: 122.7167 }, // Pantai Meleura Muna Sultra
  "SLW-36": { lat: -0.3500, lon: 121.9000 }, // Danau Ubur-Ubur Mariona Togean
  "SLW-37": { lat: -3.4500, lon: 122.4500 }, // Pulau Labengki Konawe Utara Sultra
  "SLW-38": { lat: -3.2500, lon: 122.3833 }, // Pulau Sombori Morowali Sulteng
  "SLW-39": { lat: 1.7500, lon: 124.7833 }, // Pulau Nain Minahasa Utara
  "SLW-40": { lat: 1.7333, lon: 125.0833 }, // Pulau Lihaga Likupang Sulut

  // === MALUKU (MLK-01 s/d MLK-24) ===
  "MLK-01": { lat: 2.1833, lon: 128.4167 }, // Pulau Morotai Maluku Utara
  "MLK-02": { lat: 0.8500, lon: 127.3167 }, // Pantai Sulamadaha Ternate
  "MLK-03": { lat: 0.8000, lon: 127.3833 }, // Benteng Tolukko Ternate
  "MLK-04": { lat: 2.0494, lon: 128.2989 }, // Pulau Dodola Morotai Malut
  "MLK-05": { lat: -4.5244, lon: 129.9042 }, // Banda Neira Maluku Tengah
  "MLK-06": { lat: -4.5833, lon: 130.0333 }, // Pulau Hatta Banda Maluku
  "MLK-07": { lat: -3.0167, lon: 129.5833 }, // Pantai Ora Seram Utara Maluku
  "MLK-08": { lat: -3.6167, lon: 128.2833 }, // Pantai Natsepa Ambon Maluku
  "MLK-09": { lat: -5.6333, lon: 132.7333 }, // Pasir Panjang Ngurbloat Kei Malra
  "MLK-10": { lat: -3.5167, lon: 128.3333 }, // Pantai Liang Ambon Maluku
  "MLK-11": { lat: -3.6958, lon: 128.1817 }, // Benteng Victoria Ambon Maluku
  "MLK-12": { lat: -4.5167, lon: 129.7833 }, // Pulau Ai Banda Maluku
  "MLK-13": { lat: -4.5500, lon: 129.6833 }, // Pulau Run Banda Maluku
  "MLK-14": { lat: -3.5333, lon: 128.3667 }, // Pulau Pombo Ambon Maluku
  "MLK-15": { lat: -3.5167, lon: 128.3333 }, // Pantai Liang (Hunimua) Ambon
  "MLK-16": { lat: -3.6167, lon: 128.2833 }, // Pantai Natsepa Ambon
  "MLK-17": { lat: -3.7667, lon: 128.1500 }, // Pantai Pintu Kota Ambon
  "MLK-18": { lat: -3.0167, lon: 129.5833 }, // Pantai Ora Seram Maluku
  "MLK-19": { lat: -3.0000, lon: 129.6167 }, // Tebing Hatupia Sawai Seram
  "MLK-20": { lat: -5.6333, lon: 132.7333 }, // Pantai Ngurbloat Kei
  "MLK-21": { lat: -5.5833, lon: 132.6833 }, // Pulau Bair (Raja Ampat Mini Kei)
  "MLK-22": { lat: -5.6000, lon: 132.7000 }, // Pantai Ohoidertawun Kei
  "MLK-23": { lat: -3.5333, lon: 128.3667 }, // Pulau Pombo Ambon
  "MLK-24": { lat: -4.5833, lon: 130.0333 }, // Pulau Hatta Banda Maluku

  // === PAPUA (PPA-01 s/d PPA-25) ===
  "PPA-01": { lat: -0.5667, lon: 130.2667 }, // Piaynemo Raja Ampat
  "PPA-02": { lat: 0.1833, lon: 130.0333 }, // Wayag Raja Ampat
  "PPA-03": { lat: -0.5633, lon: 130.5167 }, // Arborek Raja Ampat
  "PPA-04": { lat: -1.8833, lon: 130.1667 }, // Misool Raja Ampat
  "PPA-05": { lat: -0.5500, lon: 130.6833 }, // Cape Kri Raja Ampat
  "PPA-06": { lat: -0.3833, lon: 130.5500 }, // Teluk Kabui Raja Ampat
  "PPA-07": { lat: -2.5000, lon: 134.5000 }, // Teluk Cenderawasih Wondama
  "PPA-08": { lat: -0.8900, lon: 134.0900 }, // Pulau Mansinam Manokwari
  "PPA-09": { lat: -2.5167, lon: 140.7167 }, // Pantai Base-G Jayapura
  "PPA-10": { lat: -2.5667, lon: 140.7167 }, // Pantai Hamadi Jayapura
  "PPA-11": { lat: -8.4167, lon: 140.5833 }, // Taman Nasional Wasur Merauke
  "PPA-12": { lat: -8.5083, lon: 140.3833 }, // Pantai Lampu Satu Merauke
  "PPA-13": { lat: -8.5333, lon: 140.4000 }, // Pantai Payum Merauke
  "PPA-14": { lat: -2.5167, lon: 140.7167 }, // Pantai Base G Kota Jayapura
  "PPA-15": { lat: -2.5667, lon: 140.7167 }, // Pantai Hamadi Kota Jayapura
  "PPA-16": { lat: -2.6167, lon: 140.7667 }, // Pantai Holtekamp Jayapura
  "PPA-17": { lat: -2.4833, lon: 140.4667 }, // Pantai Harlem Jayapura
  "PPA-18": { lat: -2.4667, lon: 140.4167 }, // Pantai Tablanusu Jayapura
  "PPA-19": { lat: -1.2500, lon: 136.4167 }, // Kepulauan Padaido Biak Numfor
  "PPA-20": { lat: -1.1833, lon: 136.2167 }, // Pantai Bosnik Biak Timur
  "PPA-21": { lat: -3.8833, lon: 134.1167 }, // Teluk Triton Kaimana Papua Barat
  "PPA-22": { lat: -0.5633, lon: 130.5167 }, // Pulau Arborek Raja Ampat
  "PPA-23": { lat: -0.5667, lon: 130.2667 }, // Kepulauan Fam (Piaynemo) Raja Ampat
  "PPA-24": { lat: -1.9500, lon: 130.3333 }, // Danau Lenmakana Misool
  "PPA-25": { lat: -0.5667, lon: 130.6333 }, // Selat Dampier (Kri & Mansuar) Raja Ampat

  // --- DESTINASI WISATA MARITIM TERSEMBUNYI (HIDDEN GEMS) BARU ---
  // SUMATRA
  "SMT-61": { lat: -5.3500, lon: 102.2667 }, // Pulau Enggano Bengkulu Utara
  "SMT-62": { lat: -2.9167, lon: 108.2833 }, // Pantai Karang Nawing Belitung Timur
  "SMT-63": { lat: -2.7833, lon: 100.2167 }, // Pulau Sikakap Mentawai
  "SMT-64": { lat: -5.6167, lon: 105.1833 }, // Pantai Teluk Hantu Lampung
  "SMT-65": { lat: -1.8833, lon: 99.2333 },  // Pulau Silabu Nyang-Nyang Mentawai

  // JAWA
  "JWA-55": { lat: -8.4356, lon: 112.6358 }, // Pantai Teluk Asmara Malang Jatim
  "JWA-56": { lat: -8.1833, lon: 110.6833 }, // Pantai Nglambor Gunungkidul DIY
  "JWA-57": { lat: -8.4300, lon: 113.5833 }, // Pantai Payangan Jember Jatim
  "JWA-58": { lat: -7.7500, lon: 108.2833 }, // Pantai Karang Tawulan Tasikmalaya Jabar
  "JWA-59": { lat: -8.3333, lon: 112.0833 }, // Pantai Pangi Blitar Jatim

  // KALIMANTAN
  "KLM-31": { lat: 0.7500, lon: 108.7167 },  // Pulau Lemukutan Bengkayang Kalbar
  "KLM-32": { lat: 1.2167, lon: 118.7333 },  // Pantai Biduk-Biduk Berau Kaltim
  "KLM-33": { lat: 1.2667, lon: 118.6833 },  // Labuan Cermin Berau Kaltim
  "KLM-34": { lat: 1.7500, lon: 118.5833 },  // Pulau Bilang-Bilangan Berau Kaltim

  // BALI & NUSA TENGGARA
  "BNT-73": { lat: -8.7770, lon: 115.6179 }, // Pantai Atuh Nusa Penida Bali
  "BNT-74": { lat: -8.8417, lon: 115.2000 }, // Pantai Gunung Payung Badung Bali
  "BNT-75": { lat: -8.7333, lon: 115.9000 }, // Gili Layar Lombok Barat NTB
  "BNT-76": { lat: -9.5833, lon: 119.0500 }, // Pantai Mbawana Sumba Barat NTT
  "BNT-77": { lat: -9.0000, lon: 124.8833 }, // Teluk Gurita Belu Timor NTT

  // SULAWESI
  "SLW-41": { lat: -3.2500, lon: 122.3833 }, // Pulau Sombori Morowali Sulteng
  "SLW-42": { lat: -3.4500, lon: 122.4500 }, // Pulau Labengki Konawe Utara Sultra
  "SLW-43": { lat: 0.4500, lon: 123.0167 },  // Pantai Biluhu Timur Gorontalo
  "SLW-44": { lat: -0.3500, lon: 121.9000 }, // Gua Halo Tabung Togean Sulteng

  // MALUKU
  "MLK-25": { lat: -5.5833, lon: 132.6833 }, // Pulau Bair Kei Malra
  "MLK-26": { lat: -5.6667, lon: 132.6167 }, // Pantai Ngurtafur Kei Malra
  "MLK-27": { lat: -4.5500, lon: 129.6833 }, // Pulau Rhun & Ay Banda Maluku

  // PAPUA
  "PPA-26": { lat: -1.9500, lon: 130.3333 }, // Danau Karst Lenmakana Misool
  "PPA-27": { lat: -0.3167, lon: 130.8500 }, // Kali Biru Warsambin Raja Ampat
  "PPA-28": { lat: -0.8333, lon: 131.2500 }, // Pantai Tanjung Kasuari Sorong
  "PPA-29": { lat: -2.5000, lon: 140.7333 }, // Pantai Pasir Enam Jayapura
  "PPA-30": { lat: 0.9167, lon: 134.3333 }   // Kepulauan Mapia Supiori Papua
};

module.exports = { EXACT_COORDINATES };
