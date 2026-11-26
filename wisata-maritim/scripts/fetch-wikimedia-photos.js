const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'destinasi.json');

const BAD_FILENAME_RX = /(\.svg|\.pdf|\.ogv|\.webm|\.ogg|\.gif|flag_of|coat_of_arms|lambang_|logo_|map_of|locator_map|_location_map|_in_indonesia|coa_|emblem|seal_of|blank\.|icon|arrow|commons-logo|wikipedia-logo|wikimedia-logo|ambox|padlock)/i;

function isBadImageUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split('/').pop() || pathname;
    return BAD_FILENAME_RX.test(filename);
  } catch (_) {
    return BAD_FILENAME_RX.test(url);
  }
}

function normalizeForCompare(str) {
  return (str || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const GENERIC_PLACE_WORDS = new Set([
  'pantai', 'pulau', 'kepulauan', 'teluk', 'tanjung', 'taman', 'nasional',
  'danau', 'air', 'selat', 'gua', 'batu', 'pasir', 'putih', 'karang',
  'wisata', 'bahari', 'maritim', 'desa', 'kampung', 'muara', 'bukit',
  'gunung', 'cagar', 'alam', 'beach', 'island', 'islands', 'bay', 'cape',
  'timur', 'barat', 'selatan', 'utara', 'tengah', 'besar', 'kecil', 'baru', 'lama',
  'di', 'dan', 'the', 'of', 'new', 'old'
]);

function getDistinctiveTokens(destName) {
  const norm = normalizeForCompare(destName);
  const tokens = norm.split(' ').filter(t => t.length >= 3 && !GENERIC_PLACE_WORDS.has(t));
  if (tokens.length > 0) return tokens;
  return norm.split(' ').filter(t => t.length >= 3);
}

function titleMatchesDestination(title, destName) {
  const tNorm = normalizeForCompare(title);
  const dTokens = getDistinctiveTokens(destName);
  if (dTokens.length === 0) return false;
  return dTokens.every(tok => tNorm.includes(tok));
}

function filenameMatchesDestination(filename, destName) {
  const fNorm = normalizeForCompare(filename.replace(/^File:/i, ''));
  const dTokens = getDistinctiveTokens(destName);
  if (dTokens.length === 0) return false;
  return dTokens.every(tok => fNorm.includes(tok));
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchJson(url, attempt = 1) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'OmbakNusantaraBot/1.0 (https://github.com/web-semantik-kelompok09; wisata-maritim)'
    }
  });
  if ((res.status === 429 || res.status === 503) && attempt <= 3) {
    await sleep(1500 * attempt);
    return fetchJson(url, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function searchWikipediaImage(lang, dest) {
  const cleanName = dest.nama.replace(/\([^)]*\)/g, '').trim();
  const query = encodeURIComponent(cleanName);
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrlimit=4&prop=pageimages|info&piprop=thumbnail&pithumbsize=800&format=json`;
  try {
    const data = await fetchJson(url);
    const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
    pages.sort((a, b) => (a.index || 99) - (b.index || 99));
    for (const p of pages) {
      if (!p.thumbnail || !p.thumbnail.source) continue;
      const src = p.thumbnail.source;
      if (isBadImageUrl(src)) continue;
      if (p.thumbnail.width && p.thumbnail.width < 300) continue;
      if (titleMatchesDestination(p.title, cleanName)) {
        return { url: src, source: `${lang}.wikipedia (${p.title})` };
      }
    }
  } catch (_) {}
  return null;
}

async function searchCommonsImage(dest) {
  const cleanName = dest.nama.replace(/\([^)]*\)/g, '').trim();
  const query = encodeURIComponent(cleanName);
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=${query}&srlimit=6&format=json`;
  try {
    const data = await fetchJson(searchUrl);
    const hits = data?.query?.search || [];
    const matchingTitles = hits
      .map(h => h.title)
      .filter(t => !BAD_FILENAME_RX.test(t) && filenameMatchesDestination(t, cleanName));

    if (matchingTitles.length === 0) return null;

    const titlesParam = encodeURIComponent(matchingTitles.slice(0, 4).join('|'));
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${titlesParam}&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=800&format=json`;
    const infoData = await fetchJson(infoUrl);
    const pages = infoData?.query?.pages ? Object.values(infoData.query.pages) : [];

    for (const p of pages) {
      const ii = p.imageinfo?.[0];
      if (!ii) continue;
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(ii.mime)) continue;
      if (ii.width && ii.width < 500) continue;
      const imgUrl = ii.thumburl || ii.url;
      if (imgUrl && !isBadImageUrl(imgUrl)) {
        return { url: imgUrl, source: `commons (${p.title})` };
      }
    }
  } catch (_) {}
  return null;
}

async function findRealPhoto(dest) {
  // 1. Wikipedia Indonesia
  const idWiki = await searchWikipediaImage('id', dest);
  if (idWiki) return idWiki;

  // 2. Wikipedia Inggris
  const enWiki = await searchWikipediaImage('en', dest);
  if (enWiki) return enWiki;

  // 3. Wikimedia Commons
  const commons = await searchCommonsImage(dest);
  if (commons) return commons;

  return null;
}

async function run() {
  const dests = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  console.log(`Memproses ${dests.length} destinasi wisata maritim...`);

  const foundList = [];
  const missingList = [];
  const usedUrls = new Set();

  // Pertahankan yang sudah punya fotoSumber dari run sebelumnya
  const toProcess = [];
  for (const d of dests) {
    if (d.fotoSumber && d.foto && !usedUrls.has(d.foto)) {
      usedUrls.add(d.foto);
      foundList.push({ id: d.id, nama: d.nama, lokasi: d.lokasi, wilayah: d.wilayah, url: d.foto, source: d.fotoSumber });
    } else {
      toProcess.push(d);
    }
  }
  console.log(`Sudah ada foto asli: ${foundList.length}, akan dicari: ${toProcess.length}`);

  const BATCH_SIZE = 2;
  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(async (d) => {
      const hit = await findRealPhoto(d);
      return { dest: d, hit };
    }));

    for (const { dest, hit } of results) {
      if (hit && !usedUrls.has(hit.url)) {
        dest.foto = hit.url;
        dest.fotoSumber = hit.source;
        usedUrls.add(hit.url);
        foundList.push({ id: dest.id, nama: dest.nama, lokasi: dest.lokasi, wilayah: dest.wilayah, url: hit.url, source: hit.source });
      } else {
        missingList.push({ id: dest.id, nama: dest.nama, lokasi: dest.lokasi, wilayah: dest.wilayah });
      }
    }

    await sleep(350);

    if ((i + BATCH_SIZE) % 40 === 0 || i + BATCH_SIZE >= toProcess.length) {
      console.log(`Progress sisa: ${Math.min(i + BATCH_SIZE, toProcess.length)}/${toProcess.length} | Total Ditemukan: ${foundList.length} | Belum ada: ${missingList.length}`);
    }
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(dests, null, 2), 'utf8');
  const report = {
    total: dests.length,
    foundCount: foundList.length,
    missingCount: missingList.length,
    foundSample: foundList.slice(0, 15),
    missingList
  };
  fs.writeFileSync(path.join(__dirname, 'wikimedia-photo-report.json'), JSON.stringify(report, null, 2), 'utf8');
  console.log('Selesai! Laporan disimpan di scripts/wikimedia-photo-report.json');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
