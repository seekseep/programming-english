import type { Word, Stage, Robot } from '#/types'

import allWordsJson from '../data/words/all.json'
import stagesJson from '../data/stages/stages.json'
import robotsJson from '../data/robots/robots.json'

export const allWords: Word[] = allWordsJson
export const stages: Stage[] = stagesJson as Stage[]
export const robots: Robot[] = robotsJson

const wordMap = new Map<string, Word>()
for (const w of allWords) {
  wordMap.set(w.word.toLowerCase(), w)
}

export function getWord(word: string): Word | undefined {
  return wordMap.get(word.toLowerCase())
}

export function getStageWords(stage: Stage): Word[] {
  return stage.words
    .map((w) => getWord(w))
    .filter((w): w is Word => w !== undefined)
}

