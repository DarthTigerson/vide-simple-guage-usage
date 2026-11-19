// Module-level holder for the `vide` object handed to activate(). Components
// and stores are imported before activate runs, so they read it lazily.
import type { VideRendererApi } from '../vide'

let current: VideRendererApi | null = null

export function setVide(v: VideRendererApi | null): void {
  current = v
}

export function getVide(): VideRendererApi {
  if (!current) throw new Error('vide API not available: app is not activated')
  return current
}
