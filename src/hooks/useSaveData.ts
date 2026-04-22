import { useState, useCallback, useEffect } from 'react'
import type { SaveData, ItemSlot, WordRecord } from '#/types'
import { getAvatarLevel } from '#/types'

const STORAGE_KEY = 'programming-english-save'

function getDefaultSaveData(): SaveData {
  return {
    player: {
      currentPoints: 0,
      robotId: 'robo-alpha',
      equippedItems: {},
      ownedItems: [],
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

  const buyItem = useCallback(
    (itemId: string, price: number): boolean => {
      let success = false
      update((prev) => {
        if (prev.player.currentPoints < price) return prev
        if (prev.player.ownedItems.includes(itemId)) return prev
        success = true
        return {
          ...prev,
          player: {
            ...prev.player,
            currentPoints: prev.player.currentPoints - price,
            ownedItems: [...prev.player.ownedItems, itemId],
          },
        }
      })
      return success
    },
    [update],
  )

  const equipItem = useCallback(
    (slot: ItemSlot, itemId: string) => {
      update((prev) => ({
        ...prev,
        player: {
          ...prev.player,
          equippedItems: {
            ...prev.player.equippedItems,
            [slot]: itemId,
          },
        },
      }))
    },
    [update],
  )

  const unequipItem = useCallback(
    (slot: ItemSlot) => {
      update((prev) => {
        const next = { ...prev.player.equippedItems }
        delete next[slot]
        return {
          ...prev,
          player: {
            ...prev.player,
            equippedItems: next,
          },
        }
      })
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
  const avatarLevel = getAvatarLevel(clearedStageCount)

  return {
    data,
    avatarLevel,
    clearedStageCount,
    addPoints,
    recordWord,
    clearStage,
    buyItem,
    equipItem,
    unequipItem,
    selectRobot,
  }
}
