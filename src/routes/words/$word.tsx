import { Link, createFileRoute } from '@tanstack/react-router'
import { useSave } from '#/context/SaveDataContext'
import { allWordEntries } from '#/lib/words'
import { FeatureHeader } from '#/components/FeatureHeader'

export const Route = createFileRoute('/words/$word')({
  component: WordDetailPage,
})

function WordDetailPage() {
  const { word: wordParam } = Route.useParams()
  const { data } = useSave()

  const entry = allWordEntries.find((e) => e.word === wordParam)
  if (!entry) return <div className="page-shell">単語が見つかりません</div>

  const record: WordRecord | null = data.wordHistory[entry.word] ?? null
  const correct = record != null && record.correctCount >= 1

  return (
    <main className="page-shell">
      <FeatureHeader eyebrow="Word Detail" title={entry.word} />

      <div className="flex flex-col gap-4">
        {record != null && (
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-(--muted)">正答: </span>
              <strong>{record.correctCount}</strong>
            </div>
            <div>
              <span className="text-(--muted)">誤答: </span>
              <strong>{record.incorrectCount}</strong>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-(--line) bg-white/80 p-5">
          <p className="text-sm text-(--muted) mb-1">意味</p>
          <p className="text-lg font-bold">
            {correct ? entry.meaning : '正答すると表示されます'}
          </p>
          {correct && entry.description && (
            <>
              <p className="text-sm text-(--muted) mt-4 mb-1">解説</p>
              <p>{entry.description}</p>
            </>
          )}
        </div>

        <Link to="/words" className="block w-full text-center text-sm text-(--muted) py-3 border border-(--line) rounded-2xl">
          ← 単語一覧に戻る
        </Link>
      </div>
    </main>
  )
}
