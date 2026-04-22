import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  allWordEntries,
  getWordCounts,
  wordCategories,
  wordCategoryMeta,
  wordsByCategory,
} from '#/lib/words'
import type { WordCategory } from '#/lib/words'

export const Route = createFileRoute('/words')({
  component: WordsPage,
})

function WordsPage() {
  const [activeCategory, setActiveCategory] = useState<WordCategory | 'all'>('all')
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim().toLowerCase()
  const baseWords =
    activeCategory === 'all' ? allWordEntries : wordsByCategory[activeCategory]
  const visibleWords = normalizedQuery
    ? baseWords.filter(
        ({ word, meaning }) =>
          word.toLowerCase().includes(normalizedQuery) || meaning.includes(query.trim())
      )
    : baseWords

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Word Book</p>
          <h1>プログラミング英単語帳</h1>
          <p className="hero-text">
            生成した単語データをカテゴリ別に確認できます。英単語または日本語訳で絞り込みできます。
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat-card stat-card-accent">
            <span className="stat-label">総単語数</span>
            <strong>{allWordEntries.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">カテゴリ数</span>
            <strong>{wordCategories.length}</strong>
          </div>
        </div>
      </section>

      <section className="toolbar-panel">
        <div className="toolbar-row">
          <Link className="ghost-link" to="/">
            ← ホームへ戻る
          </Link>
          <label className="search-field">
            <span>検索</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="例: render / 描画"
            />
          </label>
        </div>
        <div className="chip-row" role="tablist" aria-label="単語カテゴリ">
          <button
            type="button"
            className={activeCategory === 'all' ? 'chip chip-active' : 'chip'}
            onClick={() => setActiveCategory('all')}
          >
            すべて
            <span>{allWordEntries.length}</span>
          </button>
          {getWordCounts().map(({ category, count }) => (
            <button
              key={category}
              type="button"
              className={activeCategory === category ? 'chip chip-active' : 'chip'}
              onClick={() => setActiveCategory(category)}
              style={{ '--chip-accent': wordCategoryMeta[category].color } as React.CSSProperties}
            >
              {wordCategoryMeta[category].label}
              <span>{count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="category-grid">
        {wordCategories.map((category) => (
          <article key={category} className="category-card">
            <div
              className="category-bar"
              style={{ backgroundColor: wordCategoryMeta[category].color }}
            />
            <h2>{wordCategoryMeta[category].label}</h2>
            <p>{wordCategoryMeta[category].description}</p>
            <strong>{wordsByCategory[category].length} words</strong>
          </article>
        ))}
      </section>

      <section className="table-panel">
        <div className="table-header">
          <div>
            <p className="eyebrow">Entries</p>
            <h2>
              {activeCategory === 'all' ? '全カテゴリ' : wordCategoryMeta[activeCategory].label}
            </h2>
          </div>
          <p className="table-meta">{visibleWords.length} 件表示</p>
        </div>

        <div className="word-table">
          <div className="word-table-head">
            <span>Word</span>
            <span>Meaning</span>
          </div>
          {visibleWords.map(({ word, meaning }) => (
            <div key={word} className="word-table-row">
              <span className="word-token">{word}</span>
              <span>{meaning}</span>
            </div>
          ))}
          {visibleWords.length === 0 ? (
            <div className="empty-state">一致する単語はありません。</div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
