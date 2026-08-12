# Claude Code HTML出力をコンサル品質に整えるスキル

カテゴリ: AI開発 > Claude Code活用
タグ: #ClaudeCode #スキル #HTML出力 #資料作成

## ポイント
- Claude CodeのHTML出力は「線と箱」で作るためデザインが野暮ったくなりがち
- コンサル資料は「余白と文字の階層」で作るのが原則
- `html-report-design` スキルを入れると「HTMLで出して」と言った瞬間だけ働き、枠・グラデ・絵文字を禁止し完成済みCSSを使わせる
- 各セクションは「見出し→結論1文→根拠」の順で強制される
- 図解は矢羽根/ロードマップ/フレームワーク表/バブル/滝グラフの型から選ぶ
- 配色は脇役グレー＋主役の濃紺1色、凡例なしの直接ラベル
- アクセント色だけ会社カラーに差し替え可能
- A4印刷でそのまま配布OK

## インストール方法
```bash
# CLIの場合
npx skills add Ted0321/kotetsu-work-ai-skills@html-report-design

# または Claude Code に1行貼るだけ
# 「github.com/Ted0321/kotetsu... の skills/html-report-design を ~/.claude/skills/ にインストールして」
```

## よくあるミス・落とし穴
- スキルなしで「HTMLで出して」と頼むと枠・グラデ・絵文字まみれになる
- ChatGPT派はSKILL.mdのコピペでも動く（Claude Code専用ではない）

## 出典
- [こてつ｜AI×コンサルワーク (@kotetsu_work) のポスト](https://x.com/) （取り込み日：2026-08-09）
