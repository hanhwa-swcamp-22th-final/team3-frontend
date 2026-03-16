const TIERS = ['S', 'A', 'B', 'C']

export function getTierColors() {
  const style = getComputedStyle(document.documentElement)
  return Object.fromEntries(
    TIERS.map((t) => [t, style.getPropertyValue(`--tier-${t.toLowerCase()}`).trim()])
  )
}

export function getCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
