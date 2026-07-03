import { useTranslation } from 'react-i18next'
import TriageForm from './components/TriageForm'
import LanguageSwitcher from './components/LanguageSwitcher'

function App() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-white to-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-sm font-bold text-white sm:h-9 sm:w-9 sm:text-base">
              +
            </span>
            <h1 className="m-0 text-sm font-semibold text-slate-900 sm:text-base">
              {t('app.title')}
            </h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <section className="bg-gradient-to-r from-sky-600 to-sky-500 px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="m-0 text-xl font-bold sm:text-2xl lg:text-3xl">{t('app.title')}</h2>
          <p className="mt-2 text-sm text-sky-100 sm:text-base">{t('app.subtitle')}</p>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-10 lg:px-8">
        <TriageForm />
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <p className="m-0 text-center text-xs text-slate-400">
          © {year} {t('app.title')}
        </p>
      </footer>
    </div>
  )
}

export default App
