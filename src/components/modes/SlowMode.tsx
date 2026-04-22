import { useState, useEffect, useRef, useCallback } from 'react'
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

function getChoices(correct: Word, allWords: Word[]): Word[] {
  const others = allWords.filter((w) => w.word !== correct.word)
  const wrong = shuffle(others).slice(0, 3)
  return shuffle([correct, ...wrong])
}

export function SlowMode({ words, allWords, onFinish }: Props) {
  const [queue, setQueue] = useState(() => [...words])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealedCount, setRevealedCount] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [choices, setChoices] = useState(() =>
    getChoices(words[0]!, allWords),
  )
  const correctRef = useRef<string[]>([])
  const incorrectRef = useRef<string[]>([])
  const startTime = useRef(Date.now())

  const current = queue[currentIndex]

  useEffect(() => {
    if (!current || selected) return
    if (revealedCount >= current.word.length) return

    const timer = setTimeout(() => {
      setRevealedCount((c) => c + 1)
    }, 500)
    return () => clearTimeout(timer)
  }, [current, revealedCount, selected])

  const handleSelect = useCallback(
    (meaning: string) => {
      if (selected || !current) return
      setSelected(meaning)

      const isCorrect = meaning === current.meaning
      if (isCorrect) {
        correctRef.current.push(current.word)
      } else {
        incorrectRef.current.push(current.word)
        setQueue((q) => [...q, current])
      }

      setTimeout(() => {
        const nextIndex = currentIndex + 1
        if (nextIndex >= queue.length + (isCorrect ? 0 : 1)) {
          onFinish({
            correctWords: [...new Set(correctRef.current)],
            incorrectWords: [...new Set(incorrectRef.current)],
            totalTime: Date.now() - startTime.current,
          })
          return
        }

        const nextWord = (isCorrect ? queue : [...queue, current])[nextIndex]!
        setCurrentIndex(nextIndex)
        setRevealedCount(0)
        setChoices(getChoices(nextWord, allWords))
        setSelected(null)
      }, 800)
    },
    [selected, current, currentIndex, queue, allWords, onFinish],
  )

  if (!current) return null

  const displayed = current.word.slice(0, revealedCount)
  const hidden = current.word.slice(revealedCount).replace(/./g, '_')
  const progress = Math.round(
    (correctRef.current.length / words.length) * 100,
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <p className="eyebrow" style={{ margin: 0 }}>ゆっくり英語表示</p>
        <p className="table-meta" style={{ margin: 0 }}>
          {correctRef.current.length}/{words.length} 正解 ({progress}%)
        </p>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: 'var(--line)', marginBottom: 24 }}>
        <div style={{ width: `${progress}%`, height: '100%', borderRadius: 999, background: 'var(--accent)', transition: 'width 300ms ease' }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: '0 0 8px' }}>1文字ずつ表示中... 意味がわかったら選ぼう！</p>
        <h2
          style={{
            fontSize: '2.5rem',
            margin: '16px 0 8px',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
          }}
        >
          <span>{displayed}</span>
          <span style={{ opacity: 0.25 }}>{hidden}</span>
        </h2>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--muted)',
            marginBottom: 24,
          }}
        >
          {revealedCount}/{current.word.length} 文字目
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: 12,
          }}
        >
          {choices.map((choice) => {
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
                style={{
                  padding: '16px',
                  border: '1px solid var(--line)',
                  borderRadius: 16,
                  background: bg,
                  cursor: selected ? 'default' : 'pointer',
                  fontSize: '1rem',
                  textAlign: 'left',
                  transition: 'background 200ms ease',
                }}
              >
                {choice.meaning}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
