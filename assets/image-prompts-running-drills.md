# 画像生成プロンプト集：ランニングドリル3種

ChatGPT（画像生成）にそのまま貼り付けて使用。
**運用ルール：画像内にテキストは入れない**（AI生成の日本語文字は崩れるため）。
ラベル・説明はHP側のHTMLか、Claudeが作るSVG注釈版で載せる。

---

## 共通スタイル（全プロンプトに含めてあるので個別修正時に流用）

```
Clean flat vector illustration style, instructional fitness diagram,
side view, simple minimal background (white), green accent color (#4CAF50),
athletic runner figure in simple sportswear, no text, no letters, no labels
```

---

## ドリル①：その場ケンケン＆足の入れ替え

```
Clean flat vector illustration, instructional fitness diagram, no text or letters.
A 3-panel sequence showing a running drill, side view, white background, green accent color:
Panel 1: An athletic runner standing upright on one leg, the other knee raised to 90 degrees, with a straight vertical line drawn through head, torso and standing leg to emphasize perfect vertical body alignment.
Panel 2: The same runner hopping in place on the standing leg, slightly airborne, body axis still perfectly vertical, raised knee held at 90 degrees.
Panel 3: The runner in mid-air switching legs quickly — the previously raised leg now extending down, the other knee rising — with small motion arrows showing the rapid mid-air leg exchange before landing.
Simple minimal style, consistent character across panels.
```

**日本語版**
```
テキスト・文字なしのフラットなベクターイラスト、フィットネス解説図。
3コマ連続、横から見た構図、白背景、グリーンのアクセントカラー。
1コマ目：片膝を90度に上げて直立するランナー。頭〜体幹〜支持脚を貫く垂直線で体軸を強調。
2コマ目：体軸を垂直に保ったまま、その場で軽く跳ねている（ケンケン）。
3コマ目：着地前の空中で左右の脚を素早く入れ替える瞬間。動きを示す小さな矢印付き。
```

---

## ドリル②：サイド＆インアウトステップ（外・中・中）

```
Clean flat vector illustration, instructional fitness diagram, no text or letters.
Two-part composition, white background, green accent color:
Top: an athletic runner shown from the front doing quick small side steps, eyes looking forward (not down), upright posture, arms swinging in coordination.
Bottom: a bird's-eye view foot placement diagram — footprint marks on the ground showing a repeating rhythm pattern of one step wide to the outside, then two steps narrow to the center line (out-center-center pattern), with numbered dots or arrows showing the stepping order moving forward.
Simple minimal style.
```

**日本語版**
```
テキスト・文字なしのフラットなベクターイラスト、フィットネス解説図。上下2段構成、白背景、グリーンのアクセント。
上段：正面から見たランナーが細かく素早いサイドステップをしている。目線は前方、姿勢はまっすぐ、腕振りも連動。
下段：真上から見た足の接地図。「外側に1歩→中央に2歩」を繰り返すリズムパターンを足跡マークと進行方向の矢印で表現。
```

---

## ドリル③：コンパクトな低軌道モモ上げ

```
Clean flat vector illustration, instructional fitness diagram, no text or letters.
A side-by-side comparison, side view, white background:
Left figure (marked with a red X symbol): a runner doing exaggerated high-knee drills, knees lifted very high to waist level, foot landing far in front of the body — drawn slightly grayed out to indicate the wrong way.
Right figure (marked with a green check symbol): a runner doing compact low-knee quick steps, knees kept low, foot striking the ground directly under the body's center of gravity — a vertical dashed line from hip to landing foot showing the foot lands right under the hips. Green accent color, dynamic small motion arrows showing quick turnover.
Simple minimal style.
```

**日本語版**
```
テキスト・文字なしのフラットなベクターイラスト、横から見た比較図、白背景。
左（赤い×マーク付き・薄いグレー表示）：膝を腰の高さまで高く上げ、足が体の前方に着地している誤ったモモ上げ。
右（緑のチェックマーク付き）：膝を低く小さく保ち、腰から真下に伸びる点線の通り重心の真下に接地する正しい低軌道モモ上げ。素早い回転を示す小さな矢印付き。
```

---

## HPヘッダー用（装飾画像・任意）

```
Wide banner illustration, flat vector style, energetic and clean:
a runner silhouette in motion on the left, abstract rhythmic footstep patterns
flowing to the right, white background with green gradient accents,
modern minimal sporty mood, no text.
```

---

## 生成後のチェックリスト
- [ ] 体軸の垂直線（ドリル①）が描かれているか
- [ ] 足跡パターン（ドリル②）が「外1・中2」になっているか（AIはリズムパターンを間違えやすい→崩れていたら「footprint pattern: 1 wide step, then 2 narrow steps, repeating」と追加指示）
- [ ] ドリル③の×側と✓側が明確に区別できるか
- [ ] 意図しない文字が入っていないか（入っていたら「remove all text」で再生成）
- [ ] 完成画像は `assets/` に保存（例：`drill01_kenken.png`）
