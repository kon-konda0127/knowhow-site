/**
 * ダンスノートデータ
 * 「サイトを更新して」と指示すると Claude がこのファイルに追記します。
 * 描画は各ページ側のスクリプトが行うため、このファイルはデータ定義のみ（notes-column.jsと同形式）。
 * 詳細ページを作る場合は url フィールド（例: "notes/xxx.html"）を追加すること。
 *
 * 各ノートの構造:
 *   id       : ファイル名に使うID（英数字とハイフンのみ）
 *   title    : ノートのタイトル
 *   category : カテゴリパス（例: "ダンス > アイソレーション"）
 *   tags     : タグの配列（例: ["#基礎", "#毎日練習"]）
 *   points   : ポイントの配列
 *   mistakes : よくあるミスの配列
 *   drills   : 練習ドリルの配列
 *   sources  : 出典の配列（{ label, url, date } の形式）
 *   images   : 任意。ステップ図解画像のファイル名の配列（docs/assets/dance-steps/配下、拡張子込み。GitHub Pagesはdocs/のみ公開するため、画像は必ずdocs/配下に置くこと）
 *              例: ["two-step.png"]。複数枚可。無ければ省略してよい
 */
const NOTES_DANCE = [
  // ノートはここに追加されます（例）
  // {
  //   id: "isolation-neck",
  //   title: "アイソレーション - 首",
  //   category: "ダンス > アイソレーション",
  //   tags: ["#基礎", "#毎日練習"],
  //   points: ["首だけを動かし、肩は固定する", "前後左右4方向を均等に"],
  //   mistakes: ["肩が一緒に動いてしまう", "動きが小さくなりがち"],
  //   drills: ["鏡の前で1日10回×4方向", "音楽に合わせてゆっくりから"],
  //   sources: [{ label: "参考動画タイトル", url: "https://...", date: "2026-08-08" }],
  //   images: ["isolation-neck.png"]
  // }
];
