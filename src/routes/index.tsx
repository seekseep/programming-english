import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSave } from '#/context/SaveDataContext'
import { stages, getStageWords } from '#/data'
import { getMasteryLevel  } from '#/types'
import type {MasteryLevel} from '#/types';
import { FeatureHeader } from '#/components/FeatureHeader'

export const Route = createFileRoute('/')({ component: Home })

const MASTERY_COLORS: Record<MasteryLevel, string> = {
  unknown: 'var(--line)',
  beginner: '#f7bd2f',
  understood: '#e96b4a',
  learned: '#2f6fd0',
  master: '#338768',
}

function Home() {
  const { dataWord Book } = useSave()
  const navigate = useNavigate()

  return (
    <main className="page-shell">
      <FeatureHeader
        title="ステージ一覧"　/>

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
            const record = data.wordHistory[w.word]
            const mastery = getMasteryLevel(record?.correctCount ?? 0)
            masteryCounts[mastery]++
          }

          const studiedCount = words.length - masteryCounts.unknown

          return (
            <article
              key={stage.id}
              className={`category-card ${isUnlocked ? 'cursor-pointer' : 'opacity-40'}`}
              onClick={() => isUnlocked && navigate({ to: '/stages/$stageId/play', params: { stageId: stage.id } })}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  Stage {i + 1}
                  {isCleared && ' ✓'}
                </h2>
                <span className="text-xs text-(--muted)">{studiedCount}/{words.length} 語学習</span>
              </div>
              <strong>{stage.name}</strong>

              {/* 進捗バー */}
              <div className="h-1.5 rounded-full bg-(--line) flex overflow-hidden">
                {(['master', 'learned', 'understood', 'beginner'] as MasteryLevel[]).map((level) => {
                  const pct = words.length ? (masteryCounts[level] / words.length) * 100 : 0
                  if (pct === 0) return null
                  return (
                    <div
                      key={level}
                      className="h-full transition-[width] duration-300"
                      style={{ width: `${pct}%`, background: MASTERY_COLORS[level] }}
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
