import { useTranslation } from 'react-i18next'
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import {
  LEVEL_LEFT_BORDER,
  LEVEL_SOFT_PANEL,
  LEVEL_SOFT_PILL,
  LEVEL_SOLID_BG,
  LEVEL_TEXT_ON_SOLID,
} from '../utils'
import type { Discriminator, TriageLevel, TriageResult } from '../types'

interface ResultsDisplayProps {
  triageResult: TriageResult | null | undefined
  selectedDiscriminators?: Discriminator[]
  onReset?: () => void
}

const LEVEL_SEVERITY: Record<TriageLevel, number> = {
  GREEN: 0,
  YELLOW: 1,
  ORANGE: 2,
  RED: 3,
}

const LEVEL_ICONS: Record<TriageLevel, typeof AlertCircle> = {
  RED: AlertCircle,
  ORANGE: AlertTriangle,
  YELLOW: Info,
  GREEN: CheckCircle2,
}

const KNOWN_LEVELS: TriageLevel[] = ['RED', 'ORANGE', 'YELLOW', 'GREEN']

function effectiveLevel(triageResult: TriageResult, discriminators: Discriminator[]): TriageLevel {
  return [triageResult.level, ...discriminators.map((d) => d.level)].reduce((worst, level) =>
    LEVEL_SEVERITY[level] > LEVEL_SEVERITY[worst] ? level : worst,
  )
}

export default function ResultsDisplay({
  triageResult,
  selectedDiscriminators = [],
  onReset,
}: ResultsDisplayProps) {
  const { t } = useTranslation()

  if (!triageResult) {
    return (
      <div className="w-full max-w-md rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-400 sm:max-w-xl sm:p-6 lg:max-w-2xl">
        {t('results.completePrompt')}
      </div>
    )
  }

  const rawLevel = effectiveLevel(triageResult, selectedDiscriminators ?? [])
  const level: TriageLevel = KNOWN_LEVELS.includes(rawLevel) ? rawLevel : 'GREEN'
  const escalated = level !== triageResult.level
  const LevelIcon = LEVEL_ICONS[level]

  const VITAL_LABELS: Record<TriageResult['breakdown'][number]['vital'], string> = {
    'Respiratory Rate': t('vitals.respiratoryRate'),
    'Heart Rate': t('vitals.heartRate'),
    'Systolic BP': t('vitals.systolicBP'),
    Temperature: t('vitals.temperature'),
  }

  return (
    <div
      className={`w-full max-w-md rounded-xl border border-slate-200 border-l-4 bg-white p-4 shadow-md sm:max-w-xl sm:p-6 lg:max-w-2xl ${LEVEL_LEFT_BORDER[level]}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{t('results.title')}</h2>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 sm:px-4"
        >
          {t('buttons.reset')}
        </button>
      </div>

      <div
        className={`mt-4 flex items-center justify-between gap-3 rounded-lg px-4 py-4 sm:px-5 ${LEVEL_SOLID_BG[level]} ${LEVEL_TEXT_ON_SOLID[level]}`}
      >
        <div className="flex items-center gap-3">
          <LevelIcon className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide opacity-80">
              {t('results.level')}
            </p>
            <span className="text-2xl font-extrabold tracking-wide sm:text-3xl">{level}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide opacity-80">
            {t('results.tewsScore')}
          </p>
          <span className="text-3xl font-extrabold sm:text-4xl">
            {triageResult.tewsScore ?? '—'}
          </span>
        </div>
      </div>

      {escalated && (
        <p className="mt-2 text-xs font-medium text-red-600">
          {t('results.escalatedFrom', { level: triageResult.level })}
        </p>
      )}

      <p className="mt-3 text-sm text-slate-600">{triageResult.explanation}</p>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-slate-900">{t('results.breakdown')}</h3>
        <table className="mt-2 w-full border-collapse overflow-hidden rounded-lg text-sm">
          <tbody>
            {(triageResult.breakdown ?? []).map((item, index) => (
              <tr key={item.vital} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                <td className="px-3 py-1.5 text-slate-600">
                  {VITAL_LABELS[item.vital]} <span className="text-slate-400">({item.value})</span>
                </td>
                <td
                  className={`px-3 py-1.5 text-right font-semibold ${item.points > 0 ? 'text-orange-600' : 'text-slate-400'}`}
                >
                  +{item.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-slate-900">
          {t('results.selectedDiscriminators')}
        </h3>
        {selectedDiscriminators.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {selectedDiscriminators.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-1.5 text-sm"
              >
                <span className="text-slate-600">
                  {t(`discriminators.items.${d.id}.name`, d.name)}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${LEVEL_SOFT_PILL[d.level]}`}
                >
                  {d.level}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-400">{t('results.noneSelected')}</p>
        )}
      </div>

      <div className={`mt-5 rounded-lg border px-4 py-3 ${LEVEL_SOFT_PANEL[level]}`}>
        <h3 className="text-sm font-semibold text-slate-900">{t('results.nextSteps')}</h3>
        <p className="mt-1 text-sm text-slate-700">{t(`results.routing.${level}`)}</p>
      </div>
    </div>
  )
}
