import { useState, useRef } from 'react'
import type { Word } from '#/types'
import type { GameResult } from '#/routes/stages.$stageId.$mode'

type Props = {
  words: Word[]
  allWords: Word[]
  onFinish: (result: GameResult) => void
}

type Card = {
  id: string
  wordKey: string
  text: string
  type: 'en' | 'ja'
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function createCards(words: Word[]): Card[] {
  // 5ペア（10枚）で1ラウンド
  const selected = words.slice(0, 5)
  const cards: Card[] = []
  for (const w of selected) {
    cards.push({ id: `en-${w.word}`, wordKey: w.word, text: w.word, type: 'en' })
    cards.push({
      id: `ja-${w.word}`,
      wordKey: w.word,
      text: w.meaning,
      type: 'ja',
    })
  }
  return shuffle(cards)
}

export function MemoryMode({ words, onFinish }: Props) {
  const batchSize = 5
  const [batchIndex, setBatchIndex] = useState(0)
  const batch = words.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize)

  const [cards, setCards] = useState(() => createCards(batch))
  const [flipped, setFlipped] = useState<Set<string>>(new Set())
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<Card[]>([])
  const [locked, setLocked] = useState(false)
  const correctRef = useRef<string[]>([])
  const incorrectRef = useRef<string[]>([])
  const startTime = useRef(Date.now())

  const handleClick = (card: Card) => {
    if (locked || flipped.has(card.id) || matched.has(card.id)) return

    const nextFlipped = new Set(flipped)
    nextFlipped.add(card.id)
    setFlipped(nextFlipped)

    const nextSelected = [...selected, card]
    setSelected(nextSelected)

    if (nextSelected.length === 2) {
      setLocked(true)
      const [a, b] = nextSelected as [Card, Card]

      if (a.wordKey === b.wordKey && a.type !== b.type) {
        correctRef.current.push(a.wordKey)
        const nextMatched = new Set(matched)
        nextMatched.add(a.id)
        nextMatched.add(b.id)
        setMatched(nextMatched)
        setSelected([])
        setLocked(false)

        if (nextMatched.size === cards.length) {
          setTimeout(() => {
            const nextBatch = batchIndex + 1
            if (nextBatch * batchSize >= words.length) {
              onFinish({
                correctWords: [...new Set(correctRef.current)],
                incorrectWords: [...new Set(incorrectRef.current)],
                totalTime: Date.now() - startTime.current,
              })
            } else {
              const nb = words.slice(
                nextBatch * batchSize,
                (nextBatch + 1) * batchSize,
              )
              setBatchIndex(nextBatch)
              setCards(createCards(nb))
              setFlipped(new Set())
              setMatched(new Set())
              setSelected([])
              setLocked(false)
            }
          }, 600)
        }
      } else {
        incorrectRef.current.push(a.wordKey)
        setTimeout(() => {
          setFlipped((prev) => {
            const next = new Set(prev)
            next.delete(a.id)
            next.delete(b.id)
            return next
          })
          setSelected([])
          setLocked(false)
        }, 800)
      }
    }
  }

  const totalPairs = words.length
  const completedPairs =
    batchIndex * batchSize +
    matched.size / 2
  const progress = Math.round((completedPairs / totalPairs) * 100)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <p className="eyebrow" style={{ margin: 0 }}>神経衰弱</p>
        <p className="table-meta" style={{ margin: 0 }}>
          {completedPairs}/{totalPairs} ペア完了 ({progress}%)
        </p>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: 'var(--line)', marginBottom: 20 }}>
        <div style={{ width: `${progress}%`, height: '100%', borderRadius: 999, background: 'var(--accent)', transition: 'width 300ms ease' }} />
      </div>

      <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 16 }}>
        カードをめくってペアを見つけよう
      </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gap: 8,
          }}
        >
          {cards.map((card) => {
            const isFlipped = flipped.has(card.id) || matched.has(card.id)
            const isMatched = matched.has(card.id)
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleClick(card)}
                style={{
                  aspectRatio: '3/4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--line)',
                  borderRadius: 14,
                  background: isMatched
                    ? '#d4edda'
                    : isFlipped
                      ? 'rgba(255,255,255,0.95)'
                      : 'var(--accent)',
                  cursor: isFlipped ? 'default' : 'pointer',
                  fontSize: isFlipped
                    ? card.type === 'en'
                      ? '1rem'
                      : '0.82rem'
                    : '1.5rem',
                  fontWeight: card.type === 'en' ? 700 : 400,
                  color: isFlipped ? 'var(--ink)' : '#fff',
                  padding: 8,
                  wordBreak: 'break-word',
                  transition: 'all 200ms ease',
                  opacity: isMatched ? 0.6 : 1,
                }}
              >
                {isFlipped ? card.text : '?'}
              </button>
            )
          })}
        </div>
    </div>
  )
}
