import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Wind, Heart, Gauge, Thermometer } from 'lucide-react'
import { calculateTEWS, LEVEL_SOFT_PANEL, LEVEL_SOLID_BG, LEVEL_TEXT_ON_SOLID } from '../utils'
import type { PatientVitals, TriageResult } from '../types'

interface VitalsInputProps {
  onCalculate?: (vitals: PatientVitals, result: TriageResult) => void
}

const NORMAL_RANGES = {
  respiratoryRate: '12–20',
  heartRate: '51–100',
  systolicBP: '100–159',
  temperature: '36.0–37.5',
} as const

const fieldClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm ' +
  'focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40'

const labelClass = 'mb-1 flex items-center gap-1.5 text-sm font-bold text-slate-700'
const helperClass = 'mb-1 block text-xs font-normal text-slate-400'
const errorClass = 'mt-1 text-sm text-red-600'
const iconClass = 'h-4 w-4 shrink-0 text-sky-600'

export default function VitalsInput({ onCalculate }: VitalsInputProps) {
  const { t } = useTranslation()
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<PatientVitals>({
    mode: 'onChange',
    defaultValues: {
      respiratoryRate: undefined,
      heartRate: undefined,
      systolicBP: undefined,
      temperature: undefined,
    },
  })

  const respiratoryRate = watch('respiratoryRate')
  const heartRate = watch('heartRate')
  const systolicBP = watch('systolicBP')
  const temperature = watch('temperature')

  const result = useMemo<TriageResult | null>(() => {
    if (
      !isValid ||
      respiratoryRate == null ||
      heartRate == null ||
      systolicBP == null ||
      temperature == null
    ) {
      return null
    }
    return calculateTEWS({ respiratoryRate, heartRate, systolicBP, temperature })
  }, [respiratoryRate, heartRate, systolicBP, temperature, isValid])

  useEffect(() => {
    if (result) {
      onCalculate?.(
        { respiratoryRate, heartRate, systolicBP, temperature } as PatientVitals,
        result,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  const nonNegative = { min: { value: 0, message: t('vitals.negativeError') } }
  const requiredField = t('vitals.requiredField')

  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-md sm:max-w-xl sm:p-6 lg:max-w-2xl">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{t('vitals.title')}</h2>

      <form className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <div>
          <label htmlFor="respiratoryRate" className={labelClass}>
            <Wind className={iconClass} />
            {t('vitals.respiratoryRate')}
          </label>
          <span className={helperClass}>
            {t('vitals.normalRange', { range: NORMAL_RANGES.respiratoryRate })}
          </span>
          <input
            id="respiratoryRate"
            type="number"
            min={0}
            className={fieldClass}
            placeholder="e.g. 16"
            {...register('respiratoryRate', {
              required: requiredField,
              valueAsNumber: true,
              ...nonNegative,
            })}
          />
          {errors.respiratoryRate && (
            <p className={errorClass}>{errors.respiratoryRate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="heartRate" className={labelClass}>
            <Heart className={iconClass} />
            {t('vitals.heartRate')}
          </label>
          <span className={helperClass}>
            {t('vitals.normalRange', { range: NORMAL_RANGES.heartRate })}
          </span>
          <input
            id="heartRate"
            type="number"
            min={0}
            className={fieldClass}
            placeholder="e.g. 80"
            {...register('heartRate', {
              required: requiredField,
              valueAsNumber: true,
              ...nonNegative,
            })}
          />
          {errors.heartRate && <p className={errorClass}>{errors.heartRate.message}</p>}
        </div>

        <div>
          <label htmlFor="systolicBP" className={labelClass}>
            <Gauge className={iconClass} />
            {t('vitals.systolicBP')}
          </label>
          <span className={helperClass}>
            {t('vitals.normalRange', { range: NORMAL_RANGES.systolicBP })}
          </span>
          <input
            id="systolicBP"
            type="number"
            min={0}
            className={fieldClass}
            placeholder="e.g. 120"
            {...register('systolicBP', {
              required: requiredField,
              valueAsNumber: true,
              ...nonNegative,
            })}
          />
          {errors.systolicBP && <p className={errorClass}>{errors.systolicBP.message}</p>}
        </div>

        <div>
          <label htmlFor="temperature" className={labelClass}>
            <Thermometer className={iconClass} />
            {t('vitals.temperature')}
          </label>
          <span className={helperClass}>
            {t('vitals.normalRange', { range: NORMAL_RANGES.temperature })}
          </span>
          <input
            id="temperature"
            type="number"
            min={0}
            step="0.1"
            className={fieldClass}
            placeholder="e.g. 37.0"
            {...register('temperature', {
              required: requiredField,
              valueAsNumber: true,
              ...nonNegative,
            })}
          />
          {errors.temperature && <p className={errorClass}>{errors.temperature.message}</p>}
        </div>
      </form>

      <div className="mt-6 border-t border-slate-200 pt-4">
        {result ? (
          <div
            className={`flex flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${LEVEL_SOFT_PANEL[result.level]}`}
          >
            <p className="text-xs">{result.explanation}</p>
            <span
              className={`flex shrink-0 items-center gap-2 self-start rounded-full px-3 py-1.5 text-sm font-bold sm:self-auto ${LEVEL_SOLID_BG[result.level]} ${LEVEL_TEXT_ON_SOLID[result.level]}`}
            >
              {result.level}
              <span className="text-lg">{result.tewsScore}</span>
            </span>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Enter all vitals to see the TEWS score.</p>
        )}
      </div>
    </div>
  )
}
