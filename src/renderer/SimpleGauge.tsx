import type { UsageViewProps } from '../vide'
import { Gauge, ResetInfo, BurnRateStat, CutoffStat } from './UsageStats'

// The original ring-gauge usage panel. vIDE supplies the panel wrapper and data.
export function SimpleGauge({ session, week, now }: UsageViewProps) {
  return (
    <div data-testid="usage-gauges" className="flex items-start gap-10 overflow-x-hidden">
      <div className="flex flex-col items-center gap-3 shrink-0">
        <Gauge pct={session.pct} label="SESSION" />
        <ResetInfo label="Session resets" resetAt={session.resetAt} now={now} />
      </div>
      <div className="flex flex-col items-center gap-3 shrink-0">
        <Gauge pct={week.pct} label="THIS WEEK" />
        <ResetInfo label="Week resets" resetAt={week.resetAt} now={now} />
      </div>
      <div className="flex flex-col gap-3 pt-1 shrink-0">
        <div className="text-[0.625rem] text-fg-muted uppercase tracking-wider font-semibold">Burn rate</div>
        <BurnRateStat label="session" ratePerHour={session.ratePerHour} />
        <BurnRateStat label="week" ratePerHour={week.ratePerHour} />
      </div>
      <div className="flex flex-col gap-3 pt-1 shrink-0">
        <div className="text-[0.625rem] text-fg-muted uppercase tracking-wider font-semibold">Est. run out</div>
        <CutoffStat label="session" cutoffAt={session.cutoffAt} now={now} />
        <CutoffStat label="week" cutoffAt={week.cutoffAt} now={now} />
      </div>
    </div>
  )
}
