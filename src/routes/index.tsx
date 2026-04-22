import { Link, createFileRoute } from '@tanstack/react-router'
import { useSave } from '#/context/SaveDataContext'
import { stages } from '#/data'
import { allWordEntries } from '#/lib/words'
import { getMasteryLevel, MASTERY_LABELS } from '#/types'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { data, avatarLevel, clearedStageCount } = useSave()

  const studiedWords = Object.keys(data.wordHistory).length
  const masteredWords = Object.values(data.wordHistory).filter(
    (r) => getMasteryLevel(r.correctCount) === 'master',
  ).length

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Programming English Quest</p>
          <h1>英語で覚えるプログラミング</h1>
          <p className="hero-text">
            ステージをクリアしてポイントを稼ぎ、
            ロボットを成長させよう。4つのモードで楽しく英単語を学べます。
          </p>
          <div className="hero-actions">
            <Link to="/stages" className="primary-link">
              ステージを選ぶ →
            </Link>
            <Link to="/words" className="ghost-link">
              単語帳を見る
            </Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card stat-card-accent">
            <strong>{data.player.currentPoints}</strong>
            <span className="stat-label">ポイント</span>
          </div>
          <div className="stat-card">
            <strong>
              {clearedStageCount}/{stages.length}
            </strong>
            <span className="stat-label">ステージクリア</span>
          </div>
        </div>
      </section>

      <section className="category-grid">
        <div className="category-card">
          <div
            className="category-bar"
            style={{ background: 'var(--accent)' }}
          />
          <h2>Lv.{avatarLevel}</h2>
          <p>アバターレベル</p>
        </div>
        <div className="category-card">
          <div
            className="category-bar"
            style={{ background: 'var(--word-javascript)' }}
          />
          <h2>
            {studiedWords}/{allWordEntries.length}
          </h2>
          <p>学習済み単語</p>
        </div>
        <div className="category-card">
          <div
            className="category-bar"
            style={{ background: 'var(--word-css)' }}
          />
          <h2>{masteredWords}</h2>
          <p>{MASTERY_LABELS.master}した単語</p>
        </div>
      </section>
    </main>
  )
}
