import type { Word, Stage, Robot, Item } from '#/types'

import allWordsJson from '../data/words/all.json'
import stagesJson from '../data/stages/stages.json'
import robotsJson from '../data/robots/robots.json'
import itemsJson from '../data/items/items.json'

export const allWords: Word[] = allWordsJson
export const stages: Stage[] = stagesJson as Stage[]
export const robots: Robot[] = robotsJson
export const items: Item[] = itemsJson as Item[]

const wordMap = new Map<string, Word>()
for (const w of allWords) {
  wordMap.set(w.word.toLowerCase(), w)
}

export function getWord(word: string): Word | undefined {
  return wordMap.get(word.toLowerCase())
}

export function getStageWords(stage: Stage, mode?: string): Word[] {
  const wordKeys = [
    ...stage.words.common,
    ...(mode ? stage.words[mode as keyof typeof stage.words] ?? [] : []),
  ]
  return wordKeys
    .map((w) => getWord(w))
    .filter((w): w is Word => w !== undefined)
}

export function getAllStageWords(stage: Stage): Word[] {
  const wordKeys = [
    ...stage.words.common,
    ...stage.words.quiz,
    ...stage.words.pair,
    ...stage.words.memory,
    ...stage.words.slow,
  ]
  return wordKeys
    .map((w) => getWord(w))
    .filter((w): w is Word => w !== undefined)
}

export function getItemsBySlot(slot: string): Item[] {
  return items.filter((i) => i.slot === slot)
}
