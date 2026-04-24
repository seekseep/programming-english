import type { Word } from '#/types'

export type PlayState = {
  step: 'question' | 'result'
  words: Word[]
  queue: Word[]
  currentIndex: number
  selected: string | null
  feedback: 'correct' | 'incorrect' | null
  showResultDrawer: boolean
  lastIsCorrect: boolean
  choices: Word[]
  phase: 'entering' | 'visible' | 'leaving'
  showExitDialog: boolean
}

export type PlayAction =
  | { type: 'SELECT_ANSWER'; japanese: string; isCorrect: boolean; word: Word }
  | { type: 'SHOW_RESULT_DRAWER' }
  | { type: 'GO_NEXT'; nextIndex: number; nextChoices: Word[] }
  | { type: 'FINISH' }
  | { type: 'SET_PHASE'; phase: PlayState['phase'] }
  | { type: 'REQUEST_EXIT' }
  | { type: 'CANCEL_EXIT' }

export type PlayContextValue = {
  step: PlayState['step']
  words: Word[]
  currentWord: Word | null
  choices: Word[]
  selected: string | null
  feedback: PlayState['feedback']
  showResultDrawer: boolean
  lastIsCorrect: boolean
  phase: PlayState['phase']
  progress: number
  showExitDialog: boolean
  selectAnswer: (japanese: string) => void
  nextQuestion: () => void
  requestExit: () => void
  cancelExit: () => void
  confirmExit: () => void
}
