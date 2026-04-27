import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Word } from '#/types'
import { CodeBlock } from '#/components/CodeBlock'
import { Button } from '#/components/ui/button'
import {
  LANGUAGES,
  useLanguagePreference,
} from '#/context/LanguagePreferenceContext'
import { selectExample } from '#/lib/selectExample'
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
  const { enabledLanguages } = useLanguagePreference()
  const defaultExample = selectExample(
    word.example_programming,
    enabledLanguages,
  )
  const [activeLanguage, setActiveLanguage] = useState(
    defaultExample.language,
  )

  const availableLanguages = LANGUAGES.filter((lang) =>
    word.example_programming.some(
      (e) => e.language.toLowerCase() === lang.value.toLowerCase(),
    ),
  )

  const activeExample =
    word.example_programming.find(
      (e) => e.language.toLowerCase() === activeLanguage.toLowerCase(),
    ) ?? defaultExample

  return (
    <Drawer open onOpenChange={() => onNext()}>
      <DrawerContent className="bg-white data-[vaul-drawer-direction=bottom]:border-t-0 [&>div:first-child]:hidden">
        <div className="max-w-xl w-full mx-auto flex flex-col overflow-hidden">
          {/* 正解・不正解ヘッダー */}
          <DrawerHeader
            className={`m-2 rounded-xl ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
          >
            <DrawerTitle
              className={`text-lg font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}
            >
              {isCorrect ? '正解！' : '不正解…'}
            </DrawerTitle>
          </DrawerHeader>

          <div className="py-4 px-2 flex flex-col gap-4 overflow-y-auto min-h-0">
            {/* 正解の単語 */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">正解</p>
              <p className="text-2xl font-black">
                {word.english}{' '}
                <span className="text-base font-normal text-muted-foreground">
                  {word.japanese}
                </span>
              </p>
            </div>

            {/* 説明 */}
            <div className="border-t border-(--line) pt-3">
              <p className="text-sm text-muted-foreground mb-1">説明</p>
              <p className="text-base">{word.description}</p>
            </div>

            {/* 自然文の例 */}
            <div className="border-t border-(--line) pt-3">
              <p className="text-sm text-muted-foreground mb-1">例文</p>
              <p className="text-base">{word.example_natural.english}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {word.example_natural.japanese}
              </p>
            </div>

            {/* プログラミング例トグル */}
            <div className="border-t border-(--line) pt-3">
              <button
                type="button"
                onClick={() => setShowCode((v) => !v)}
                className="cursor-pointer flex items-center gap-2 text-sm font-medium text-accent"
              >
                {showCode ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                プログラミングの例を見る
              </button>
              {showCode && (
                <div className="mt-3">
                  {availableLanguages.length > 1 && (
                    <div className="flex gap-1 mb-2 flex-wrap">
                      {availableLanguages.map((lang) => (
                        <button
                          key={lang.value}
                          type="button"
                          onClick={() => setActiveLanguage(lang.value)}
                          className={`cursor-pointer px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                            activeLanguage.toLowerCase() ===
                            lang.value.toLowerCase()
                              ? 'bg-accent text-white border-accent'
                              : 'bg-white text-muted-foreground border-(--line) hover:border-accent hover:text-accent'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <CodeBlock
                    code={activeExample.body}
                    language={activeExample.language}
                  />
                </div>
              )}
            </div>
          </div>

          <DrawerFooter className="shrink-0">
            <Button
              onClick={onNext}
              size="lg"
              className="w-full p-2 rounded-xl font-bold text-base"
            >
              次へ
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
