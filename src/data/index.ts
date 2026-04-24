// src/data/index.ts
// アプリから参照するデータ集約エントリ。
// - words/*.json を import.meta.glob で静的にまとめて読み込み
// - stages.json / themes.json を Zod で型安全にパース
// - アプリ側で便利に使えるマップ・ヘルパも提供
//
// vocabulary.json は「単語採用と難易度の決定」に使う生成ワークフロー用ファイル。
// ランタイムには必要ないため、ここでは読み込まない。

import { z } from 'zod'
import type { Stage, Word } from './types'
import { WordSchema, StageSchema, ThemeSchema } from './types'
import themesJson from './themes.json'
import stagesJson from './stages.json'

// Vite: eager に JSON を読み込み、{ path: content } のマップを得る
const wordModules = import.meta.glob<unknown>('./words/*.json', {
  eager: true,
  import: 'default',
})

/** 全単語。順序は english 昇順。 */
export const allWords: Array<Word> = Object.values(wordModules)
  .map((raw) => WordSchema.parse(raw))
  .sort((a, b) => a.english.localeCompare(b.english))

/** テーマ定義（id → Theme）。 */
export const themes = z.record(z.string(), ThemeSchema).parse(themesJson)

/** ステージ定義（stage 1..10）。 */
export const stages = z.array(StageSchema).parse(stagesJson)

// --- 索引・ヘルパ ---

const byEnglish = new Map<string, Word>()
for (const w of allWords) byEnglish.set(w.english, w)

/** 英単語から Word を引く。 */
export function getWord(english: string): Word | undefined {
  return byEnglish.get(english)
}

const stageById = new Map<string, Stage>()
for (const s of stages) stageById.set(s.id, s)

/** stageId から Stage を引く。 */
export function getStage(stageId: string): Stage | undefined {
  return stageById.get(stageId)
}

/** 難易度（= ステージ番号）ごとの単語配列。 */
export const wordsByStage: Record<number, Array<Word>> = {}
for (const w of allWords) {
  ;(wordsByStage[w.difficulty] ??= []).push(w)
}
for (const arr of Object.values(wordsByStage)) {
  arr.sort((a, b) => a.english.localeCompare(b.english))
}

/** ステージに属する単語を返す。stage.stage === word.difficulty で突合。 */
export function getStageWords(stage: Stage): Array<Word> {
  return wordsByStage[stage.stage] ?? []
}

/** テーマIDごとの単語配列。 */
export const wordsByTheme: Record<string, Array<Word>> = {}
for (const w of allWords) {
  for (const t of w.themes) {
    ;(wordsByTheme[t] ??= []).push(w)
  }
}

export type { Word, Stage, Theme } from './types'
export { WordSchema, StageSchema, ThemeSchema } from './types'
