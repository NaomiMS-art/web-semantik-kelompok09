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

  // Markdown renderer sederhana untuk bubble bot
  function renderMarkdown(md) {
    if (!md) return '';
    return md
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(56,189,248,0.15);padding:1px 5px;border-radius:4px;color:#38bdf8;font-size:0.8em">$1</code>')
      .replace(/^• (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
      .replace(/\n/g, '<br>');
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
      <svg viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
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
          <div class="maritim-chat-avatar">🤖</div>
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

      <form class="maritim-chat-input-row" id="maritim-chat-form">
        <input type="text" class="maritim-chat-input" id="maritim-chat-input" placeholder="Tanyakan seputar wisata maritim & ontologi..." autocomplete="off" aria-label="Pesan untuk MaritimBot">
        <button type="submit" class="maritim-chat-send" id="maritim-chat-send" title="Kirim Pesan" aria-label="Kirim">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>
    `;
    document.body.appendChild(chatWin);
  }

  // Tambah Pesan ke History
  function appendMessage({ sender, textHtml, dbpediaData, suggestions, time }) {
    const box = document.getElementById('maritim-chat-messages');
    if (!box) return;

    const row = document.createElement('div');
    row.className = `maritim-msg-row ${sender}`;

    let contentHtml = `<div class="maritim-msg-bubble">${textHtml}</div>`;

    // Jika ada data DBpedia, tampilkan kartu visual
    if (dbpediaData) {
      const imgTag = dbpediaData.thumbnail
        ? `<img class="maritim-dbpedia-img" src="${esc(dbpediaData.thumbnail)}" alt="Gambar ${esc(dbpediaData.nama)}" loading="lazy">`
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
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

  // Kirim Pesan Pengguna
  async function handleSend(userText) {
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
      suggestions: botReply.suggestions,
      time: formatTime()
    });
  }

  // Sambutan Awal
  function sendInitialGreeting() {
    appendMessage({
      sender: 'bot',
      textHtml: renderMarkdown(`Halo! 🌊 Selamat datang di **MaritimBot**!\nSaya asisten cerdas berbasis **Web Semantik & DBpedia SPARQL** untuk memandu wisata bahari nusantara.\n\nPilih topik di bawah atau ketik langsung pertanyaanmu:`),
      dbpediaData: null,
      suggestions: [
        'Pantai gratis di Bali apa saja?',
        'Tingkat level diatas pemula',
        'Tingkat ahli',
        'Peralatan apa saja yang disewakan?',
        'Aktivitas apa saja yang ada?',
        'Rekomendasi wisata maritim terbaik'
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
    const win = document.getElementById('maritim-chat-window');
    const toggle = document.getElementById('maritim-chat-toggle');
    if (!win) return;
    isOpen = false;
    win.classList.remove('open');
    if (toggle) toggle.classList.remove('active');
  }

  function resetChat() {
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

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isOpen ? closeChat() : openChat();
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeChat);
    if (resetBtn) resetBtn.addEventListener('click', resetChat);

    if (formEl) {
      formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        if (inputEl) handleSend(inputEl.value);
      });
    }

    // Event delegation untuk chip saran
    if (boxEl) {
      boxEl.addEventListener('click', (e) => {
        const chip = e.target.closest('.maritim-sug-chip');
        if (chip && chip.dataset.query) {
          handleSend(chip.dataset.query);
        }
      });
    }

    // Tutup saat Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
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
