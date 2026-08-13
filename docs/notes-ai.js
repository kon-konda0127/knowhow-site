/**
 * AI開発ノートデータ
 * 「サイトを更新して」と指示すると Claude がこのファイルに追記します。
 * 描画はai.html側のスクリプトが行うため、このファイルはデータ定義のみ（notes-column.jsと同形式）。
 *
 * 各ノートの構造:
 *   id       : ファイル名に使うID（英数字とハイフンのみ）
 *   title    : ノートのタイトル
 *   category : カテゴリパス（例: "AI開発 > プロンプト設計"）
 *   tags     : タグの配列（例: ["#Claude", "#プロンプト"]）
 *   points   : ポイントの配列（先頭が一覧カードのプレビューになる）
 *   url      : 詳細ページへの相対パス（docs/からの相対。例: "notes/xxx.html"）
 *   date     : 取り込み日
 */
const NOTES_AI = [
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
    ],
    url: "notes/claude-code-html-report-skill.html",
    date: "2026-08-09"
  },
  {
    id: "codex-model-router",
    title: "Codex subagent のモデルルーティング（model-router）",
    category: "AI開発 > Codex活用",
    tags: ["#Codex", "#subagent", "#モデル選択", "#コスト最適化"],
    points: [
      "model-router で Codex の subagent 機能を拡張、タスクごとに異なるモデルを使い分けられる",
      "重い判断・設計は上位モデル（Opus等）、定型的なコード生成は軽量モデル（DeepSeek等）に振り分け",
      "コスト構造そのものが変わる発想"
    ],
    url: "notes/codex-model-router.html",
    date: "2026-08-09"
  }
];
