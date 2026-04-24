import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Word } from '#/types'
import { CodeBlock } from '#/components/CodeBlock'
import { Button } from '#/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from '#/components/ui/drawer'

type Props = {
  word: Word
  isCorrect: boolean
  onNext: () => void
}

export function QuestionResultDrawer({ word, isCorrect, onNext }: Props) {
  const [showCode, setShowCode] = useState(false)

  return (
    <Drawer open onOpenChange={() => onNext()}>
      <DrawerContent className="bg-white data-[vaul-drawer-direction=bottom]:border-t-0 [&>div:first-child]:hidden">
        <div className="max-w-xl w-full mx-auto">
          {/* 正解・不正解ヘッダー */}
          <DrawerHeader
            className={`rounded-t-2xl ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
          >
            <DrawerTitle
              className={`text-lg font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}
            >
              {isCorrect ? '正解！' : '不正解…'}
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-6 py-4 flex flex-col gap-4">
            {/* 正解の単語 */}
            <div>
              <p className="text-sm text-muted mb-1">正解</p>
              <p className="text-2xl font-black">
                {word.english}{' '}
                <span className="text-base font-normal text-muted">
                  {word.japanese}
                </span>
              </p>
            </div>

            {/* 自然文の例 */}
            <div className="border-t border-(--line) pt-3">
              <p className="text-sm text-muted mb-1">例文</p>
              <p className="text-base">{word.example_natural.english}</p>
              <p className="text-sm text-muted mt-1">
                {word.example_natural.japanese}
              </p>
            </div>

            {/* プログラミング例トグル */}
            <div className="border-t border-(--line) pt-3">
              <button
                type="button"
                onClick={() => setShowCode((v) => !v)}
                className="cursor-pointer flex items-center gap-2 text-sm font-medium text-(--accent)"
              >
                {showCode ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
                プログラミングの例を見る
              </button>
              {showCode && (
                <div className="mt-3">
                  <p className="text-xs text-muted mb-2">
                    {word.example_programming.language}
                  </p>
                  <CodeBlock
                    code={word.example_programming.body}
                    language={word.example_programming.language}
                  />
                </div>
              )}
            </div>
          </div>

          <DrawerFooter>
            <Button
              onClick={onNext}
              className="w-full py-3 rounded-xl font-bold text-base"
            >
              次へ
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
