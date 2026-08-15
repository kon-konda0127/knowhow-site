/**
 * カテゴリ一覧ページの共通ロジック（ダイエット／AI検証／コラムで共用）
 *
 * 各ページは読み込み前に window.CATEGORY_CONFIG を定義しておく:
 *   key      : 'diet' | 'ai' | 'column'（色テーマとタグの見た目に使う）
 *   label    : 画面に出すカテゴリ名
 *   data     : notes-*.js が定義した配列（NOTES_DIET 等）
 *   sections : モーダルに出す項目の定義 [{ field, label }, ...]
 *
 * ノートは任意で採否ラベルを持てる（AI検証カテゴリで使用。他カテゴリは未定義なので何も出ない）:
 *   verdict       : "採用" | "見送り" | "未判定"
 *   verdictReason : そう判断した理由（1行）
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
  const sourceOf = (note) => {
    const source = note.points || note.training || note.meal || note.record
                || note.habit || note.form || note.mistakes || note.notes || [];
    return Array.isArray(source) ? source : [];
  };
  const previewOf = (note) => {
    const source = sourceOf(note);
    return source.length ? source[0] : '';
  };
  // 舞台パネル用。config.previewLines を指定したカテゴリだけ複数行になる（既定は1行）
  const previewListOf = (note) => sourceOf(note).slice(0, Math.max(1, config.previewLines || 1));

  /* ---------- ノートが1件も無い場合 ---------- */
  if (!notes.length) {
    grid.innerHTML = `<p class="empty-msg">まだこのカテゴリのノートはありません。<br>最初の記録を、ゆっくり準備しています。</p>`;
    if (filterbar) filterbar.style.display = 'none';
    return;
  }

  /* ---------- タグボタン（実データのタグから作る） ---------- */
  const allTags = [...new Set(notes.flatMap(n => n.tags || []))];

  // タグの出現頻度（tagFold用。頻度降順・同数なら出現順）
  const tagCount = {};
  notes.forEach(n => (n.tags || []).forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
  const tagsByFreq = [...allTags].sort((a, b) => tagCount[b] - tagCount[a]);

  const tagBtn = (t, extra = '') =>
    `<button class="tag-btn${extra}" data-tag="${escapeHtml(t)}">${escapeHtml(t)}${
      tagCount[t] >= 2 ? `<i class="tag-count">${tagCount[t]}</i>` : ''}</button>`;

  if (filterbar && allTags.length && config.tagFold) {
    /* 畳み表示（2026-08-15 designerリデザイン）:
       初期は「すべて＋頻度上位6件」の横スクロール1行だけ。残りは展開パネルに格納 */
    const TOP_N = 6;
    const topTags = tagsByFreq.slice(0, TOP_N);
    const multiTags = tagsByFreq.filter(t => tagCount[t] >= 2);
    const soloTags = tagsByFreq.filter(t => tagCount[t] === 1);
    filterbar.innerHTML =
      `<div class="tagfold-row"><button class="tag-btn active" data-tag="">すべて</button>${
        topTags.map(t => tagBtn(t)).join('')}</div>` +
      `<button type="button" class="tagfold-toggle" id="tagfoldToggle" aria-expanded="false">すべてのタグを見る（${allTags.length}）<span aria-hidden="true">▾</span></button>` +
      `<div class="tagfold-panel" id="tagfoldPanel" hidden>` +
        (multiTags.length ? `<p class="tagfold-group">複数の記事に付くタグ</p><div class="tagfold-cloud">${multiTags.map(t => tagBtn(t)).join('')}</div>` : '') +
        (soloTags.length ? `<p class="tagfold-group">1記事だけのタグ</p><div class="tagfold-cloud">${soloTags.map(t => tagBtn(t)).join('')}</div>` : '') +
      `</div>`;
    const toggle = document.getElementById('tagfoldToggle');
    const panel = document.getElementById('tagfoldPanel');
    toggle.addEventListener('click', () => {
      const open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.innerHTML = open
        ? `タグを閉じる<span aria-hidden="true">▴</span>`
        : `すべてのタグを見る（${allTags.length}）<span aria-hidden="true">▾</span>`;
    });
  } else if (filterbar && allTags.length) {
    filterbar.innerHTML =
      '<span class="filter-label">タグで絞り込み：</span>' +
      '<button class="tag-btn active" data-tag="">すべて</button>' +
      allTags.map(t => `<button class="tag-btn" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('');
  } else if (filterbar) {
    filterbar.style.display = 'none';
  }

  // 採否ラベル。データに verdict が無ければ何も出さない（他カテゴリはこれで無影響）
  const TONE = { '採用': 'adopt', '見送り': 'skip', '未判定': 'pending' };
  const verdictHtml = (note) => {
    if (!note.verdict || !TONE[note.verdict]) return '';
    return `<span class="verdict verdict-${TONE[note.verdict]}">${escapeHtml(note.verdict)}</span>`;
  };

  /* ---------- カード生成 ---------- */
  function cardHtml(note, index) {
    const preview = previewOf(note);
    const inner = `
      <span class="card-labels"><span class="tag ${escapeHtml(config.key)}">${escapeHtml(config.label)}</span>${verdictHtml(note)}</span>
      <h3>${escapeHtml(note.title)}</h3>
      ${note.verdictReason ? `<p class="verdict-reason">${escapeHtml(note.verdictReason)}</p>` : ''}
      ${preview ? `<p class="preview">${escapeHtml(preview)}</p>` : ''}
      ${note.readingTime ? `<p class="card-reading">${escapeHtml(note.readingTime)}</p>` : ''}
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

  /* ---------- 先頭記事の舞台パネル＋統計行（2026-08-15 designerリデザイン・config.featuredでオプトイン） ---------- */
  const featuredEl = config.featured ? document.getElementById('featured') : null;
  const listHead = config.featured ? document.getElementById('listHead') : null;
  const listCount = config.featured ? document.getElementById('listCount') : null;

  if (featuredEl && notes.length) {
    const first = notes[0];
    // タイトル先頭の【採用】等の接頭辞は、舞台では採否バッジと二重になるため表示上だけ外す（データは無変更）
    const stageTitle = String(first.title || '').replace(/^【[^】]*】/, '');
    const firstPoints = previewListOf(first);
    const pad2 = n => String(n).padStart(2, '0');
    const cta = first.url
      ? `<a class="f-cta" href="${escapeHtml(first.url)}">この記事を読む <span aria-hidden="true">→</span></a>`
      : `<button type="button" class="f-cta" id="featuredCta">要点を読む <span aria-hidden="true">→</span></button>`;
    featuredEl.innerHTML = `
      <section class="featured-stage" aria-label="最初に読む一本">
        <svg class="f-constellation" viewBox="0 0 340 180" aria-hidden="true">
          <path d="M20 150 L95 60 L180 110 L265 35 L320 90" fill="none" stroke="currentColor" stroke-width="1"/>
          <path d="M95 60 L150 20 M180 110 L210 165" fill="none" stroke="currentColor" stroke-width="1"/>
          <circle cx="20" cy="150" r="3"/><circle cx="95" cy="60" r="4"/><circle cx="150" cy="20" r="2.5"/>
          <circle cx="180" cy="110" r="3.5"/><circle cx="210" cy="165" r="2.5"/><circle cx="265" cy="35" r="3"/><circle cx="320" cy="90" r="2.5"/>
        </svg>
        <p class="f-eyebrow">Featured — 最初に読む一本</p>
        <p class="f-counter">${pad2(1)} / ${pad2(notes.length)}</p>
        ${verdictHtml(first)}
        <h2 class="f-title">${escapeHtml(stageTitle)}</h2>
        ${first.verdictReason ? `<p class="f-note"><span>判定メモ —</span> ${escapeHtml(first.verdictReason)}</p>` : ''}
        ${firstPoints.length > 1
          ? `<ul class="f-points">${firstPoints.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>`
          : (firstPoints.length ? `<p class="f-point">${escapeHtml(firstPoints[0])}</p>` : '')}
        ${first.readingTime ? `<p class="f-reading">${escapeHtml(first.readingTime)}</p>` : ''}
        ${cta}
      </section>`;
  }

  const statsEl = config.featured ? document.getElementById('catStats') : null;
  if (statsEl && notes.length) {
    const adopted = notes.filter(n => n.verdict === '採用').length;
    statsEl.innerHTML = `
      <div class="cs-cell"><span class="cs-num">${notes.length}<i>件</i></span><span class="cs-label">${escapeHtml(config.statsUnit || '記事')}</span></div>
      <div class="cs-cell"><span class="cs-num">${allTags.length}<i>種</i></span><span class="cs-label">タグ</span></div>
      <div class="cs-cell"><span class="cs-num">${adopted}<i>件</i></span><span class="cs-label">採用</span></div>`;
  }
  if (listHead && notes.length) listHead.hidden = false;

  /* ---------- 絞り込み（0件のときは案内を出す） ---------- */
  let emptyNotice = null;

  function applyFilter(tag) {
    const featuredOn = !!featuredEl && !tag;   // 絞り込み中は舞台を隠し、一覧側に全件出す
    if (featuredEl) featuredEl.style.display = featuredOn ? '' : 'none';

    let visible = 0;
    grid.querySelectorAll('.archive-card').forEach(card => {
      let tags = [];
      try { tags = JSON.parse(card.dataset.tags || '[]'); } catch (_) { tags = []; }
      let show = !tag || tags.includes(tag);
      if (featuredOn && card.dataset.index === '0') show = false;  // 1件目は舞台側に表示中
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (listCount) {
      listCount.textContent = featuredOn
        ? `全${notes.length}件（1件目は上に表示中）`
        : (tag ? `${visible}件 / 全${notes.length}件` : `全${notes.length}件`);
    }

    if (!visible && tag) {
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

  if (featuredEl || listCount) applyFilter('');

  if (filterbar) {
    filterbar.addEventListener('click', (e) => {
      const btn = e.target.closest('.tag-btn');
      if (!btn) return;
      // 同じタグのボタンが上位チップ行と展開パネルの両方にあるため、data-tagで同期させる
      filterbar.querySelectorAll('.tag-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.tag === btn.dataset.tag));
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

  // 舞台パネルのCTA（先頭記事がurlを持たない場合のみ存在。モーダルで要点を開く）
  const featuredCta = document.getElementById('featuredCta');
  if (featuredCta) featuredCta.addEventListener('click', () => openModal(notes[0]));

  document.getElementById('modalClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();
