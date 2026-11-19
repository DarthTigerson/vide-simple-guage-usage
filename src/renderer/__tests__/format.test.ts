import { describe, expect, it } from 'vitest'
import { formatBurnRate, formatCountdown, formatResetTime } from '../format'

describe('formatResetTime', () => {
  it('returns an em dash for no timestamp', () => {
    expect(formatResetTime(null)).toBe('—')
  })
  it('formats a timestamp as "Mon D, H:MM"', () => {
    expect(formatResetTime(new Date(2026, 7, 13, 9, 59).getTime())).toMatch(/Aug 13, 9:59/)
  })
})

describe('formatCountdown', () => {
  const now = new Date(2026, 7, 9, 15, 4).getTime()
  it('returns an em dash for no timestamp', () => expect(formatCountdown(null, now)).toBe('—'))
  it('returns "now" once the time has passed', () => expect(formatCountdown(now - 1000, now)).toBe('now'))
  it('formats hours and minutes', () => expect(formatCountdown(now + (3 * 60 + 45) * 60_000, now)).toBe('3h 45m'))
  it('formats minutes only under an hour', () => expect(formatCountdown(now + 12 * 60_000, now)).toBe('12m'))
})

describe('formatBurnRate', () => {
  it('returns an em dash for no rate', () => expect(formatBurnRate(null)).toBe('—'))
  it('formats two decimals with a %/hr suffix', () => expect(formatBurnRate(30.5512)).toBe('≈30.55%/hr'))
})
