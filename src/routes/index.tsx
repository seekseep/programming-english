import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSave } from '#/context/SaveDataContext'
import { stages, getStageWords } from '#/data'
import { getMasteryLevel } from '#/types'
import type { MasteryLevel } from '#/types'
import { FeatureHeader } from '#/components/FeatureHeader'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/')({ component: Home })

const MASTERY_BG_CLASS: Record<MasteryLevel, string> = {
  unknown: '',
  beginner: 'bg-(--mastery-beginner)',
  understood: 'bg-(--mastery-understood)',
  learned: 'bg-(--mastery-learned)',
  master: 'bg-(--mastery-master)',
}

function Home() {
  const { data } = useSave()
  const navigate = useNavigate()

  return (
    <main className="page-shell">
      <FeatureHeader title="ステージ一覧" />

      <section className="category-grid">
        {stages.map((stage, i) => {
          const isCleared = data.stageClears[stage.id]
          const isUnlocked = i === 0 || data.stageClears[stages[i - 1].id]
          const words = getStageWords(stage)

          const masteryCounts: Record<MasteryLevel, number> = {
            unknown: 0,
            beginner: 0,
            understood: 0,
            learned: 0,
            master: 0,
          }
          for (const w of words) {
            const record = data.wordHistory[w.english]
            const mastery = getMasteryLevel(record?.correctCount ?? 0)
            masteryCounts[mastery]++
          }

          const studiedCount = words.length - masteryCounts.unknown

          return (
            <article
              key={stage.id}
              className={`category-card ${isUnlocked ? 'cursor-pointer' : 'opacity-40'}`}
              onClick={() =>
                isUnlocked &&
                navigate({
                  to: '/stages/$stageId/play',
                  params: { stageId: stage.id },
                })
              }
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  Stage {stage.stage}
                  {isCleared && ' ✓'}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {studiedCount}/{words.length} 語学習
                </span>
              </div>
              <strong>{stage.title}</strong>
              {stage.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stage.description}
                </p>
              )}

              {/* 進捗バー */}
              <div className="h-1.5 rounded-full bg-(--line) flex overflow-hidden mt-2">
                {(
                  [
                    'master',
                    'learned',
                    'understood',
                    'beginner',
                  ] as Array<MasteryLevel>
                ).map((level) => {
                  const pct = words.length
                    ? (masteryCounts[level] / words.length) * 100
                    : 0
                  if (pct === 0) return null
                  return (
                    <div
                      key={level}
                      className={cn(
                        'h-full transition-[width] duration-300',
                        MASTERY_BG_CLASS[level],
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  )
                })}
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}
