# プログラミング言語の追加手順

新しいプログラミング言語をアプリに追加するときの手順。

---

## 1. LANGUAGES 定数に追加

**ファイル:** `src/context/LanguagePreferenceContext.tsx`

```ts
export const LANGUAGES = [
  { value: 'Visual Basic', label: 'VB' },
  { value: 'JavaScript', label: 'JS' },
  { value: 'Python', label: 'Py' },
  { value: 'Java', label: 'Java' },
  { value: 'SQL', label: 'SQL' },
  { value: 'TypeScript', label: 'TS' }, // ← 新しい言語を追加
] as const
```

- `value`: 言語の正式名（word JSON の `example_programming.language` と一致させる）
- `label`: タブや設定画面に表示する短い名前

---

## 2. Prism シンタックスハイライトのマッピングを追加

**ファイル:** `src/components/CodeBlock.tsx`

```ts
const prismLanguageMap: Record<string, string> = {
  // ...
  typescript: 'javascript', // ← 追加（Prism にバンドルされていない言語は 'plain'）
}
```

prism-react-renderer v2 のバンドル済み言語:
`javascript, sql, css, html, json, python, go, swift, c, objectivec, graphql, markdown, xml, reason, actionscript`

上記に含まれない言語は `'plain'` にフォールバック。

---

## 3. CSS カラー変数を追加（任意）

**ファイル:** `src/styles.css`

```css
:root {
  /* ... */
  --word-typescript: #3178c6; /* ← 言語のブランドカラー */
}
```

現在 UI で直接使っていないが、将来の拡張用に定義しておく。

---

## 4. 全単語にコード例を追加

300+ 個の単語 JSON ファイル（`src/data/words/*.json`）にコード例を追加する必要がある。

### 手動で追加する場合

各 JSON ファイルの `example_programming` 配列にエントリを追加する:

```json
{
  "example_programming": [
    { "language": "JavaScript", "body": "const arr = [1, 2, 3];" },
    { "language": "TypeScript", "body": "const arr: number[] = [1, 2, 3];" }
  ]
}
```

### Claude 等の AI を使って一括生成する場合

以下のような手順で効率的に生成できる:

1. `src/data/words/` 内の全 JSON ファイルを読み込む
2. 各単語の `english`, `difficulty`, 既存の `example_programming` を確認
3. 新言語のコード例を生成（難易度に応じた複雑さで、対象の英単語がコード中に自然に出現すること）
4. `example_programming` 配列に追加して JSON ファイルを更新

**プロンプト例:**

```
以下の単語データに TypeScript のコード例を追加してください。

- english: "array"
- difficulty: 1
- 既存例: const arr = [1, 2, 3]; (JavaScript)

条件:
- 難易度1なので初歩的なコードにする
- "array" という単語がコード中に自然に登場すること
- コメントは不要
```

---

## 5. 検証

```bash
# 型チェック
npx tsc --noEmit

# lint
npm run lint

# 言語の分布を確認
node -e "
const fs = require('fs');
const dir = 'src/data/words';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
const langs = {};
for (const f of files) {
  const w = JSON.parse(fs.readFileSync(dir + '/' + f, 'utf8'));
  const ex = Array.isArray(w.example_programming) ? w.example_programming : [w.example_programming];
  ex.forEach(e => { langs[e.language] = (langs[e.language]||0)+1; });
}
console.log(langs);
"

# ブラウザで確認
# 1. 設定 → 新しい言語にチェック → 保存
# 2. ステージをプレイ → タブに新しい言語が表示される
# 3. タブを切り替え → コード例が切り替わる
```

---

## チェックリスト

| #   | やること               | ファイル                                    |
| --- | ---------------------- | ------------------------------------------- |
| 1   | LANGUAGES 定数に追加   | `src/context/LanguagePreferenceContext.tsx` |
| 2   | Prism マッピングに追加 | `src/components/CodeBlock.tsx`              |
| 3   | CSS カラー変数を追加   | `src/styles.css`                            |
| 4   | 全単語にコード例を追加 | `src/data/words/*.json`                     |
| 5   | 検証                   | ブラウザ + lint                             |
