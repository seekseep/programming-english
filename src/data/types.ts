// src/data/types.ts
// プログラミング英単語ゲームで扱うデータの Zod スキーマと型定義。
// 実データのスキーマは src/data/README.md に準拠。

import { z } from 'zod'

export const WordSchema = z.object({
  /** 英単語見出し。ファイル名と一致する（例: "array", "pure_function"）。 */
  english: z.string(),
  /** 日本語訳（短く1意味）。 */
  japanese: z.string(),
  /** 日本語の説明。プログラミング文脈での使われ方を含む。 */
  description: z.string(),
  /** 英語の自然な例文と日本語訳。 */
  example_natural: z.object({
    english: z.string(),
    japanese: z.string(),
  }),
  /** プログラミング例（使用言語とコード片）。 */
  example_programming: z.object({
    language: z.string(),
    body: z.string(),
  }),
  /** 所属テーマID（themes.json のキー）。複数可。 */
  themes: z.array(z.string()),
  /** 1..10 の整数。これがそのままステージ番号になる。 */
  difficulty: z.number().int().min(1).max(10),
})

export type Word = z.infer<typeof WordSchema>

export const StageSchema = z.object({
  /** 文字列ID（例: "stage-01"）。セーブデータなどのキーに使う。 */
  id: z.string(),
  /** 1..10。Word.difficulty と 1:1 対応。 */
  stage: z.number().int().min(1).max(10),
  /** ステージ表示名。 */
  title: z.string(),
  /** ステージ説明。 */
  description: z.string(),
  /** 目標語数（30 固定運用）。 */
  target_word_count: z.number().int(),
})

export type Stage = z.infer<typeof StageSchema>

export const ThemeSchema = z.object({
  title: z.string(),
  description: z.string(),
})

export type Theme = z.infer<typeof ThemeSchema>
