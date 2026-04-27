import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  LANGUAGES,
  useLanguagePreference,
} from '#/context/LanguagePreferenceContext'
import type { ProgrammingExample } from '#/data/types'

type Props = {
  examples: ProgrammingExample[]
  activeLanguage: string
  onLanguageChange: (language: string) => void
}

export function LanguageSwitcher({
  examples,
  activeLanguage,
  onLanguageChange,
}: Props) {
  const { enabledLanguages } = useLanguagePreference()

  const availableLanguages = LANGUAGES.filter(
    (lang) =>
      enabledLanguages.some(
        (el) => el.toLowerCase() === lang.value.toLowerCase(),
      ) &&
      examples.some(
        (e) => e.language.toLowerCase() === lang.value.toLowerCase(),
      ),
  )

  if (availableLanguages.length <= 1) return null

  return (
    <Tabs value={activeLanguage} onValueChange={onLanguageChange}>
      <TabsList className="lang-switcher">
        {availableLanguages.map((lang) => (
          <TabsTrigger
            key={lang.value}
            value={lang.value}
            className="lang-switcher-tab"
          >
            {lang.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
