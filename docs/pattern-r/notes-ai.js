const AI_NOTES = [
  { id: "claude-code-html-report-skill", title: "Claude Code HTML出力をコンサル品質に整えるスキル", category: "AI開発 > Claude Code活用", tags: ["#ClaudeCode", "#スキル", "#HTML出力", "#資料作成"], points: ["html-report-designスキルを導入すると「HTMLで出して」と言った瞬間だけ動作し、枠・グラデ・絵文字を自動禁止して完成済みCSSを使わせる","各セクションは「見出し→結論1文→根拠」の順に強制される","図解は矢羽根/ロードマップ/フレームワーク表/バブル/滝グラフの型から自動選択","配色は脇役グレー＋主役の濃紺1色、凡例なしの直接ラベルに統一","アクセント色だけ任意のカラーに差し替え可能","A4印刷でそのまま配布できるクオリティ"] },
  { id: "codex-model-router", title: "Codex subagentのモデルルーティング（model-router）", category: "AI開発 > Codex活用", tags: ["#Codex", "#subagent", "#モデル選択", "#コスト最適化"], points: ["model-routerでCodexのsubagent（AIが別のAIに指示を出す仕組み）を拡張し、タスクごとに異なるモデルを使い分けられる","重い判断・設計はOpus等の上位モデル、定型的なコード生成はDeepSeek等の軽量モデルに自動振り分け","全タスクに最上位モデルを使い続けるとコスト過多になる問題を解決する","コスト構造そのものを変える設計思想"] }
];
function renderNotes(notes) {
  const list = document.getElementById('note-list'); const tagFilter = document.getElementById('tag-filter');
  if (notes.length === 0) return;
  const allTags = [...new Set(notes.flatMap(n => n.tags))].sort(); let activeTag = null;
  function renderTagFilter() { tagFilter.innerHTML = ''; allTags.forEach(tag => { const btn = document.createElement('button'); btn.className = 'tag-btn' + (tag === activeTag ? ' active' : ''); btn.textContent = tag; btn.onclick = () => { activeTag = activeTag === tag ? null : tag; renderTagFilter(); renderList(); }; tagFilter.appendChild(btn); }); }
  function renderList() { const filtered = activeTag ? notes.filter(n => n.tags.includes(activeTag)) : notes; list.innerHTML = filtered.length === 0 ? '<p class="empty-msg">該当するノートがありません。</p>' : filtered.map(n => `<a href="notes/${n.id}.html" class="note-card"><h3>${n.title}</h3><p style="font-size:0.78rem;color:#888;">${n.category}</p><div class="tags">${n.tags.map(t=>`<span class="note-tag">${t}</span>`).join('')}</div></a>`).join(''); }
  renderTagFilter(); renderList();
}
renderNotes(AI_NOTES);
