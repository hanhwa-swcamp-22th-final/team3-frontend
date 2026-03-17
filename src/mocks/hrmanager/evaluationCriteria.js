export const defaultQuantWeight = 60

export const defaultThresholds = { S: 90, A: 75, B: 60 }

export const defaultQuantItems = [
  { key: 'completion',  label: '작업 완료율',     weight: 30 },
  { key: 'defect',      label: '불량률 (역산)',    weight: 25 },
  { key: 'eidx',        label: '설비 E_idx 반영', weight: 20 },
  { key: 'difficulty',  label: '작업 난이도 가중', weight: 15 },
  { key: 'deadline',    label: '납기 준수율',      weight: 10 },
]
