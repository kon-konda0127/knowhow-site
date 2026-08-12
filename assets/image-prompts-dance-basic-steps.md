# 画像生成プロンプト集：ダンス基本ステップ

ChatGPT（画像生成）にそのまま貼り付けて使用。
**運用ルール：画像内にテキストは入れない**（AI生成の日本語文字は崩れるため）。
ラベル・説明はHP側のHTMLで載せる（`assets/dance-steps/` に保存した画像を、ノートの`image`欄から参照する）。

---

## 共通スタイル（全プロンプトに含めてあるので個別修正時に流用）

```
Clean flat vector illustration style, instructional dance diagram,
front view or 3/4 view, simple minimal background (white), pink/purple accent color (#E85D9C),
dancer figure in simple sportswear, no text, no letters, no labels
```

---

## 例：基本ステップの図解（社長がすでに作成中の画像に合わせて追記していく想定）

```
Clean flat vector illustration, instructional dance diagram, no text or letters.
A 3-panel sequence showing a basic dance step, front view, white background, pink accent color:
Panel 1: 開始姿勢（ニュートラルスタンス）
Panel 2: 動きの中間点（矢印で足の動く方向を示す）
Panel 3: 完了姿勢
Simple minimal style, consistent character across panels, footwork indicated with small directional arrows on the floor.
```

このテンプレートの `Panel 1/2/3` の説明文だけをステップごとに書き換えれば、同じ画風で量産できます。

---

## 保存先・命名ルール

- 保存先: `apps/knowhow-site/docs/assets/dance-steps/`（**必ずdocs/配下**。GitHub Pagesはdocs/フォルダのみを公開するため、docs/の外に置くと本番で表示されない）
- ファイル名: 英語のステップ名（小文字・ハイフン区切り）＋`.png`
  - 例: `two-step.png`、`box-step.png`、`pivot-turn.png`
- 1ステップにつき複数枚（連番）でもよい: `two-step-1.png`, `two-step-2.png`
- 日本語ファイル名は使わない（過去の教訓: `feedback_webapp_lessons.md`参照。URL問題を避けるため）
