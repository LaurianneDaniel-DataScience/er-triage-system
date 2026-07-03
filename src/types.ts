export interface PatientVitals {
  respiratoryRate: number
  heartRate: number
  systolicBP: number
  temperature: number
}

export type TriageLevel = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN'

export interface VitalScoreContribution {
  vital: 'Respiratory Rate' | 'Heart Rate' | 'Systolic BP' | 'Temperature'
  value: number
  points: number
}

export interface TriageResult {
  level: TriageLevel
  tewsScore: number
  explanation: string
  breakdown: VitalScoreContribution[]
}

export interface Discriminator {
  id: string
  name: string
  level: 'RED' | 'ORANGE'
  description: string
}
