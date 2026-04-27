import { useMemo } from 'react'
import { allWords } from '#/data'
import type { SaveData } from '#/types'

export type WordStatus = 'all' | 'correct' | 'encountered' | 'unknown'

export function useFilteredWords(
  wordHistory: SaveData['wordHistory'],
  filter: WordStatus,
) {
  return useMemo(() => {
    const counts: Record<WordStatus, number> = {
      all: 0,
      correct: 0,
      encountered: 0,
      unknown: 0,
    }
    const filtered: typeof allWords = []

    for (const entry of allWords) {
      const record = wordHistory[entry.english]
      const isCorrect = record && record.correctCount >= 1
      const isEncountered = !!record

      counts.all++
      if (isCorrect) counts.correct++
      else if (isEncountered) counts.encountered++
      else counts.unknown++

      if (filter === 'all') filtered.push(entry)
      else if (filter === 'correct' && isCorrect) filtered.push(entry)
      else if (filter === 'encountered' && isEncountered && !isCorrect)
        filtered.push(entry)
      else if (filter === 'unknown' && !isEncountered) filtered.push(entry)
    }

    return { filtered, counts }
  }, [wordHistory, filter])
}
