import { SimpleGauge } from './SimpleGauge'
import { setVide } from './vide'
import type { VideRendererApi } from '../vide'

let teardown: Array<() => void> = []

export function activate(vide: VideRendererApi): void {
  setVide(vide)
  teardown.push(vide.usage.registerView({ title: 'Simple Gauge', component: SimpleGauge }).dispose)
}

export function deactivate(): void {
  for (const off of teardown.reverse()) {
    try { off() } catch { /* best effort */ }
  }
  teardown = []
  setVide(null)
}
