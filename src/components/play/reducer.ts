import type { Word } from '#/types'
import { stages, getStageWords, allWords } from '#/data'
import { shuffle } from '#/lib/shuffle'
import type { PlayState, PlayAction } from './types'

export function getChoices(correct: Word, pool: Array<Word>): Array<Word> {
  const others = pool.filter(
    (w) => w.english !== correct.english && w.japanese !== correct.japanese,
  )
  const wrong = shuffle(others).slice(0, 3)
  return shuffle([correct, ...wrong])
}

export function buildInitialState(stageId: string): PlayState {
  const stage = stages.find((s) => s.id === stageId)
  const words = stage ? shuffle(getStageWords(stage)).slice(0, 10) : []
  return {
    step: 'question',
    words,
    queue: [...words],
    currentIndex: 0,
    selected: null,
    feedback: null,
    showResultDrawer: false,
    lastIsCorrect: false,
    choices: words.length > 0 ? getChoices(words[0], allWords) : [],
    phase: 'entering',
    showExitDialog: false,
  }
}

export function reducer(state: PlayState, action: PlayAction): PlayState {
  switch (action.type) {
    case 'SELECT_ANSWER':
      return {
        ...state,
        selected: action.japanese,
        feedback: action.isCorrect ? 'correct' : 'incorrect',
        lastIsCorrect: action.isCorrect,
        queue: action.isCorrect ? state.queue : [...state.queue, action.word],
      }
    case 'SHOW_RESULT_DRAWER':
      return { ...state, feedback: null, showResultDrawer: true }
    case 'GO_NEXT':
      return {
        ...state,
        showResultDrawer: false,
        currentIndex: action.nextIndex,
        choices: action.nextChoices,
        selected: null,
        phase: 'entering',
      }
    case 'FINISH':
      return { ...state, step: 'result', showResultDrawer: false }
    case 'SET_PHASE':
      return { ...state, phase: action.phase }
    case 'REQUEST_EXIT':
      return { ...state, showExitDialog: true }
    case 'CANCEL_EXIT':
      return { ...state, showExitDialog: false }
  }
}
