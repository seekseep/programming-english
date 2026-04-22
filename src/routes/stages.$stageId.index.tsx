import { Link, createFileRoute } from '@tanstack/react-router'
import { useSave } from '#/context/SaveDataContext'
import { stages, getAllStageWords } from '#/data'
import { getMasteryLevel, MASTERY_LABELS, type GameMode, type MasteryLevel } from '#/types'

export const Route = createFileRoute('/stages/$stageId/')({
  component: StageDetailPage,
})

const MODE_INFO: Record<GameMode, { label: string; description: string }> = {
  quiz: {
    label: '4択クイズ',
    description: '英単語の意味を4つの選択肢から選ぼう',
  },
  pair: {
    label: 'ペア選び',
    description: '英語と日本語の正しいペアをマッチさせよう',
  },
  memory: {
    label: '神経衰弱',
    description: 'カードをめくって英語と日本語のペアを見つけよう',
  },
  slow: {
    label: 'ゆっくり英語表示',
    description: '1文字ずつ表示される英単語の意味を素早く選ぼう',
  },
}

const ALL_MODES: GameMode[] = ['quiz', 'pair', 'memory', 'slow']

const MASTERY_COLORS: Record<MasteryLevel, string> = {
  unknown: 'var(--line)',
  beginner: '#f7bd2f',
  understood: '#e96b4a',
  learned: '#2f6fd0',
  master: '#338768',
}

function StageDetailPage() {
  const { stageId } = Route.useParams()
  const { data } = useSave()

  const stage = stages.find((s) => s.id === stageId)
  if (!stage) return <div className="page-shell">ステージが見つかりません</div>

  const stageIndex = stages.indexOf(stage)
  const words = getAllStageWords(stage)
  const correctCount = words.filter((w) => {
    const h = data.wordHistory[w.word]
    return h && h.correctCount > 0
  }).length
  const progress = words.length ? Math.round((correctCount / words.length) * 100) : 0

  return (
    <main className="page-shell">
      <section className="hero-panel" style={{ gridTemplateColumns: '1fr' }}>
        <div className="hero-copy">
          <p className="eyebrow">Stage {stageIndex + 1}</p>
          <h1>{stage.name}</h1>
          <p className="hero-text">
            {stage.description} ・ {correctCount}/{words.length} 語正解 ({progress}%)
          </p>
          <div style={{ height: 6, borderRadius: 999, background: 'var(--line)', marginTop: 12 }}>
            <div style={{ width: `${progress}%`, height: '100%', borderRadius: 999, background: progress >= 80 ? '#338768' : 'var(--accent)', transition: 'width 300ms ease' }} />
          </div>
          <div className="hero-actions">
            <Link to="/stages" className="ghost-link">
              ← ステージ一覧
            </Link>
          </div>
        </div>
      </section>

      {/* 単語進捗 */}
      <section style={{ marginTop: 20 }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>単語の進捗</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {words.map((w) => {
            const record = data.wordHistory[w.word]
            const mastery = getMasteryLevel(record?.correctCount ?? 0)
            return (
              <div
                key={w.word}
                title={`${w.word}: ${MASTERY_LABELS[mastery]}${record ? ` (正答${record.correctCount}回)` : ''}`}
                style={{
                  padding: '6px 10px',
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                  background: mastery === 'unknown' ? 'rgba(255,255,255,0.5)' : MASTERY_COLORS[mastery],
                  color: mastery === 'unknown' ? 'var(--muted)' : '#fff',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                {mastery === 'unknown' ? '?' : w.word}
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
          {(['unknown', 'beginner', 'understood', 'learned', 'master'] as MasteryLevel[]).map((level) => (
            <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--muted)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: MASTERY_COLORS[level], border: level === 'unknown' ? '1px solid var(--line)' : 'none' }} />
              {MASTERY_LABELS[level]}
            </div>
          ))}
        </div>
      </section>

      {/* モード選択 */}
      <section className="category-grid">
        {ALL_MODES.map((mode) => {
          const info = MODE_INFO[mode]
          return (
            <article key={mode} className="category-card">
              <div
                className="category-bar"
                style={{ background: 'var(--accent)' }}
              />
              <h2>{info.label}</h2>
              <p>{info.description}</p>
              <Link
                to="/stages/$stageId/$mode"
                params={{ stageId, mode }}
                className="primary-link"
                style={{ marginTop: 8 }}
              >
                プレイする →
              </Link>
            </article>
          )
        })}
      </section>
    </main>
  )
}
