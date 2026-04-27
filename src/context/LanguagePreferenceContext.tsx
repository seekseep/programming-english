import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'

const STORAGE_KEY = 'programming-english-lang-pref'

export const LANGUAGES = [
  { value: 'Visual Basic', label: 'VB' },
  { value: 'JavaScript', label: 'JS' },
  { value: 'Python', label: 'Py' },
  { value: 'Java', label: 'Java' },
  { value: 'SQL', label: 'SQL' },
] as const

type LanguagePreferenceContextType = {
  enabledLanguages: string[]
  setEnabledLanguages: (langs: string[]) => void
  isLanguageSetup: boolean
  isHydrated: boolean
}

const LanguagePreferenceContext =
  createContext<LanguagePreferenceContextType | null>(null)

function loadEnabledLanguages(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as unknown
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(
          (v): v is string =>
            typeof v === 'string' && LANGUAGES.some((l) => l.value === v),
        )
      }
      // 旧形式（単一文字列）からの移行
      if (
        typeof parsed === 'string' &&
        LANGUAGES.some((l) => l.value === parsed)
      ) {
        return [parsed]
      }
    }
  } catch {
    // localStorage unavailable or invalid JSON
  }
  return []
}

export function LanguagePreferenceProvider({
  children,
}: {
  children: ReactNode
}) {
  const [enabledLanguages, setRaw] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setRaw(loadEnabledLanguages())
    setIsHydrated(true)
  }, [])

  const setEnabledLanguages = useCallback((langs: string[]) => {
    setRaw(langs)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(langs))
    } catch {
      // localStorage unavailable
    }
  }, [])

  const isLanguageSetup = enabledLanguages.length > 0

  return (
    <LanguagePreferenceContext.Provider
      value={{ enabledLanguages, setEnabledLanguages, isLanguageSetup, isHydrated }}
    >
      {children}
    </LanguagePreferenceContext.Provider>
  )
}

export function useLanguagePreference() {
  const ctx = useContext(LanguagePreferenceContext)
  if (!ctx)
    throw new Error(
      'useLanguagePreference must be used within LanguagePreferenceProvider',
    )
  return ctx
}
