// --- 単語 ---
export type Word = {
  word: string
  meaning: string
}

// --- ステージ ---
export type GameMode = 'quiz' | 'pair' | 'memory' | 'slow'

export type StageWords = {
  common: string[]
  quiz: string[]
  pair: string[]
  memory: string[]
  slow: string[]
}

export type Stage = {
  id: string
  name: string
  description: string
  words: StageWords
}

// --- ロボット ---
export type Robot = {
  id: string
  name: string
  description: string
}

// --- アイテム ---
export type ItemSlot = 'head' | 'body' | 'arm' | 'back' | 'effect'

export type Item = {
  id: string
  name: string
  slot: ItemSlot
  price: number
  description: string
}

// --- アバター成長段階 ---
export type AvatarLevel = 1 | 2 | 3 | 4 | 5

export const SLOT_UNLOCK_ORDER: ItemSlot[] = [
  'head',
  'body',
  'arm',
  'back',
  'effect',
]

export function getUnlockedSlots(level: AvatarLevel): ItemSlot[] {
  return SLOT_UNLOCK_ORDER.slice(0, level)
}

export function getAvatarLevel(clearedStages: number): AvatarLevel {
  if (clearedStages >= 8) return 5
  if (clearedStages >= 6) return 4
  if (clearedStages >= 4) return 3
  if (clearedStages >= 2) return 2
  return 1
}

// --- セーブデータ ---
export type WordRecord = {
  correctCount: number
  incorrectCount: number
  lastStudied: string
}

export type MasteryLevel =
  | 'unknown'
  | 'beginner'
  | 'understood'
  | 'learned'
  | 'master'

export function getMasteryLevel(correctCount: number): MasteryLevel {
  if (correctCount >= 10) return 'master'
  if (correctCount >= 6) return 'learned'
  if (correctCount >= 3) return 'understood'
  if (correctCount >= 1) return 'beginner'
  return 'unknown'
}

export const MASTERY_LABELS: Record<MasteryLevel, string> = {
  unknown: '未学習',
  beginner: '見習い',
  understood: '理解',
  learned: '習得',
  master: 'マスター',
}

export type SaveData = {
  player: {
    currentPoints: number
    robotId: string
    equippedItems: Partial<Record<ItemSlot, string>>
    ownedItems: string[]
  }
  wordHistory: Record<string, WordRecord>
  stageClears: Record<string, boolean>
}
