import { useState, useCallback, useEffect } from 'react'
import type { SaveData, WordRecord } from '#/types'

const STORAGE_KEY = 'programming-english-save'

function getDefaultSaveData(): SaveData {
  return {
    player: {
      currentPoints: 0,
      robotId: 'robo-alpha',
    },
    wordHistory: {},
    stageClears: {},
  }
}

function loadSaveData(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as SaveData
    }
  } catch {
    // ignore
  }
  return getDefaultSaveData()
}

function persistSaveData(data: SaveData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useSaveData() {
  const [data, setData] = useState<SaveData>(getDefaultSaveData)

  useEffect(() => {
    setData(loadSaveData())
  }, [])

  const update = useCallback((updater: (prev: SaveData) => SaveData) => {
    setData((prev) => {
      const next = updater(prev)
      persistSaveData(next)
      return next
    })
  }, [])

  const addPoints = useCallback(
    (points: number) => {
      update((prev) => ({
        ...prev,
        player: {
          ...prev.player,
          currentPoints: prev.player.currentPoints + points,
        },
      }))
    },
    [update],
  )

  const recordWord = useCallback(
    (word: string, correct: boolean) => {
      update((prev) => {
        const existing: WordRecord = prev.wordHistory[word] ?? {
          correctCount: 0,
          incorrectCount: 0,
          lastStudied: '',
        }
        return {
          ...prev,
          wordHistory: {
            ...prev.wordHistory,
            [word]: {
              correctCount: existing.correctCount + (correct ? 1 : 0),
              incorrectCount: existing.incorrectCount + (correct ? 0 : 1),
              lastStudied: new Date().toISOString(),
            },
          },
        }
      })
    },
    [update],
  )

  const clearStage = useCallback(
    (stageId: string) => {
      update((prev) => ({
        ...prev,
        stageClears: {
          ...prev.stageClears,
          [stageId]: true,
        },
      }))
    },
    [update],
  )

  const selectRobot = useCallback(
    (robotId: string) => {
      update((prev) => ({
        ...prev,
        player: {
          ...prev.player,
          robotId,
        },
      }))
    },
    [update],
  )

  const clearedStageCount = Object.values(data.stageClears).filter(
    Boolean,
  ).length

  return {
    data,
    clearedStageCount,
    addPoints,
    recordWord,
    clearStage,
    selectRobot,
  }
}
