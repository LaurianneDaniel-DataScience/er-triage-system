import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import VitalsInput from './VitalsInput'
import DiscriminatorsCheck from './DiscriminatorsCheck'
import ResultsDisplay from './ResultsDisplay'
import { calculateTEWS } from '../utils'
import type { Discriminator, PatientVitals, TriageResult } from '../types'

interface Step {
  number: 1 | 2 | 3
  labelKey: 'steps.vitals' | 'steps.discriminators' | 'steps.results'
}

const STEPS: Step[] = [
  { number: 1, labelKey: 'steps.vitals' },
  { number: 2, labelKey: 'steps.discriminators' },
  { number: 3, labelKey: 'steps.results' },
]

function StepTracker({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const { t } = useTranslation()

  return (
    <ol className="flex w-full max-w-md items-center sm:max-w-xl lg:max-w-2xl">
      {STEPS.map((step, index) => {
        const done = step.number < currentStep
        const active = step.number === currentStep
        return (
          <li key={step.number} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  done
                    ? 'bg-sky-600 text-white'
                    : active
                      ? 'border-2 border-sky-600 text-sky-600'
                      : 'border-2 border-slate-300 text-slate-400'
                }`}
              >
                {done ? '✓' : step.number}
              </span>
              <span
                className={`text-xs font-medium ${active || done ? 'text-slate-900' : 'text-slate-400'}`}
              >
                {t(step.labelKey)}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${step.number < currentStep ? 'bg-sky-600' : 'bg-slate-200'}`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default function TriageForm() {
  const { t } = useTranslation()
  const [tewsResult, setTewsResult] = useState<TriageResult | null>(null)
  const [discriminators, setDiscriminators] = useState<Discriminator[]>([])
  const [finalResult, setFinalResult] = useState<TriageResult | null>(null)
  const [formKey, setFormKey] = useState(0)
  const [calculationError, setCalculationError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  function handleVitalsCalculated(vitals: PatientVitals) {
    try {
      if (!vitals) {
        throw new Error('Missing vitals payload')
      }
      const computed = calculateTEWS(vitals)
      setTewsResult(computed)
      setCalculationError(null)
      setShowSuccess(true)
    } catch {
      setTewsResult(null)
      setCalculationError(t('results.calculationError'))
    }
  }

  useEffect(() => {
    if (!showSuccess) return
    const timer = setTimeout(() => setShowSuccess(false), 2000)
    return () => clearTimeout(timer)
  }, [showSuccess])

  useEffect(() => {
    if (!tewsResult) {
      setFinalResult(null)
      return
    }

    const safeDiscriminators = discriminators ?? []
    const redDiscriminators = safeDiscriminators.filter((d) => d.level === 'RED')
    if (redDiscriminators.length > 0 && tewsResult.level !== 'RED') {
      setFinalResult({
        ...tewsResult,
        level: 'RED',
        explanation: `${tewsResult.explanation} ${t('results.upgradedToRed', {
          names: redDiscriminators
            .map((d) => t(`discriminators.items.${d.id}.name`, d.name))
            .join(', '),
        })}`,
      })
    } else {
      setFinalResult(tewsResult)
    }
  }, [tewsResult, discriminators, t])

  function handleReset() {
    setTewsResult(null)
    setDiscriminators([])
    setFinalResult(null)
    setCalculationError(null)
    setShowSuccess(false)
    setFormKey((key) => key + 1)
  }

  const currentStep: 1 | 2 | 3 = finalResult ? 3 : tewsResult ? 2 : 1

  return (
    <div className="flex w-full flex-col items-center gap-4 sm:gap-6">
      <StepTracker currentStep={currentStep} />

      {calculationError && (
        <div
          role="alert"
          className="flex w-full max-w-md items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 transition-all duration-300 sm:max-w-xl lg:max-w-2xl"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{calculationError}</p>
        </div>
      )}

      {showSuccess && !calculationError && (
        <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-700 transition-all duration-300 sm:max-w-xl lg:max-w-2xl">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <p>{t('results.calculated')}</p>
        </div>
      )}

      <div className="w-full max-w-md sm:max-w-xl lg:max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {t('steps.eyebrow', { number: 1, label: t('steps.vitals') })}
        </p>
        <VitalsInput key={`vitals-${formKey}`} onCalculate={handleVitalsCalculated} />
      </div>

      <div className="w-full max-w-md sm:max-w-xl lg:max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {t('steps.eyebrow', { number: 2, label: t('steps.discriminators') })}
        </p>
        <DiscriminatorsCheck
          key={`discriminators-${formKey}`}
          onChange={setDiscriminators}
          tewsScore={tewsResult?.tewsScore ?? null}
        />
      </div>

      <div className="w-full max-w-md sm:max-w-xl lg:max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {t('steps.eyebrow', { number: 3, label: t('steps.results') })}
        </p>
        <ResultsDisplay
          triageResult={finalResult}
          selectedDiscriminators={discriminators}
          onReset={handleReset}
        />
      </div>
    </div>
  )
}
