import type { Discriminator } from '../types'

export const DISCRIMINATORS: Discriminator[] = [
  {
    id: 'airway-obstruction',
    name: 'Airway obstruction',
    level: 'RED',
    description: 'Complete or partial obstruction of the airway compromising breathing.',
  },
  {
    id: 'severe-bleeding',
    name: 'Severe bleeding',
    level: 'RED',
    description: 'Uncontrolled or heavy hemorrhage with risk of hypovolemic shock.',
  },
  {
    id: 'unconsciousness',
    name: 'Unconsciousness',
    level: 'RED',
    description: 'Patient is unresponsive or has a significantly reduced level of consciousness.',
  },
  {
    id: 'severe-pain',
    name: 'Severe pain (≥8/10)',
    level: 'ORANGE',
    description: 'Patient reports pain of 8 or higher on a 10-point pain scale.',
  },
  {
    id: 'abnormal-rhythm',
    name: 'Abnormal rhythm',
    level: 'ORANGE',
    description: 'Irregular or abnormal cardiac rhythm detected.',
  },
]
