import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useSave } from '#/context/SaveDataContext'
import { FeatureHeader } from '#/components/FeatureHeader'
import { allWordEntries } from '#/lib/words'

export const Route = createFileRoute('/words/')({
  component: WordsPage,
})

type WordStatus = 'all' | 'correct' | 'encountered' | 'unknown'

const STATUS_LABELS: Record<WordStatus, string> = {
  all: 'すべて',
  correct: '正答済み',
  encountered: '未正答',
  unknown: '未出題',
}

const PER_PAGE = 30

function WordsPage() {
  const { data } = useSave()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<WordStatus>('all')
  const [page, setPage] = useState(0)

  const { filtered, counts } = useMemo(() => {
    const counts: Record<WordStatus, number> = { all: 0, correct: 0, encountered: 0, unknown: 0 }
    const filtered: typeof allWordEntries = []

    for (const entry of allWordEntries) {
      const record = data.wordHistory[entry.word]
      const isCorrect = record && record.correctCount >= 1
      const isEncountered = !!record

      counts.all++
      if (isCorrect) counts.correct++
      else if (isEncountered) counts.encountered++
      else counts.unknown++

      if (filter === 'all') filtered.push(entry)
      else if (filter === 'correct' && isCorrect) filtered.push(entry)
      else if (filter === 'encountered' && isEncountered && !isCorrect) filtered.push(entry)
      else if (filter === 'unknown' && !isEncountered) filtered.push(entry)
    }

    return { filtered, counts }
  }, [data.wordHistory, filter])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const pageWords = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  const handleFilterChange = (status: WordStatus) => {
    setFilter(status)
    setPage(0)
  }

  return (
    <main className="page-shell">
      <FeatureHeader
        title="プログラミング英単語帳" />

      {/* フィルターチップ */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(STATUS_LABELS) as WordStatus[]).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => handleFilterChange(status)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold border transition-colors ${
              filter === status
                ? 'border-(--accent) bg-[rgba(199,91,18,0.12)] text-(--accent)'
                : 'border-(--line) bg-white/80 text-(--muted)'
            }`}
          >
            {STATUS_LABELS[status]}
            <span className="ml-1 text-xs opacity-70">{counts[status]}</span>
          </button>
        ))}
      </div>

      {/* 単語グリッド */}
      <div className="grid grid-cols-3 gap-2">
        {pageWords.map(({ word }) => {
          const record = data.wordHistory[word]
          const encountered = !!record
          const correct = record && record.correctCount >= 1

          return (
            <button
              key={word}
              type="button"
              onClick={() => encountered && navigate({ to: '/words/$word', params: { word } })}
              className={`rounded-xl border p-2 text-center text-sm font-semibold transition-colors ${
                correct
                  ? 'border-(--accent) bg-[rgba(199,91,18,0.06)] cursor-pointer'
                  : encountered
                    ? 'border-(--line) bg-white/80 cursor-pointer'
                    : 'border-(--line) bg-(--line) text-(--muted)'
              }`}
              disabled={!encountered}
            >
              {encountered ? word : '???'}
            </button>
          )
        })}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="rounded-lg border border-(--line) px-3 py-1.5 text-sm font-semibold disabled:opacity-30"
          >
            ←
          </button>
          <span className="text-sm text-(--muted)">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="rounded-lg border border-(--line) px-3 py-1.5 text-sm font-semibold disabled:opacity-30"
          >
            →
          </button>
        </div>
      )}
    </main>
  )
}
