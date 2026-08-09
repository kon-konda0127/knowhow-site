/**
 * AI開発ノートデータ
 * 「サイトを更新して」と指示すると Claude がこのファイルに追記します。
 *
 * 各ノートの構造:
 *   id       : ファイル名に使うID（英数字とハイフンのみ）
 *   title    : ノートのタイトル
 *   category : カテゴリパス（例: "AI開発 > プロンプト設計"）
 *   tags     : タグの配列（例: ["#Claude", "#プロンプト"]）
 *   points   : ポイントの配列
 *   mistakes : よくあるミス・落とし穴の配列
 *   practice : 実践・応用例の配列
 *   sources  : 出典の配列（{ label, url, date } の形式）
 */
const AI_NOTES = [
  // ノートはここに追加されます
];

/* ===== 以下は表示ロジック（触らなくてOK） ===== */

function renderNotes(notes) {
  const list = document.getElementById('note-list');
  const tagFilter = document.getElementById('tag-filter');

  if (notes.length === 0) return;

  const allTags = [...new Set(notes.flatMap(n => n.tags))].sort();
  let activeTag = null;

  function renderTagFilter() {
    tagFilter.innerHTML = '';
    allTags.forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'tag-btn' + (tag === activeTag ? ' active' : '');
      btn.textContent = tag;
      btn.onclick = () => {
        activeTag = activeTag === tag ? null : tag;
        renderTagFilter();
        renderList();
      };
      tagFilter.appendChild(btn);
    });
  }

  function renderList() {
    const filtered = activeTag ? notes.filter(n => n.tags.includes(activeTag)) : notes;
    list.innerHTML = filtered.length === 0
      ? '<p class="empty-msg">該当するノートがありません。</p>'
      : filtered.map(n => `
          <a href="notes/${n.id}.html" class="note-card">
            <h3>${n.title}</h3>
            <p style="font-size:0.82rem;color:#6b7280;">${n.category}</p>
            <div class="tags">${n.tags.map(t => `<span class="note-tag">${t}</span>`).join('')}</div>
          </a>`).join('');
  }

  renderTagFilter();
  renderList();
}

renderNotes(AI_NOTES);
