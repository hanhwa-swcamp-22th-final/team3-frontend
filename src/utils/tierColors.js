const TIERS = ['S', 'A', 'B', 'C']

export function getTierColors() {
  const style = getComputedStyle(document.documentElement)
  return Object.fromEntries(
    TIERS.map((t) => [t, style.getPropertyValue(`--tier-${t.toLowerCase()}`).trim()])
  )
}

