/**
 * AI開発ノートデータ（コンテンツ改善版）
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
  {
    id: "claude-code-html-report-skill",
    title: "Claude Code HTML出力をコンサル品質に整えるスキル",
    category: "AI開発 > Claude Code活用",
    tags: ["#ClaudeCode", "#スキル", "#HTML出力", "#資料作成"],
    points: [
      "html-report-design スキルを入れると「HTMLで出して」と言った瞬間だけ働く",
      "枠・グラデ・絵文字を禁止し完成済みCSSを使わせる",
      "各セクションは「見出し→結論1文→根拠」の順で強制",
      "図解は矢羽根/ロードマップ/フレームワーク表/バブル/滝グラフの型から選ぶ",
      "配色は脇役グレー＋主役の濃紺1色、凡例なしの直接ラベル",
      "A4印刷でそのまま配布OK"
    ]
  },
  {
    id: "codex-model-router",
    title: "Codex subagent のモデルルーティング（model-router）",
    category: "AI開発 > Codex活用",
    tags: ["#Codex", "#subagent", "#モデル選択", "#コスト最適化"],
    points: [
      "model-router で Codex の subagent（AIが別のAIに指示を出す仕組み）機能を拡張できる",
      "タスクごとに異なるモデルを使い分けられる（重い判断は上位モデル、定型コードは軽量モデル）",
      "コスト構造そのものが変わる発想：全タスクに最上位モデルを使う必要がなくなる"
    ]
  }
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
            <p style="font-size:0.82rem;color:#64748b;">${n.category}</p>
            <div class="tags">${n.tags.map(t => `<span class="note-tag">${t}</span>`).join('')}</div>
          </a>`).join('');
  }

  renderTagFilter();
  renderList();
}

renderNotes(AI_NOTES);
