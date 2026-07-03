import type { TriageLevel } from '../types'

export const LEVEL_SOLID_BG: Record<TriageLevel, string> = {
  RED: 'bg-red-600',
  ORANGE: 'bg-orange-600',
  YELLOW: 'bg-yellow-500',
  GREEN: 'bg-green-600',
}

export const LEVEL_TEXT_ON_SOLID: Record<TriageLevel, string> = {
  RED: 'text-white',
  ORANGE: 'text-white',
  YELLOW: 'text-yellow-950',
  GREEN: 'text-white',
}

export const LEVEL_LEFT_BORDER: Record<TriageLevel, string> = {
  RED: 'border-l-red-600',
  ORANGE: 'border-l-orange-600',
  YELLOW: 'border-l-yellow-500',
  GREEN: 'border-l-green-600',
}

export const LEVEL_SOFT_PANEL: Record<TriageLevel, string> = {
  RED: 'border-red-300 bg-red-50 text-red-700',
  ORANGE: 'border-orange-300 bg-orange-50 text-orange-700',
  YELLOW: 'border-yellow-300 bg-yellow-50 text-yellow-800',
  GREEN: 'border-green-300 bg-green-50 text-green-700',
}

export const LEVEL_SOFT_PILL: Record<TriageLevel, string> = {
  RED: 'bg-red-100 text-red-700',
  ORANGE: 'bg-orange-100 text-orange-700',
  YELLOW: 'bg-yellow-100 text-yellow-800',
  GREEN: 'bg-green-100 text-green-700',
}
