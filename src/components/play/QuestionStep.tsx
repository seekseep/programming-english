import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Progress } from '#/components/ui/progress'
import { QuestionResultDrawer } from '#/components/play/QuestionResultDrawer'
import { ExitConfirmDialog } from '#/components/play/ExitConfirmDialog'
import { usePlay } from '#/components/play/PlayProvider'
import { CodeBlock } from '#/components/CodeBlock'
import { LanguageSwitcher } from '#/components/play/LanguageSwitcher'
import { useLanguagePreference } from '#/context/LanguagePreferenceContext'
import { selectExample } from '#/lib/selectExample'
import { getDisplayMode } from '#/lib/getDisplayMode'
import { cn } from '#/lib/utils'

export function QuestionStep() {
  const {
    currentWord,
    choices,
    selected,
    feedback,
    phase,
    progress,
    showResultDrawer,
    lastIsCorrect,
    showExitDialog,
    selectAnswer,
    nextQuestion,
    requestExit,
    cancelExit,
    confirmExit,
  } = usePlay()

  const { enabledLanguages } = useLanguagePreference()

  // 表示中の言語（タブで切り替え可能）
  const defaultLang = currentWord
    ? selectExample(currentWord.example_programming, enabledLanguages).language
    : ''
  const [activeLanguage, setActiveLanguage] = useState(defaultLang)

  // 単語が変わったらリセット
  useEffect(() => {
    if (currentWord) {
      const lang = selectExample(
        currentWord.example_programming,
        enabledLanguages,
      ).language
      setActiveLanguage(lang)
    }
  }, [currentWord, enabledLanguages])

  if (!currentWord) return null

  // activeLanguage に一致する例を取得
  const example =
    currentWord.example_programming.find(
      (e) => e.language === activeLanguage,
    ) ?? selectExample(currentWord.example_programming, enabledLanguages)

  const displayMode = getDisplayMode(currentWord.difficulty)

  return (
    <main className="px-4 py-4 min-h-dvh flex flex-col">
      <div className="flex flex-col flex-1">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-4 max-w-xl w-full mx-auto">
          <button
            type="button"
            onClick={requestExit}
            className="cursor-pointer p-1 text-muted-foreground"
          >
            <X size={24} />
          </button>
          <Progress value={progress} className="flex-1" />
        </div>

        {/* 言語切替 */}
        <div className="flex justify-center mb-4 max-w-xl w-full mx-auto">
          <LanguageSwitcher
            examples={currentWord.example_programming}
            activeLanguage={activeLanguage}
            onLanguageChange={setActiveLanguage}
          />
        </div>

        {/* 問題 */}
        <div
          className={cn(
            'flex-1 flex items-center justify-center transition-all duration-300 ease-out',
            phase === 'visible' ? 'opacity-100 translate-y-0' : 'opacity-0',
            phase === 'entering' && 'translate-y-6',
          )}
        >
          <div className="w-full max-w-xl">
            {displayMode === 'word-focused' ? (
              <>
                <p className="text-sm text-muted-foreground mb-2 text-center">
                  この単語の意味は？
                </p>
                <h2 className="text-4xl font-black text-center mb-4">
                  {currentWord.english}
                </h2>
                <CodeBlock
                  code={example.body}
                  language={example.language}
                  highlightWord={currentWord.english}
                />
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-2 text-center">
                  ハイライトされた単語の意味は？
                </p>
                <CodeBlock
                  code={example.body}
                  language={example.language}
                  highlightWord={currentWord.english}
                />
              </>
            )}
          </div>
        </div>

        {/* 選択肢 */}
        <div className="flex flex-col gap-3 mt-auto max-w-xl w-full mx-auto">
          {choices.map((choice, i) => {
            const isCorrectChoice = choice.japanese === currentWord.japanese
            const isWrongSelected =
              !!selected && choice.japanese === selected && !isCorrectChoice
            return (
              <button
                key={choice.english}
                type="button"
                onClick={() => selectAnswer(choice.japanese)}
                disabled={!!selected}
                className={cn(
                  'p-4 border border-(--line) rounded-2xl text-base text-left transition-all duration-300 ease-out',
                  'disabled:cursor-default',
                  phase === 'visible'
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0',
                  phase === 'entering' && 'translate-y-4',
                  selected && isCorrectChoice
                    ? 'bg-(--answer-correct-bg)'
                    : isWrongSelected
                      ? 'bg-(--answer-incorrect-bg)'
                      : 'bg-(--card-bg)',
                )}
                style={{
                  transitionDelay:
                    phase === 'visible' ? `${i * 50}ms` : undefined,
                }}
              >
                {choice.japanese}
              </button>
            )
          })}
        </div>

        {/* 正解/不正解エフェクト */}
        {feedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-[feedback_600ms_ease-out_forwards]">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-5xl font-bold ${
                feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {feedback === 'correct' ? '\u25CB' : '\u2717'}
            </div>
          </div>
        )}

        {/* 結果ドロワー */}
        {showResultDrawer && (
          <QuestionResultDrawer
            word={currentWord}
            isCorrect={lastIsCorrect}
            onNext={nextQuestion}
          />
        )}
      </div>

      <ExitConfirmDialog
        open={showExitDialog}
        onContinue={cancelExit}
        onExit={confirmExit}
      />
    </main>
  )
}
