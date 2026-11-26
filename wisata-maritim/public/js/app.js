// ==============================================================================
// INDONESIA MARITIME JOURNEY - CLIENT CONTROLLER (CLEAN ENTERPRISE)
// Mesin Pencari Wisata Maritim Semantik & Knowledge Graph W3C
// ==============================================================================

const APP_STATE = {
  currentTab: 'home', // 'home' | 'explorer' | 'map' | 'favorites'
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
  allDestinations: [],
  favorites: JSON.parse(localStorage.getItem('imj_fav') || '[]'),
  history: JSON.parse(localStorage.getItem('imj_his') || '[]')
};

// Koleksi Foto Realistis & Akurat Sesuai Karakter Tempat Wisata Bahari Indonesia (100% Foto Pantai & Laut)
const DEST_PHOTO_MAP = [
  // SUMATRA
  { match: /carocok|cingkuak|painan/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /pandan|sibolga/i, url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80' },
  { match: /mentawai|macaronis/i, url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80' },
  { match: /lagundri|sorake|nias/i, url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80' },
  { match: /mursala/i, url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80' },
  { match: /pasumpahan|sikuai/i, url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80' },
  { match: /air manis|malin kundang/i, url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80' },
  { match: /rubiah|iboih|gapang|sumur tiga/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /titik nol|sabang/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /lampuuk/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /pltd apung/i, url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80' },
  { match: /pulau banyak/i, url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80' },
  { match: /pantai cermin|berhala/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /lagoi|bintan|trikora/i, url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80' },
  { match: /anambas|padang melang/i, url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80' },
  { match: /barelang/i, url: 'https://images.unsplash.com/photo-1730178988919-0d7fe97bc499?auto=format&fit=crop&w=800&q=80' },
  { match: /batam|nongsa/i, url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80' },
  { match: /penyengat/i, url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80' },
  { match: /marlborough|benteng/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /pantai panjang bengkulu/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /tanjung tinggi|belitung|laskar pelangi/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /lengkuas|mercusuar/i, url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80' },
  { match: /parai tenggiri|matras|kepayang|batu berlayar/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /pahawang|kelagian|tegal mas/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /kiluan|lumba|dolphin/i, url: 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&w=800&q=80' },
  { match: /krakatau|anak krakatau/i, url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80' },
  { match: /tanjung setia/i, url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80' },

  // JAWA
  { match: /sawarna|tanjung layar/i, url: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=800&q=80' },
  { match: /anyer|tanjung lesung/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /tidung|jembatan cinta/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /pramuka|penyu/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /pari|pantai perawan|harapan/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /sunda kelapa/i, url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80' },
  { match: /ancol/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /pangandaran|batu karas/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /pelabuhan ratu|ujung genteng|santolo/i, url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80' },
  { match: /karimunjawa/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /parangtritis/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /indrayanti|siung|gunungkidul/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /papuma/i, url: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=800&q=80' },
  { match: /pulau merah/i, url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80' },
  { match: /tiga warna|teluk hijau/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /klayar/i, url: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=800&q=80' },
  { match: /gili labak|bawean/i, url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80' },

  // KALIMANTAN
  { match: /derawan|maratua/i, url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80' },
  { match: /kakaban/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /sangalaki/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /karimata|randayan|temajuk/i, url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80' },

  // BALI & NUSA TENGGARA
  { match: /kuta|seminyak|legian/i, url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
  { match: /kelingking/i, url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80' },
  { match: /crystal bay|ceningan|lembongan/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /tulamben|liberty/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /menjangan|amed/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /sanur/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /uluwatu/i, url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
  { match: /tanjung benoa/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /lovina/i, url: 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&w=800&q=80' },
  { match: /tanah lot/i, url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
  { match: /melasti|pandawa/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /padang padang/i, url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80' },
  { match: /gili trawangan/i, url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
  { match: /gili meno|gili air|gili nanggu/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /mandalika|selong belanak/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /pink beach/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /padar/i, url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80' },
  { match: /komodo|rinca/i, url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80' },
  { match: /kanawa|kelor|taka makassar/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /nihiwatu|nemberala/i, url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80' },

  // SULAWESI
  { match: /wakatobi|hoga|tomia/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /taka bonerate/i, url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80' },
  { match: /bira|bulukumba/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /losari|makassar/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /togean|kadidiri/i, url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80' },
  { match: /botubarani|hiu paus/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /bunaken|siladen/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { match: /lembeh/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },

  // MALUKU
  { match: /morotai|dodola/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { match: /banda neira/i, url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80' },
  { match: /pantai ora/i, url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80' },
  { match: /ngurbloat|kei/i, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },

  // PAPUA
  { match: /wayag/i, url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80' },
  { match: /piaynemo/i, url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80' },
  { match: /misool/i, url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80' },
  { match: /raja ampat|kri|arborek/i, url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80' },
  { match: /cenderawasih|kwatisore/i, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' }
];

function getPhotoForDestination(dest) {
  for (const item of DEST_PHOTO_MAP) {
    if (item.match.test(dest.nama) || item.match.test(dest.lokasi) || (dest.id && item.match.test(dest.id))) {
      return item.url;
    }
  }
  if (dest.aktivitas && dest.aktivitas.includes('Surfing')) {
    return 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80';
  }
  if (dest.aktivitas && dest.aktivitas.includes('Diving')) {
    return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80';
  }
  if (dest.aktivitas && dest.aktivitas.includes('Snorkeling')) {
    return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80';
  }
  if (dest.aktivitas && (dest.aktivitas.includes('Satwa Laut') || dest.aktivitas.includes('Penyu') || dest.aktivitas.includes('Lumba-lumba'))) {
    return 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&w=800&q=80';
  }
  if (dest.jenisWisata && (dest.jenisWisata.includes('Sejarah') || dest.jenisWisata.includes('Budaya'))) {
    return 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80';
  }
  if (dest.jenisWisata && (dest.jenisWisata.includes('Pulau') || dest.jenisWisata.includes('Karst') || dest.jenisWisata.includes('Laguna'))) {
    return 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
}

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
  initThemeToggle();
  initSearchForms();
  initFacetedFilterEvents();
  initSortingEvents();
  initModalEvents();
  updateFavoriteBadge();
  loadFacets();
  loadAllDestinations().then(() => {
    initNearbyRecommendations();
    renderIndonesiaMapView();
    renderFavoritesView();
  });
  executeSearch();
});

function initThemeToggle() {
  const savedTheme = localStorage.getItem('imj_theme') ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  applyTheme(savedTheme);

  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      toggleTheme();
    });
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  try {
    localStorage.setItem('imj_theme', newTheme);
  } catch (e) {
    console.warn('Gagal menyimpan tema ke localStorage:', e);
  }
}
window.toggleTheme = toggleTheme;

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    const isDark = theme === 'dark';
    themeBtn.innerHTML = isDark
      ? '<svg class="svg-icon"><use href="#icon-sun"/></svg>'
      : '<svg class="svg-icon"><use href="#icon-moon"/></svg>';
    themeBtn.title = isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap';
    themeBtn.setAttribute('aria-label', themeBtn.title);
  }
}

function initNavigation() {
  const allNavBtns = document.querySelectorAll('.nav-link-btn[data-tab], .bottom-bar-btn[data-tab]');
  allNavBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(btn.dataset.tab);
    });
  });

  initScrollSpy();
}

let isManualScroll = false;
function switchTab(tabName) {
  APP_STATE.currentTab = tabName;
  document.querySelectorAll('.nav-link-btn[data-tab]').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabName);
  });
  document.querySelectorAll('.bottom-bar-btn[data-tab]').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabName);
  });

  const targetEl = document.getElementById(`view-${tabName}`);
  if (targetEl) {
    isManualScroll = true;
    const navOffset = 74;
    const elementPos = targetEl.getBoundingClientRect().top + window.pageYOffset;
    const offsetPos = Math.max(0, elementPos - navOffset);
    window.scrollTo({
      top: offsetPos,
      behavior: 'smooth'
    });
    setTimeout(() => {
      isManualScroll = false;
    }, 850);
  }

  if (tabName === 'favorites') renderFavoritesView();
  if (tabName === 'map') {
    renderIndonesiaMapView();
    setTimeout(() => {
      if (indonesiaMapInstance) indonesiaMapInstance.invalidateSize();
    }, 350);
  }
}

function initScrollSpy() {
  const sectionIds = ['home', 'explorer', 'map', 'favorites'];
  const sections = sectionIds
    .map(name => document.getElementById(`view-${name}`))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      if (isManualScroll) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tabName = entry.target.id.replace('view-', '');
          APP_STATE.currentTab = tabName;
          document.querySelectorAll('.nav-link-btn[data-tab]').forEach(b => {
            b.classList.toggle('active', b.dataset.tab === tabName);
          });
          document.querySelectorAll('.bottom-bar-btn[data-tab]').forEach(b => {
            b.classList.toggle('active', b.dataset.tab === tabName);
          });
          if (tabName === 'map' && indonesiaMapInstance) {
            indonesiaMapInstance.invalidateSize();
          }
        }
      });
    }, {
      rootMargin: '-25% 0px -55% 0px',
      threshold: 0.05
    });

    sections.forEach(sec => observer.observe(sec));
  }
}

// Quick Category Filtering from Category Cards
window.filterByCategory = function (categoryKeyword) {
  APP_STATE.filters.jenis = categoryKeyword;
  APP_STATE.currentPage = 1;
  const sel = document.getElementById('filter-jenis');
  if (sel) sel.value = categoryKeyword;
  switchTab('explorer');
  executeSearch();
};

// Quick Region Filtering from Region Cards & Pills
window.filterByRegion = function (regionName) {
  APP_STATE.filters.wilayah = regionName;
  APP_STATE.filters.provinsi = '';
  APP_STATE.currentPage = 1;
  const sel = document.getElementById('filter-wilayah');
  if (sel) sel.value = regionName;
  const provSel = document.getElementById('filter-provinsi');
  if (provSel) provSel.value = '';

  document.querySelectorAll('#explorer-wilayah-pills .filter-pill-opt').forEach(btn => {
    const isMatch = (btn.dataset.wil === regionName && !btn.dataset.prov);
    btn.classList.toggle('active', isMatch);
    if (isMatch) {
      const islandActiveCount = document.getElementById('island-active-count');
      if (islandActiveCount) {
        const name = btn.querySelector('.island-pill-name')?.textContent || regionName;
        const count = btn.querySelector('.island-pill-count')?.textContent || '';
        islandActiveCount.textContent = `${name} (${count} Wisata)`;
      }
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
  switchTab('explorer');
  executeSearch();
};

// DAFTAR PENCARIAN PALING SERING DICARI & REKOMENDASI PENCARIAN
const POPULAR_SEARCH_PRESETS = [
  {
    query: "snorkeling pemula budget 250rb ada alat",
    title: "Snorkeling Pemula &le; 250rb (Sewa Alat)",
    category: "Paling Populer",
    icon: "🤿",
    sub: "Inferensi otomatis tingkat pemula, filter budget, dan kelengkapan alat"
  },
  {
    query: "pantai pasir putih di Bali dan Lombok",
    title: "Pantai Pasir Putih Bali & Lombok",
    category: "Paling Populer",
    icon: "🏖️",
    sub: "Spot pantai pasir putih terpopuler untuk santai & foto"
  },
  {
    query: "spot diving mahir sewa bcd dan tabung scuba",
    title: "Diving Mahir + Sewa BCD & Tabung Scuba",
    category: "Paling Populer",
    icon: "🌊",
    sub: "Spot laut dalam dengan sertifikasi & peralatan lengkap"
  },
  {
    query: "surfing pemula sewa papan selancar",
    title: "Surfing Pemula + Sewa Papan",
    category: "Paling Populer",
    icon: "🏄",
    sub: "Ombak ramah pemula dan penyewaan papan surfing"
  },
  {
    query: "pulau eksotis hidden gem di Raja Ampat",
    title: "Pulau Eksotis Hidden Gem Raja Ampat",
    category: "Rekomendasi",
    icon: "🏝️",
    sub: "Danau karst, gugusan pulau karang & perairan jernih"
  },
  {
    query: "wisata bahari keluarga murah di Jawa",
    title: "Wisata Bahari Keluarga Murah di Jawa",
    category: "Rekomendasi",
    icon: "👨‍👩‍👧",
    sub: "Tiket terjangkau di bawah 50rb ramah anak & fasilitas lengkap"
  },
  {
    query: "sunset dan kano di Labuan Bajo",
    title: "Sunset & Kano Kayak Labuan Bajo",
    category: "Rekomendasi",
    icon: "🛶",
    sub: "Pemandangan matahari terbenam dan petualangan kano teluk"
  },
  {
    query: "snorkeling terumbu karang di Bunaken",
    title: "Snorkeling Terumbu Karang Bunaken",
    category: "Rekomendasi",
    icon: "🐠",
    sub: "Taman laut legendaris dengan keanekaragaman biota laut"
  },
  {
    query: "pantai pasir timbul Ngurtafur Maluku",
    title: "Pantai Pasir Timbul Ngurtafur Maluku",
    category: "Hidden Gem",
    icon: "✨",
    sub: "Hamparan pasir putih memanjang 2 km membelah lautan"
  },
  {
    query: "destinasi wisata gratis di Maluku",
    title: "Wisata Bahari Gratis di Maluku",
    category: "Budget Hemat",
    icon: "🏷️",
    sub: "Tiket masuk Rp0 tanpa biaya retribusi"
  }
];

function setupSearchAutocomplete(inputId, dropdownId) {
  const inputEl = document.getElementById(inputId);
  const dropEl = document.getElementById(dropdownId);
  if (!inputEl || !dropEl) return;

  const showSuggestions = (val) => {
    const q = (val || '').toLowerCase().trim();
    let matches = [];

    if (!q) {
      // Saat kosong / klik input, tampilkan pencarian paling sering dicari
      matches = POPULAR_SEARCH_PRESETS.slice(0, 7);
    } else {
      // 1. Cari dari daftar populer
      const fromPresets = POPULAR_SEARCH_PRESETS.filter(p =>
        p.query.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.sub.toLowerCase().includes(q)
      );

      // 2. Cari dari destinasi spesifik dengan smart matching (substring nama, leetspeak, & typo tolerance)
      const normQ = q
        .replace(/3/g, 'e').replace(/4|@/g, 'a').replace(/1|!|\|/g, 'i')
        .replace(/0/g, 'o').replace(/5|\$/g, 's').replace(/6|9/g, 'g')
        .replace(/8/g, 'b').replace(/7/g, 't').replace(/2/g, 'z')
        .replace(/([a-z])\1{2,}/g, '$1');

      const isSubseq = (s, w) => {
        if (s.length < 3 || w.length < 3 || s[0] !== w[0] || s.length / w.length < 0.48) return false;
        let i = 0;
        for (let j = 0; j < w.length && i < s.length; j++) if (s[i] === w[j]) i++;
        return i === s.length;
      };

      const allDests = APP_STATE.allDestinations || [];
      const scoredDests = allDests
        .map(d => {
          const namaLow = (d.nama || '').toLowerCase();
          const namaWords = namaLow.split(/[^a-z0-9]+/).filter(Boolean);
          let score = 0;
          if (namaWords.includes(normQ)) score = 120;
          else if (namaWords.some(w => w.startsWith(normQ))) score = 100;
          else if (namaLow.includes(normQ)) score = 75;
          else if (normQ.length >= 4 && namaWords.some(w => isSubseq(normQ, w))) score = 55;
          else if (normQ.length >= 4 && (
            (d.lokasi || '').toLowerCase().includes(normQ) ||
            (d.aktivitas || []).some(a => a.toLowerCase().includes(normQ))
          )) score = 30;
          return { d, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map(({ d }) => ({
          query: d.nama,
          title: d.nama,
          category: d.wilayah,
          icon: "📍",
          sub: `${d.lokasi} · Level ${d.level} · ${d.jenisWisata || 'Wisata Bahari'}`
        }));

      const fromDests = scoredDests;

      matches = [...fromPresets, ...fromDests].slice(0, 8);
    }

    if (matches.length === 0) {
      dropEl.innerHTML = `
        <div style="padding:1rem;font-size:0.82rem;color:var(--text-muted);text-align:center">
          Tidak ada rekomendasi langsung untuk "<strong>${escapeHtml(q)}</strong>".<br>
          <span style="font-size:0.75rem;color:var(--sea-blue);cursor:pointer" id="btn-force-search">Tekan Enter atau klik Cari untuk pencarian semantik penuh.</span>
        </div>
      `;
      dropEl.style.display = 'block';
      const forceBtn = dropEl.querySelector('#btn-force-search');
      if (forceBtn) {
        forceBtn.addEventListener('click', () => {
          applySearchQuery(q);
          dropEl.style.display = 'none';
        });
      }
      return;
    }

    const headerTitle = !q ? "🔥 Pencarian Paling Sering & Rekomendasi" : "💡 Saran & Rekomendasi Pencarian";

    dropEl.innerHTML = `
      <div class="suggestion-section-title">${headerTitle}</div>
      ${matches.map(m => `
        <div class="suggestion-item" data-q="${escapeHtml(m.query)}">
          <div class="suggestion-item-main">
            <span class="suggestion-icon">${m.icon}</span>
            <div class="suggestion-text-wrap">
              <span class="suggestion-query-text">${escapeHtml(m.title)}</span>
              <span class="suggestion-sub-text">${escapeHtml(m.sub)}</span>
            </div>
          </div>
          <span class="suggestion-tag-chip">${escapeHtml(m.category)}</span>
        </div>
      `).join('')}
    `;

    dropEl.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedQuery = item.dataset.q;
        inputEl.value = selectedQuery;
        dropEl.style.display = 'none';
        applySearchQuery(selectedQuery);
      });
    });

    dropEl.style.display = 'block';
  };

  inputEl.addEventListener('focus', () => {
    showSuggestions(inputEl.value);
  });

  inputEl.addEventListener('input', () => {
    showSuggestions(inputEl.value);
  });

  // Tutup dropdown saat klik di luar
  document.addEventListener('click', (e) => {
    if (!inputEl.contains(e.target) && !dropEl.contains(e.target)) {
      dropEl.style.display = 'none';
    }
  });

  // Navigasi keyboard Escape untuk menutup
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropEl.style.display = 'none';
    }
  });
}

function applySearchQuery(query) {
  APP_STATE.query = query.trim();
  APP_STATE.currentPage = 1;

  const heroInput = document.getElementById('hero-search-input');
  const explorerInput = document.getElementById('explorer-search-input');
  if (heroInput) heroInput.value = query;
  if (explorerInput) explorerInput.value = query;

  switchTab('explorer');
  executeSearch();
}

// Search Forms (Hero Search & Explorer Search)
function initSearchForms() {
  // 1. Hero Search Form
  const heroForm = document.getElementById('hero-search-form');
  const heroInput = document.getElementById('hero-search-input');
  const heroLevel = document.getElementById('hero-level-select');
  const heroRange = document.getElementById('hero-range-select');

  // Setup Autocomplete & Rekomendasi di Hero & Explorer
  setupSearchAutocomplete('hero-search-input', 'hero-search-suggestions');
  setupSearchAutocomplete('explorer-search-input', 'explorer-search-suggestions');

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

  // 3. Trending & Popular Chips
  document.querySelectorAll('.trending-tag[data-q]').forEach(tag => {
    tag.addEventListener('click', () => {
      const q = tag.dataset.q;
      applySearchQuery(q);
    });
  });
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
        if (key === 'wilayah') {
          document.querySelectorAll('#explorer-wilayah-pills .filter-pill-opt').forEach(btn => {
            const isMatch = btn.dataset.wil === e.target.value && !btn.dataset.prov;
            btn.classList.toggle('active', isMatch);
            if (isMatch) {
              const islandActiveCount = document.getElementById('island-active-count');
              if (islandActiveCount) {
                const name = btn.querySelector('.island-pill-name')?.textContent || 'Semua';
                const count = btn.querySelector('.island-pill-count')?.textContent || '';
                islandActiveCount.textContent = `${name} (${count} Wisata)`;
              }
              btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
          });
        }
        APP_STATE.currentPage = 1;
        executeSearch();
      });
    }
  });

  // Quick Wilayah & Island Horizontal Scroll Bar in Explorer
  const islandActiveCount = document.getElementById('island-active-count');

  document.querySelectorAll('#explorer-wilayah-pills .filter-pill-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const wil = btn.dataset.wil || '';
      const prov = btn.dataset.prov || '';
      APP_STATE.filters.wilayah = wil;
      APP_STATE.filters.provinsi = prov;
      APP_STATE.currentPage = 1;

      const sel = document.getElementById('filter-wilayah');
      if (sel) sel.value = wil;
      const provSel = document.getElementById('filter-provinsi');
      if (provSel) provSel.value = prov;

      document.querySelectorAll('#explorer-wilayah-pills .filter-pill-opt').forEach(b => {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      if (islandActiveCount) {
        const name = btn.querySelector('.island-pill-name')?.textContent || 'Semua';
        const count = btn.querySelector('.island-pill-count')?.textContent || '';
        islandActiveCount.textContent = `${name} (${count} Wisata)`;
      }

      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      executeSearch();
    });
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
  document.querySelectorAll('#explorer-wilayah-pills .filter-pill-opt').forEach(b => {
    const isAll = (b.dataset.wil === '' && !b.dataset.prov);
    b.classList.toggle('active', isAll);
  });
  const islandActiveCount = document.getElementById('island-active-count');
  if (islandActiveCount) islandActiveCount.textContent = 'Semua (305 Wisata)';
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
    params.set('_v', Date.now());
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

window.changePage = function (newPage) {
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
function renderDestinationCards(destList, targetGridId = 'destinations-grid') {
  const grid = document.getElementById(targetGridId);
  if (!grid) return;

  if (!destList || destList.length === 0) {
    if (targetGridId === 'favorites-cards-grid') {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; background:var(--bg-surface); border:1px dashed var(--border-subtle); border-radius:var(--radius-lg); padding:3.5rem 1.5rem; text-align:center;">
          <svg class="svg-icon" style="width:48px;height:48px;color:var(--text-muted);margin-bottom:1rem;stroke-width:1.5"><use href="#icon-heart"/></svg>
          <h4 style="font-family:var(--font-display);font-size:1.25rem;font-weight:800;color:var(--text-main);margin-bottom:0.5rem">
            Belum ada destinasi favorit tersimpan
          </h4>
          <p style="color:var(--text-muted);font-size:0.88rem;max-width:480px;margin:0 auto 1.5rem">
            Tandai destinasi bahari favorit Anda dengan menekan ikon hati pada kartu wisata untuk menyimpannya di sini.
          </p>
          <button type="button" class="btn-search-exec" style="margin:0 auto" onclick="switchTab('explorer')">
            <span>Jelajahi Destinasi</span>
          </button>
        </div>
      `;
    } else {
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
    }
    return;
  }

  grid.innerHTML = destList.map((d, idx) => {
    const isFav = APP_STATE.favorites.includes(d.id);
    const photoUrl = d.foto || getPhotoForDestination(d);
    const skillClass = `skill-${(d.level || 'pemula').toLowerCase().split(' ')[0]}`;

    // Tag nomor urut destinasi (menegaskan urutan lengkap 1 s/d 336)
    const numBadge = `<span class="badge-tag-clean" style="background:rgba(7,21,38,0.75);color:#fff;font-weight:700;font-size:0.68rem;padding:2px 6px">#${idx + 1}</span>`;

    // Tag peralatan
    const eqChips = (d.peralatan || []).slice(0, 3).map(eq => {
      const priceText = eq.hargaSewa ? formatRupiah(eq.hargaSewa) : 'Include';
      return `<span class="mini-gear-tag">${escapeHtml(eq.nama.split(' ')[0])} (${priceText})</span>`;
    }).join('');

    return `
      <article class="card-destination-pro" data-id="${d.id}">
        <div class="card-photo-banner">
          <img src="${photoUrl}" alt="${escapeHtml(d.nama)}" loading="lazy">
          <div class="card-photo-overlay">
            <div class="card-badge-row">
              <div style="display:flex;gap:0.35rem;align-items:center">
                <span class="badge-tag-clean">${escapeHtml(d.jenisWisata)}</span>
                ${numBadge}
              </div>
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

  // Klik seluruh kotak kartu untuk langsung membuka modal detail
  grid.querySelectorAll('.card-destination-pro').forEach(card => {
    card.addEventListener('click', (e) => {
      // Abaikan jika klik tombol bookmark agar aksi simpan favorit tidak tertimpa
      if (e.target.closest('.btn-card-bookmark')) return;
      openDestinationModal(card.dataset.id);
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
}

async function openDestinationModal(destId) {
  const modal = document.getElementById('dest-detail-modal');
  const body = document.getElementById('tab-dest-info');
  if (!modal) return;

  modal.showModal();

  // 1. Cari data lokal secara sinkron untuk render instan tanpa jeda/flicker
  let localDest = null;
  if (destId && APP_STATE.allDestinations && APP_STATE.allDestinations.length > 0) {
    const cleanId = String(destId).trim().toLowerCase();
    localDest = APP_STATE.allDestinations.find(x =>
      (x.id && x.id.toLowerCase() === cleanId) ||
      (x.nama && x.nama.toLowerCase() === cleanId) ||
      (x.nama && x.nama.toLowerCase().includes(cleanId))
    );
  }

  if (localDest) {
    const photo = localDest.foto || getPhotoForDestination(localDest);
    const headerImg = document.getElementById('modal-header-img');
    if (headerImg) headerImg.src = photo;
    const destCode = document.getElementById('modal-dest-code');
    if (destCode) destCode.textContent = `${localDest.id} · ${localDest.wilayah}`;
    const destTitle = document.getElementById('modal-dest-title');
    if (destTitle) destTitle.textContent = localDest.nama;
    const destLoc = document.getElementById('modal-dest-loc');
    if (destLoc) destLoc.textContent = localDest.lokasi;
  }

  body.innerHTML = '<div style="padding:2.5rem;text-align:center;color:var(--text-muted)">Memuat detail semantik &amp; kalkulator...</div>';

  try {
    const fetchId = localDest ? localDest.id : destId;
    let data = null;
    if (fetchId && fetchId !== 'undefined') {
      try {
        const res = await fetch(`/api/destinasi/${encodeURIComponent(fetchId)}`);
        if (res.ok) data = await res.json();
      } catch (_) { }
    }

    const d = (data && data.destinasi) ? data.destinasi : localDest;
    if (!d) {
      body.innerHTML = `
        <div style="padding:3rem 1.5rem;text-align:center;color:var(--text-muted)">
          <p style="font-size:1.15rem;font-weight:700;color:var(--text-main);margin-bottom:0.5rem">Destinasi Tidak Ditemukan</p>
          <p style="font-size:0.85rem">Silakan pilih destinasi wisata bahari lainnya dari katalog jelajah.</p>
        </div>
      `;
      return;
    }

    APP_STATE.activeDestDetail = data || { destinasi: d, semanticRecommendations: [] };

    const photo = d.foto || getPhotoForDestination(d);
    const headerImg = document.getElementById('modal-header-img');
    if (headerImg) headerImg.src = photo;
    const destCode = document.getElementById('modal-dest-code');
    if (destCode) destCode.textContent = `${d.id} · ${d.wilayah}`;
    const destTitle = document.getElementById('modal-dest-title');
    if (destTitle) destTitle.textContent = d.nama;
    const destLoc = document.getElementById('modal-dest-loc');
    if (destLoc) destLoc.textContent = d.lokasi;

    const modalFavBtn = document.getElementById('modal-dest-fav-btn');
    if (modalFavBtn) {
      modalFavBtn.dataset.fav = d.id;
      modalFavBtn.classList.toggle('active', APP_STATE.favorites.includes(d.id));
      modalFavBtn.onclick = (e) => {
        e.stopPropagation();
        toggleFavorite(d.id);
      };
    }

    body.innerHTML = `
      <!-- 4 HIGHLIGHT BUDGET KPI CARDS (PILIHAN DOKUMEN BUDGETING CEPAT) -->
      <div class="modal-budget-kpi-grid">
        <div class="modal-budget-kpi-card">
          <span class="modal-budget-kpi-label">
            <svg class="svg-icon svg-icon-sm" style="color:#059669"><use href="#icon-wallet"/></svg>
            Tiket Masuk
          </span>
          <strong class="modal-budget-kpi-val" style="color:#059669">${d.hargaTiketMasuk === 0 ? 'Gratis' : formatRupiah(d.hargaTiketMasuk)}</strong>
          <span class="modal-budget-kpi-sub">Kategori: ${escapeHtml(d.rangeHargaTiketLabel)}</span>
        </div>

        <div class="modal-budget-kpi-card">
          <span class="modal-budget-kpi-label">
            <svg class="svg-icon svg-icon-sm" style="color:var(--sea-blue)"><use href="#icon-compass"/></svg>
            Aktivitas Bahari
          </span>
          <strong class="modal-budget-kpi-val">${d.hargaAktivitasMulai ? formatRupiah(d.hargaAktivitasMulai) : 'Sesuai Sewa Alat'}</strong>
          <span class="modal-budget-kpi-sub">${escapeHtml(d.rangeHargaAktivitasLabel || 'Aktivitas Bebas / Mandiri')}</span>
        </div>

        <div class="modal-budget-kpi-card">
          <span class="modal-budget-kpi-label">
            <svg class="svg-icon svg-icon-sm" style="color:#f59e0b"><use href="#icon-tool"/></svg>
            Sewa Alat Min.
          </span>
          <strong class="modal-budget-kpi-val">${d.biayaAlatMin ? formatRupiah(d.biayaAlatMin) : 'Termasuk'}</strong>
          <span class="modal-budget-kpi-sub">${d.hargaPaketWisata ? 'Paket: ' + formatRupiah(d.hargaPaketWisata) : 'Tersedia di Lokasi'}</span>
        </div>

        <div class="modal-budget-kpi-card highlight">
          <span class="modal-budget-kpi-label">
            <svg class="svg-icon svg-icon-sm" style="color:var(--sea-blue)"><use href="#icon-target"/></svg>
            Estimasi Total / Orang
          </span>
          <strong class="modal-budget-kpi-val">${formatRupiah(d.estimasiTotalPerOrang)}</strong>
          <span class="modal-budget-kpi-sub"><span class="badge-tag-clean" style="font-size:0.68rem;padding:0.15rem 0.5rem;background:var(--sea-blue);color:white">${escapeHtml(d.rangeHargaTotalLabel)}</span></span>
        </div>
      </div>

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
          <h4 style="font-weight:700;color:var(--text-main);margin-bottom:0.6rem">Rincian Komponen Biaya</h4>
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
            <h4 style="font-weight:800;color:var(--text-main);font-size:1.05rem;margin:0 0 0.25rem 0">Simulasi Budget Rombongan &amp; Sewa Alat</h4>
            <p style="font-size:0.8rem;color:var(--text-muted);margin:0">Hitung estimasi pengeluaran secara real-time berdasarkan jumlah orang dan alat yang dipilih.</p>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem">
            <label for="calc-people" style="font-size:0.85rem;font-weight:700;color:var(--text-main)">Jumlah Orang:</label>
            <input type="number" id="calc-people" class="calc-people-input" min="1" max="50" value="2">
          </div>
        </div>

        <div class="calc-grid-row">
          <div class="calc-card-block">
            <strong class="calc-card-title">Centang Alat yang Ingin Disewa:</strong>
            <div id="calc-eq-checkboxes" style="display:flex;flex-direction:column;gap:0.45rem;max-height:160px;overflow-y:auto;padding-right:0.25rem">
              ${d.peralatan.filter(eq => eq.hargaSewa > 0).map(eq => `
                <label class="custom-radio-item" style="font-size:0.82rem">
                  <input type="checkbox" class="calc-cb-item" data-price="${eq.hargaSewa}" checked>
                  <span style="color:var(--text-main);font-weight:600">${escapeHtml(eq.nama)} <small style="color:var(--text-muted);font-weight:normal">(+${formatRupiah(eq.hargaSewa)})</small></span>
                </label>
              `).join('') || '<span style="font-size:0.78rem;color:var(--text-muted)">Semua alat sudah termasuk dalam tiket.</span>'}
            </div>
          </div>

          <div class="calc-card-block" style="display:flex;flex-direction:column;justify-content:center">
            <span style="font-size:0.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.04em">Total Estimasi Pengeluaran:</span>
            <strong id="calc-total-amount" style="font-family:var(--font-display);font-size:1.85rem;color:var(--accent-coral);font-weight:900;margin:0.25rem 0">Rp 0</strong>
            <span id="calc-per-person-text" style="font-size:0.82rem;color:var(--text-secondary);font-weight:500">Rp 0 / orang</span>
            <div id="calc-range-result" style="margin-top:0.75rem"></div>
          </div>
        </div>
      </div>

      <!-- SEKSI WISATA MARITIM TERDEKAT & PETA LOKASI -->
      <div style="margin-top:1.75rem">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem">
          <div>
            <div style="display:flex;align-items:center;gap:0.5rem">
              <span style="font-size:1.15rem">🌊</span>
              <h4 style="font-weight:800;color:var(--text-main);font-size:1.05rem;margin:0">
                Peta &amp; Wisata Maritim Terdekat di Sekitar Sini
              </h4>
            </div>
            <p style="font-size:0.8rem;color:var(--text-muted);margin:0.25rem 0 0 0">
              Jelajahi destinasi bahari, pantai, dan pulau lain yang berjarak paling dekat dari <strong>${escapeHtml(d.nama)}</strong>.
            </p>
          </div>
          <span class="badge-tag-clean" style="font-size:0.75rem;background:rgba(2,132,199,0.1);color:var(--sea-blue)" id="modal-nearby-count-badge">
            Wisata Bahari Sekitar
          </span>
        </div>

        <!-- PETA LEAFLET INTERAKTIF DESTINASI & WISATA BAHARI TERDEKAT -->
        <div id="modal-map-${d.id}" style="width:100%;height:320px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);margin-bottom:0.75rem;background:var(--bg-subtle)"></div>

        <!-- LEGENDA MINI PETA MODAL -->
        <div style="display:flex;gap:1.25rem;align-items:center;margin-bottom:1rem;padding:0.55rem 0.95rem;background:var(--bg-subtle);border:1px solid var(--border-subtle);border-radius:var(--radius-md);font-size:0.76rem;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:0.4rem">
            <span style="display:inline-block;width:14px;height:14px;background:#ef4444;border-radius:50%;border:2px solid white;box-shadow:0 0 8px rgba(239,68,68,0.9)"></span>
            <strong>Lokasi Pilihan: ${escapeHtml(d.nama)}</strong>
          </div>
          <div style="display:flex;align-items:center;gap:0.4rem">
            <span style="display:inline-block;width:14px;height:14px;background:#0284c7;border-radius:50%;border:2px solid white;box-shadow:0 0 8px rgba(2,132,199,0.9)"></span>
            <strong>Spot Wisata Bahari Sekitar</strong>
          </div>
          <div style="margin-left:auto;color:var(--text-muted);font-size:0.72rem">
            <em>⚡ Garis biru menunjukkan jarak langsung (Haversine Formula)</em>
          </div>
        </div>

        <!-- DAFTAR KARTU WISATA MARITIM TERDEKAT -->
        <div class="nearby-spots-grid" id="modal-nearby-spots-list" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:0.85rem">
          <!-- Populated by initModalMap -->
        </div>
      </div>
    `;

    initModalCalculator(d);
    initModalMap(d);
  } catch (err) {
    console.error("Gagal open modal:", err);
    if (body) {
      body.innerHTML = `
        <div style="padding:2.5rem;text-align:center;color:var(--text-muted)">
          <p style="font-weight:700;color:var(--text-main);margin-bottom:0.4rem">Terjadi Kendala Memuat Detail</p>
          <p style="font-size:0.85rem">Silakan coba buka kembali atau pilih destinasi lainnya.</p>
        </div>
      `;
    }
  }
}

function initModalMap(dest) {
  const mapDivId = `modal-map-${dest.id}`;
  const mapEl = document.getElementById(mapDivId);
  if (!mapEl || typeof L === 'undefined') return;

  if (window._modalMapInstance) {
    window._modalMapInstance.remove();
    window._modalMapInstance = null;
  }

  const lat = dest.latitude || -2.5;
  const lon = dest.longitude || 118.0;

  const map = L.map(mapDivId, {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([lat, lon], 12);

  window._modalMapInstance = map;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Marker Destinasi Utama (Warna Merah dengan denyut pin)
  const currentPinIcon = L.divIcon({
    className: 'current-modal-pin',
    html: `
      <div style="background:#ef4444;color:white;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-size:15px;box-shadow:0 0 16px rgba(239,68,68,0.95);border:3px solid white;font-weight:bold">
        📍
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  const destMarker = L.marker([lat, lon], {
    icon: currentPinIcon,
    title: dest.nama,
    zIndexOffset: 1000
  }).addTo(map);

  destMarker.bindPopup(`
    <div style="font-size:0.85rem;min-width:190px">
      <div style="color:#ef4444;font-size:0.7rem;font-weight:800;text-transform:uppercase;margin-bottom:2px">📍 Destinasi Saat Ini</div>
      <strong style="color:var(--text-main);font-size:0.95rem;display:block;margin-bottom:2px">${escapeHtml(dest.nama)}</strong>
      <span style="color:#64748b;font-size:0.75rem;display:block">📍 ${escapeHtml(dest.lokasi)}</span>
      <div style="margin-top:0.4rem;font-size:0.72rem;background:#fef2f2;color:#b91c1c;padding:3px 6px;border-radius:4px;font-weight:700">
        Kategori: ${escapeHtml(dest.jenisWisata || 'Wisata Bahari')}
      </div>
    </div>
  `).openPopup();

  // Hitung jarak ke seluruh destinasi maritim lainnya dan ambil 5 terdekat
  const all = APP_STATE.allDestinations || [];
  const nearbySpots = all
    .filter(other => other.id !== dest.id && typeof other.latitude === 'number' && typeof other.longitude === 'number')
    .map(other => {
      const dist = haversineDistKm(lat, lon, other.latitude, other.longitude);
      return { ...other, distanceKm: dist };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 5); // 5 destinasi bahari terdekat

  const bounds = L.latLngBounds([[lat, lon]]);

  // Pin untuk Destinasi Terdekat (Biru Bahari)
  nearbySpots.forEach((spot, idx) => {
    bounds.extend([spot.latitude, spot.longitude]);

    const spotIcon = L.divIcon({
      className: 'nearby-spot-pin',
      html: `
        <div style="background:#0284c7;color:white;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:12px;box-shadow:0 3px 10px rgba(2,132,199,0.5);border:2px solid white;font-weight:800">
          ${idx + 1}
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const spotMarker = L.marker([spot.latitude, spot.longitude], { icon: spotIcon }).addTo(map);

    spotMarker.bindPopup(`
      <div style="font-size:0.84rem;min-width:210px">
        <span style="color:#0284c7;font-size:0.7rem;font-weight:800;text-transform:uppercase">#${idx + 1} Terdekat (⚡ ${spot.distanceKm} km)</span>
        <strong style="color:var(--text-main);font-size:0.95rem;display:block;margin:3px 0">${escapeHtml(spot.nama)}</strong>
        <span style="color:#64748b;font-size:0.74rem;display:block;margin-bottom:6px">📍 ${escapeHtml(spot.lokasi)}</span>
        <div style="display:flex;gap:4px;margin-bottom:8px">
          <span style="background:#e0f2fe;color:#0284c7;font-size:0.68rem;padding:2px 6px;border-radius:4px;font-weight:700">${escapeHtml(spot.level)}</span>
          <span style="background:#ecfdf5;color:#059669;font-size:0.68rem;padding:2px 6px;border-radius:4px;font-weight:700">${formatRupiah(spot.estimasiTotalPerOrang)}</span>
        </div>
        <button type="button" class="btn-search-exec" style="width:100%;height:32px;font-size:0.78rem;padding:0" onclick="openDestinationModal('${spot.id}')">
          Buka Wisata Ini →
        </button>
      </div>
    `);

    // Tambahkan garis putus-putus penghubung
    L.polyline([[lat, lon], [spot.latitude, spot.longitude]], {
      color: '#0ea5e9',
      weight: 2.5,
      opacity: 0.7,
      dashArray: '6, 8'
    }).addTo(map);
  });

  // Render kartu destinasi bahari terdekat di bawah peta modal
  const containerList = document.getElementById('modal-nearby-spots-list');
  const badgeCount = document.getElementById('modal-nearby-count-badge');
  if (badgeCount) {
    badgeCount.textContent = `${nearbySpots.length} Destinasi Bahari Terdekat`;
  }

  if (containerList) {
    if (nearbySpots.length === 0) {
      containerList.innerHTML = '<div style="padding:1rem;color:var(--text-muted);font-size:0.85rem">Tidak ada destinasi bahari terdekat lainnya yang terdaftar di area ini.</div>';
    } else {
      containerList.innerHTML = nearbySpots.map((spot, idx) => {
        const photoUrl = spot.foto || getPhotoForDestination(spot);
        return `
          <div class="nearby-spot-modal-card" style="background:var(--bg-subtle);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:0.85rem;display:flex;flex-direction:column;gap:0.45rem;cursor:pointer;transition:transform 0.2s ease, box-shadow 0.2s ease" onclick="openDestinationModal('${spot.id}')" title="Klik untuk membuka detail wisata ini">
            <div style="display:flex;gap:0.75rem;align-items:center">
              <img src="${photoUrl}" style="width:58px;height:58px;border-radius:8px;object-fit:cover;flex-shrink:0" alt="${escapeHtml(spot.nama)}" loading="lazy">
              <div style="overflow:hidden">
                <div style="display:flex;align-items:center;gap:0.35rem">
                  <span style="background:var(--sea-blue);color:white;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font-size:0.68rem;font-weight:800;flex-shrink:0">${idx + 1}</span>
                  <strong style="color:var(--text-main);font-size:0.88rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block">${escapeHtml(spot.nama)}</strong>
                </div>
                <span style="font-size:0.74rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block">📍 ${escapeHtml(spot.lokasi)}</span>
                <span style="font-size:0.7rem;color:var(--sea-blue);font-weight:600">${escapeHtml(spot.jenisWisata)}</span>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.74rem;padding-top:0.4rem;border-top:1px dashed var(--border-subtle)">
              <span style="color:#059669;font-weight:700">${formatRupiah(spot.estimasiTotalPerOrang)}</span>
              <span class="badge-tag-clean" style="font-size:0.7rem;background:rgba(2,132,199,0.12);color:var(--sea-blue);font-weight:800">
                ⚡ ${spot.distanceKm} km
              </span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  if (nearbySpots.length > 0) {
    map.fitBounds(bounds, { padding: [40, 40] });
  }

  setTimeout(() => {
    map.invalidateSize();
  }, 250);
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
// ALL DESTINATIONS LOADER & FAVORITES CONTROLLER
// ==============================================================================
async function loadAllDestinations() {
  if (APP_STATE.allDestinations && APP_STATE.allDestinations.length > 0) {
    return APP_STATE.allDestinations;
  }
  try {
    const res = await fetch(`/api/search?_v=${Date.now()}`);
    const data = await res.json();
    APP_STATE.allDestinations = data.results || [];
    return APP_STATE.allDestinations;
  } catch (err) {
    console.error('Gagal memuat seluruh destinasi:', err);
    return [];
  }
}

function updateFavoriteBadge() {
  const count = (APP_STATE.favorites || []).length;
  const deskBadge = document.getElementById('desktop-fav-count');
  const mobBadge = document.getElementById('mobile-fav-count');

  if (deskBadge) {
    deskBadge.textContent = count;
    deskBadge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
  if (mobBadge) {
    mobBadge.textContent = count;
    mobBadge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

function toggleFavorite(id) {
  if (!id) return;
  if (APP_STATE.favorites.includes(id)) {
    APP_STATE.favorites = APP_STATE.favorites.filter(x => x !== id);
  } else {
    APP_STATE.favorites.push(id);
  }
  localStorage.setItem('imj_fav', JSON.stringify(APP_STATE.favorites));

  // Sinkronkan seluruh tombol bookmark di kartu
  document.querySelectorAll(`.btn-card-bookmark[data-fav="${id}"]`).forEach(btn => {
    const isFav = APP_STATE.favorites.includes(id);
    btn.classList.toggle('active', isFav);
  });

  // Sinkronkan bookmark di modal jika sedang terbuka
  const modalFavBtn = document.getElementById('modal-dest-fav-btn');
  if (modalFavBtn && modalFavBtn.dataset.fav === id) {
    modalFavBtn.classList.toggle('active', APP_STATE.favorites.includes(id));
  }

  updateFavoriteBadge();
  renderFavoritesView();
}

async function renderFavoritesView() {
  const grid = document.getElementById('favorites-cards-grid');
  if (!grid) return;

  updateFavoriteBadge();

  if (!APP_STATE.favorites || APP_STATE.favorites.length === 0) {
    renderDestinationCards([], 'favorites-cards-grid');
    return;
  }

  // Muat semua destinasi jika belum ada
  const all = await loadAllDestinations();
  const favItems = all.filter(d => APP_STATE.favorites.includes(d.id));
  renderDestinationCards(favItems, 'favorites-cards-grid');
}

// ==============================================================================
// REKOMENDASI TERDEKAT (GEOLOCATION API & FALLBACK KOTA)
// ==============================================================================
const CITY_PRESETS = {
  jakarta: { name: 'Jakarta / Jabodetabek', lat: -6.2088, lon: 106.8456 },
  medan: { name: 'Medan (Sumut)', lat: 3.5952, lon: 98.6722 },
  padang: { name: 'Padang (Sumbar)', lat: -0.9471, lon: 100.4172 },
  semarang: { name: 'Semarang (Jateng)', lat: -6.9667, lon: 110.4167 },
  surabaya: { name: 'Surabaya (Jatim)', lat: -7.2575, lon: 112.7521 },
  denpasar: { name: 'Denpasar (Bali)', lat: -8.6705, lon: 115.2126 },
  mataram: { name: 'Mataram (Lombok)', lat: -8.5833, lon: 116.1167 },
  balikpapan: { name: 'Balikpapan (Kaltim)', lat: -1.2379, lon: 116.8289 },
  makassar: { name: 'Makassar (Sulsel)', lat: -5.1477, lon: 119.4069 },
  manado: { name: 'Manado (Sulut)', lat: 1.4748, lon: 124.8428 },
  ambon: { name: 'Ambon (Maluku)', lat: -3.6547, lon: 128.1906 },
  jayapura: { name: 'Jayapura (Papua)', lat: -2.5337, lon: 140.7181 }
};

let userLocationCoords = null;
let homeNearbyMapInstance = null;

function haversineDistKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Menghitung bearing derajat dan arah mata angin kompas (Utara, Timur Laut, dst.)
function calculateBearing(lat1, lon1, lat2, lon2) {
  const toRad = d => (d * Math.PI) / 180;
  const toDeg = r => (r * 180) / Math.PI;
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const dLambda = toRad(lon2 - lon1);

  const y = Math.sin(dLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda);
  let brng = (toDeg(Math.atan2(y, x)) + 360) % 360;

  const points = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
  const arrows = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  const idx = Math.round(brng / 45) % 8;

  return {
    degrees: Math.round(brng),
    direction: points[idx],
    arrow: arrows[idx]
  };
}

function initHomeNearbyMap(refLat, refLon, sourceLabel, topSpots) {
  const mapEl = document.getElementById('home-nearby-map');
  if (!mapEl || typeof L === 'undefined') return;

  if (homeNearbyMapInstance) {
    homeNearbyMapInstance.remove();
    homeNearbyMapInstance = null;
  }

  const map = L.map('home-nearby-map', {
    center: [refLat, refLon],
    zoom: 8,
    scrollWheelZoom: false
  });
  homeNearbyMapInstance = map;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Pin Titik Acuan / GPS Pengguna (Merah dengan Efek Radar Berdenyut)
  const userPinIcon = L.divIcon({
    className: 'home-user-pin',
    html: `
      <div style="position:relative;width:34px;height:34px;display:grid;place-items:center">
        <div style="position:absolute;width:34px;height:34px;border-radius:50%;background:rgba(239,68,68,0.35);animation:pulse-ring 2s infinite"></div>
        <div style="background:#ef4444;color:white;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:12px;box-shadow:0 0 10px rgba(239,68,68,0.8);border:2.5px solid white;font-weight:900;z-index:2">
          📍
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

  const userMarker = L.marker([refLat, refLon], { icon: userPinIcon }).addTo(map);
  userMarker.bindPopup(`
    <div style="font-size:0.84rem;min-width:200px">
      <span style="color:#ef4444;font-size:0.7rem;font-weight:800;text-transform:uppercase">Titik Acuan Anda</span>
      <strong style="color:var(--text-main);font-size:0.95rem;display:block;margin:3px 0">${escapeHtml(sourceLabel)}</strong>
      <span style="color:#64748b;font-size:0.74rem">Koordinat: ${refLat.toFixed(4)}, ${refLon.toFixed(4)}</span>
    </div>
  `).openPopup();

  const bounds = L.latLngBounds([[refLat, refLon]]);

  topSpots.forEach((spot, idx) => {
    if (typeof spot.latitude !== 'number' || typeof spot.longitude !== 'number') return;
    bounds.extend([spot.latitude, spot.longitude]);

    const bearing = calculateBearing(refLat, refLon, spot.latitude, spot.longitude);

    // Marker Peringkat 1 s/d 6 dengan nomor dan warna kontras
    const spotIcon = L.divIcon({
      className: 'home-spot-pin',
      html: `
        <div style="background:#0284c7;color:white;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:13px;box-shadow:0 3px 10px rgba(2,132,199,0.5);border:2.5px solid white;font-weight:800;cursor:pointer">
          ${idx + 1}
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const marker = L.marker([spot.latitude, spot.longitude], { icon: spotIcon }).addTo(map);
    marker.bindPopup(`
      <div style="font-size:0.84rem;min-width:220px;max-width:250px">
        <span style="color:#0284c7;font-size:0.7rem;font-weight:800;text-transform:uppercase">#${idx + 1} Terdekat · 🧭 ${bearing.arrow} ${spot.distanceKm} km (${bearing.direction})</span>
        <strong style="color:var(--text-main);font-size:0.95rem;display:block;margin:4px 0 2px 0">${escapeHtml(spot.nama)}</strong>
        <span style="color:#64748b;font-size:0.75rem;display:block;margin-bottom:6px">📍 ${escapeHtml(spot.lokasi)}</span>
        <div style="display:flex;gap:4px;margin-bottom:8px">
          <span style="background:#e0f2fe;color:#0284c7;font-size:0.68rem;padding:2px 6px;border-radius:4px;font-weight:700">${escapeHtml(spot.level)}</span>
          <span style="background:#ecfdf5;color:#059669;font-size:0.68rem;padding:2px 6px;border-radius:4px;font-weight:700">${formatRupiah(spot.estimasiTotalPerOrang)}</span>
        </div>
        <button type="button" class="btn-search-exec" style="width:100%;height:32px;font-size:0.78rem;padding:0" onclick="openDestinationModal('${spot.id}')">
          Buka Detail Wisata →
        </button>
      </div>
    `);

    // Garis putus-putus dengan panah/garis langsung dari user ke destinasi
    L.polyline([[refLat, refLon], [spot.latitude, spot.longitude]], {
      color: '#0ea5e9',
      weight: 2.5,
      opacity: 0.75,
      dashArray: '5, 8'
    }).addTo(map);
  });

  if (topSpots.length > 0) {
    map.fitBounds(bounds, { padding: [45, 45] });
  }

  setTimeout(() => {
    map.invalidateSize();
  }, 250);
}

async function renderNearbyDestinations(refLat, refLon, sourceLabel) {
  const grid = document.getElementById('nearby-destinations-grid');
  const statusEl = document.getElementById('nearby-status-text');
  if (!grid) return;

  if (statusEl) {
    statusEl.innerHTML = `📍 Menampilkan rekomendasi wisata bahari terdekat dari: <strong style="color:var(--sea-blue)">${escapeHtml(sourceLabel)}</strong>`;
  }

  const all = await loadAllDestinations();
  if (!all || all.length === 0) return;

  const withDist = all.map(d => {
    const lat = d.latitude || -2.5;
    const lon = d.longitude || 118.0;
    const dist = haversineDistKm(refLat, refLon, lat, lon);
    const bearing = calculateBearing(refLat, refLon, lat, lon);
    return { ...d, distanceKm: dist, bearing };
  });

  withDist.sort((a, b) => a.distanceKm - b.distanceKm);
  const top6 = withDist.slice(0, 6);

  // Render Peta Interaktif & Radar Terdekat di Beranda
  initHomeNearbyMap(refLat, refLon, sourceLabel, top6);

  grid.innerHTML = top6.map((d, idx) => {
    const photoUrl = d.foto || getPhotoForDestination(d);
    const isFav = APP_STATE.favorites.includes(d.id);
    const skillClass = `skill-${(d.level || 'pemula').toLowerCase().split(' ')[0]}`;

    return `
      <article class="card-destination-pro" data-id="${d.id}">
        <div class="card-photo-banner">
          <img src="${photoUrl}" alt="${escapeHtml(d.nama)}" loading="lazy">
          <div class="card-photo-overlay">
            <div class="card-badge-row">
              <span class="badge-tag-clean" style="background:#0284c7;color:white;font-weight:700">
                #${idx + 1} Terdekat · 🧭 ${d.bearing.arrow} ${d.distanceKm} km ${d.bearing.direction}
              </span>
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
            <span class="pill-info-chip ${skillClass}">Level: ${escapeHtml(d.level)}</span>
            <span class="pill-info-chip price-badge">${escapeHtml(d.rangeHargaTotalLabel)}</span>
          </div>

          <div class="equipment-section-preview">
            <div class="equipment-preview-head">
              <span>Fasilitas &amp; Aktivitas</span>
              <small>${escapeHtml(d.jenisWisata)}</small>
            </div>
            <div class="equipment-chips-wrap">
              <span class="mini-gear-tag">🌊 ${(d.aktivitas || []).slice(0, 2).join(', ')}</span>
              <span class="mini-gear-tag">📍 ${escapeHtml(d.kabKota || d.lokasi.split(',')[0])}</span>
            </div>
          </div>

          <div class="card-action-footer">
            <div class="price-display-unit">
              <span>Estimasi Biaya</span>
              <strong>${formatRupiah(d.estimasiTotalPerOrang)}</strong>
            </div>
            <button type="button" class="btn-open-detail-pro" data-open="${d.id}">
              <span>Detail &amp; Wisata Sekitar</span>
              <svg class="svg-icon svg-icon-sm"><use href="#icon-arrow-right"/></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Klik seluruh kotak kartu untuk langsung membuka modal detail
  grid.querySelectorAll('.card-destination-pro').forEach(card => {
    card.addEventListener('click', (e) => {
      // Abaikan jika klik tombol bookmark agar aksi simpan favorit tidak tertimpa
      if (e.target.closest('.btn-card-bookmark')) return;
      openDestinationModal(card.dataset.id);
    });
  });

  grid.querySelectorAll('.btn-card-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(btn.dataset.fav);
    });
  });
}

function initNearbyRecommendations() {
  const detectBtn = document.getElementById('btn-detect-gps');
  const citySelect = document.getElementById('select-city-fallback');

  // Default awal gunakan kota Jakarta
  renderNearbyDestinations(CITY_PRESETS.jakarta.lat, CITY_PRESETS.jakarta.lon, CITY_PRESETS.jakarta.name);

  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      const cityKey = e.target.value;
      if (cityKey && CITY_PRESETS[cityKey]) {
        userLocationCoords = { ...CITY_PRESETS[cityKey], isGps: false };
        renderNearbyDestinations(userLocationCoords.lat, userLocationCoords.lon, `${userLocationCoords.name} (Pilihan Manual)`);
      }
    });
  }

  if (detectBtn) {
    detectBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Browser Anda tidak mendukung Geolocation API. Silakan pilih kota acuan manual.');
        return;
      }

      detectBtn.disabled = true;
      detectBtn.innerHTML = '<span>Mendeteksi GPS...</span>';

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          detectBtn.disabled = false;
          detectBtn.innerHTML = '<svg class="svg-icon svg-icon-sm"><use href="#icon-pin"/></svg><span>Lokasi GPS Terhubung</span>';
          userLocationCoords = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            name: `Koordinat GPS (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`,
            isGps: true
          };
          renderNearbyDestinations(userLocationCoords.lat, userLocationCoords.lon, userLocationCoords.name);
        },
        (err) => {
          detectBtn.disabled = false;
          detectBtn.innerHTML = '<svg class="svg-icon svg-icon-sm"><use href="#icon-pin"/></svg><span>Deteksi Lokasi GPS</span>';
          console.warn('Geolocation denied or failed:', err);
          alert('Izin lokasi ditolak atau tidak tersedia. Sistem menggunakan kota acuan dari dropdown.');
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }
}

// ==============================================================================
// EKSPLORASI PETA NUSANTARA (LEAFLET INTERAKTIF)
// ==============================================================================
let indonesiaMapInstance = null;
let mapMarkerLayer = null;

const REGION_MAP_VIEWS = {
  '': { center: [-2.5, 118.0], zoom: 5 },
  'Sumatra': { center: [0.5, 101.5], zoom: 6 },
  'Jawa': { center: [-7.5, 110.5], zoom: 7 },
  'Bali & Nusa Tenggara': { center: [-8.6, 117.5], zoom: 7 },
  'Kalimantan': { center: [0.5, 114.5], zoom: 6 },
  'Sulawesi': { center: [-2.5, 121.5], zoom: 6 },
  'Maluku': { center: [-3.2, 129.5], zoom: 6 },
  'Papua': { center: [-4.0, 136.5], zoom: 6 }
};

async function renderIndonesiaMapView() {
  const container = document.getElementById('indonesia-map-container');
  if (!container) return;

  if (typeof L === 'undefined') {
    console.warn('Leaflet library (L) belum siap, mencoba ulang sesaat lagi...');
    setTimeout(renderIndonesiaMapView, 250);
    return;
  }

  // Bersihkan ID instance leaflet lama jika container pernah di-mount tapi instance hilang
  if (container._leaflet_id && !indonesiaMapInstance) {
    container._leaflet_id = null;
  }

  if (!indonesiaMapInstance) {
    try {
      indonesiaMapInstance = L.map('indonesia-map-container', {
        center: [-2.5, 118.0],
        zoom: 5,
        minZoom: 4,
        maxZoom: 18,
        scrollWheelZoom: true
      });

      // Layer ubin OpenStreetMap (100% gratis, bebas watermark, tanpa API key)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abc',
        maxZoom: 19
      }).addTo(indonesiaMapInstance);

      mapMarkerLayer = L.layerGroup().addTo(indonesiaMapInstance);

      // Event listener untuk filter wilayah di peta
      const regionSelect = document.getElementById('map-region-filter');
      if (regionSelect) {
        regionSelect.addEventListener('change', (e) => {
          const reg = e.target.value;
          updateMapMarkers(reg);
          const cfg = REGION_MAP_VIEWS[reg] || REGION_MAP_VIEWS[''];
          indonesiaMapInstance.flyTo(cfg.center, cfg.zoom, { duration: 1.2 });
        });
      }

      // Event listener untuk tombol lokasi saya di peta
      const myLocBtn = document.getElementById('btn-map-my-location');
      if (myLocBtn) {
        myLocBtn.addEventListener('click', () => {
          if (!navigator.geolocation) {
            alert('Browser Anda tidak mendukung deteksi lokasi.');
            return;
          }
          myLocBtn.textContent = 'Mencari...';
          navigator.geolocation.getCurrentPosition(
            pos => {
              myLocBtn.innerHTML = '<svg class="svg-icon svg-icon-sm"><use href="#icon-pin"/></svg><span>Lokasi Saya</span>';
              const userLat = pos.coords.latitude;
              const userLon = pos.coords.longitude;
              indonesiaMapInstance.flyTo([userLat, userLon], 9, { duration: 1.5 });

              const userIcon = L.divIcon({
                className: 'user-pulse-marker',
                html: '<div style="background:#ef4444;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 0 12px rgba(239,68,68,0.9)"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              });
              L.marker([userLat, userLon], { icon: userIcon })
                .addTo(indonesiaMapInstance)
                .bindPopup('<strong>📍 Posisi Anda Saat Ini</strong>')
                .openPopup();
            },
            err => {
              myLocBtn.innerHTML = '<svg class="svg-icon svg-icon-sm"><use href="#icon-pin"/></svg><span>Lokasi Saya</span>';
              alert('Izin lokasi tidak diberikan.');
            }
          );
        });
      }

      // IntersectionObserver khusus agar peta langsung kalkulasi ulang saat discroll ke layar
      if ('IntersectionObserver' in window) {
        const mapObs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && indonesiaMapInstance) {
              indonesiaMapInstance.invalidateSize();
            }
          });
        }, { threshold: [0, 0.1, 0.5] });
        mapObs.observe(container);
      }
    } catch (mapErr) {
      console.error('Error saat inisialisasi peta Leaflet:', mapErr);
      if (container._leaflet_id) {
        container._leaflet_id = null;
      }
    }
  }

  // Invalidate size beberapa kali untuk menangani transisi CSS / font loading
  [100, 350, 700, 1400].forEach(delay => {
    setTimeout(() => {
      if (indonesiaMapInstance) indonesiaMapInstance.invalidateSize();
    }, delay);
  });

  // Muat dan render marker destinasi
  await loadAllDestinations();
  const currentReg = document.getElementById('map-region-filter')?.value || '';
  updateMapMarkers(currentReg);
}

function updateMapMarkers(regionFilter = '') {
  if (!mapMarkerLayer || !APP_STATE.allDestinations) return;
  mapMarkerLayer.clearLayers();

  const filtered = regionFilter
    ? APP_STATE.allDestinations.filter(d => d.wilayah === regionFilter)
    : APP_STATE.allDestinations;

  const countEl = document.getElementById('map-results-count');
  if (countEl) {
    countEl.textContent = regionFilter
      ? `Destinasi di Wilayah ${regionFilter} (${filtered.length} Destinasi)`
      : `Seluruh Destinasi Maritim Nusantara (${filtered.length} Destinasi)`;
  }

  const maritimeIcon = L.divIcon({
    className: 'maritime-map-pin',
    html: '<div style="background:#0284c7;color:white;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white">🌊</div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  filtered.forEach(d => {
    const lat = d.latitude || -2.5;
    const lon = d.longitude || 118.0;
    const photoUrl = d.foto || getPhotoForDestination(d);

    const marker = L.marker([lat, lon], { icon: maritimeIcon });
    marker.bindPopup(`
      <div style="font-size:0.85rem;min-width:220px;max-width:260px">
        <img src="${photoUrl}" style="width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:8px">
        <strong style="color:var(--text-main);font-size:0.95rem;display:block;margin-bottom:2px">${escapeHtml(d.nama)}</strong>
        <span style="color:#64748b;font-size:0.75rem;display:block;margin-bottom:6px">📍 ${escapeHtml(d.lokasi)}</span>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">
          <span style="background:#e0f2fe;color:#0284c7;font-size:0.68rem;padding:2px 6px;border-radius:4px;font-weight:700">Level: ${escapeHtml(d.level)}</span>
          <span style="background:#ecfdf5;color:#059669;font-size:0.68rem;padding:2px 6px;border-radius:4px;font-weight:700">${formatRupiah(d.estimasiTotalPerOrang)}</span>
          <span style="background:#f0fdf4;color:#15803d;font-size:0.68rem;padding:2px 6px;border-radius:4px;font-weight:700">🌊 ${escapeHtml(d.jenisWisata || 'Wisata Maritim')}</span>
        </div>
        <button type="button" class="btn-search-exec" style="width:100%;height:32px;font-size:0.75rem;padding:0" onclick="openDestinationModal('${d.id}')">
          Buka Detail &amp; Wisata Sekitar
        </button>
      </div>
    `);
    mapMarkerLayer.addLayer(marker);
  });

  // Render SELURUH kartu destinasi di slider horizontal bawah peta (Sistem Slide Kesamping)
  renderDestinationCards(filtered, 'map-destinations-grid');
}

/**
 * Kontrol geser slider destinasi peta ke samping (Kiri / Kanan)
 */
function slideMapDestinations(direction) {
  const slider = document.getElementById('map-destinations-grid');
  if (!slider) return;
  const cardWidth = 320;
  const scrollAmount = direction === 'left' ? -(cardWidth * 2) : (cardWidth * 2);
  slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}
window.slideMapDestinations = slideMapDestinations;
