import { TIERS } from '@/constants'

export function getTierColors() {
  const style = getComputedStyle(document.documentElement)
  return Object.fromEntries(
    TIERS.map((t) => [t, style.getPropertyValue(`--tier-${t.toLowerCase()}`).trim()])
  )
}
