/**
 * カテゴリ一覧ページの共通ロジック（ダンス／ランニング／AI開発／コラムで共用）
 *
 * 各ページは読み込み前に window.CATEGORY_CONFIG を定義しておく:
 *   key      : 'dance' | 'running' | 'ai' | 'column'（色テーマとタグの見た目に使う）
 *   label    : 画面に出すカテゴリ名
 *   data     : notes-*.js が定義した配列（NOTES_DANCE 等）
 *   sections : モーダルに出す項目の定義 [{ field, label }, ...]
 *
 * カード自体は url があれば <a>（本物のリンク）、無ければ <button>（モーダル）になる。
 * データファイル（notes-*.js）は読み取り専用として扱い、ここでは一切書き換えない。
 */
(function () {
  const config = window.CATEGORY_CONFIG || {};
  const notes = Array.isArray(config.data) ? config.data : [];

  const nav = document.getElementById('nav');
  const menu = document.getElementById('menu');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
  }

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]);

  const grid = document.getElementById('archive');
  const filterbar = document.getElementById('filterbar');

  // 一覧カードのプレビュー。カテゴリごとに持つ項目が違うので、あるものを順に拾う
  const previewOf = (note) => {
    const source = note.points || note.form || note.mistakes || note.notes || [];
    return Array.isArray(source) && source.length ? source[0] : '';
  };

  /* ---------- ノートが1件も無い場合 ---------- */
  if (!notes.length) {
    grid.innerHTML = `<p class="empty-msg">まだこのカテゴリのノートはありません。<br>最初の記録を、ゆっくり準備しています。</p>`;
    if (filterbar) filterbar.style.display = 'none';
    return;
  }

  /* ---------- タグボタン（実データのタグから作る） ---------- */
  const allTags = [...new Set(notes.flatMap(n => n.tags || []))];
  if (filterbar && allTags.length) {
    filterbar.innerHTML =
      '<span class="filter-label">タグで絞り込み：</span>' +
      '<button class="tag-btn active" data-tag="">すべて</button>' +
      allTags.map(t => `<button class="tag-btn" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('');
  } else if (filterbar) {
    filterbar.style.display = 'none';
  }

  /* ---------- カード生成 ---------- */
  function cardHtml(note, index) {
    const preview = previewOf(note);
    const inner = `
      <span class="tag ${escapeHtml(config.key)}">${escapeHtml(config.label)}</span>
      <h3>${escapeHtml(note.title)}</h3>
      ${preview ? `<p class="preview">${escapeHtml(preview)}</p>` : ''}
      <span class="card-foot">
        <span>${(note.tags || []).map(escapeHtml).join('　')}</span>
        <span>${escapeHtml(note.date || '')}</span>
      </span>`;
    const tags = escapeHtml(JSON.stringify(note.tags || []));
    return note.url
      ? `<a class="archive-card" href="${escapeHtml(note.url)}" data-tags="${tags}" data-index="${index}">${inner}</a>`
      : `<button type="button" class="archive-card" data-tags="${tags}" data-index="${index}">${inner}</button>`;
  }

  grid.innerHTML = notes.map(cardHtml).join('');

  /* ---------- 絞り込み（0件のときは案内を出す） ---------- */
  let emptyNotice = null;

  function applyFilter(tag) {
    let visible = 0;
    grid.querySelectorAll('.archive-card').forEach(card => {
      let tags = [];
      try { tags = JSON.parse(card.dataset.tags || '[]'); } catch (_) { tags = []; }
      const show = !tag || tags.includes(tag);
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (!visible) {
      if (!emptyNotice) {
        emptyNotice = document.createElement('p');
        emptyNotice.className = 'empty-msg';
        grid.appendChild(emptyNotice);
      }
      emptyNotice.textContent = `「${tag}」に該当するノートはありません。`;
      emptyNotice.style.display = '';
    } else if (emptyNotice) {
      emptyNotice.style.display = 'none';
    }
  }

  if (filterbar) {
    filterbar.addEventListener('click', (e) => {
      const btn = e.target.closest('.tag-btn');
      if (!btn) return;
      filterbar.querySelectorAll('.tag-btn').forEach(b => b.classList.toggle('active', b === btn));
      applyFilter(btn.dataset.tag);
    });
  }

  /* ---------- モーダル（詳細ページを持たないノート用） ---------- */
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;

  function openModal(note) {
    document.getElementById('modalCategory').textContent = note.category || config.label;
    document.getElementById('modalTitle').textContent = note.title;
    document.getElementById('modalTags').innerHTML =
      (note.tags || []).map(t => `<span class="note-tag">${escapeHtml(t)}</span>`).join('');

    const body = document.getElementById('modalPoints');
    const sections = Array.isArray(config.sections) ? config.sections : [{ field: 'points', label: 'ポイント' }];
    body.innerHTML = sections.map(section => {
      const items = note[section.field];
      if (!Array.isArray(items) || !items.length) return '';
      return `<h3>${escapeHtml(section.label)}</h3><ul>${
        items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
    }).join('');

    const sources = Array.isArray(note.sources) ? note.sources : [];
    if (sources.length) {
      body.innerHTML += `<h3>出典</h3><ul>${sources.map(s =>
        `<li>${s.url ? `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.label || s.url)}</a>` : escapeHtml(s.label || '')}</li>`
      ).join('')}</ul>`;
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('button.archive-card');
    if (!btn) return;
    const note = notes[Number(btn.dataset.index)];
    if (note) openModal(note);
  });

  document.getElementById('modalClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();
