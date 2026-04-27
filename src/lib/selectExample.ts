import type { ProgrammingExample } from '#/data/types'

export function selectExample(
  examples: ProgrammingExample[],
  enabledLanguages: string[],
): ProgrammingExample {
  if (enabledLanguages.length === 0 || examples.length === 0) {
    return examples[0]
  }
  const match = examples.find((e) =>
    enabledLanguages.some(
      (lang) => lang.toLowerCase() === e.language.toLowerCase(),
    ),
  )
  return match ?? examples[0]
}
