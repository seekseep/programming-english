import { useState } from 'react'
import { Checkbox } from '#/components/ui/checkbox'
import { Button } from '#/components/ui/button'
import {
  LANGUAGES,
  useLanguagePreference,
} from '#/context/LanguagePreferenceContext'

type Props = {
  onSaved?: () => void
}

export function LanguageSelector({ onSaved }: Props) {
  const { enabledLanguages, setEnabledLanguages } = useLanguagePreference()
  const [selected, setSelected] = useState<string[]>(enabledLanguages)

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const handleSave = () => {
    setEnabledLanguages(selected)
    onSaved?.()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {LANGUAGES.map((lang) => (
          <label
            key={lang.value}
            className="flex items-center gap-3 p-3 rounded-xl border border-(--line) bg-(--card-bg) cursor-pointer"
          >
            <Checkbox
              checked={selected.includes(lang.value)}
              onCheckedChange={() => toggle(lang.value)}
            />
            <span className="font-medium">{lang.label}</span>
            <span className="text-sm text-muted-foreground">{lang.value}</span>
          </label>
        ))}
      </div>
      <Button
        onClick={handleSave}
        disabled={selected.length === 0}
        className="w-full rounded-xl font-bold"
      >
        保存
      </Button>
    </div>
  )
}
