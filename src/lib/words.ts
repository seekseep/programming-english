import allWords from '../../data/words/all.json'
import cssWords from '../../data/words/css.json'
import htmlWords from '../../data/words/html.json'
import javaWords from '../../data/words/java.json'
import javascriptWords from '../../data/words/javascript.json'
import namingWords from '../../data/words/naming.json'
import sqlWords from '../../data/words/sql.json'
import vbWords from '../../data/words/vb.json'

export type WordEntry = {
  word: string
  meaning: string
  description: string
}

export type WordCategory = 'javascript' | 'html' | 'css' | 'sql' | 'java' | 'vb' | 'naming'

export const wordCategoryMeta: Record<
  WordCategory,
  { label: string; description: string; color: string }
> = {
  javascript: {
    label: 'JavaScript / TypeScript',
    description: 'DOM 操作、イベント、非同期処理、型表現でよく見る語',
    color: 'var(--word-javascript)',
  },
  html: {
    label: 'HTML',
    description: '要素名、属性名、フォーム入力、メタ情報に出る語',
    color: 'var(--word-html)',
  },
  css: {
    label: 'CSS',
    description: 'レイアウト、装飾、状態、アニメーションに出る語',
    color: 'var(--word-css)',
  },
  sql: {
    label: 'SQL',
    description: '問い合わせ、結合、集約、テーブル定義で使う語',
    color: 'var(--word-sql)',
  },
  java: {
    label: 'Java',
    description: 'オブジェクト指向、例外処理、設計パターン周辺の語',
    color: 'var(--word-java)',
  },
  vb: {
    label: 'Visual Basic',
    description: 'VB.NET / VBA の制御、Office 操作、型定義で使う語',
    color: 'var(--word-vb)',
  },
  naming: {
    label: 'Naming',
    description: '変数名、関数名、クラス名、状態名で繰り返し使う語',
    color: 'var(--word-naming)',
  },
}

export const wordsByCategory: Record<WordCategory, WordEntry[]> = {
  javascript: javascriptWords,
  html: htmlWords,
  css: cssWords,
  sql: sqlWords,
  java: javaWords,
  vb: vbWords,
  naming: namingWords,
}

export const allWordEntries: WordEntry[] = allWords

export const wordCategories = Object.keys(wordsByCategory) as WordCategory[]

export function getWordCounts() {
  return wordCategories.map((category) => ({
    category,
    count: wordsByCategory[category].length,
  }))
}
