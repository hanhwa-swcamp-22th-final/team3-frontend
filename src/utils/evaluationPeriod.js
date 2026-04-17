function resolveYearAndMonth(evalYear) {
  const raw = String(evalYear ?? '').trim()
  if (!raw) return { year: null, month: null }

  if (raw.length >= 6) {
    return {
      year: raw.slice(0, 4),
      month: Number.parseInt(raw.slice(4, 6), 10) || null,
    }
  }

  return {
    year: raw,
    month: null,
  }
}

export function formatEvaluationPeriodLabel(
  { evalYear, evalSequence } = {},
  { fallback = '-' } = {},
) {
  if (evalYear == null || evalSequence == null) return fallback

  const { year, month } = resolveYearAndMonth(evalYear)
  if (year == null) return fallback

  if (month == null) return `${year}년 ${evalSequence}차`
  return `${year}년 ${month}월 ${evalSequence}차`
}
