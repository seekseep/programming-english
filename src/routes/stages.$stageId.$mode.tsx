import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useSave } from '#/context/SaveDataContext'
import { stages, getStageWords, allWords } from '#/data'
import { QuizMode } from '#/components/modes/QuizMode'
import { PairMode } from '#/components/modes/PairMode'
import { MemoryMode } from '#/components/modes/MemoryMode'
import { SlowMode } from '#/components/modes/SlowMode'

export const Route = createFileRoute('/stages/$stageId/$mode')({
  component: PlayModePage,
})

export type GameResult = {
  correctWords: string[]
  incorrectWords: string[]
  totalTime: number
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function PlayModePage() {
  const { stageId, mode } = Route.useParams()
  const navigate = useNavigate()
  const { recordWord, addPoints, clearStage } = useSave()
  const [finished, setFinished] = useState(false)
  const [result, setResult] = useState<GameResult | null>(null)

  const stage = stages.find((s) => s.id === stageId)

  const words = useMemo(() => {
    if (!stage) return []
    const stageWords = getStageWords(stage, mode)
    return shuffle(stageWords).slice(0, 10)
  }, [stage, mode])

  if (!stage) return <div className="page-shell">ステージが見つかりません</div>

  const handleFinish = (res: GameResult) => {
    for (const w of res.correctWords) {
      recordWord(w, true)
    }
    for (const w of res.incorrectWords) {
      recordWord(w, false)
    }

    const correctRate = res.correctWords.length / 10
    const basePoints = Math.round(correctRate * 100)
    const speedBonus = Math.max(0, Math.round(50 - res.totalTime / 1000))
    const totalPoints = basePoints + Math.max(0, speedBonus)
    addPoints(totalPoints)

    if (correctRate >= 0.8) {
      clearStage(stageId)
    }

    setResult({ ...res })
    setFinished(true)
  }

  if (finished && result) {
    const correctRate = Math.round(
      (result.correctWords.length / 10) * 100,
    )
    const passed = correctRate >= 80

    return (
      <main className="page-shell">
        <section className="hero-panel" style={{ gridTemplateColumns: '1fr' }}>
          <div className="hero-copy" style={{ textAlign: 'center' }}>
            <p className="eyebrow">Result</p>
            <h1>{passed ? 'クリア！' : 'もう少し！'}</h1>
            <p className="hero-text">
              正解率: {correctRate}%（{result.correctWords.length}/10）
            </p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="primary-link"
                onClick={() => {
                  setFinished(false)
                  setResult(null)
                }}
              >
                もう一度プレイ
              </button>
              <button
                type="button"
                className="ghost-link"
                onClick={() =>
                  navigate({
                    to: '/stages/$stageId',
                    params: { stageId },
                  })
                }
              >
                モード選択に戻る
              </button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const modeProps = { words, allWords, onFinish: handleFinish }

  return (
    <main className="page-shell">
      {mode === 'quiz' && <QuizMode {...modeProps} />}
      {mode === 'pair' && <PairMode {...modeProps} />}
      {mode === 'memory' && <MemoryMode {...modeProps} />}
      {mode === 'slow' && <SlowMode {...modeProps} />}
    </main>
  )
}
