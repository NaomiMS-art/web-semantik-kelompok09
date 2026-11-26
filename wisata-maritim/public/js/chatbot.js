/**
 * chatbot.js — Komponen Antarmuka Pengguna MaritimBot
 * Ombak Nusantara · Web Semantik Kelompok 09
 */

(() => {
  'use strict';

  let isOpen = false;
  let hasGreeted = false;
  let isThinking = false;

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatTime() {
    return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  // Markdown renderer sederhana & rapi untuk bubble bot
  function renderMarkdown(md) {
    if (!md) return '';
    
    let text = md
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(56,189,248,0.15);padding:1px 5px;border-radius:4px;color:#38bdf8;font-size:0.8em">$1</code>');

    const lines = text.split(/\r?\n/);
    const result = [];
    let currentList = [];

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
        const title = trimmed.replace(/^[•\-]\s*/, '');
        currentList.push({ title: title, subs: [] });
      } else if (currentList.length > 0 && trimmed !== '' && !trimmed.startsWith('🔍') && !trimmed.startsWith('🌊') && !trimmed.startsWith('⚡') && !trimmed.startsWith('🏆') && !trimmed.startsWith('⚙️') && !trimmed.startsWith('🏝️') && !trimmed.startsWith('💸') && !trimmed.startsWith('🗺️')) {
        currentList[currentList.length - 1].subs.push(trimmed);
      } else {
        if (currentList.length > 0) {
          let ul = '<ul class="maritim-chat-list">';
          for (const item of currentList) {
            ul += '<li>' + item.title;
            if (item.subs.length > 0) {
              ul += '<div class="maritim-list-sub">' + item.subs.join('<br>') + '</div>';
            }
            ul += '</li>';
          }
          ul += '</ul>';
          result.push(ul);
          currentList = [];
        }
        if (trimmed !== '') {
          result.push('<p class="maritim-chat-p">' + trimmed + '</p>');
        }
      }
    }

    if (currentList.length > 0) {
      let ul = '<ul class="maritim-chat-list">';
      for (const item of currentList) {
        ul += '<li>' + item.title;
        if (item.subs.length > 0) {
          ul += '<div class="maritim-list-sub">' + item.subs.join('<br>') + '</div>';
        }
        ul += '</li>';
      }
      ul += '</ul>';
      result.push(ul);
    }

    return result.join('');
  }

  // Buat Elemen DOM Widget Chatbot
  function createChatbotUI() {
    // 1. Floating Toggle Button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'maritim-chat-toggle';
    toggleBtn.id = 'maritim-chat-toggle';
    toggleBtn.setAttribute('aria-label', 'Buka Asisten MaritimBot');
    toggleBtn.title = 'Tanya Asisten AI Maritim (DBpedia Connected)';
    toggleBtn.innerHTML = `
      <img src="images/logo.jpg" alt="Logo MaritimBot" class="maritim-toggle-logo-img">
      <span class="maritim-toggle-close-icon">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </span>
      <span class="maritim-chat-badge-pulse"></span>
    `;
    document.body.appendChild(toggleBtn);

    // 2. Chat Window Panel
    const chatWin = document.createElement('div');
    chatWin.className = 'maritim-chat-window';
    chatWin.id = 'maritim-chat-window';
    chatWin.setAttribute('role', 'dialog');
    chatWin.setAttribute('aria-label', 'Jendela MaritimBot');
    chatWin.innerHTML = `
      <div class="maritim-chat-header">
        <div class="maritim-chat-brand">
          <div class="maritim-chat-avatar">
            <img src="images/logo.jpg" alt="Logo MaritimBot" class="maritim-avatar-logo-img">
          </div>
          <div class="maritim-chat-title-group">
            <h4>MaritimBot</h4>
            <div class="maritim-chat-status" id="maritim-bot-status">
              <span class="maritim-chat-status-dot"></span>
              <span>Online · DBpedia Connected</span>
            </div>
          </div>
        </div>
        <div class="maritim-chat-actions">
          <button class="maritim-chat-btn-icon" id="maritim-chat-reset" title="Mulai Percakapan Baru" aria-label="Reset percakapan">
            <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
          </button>
          <button class="maritim-chat-btn-icon" id="maritim-chat-close" title="Tutup Chat" aria-label="Tutup jendela chat">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      <div class="maritim-chat-messages" id="maritim-chat-messages" aria-live="polite"></div>

      <div class="maritim-chat-autocomplete" id="maritim-chat-autocomplete" style="display:none"></div>

      <form class="maritim-chat-input-row" id="maritim-chat-form">
        <input type="text" class="maritim-chat-input" id="maritim-chat-input" placeholder="Tanyakan seputar wisata maritim & ontologi..." autocomplete="off" aria-label="Pesan untuk MaritimBot">
        <button type="submit" class="maritim-chat-send" id="maritim-chat-send" title="Kirim Pesan" aria-label="Kirim">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>
    `;
    document.body.appendChild(chatWin);
  }

  // Helper Global untuk Buka Semua di Katalog Utama
  window.openAllInExplorer = function(q) {
    if (typeof window.applySearchQuery === 'function') {
      window.applySearchQuery(q || '');
      const el = document.getElementById('destinasi-explorer') || document.getElementById('section-explorer') || document.querySelector('.destinasi-explorer-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const explorerInput = document.getElementById('explorer-search-input') || document.getElementById('hero-search-input');
      if (explorerInput) {
        explorerInput.value = q || '';
        explorerInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  // Tambah Pesan ke History
  function appendMessage({ sender, textHtml, dbpediaData, recommendations, totalResults, searchQuery, suggestions, time }) {
    const box = document.getElementById('maritim-chat-messages');
    if (!box) return;

    const row = document.createElement('div');
    row.className = `maritim-msg-row ${sender}`;

    let contentHtml = '';
    if (sender === 'bot') {
      contentHtml += `
        <div class="maritim-msg-author-tag">
          <img src="images/logo.jpg" alt="Logo" class="maritim-msg-avatar-mini">
          <span>MaritimBot</span>
        </div>
      `;
    }
    contentHtml += `<div class="maritim-msg-bubble">${textHtml}</div>`;

    // Jika ada rekomendasi destinasi terstruktur, tampilkan kartu mini interaktif
    if (recommendations && recommendations.length > 0) {
      const initialCards = recommendations.slice(0, 4);
      const remainingCards = recommendations.slice(4);
      const totalCount = totalResults || recommendations.length;
      const qStr = searchQuery || '';

      const renderCard = (d) => `
        <div class="maritim-bot-card">
          <img class="maritim-bot-thumb" src="${esc(d.foto || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80')}" alt="${esc(d.nama)}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80';">
          <div class="maritim-bot-card-info">
            <div class="maritim-bot-card-title">${esc(d.nama)}</div>
            <div class="maritim-bot-card-sub">${esc(d.lokasi)}</div>
            <div class="maritim-bot-card-meta">
              <span class="maritim-bot-card-badge">${esc(d.rangeHargaTotalLabel || d.rangeHarga || 'Hemat')}</span>
              <span class="maritim-bot-card-badge" style="background:#ecfdf5;color:#065f46">${esc(d.level)}</span>
            </div>
          </div>
          <button type="button" class="maritim-bot-btn-action" onclick="openDestinationModal('${esc(d.id)}')">Detail</button>
        </div>
      `;

      let cardsHtml = initialCards.map(renderCard).join('');
      let extraCardsHtml = remainingCards.slice(0, 16).map(renderCard).join('');

      let viewAllBarHtml = '';
      if (totalCount > 4) {
        viewAllBarHtml = `
          <div class="maritim-bot-actions-row">
            ${remainingCards.length > 0 ? `
              <button type="button" class="maritim-bot-btn-expand" onclick="
                const wrap = this.closest('.maritim-bot-dest-wrapper');
                const extra = wrap.querySelector('.extra-cards');
                if (extra.style.display === 'none') {
                  extra.style.display = 'flex';
                  this.innerHTML = '▲ Sembunyikan Tambahan';
                } else {
                  extra.style.display = 'none';
                  this.innerHTML = '▼ Tampilkan Lebih Banyak di Chat (+${Math.min(remainingCards.length, 16)})';
                }
              ">
                ▼ Tampilkan Lebih Banyak di Chat (+${Math.min(remainingCards.length, 16)})
              </button>
            ` : ''}
            <button type="button" class="maritim-bot-btn-see-all" onclick="openAllInExplorer('${esc(qStr)}')">
              <span>🔍 Lihat Semua ${totalCount} Destinasi di Katalog</span>
              <svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </button>
          </div>
        `;
      }

      contentHtml += `
        <div class="maritim-bot-dest-wrapper">
          <div class="maritim-bot-dest-grid">${cardsHtml}</div>
          ${remainingCards.length > 0 ? `<div class="maritim-bot-dest-grid extra-cards" style="display:none;margin-top:8px;">${extraCardsHtml}</div>` : ''}
          ${viewAllBarHtml}
        </div>
      `;
    }

    // Jika ada data DBpedia, tampilkan kartu visual
    if (dbpediaData) {
      const imgTag = dbpediaData.thumbnail
        ? `<img class="maritim-dbpedia-img" src="${esc(dbpediaData.thumbnail)}" alt="Gambar ${esc(dbpediaData.nama)}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80';">`
        : '';
      const linkTag = dbpediaData.wikiPage || dbpediaData.resource
        ? `<a class="maritim-dbpedia-link" href="${esc(dbpediaData.wikiPage || dbpediaData.resource)}" target="_blank" rel="noopener">
            <span>Lihat Entitas di DBpedia / Wikipedia</span>
            <svg style="width:12px;height:12px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
           </a>`
        : '';

      contentHtml += `
        <div class="maritim-dbpedia-card">
          <div class="maritim-dbpedia-tag">
            <svg style="width:14px;height:14px;min-width:14px;min-height:14px;max-width:14px;max-height:14px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span>Linked Open Data · DBpedia SPARQL</span>
          </div>
          ${imgTag}
          ${linkTag}
        </div>
      `;
    }

    // Waktu pesan
    contentHtml += `<div class="maritim-msg-time">${time || formatTime()}</div>`;

    // Chip saran pertanyaan lanjutan
    if (suggestions && suggestions.length > 0) {
      const chipsHtml = suggestions.map(sug => `
        <button type="button" class="maritim-sug-chip" data-query="${esc(sug)}">${esc(sug)}</button>
      `).join('');
      contentHtml += `<div class="maritim-chat-suggestions">${chipsHtml}</div>`;
    }

    row.innerHTML = contentHtml;
    box.appendChild(row);
    box.scrollTop = box.scrollHeight;
  }

  // Tampilkan Indikator Mengetik
  function showTypingIndicator() {
    const box = document.getElementById('maritim-chat-messages');
    if (!box) return;

    const row = document.createElement('div');
    row.className = 'maritim-msg-row bot';
    row.id = 'maritim-typing-bubble';
    row.innerHTML = `
      <div class="maritim-msg-bubble">
        <div class="maritim-typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    box.appendChild(row);
    box.scrollTop = box.scrollHeight;
  }

  function hideTypingIndicator() {
    const el = document.getElementById('maritim-typing-bubble');
    if (el) el.remove();
  }

  // Live Smart Autocomplete Logic
  let allDestinationsCache = [];
  let acSelectedIndex = -1;

  async function getDestinationsForAutocomplete() {
    if (allDestinationsCache.length > 0) return allDestinationsCache;
    try {
      if (typeof window !== 'undefined' && window.APP_STATE && window.APP_STATE.allDestinations && window.APP_STATE.allDestinations.length > 0) {
        allDestinationsCache = window.APP_STATE.allDestinations;
        return allDestinationsCache;
      }
      if (typeof window !== 'undefined' && typeof window.loadAllDestinations === 'function') {
        allDestinationsCache = await window.loadAllDestinations();
        return allDestinationsCache;
      }
      const res = await fetch('/api/search?q=');
      if (res.ok) {
        const json = await res.json();
        allDestinationsCache = json.results || [];
      }
    } catch (_) {}
    return allDestinationsCache;
  }

  const COMMON_MARITIME_TOPICS = [
    { title: 'Taman Nasional Bunaken', icon: '📍', sub: 'Sulawesi Utara · Diving & Snorkeling' },
    { title: 'Taman Nasional Komodo', icon: '📍', sub: 'Nusa Tenggara Timur · Satwa & Karang' },
    { title: 'Kepulauan Raja Ampat', icon: '📍', sub: 'Papua Barat Daya · Biodiversitas Dunia' },
    { title: 'Kepulauan Karimunjawa', icon: '📍', sub: 'Jawa Tengah · Snorkeling & Hiu' },
    { title: 'Kepulauan Derawan', icon: '📍', sub: 'Kalimantan Timur · Penyu & Ubur-ubur' },
    { title: 'Banda Neira', icon: '📍', sub: 'Maluku · Sejarah & Karang' },
    { title: 'Pantai Kuta Bali', icon: '📍', sub: 'Bali · Surfing Pemula & Sunset' },
    { title: 'Pantai Sanur', icon: '📍', sub: 'Bali · Kano & Sunrise' },
    { title: 'Pantai Bulbul', icon: '📍', sub: 'Sumatra Utara · Wisata Pasir Putih' },
    { title: 'Teluk Buyat', icon: '📍', sub: 'Sulawesi Utara · Terumbu Karang' },
    { title: 'Snorkeling untuk Pemula', icon: '🤿', sub: 'Aktivitas Bahari · Karang Dangkal' },
    { title: 'Spot Diving Kelas Dunia', icon: '🌊', sub: 'Aktivitas Bahari · Penyelaman Laut' },
    { title: 'Spot Surfing Terbaik', icon: '🏄', sub: 'Aktivitas Bahari · Selancar Ombak' },
    { title: 'Wisata Pantai di Bali', icon: '🏝️', sub: 'Destinasi Wilayah · Pulau Bali' },
    { title: 'Pantai Gratis di Bali (HTM Rp0)', icon: '💸', sub: 'Info Harga · Wisata Hemat' },
    { title: 'Peralatan apa saja yang disewakan?', icon: '⚙️', sub: 'Info Sewa Alat Bahari' },
    { title: 'Tingkat level diatas pemula', icon: '🎯', sub: 'Kategori Keahlian Menengah' },
    { title: 'Tingkat ahli / mahir', icon: '⚡', sub: 'Kategori Keahlian Profesional' }
  ];

  function highlightMatch(text, query) {
    if (!query) return esc(text);
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return esc(text);
    const before = esc(text.substring(0, idx));
    const match = esc(text.substring(idx, idx + query.length));
    const after = esc(text.substring(idx + query.length));
    return `${before}<strong>${match}</strong>${after}`;
  }

  async function updateAutocomplete(query) {
    const box = document.getElementById('maritim-chat-autocomplete');
    if (!box) return;

    const q = (query || '').trim().toLowerCase();
    if (q.length < 2) {
      hideAutocomplete();
      return;
    }

    const allDests = await getDestinationsForAutocomplete();
    const suggestions = [];
    const seenTitles = new Set();

    // 1. Cari dari seluruh destinasi (nama, lokasi, provinsi, aktivitas)
    for (const d of allDests) {
      const nama = d.nama || '';
      const lokasi = d.lokasi || '';
      const provinsi = d.provinsi || '';
      const lowerNama = nama.toLowerCase();
      const lowerLoc = lokasi.toLowerCase() + ' ' + provinsi.toLowerCase();

      const namaIndex = lowerNama.indexOf(q);
      const locIndex = lowerLoc.indexOf(q);

      if (namaIndex !== -1 || locIndex !== -1) {
        if (!seenTitles.has(lowerNama)) {
          seenTitles.add(lowerNama);
          let priority = 3;
          if (namaIndex === 0) priority = 1;
          else if (namaIndex > 0) priority = 2;
          else if (locIndex === 0) priority = 3;

          suggestions.push({
            title: nama,
            sub: `${d.lokasi || d.provinsi || ''} · ${d.level || ''} (${d.rangeHargaTotalLabel || ''})`,
            icon: '📍',
            priority: priority
          });
        }
      }
      if (suggestions.length >= 15) break;
    }

    // 2. Tambah dari topik maritim populer jika sesuai
    for (const t of COMMON_MARITIME_TOPICS) {
      const lowerTitle = t.title.toLowerCase();
      if (lowerTitle.includes(q) && !seenTitles.has(lowerTitle)) {
        seenTitles.add(lowerTitle);
        suggestions.push({
          title: t.title,
          sub: t.sub,
          icon: t.icon,
          priority: lowerTitle.startsWith(q) ? 1 : 2
        });
      }
      if (suggestions.length >= 18) break;
    }

    if (suggestions.length === 0) {
      hideAutocomplete();
      return;
    }

    // Urutkan berdasarkan prioritas kecocokan terdekat
    suggestions.sort((a, b) => a.priority - b.priority);
    const displayItems = suggestions.slice(0, 5);

    box.innerHTML = displayItems.map((item, idx) => `
      <div class="maritim-ac-item ${idx === acSelectedIndex ? 'active' : ''}" data-index="${idx}" data-query="${esc(item.title)}">
        <span class="maritim-ac-icon">${item.icon}</span>
        <div class="maritim-ac-info">
          <div class="maritim-ac-title">${highlightMatch(item.title, q)}</div>
          <div class="maritim-ac-sub">${esc(item.sub)}</div>
        </div>
        <span class="maritim-ac-action">Pilih ↵</span>
      </div>
    `).join('');

    box.style.display = 'flex';
  }

  function hideAutocomplete() {
    const box = document.getElementById('maritim-chat-autocomplete');
    if (box) {
      box.style.display = 'none';
      box.innerHTML = '';
    }
    acSelectedIndex = -1;
  }

  // Kirim Pesan Pengguna
  async function handleSend(userText) {
    hideAutocomplete();
    if (!userText || isThinking) return;
    const text = userText.trim();
    if (!text) return;

    // 1. Tampilkan Bubble Pengguna
    appendMessage({
      sender: 'user',
      textHtml: esc(text),
      time: formatTime()
    });

    const inputEl = document.getElementById('maritim-chat-input');
    if (inputEl) inputEl.value = '';

    // 2. State Mengetik
    isThinking = true;
    const statusText = document.querySelector('#maritim-bot-status span:last-child');
    if (statusText) statusText.textContent = 'Sedang mencari data...';
    showTypingIndicator();

    // 3. Panggil Modul DBpedia / NLU
    let botReply;
    try {
      if (typeof DBpedia !== 'undefined' && DBpedia.askChatbot) {
        botReply = await DBpedia.askChatbot(text);
      } else {
        botReply = {
          text: `Halo! Saya menerima pesan Anda: "${text}". Modul kecerdasan sedang diinisialisasi.`,
          dbpediaData: null,
          suggestions: ['Destinasi snorkeling terbaik', 'Pantai di Bali']
        };
      }
    } catch (err) {
      console.error('[MaritimBot Error]:', err);
      botReply = {
        text: 'Maaf, terjadi sedikit kendala saat mengambil data ontologi. Coba ulangi pertanyaan atau tanyakan destinasi lain ya! 😊',
        dbpediaData: null,
        suggestions: ['Ceritakan tentang Bunaken', 'Pantai gratis di Bali']
      };
    }

    hideTypingIndicator();
    isThinking = false;
    if (statusText) statusText.textContent = 'Online · DBpedia Connected';

    // 4. Tampilkan Bubble Bot
    appendMessage({
      sender: 'bot',
      textHtml: renderMarkdown(botReply.text),
      dbpediaData: botReply.dbpediaData,
      recommendations: botReply.recommendations,
      totalResults: botReply.totalResults,
      searchQuery: botReply.searchQuery || text,
      suggestions: botReply.suggestions,
      time: formatTime()
    });
  }

  // Sambutan Awal
  function sendInitialGreeting() {
    appendMessage({
      sender: 'bot',
      textHtml: renderMarkdown(`Halo! 👋 Selamat datang di **MaritimBot Ombak Nusantara**!\n\nAda yang bisa saya bantu seputar destinasi atau liburan baharimu hari ini? 😊\n\nSaya asisten berbasis **Web Semantik & DBpedia SPARQL** yang siap membantu kamu mencari rekomendasi pantai, spot snorkeling/diving, info sewa alat & tiket, hingga level keahlian.\n\nPilih opsi di bawah atau ketik langsung pertanyaanmu ya:`),
      dbpediaData: null,
      suggestions: [
        'Pantai gratis di Bali apa saja?',
        'Rekomendasi snorkeling untuk pemula',
        'Tingkat level diatas pemula',
        'Tingkat ahli',
        'Peralatan apa saja yang disewakan?',
        'Aktivitas apa saja yang ada?'
      ],
      time: formatTime()
    });
  }

  // Toggle Jendela Chat
  function openChat() {
    const win = document.getElementById('maritim-chat-window');
    const toggle = document.getElementById('maritim-chat-toggle');
    if (!win) return;
    isOpen = true;
    win.classList.add('open');
    if (toggle) toggle.classList.add('active');

    if (!hasGreeted) {
      hasGreeted = true;
      sendInitialGreeting();
    }

    setTimeout(() => {
      const input = document.getElementById('maritim-chat-input');
      if (input) input.focus();
    }, 250);
  }

  function closeChat() {
    hideAutocomplete();
    const win = document.getElementById('maritim-chat-window');
    const toggle = document.getElementById('maritim-chat-toggle');
    if (!win) return;
    isOpen = false;
    win.classList.remove('open');
    if (toggle) toggle.classList.remove('active');
  }

  function resetChat() {
    hideAutocomplete();
    const box = document.getElementById('maritim-chat-messages');
    if (box) box.innerHTML = '';
    sendInitialGreeting();
  }

  // Pasang Event Listeners
  function bindEvents() {
    const toggleBtn = document.getElementById('maritim-chat-toggle');
    const closeBtn  = document.getElementById('maritim-chat-close');
    const resetBtn  = document.getElementById('maritim-chat-reset');
    const formEl    = document.getElementById('maritim-chat-form');
    const inputEl   = document.getElementById('maritim-chat-input');
    const boxEl     = document.getElementById('maritim-chat-messages');
    const acBox     = document.getElementById('maritim-chat-autocomplete');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isOpen ? closeChat() : openChat();
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeChat);
    if (resetBtn) resetBtn.addEventListener('click', resetChat);

    if (inputEl) {
      inputEl.addEventListener('input', (e) => {
        updateAutocomplete(e.target.value);
      });

      inputEl.addEventListener('keydown', (e) => {
        if (!acBox || acBox.style.display === 'none') return;
        const items = acBox.querySelectorAll('.maritim-ac-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          acSelectedIndex = (acSelectedIndex + 1) % items.length;
          items.forEach((it, i) => it.classList.toggle('active', i === acSelectedIndex));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          acSelectedIndex = (acSelectedIndex - 1 + items.length) % items.length;
          items.forEach((it, i) => it.classList.toggle('active', i === acSelectedIndex));
        } else if (e.key === 'Enter') {
          if (acSelectedIndex >= 0 && items[acSelectedIndex]) {
            e.preventDefault();
            const chosenQuery = items[acSelectedIndex].dataset.query;
            hideAutocomplete();
            handleSend(chosenQuery);
          }
        } else if (e.key === 'Escape') {
          hideAutocomplete();
        }
      });
    }

    if (acBox) {
      acBox.addEventListener('click', (e) => {
        const item = e.target.closest('.maritim-ac-item');
        if (item && item.dataset.query) {
          const chosenQuery = item.dataset.query;
          hideAutocomplete();
          handleSend(chosenQuery);
        }
      });
    }

    if (formEl) {
      formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        hideAutocomplete();
        if (inputEl) handleSend(inputEl.value);
      });
    }

    // Event delegation untuk chip saran
    if (boxEl) {
      boxEl.addEventListener('click', (e) => {
        const chip = e.target.closest('.maritim-sug-chip');
        if (chip && chip.dataset.query) {
          hideAutocomplete();
          handleSend(chip.dataset.query);
        }
      });
    }

    // Tutup saat Escape atau klik di luar autocomplete
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideAutocomplete();
        if (isOpen) closeChat();
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#maritim-chat-autocomplete') && !e.target.closest('#maritim-chat-input')) {
        hideAutocomplete();
      }
    });
  }

  function init() {
    createChatbotUI();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
