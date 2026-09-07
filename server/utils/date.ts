export type DateRange = 'today' | '7days'

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTodayDateString(): string {
  return getLocalDateString(new Date())
}

export function getStartDateForRange(range: DateRange | string = 'today', referenceDate: Date = new Date()): string {
  const startDate = new Date(referenceDate)

  if (range === '7days') {
    startDate.setDate(startDate.getDate() - 6)

  }

  return getLocalDateString(startDate)
}
