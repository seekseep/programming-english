# Codex への指示

## タスク概要

`docs/prompts/` 配下にある7つのプロンプトファイルを使って、プログラミングで使う英単語を収集してください。
各プロンプトに従ってJSON配列を生成し、結果を `data/words/` 配下に保存してください。

## 手順

1. 以下の7つのプロンプトファイルを読む
   - `docs/prompts/prompt-javascript.md`
   - `docs/prompts/prompt-html.md`
   - `docs/prompts/prompt-css.md`
   - `docs/prompts/prompt-sql.md`
   - `docs/prompts/prompt-java.md`
   - `docs/prompts/prompt-vb.md`
   - `docs/prompts/prompt-naming.md`

2. 各プロンプトの指示に従い、英単語と日本語訳のペアをJSON配列として生成する

3. 結果を以下のファイルに保存する（ディレクトリがなければ作成する）
   - `data/words/javascript.json`
   - `data/words/html.json`
   - `data/words/css.json`
   - `data/words/sql.json`
   - `data/words/java.json`
   - `data/words/vb.json`
   - `data/words/naming.json`

4. 全ファイルの単語を統合し、重複を除去して `data/words/all.json` に保存する
   - 重複の判定は `word` フィールドが同一かどうかで行う（大文字小文字は区別しない）
   - 重複がある場合は、意味（meaning）がより詳しい方を残す

## 出力形式

各JSONファイルのフォーマット:

```json
[
  { "word": "visible", "meaning": "見える、表示される" },
  { "word": "enable", "meaning": "有効にする" }
]
```

## 注意事項

- 各プロンプト内のルール（除外条件など）を必ず守ること
- 各ファイルは最低50個、できれば100個以上の単語を含めること
- JSONとして正しい形式で出力すること（末尾カンマなどのエラーがないように）
