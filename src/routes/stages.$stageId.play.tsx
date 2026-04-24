import { createFileRoute } from '@tanstack/react-router'
import { stages } from '#/data'
import { PlayProvider, usePlay } from '#/components/play/PlayProvider'
import { QuestionStep } from '#/components/play/QuestionStep'
import { ResultStep } from '#/components/play/ResultStep'

export const Route = createFileRoute('/stages/$stageId/play')({
  component: PlayModePage,
})

function PlayModePage() {
  const { stageId } = Route.useParams()
  const stage = stages.find((s) => s.id === stageId)

  if (!stage) return <div className="page-shell">ステージが見つかりません</div>

  return (
    <PlayProvider stageId={stageId}>
      <PlayContent />
    </PlayProvider>
  )
}

function PlayContent() {
  const { step } = usePlay()
  return step === 'question' ? <QuestionStep /> : <ResultStep />
}
