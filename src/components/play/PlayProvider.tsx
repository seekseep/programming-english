import {
  createContext,
  useContext,
  useReducer,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useSave } from '#/context/SaveDataContext'
import { allWords } from '#/data'
import type { PlayContextValue } from './types'
import { reducer, buildInitialState, getChoices } from './reducer'

const PlayContext = createContext<PlayContextValue | null>(null)

export function usePlay() {
  const ctx = useContext(PlayContext)
  if (!ctx) throw new Error('usePlay must be used within PlayProvider')
  return ctx
}

type Props = {
  stageId: string
  children: ReactNode
}

export function PlayProvider({ stageId, children }: Props) {
  const navigate = useNavigate()
  const { recordWord, addPoints, clearStage } = useSave()

  const [state, dispatch] = useReducer(reducer, stageId, buildInitialState)

  // 副作用専用の ref（レンダーに影響しない）
  const correctRef = useRef<Array<string>>([])
  const incorrectRef = useRef<Array<string>>([])
  const startTime = useRef(Date.now())

  // 初回アニメーション
  useEffect(() => {
    requestAnimationFrame(() =>
      dispatch({ type: 'SET_PHASE', phase: 'visible' }),
    )
  }, [])

  // ブラウザバック・リロード時の確認
  useEffect(() => {
    if (state.step === 'result') return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [state.step])

  const currentWord = state.queue[state.currentIndex] ?? null
  const progress = Math.round(
    (correctRef.current.length / Math.max(state.words.length, 1)) * 100,
  )

  const selectAnswer = useCallback(
    (japanese: string) => {
      if (state.selected || !currentWord) return

      const isCorrect = japanese === currentWord.japanese
      if (isCorrect) {
        correctRef.current.push(currentWord.english)
      } else {
        incorrectRef.current.push(currentWord.english)
      }

      dispatch({
        type: 'SELECT_ANSWER',
        japanese,
        isCorrect,
        word: currentWord,
      })
      setTimeout(() => dispatch({ type: 'SHOW_RESULT_DRAWER' }), 600)
    },
    [state.selected, currentWord],
  )

  const finishGame = useCallback(() => {
    const correctWords = [...new Set(correctRef.current)]
    const incorrectWords = [...new Set(incorrectRef.current)]

    for (const w of correctWords) recordWord(w, true)
    for (const w of incorrectWords) recordWord(w, false)

    const correctRate = correctWords.length / 10
    const basePoints = Math.round(correctRate * 100)
    const totalTime = Date.now() - startTime.current
    const speedBonus = Math.max(0, Math.round(50 - totalTime / 1000))
    addPoints(basePoints + Math.max(0, speedBonus))

    if (correctRate >= 0.8) clearStage(stageId)

    dispatch({ type: 'FINISH' })
  }, [recordWord, addPoints, clearStage, stageId])

  const nextQuestion = useCallback(() => {
    const nextIndex = state.currentIndex + 1
    if (nextIndex >= state.queue.length) {
      finishGame()
      return
    }

    const nextWord = state.queue[nextIndex]
    dispatch({
      type: 'GO_NEXT',
      nextIndex,
      nextChoices: getChoices(nextWord, allWords),
    })
    setTimeout(() => {
      requestAnimationFrame(() =>
        dispatch({ type: 'SET_PHASE', phase: 'visible' }),
      )
    }, 300)
  }, [state.currentIndex, state.queue, finishGame])

  const requestExit = useCallback(() => dispatch({ type: 'REQUEST_EXIT' }), [])
  const cancelExit = useCallback(() => dispatch({ type: 'CANCEL_EXIT' }), [])
  const confirmExit = useCallback(() => navigate({ to: '/' }), [navigate])

  const value: PlayContextValue = {
    step: state.step,
    words: state.words,
    currentWord,
    choices: state.choices,
    selected: state.selected,
    feedback: state.feedback,
    showResultDrawer: state.showResultDrawer,
    lastIsCorrect: state.lastIsCorrect,
    phase: state.phase,
    progress,
    showExitDialog: state.showExitDialog,
    selectAnswer,
    nextQuestion,
    requestExit,
    cancelExit,
    confirmExit,
  }

  return <PlayContext.Provider value={value}>{children}</PlayContext.Provider>
}
