# 英単語データ生成ワークフロー

このディレクトリはゲームで扱う英単語データを保管する場所であり、同時に「新しい単語をどう増やしていくか」の手順書でもある。

> 前提: OpenAI などの外部 API は呼ばない。生成は Claude（エージェント）が直接行う。`.env` や `OPENAI_API_KEY` はこのワークフローでは使用しない。

---

## 1. データスキーマ

1単語は以下の構造を持つ。最終成果物は `src/data/words/<english>.json` に単語ごと1ファイルで配置する。

```ts
export type Word = {
  english: string // 見出し語。小文字スネーク or 単語そのまま（例: "array", "pure_function"）
  japanese: string // 単語の意味（日本語）
  description: string // 説明（日本語）。どういう文脈で使われるかまで含める
  example_natural: {
    english: string // 単語を使った自然な例文
    japanese: string // その日本語訳
  }
  example_programming: // プログラミング例。単一オブジェクト（旧形式）または配列（新形式）
    | { language: string; body: string }
    | Array<{ language: string; body: string }>
  // ※ 旧形式（単一オブジェクト）は Zod の transform で自動的に配列に変換される
  // ※ 新規作成時は配列形式を推奨
  themes: Array<string> // 所属テーマ ID（themes.json のキー）。複数可
  difficulty: number // 1..10。この値がそのまま所属ステージ番号になる（§3.3 参照）
}
```

`stages` フィールドは持たない。ステージは `difficulty` から一意に決まる（`stage === difficulty`）ため、重複管理を避ける。

補足:

- `english` はファイル名にそのまま使う。スペースは `_` に置換、常に小文字。例: `pure_function.json`。
- `description` は「使われる場面」を含める。`japanese` が1語訳なのに対し、こちらは文脈込みの解説。
- `example_programming.language` は **Visual Basic / JavaScript / SQL を中心に**分散させる（この3言語で全体の8割以上を占めるイメージ）。単語の性質と合わない場合のみ他言語を選ぶ。
  - 該当する典型領域の目安:
    - `Visual Basic`: フォーム・コントロール・VBA・手続き型の基礎
    - `JavaScript`: Web / DOM / イベント / 非同期 / モダン構文
    - `SQL`: クエリ / 結合 / 集約 / DB 概念
- `example_programming.body` はコメントなしの短いコードでよい。

---

## 2. ディレクトリ構成

```
src/data/
├── README.md                   # 本ドキュメント（指示書）
├── themes.json                 # テーマ定義（コミット）
├── stages.json                 # ステージ構成：10段階のタイトル・説明（コミット）
├── types.ts                    # Zod スキーマと TS 型（コミット）
├── index.ts                    # 型定義 + 全 words をまとめた TS エントリ（コミット）
├── words/                      # 最終成果物：単語ごと1ファイル（コミット） ★ source of truth
│   ├── array.json
│   ├── loop.json
│   └── ...
└── .cache/                     # 中間生成物（.gitignore）
    ├── themes/
    │   └── <theme_id>.json     # テーマ別の英単語候補リスト（フェーズ2の出力）
    ├── dedup.json              # 重複除去後の全候補リスト（フェーズ3の出力）
    ├── vocabulary.json         # 単語＋難易度＋テーマの一時決定ファイル（フェーズ4で再構築）
    └── parts/                  # （必要に応じて復元）4パート分割ファイル
        └── <english>/
            ├── translation.json
            ├── description.json
            ├── example_natural.json
            └── example_programming.json
```

**重要:** source of truth は `src/data/words/<english>.json`。
`vocabulary.json`（単語採用と難易度の一覧）は生成ワークフロー時だけ `.cache/vocabulary.json` として構築され、最終的には `words/*.json` に統合されるため**コミットしない**。必要な場合は `words/*.json` から `{english, difficulty, themes}` を射影して再生成できる。

`.gitignore` に `src/data/.cache/` を追記する（本リポジトリの `.gitignore` 直下）。

---

## 3. テーマとステージ

### 3.1 テーマ (`themes.json`)

プログラミング文脈で共通する語彙のくくり。例:

```json
{
  "basic_io": {
    "title": "基本的な入出力",
    "description": "print, input, log など、プログラム実行時に人と対話するための語彙"
  },
  "data_structures": {
    "title": "データ構造",
    "description": "array, list, map, stack, queue などコレクション系"
  },
  "control_flow": {
    "title": "制御構造",
    "description": "if, loop, break, return など処理の流れを制御する語彙"
  }
}
```

### 3.2 ステージ (`stages.json`)

**ステージ数は10、各ステージの `target_word_count` は30**（合計 最大300語）で運用する。
ステージ番号はそのまま**英単語の難易度** (§3.3) と 1:1 対応する。

```json
[
  { "stage": 1, "title": "はじめてのプログラミング", "target_word_count": 30 },
  { "stage": 2, "title": "データをあつかう", "target_word_count": 30 },
  { "stage": 3, "title": "...", "target_word_count": 30 }
  // ... stage 10 まで
]
```

`themes` はステージ側では指定しない。どのテーマが何ステージに現れるかは `vocabulary.json` 側（単語ごとのテーマ所属 × 難易度）から結果的に決まる。

### 3.3 単語と難易度 (`.cache/vocabulary.json`) ★

ゲームに採用する全単語と、それぞれの難易度 (1..10) を決める**生成用の一時ファイル**。コミットはしない。
`words/*.json` はここに載った単語について作られ、完成後に `vocabulary.json` の情報は `words/*.json` 側に含まれる（`english`/`difficulty`/`themes`）。

```json
[
  { "english": "print", "difficulty": 1, "themes": ["basic_io"] },
  { "english": "variable", "difficulty": 1, "themes": ["variables_and_types"] },
  { "english": "array", "difficulty": 3, "themes": ["collections"] },
  { "english": "promise", "difficulty": 8, "themes": ["async_programming"] }
]
```

フィールド:

- `english`: 見出し語（最終 Word の `english` と一致する）
- `difficulty`: 1..10 の整数。**これがそのままステージ番号**になる
- `themes`: 所属テーマ ID の配列（最終 Word の `themes` にそのまま載る）
- 任意: `notes` — 難易度判断の理由メモ（レビュー用、ゲームには出さない）

運用ルール:

- 難易度は**単語同士の相対比較**で決める（ある単語より難しいか／易しいか、を横並びで見る）。このため、難易度付けは**全候補を一望した上で一括**で行う（§5 フェーズ4）。
- 各難易度バケツ (= ステージ) は `target_word_count = 30` を目安に揃える。極端に偏ったら候補の追加生成または降格・昇格で調整する。
- 同じ英単語が複数のテーマにまたがる場合、`themes` に複数 ID を並べる。`difficulty` は1つのみ（= 1つのステージにしか属さない）。

---

## 4. フェーズ全体像

```
[1] テーマ / ステージ定義
        │
        ▼
[2] テーマごとに英単語候補を列挙（並列）       ←─┐
        │                                        │ 単語追加・テーマ追加のたびに
        ▼                                        │ このループに戻る
[3] 重複除去して全候補リストを作る          ─────┘
        │
        ▼
[4] 難易度 (1..10) を割り当て → .cache/vocabulary.json（単独実行、一時）★
        │
        ▼
[5] 単語ごとに4パートを並行生成（並列）
    ├─ translation
    ├─ description
    ├─ example_natural
    └─ example_programming
        │
        ▼
[6] パートを統合して words/<english>.json に書き出す
        │
        ▼
[7] 検証（スキーマ / 重複 / 型 / 難易度バケツのバランス）
```

フェーズ4（難易度割り当て）は「全候補を横並びで見る」必要があるため**並列化しない**（親が単独で実行）。以降の生成フェーズは vocabulary.json を入力にする。

---

## 4.5 並列実行の基本原則

このワークフローは**ファイル I/O ベースで並列化する**。共有メモリや同期プリミティブは使わず、各並列ユニットが**書き込み先ファイルを独占する**ことで競合をゼロにする。

### 原則

1. **1タスク = 1書き込み対象**: 各サブタスクは担当する出力ファイル（または出力ディレクトリ配下）だけに書き込む。他タスクと同じファイルを触らない。
2. **並列ユニットは必ず別ファイルに書く**: フェーズ4の4パート（translation / description / example_natural / example_programming）は**最初から物理的に別ファイル**として保存する（`.cache/parts/<english>/<part>.json`）。単一 JSON に追記する設計にはしない。これにより「同じ単語の4パートを4並列」にしても衝突しない。
3. **読み取りは自由、書き込みは排他**: 既存 `words/*.json` や `themes.json` は複数タスクが読んでよい。
4. **冪等性**: 出力ファイルが既に存在するなら処理をスキップ。途中失敗しても同じコマンドで続きから進む。
5. **結果は戻り値より副作用で集約**: 各サブタスクは短いサマリ（件数・失敗リスト）だけを返し、本体の JSON はファイルに書き出す。親は後からファイルを走査して集約する。
6. **集約ファイルは親が直列で書く**: `.cache/dedup.json` や `src/data/words/<english>.json`（4パートのマージ結果）は**親が単独で書く**。並列タスクはここには書かせない。
7. **Task は同一メッセージで同時発火**: 並列の Task 呼び出しは**1つのメッセージに複数の Task tool call を並べる**ことで実現する（逐次発火しない）。

### 並列に切る粒度

| フェーズ                        | 並列単位                    | 並列数の目安                                 |
| ------------------------------- | --------------------------- | -------------------------------------------- |
| フェーズ2: テーマごとの候補列挙 | テーマ1件                   | テーマ数（3〜10）                            |
| フェーズ3: 重複除去             | —                           | 直列（親が単独で実行）                       |
| フェーズ4: 難易度割り当て       | —                           | 直列（横並び比較が必要なので親が単独で実行） |
| フェーズ5: 4パート生成          | 単語チャンク or 単語×パート | チャンク数（5〜10）※or 単語数×4              |
| フェーズ6: 統合                 | 単語1件                     | 基本は直列でよい（I/O のみ）                 |
| フェーズ7: 検証                 | ファイル1件                 | 直列でよい                                   |

### フェーズ2の並列発火テンプレート

テーマ `basic_io`, `data_structures`, `control_flow` があるなら、**1メッセージで3 Task を同時発火**する。

```
[Task A] subagent_type: general-purpose
  description: "Theme basic_io candidates"
  prompt:
    - テーマ定義: { id: basic_io, title: ..., description: ... }
    - 既存単語: [print, input, ...]
    - 目標件数: 18（target_word_count 12 × 1.5）
    - 出力先: src/data/.cache/themes/basic_io.json
    - 出力スキーマ: { theme, generated_at, existing_words, candidates: string[] }
    - 既に出力ファイルがあれば差分追記ではなく置き換えでよい
    - 戻り値は candidates 件数と重複除去前後の数だけ報告

[Task B] 同上、theme = data_structures
[Task C] 同上、theme = control_flow
```

### フェーズ4の並列発火テンプレート

`to_generate` が30単語あるとき、5単語 × 6チャンクに分割し、**1メッセージで6 Task を同時発火**する。

```
[Task 1..6] subagent_type: general-purpose
  description: "Enrich words chunk N"
  prompt:
    - 担当単語リスト: ["array", "list", "map", "stack", "queue"]
    - 各単語のテーマ/ステージ文脈: { array: { themes: [...], stages: [...] }, ... }
    - 出力ディレクトリ: src/data/.cache/parts/<english>/
    - 出力ファイル: translation.json, description.json, example_natural.json, example_programming.json
    - 各パートのスキーマ（本README §5フェーズ4を参照）
    - 既存ファイルはスキップ（冪等）
    - プログラミング例の言語はチャンク内で偏らせない
    - 戻り値は { word, written_parts, skipped_parts, failures } のリスト
```

より攻めた並列化: 1単語 × 4パートを別タスクに切ることもできる。ただし Task 起動オーバーヘッドがあるため、**単語数 ≤ 10 のときに限り**この戦略を使う。通常はチャンク並列で十分。

### 衝突回避の設計

- 出力ディレクトリは **`<english>` 単位でパーティション**されているため、異なる単語を担当するタスクは絶対に同じファイルを触らない。
- `.cache/dedup.json` のように**集約ファイル**を書くのはフェーズ3/5など**親が単独で**行うフェーズに限定する。並列タスクには書かせない。
- タスク失敗時は対応する `<english>` ディレクトリのキャッシュを削除してから再発火する。

### 進捗ログ

- 親（Claude本体）は各 Task の戻り値サマリを受け取り、`.cache/logs/YYYY-MM-DD-session.md` に「発火したタスク数 / 成功 / 失敗 / 追加された単語」を追記する。
- ログは git 管理外（`.cache/` 配下）。

---

## 5. 各フェーズの作業指示

各フェーズは冪等に設計する。途中で止まっても、同じフェーズを再実行すれば未完了分だけを進められるようにする。

### フェーズ1: テーマ/ステージ定義

- `src/data/themes.json` と `src/data/stages.json` を確認。存在しなければ作る。
- 追加したいテーマがあればここに書き足す。このフェーズでは候補単語の列挙まではしない。

### フェーズ2: テーマごとの単語候補列挙（**並列**）

**入力:** `themes.json`, 既存の `words/*.json`（既出単語の除外用）
**出力:** `.cache/themes/<theme_id>.json`
**並列単位:** テーマ1件 = 1 Task（§4.5 テンプレ参照）

フォーマット:

```json
{
  "theme": "basic_io",
  "generated_at": "2026-04-24T...",
  "existing_words": ["print", "input"],
  "candidates": ["log", "output", "console", "prompt", "stdin", "stdout"]
}
```

手順:

1. `src/data/words/` を glob し、既存の `english` を集める（= `existing_words`）。
2. 各テーマについて、既存語彙を「重複を避けたい対象」として渡し、候補を列挙する。
   - テーマの趣旨に沿うこと、プログラミング文脈で実際に使われる語であること。
   - 1テーマあたりの候補数はステージの `target_word_count` に対して1.5〜2倍ほど（重複除去で減るため）。
3. テーマ間は独立なので **Task ツールでサブエージェントに並行発火**できる。

並行化の指針: テーマ数がN個なら、Nタスクを同時に発火する。各タスクには
「対象テーマの id/title/description」「既存単語リスト」「出力パス」「期待件数」を渡し、戻り値として候補配列のみを JSON で受け取る。

### フェーズ3: 重複除去（全候補リスト作成）

**入力:** `.cache/themes/*.json`, 既存の `vocabulary.json`（あれば）
**出力:** `.cache/dedup.json`

```json
{
  "all_candidates": [
    { "english": "log", "themes": ["basic_io"] },
    { "english": "output", "themes": ["basic_io"] }
  ],
  "already_in_vocabulary": ["print", "input"]
}
```

手順:

1. 全テーマの candidates を集約。
2. 正規化: `trim` + 小文字化、スペースは `_` に。
3. 既存の `vocabulary.json` にある単語は `already_in_vocabulary` に入れ、`all_candidates` から除外。
4. 各候補について、それが登場した全テーマ ID を `themes` にマージ。
5. 結果を `.cache/dedup.json` に書き出す。

この段階では**難易度もステージも決めない**。決めるのは次のフェーズ4。

### フェーズ4: 難易度割り当て → `.cache/vocabulary.json`（★単独実行）

**入力:** `.cache/dedup.json`, 既存の `src/data/words/*.json`（あれば difficulty を流用）
**出力:** `src/data/.cache/vocabulary.json`（一時ファイル、コミットしない）
**並列化しない:** 横並びの相対比較が必要なため、親が1パスでやる。

手順:

1. `.cache/dedup.json` の `all_candidates` を読む。
2. 既存 `vocabulary.json` のエントリは**難易度を変えない**（安定性のため）。新規候補だけに difficulty を振る。
3. 難易度 1..10 を以下の基準で決める:
   - **1〜2**: プログラミング入門者が最初に触れる概念（print, variable, if, loop 等）
   - **3〜4**: 基本的なデータ操作（array, string, function, return, equal 等）
   - **5〜6**: 複合的な概念・中級（object, method, parameter, scope, exception 等）
   - **7〜8**: 応用・抽象度高（promise, async, closure, recursion, polymorphism 等）
   - **9〜10**: 専門用語・設計概念（dependency_injection, idempotent, memoization 等）
4. バケツバランス調整:
   - 各難易度に約30語を目指す（ステージあたりの `target_word_count`）。
   - 不足するバケツがある場合は、該当難易度帯のテーマについて**フェーズ2を追加発火**して候補を増やす。
   - 過剰な場合は、相対的に易しい／難しい単語を前後のバケツに移動させる。
5. 結果を `vocabulary.json` に書き出す（スキーマは §3.3 参照）。書き出し時は `difficulty` で昇順ソートし、同一難易度内では `english` のアルファベット順に揃える（レビューしやすさのため）。
6. 仕上げに、ユーザーに難易度一覧を提示しレビューを受ける。手動で調整された結果がそのまま後続の「正」になる。

### フェーズ5: 単語ごとに4パートを並行生成（**並列**）

**入力:** `src/data/vocabulary.json`（`words/<english>.json` がまだ無い英単語が対象）
**出力:** `.cache/parts/<english>/{translation,description,example_natural,example_programming}.json`
**並列単位:** 単語チャンク（5単語/チャンク）= 1 Task、単語数 ≤ 10 のときは単語×パートで最大4倍並列（§4.5 テンプレ参照）

各 Task には vocabulary.json から取ってきた **`english` / `themes` / `difficulty`** を文脈として渡すこと（特に `difficulty` は例文の難易度調整に使う）。

4パートは**互いに独立**に作れる。つまり 1単語につき最大4並行、さらに単語間でも並行できる。

各パートの出力スキーマ:

```jsonc
// translation.json
{ "english": "array", "japanese": "配列" }

// description.json
{ "description": "複数の値を順序付きで格納するデータ構造..." }

// example_natural.json
{ "english": "An array stores items in order.", "japanese": "配列は要素を順番に保持する。" }

// example_programming.json
{ "language": "TypeScript", "body": "const xs: number[] = [1, 2, 3]\nconsole.log(xs[0])" }
```

冪等化: 各パートファイルが**既に存在すれば再生成しない**。これにより失敗したパートだけをリトライできる。

並行化の指針:

- 単語リストをチャンク（例: 5単語ずつ）に切り、チャンクごとに Task を1つ発火。
- 各 Task は担当チャンク内の単語について、不足している4パートを順に生成してファイルへ書き出す。
- さらに加速したい場合、「1単語 × 4パート」で4タスク並列も可能。ただし Task オーバーヘッドがあるので、通常は「チャンク単位」の並列で十分。

各 Task に渡す情報:

- 対象単語リスト（`english` の配列）
- 各単語のテーマとステージ（文脈として使う）
- 出力パス規則（`.cache/parts/<english>/<part>.json`）
- パートごとの出力スキーマ

### フェーズ6: パート統合

**入力:** `.cache/parts/<english>/*.json` が4つ揃っている単語
**出力:** `src/data/words/<english>.json`

手順:

1. `.cache/parts/` を walk し、4パートが揃った単語を列挙。
2. `vocabulary.json` から `themes` と `difficulty` を引く。
3. 以下の形にマージして保存:

```json
{
  "english": "array",
  "japanese": "配列",
  "description": "...",
  "example_natural": { "english": "...", "japanese": "..." },
  "example_programming": { "language": "JavaScript", "body": "..." },
  "themes": ["collections"],
  "difficulty": 3
}
```

4パート未満しか揃っていない単語はスキップ（フェーズ5の再実行で後追い生成）。

### フェーズ7: 検証

- `src/data/words/*.json` を走査し、Word 型に適合しているか確認（キー欠落・空文字列・language が空など）。
- 重複チェック: `english` がユニークか。
- 参照整合性:
  - `themes` の値が `themes.json` に存在するか。
  - `difficulty` が 1..10 の範囲で、かつ `vocabulary.json` の `difficulty` と一致するか。
- 難易度バケツの健全性: 各 difficulty (= stage) で語数が `target_word_count` ±α に収まっているか。
- 目視チェックしたい場合は `.cache/logs/YYYY-MM-DD-session.md` にサマリを書き残す。

検証は `src/data/index.ts` の読み込み時に行うか、別途 vitest で `words/*.json` を総なめするテストを置く。

---

## 6. `src/data/index.ts`

アプリから型安全に参照できるようにする最終的な集約ポイント。

```ts
import type { Word } from './types'

// Vite の import.meta.glob で words/*.json をまとめて読む
const modules = import.meta.glob<Word>('./words/*.json', {
  eager: true,
  import: 'default',
})

export const words: Array<Word> = Object.values(modules)

export const wordsByStage: Record<number, Array<Word>> = words.reduce(
  (acc, w) => {
    ;(acc[w.difficulty] ??= []).push(w)
    return acc
  },
  {} as Record<number, Array<Word>>,
)
```

`types.ts` に `Word` 型を切り出しておき、生成フェーズでもこの型を参照する。
`stage === difficulty` なので、アプリ側で「ステージ N の単語」を取るときは `wordsByStage[N]` を引けばよい。

---

## 7. Claude への運用指示（再実行時の手順）

Claude が作業を再開するときは、常にこの順で動く。

1. このファイル（`src/data/README.md`）を読み直す。特に §4.5 並列実行の基本原則、§3.3 vocabulary.json。
2. `themes.json` / `stages.json` / `vocabulary.json` の差分を確認。必要なら更新。
3. `src/data/words/` と `.cache/` の現状を把握。
4. **フェーズ2** を並列 Task で実行（**1メッセージに Task 複数併記** / テーマ数分）。
5. **フェーズ3** を実行し、`.cache/dedup.json` を更新（ここは親が単独で）。
6. **フェーズ4** を実行し、`vocabulary.json` に新規単語と難易度を書き込む（親が単独で、横並び比較）。この時点でユーザーにレビューしてもらう。
7. **フェーズ5** を並列 Task で実行（**1メッセージに Task 複数併記** / チャンク単位）。既存パートはスキップ。
8. **フェーズ6** でパート統合し、`words/<english>.json` を書き出す（直列でよい）。
9. **フェーズ7** で検証し、問題があればそのパートだけキャッシュを消してフェーズ5からやり直す。

停止ルール:

- ステージの `target_word_count` を満たしたら一旦停止してユーザーに見せる。
- パート生成で不自然な出力（言語指定が欠ける、日本語訳が英語のまま等）を見つけたら、その単語のキャッシュを削除してやり直し、根本原因（プロンプト不足）をこのドキュメントに追記する。

---

## 8. 決定事項と未決事項

### 決定済み

- ステージ: **10ステージ × 各30語（合計最大300語）**
- 難易度: **1..10 の整数。`difficulty === stage` の1:1対応**
- 単語採用と難易度決定: **生成時に `.cache/vocabulary.json` を一時構築**（コミットせず、最終的に `words/*.json` に吸収）
- 最終成果物の配置: `src/data/words/<english>.json`（単語1ファイル）★ source of truth
- プログラミング例の言語: **Visual Basic / JavaScript / SQL を中心に**
- キャッシュ: `src/data/.cache/` 配下（`.gitignore` 済み）
- 並列時の衝突回避: 4パートは最初から別ファイル（`.cache/parts/<english>/<part>.json`）

### 未決事項

- [x] `themes.json` の初期セット — 25テーマ全採用で確定（2026-04-24）
- [ ] `stages.json` の各ステージタイトル（vocabulary.json の難易度分布を見ながら命名する）
- [ ] 検証フェーズを vitest で自動化するか、ワンショットスクリプトにするか

### テーマ候補（選定待ち）

ユーザーがこの中から採用テーマを選ぶ。選定後に `themes.json` を書き出す。

**基礎系**

- `basic_io` — 入出力（print, input, log, output, display, message, alert）
- `variables_and_types` — 変数と基本型（variable, constant, declare, string, number, boolean, null）
- `operators` — 演算子（plus, minus, equal, compare, and, or, not, greater, less）
- `control_flow` — 制御構造（if, else, then, loop, while, for, break, continue, exit）
- `functions_and_procedures` — 関数・プロシージャ（function, procedure, parameter, argument, return, call）
- `scope` — スコープ（local, global, public, private, module）
- `error_handling` — エラー処理（error, exception, try, catch, throw, finally, raise）
- `comments_and_docs` — コメント・注釈（comment, note, todo, tag, annotation）

**データ操作系**

- `strings_and_text` — 文字列操作（concat, substring, length, upper, lower, split, trim, replace）
- `numbers_and_math` — 数値計算（sum, average, count, max, min, round, floor, modulo）
- `collections` — 配列・コレクション（array, list, object, key, value, index, length）
- `boolean_logic` — 真偽値の論理（true, false, is, exists, valid）

**SQL / データベース系**

- `sql_query_basics` — SQL基礎（select, from, where, insert, update, delete, values）
- `sql_joins` — SQL結合（join, inner, outer, left, right, on, using）
- `sql_aggregation` — SQL集約（group, having, count, sum, avg, distinct, order, asc, desc）
- `database_concepts` — DB概念（table, row, column, record, schema, primary, foreign, key, index）

**Web / JavaScript 系**

- `web_dom` — DOM操作（document, element, query, select, append, remove, class, attribute）
- `events` — イベント（event, listener, click, submit, change, handler, trigger）
- `async_programming` — 非同期（callback, promise, async, await, fetch, resolve, reject）
- `http_and_api` — HTTP/API（request, response, status, header, body, get, post, endpoint, json）

**Visual Basic / Office 系**

- `vb_forms_controls` — VBフォーム/コントロール（form, button, textbox, label, checkbox）
- `excel_vba_basics` — Excel VBA（workbook, worksheet, range, cell, value, formula, macro）
- `file_io` — ファイル入出力（file, open, close, read, write, path, append, stream）

**開発プロセス系**

- `debugging_and_testing` — デバッグ・テスト（bug, fix, test, assert, expect, mock, breakpoint）
- `modules_and_imports` — モジュール・読み込み（module, import, export, require, include）

これらが決まったら本ドキュメントを更新し、それに従って生成を進める。
