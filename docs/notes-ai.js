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
      "スキル1つで、AIのHTML資料が「枠と箱だらけ」から「余白と階層で見せるコンサル資料級」に変わる",
      "「HTMLで出して」と言った瞬間だけ働き、枠・グラデ・絵文字を禁止し完成済みCSSを使わせる",
      "各セクションは「見出し→結論1文→根拠」の順で強制。図解は5つの型から選ばせ自由に描かせない",
      "効く理由は「センス良く」ではなく判断基準を作法書として渡すから。毎回同じ品質が出る",
      "導入コマンドはSNS情報・未検証。リポジトリの裏取りをしてから"
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
      "タスクの重さでモデルを自動で使い分けると、品質を保ったままAI利用コストの構造が変わる",
      "重い判断（設計・レビュー）は上位モデル、定型的な量産作業は軽量モデルに振り分け",
      "ツールを入れなくても「判断が要るか、量産か」の振り分け習慣だけで今日から効く",
      "インストール手順はSNS情報・未検証。導入前に裏取りを"
    ],
    url: "notes/codex-model-router.html",
    date: "2026-08-09"
  }
];
