import type { PatientVitals, TriageResult, TriageLevel } from '../types'

function scoreRespiratoryRate(rate: number): number {
  if (rate < 9 || rate > 25) return 2
  if (rate <= 11 || rate >= 21) return 1
  return 0
}

function scoreHeartRate(rate: number): number {
  if (rate <= 40 || rate >= 111) return 2
  if (rate <= 50 || rate >= 101) return 1
  return 0
}

function scoreSystolicBP(bp: number): number {
  if (bp < 80 || bp >= 200) return 2
  if (bp < 100 || bp >= 160) return 1
  return 0
}

function scoreTemperature(temp: number): number {
  if (temp < 35.0 || temp > 38.5) return 2
  if (temp < 36.0 || temp > 37.5) return 1
  return 0
}

function levelForScore(score: number): TriageLevel {
  if (score >= 8) return 'RED'
  if (score >= 6) return 'ORANGE'
  if (score >= 3) return 'YELLOW'
  return 'GREEN'
}

export function calculateTEWS(vitals: PatientVitals): TriageResult {
  const respiratoryRateScore = scoreRespiratoryRate(vitals.respiratoryRate)
  const heartRateScore = scoreHeartRate(vitals.heartRate)
  const systolicBPScore = scoreSystolicBP(vitals.systolicBP)
  const temperatureScore = scoreTemperature(vitals.temperature)

  const tewsScore =
    respiratoryRateScore + heartRateScore + systolicBPScore + temperatureScore

  const level = levelForScore(tewsScore)

  const factors: string[] = []
  if (respiratoryRateScore > 0) {
    factors.push(`respiratory rate ${vitals.respiratoryRate} (+${respiratoryRateScore})`)
  }
  if (heartRateScore > 0) {
    factors.push(`heart rate ${vitals.heartRate} (+${heartRateScore})`)
  }
  if (systolicBPScore > 0) {
    factors.push(`systolic BP ${vitals.systolicBP} (+${systolicBPScore})`)
  }
  if (temperatureScore > 0) {
    factors.push(`temperature ${vitals.temperature} (+${temperatureScore})`)
  }

  const explanation =
    factors.length > 0
      ? `TEWS score ${tewsScore} (${level}). Contributing factors: ${factors.join(', ')}.`
      : `TEWS score ${tewsScore} (${level}). All vitals within normal range.`

  const breakdown = [
    { vital: 'Respiratory Rate', value: vitals.respiratoryRate, points: respiratoryRateScore },
    { vital: 'Heart Rate', value: vitals.heartRate, points: heartRateScore },
    { vital: 'Systolic BP', value: vitals.systolicBP, points: systolicBPScore },
    { vital: 'Temperature', value: vitals.temperature, points: temperatureScore },
  ] as const

  return { level, tewsScore, explanation, breakdown: [...breakdown] }
}
