import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { WordDrawer } from '#/components/WordDrawer'
import type { Word } from '#/types'
import { usePlay } from '#/components/play/PlayProvider'

export function ResultStep() {
  const navigate = useNavigate()
  const { words } = usePlay()
  const [drawerWord, setDrawerWord] = useState<Word | null>(null)

  return (
    <main className="min-h-dvh flex flex-col px-4 py-4">
      <div className="max-w-xl w-full mx-auto flex flex-col flex-1">
        <div className="text-center pt-12 pb-8">
          <h1 className="text-4xl font-black mb-2">クリア！</h1>
        </div>

        <div className="flex flex-col gap-2">
          <p className="eyebrow mb-2">学んだ単語</p>
          {words.map((w) => (
            <button
              key={w.english}
              type="button"
              onClick={() => setDrawerWord(w)}
              className="flex items-center justify-between p-3 rounded-xl cursor-pointer text-left bg-(--card-bg)"
            >
              <span className="font-bold">{w.english}</span>
              <span className="text-muted-foreground text-sm">
                {w.japanese}
              </span>
            </button>
          ))}
        </div>

        <div className="py-8 mt-auto">
          <button
            type="button"
            className="ghost-link w-full justify-center"
            onClick={() => navigate({ to: '/' })}
          >
            もどる
          </button>
        </div>
      </div>

      <WordDrawer word={drawerWord} onClose={() => setDrawerWord(null)} />
    </main>
  )
}
