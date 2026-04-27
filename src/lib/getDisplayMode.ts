export type DisplayMode = 'word-focused' | 'code-highlighted' | 'code-complex'

export function getDisplayMode(difficulty: number): DisplayMode {
  if (difficulty <= 3) return 'word-focused'
  if (difficulty <= 7) return 'code-highlighted'
  return 'code-complex'
}
