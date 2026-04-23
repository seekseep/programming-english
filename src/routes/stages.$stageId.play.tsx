import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useMemo, useEffect, useCallback } from 'react'
import { useSave } from '#/context/SaveDataContext'
import { stages, getStageWords, allWords } from '#/data'
import { QuizMode } from '#/components/modes/QuizMode'

export const Route = createFileRoute('/stages/$stageId/play')({
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
  const { stageId } = Route.useParams()
  const navigate = useNavigate()
  const { recordWord, addPoints, clearStage } = useSave()
  const [finished, setFinished] = useState(false)
  const [result, setResult] = useState<GameResult | null>(null)
  const [showExitDialog, setShowExitDialog] = useState(false)

  const stage = stages.find((s) => s.id === stageId)

  const words = useMemo(() => {
    if (!stage) return []
    const stageWords = getStageWords(stage)
    return shuffle(stageWords).slice(0, 10)
  }, [stage])

  // ブラウザバック・リロード時の確認
  useEffect(() => {
    if (finished) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [finished])

  const handleExit = useCallback(() => {
    setShowExitDialog(true)
  }, [])

  const confirmExit = useCallback(() => {
    navigate({ to: '/' })
  }, [navigate, stageId])

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
    return (
      <main className="min-h-dvh flex flex-col px-4 py-4">
        <div className="text-center pt-12 pb-8">
          <h1 className="text-4xl font-black mb-2">クリア！</h1>
        </div>

        <div className="flex flex-col gap-2">
          <p className="eyebrow mb-2">学んだ単語</p>
          {words.map((w) => (
            <div
              key={w.word}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.82)' }}
            >
              <span className="font-bold">{w.word}</span>
              <span className="text-(--muted) text-sm">{w.meaning}</span>
            </div>
          ))}
        </div>

        <div className="py-8 mt-auto">
          <button
            type="button"
            className="ghost-link w-full justify-center"
            onClick={() => navigate({ to: '/' })}
          >
            もどる
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="px-4 py-4 min-h-dvh flex flex-col">
      <QuizMode words={words} allWords={allWords} onFinish={handleFinish} onExit={handleExit} />

      {/* 離脱確認ダイアログ */}
      {showExitDialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: 28,
              maxWidth: 320,
              width: '90%',
              textAlign: 'center',
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>プレイを中断しますか？</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: '0 0 20px' }}>
              現在の進捗は保存されません
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="ghost-link"
                onClick={() => setShowExitDialog(false)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                続ける
              </button>
              <button
                type="button"
                className="primary-link"
                onClick={confirmExit}
                style={{ flex: 1, justifyContent: 'center', background: '#e96b4a' }}
              >
                やめる
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
