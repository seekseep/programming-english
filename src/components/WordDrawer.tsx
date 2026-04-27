import type { Word } from '#/types'
import { CodeBlock } from './CodeBlock'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '#/components/ui/drawer'

type Props = {
  word: Word | null
  onClose: () => void
}

export function WordDrawer({ word, onClose }: Props) {
  return (
    <Drawer open={!!word} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-white data-[vaul-drawer-direction=bottom]:border-t-0 [&>div:first-child]:hidden">
        {word && (
          <div className="max-w-xl mx-auto w-full px-5 py-6 overflow-y-auto max-h-[80dvh]">
            {/* 見出し */}
            <DrawerHeader className="p-0 mb-4 text-center">
              <DrawerTitle className="text-3xl font-black">
                {word.english}
              </DrawerTitle>
              <p className="text-lg font-bold text-muted-foreground">
                {word.japanese}
              </p>
            </DrawerHeader>

            <div className="space-y-4">
              {word.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">解説</p>
                  <p>{word.description}</p>
                </div>
              )}

              {word.example_natural.english && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">例文</p>
                  <p className="italic">{word.example_natural.english}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {word.example_natural.japanese}
                  </p>
                </div>
              )}

              {word.example_programming[0]?.body && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    コード例（{word.example_programming[0].language}）
                  </p>
                  <CodeBlock
                    code={word.example_programming[0].body}
                    language={word.example_programming[0].language}
                  />
                </div>
              )}
            </div>

            <DrawerFooter className="px-0 pt-6 pb-0">
              <DrawerClose
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-base bg-(--primary) text-white cursor-pointer"
              >
                閉じる
              </DrawerClose>
            </DrawerFooter>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
