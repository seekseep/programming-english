import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'

type Props = {
  open: boolean
  onContinue: () => void
  onExit: () => void
}

export function ExitConfirmDialog({ open, onContinue, onExit }: Props) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onContinue()}
    >
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>プレイを中断しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            現在の進捗は保存されません
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="bg-white border-t border-(--line)">
          <AlertDialogCancel onClick={onContinue}>続ける</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onExit}>
            やめる
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
