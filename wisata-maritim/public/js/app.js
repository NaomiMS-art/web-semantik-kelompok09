// ==============================================================================
// INDONESIA MARITIME JOURNEY - CLIENT CONTROLLER (CLEAN ENTERPRISE)
// Mesin Pencari Wisata Maritim Semantik & Knowledge Graph W3C
// ==============================================================================

const APP_STATE = {
  currentTab: 'home', // 'home' | 'explorer' | 'sparql' | 'ontology' | 'favorites'
  query: '',
  filters: {
    rangeHarga: '',
    priceType: 'total', // 'total' | 'tiket' | 'aktivitas'
    level: '',
    aktivitas: '',
    alat: '',
    statusSewa: false,
    jenis: '',
    fasilitas: '',
    provinsi: '',
    wilayah: ''
  },
  sortBy: 'rekomendasi', // 'rekomendasi' | 'termurah' | 'termahal' | 'nama'
  currentPage: 1,
  pageSize: 12, // 12 item per slide/halaman (tidak scroll panjang)
  results: [],
  totalResults: 0,
  reasoningSteps: [],
  sparqlQuery: '',
  facets: null,
  activeDestDetail: null,
  favorites: JSON.parse(localStorage.getItem('imj_fav') || '[]'),
  history: JSON.parse(localStorage.getItem('imj_his') || '[]')
};

// Koleksi Foto Realistis Wisata Bahari Indonesia
const DEST_PHOTO_MAP = [
  { match: /rubiah|iboih|sabang/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /raja ampat|piaynemo|wayag|misool|kri|kabui/i, url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80' },
  { match: /bunaken|siladen|lembeh/i, url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80' },
  { match: /komodo|padar|rinca|manta point|pink beach|kanawa/i, url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80' },
  { match: /derawan|maratua|kakaban|sangalaki/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /wakatobi|hoga|tomia/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /gili trawangan|gili meno|gili air|lombok/i, url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
  { match: /kuta|sanur|pandawa|melasti|seminyak|uluwatu/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /nusa penida|kelingking|ceningan/i, url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80' },
  { match: /tulamben|amed|liberty/i, url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80' },
  { match: /lagundri|sorake|nias|mentawai/i, url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80' },
  { match: /karimunjawa/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /banda neira|maluku/i, url: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=800&q=80' },
  { match: /belitung|lengkuas|tanjung tinggi/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /bira|bulukumba/i, url: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=800&q=80' },
  { match: /pahawang|kiluan/i, url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
  { match: /tidung|harapan|pari|pramuka|kepulauan seribu/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' }
];

function getPhotoForDestination(dest) {
  for (const item of DEST_PHOTO_MAP) {
    if (item.match.test(dest.nama) || item.match.test(dest.lokasi)) {
      return item.url;
    }
  }
  if (dest.aktivitas.includes('Diving')) {
    return 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80';
  }
  if (dest.aktivitas.includes('Surfing')) {
    return 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80';
  }
  if (dest.aktivitas.includes('Snorkeling')) {
    return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80';
  }
  if (dest.aktivitas.includes('Satwa Laut')) {
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
}

// Preset Competency Questions untuk Konsol SPARQL
const SPARQL_PRESETS = [
  {
    title: "1. Snorkeling pemula budget <= Rp250.000 dengan alat tersedia",
    query: `PREFIX maritim: <http://wisatamaritim.id/ontology#>
PREFIX data: <http://wisatamaritim.id/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT ?nama ?provinsi ?level ?hargaTiket ?totalBiaya
WHERE {
  ?dest a maritim:DestinasiWisata ;
        maritim:namaDestinasi ?nama ;
        maritim:provinsi ?provinsi ;
        maritim:tingkatKeahlian ?level ;
        maritim:hargaTiketMasuk ?hargaTiket ;
        maritim:estimasiTotalBiaya ?totalBiaya ;
        maritim:memilikiAktivitas data:aktivitas_Snorkeling ;
        maritim:cocokUntukTingkat data:Tingkat_Pemula ;
        maritim:memilikiPenawaranAlat ?penawaran .
  ?penawaran maritim:alatTerkait data:alat_masker-snorkel ;
             maritim:statusSewa "Tersedia Disewa" .
  FILTER(?totalBiaya <= 250000)
}
ORDER BY ASC(?totalBiaya)
LIMIT 15`
  },
  {
    title: "2. Spot Diving di Sulawesi dengan Fasilitas Dive Center",
    query: `PREFIX maritim: <http://wisatamaritim.id/ontology#>
PREFIX data: <http://wisatamaritim.id/resource/>

SELECT DISTINCT ?nama ?provinsi ?level ?totalBiaya
WHERE {
  ?dest a maritim:DestinasiWisata ;
        maritim:namaDestinasi ?nama ;
        maritim:provinsi ?provinsi ;
        maritim:wilayah "Sulawesi" ;
        maritim:tingkatKeahlian ?level ;
        maritim:estimasiTotalBiaya ?totalBiaya ;
        maritim:memilikiAktivitas data:aktivitas_Diving .
}
ORDER BY ASC(?totalBiaya)
LIMIT 15`
  },
  {
    title: "3. Surfing level Mahir beserta rental papan selancar",
    query: `PREFIX maritim: <http://wisatamaritim.id/ontology#>
PREFIX data: <http://wisatamaritim.id/resource/>

SELECT DISTINCT ?nama ?provinsi ?level ?totalBiaya
WHERE {
  ?dest a maritim:DestinasiWisata ;
        maritim:namaDestinasi ?nama ;
        maritim:provinsi ?provinsi ;
        maritim:tingkatKeahlian "Mahir" ;
        maritim:estimasiTotalBiaya ?totalBiaya ;
        maritim:memilikiAktivitas data:aktivitas_Surfing ;
        maritim:memilikiPenawaranAlat ?penawaran .
  ?penawaran maritim:alatTerkait data:alat_papan-selancar .
}
ORDER BY ASC(?totalBiaya)
LIMIT 15`
  },
  {
    title: "4. Destinasi Maritim Gratis (Tiket Rp 0) di Maluku",
    query: `PREFIX maritim: <http://wisatamaritim.id/ontology#>
PREFIX data: <http://wisatamaritim.id/resource/>

SELECT ?nama ?lokasi ?level ?hargaTiket
WHERE {
  ?dest a maritim:DestinasiWisata ;
        maritim:namaDestinasi ?nama ;
        maritim:lokasiLengkap ?lokasi ;
        maritim:wilayah "Maluku" ;
        maritim:tingkatKeahlian ?level ;
        maritim:hargaTiketMasuk ?hargaTiket .
  FILTER(?hargaTiket == 0)
}
LIMIT 20`
  },
  {
    title: "5. Destinasi Konservasi Satwa Laut (Penyu, Manta, Hiu Paus)",
    query: `PREFIX maritim: <http://wisatamaritim.id/ontology#>
PREFIX data: <http://wisatamaritim.id/resource/>

SELECT DISTINCT ?nama ?provinsi ?wilayah ?level ?totalBiaya
WHERE {
  ?dest a maritim:DestinasiWisata ;
        maritim:namaDestinasi ?nama ;
        maritim:provinsi ?provinsi ;
        maritim:wilayah ?wilayah ;
        maritim:tingkatKeahlian ?level ;
        maritim:estimasiTotalBiaya ?totalBiaya ;
        maritim:memilikiAktivitas data:aktivitas_Satwa_Laut .
}
LIMIT 15`
  },
  {
    title: "6. Destinasi Bali & Nusa Tenggara pada Range Rp250.000–Rp500.000",
    query: `PREFIX maritim: <http://wisatamaritim.id/ontology#>
PREFIX data: <http://wisatamaritim.id/resource/>

SELECT DISTINCT ?nama ?provinsi ?level ?totalBiaya
WHERE {
  ?dest a maritim:DestinasiWisata ;
        maritim:namaDestinasi ?nama ;
        maritim:provinsi ?provinsi ;
        maritim:wilayah "Bali & Nusa Tenggara" ;
        maritim:tingkatKeahlian ?level ;
        maritim:kategoriHargaTotal data:Range_250k_500k ;
        maritim:estimasiTotalBiaya ?totalBiaya .
}
ORDER BY ASC(?totalBiaya)
LIMIT 15`
  }
];

const formatRupiah = (num) => {
  if (num === null || num === undefined) return '-';
  if (num === 0) return 'Gratis';
  return 'Rp' + Number(num).toLocaleString('id-ID');
};

const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

// ==============================================================================
// INITIALIZATION
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSearchForms();
  initFacetedFilterEvents();
  initSortingEvents();
  initModalEvents();
  initSparqlConsole();
  loadFacets();
  executeSearch();
});

function initNavigation() {
  const allNavBtns = document.querySelectorAll('.nav-link-btn[data-tab], .bottom-bar-btn[data-tab]');
  allNavBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(btn.dataset.tab);
    });
  });

  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });
  }
}

function switchTab(tabName) {
  APP_STATE.currentTab = tabName;
  document.querySelectorAll('.nav-link-btn[data-tab]').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabName);
  });
  document.querySelectorAll('.bottom-bar-btn[data-tab]').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabName);
  });

  document.querySelectorAll('.tab-view-section').forEach(view => {
    view.style.display = view.id === `view-${tabName}` ? 'block' : 'none';
  });

  if (tabName === 'ontology') loadOntologyContent();
  if (tabName === 'favorites') renderFavoritesView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Quick Category Filtering from Category Cards
window.filterByCategory = function(categoryKeyword) {
  APP_STATE.filters.jenis = categoryKeyword;
  APP_STATE.currentPage = 1;
  const sel = document.getElementById('filter-jenis');
  if (sel) sel.value = categoryKeyword;
  switchTab('explorer');
  executeSearch();
};

// Search Forms (Hero Search & Explorer Search)
function initSearchForms() {
  // 1. Hero Search Form
  const heroForm = document.getElementById('hero-search-form');
  const heroInput = document.getElementById('hero-search-input');
  const heroLevel = document.getElementById('hero-level-select');
  const heroRange = document.getElementById('hero-range-select');

  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      APP_STATE.query = heroInput.value.trim();
      if (heroLevel && heroLevel.value) APP_STATE.filters.level = heroLevel.value;
      if (heroRange && heroRange.value) APP_STATE.filters.rangeHarga = heroRange.value;
      APP_STATE.currentPage = 1;

      // Sync to Explorer input
      const explorerInput = document.getElementById('explorer-search-input');
      if (explorerInput) explorerInput.value = APP_STATE.query;

      switchTab('explorer');
      executeSearch();
    });
  }

  // 2. Explorer Search Form
  const explorerForm = document.getElementById('explorer-search-form');
  const explorerInput = document.getElementById('explorer-search-input');

  if (explorerForm) {
    explorerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      APP_STATE.query = explorerInput.value.trim();
      APP_STATE.currentPage = 1;
      executeSearch();
    });
  }

  // 3. Trending Chips
  document.querySelectorAll('.trending-tag[data-q]').forEach(tag => {
    tag.addEventListener('click', () => {
      const q = tag.dataset.q;
      APP_STATE.query = q;
      APP_STATE.currentPage = 1;
      if (heroInput) heroInput.value = q;
      if (explorerInput) explorerInput.value = q;
      switchTab('explorer');
      executeSearch();
    });
  });

  // 4. Modal SPARQL Inspector
  const btnSparql = document.getElementById('btn-show-query');
  if (btnSparql) {
    btnSparql.addEventListener('click', () => {
      openSparqlModal(APP_STATE.sparqlQuery);
    });
  }
}

// Faceted Filter Events
function initFacetedFilterEvents() {
  // Price Pills
  document.querySelectorAll('.price-pill-row').forEach(row => {
    row.addEventListener('click', () => {
      const val = row.dataset.val;
      if (APP_STATE.filters.rangeHarga === val) {
        APP_STATE.filters.rangeHarga = '';
        row.classList.remove('active');
      } else {
        APP_STATE.filters.rangeHarga = val;
        document.querySelectorAll('.price-pill-row').forEach(p => p.classList.remove('active'));
        row.classList.add('active');
      }
      APP_STATE.currentPage = 1;
      executeSearch();
    });
  });

  // Price Mode Pill (Total vs Tiket vs Aktivitas)
  document.querySelectorAll('.mode-tab-btn[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-tab-btn[data-mode]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      APP_STATE.filters.priceType = btn.dataset.mode;
      APP_STATE.currentPage = 1;
      executeSearch();
    });
  });

  // Skill Level Chips
  document.querySelectorAll('.skill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.val;
      if (APP_STATE.filters.level === val) {
        APP_STATE.filters.level = '';
        btn.classList.remove('active');
      } else {
        APP_STATE.filters.level = val;
        document.querySelectorAll('.skill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
      APP_STATE.currentPage = 1;
      executeSearch();
    });
  });

  // Select Inputs
  ['filter-aktivitas', 'filter-jenis', 'filter-wilayah', 'filter-provinsi'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => {
        const key = id.replace('filter-', '');
        APP_STATE.filters[key] = e.target.value;
        APP_STATE.currentPage = 1;
        executeSearch();
      });
    }
  });

  // Checkbox Sewa
  const sewaCb = document.getElementById('filter-sewa');
  if (sewaCb) {
    sewaCb.addEventListener('change', (e) => {
      APP_STATE.filters.statusSewa = e.target.checked;
      APP_STATE.currentPage = 1;
      executeSearch();
    });
  }

  // Peralatan Select (Top Layout)
  const eqSelect = document.getElementById('filter-equipment-select');
  if (eqSelect) {
    eqSelect.addEventListener('change', (e) => {
      APP_STATE.filters.alat = e.target.value;
      APP_STATE.currentPage = 1;
      executeSearch();
    });
  }

  // Toggle Collapse Panel Filter di Atas
  const toggleCollapseBtn = document.getElementById('btn-toggle-filter-collapse');
  const topFilterBody = document.getElementById('top-filter-body');
  const collapseBtnText = document.getElementById('collapse-btn-text');

  if (toggleCollapseBtn && topFilterBody) {
    toggleCollapseBtn.addEventListener('click', () => {
      const isCollapsed = topFilterBody.classList.toggle('collapsed');
      toggleCollapseBtn.setAttribute('aria-expanded', !isCollapsed);
      if (collapseBtnText) {
        collapseBtnText.textContent = isCollapsed ? 'Buka Panel Filter' : 'Sembunyikan Filter';
      }
    });
  }

  // Reset Button
  const resetBtn = document.getElementById('btn-reset-filter');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetAllFilters();
    });
  }

  // Mobile Filter Drawer Toggle, Close & Apply
  const toggleMobileBtn = document.getElementById('btn-toggle-mobile-filter');
  const filterPanel = document.getElementById('filter-sidebar-panel');
  const filterBtnText = document.getElementById('mobile-filter-btn-text');
  const closeFilterBtn = document.getElementById('btn-close-filter-mobile');
  const applyFilterBtn = document.getElementById('btn-apply-mobile-filter');

  const closeMobileDrawer = () => {
    if (filterPanel) filterPanel.classList.remove('mobile-expanded');
    if (filterBtnText) filterBtnText.textContent = 'Buka Filter & Kategori (6 Dimensi)';
    document.body.style.overflow = '';
  };

  if (toggleMobileBtn && filterPanel) {
    toggleMobileBtn.addEventListener('click', () => {
      const isExpanded = filterPanel.classList.toggle('mobile-expanded');
      if (filterBtnText) {
        filterBtnText.textContent = isExpanded ? 'Tutup Filter & Kategori' : 'Buka Filter & Kategori (6 Dimensi)';
      }
      document.body.style.overflow = isExpanded ? 'hidden' : '';
    });
  }

  if (closeFilterBtn) {
    closeFilterBtn.addEventListener('click', closeMobileDrawer);
  }

  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', () => {
      closeMobileDrawer();
      const grid = document.getElementById('destinations-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

function initSortingEvents() {
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      APP_STATE.sortBy = e.target.value;
      APP_STATE.currentPage = 1;
      sortAndRenderResults();
    });
  }
}

function resetAllFilters() {
  APP_STATE.filters = {
    rangeHarga: '',
    priceType: 'total',
    level: '',
    aktivitas: '',
    alat: '',
    statusSewa: false,
    jenis: '',
    fasilitas: '',
    provinsi: '',
    wilayah: ''
  };
  APP_STATE.query = '';
  APP_STATE.currentPage = 1;

  const heroInput = document.getElementById('hero-search-input');
  if (heroInput) heroInput.value = '';
  const explorerInput = document.getElementById('explorer-search-input');
  if (explorerInput) explorerInput.value = '';

  document.querySelectorAll('.price-pill-row').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.skill-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.custom-select').forEach(sel => sel.value = '');
  const sewaCb = document.getElementById('filter-sewa');
  if (sewaCb) sewaCb.checked = false;

  const heroLevel = document.getElementById('hero-level-select');
  const heroRange = document.getElementById('hero-range-select');
  if (heroLevel) heroLevel.value = '';
  if (heroRange) heroRange.value = '';

  executeSearch();
}

// ==============================================================================
// SEARCH CLIENT & PAGINATION ENGINE (SLIDE SELANJUTNYA)
// ==============================================================================
async function executeSearch() {
  const grid = document.getElementById('destinations-grid');
  const countLabel = document.getElementById('results-count-label');

  if (grid) {
    grid.innerHTML = '<div style="grid-column:1/-1;padding:3rem 1rem;text-align:center;color:var(--text-muted)">Menelusuri relasi semantik...</div>';
  }

  const params = new URLSearchParams();
  if (APP_STATE.query) params.set('q', APP_STATE.query);
  if (APP_STATE.filters.rangeHarga) params.set('rangeHarga', APP_STATE.filters.rangeHarga);
  if (APP_STATE.filters.priceType) params.set('priceType', APP_STATE.filters.priceType);
  if (APP_STATE.filters.level) params.set('level', APP_STATE.filters.level);
  if (APP_STATE.filters.aktivitas) params.set('aktivitas', APP_STATE.filters.aktivitas);
  if (APP_STATE.filters.alat) params.set('alat', APP_STATE.filters.alat);
  if (APP_STATE.filters.statusSewa) params.set('statusSewa', 'true');
  if (APP_STATE.filters.jenis) params.set('jenis', APP_STATE.filters.jenis);
  if (APP_STATE.filters.fasilitas) params.set('fasilitas', APP_STATE.filters.fasilitas);
  if (APP_STATE.filters.wilayah) params.set('wilayah', APP_STATE.filters.wilayah);
  if (APP_STATE.filters.provinsi) params.set('provinsi', APP_STATE.filters.provinsi);

  try {
    const res = await fetch(`/api/search?${params.toString()}`);
    const data = await res.json();

    APP_STATE.results = data.results || [];
    APP_STATE.totalResults = data.total || 0;
    APP_STATE.reasoningSteps = data.reasoningSteps || [];
    APP_STATE.sparqlQuery = data.sparqlQuery || '';

    renderSemanticReasoning(data.reasoningSteps);

    if (countLabel) {
      countLabel.textContent = `Ditemukan ${APP_STATE.totalResults} destinasi maritim`;
    }

    const mobileQuickCount = document.getElementById('mobile-results-quick-count');
    if (mobileQuickCount) {
      mobileQuickCount.textContent = `${APP_STATE.totalResults} spot`;
    }

    sortAndRenderResults();
  } catch (err) {
    console.error("Search error:", err);
    if (grid) {
      grid.innerHTML = `<div style="grid-column:1/-1;padding:2rem;text-align:center;color:red">Error: ${err.message}</div>`;
    }
  }
}

function sortAndRenderResults() {
  const sorted = [...APP_STATE.results];

  if (APP_STATE.sortBy === 'termurah') {
    sorted.sort((a, b) => a.estimasiTotalPerOrang - b.estimasiTotalPerOrang);
  } else if (APP_STATE.sortBy === 'termahal') {
    sorted.sort((a, b) => b.estimasiTotalPerOrang - a.estimasiTotalPerOrang);
  } else if (APP_STATE.sortBy === 'nama') {
    sorted.sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
  }

  // Hitung slide pagination (12 item per halaman)
  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / APP_STATE.pageSize) || 1;
  if (APP_STATE.currentPage > totalPages) APP_STATE.currentPage = 1;

  const startIndex = (APP_STATE.currentPage - 1) * APP_STATE.pageSize;
  const endIndex = Math.min(startIndex + APP_STATE.pageSize, totalItems);
  const pagedItems = sorted.slice(startIndex, endIndex);

  // Update pagination info label
  const pagedLabel = document.getElementById('results-paged-label');
  if (pagedLabel) {
    pagedLabel.textContent = `Halaman ${APP_STATE.currentPage} dari ${totalPages}`;
  }

  const paginationInfo = document.getElementById('pagination-info-text');
  if (paginationInfo) {
    paginationInfo.textContent = totalItems === 0 
      ? 'Tidak ada destinasi yang cocok' 
      : `Menampilkan ${startIndex + 1} - ${endIndex} dari ${totalItems} destinasi`;
  }

  renderDestinationCards(pagedItems);
  renderPaginationControls(totalPages);
}

// Render Tombol Pagination (Previous, Next, Numbered Pages)
function renderPaginationControls(totalPages) {
  const container = document.getElementById('pagination-pages-list');
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `
    <button type="button" class="page-nav-btn" ${APP_STATE.currentPage === 1 ? 'disabled' : ''} onclick="changePage(${APP_STATE.currentPage - 1})">
      <svg class="svg-icon svg-icon-sm"><use href="#icon-arrow-left"/></svg>
      <span>Sebelumnya</span>
    </button>
  `;

  // Window pagination [1, 2, 3...]
  const maxButtons = 5;
  let startPage = Math.max(1, APP_STATE.currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let p = startPage; p <= endPage; p++) {
    html += `
      <button type="button" class="page-num-btn ${p === APP_STATE.currentPage ? 'active' : ''}" onclick="changePage(${p})">
        ${p}
      </button>
    `;
  }

  html += `
    <button type="button" class="page-nav-btn" ${APP_STATE.currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${APP_STATE.currentPage + 1})">
      <span>Selanjutnya</span>
      <svg class="svg-icon svg-icon-sm"><use href="#icon-arrow-right"/></svg>
    </button>
  `;

  container.innerHTML = html;
}

window.changePage = function(newPage) {
  APP_STATE.currentPage = newPage;
  sortAndRenderResults();
  const explorerEl = document.getElementById('destinasi-explorer');
  if (explorerEl) explorerEl.scrollIntoView({ behavior: 'smooth' });
};

// Render Semantic Reasoning
function renderSemanticReasoning(steps) {
  const container = document.getElementById('semantic-reasoning-container');
  const chainEl = document.getElementById('reasoning-chain');
  if (!container || !chainEl) return;

  if (!steps || steps.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  chainEl.innerHTML = steps.map((step, idx) => {
    return `
      <div class="pipeline-step" title="Relasi Ontologi: ${step.relation}">
        <div>
          <small>${step.title}</small>
          <strong>${escapeHtml(step.value)}</strong>
        </div>
      </div>
      ${idx < steps.length - 1 ? '<span class="pipeline-separator"><svg class="svg-icon svg-icon-sm"><use href="#icon-arrow-right"/></svg></span>' : ''}
    `;
  }).join('');
}

// Render Destination Cards (Bersih, Realistis, Bebas Emoji)
function renderDestinationCards(destList) {
  const grid = document.getElementById('destinations-grid');
  if (!grid) return;

  if (!destList || destList.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; background:var(--bg-surface); border:1px dashed var(--border-subtle); border-radius:var(--radius-lg); padding:3.5rem 1.5rem; text-align:center;">
        <h4 style="font-family:var(--font-display);font-size:1.25rem;font-weight:800;color:var(--text-main);margin-bottom:0.5rem">
          Tidak ada destinasi yang cocok
        </h4>
        <p style="color:var(--text-muted);font-size:0.88rem;max-width:500px;margin:0 auto 1.5rem">
          Coba sesuaikan range harga, hilangkan pilihan peralatan tertentu, atau reset filter Anda.
        </p>
        <button type="button" class="btn-search-exec" style="margin:0 auto" onclick="resetAllFilters()">
          <span>Reset Semua Filter</span>
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = destList.map(d => {
    const isFav = APP_STATE.favorites.includes(d.id);
    const photoUrl = getPhotoForDestination(d);
    const skillClass = `skill-${(d.level || 'pemula').toLowerCase().split(' ')[0]}`;

    // Tag peralatan
    const eqChips = d.peralatan.slice(0, 3).map(eq => {
      const priceText = eq.hargaSewa ? formatRupiah(eq.hargaSewa) : 'Include';
      return `<span class="mini-gear-tag">${escapeHtml(eq.nama.split(' ')[0])} (${priceText})</span>`;
    }).join('');

    return `
      <article class="card-destination-pro" data-id="${d.id}">
        <div class="card-photo-banner">
          <img src="${photoUrl}" alt="${escapeHtml(d.nama)}" loading="lazy">
          <div class="card-photo-overlay">
            <div class="card-badge-row">
              <span class="badge-tag-clean">${escapeHtml(d.jenisWisata)}</span>
              <button type="button" class="btn-card-bookmark ${isFav ? 'active' : ''}" data-fav="${d.id}" title="Simpan Destinasi">
                <svg class="svg-icon svg-icon-sm"><use href="#icon-heart"/></svg>
              </button>
            </div>
            <div class="card-header-titles">
              <span class="card-code-tag">${d.id} · ${escapeHtml(d.wilayah)}</span>
              <h3 class="card-dest-name">${escapeHtml(d.nama)}</h3>
              <span class="card-dest-location">
                <svg class="svg-icon svg-icon-sm"><use href="#icon-pin"/></svg>
                ${escapeHtml(d.lokasi)}
              </span>
            </div>
          </div>
        </div>

        <div class="card-body-pro">
          <div class="card-pills-row">
            <span class="pill-info-chip ${skillClass}">
              Level: ${escapeHtml(d.level)}
            </span>
            <span class="pill-info-chip price-badge">
              Range: ${escapeHtml(d.rangeHargaTotalLabel)}
            </span>
          </div>

          <div class="equipment-section-preview">
            <div class="equipment-preview-head">
              <span>Peralatan &amp; Persewaan</span>
              <small>${d.peralatan.length} Macam Alat</small>
            </div>
            <div class="equipment-chips-wrap">
              ${eqChips || '<span class="mini-gear-tag">Tersedia di lokasi</span>'}
            </div>
          </div>

          <div class="card-action-footer">
            <div class="price-display-unit">
              <span>Estimasi Total / Orang</span>
              <strong>${formatRupiah(d.estimasiTotalPerOrang)}</strong>
            </div>
            <button type="button" class="btn-open-detail-pro" data-open="${d.id}">
              <span>Detail &amp; Budget</span>
              <svg class="svg-icon svg-icon-sm"><use href="#icon-arrow-right"/></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  grid.querySelectorAll('.btn-open-detail-pro').forEach(btn => {
    btn.addEventListener('click', () => {
      openDestinationModal(btn.dataset.open);
    });
  });

  grid.querySelectorAll('.btn-card-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(btn.dataset.fav);
    });
  });
}

// Facets Data Loading
async function loadFacets() {
  try {
    const res = await fetch('/api/facets');
    const facets = await res.json();
    APP_STATE.facets = facets;

    // Update pill counts
    const pillKeys = ['di-bawah-100k', '100k-250k', '250k-500k', '500k-1jt', 'di-atas-1jt'];
    pillKeys.forEach(k => {
      const el = document.querySelector(`.price-pill-row[data-val="${k}"] .pill-counter`);
      if (el && facets.rangeTotal[k] !== undefined) {
        el.textContent = facets.rangeTotal[k];
      }
    });

    // Populate Aktivitas Select
    const aktSel = document.getElementById('filter-aktivitas');
    if (aktSel && facets.aktivitas) {
      Object.keys(facets.aktivitas).sort().forEach(act => {
        const opt = document.createElement('option');
        opt.value = act;
        opt.textContent = `${act} (${facets.aktivitas[act]})`;
        aktSel.appendChild(opt);
      });
    }

    // Populate Wilayah Select
    const wilSel = document.getElementById('filter-wilayah');
    if (wilSel && facets.wilayah) {
      Object.keys(facets.wilayah).forEach(w => {
        const opt = document.createElement('option');
        opt.value = w;
        opt.textContent = `${w} (${facets.wilayah[w]})`;
        wilSel.appendChild(opt);
      });
    }

    // Populate Provinsi Select
    const provSel = document.getElementById('filter-provinsi');
    if (provSel && facets.provinsi) {
      Object.keys(facets.provinsi).forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = `${p} (${facets.provinsi[p]})`;
        provSel.appendChild(opt);
      });
    }

    // Populate Peralatan
    const eqList = document.getElementById('filter-equipment-list');
    if (eqList) {
      const topEquipments = [
        { id: 'masker-snorkel', name: 'Masker & Snorkel' },
        { id: 'fins-snorkeling', name: 'Fins (Kaki Katak)' },
        { id: 'life-jacket', name: 'Pelampung / Life Jacket' },
        { id: 'bcd-regulator', name: 'BCD & Regulator Selam' },
        { id: 'tabung-scuba', name: 'Tabung Scuba (Oksigen)' },
        { id: 'wetsuit-diving', name: 'Wetsuit Selam' },
        { id: 'papan-selancar', name: 'Papan Selancar (Surfboard)' },
        { id: 'kano-kayak', name: 'Perahu Kano / Kayak' },
        { id: 'sewa-perahu', name: 'Sewa Perahu Wisata' }
      ];

      eqList.innerHTML = topEquipments.map(eq => `
        <label class="custom-radio-item">
          <input type="radio" name="filter_eq" value="${eq.id}">
          <span>${eq.name}</span>
        </label>
      `).join('');

      eqList.querySelectorAll('input[name="filter_eq"]').forEach(radio => {
        radio.addEventListener('change', () => {
          APP_STATE.filters.alat = radio.checked ? radio.value : '';
          APP_STATE.currentPage = 1;
          executeSearch();
        });
      });
    }
  } catch (err) {
    console.error("Gagal load facets:", err);
  }
}

// ==============================================================================
// MODAL DETAIL, KALKULATOR & GRAF SEMANTIK
// ==============================================================================
function initModalEvents() {
  const modal = document.getElementById('dest-detail-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.close();
    });
  }

  document.querySelectorAll('.modal-tab-link[data-modaltab]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-tab-link[data-modaltab]').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#dest-detail-modal .tab-panel').forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const targetPanel = document.getElementById(`panel-${btn.dataset.modaltab}`);
      if (targetPanel) targetPanel.style.display = 'block';

      if (btn.dataset.modaltab === 'graph' && APP_STATE.activeDestDetail) {
        renderKnowledgeGraph(APP_STATE.activeDestDetail.knowledgeGraph);
      }
    });
  });
}

async function openDestinationModal(destId) {
  const modal = document.getElementById('dest-detail-modal');
  const body = document.getElementById('tab-dest-info');
  if (!modal) return;

  modal.showModal();
  body.innerHTML = '<div style="padding:2.5rem;text-align:center">Memuat detail semantik...</div>';

  try {
    const res = await fetch(`/api/destinasi/${destId}`);
    const data = await res.json();
    APP_STATE.activeDestDetail = data;

    const d = data.destinasi;
    const photo = getPhotoForDestination(d);

    document.getElementById('modal-header-img').src = photo;
    document.getElementById('modal-dest-code').textContent = `${d.id} · ${d.wilayah}`;
    document.getElementById('modal-dest-title').textContent = d.nama;
    document.getElementById('modal-dest-loc').textContent = d.lokasi;

    body.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
        <div>
          <h4 style="font-weight:700;color:var(--text-main);margin-bottom:0.6rem">Informasi Umum Destinasi</h4>
          <table class="data-table">
            <tr><th>Kabupaten / Kota</th><td>${escapeHtml(d.kabKota)}</td></tr>
            <tr><th>Provinsi / Wilayah</th><td>${escapeHtml(d.provinsi)} (${escapeHtml(d.wilayah)})</td></tr>
            <tr><th>Jenis Wisata</th><td>${escapeHtml(d.jenisWisata)}</td></tr>
            <tr><th>Tingkat Keahlian</th><td><strong style="color:var(--sea-blue)">${escapeHtml(d.level)}</strong></td></tr>
            <tr><th>Atraksi Unggulan</th><td>${escapeHtml(d.atraksi)}</td></tr>
            <tr><th>Fasilitas Pendukung</th><td>${escapeHtml(d.fasilitasStr)}</td></tr>
          </table>
        </div>
        <div>
          <h4 style="font-weight:700;color:var(--text-main);margin-bottom:0.6rem">Rincian Harga &amp; Budget</h4>
          <table class="data-table">
            <tr><th>Harga Tiket Masuk</th><td><strong style="color:#059669">${formatRupiah(d.hargaTiketMasuk)}</strong></td></tr>
            <tr><th>Kategori Range Tiket</th><td>${escapeHtml(d.rangeHargaTiketLabel)}</td></tr>
            <tr><th>Biaya Aktivitas Mulai</th><td>${d.hargaAktivitasMulai ? formatRupiah(d.hargaAktivitasMulai) : 'Sesuai sewa alat'}</td></tr>
            <tr><th>Paket Wisata / Kapal</th><td>${d.hargaPaketWisata ? formatRupiah(d.hargaPaketWisata) : '-'}</td></tr>
            <tr><th>Estimasi Total / Orang</th><td><strong style="color:var(--sea-blue);font-size:1.1rem">${formatRupiah(d.estimasiTotalPerOrang)}</strong></td></tr>
            <tr><th>Kategori Range Total</th><td><span class="badge-tag-clean">${escapeHtml(d.rangeHargaTotalLabel)}</span></td></tr>
          </table>
        </div>
      </div>

      <!-- Equipment Table -->
      <div style="margin-top:1.75rem">
        <h4 style="font-weight:700;color:var(--text-main);margin-bottom:0.6rem">Daftar Peralatan &amp; Ketentuan Sewa</h4>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Peralatan</th>
                <th>Aktivitas</th>
                <th>Status Sewa</th>
                <th>Harga Sewa</th>
                <th>Rekomendasi Level</th>
                <th>Keterangan Teknis</th>
              </tr>
            </thead>
            <tbody>
              ${d.peralatan.map(eq => `
                <tr>
                  <td><strong>${escapeHtml(eq.nama)}</strong></td>
                  <td>${escapeHtml(eq.kategoriAktivitas)}</td>
                  <td><span class="pill-info-chip" style="background:#ecfdf5;color:#065f46">${escapeHtml(eq.dapatDisewa ? 'Tersedia Disewa' : 'Termasuk Tiket')}</span></td>
                  <td><strong>${eq.hargaSewa ? formatRupiah(eq.hargaSewa) : 'Include'}</strong></td>
                  <td>${escapeHtml(eq.tingkatKeahlian)}</td>
                  <td style="font-size:0.75rem;color:var(--text-muted)">${escapeHtml(eq.keterangan)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Interactive Calculator -->
      <div class="calc-widget-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem">
          <div>
            <h4 style="font-weight:800;color:var(--text-main)">Simulasi Budget Rombongan &amp; Sewa Alat</h4>
            <p style="font-size:0.8rem;color:var(--text-muted)">Hitung estimasi pengeluaran secara real-time berdasarkan jumlah orang dan alat yang dipilih.</p>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem">
            <label style="font-size:0.85rem;font-weight:700">Jumlah Orang:</label>
            <input type="number" id="calc-people" min="1" max="50" value="2" style="width:70px;padding:0.4rem 0.6rem;border-radius:var(--radius-sm);border:1px solid #bae6fd;font-weight:700">
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem">
          <div style="background:white;padding:1rem;border-radius:var(--radius-md);border:1px solid #bae6fd">
            <strong style="font-size:0.82rem;display:block;margin-bottom:0.6rem">Centang Alat yang Ingin Disewa:</strong>
            <div id="calc-eq-checkboxes" style="display:flex;flex-direction:column;gap:0.45rem;max-height:160px;overflow-y:auto">
              ${d.peralatan.filter(eq => eq.hargaSewa > 0).map(eq => `
                <label class="custom-radio-item" style="font-size:0.8rem">
                  <input type="checkbox" class="calc-cb-item" data-price="${eq.hargaSewa}" checked>
                  <span>${escapeHtml(eq.nama)} (+${formatRupiah(eq.hargaSewa)})</span>
                </label>
              `).join('') || '<span style="font-size:0.75rem;color:var(--text-muted)">Semua alat sudah termasuk dalam tiket.</span>'}
            </div>
          </div>

          <div style="background:white;padding:1rem;border-radius:var(--radius-md);border:1px solid #bae6fd;display:flex;flex-direction:column;justify-content:center">
            <span style="font-size:0.75rem;color:var(--text-muted)">Total Estimasi Pengeluaran:</span>
            <strong id="calc-total-amount" style="font-family:var(--font-display);font-size:1.6rem;color:var(--sea-blue);font-weight:800">Rp 0</strong>
            <span id="calc-per-person-text" style="font-size:0.8rem;color:var(--text-muted);margin-top:0.25rem">Rp 0 / orang</span>
            <div id="calc-range-result" style="margin-top:0.6rem"></div>
          </div>
        </div>
      </div>
    `;

    initModalCalculator(d);
    document.getElementById('tab-dest-turtle').textContent = generateTurtleForDest(d);
    document.querySelector('.modal-tab-link[data-modaltab="info"]').click();
  } catch (err) {
    console.error("Gagal open modal:", err);
  }
}

function initModalCalculator(d) {
  const peopleInput = document.getElementById('calc-people');
  const totalAmount = document.getElementById('calc-total-amount');
  const perPersonText = document.getElementById('calc-per-person-text');
  const rangeResult = document.getElementById('calc-range-result');

  function calculate() {
    const people = Math.max(1, parseInt(peopleInput.value, 10) || 1);
    let eqCost = 0;

    document.querySelectorAll('.calc-cb-item').forEach(cb => {
      if (cb.checked) {
        eqCost += parseInt(cb.dataset.price, 10);
      }
    });

    const perPerson = d.hargaTiketMasuk + eqCost;
    const grandTotal = perPerson * people;

    totalAmount.textContent = formatRupiah(grandTotal);
    perPersonText.textContent = `${formatRupiah(perPerson)} per orang (Tiket ${formatRupiah(d.hargaTiketMasuk)} + Sewa Alat ${formatRupiah(eqCost)})`;

    let rangeLabel = '< Rp100.000';
    if (perPerson <= 100000) rangeLabel = '< Rp100.000';
    else if (perPerson <= 250000) rangeLabel = 'Rp100.000 – Rp250.000';
    else if (perPerson <= 500000) rangeLabel = 'Rp250.000 – Rp500.000';
    else if (perPerson <= 1000000) rangeLabel = 'Rp500.000 – Rp1.000.000';
    else rangeLabel = '> Rp1.000.000';

    rangeResult.innerHTML = `<span class="badge-tag-clean" style="background:#0284c7;color:white">Kategori Range: ${rangeLabel}</span>`;
  }

  peopleInput.addEventListener('input', calculate);
  document.querySelectorAll('.calc-cb-item').forEach(cb => cb.addEventListener('change', calculate));
  calculate();
}

function generateTurtleForDest(d) {
  return `@prefix maritim: <http://wisatamaritim.id/ontology#> .
@prefix data: <http://wisatamaritim.id/resource/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

data:destinasi_${d.id} a maritim:DestinasiWisata ;
    maritim:kode "${d.id}" ;
    maritim:namaDestinasi "${d.nama}" ;
    maritim:lokasiLengkap "${d.lokasi}" ;
    maritim:provinsi "${d.provinsi}" ;
    maritim:wilayah "${d.wilayah}" ;
    maritim:cocokUntukTingkat data:Tingkat_${d.level.replace(/\s+/g, '')} ;
    maritim:hargaTiketMasuk "${d.hargaTiketMasuk}"^^xsd:integer ;
    maritim:kategoriHargaTiket data:Range_${d.rangeHargaTiket} ;
    maritim:estimasiTotalBiaya "${d.estimasiTotalPerOrang}"^^xsd:integer ;
    maritim:kategoriHargaTotal data:Range_${d.rangeHargaTotal} ;
    ${d.aktivitas.map(a => `maritim:memilikiAktivitas data:aktivitas_${a.replace(/\s+/g, '_')}`).join(' ;\n    ')} ;
    ${d.peralatan.map((eq, i) => `maritim:memilikiPenawaranAlat data:offer_${d.id}_${i}`).join(' ;\n    ')} .`;
}

// ==============================================================================
// KNOWLEDGE GRAPH CANVAS (SMOOTH & INTERACTIVE)
// ==============================================================================
function renderKnowledgeGraph(graphData) {
  const canvas = document.getElementById('kg-canvas');
  if (!canvas || !graphData) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;

  const nodes = graphData.nodes.map((n, i) => {
    const isRoot = n.type === 'destinasi';
    const angle = (i / graphData.nodes.length) * Math.PI * 2;
    const radius = isRoot ? 0 : 140 + (i % 3) * 25;
    return {
      ...n,
      x: isRoot ? width / 2 : width / 2 + Math.cos(angle) * radius,
      y: isRoot ? height / 2 : height / 2 + Math.sin(angle) * radius,
      radius: isRoot ? 26 : 14
    };
  });

  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = n);

  const links = graphData.links.map(l => ({
    source: nodeMap[l.source] || nodes[0],
    target: nodeMap[l.target] || nodes[0],
    label: l.label
  }));

  const colors = {
    destinasi: '#0284c7',
    keahlian: '#10b981',
    rangeHarga: '#f59e0b',
    lokasi: '#14b8a6',
    aktivitas: '#3b82f6',
    peralatan: '#ec4899',
    fasilitas: '#8b5cf6'
  };

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Links
    links.forEach(link => {
      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const midX = (link.source.x + link.target.x) / 2;
      const midY = (link.source.y + link.target.y) / 2;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(link.label, midX, midY - 2);
    });

    // Nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = colors[node.type] || '#64748b';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = node.type === 'destinasi' ? 'bold 11px "Plus Jakarta Sans", sans-serif' : '10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + node.radius + 12);
    });
  }

  draw();

  let dragged = null;
  canvas.onmousedown = (e) => {
    const mx = e.offsetX;
    const my = e.offsetY;
    dragged = nodes.find(n => Math.hypot(n.x - mx, n.y - my) < n.radius + 6);
  };
  canvas.onmousemove = (e) => {
    if (dragged) {
      dragged.x = e.offsetX;
      dragged.y = e.offsetY;
      draw();
    }
  };
  window.onmouseup = () => { dragged = null; };
}

// ==============================================================================
// SPARQL CONSOLE CONTROLLER
// ==============================================================================
function initSparqlConsole() {
  const presetSel = document.getElementById('sparql-preset-select');
  const textarea = document.getElementById('sparql-query-input');
  const runBtn = document.getElementById('btn-run-sparql');

  if (presetSel && textarea) {
    presetSel.innerHTML = '<option value="">-- Pilih Competency Question / Contoh Query --</option>' +
      SPARQL_PRESETS.map((p, i) => `<option value="${i}">${p.title}</option>`).join('');

    presetSel.addEventListener('change', (e) => {
      const idx = e.target.value;
      if (idx !== '') textarea.value = SPARQL_PRESETS[idx].query;
    });
  }

  if (runBtn && textarea) {
    runBtn.addEventListener('click', () => {
      executeSparqlQuery(textarea.value.trim());
    });
  }

  if (textarea && !textarea.value) {
    textarea.value = SPARQL_PRESETS[0].query;
  }
}

async function executeSparqlQuery(queryString) {
  const container = document.getElementById('sparql-results-container');
  const meta = document.getElementById('sparql-meta-info');
  if (!container) return;

  container.innerHTML = '<div style="padding:1.5rem;text-align:center">Mengeksekusi Query SPARQL ke Triplestore...</div>';

  try {
    const res = await fetch('/api/sparql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: queryString })
    });
    const data = await res.json();

    if (data.error) {
      container.innerHTML = `<div style="padding:1rem;color:red;background:#fef2f2;border-radius:var(--radius-md)">Error: ${data.message}</div>`;
      return;
    }

    if (meta && data.meta) {
      meta.innerHTML = `
        <span>Waktu: <strong>${data.meta.executionTimeMs} ms</strong></span> |
        <span>Hasil: <strong>${data.meta.resultCount} baris</strong></span> |
        <span>Triples Terakses: <strong>${data.meta.totalTriples}</strong></span>
      `;
    }

    const vars = data.head ? data.head.vars : [];
    const bindings = data.results ? data.results.bindings : [];

    if (bindings.length === 0) {
      container.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--text-muted)">Query valid, namun tidak ada triple yang cocok.</div>';
      return;
    }

    container.innerHTML = `
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>${vars.map(v => `<th>?${v}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${bindings.map(row => `
              <tr>
                ${vars.map(v => {
                  const cell = row[v];
                  if (!cell) return '<td>-</td>';
                  const val = cell.value;
                  const isUri = cell.type === 'uri';
                  return `<td>${isUri ? `<span style="color:var(--sea-blue)">${val.split('/').pop()}</span>` : escapeHtml(val)}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div style="padding:1rem;color:red">Gagal mengeksekusi SPARQL: ${err.message}</div>`;
  }
}

function openSparqlModal(queryStr) {
  const modal = document.getElementById('sparql-preview-modal');
  const codeEl = document.getElementById('sparql-preview-code');
  if (modal && codeEl) {
    codeEl.textContent = queryStr || '# Tidak ada query aktif';
    modal.showModal();
  }
}

// ==============================================================================
// ONTOLOGY & FAVORITES
// ==============================================================================
async function loadOntologyContent() {
  const code = document.getElementById('ontology-code-viewer');
  if (!code) return;
  code.textContent = 'Mengunduh ontologi RDF maritim.ttl...';
  try {
    const res = await fetch('/api/ontology');
    code.textContent = await res.text();
  } catch (err) {
    code.textContent = 'Gagal memuat ontologi: ' + err.message;
  }
}

function toggleFavorite(id) {
  if (APP_STATE.favorites.includes(id)) {
    APP_STATE.favorites = APP_STATE.favorites.filter(x => x !== id);
  } else {
    APP_STATE.favorites.push(id);
  }
  localStorage.setItem('imj_fav', JSON.stringify(APP_STATE.favorites));

  document.querySelectorAll(`.btn-card-bookmark[data-fav="${id}"]`).forEach(btn => {
    const isFav = APP_STATE.favorites.includes(id);
    btn.classList.toggle('active', isFav);
  });

  if (APP_STATE.currentTab === 'favorites') renderFavoritesView();
}

function renderFavoritesView() {
  const grid = document.getElementById('favorites-cards-grid');
  if (!grid) return;
  const favItems = APP_STATE.results.filter(d => APP_STATE.favorites.includes(d.id));
  if (favItems.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;padding:3rem;text-align:center;color:var(--text-muted)">Belum ada destinasi tersimpan. Klik tombol simpan pada kartu destinasi.</div>';
    return;
  }
  renderDestinationCards(favItems);
}
