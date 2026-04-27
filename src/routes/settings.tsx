import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { FeatureHeader } from '#/components/FeatureHeader'
import { LanguageSelector } from '#/components/LanguageSelector'
import { Button } from '#/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '#/components/ui/alert-dialog'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleReset = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  const handleSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="page-shell">
      <div className="max-w-lg mx-auto">
        <FeatureHeader title="設定" />

        <section className="flex flex-col gap-6">
          {/* プログラミング言語 */}
          <div className="border border-(--line) bg-(--surface) rounded-2xl p-5">
            <h2 className="text-lg font-bold mb-1">プログラミング言語</h2>
            <p className="text-sm text-muted-foreground mb-4">
              出題に使用する言語を選んでください
            </p>
            <LanguageSelector onSaved={handleSaved} />
            {saved && (
              <p className="text-sm text-green-600 mt-2 font-medium">
                保存しました
              </p>
            )}
          </div>

          {/* データのリセット */}
          <div className="border border-(--line) bg-(--surface) rounded-2xl p-5">
            <h2 className="text-lg font-bold mb-1">データのリセット</h2>
            <p className="text-sm text-muted-foreground mb-4">
              学習の進捗と設定をすべて削除します。この操作は取り消せません。
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowResetDialog(true)}
              className="rounded-xl"
            >
              データをリセット
            </Button>
          </div>
        </section>
      </div>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>データをリセットしますか？</AlertDialogTitle>
            <AlertDialogDescription>
              学習の進捗、設定をすべて削除してアプリをリロードします。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleReset}>
              リセット
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
