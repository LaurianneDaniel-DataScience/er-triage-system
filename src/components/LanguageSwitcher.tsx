import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGE_STORAGE_KEY = 'er-triage-language'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
] as const

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChange(code: string) {
    i18n.changeLanguage(code)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code)
  }

  return (
    <div className="flex shrink-0 gap-1 rounded-full border border-slate-200 bg-white p-1">
      {LANGUAGES.map((lang) => {
        const active = i18n.language === lang.code
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleChange(lang.code)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-150 ${
              active
                ? 'bg-sky-600 text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            {lang.label}
          </button>
        )
      })}
    </div>
  )
}
