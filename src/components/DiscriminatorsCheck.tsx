import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, AlertTriangle } from 'lucide-react'
import { DISCRIMINATORS, LEVEL_SOFT_PANEL, LEVEL_SOFT_PILL } from '../utils'
import type { Discriminator } from '../types'

interface DiscriminatorsCheckProps {
  onChange?: (selected: Discriminator[]) => void
  tewsScore?: number | null
}

const LEVEL_ITEM_STYLES: Record<Discriminator['level'], string> = {
  RED: 'border-red-200 bg-red-50/40 has-[:checked]:border-red-400 has-[:checked]:bg-red-50',
  ORANGE:
    'border-orange-200 bg-orange-50/40 has-[:checked]:border-orange-400 has-[:checked]:bg-orange-50',
}

const LEVEL_ICONS: Record<Discriminator['level'], typeof AlertCircle> = {
  RED: AlertCircle,
  ORANGE: AlertTriangle,
}

const LEVEL_ICON_COLOR: Record<Discriminator['level'], string> = {
  RED: 'text-red-600',
  ORANGE: 'text-orange-600',
}

export default function DiscriminatorsCheck({ onChange, tewsScore = null }: DiscriminatorsCheckProps) {
  const { t } = useTranslation()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const selected = DISCRIMINATORS.filter((d) => selectedIds.has(d.id))
  const redSelected = selected.filter((d) => d.level === 'RED')
  const showHighScoreWarning = tewsScore != null && tewsScore >= 8 && redSelected.length === 0

  useEffect(() => {
    onChange?.(selected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds])

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-md sm:max-w-xl sm:p-6 lg:max-w-2xl">
      <h2 className="text-lg font-semibold text-slate-900">{t('discriminators.title')}</h2>
      <p className="mb-4 text-sm text-slate-500">{t('discriminators.check')}</p>

      {redSelected.length > 0 && (
        <div
          role="alert"
          className={`mb-4 flex items-start gap-2 rounded-lg border px-4 py-3 transition-all duration-300 ${LEVEL_SOFT_PANEL.RED}`}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-semibold">{t('discriminators.urgentTitle')}</p>
            <p className="mt-1 text-xs">
              {t('discriminators.urgentBody', {
                names: redSelected
                  .map((d) => t(`discriminators.items.${d.id}.name`, d.name))
                  .join(', '),
              })}
            </p>
          </div>
        </div>
      )}

      {showHighScoreWarning && (
        <div
          role="alert"
          className={`mb-4 flex items-start gap-2 rounded-lg border px-4 py-3 transition-all duration-300 ${LEVEL_SOFT_PANEL.ORANGE}`}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
          <p className="text-xs">
            {t('discriminators.highScoreWarning', { score: tewsScore })}
          </p>
        </div>
      )}

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        {DISCRIMINATORS.map((discriminator) => {
          const Icon = LEVEL_ICONS[discriminator.level]
          return (
            <li key={discriminator.id}>
              <label
                htmlFor={discriminator.id}
                className={`flex h-full cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${LEVEL_ITEM_STYLES[discriminator.level]}`}
              >
                <input
                  id={discriminator.id}
                  type="checkbox"
                  className="mt-0.5 h-6 w-6 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500/40 sm:h-5 sm:w-5"
                  checked={selectedIds.has(discriminator.id)}
                  onChange={() => toggle(discriminator.id)}
                />
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${LEVEL_ICON_COLOR[discriminator.level]}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {t(`discriminators.items.${discriminator.id}.name`, discriminator.name)}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${LEVEL_SOFT_PILL[discriminator.level]}`}
                    >
                      {discriminator.level}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t(`discriminators.items.${discriminator.id}.description`, discriminator.description)}
                  </p>
                </div>
              </label>
            </li>
          )
        })}
      </ul>

      {selected.length === 0 && (
        <p className="mt-4 text-sm text-slate-400">{t('discriminators.noneSelected')}</p>
      )}
    </div>
  )
}
