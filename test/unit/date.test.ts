import { describe, expect, it } from 'vitest'
import {
  getLocalDateString,
  getTodayDateString,
  getStartDateForRange,
} from '../../server/utils/date'

describe('server/utils/date', () => {
  describe('getLocalDateString', () => {
    it('formats date correctly as YYYY-MM-DD', () => {
      const testDate = new Date(2026, 8, 7) // Month is 0-indexed: 8 = September
      expect(getLocalDateString(testDate)).toBe('2026-09-07')
    })

    it('pads single-digit month and day with zero', () => {
      const testDate = new Date(2026, 0, 5) // 2026-01-05
      expect(getLocalDateString(testDate)).toBe('2026-01-05')
    })

    it('defaults to current date if no argument is passed', () => {
      const now = new Date()
      const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      expect(getLocalDateString()).toBe(expected)
    })
  })

  describe('getTodayDateString', () => {
    it('returns today date in YYYY-MM-DD format', () => {
      const now = new Date()
      const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      expect(getTodayDateString()).toBe(expected)
    })
  })

  describe('getStartDateForRange', () => {
    it('returns today date string when range is "today"', () => {
      const refDate = new Date(2026, 8, 7)
      expect(getStartDateForRange('today', refDate)).toBe('2026-09-07')
    })

    it('returns start date for 7days (6 days prior) when range is "7days"', () => {
      const refDate = new Date(2026, 8, 7)
      expect(getStartDateForRange('7days', refDate)).toBe('2026-09-01')
    })

    it('handles month transitions correctly for 7days', () => {
      const refDate = new Date(2026, 2, 3) // 2026-03-03
      // 6 days before March 3 in non-leap year (February 2026 has 28 days): March 3 - 6 = Feb 25
      expect(getStartDateForRange('7days', refDate)).toBe('2026-02-25')
    })

    it('handles year transitions correctly for 7days', () => {
      const refDate = new Date(2026, 0, 3) // 2026-01-03
      // 6 days before Jan 3 = Dec 28 of prior year
      expect(getStartDateForRange('7days', refDate)).toBe('2025-12-28')
    })

    it('defaults to today when range is omitted or unknown', () => {
      const refDate = new Date(2026, 8, 7)
      expect(getStartDateForRange(undefined, refDate)).toBe('2026-09-07')
      expect(getStartDateForRange('unknown', refDate)).toBe('2026-09-07')
    })
  })
})
