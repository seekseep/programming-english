import { Link, createFileRoute } from '@tanstack/react-router'
import { useSave } from '#/context/SaveDataContext'
import { getWord } from '#/data'
import type { WordRecord } from '#/types'
import { FeatureHeader } from '#/components/FeatureHeader'
import { Badge } from '#/components/ui/badge'

export const Route = createFileRoute('/words/$word')({
  component: WordDetailPage,
})

function WordDetailPage() {
  const { word: wordParam } = Route.useParams()
  const { data } = useSave()

  const entry = getWord(wordParam)
  if (!entry) return <div className="page-shell">単語が見つかりません</div>

  const record = data.wordHistory[entry.english]
  const correct = record.correctCount >= 1

  return (
    <main className="page-shell">
      <FeatureHeader eyebrow="Word Detail" title={entry.english} />

      <div className="flex flex-col gap-4">
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">正答: </span>
            <strong>{record.correctCount}</strong>
          </div>
          <div>
            <span className="text-muted-foreground">誤答: </span>
            <strong>{record.incorrectCount}</strong>
          </div>
        </div>

        <div className="rounded-2xl border border-(--line) bg-white/80 p-5 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">意味</p>
            <p className="text-lg font-bold">
              {correct ? entry.japanese : '正答すると表示されます'}
            </p>
          </div>

          {correct && entry.description && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">解説</p>
              <p>{entry.description}</p>
            </div>
          )}

          {correct && entry.example_natural.english && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">例文</p>
              <p className="italic">{entry.example_natural.english}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {entry.example_natural.japanese}
              </p>
            </div>
          )}

          {correct && entry.example_programming[0]?.body && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                コード例（{entry.example_programming[0].language}）
              </p>
              <pre className="text-xs bg-(--line) rounded-md p-3 whitespace-pre-wrap overflow-x-auto">
                {entry.example_programming[0].body}
              </pre>
            </div>
          )}

          <div className="flex flex-wrap gap-1 pt-2">
            <Badge variant="outline">難易度 {entry.difficulty}</Badge>
            {entry.themes.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        </div>

        <Link
          to="/words"
          className="block w-full text-center text-sm text-muted-foreground py-3 border border-(--line) rounded-2xl"
        >
          ← 単語一覧に戻る
        </Link>
      </div>
    </main>
  )
}
