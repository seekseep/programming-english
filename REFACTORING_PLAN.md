# リファクタリング作業計画

## 方針

- 1ファイル = 1コンポーネントにする
- shadcn/ui で置き換えられるものは置き換える
- PlayProvider パターンで状態管理を一元化する

## Phase 1: shadcn 導入 + 1ファイル1コンポーネント ✅ 完了

- shadcn コンポーネント導入: drawer, alert-dialog, progress, toggle-group, badge
- QuizMode → WordQuiz リネーム + modes/ → quiz/ 移動
- QuestionResultDrawer 分離 + shadcn Drawer 化
- WordDrawer → shadcn Drawer 化
- 離脱確認ダイアログ → shadcn AlertDialog (ExitConfirmDialog)
- 進捗バー → shadcn Progress
- フィルターチップ → shadcn ToggleGroup
- テーマバッジ → shadcn Badge
- インライン結果UI → StageResult に統合
- 未使用ファイル削除 (StagePlay.tsx, ScrollLock.tsx)

## Phase 2: PlayProvider パターン導入 ✅ 完了

### 新しい構成

```
src/components/play/
  PlayProvider.tsx         ← 全状態管理 + Context + usePlay hook
  QuestionStep.tsx         ← クイズ出題UI（Contextから状態取得）
  ResultStep.tsx           ← クリア後の結果表示UI（Contextから状態取得）
  ExitConfirmDialog.tsx    ← 離脱確認ダイアログ
  QuestionResultDrawer.tsx ← 問題結果ドロワー
```

### ルートファイル（スリム化済み）

```
src/routes/stages.$stageId.play.tsx
  → PlayProvider + PlayContent のみ
```

### 削除したファイル・ディレクトリ

- `src/components/quiz/` (WordQuiz.tsx → QuestionStep に統合)
- `src/components/stages/` (StageResult.tsx → ResultStep に統合)
- `src/components/modes/` (Phase 1 で削除済み)
- `src/components/ScrollLock.tsx` (shadcn Drawer で不要に)
- `src/components/stages/StagePlay.tsx` (未使用)

## 検証

- `npx tsc --noEmit` ✅ 通過
- ブラウザでの動作確認: 未実施
