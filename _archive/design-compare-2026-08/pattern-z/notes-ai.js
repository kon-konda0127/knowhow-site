const AI_NOTES = [
  {
    id: "claude-code-html-report-skill",
    title: "Claude Code HTML出力をコンサル品質に整えるスキル",
    category: "AI開発 > Claude Code活用",
    tags: ["#ClaudeCode", "#スキル", "#HTML出力", "#資料作成"],
    points: [
      "html-report-designスキルを導入すると「HTMLで出して」と言った瞬間だけ動作し、枠・グラデ・絵文字を自動禁止して完成済みCSSを使わせる",
      "各セクションは「見出し→結論1文→根拠」の順に強制される",
      "配色は脇役グレー＋主役の濃紺1色、凡例なしの直接ラベルに統一"
    ],
    source: "@kotetsu_ai のポスト（X）",
    sourceUrl: "https://x.com",
    date: "2026-08-08"
  },
  {
    id: "codex-model-router",
    title: "Codex subagentのモデルルーティング（model-router）",
    category: "AI開発 > Codex活用",
    tags: ["#Codex", "#subagent", "#モデル選択", "#コスト最適化"],
    points: [
      "model-routerでCodexのsubagentを拡張し、タスクごとに異なるモデルを使い分けられる",
      "重い判断・設計はOpus等の上位モデル、定型的なコード生成はDeepSeek等の軽量モデルに自動振り分け",
      "コスト構造そのものを変える設計思想"
    ],
    source: "@todai_codex のポスト（X）",
    sourceUrl: "https://x.com",
    date: "2026-08-08"
  }
];

function renderNotes(notes) {
  const tagSet = new Set();
  notes.forEach(n => n.tags.forEach(t => tagSet.add(t)));
  const tagFilter = document.getElementById("tag-filter");
  let active = null;
  [...tagSet].forEach(tag => {
    const btn = document.createElement("button");
    btn.className = "tag-btn";
    btn.textContent = tag;
    btn.onclick = () => {
      active = active === tag ? null : tag;
      document.querySelectorAll(".tag-btn").forEach(b => b.classList.toggle("active", b.textContent === active));
      render(active);
    };
    tagFilter.appendChild(btn);
  });
  function render(activeTag) {
    const list = document.getElementById("note-list");
    const filtered = activeTag ? notes.filter(n => n.tags.includes(activeTag)) : notes;
    if (!filtered.length) { list.innerHTML = '<p class="empty-msg">NONE</p>'; return; }
    list.innerHTML = filtered.map(n => `
      <a href="notes/${n.id}.html" class="note-card">
        <div class="note-category">${n.category}</div>
        <h3 class="note-title">${n.title}</h3>
        <div class="note-tags">${n.tags.map(t => `<span class="note-tag">${t}</span>`).join("")}</div>
        <div class="note-date">${n.date}</div>
      </a>`).join("");
  }
  render(null);
}
renderNotes(AI_NOTES);
