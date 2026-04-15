import { hrApi } from '@/services/apiClient'

const AVATAR_COLORS = ['#5f50d6', '#269063', '#c08b00', '#d04060', '#2288cc']

function avatarColor(name) {
  let hash = 0
  for (const ch of (name ?? '')) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function toNumber(v, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function mapMember(item) {
  return {
    id: item.employeeId,
    name: item.employeeName ?? '-',
    avatar: item.employeeName?.charAt(0) ?? '?',
    avatarColor: avatarColor(item.employeeName),
    tier: item.employeeTier ?? '-',
    code: '',
    team: item.teamName ?? '',
    line: '',
    experience: '',
    score: toNumber(item.qualitativeScore),
    qualitative: toNumber(item.qualitativeScore),
    quantitative: null,
    composite: null,
    grade: item.grade ?? '-',
    evalStatus: item.evalStatus ?? '-',
    skills: [],
    tierHistory: [],
  }
}

export async function fetchDlCapabilityMembers({ page = 0, size = 50 } = {}) {
  const res = await hrApi.get('/api/v1/hr/department-leader/members', { params: { page, size } })
  const items = res.data?.data ?? []
  return items.map(mapMember)
}
