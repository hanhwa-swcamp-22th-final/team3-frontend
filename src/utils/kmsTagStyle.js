const TAG_PALETTE = [
  {
    bg: 'var(--color-success-soft, #dcfce7)',
    color: 'var(--color-success-text, #028a6b)',
  },
  {
    bg: 'var(--color-primary-100, #efeaff)',
    color: 'var(--color-primary-700, #5b4fcf)',
  },
  {
    bg: 'var(--color-warning-soft, #fef3c7)',
    color: 'var(--color-warning-text, #a07000)',
  },
  {
    bg: 'var(--color-danger-bg, #ffecf1)',
    color: 'var(--color-danger-text, #c0103e)',
  },
  {
    bg: 'var(--color-bg-surface-muted, #f8f7ff)',
    color: 'var(--color-text-muted, #7a6fa8)',
  },
]

function getPaletteIndex(tag) {
  const value = String(tag ?? '')
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % TAG_PALETTE.length
  }
  return Math.abs(hash) % TAG_PALETTE.length
}

export function getKmsTagStyle(tag) {
  if (!tag) {
    return TAG_PALETTE[0]
  }
  return TAG_PALETTE[getPaletteIndex(tag)]
}

export function buildKmsTagFilters(tags = []) {
  return tags.map((tag) => ({
    key: tag,
    ...getKmsTagStyle(tag),
  }))
}
