import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Word } from '#/types'
import type { GameResult } from '#/routes/stages.$stageId.play'

type Props = {
  words: Word[]
  allWords: Word[]
  onFinish: (result: GameResult) => void
  onExit: () => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getChoices(correct: Word, allWords: Word[]): Word[] {
  const others = allWords.filter((w) => w.word !== correct.word)
  const wrong = shuffle(others).slice(0, 3)
  return shuffle([correct, ...wrong])
}

export function QuizMode({ words, allWords, onFinish, onExit }: Props) {
  const [queue, setQueue] = useState(() => [...words])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [choices, setChoices] = useState(() =>
    getChoices(words[0], allWords),
  )
  // 'entering' = 下から上にフェードイン, 'visible' = 表示中, 'leaving' = その場でフェードアウト
  const [phase, setPhase] = useState<'entering' | 'visible' | 'leaving'>('entering')
  const correctRef = useRef<string[]>([])
  const incorrectRef = useRef<string[]>([])
  const startTime = useRef(Date.now())

  // 初回表示アニメーション
  useEffect(() => {
    requestAnimationFrame(() => setPhase('visible'))
  }, [])

  const current = queue[currentIndex]
  if (!current) return null

  const handleSelect = (meaning: string) => {
    if (selected) return
    setSelected(meaning)

    const isCorrect = meaning === current.meaning
    setFeedback(isCorrect ? 'correct' : 'incorrect')

    if (isCorrect) {
      correctRef.current.push(current.word)
    } else {
      incorrectRef.current.push(current.word)
      setQueue((q) => [...q, current])
    }

    // 500ms後にフェードアウト開始
    setTimeout(() => {
      setPhase('leaving')
    }, 500)

    // 800ms後にフェードアウト完了 → データ差し替え
    setTimeout(() => {
      setFeedback(null)
      const nextIndex = currentIndex + 1
      if (nextIndex >= queue.length + (isCorrect ? 0 : 1)) {
        onFinish({
          correctWords: [...new Set(correctRef.current)],
          incorrectWords: [...new Set(incorrectRef.current)],
          totalTime: Date.now() - startTime.current,
        })
        return
      }

      const nextWord = (isCorrect ? queue : [...queue, current])[nextIndex]
      setCurrentIndex(nextIndex)
      setChoices(getChoices(nextWord, allWords))
      setSelected(null)
      setPhase('entering')

      // 300ms間を置いてからフェードイン
      setTimeout(() => {
        requestAnimationFrame(() => setPhase('visible'))
      }, 300)
    }, 800)
  }

  const progress = Math.round(
    (correctRef.current.length / words.length) * 100,
  )

  return (
    <div className="flex flex-col flex-1">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={onExit} className="cursor-pointer p-1 text-(--muted)">
          <X size={24} />
        </button>
        <div className="flex-1 h-1 rounded-full bg-(--line)">
          <div className="h-full rounded-full bg-(--accent) transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 問題 */}
      <div
        className="flex-1 flex items-center justify-center text-center transition-all duration-300 ease-out"
        style={{
          opacity: phase === 'visible' ? 1 : 0,
          transform: phase === 'entering' ? 'translateY(24px)' : 'translateY(0)',
        }}
      >
        <div>
          <p className="text-sm text-(--muted) mb-2">この単語の意味は？</p>
          <h2 className="text-4xl font-black">{current.word}</h2>
        </div>
      </div>

      {/* 選択肢 */}
      <div className="flex flex-col gap-3 mt-auto">
        {choices.map((choice, i) => {
          let bg = 'rgba(255,255,255,0.82)'
          if (selected) {
            if (choice.meaning === current.meaning) bg = '#d4edda'
            else if (choice.meaning === selected) bg = '#f8d7da'
          }
          return (
            <button
              key={choice.word}
              type="button"
              onClick={() => handleSelect(choice.meaning)}
              disabled={!!selected}
              className="p-4 border border-(--line) rounded-2xl text-base text-left transition-all duration-300 ease-out"
              style={{
                background: bg,
                cursor: selected ? 'default' : 'pointer',
                opacity: phase === 'visible' ? 1 : 0,
                transform: phase === 'entering' ? 'translateY(16px)' : 'translateY(0)',
                transitionDelay: phase === 'visible' ? `${i * 50}ms` : '0ms',
              }}
            >
              {choice.meaning}
            </button>
          )
        })}
      </div>

      {/* 正解/不正解エフェクト */}
      {feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-[feedback_600ms_ease-out_forwards]">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-5xl font-bold ${
              feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {feedback === 'correct' ? '\u25CB' : '\u2717'}
          </div>
        </div>
      )}
    </div>
  )
}
