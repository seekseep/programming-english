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

function getChoices(correct: Word, allWords: Word[]): Word[] {
  const others = allWords.filter((w) => w.word !== correct.word)
  const wrong = shuffle(others).slice(0, 3)
  return shuffle([correct, ...wrong])
}

export function QuizMode({ words, allWords, onFinish }: Props) {
  const [queue, setQueue] = useState(() => [...words])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [choices, setChoices] = useState(() =>
    getChoices(words[0]!, allWords),
  )
  const correctRef = useRef<string[]>([])
  const incorrectRef = useRef<string[]>([])
  const startTime = useRef(Date.now())

  const current = queue[currentIndex]
  if (!current) return null

  const handleSelect = (meaning: string) => {
    if (selected) return
    setSelected(meaning)

    const isCorrect = meaning === current.meaning
    if (isCorrect) {
      correctRef.current.push(current.word)
    } else {
      incorrectRef.current.push(current.word)
      // 間違えた単語は末尾に追加
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
      setChoices(getChoices(nextWord, allWords))
      setSelected(null)
    }, 800)
  }

  const progress = Math.round(
    (correctRef.current.length / words.length) * 100,
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <p className="eyebrow" style={{ margin: 0 }}>4択クイズ</p>
        <p className="table-meta" style={{ margin: 0 }}>
          {correctRef.current.length}/{words.length} 正解 ({progress}%)
        </p>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: 'var(--line)', marginBottom: 24 }}>
        <div style={{ width: `${progress}%`, height: '100%', borderRadius: 999, background: 'var(--accent)', transition: 'width 300ms ease' }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: '0 0 8px' }}>この単語の意味は？</p>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 32px' }}>
          {current.word}
        </h2>

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
