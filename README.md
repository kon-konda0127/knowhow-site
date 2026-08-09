# ダンス・ランニング・AI開発 ノウハウサイト

Instagram・YouTube・X から収集したノウハウを論点ごとに整理する個人学習サイト。

## フォルダ構成

```
knowhow-site/
├── inbox/            ← スクショ・テキストを放り込む場所
│   ├── dance/
│   ├── running/
│   └── ai/
├── notes/            ← 構造化済みMarkdownノート（Claudeが生成）
│   ├── dance/
│   ├── running/
│   └── ai/
├── assets/           ← SVG図解・装飾画像・プロンプト集
└── docs/             ← 公開するHP（HTML/CSS/JS）
    ├── index.html    ← トップページ
    ├── dance.html    ← ダンス一覧
    ├── running.html  ← ランニング一覧
    ├── ai.html       ← AI開発一覧
    ├── style.css     ← 共通スタイル
    ├── notes-dance.js   ← ダンスノートデータ
    ├── notes-running.js ← ランニングノートデータ
    ├── notes-ai.js      ← AI開発ノートデータ
    └── notes/        ← 各ノートのHTMLページ
```

※ `inbox/` はGitに含めない（個人素材のため）。処理済みスクショはノート生成後に**削除**する。

## 日常の使い方（Claude Codeへの指示）

| やりたいこと | Claude Codeに言う言葉 |
|---|---|
| スクショを処理してノートにまとめる | `inbox を処理して` |
| サイトのHTMLを最新ノートに合わせる | `サイトを更新して` |
| GitHub Pages に公開する | `公開して` |

処理の流れ：画像読み取り → Markdownノート生成 → notes-*.js に追記 → スクショ削除

## ファイル名のルール（inbox に入れる時）

```
YYYYMMDD_内容メモ.png
例: 20260809_ClaudeCodeスキル.png
    20260809_ピッチ走法.txt
```

## 注意事項

- Instagram 動画のダウンロードは行わない（規約違反のため）
- 素材は自分のスクショ・画面収録のみ
- 出典（元動画・投稿のURL）は必ずノートに残す
- 公開前に必ず Claude に確認を求める
