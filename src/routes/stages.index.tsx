import { Link, createFileRoute } from '@tanstack/react-router'
import { useSave } from '#/context/SaveDataContext'
import { stages } from '#/data'
import { getAllStageWords } from '#/data'

export const Route = createFileRoute('/stages/')({ component: StagesPage })

function StagesPage() {
  const { data, clearedStageCount } = useSave()

  return (
    <main className="page-shell">
      <section className="hero-panel" style={{ gridTemplateColumns: '1fr' }}>
        <div className="hero-copy">
          <p className="eyebrow">Stages</p>
          <h1>ステージ一覧</h1>
          <p className="hero-text">
            各ステージの4つのモードをすべてクリアして次のステージに進もう。
            クリア済み: {clearedStageCount}/{stages.length}
          </p>
        </div>
      </section>

      <section className="category-grid">
        {stages.map((stage, i) => {
          const isCleared = data.stageClears[stage.id]
          const isUnlocked = i === 0 || data.stageClears[stages[i - 1]!.id]
          const words = getAllStageWords(stage)
          const studiedCount = words.filter(
            (w) => data.wordHistory[w.word],
          ).length
          const correctCount = words.filter((w) => {
            const h = data.wordHistory[w.word]
            return h && h.correctCount > 0
          }).length
          const progress = words.length
            ? Math.round((correctCount / words.length) * 100)
            : 0

          return (
            <article key={stage.id} className="category-card">
              <div
                className="category-bar"
                style={{
                  background: isCleared
                    ? 'var(--word-css)'
                    : isUnlocked
                      ? 'var(--accent)'
                      : 'var(--line)',
                }}
              />
              <h2>
                Stage {i + 1}
                {isCleared && ' ✓'}
              </h2>
              <strong>{stage.name}</strong>
              <p>{stage.description}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                {studiedCount}/{words.length} 語学習済み ・ 正解率 {progress}%
              </p>
              {isUnlocked ? (
                <Link
                  to="/stages/$stageId"
                  params={{ stageId: stage.id }}
                  className="primary-link"
                  style={{ marginTop: 8 }}
                >
                  {isCleared ? 'もう一度プレイ' : 'プレイする'}
                </Link>
              ) : (
                <span
                  className="ghost-link"
                  style={{ marginTop: 8, opacity: 0.5 }}
                >
                  🔒 前のステージをクリアしよう
                </span>
              )}
            </article>
          )
        })}
      </section>
    </main>
  )
}
