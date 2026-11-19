import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { SimpleGauge } from '../SimpleGauge'
import { BurnRateStat, CutoffStat, Gauge, ResetInfo } from '../UsageStats'
import { activate, deactivate } from '../index'
import type { UsageViewProps, UsageWindow, VideRendererApi } from '../../vide'

const now = Date.now()
const SESSION: UsageWindow = { label: 'Session', pct: 38, resetAt: now + 3_600_000, ratePerHour: 30.55, cutoffAt: null, windowHours: 5 }
const WEEK: UsageWindow = { label: 'Week', pct: 56, resetAt: now + 86_400_000, ratePerHour: 0.73, cutoffAt: null, windowHours: 168 }
const props = (over: Partial<UsageViewProps> = {}): UsageViewProps => ({ session: SESSION, week: WEEK, now, ...over })

afterEach(cleanup)

describe('Gauge', () => {
  it('sizes the svg in rem so it scales with the font-size setting', () => {
    const { container } = render(<Gauge pct={50} label="SESSION" />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBeNull()
    expect(svg.getAttribute('class') ?? '').toMatch(/rem/)
  })
  it('shows a dash and an empty ring for null pct', () => {
    render(<Gauge pct={null} label="SESSION" />)
    expect(screen.getByText('—')).toBeTruthy()
    const ring = screen.getByTestId('gauge-ring')
    expect(ring.getAttribute('stroke-dashoffset')).toBe(ring.getAttribute('stroke-dasharray'))
  })
  it('clamps the ring for pct over 100', () => {
    render(<Gauge pct={130} label="SESSION" />)
    expect(screen.getByText('130%')).toBeTruthy()
    expect(Number(screen.getByTestId('gauge-ring').getAttribute('stroke-dashoffset'))).toBeCloseTo(0)
  })
})

describe('stat text wrapping', () => {
  it('keeps ResetInfo on one line', () => {
    const { container } = render(<ResetInfo label="Session resets" resetAt={now + 3_600_000} now={now} />)
    expect(container.firstElementChild?.className ?? '').toMatch(/whitespace-nowrap/)
  })
  it('keeps BurnRateStat on one line', () => {
    const { container } = render(<BurnRateStat label="session" ratePerHour={20.5} />)
    expect(container.firstElementChild?.className ?? '').toMatch(/whitespace-nowrap/)
  })
  it('keeps CutoffStat on one line', () => {
    const { container } = render(<CutoffStat label="session" cutoffAt={now + 3_600_000} now={now} />)
    expect(container.firstElementChild?.className ?? '').toMatch(/whitespace-nowrap/)
  })
})

describe('SimpleGauge', () => {
  it('renders both gauges with reset info, burn rates and on-track run-out', () => {
    render(<SimpleGauge {...props()} />)
    expect(screen.getByText('SESSION')).toBeTruthy()
    expect(screen.getByText('THIS WEEK')).toBeTruthy()
    expect(screen.getByText('38%')).toBeTruthy()
    expect(screen.getByText('56%')).toBeTruthy()
    expect(screen.getByText('Session resets')).toBeTruthy()
    expect(screen.getByText('Week resets')).toBeTruthy()
    expect(screen.getByText('1h 0m')).toBeTruthy()
    expect(screen.getByText('Burn rate')).toBeTruthy()
    expect(screen.getByText('≈30.55%/hr')).toBeTruthy()
    expect(screen.getByText('≈0.73%/hr')).toBeTruthy()
    expect(screen.getByText('Est. run out')).toBeTruthy()
    expect(screen.getAllByText('on track')).toHaveLength(2)
  })
  it('handles null pct, reset and rate without NaN', () => {
    const blank = { ...SESSION, pct: null, resetAt: null, ratePerHour: null }
    const { container } = render(<SimpleGauge {...props({ session: blank })} />)
    expect(container.textContent).not.toMatch(/NaN/)
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(4)
  })
  it('shows the run-out time when cutoffAt is set', () => {
    render(<SimpleGauge {...props({ session: { ...SESSION, cutoffAt: now + 30 * 60_000 } })} />)
    expect(screen.getAllByText('on track')).toHaveLength(1)
    expect(screen.getByText('30m')).toBeTruthy()
  })
  it('shows 100% with a full ring', () => {
    render(<SimpleGauge {...props({ session: { ...SESSION, pct: 100 } })} />)
    expect(screen.getByText('100%')).toBeTruthy()
  })
})

describe('activate', () => {
  it('registers the view as Simple Gauge and disposes on deactivate', () => {
    const dispose = vi.fn()
    const registerView = vi.fn(() => ({ dispose }))
    activate({ usage: { registerView } } as unknown as VideRendererApi)
    expect(registerView).toHaveBeenCalledWith(expect.objectContaining({ title: 'Simple Gauge' }))
    deactivate()
    expect(dispose).toHaveBeenCalled()
  })
})
