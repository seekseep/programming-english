// --- 単語 ---
export type Word = {
  word: string
  meaning: string
  description: string
}

// --- ステージ ---
export type Stage = {
  id: string
  name: string
  description: string
  words: string[]
}

// --- ロボット ---
export type Robot = {
  id: string
  name: string
  description: string
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
  }
  wordHistory: Record<string, WordRecord>
  stageClears: Record<string, boolean>
}
