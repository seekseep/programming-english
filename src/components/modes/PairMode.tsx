import { useState, useRef } from 'react'
import type { Word } from '#/types'
import type { GameResult } from '#/routes/stages.$stageId.$mode'

type Props = {
  words: Word[]
  allWords: Word[]
  onFinish: (result: GameResult) => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

export function PairMode({ words, onFinish }: Props) {
  // 5単語ずつのバッチで出題
  const batchSize = 5
  const [batchIndex, setBatchIndex] = useState(0)
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrong, setWrong] = useState(false)
  const correctRef = useRef<string[]>([])
  const incorrectRef = useRef<string[]>([])
  const startTime = useRef(Date.now())

  const batch = words.slice(
    batchIndex * batchSize,
    (batchIndex + 1) * batchSize,
  )
  const [shuffledLeft] = useState(() =>
    Array.from({ length: Math.ceil(words.length / batchSize) }, (_, i) =>
      shuffle(words.slice(i * batchSize, (i + 1) * batchSize)),
    ),
  )
  const [shuffledRight] = useState(() =>
    Array.from({ length: Math.ceil(words.length / batchSize) }, (_, i) =>
      shuffle(words.slice(i * batchSize, (i + 1) * batchSize)),
    ),
  )

  const leftWords = shuffledLeft[batchIndex] ?? []
  const rightWords = shuffledRight[batchIndex] ?? []

  const handlePair = (left: string, right: string) => {
    const leftWord = batch.find((w) => w.word === left)
    if (leftWord && leftWord.meaning === right) {
      correctRef.current.push(left)
      const next = new Set(matched)
      next.add(left)
      setMatched(next)
      setSelectedLeft(null)
      setSelectedRight(null)

      if (next.size === batch.length) {
        // バッチ完了
        setTimeout(() => {
          const nextBatch = batchIndex + 1
          if (nextBatch * batchSize >= words.length) {
            onFinish({
              correctWords: [...new Set(correctRef.current)],
              incorrectWords: [...new Set(incorrectRef.current)],
              totalTime: Date.now() - startTime.current,
            })
          } else {
            setBatchIndex(nextBatch)
            setMatched(new Set())
          }
        }, 500)
      }
    } else {
      if (leftWord) incorrectRef.current.push(left)
      setWrong(true)
      setTimeout(() => {
        setSelectedLeft(null)
        setSelectedRight(null)
        setWrong(false)
      }, 600)
    }
  }

  const handleLeftClick = (word: string) => {
    if (matched.has(word)) return
    setSelectedLeft(word)
    if (selectedRight) handlePair(word, selectedRight)
  }

  const handleRightClick = (meaning: string) => {
    setSelectedRight(meaning)
    if (selectedLeft) handlePair(selectedLeft, meaning)
  }

  const progress = Math.round(
    ((batchIndex * batchSize + matched.size) / words.length) * 100,
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <p className="eyebrow" style={{ margin: 0 }}>ペア選び</p>
        <p className="table-meta" style={{ margin: 0 }}>
          {batchIndex * batchSize + matched.size}/{words.length} ペア完了 ({progress}%)
        </p>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: 'var(--line)', marginBottom: 20 }}>
        <div style={{ width: `${progress}%`, height: '100%', borderRadius: 999, background: 'var(--accent)', transition: 'width 300ms ease' }} />
      </div>

      <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 16 }}>
        英語と日本語の正しいペアを選ぼう
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 16 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          {leftWords.map((w) => (
            <button
              key={w.word}
              type="button"
              onClick={() => handleLeftClick(w.word)}
              disabled={matched.has(w.word)}
              style={{
                padding: '14px 16px',
                border: '1px solid var(--line)',
                borderRadius: 14,
                background: matched.has(w.word)
                  ? '#d4edda'
                  : selectedLeft === w.word
                    ? wrong
                      ? '#f8d7da'
                      : 'var(--accent-soft)'
                    : 'rgba(255,255,255,0.82)',
                cursor: matched.has(w.word) ? 'default' : 'pointer',
                fontWeight: 700,
                fontSize: '1.05rem',
                textAlign: 'center',
                opacity: matched.has(w.word) ? 0.5 : 1,
                transition: 'all 200ms ease',
              }}
            >
              {w.word}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {rightWords.map((w) => {
            const isMatched = matched.has(w.word)
            return (
              <button
                key={w.word}
                type="button"
                onClick={() => handleRightClick(w.meaning)}
                disabled={isMatched}
                style={{
                  padding: '14px 16px',
                  border: '1px solid var(--line)',
                  borderRadius: 14,
                  background: isMatched
                    ? '#d4edda'
                    : selectedRight === w.meaning
                      ? wrong
                        ? '#f8d7da'
                        : 'var(--accent-soft)'
                      : 'rgba(255,255,255,0.82)',
                  cursor: isMatched ? 'default' : 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'center',
                  opacity: isMatched ? 0.5 : 1,
                  transition: 'all 200ms ease',
                }}
              >
                {w.meaning}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
