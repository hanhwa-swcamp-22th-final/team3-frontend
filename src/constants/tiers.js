export const TIERS = ['S', 'A', 'B', 'C']

export const TIER_COLORS = {
  S: '#00BF95',
  A: '#5B4FCF',
  B: '#FFD166',
  C: '#EF476F',
}

export const TIER_BG_COLORS = {
  S: '#E3FBEF',
  A: '#F0EEFF',
  B: '#FFF8E1',
  C: '#FDE8ED',
}

export const TIER_TEXT_COLORS = {
  S: '#fff',
  A: '#fff',
  B: '#855900',
  C: '#fff',
}

export const TIER_BADGE_STYLES = {
  S: { bg: '#00BF95', text: '#fff' },
  A: { bg: '#5B4FCF', text: '#fff' },
  B: { bg: '#FFD166', text: '#855900' },
  C: { bg: '#EF476F', text: '#fff' },
}

export const TIER_BAR_COLORS = {
  S: '#00BF95',
  A: '#5B4FCF',
  B: '#5B4FCF',
  C: '#E0DCFF',
  none: '#E8E5F5',
}

export function tierColor(tier) {
  return TIER_COLORS[tier] || '#9992b8'
}

export function tierBgColor(tier) {
  return TIER_BG_COLORS[tier] || '#f5f5f5'
}

export function tierBarColor(tier) {
  return TIER_BAR_COLORS[tier] || '#E8E5F5'
}

export function tierTextColor(tier) {
  return tier === 'B' ? '#1A1000' : '#FFFFFF'
}
