<script setup>
import { ref, computed, onMounted } from 'vue'
import { API_BASE, SCORE_WEIGHT_QUANT, SCORE_WEIGHT_QUAL, GRADE_THRESHOLDS, AI_TAG_LIMIT, TYPE_STYLE, GRADE_STYLE, EVAL_TYPE_LABEL, scoreToGrade } from '@/constants'
import HRMApprovalBanner from '@/components/hr/hrmanager/evaluation-approval/HRMApprovalBanner.vue'
import HRMApprovalList   from '@/components/hr/hrmanager/evaluation-approval/HRMApprovalList.vue'
import HRMApprovalDetail from '@/components/hr/hrmanager/evaluation-approval/HRMApprovalDetail.vue'

// ── 유틸 함수 ─────────────────────────────────────────────────────
function gradeStyle(grade) {
  const key = grade?.includes('→') ? grade.slice(-1) : grade
  return GRADE_STYLE[key] ?? GRADE_STYLE['B']
}

function shortDate(dateStr) {
  if (!dateStr) return '-'
  const parts = dateStr.split('.')
  return parts.length >= 3 ? `${parts[1]}.${parts[2]}` : dateStr
}

function calcQualScore(categories) {
  return Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length)
}

function calcQuantScore(steps) {
  return parseFloat(steps[steps.length - 1].value)
}

function calcTotalScore(quantScore, qualScore) {
  if (quantScore != null && qualScore != null)
    return (quantScore * SCORE_WEIGHT_QUANT + qualScore * SCORE_WEIGHT_QUAL).toFixed(1)
  const score = qualScore ?? quantScore
  return score != null ? score.toFixed(1) : '-'
}

function extractAiTags(categories) {
  return categories.flatMap(c => c.tags).slice(0, AI_TAG_LIMIT)
}

// ── 상태 ──────────────────────────────────────────────────────────
const approvalList = ref([])
const loading      = ref(true)
const error        = ref(null)
const activeTab    = ref('전체')
const tabs         = ['전체', '승급신청', '정기평가', '이의신청']
const selectedId   = ref(null)

// ── 데이터 로딩 ───────────────────────────────────────────────────
onMounted(async () => {
  try {
    const fetchJson = url => fetch(url).then(r => r.json())
    const [empData, qualData, quantData, teamData, appealData, promotionData] = await Promise.all([
      fetchJson(`${API_BASE}/employees`),
      fetchJson(`${API_BASE}/qualitativeEval`),
      fetchJson(`${API_BASE}/quantitativeEval`),
      fetchJson(`${API_BASE}/teamStats`),
      fetchJson(`${API_BASE}/appealForms`),
      fetchJson(`${API_BASE}/tierPromotions`),
    ])

    const result = []

    // 1. 정기평가
    for (const qual of qualData) {
      const emp   = empData.find(e => e.employee_id === qual.employee_id)
      if (!emp) continue
      const team  = teamData.find(t => t.id === emp.team_id)
      const quant = quantData.find(q => q.employee_id === emp.employee_id)

      const qualScore  = calcQualScore(qual.categories)
      const quantScore = quant ? calcQuantScore(quant.steps) : null
      const totalScore = calcTotalScore(quantScore, qualScore)
      const grade      = emp.employee_current_tier ?? scoreToGrade(parseFloat(totalScore))

      result.push({
        id: `qual-${qual.id}`,
        type: '정기평가',
        ...TYPE_STYLE['정기평가'],
        name: emp.employee_name,
        grade,
        ...gradeStyle(grade),
        desc: '2026년 1분기',
        date: '03.10',
        detail: {
          avatar: emp.employee_name[0],
          dept: team?.team ?? '-',
          evalType: EVAL_TYPE_LABEL['정기평가'],
          quantScore: quantScore != null ? quantScore.toFixed(1) : '-',
          qualScore: qualScore.toFixed(1),
          totalScore,
          quantDiff: '', qualDiff: '', totalDiff: '',
          aiTags: extractAiTags(qual.categories),
          dataTrust: `${(qual.nlpConfidence * 100).toFixed(0)}%`,
          comment: qual.aiAnalysis,
          commentDate: '2026.03.10',
          objection: appealData.some(a => a.employee_id === emp.employee_id),
        },
      })
    }

    // 2. 승급신청
    for (const promo of promotionData) {
      const emp   = empData.find(e => e.employee_id === promo.employee_id)
      if (!emp) continue
      const team  = teamData.find(t => t.id === emp.team_id)
      const qual  = qualData.find(q => q.employee_id === promo.employee_id)
      const quant = quantData.find(q => q.employee_id === promo.employee_id)
      const grade = `${promo.current_tier}→${promo.target_tier}`

      const qualScore  = qual  ? calcQualScore(qual.categories)    : null
      const quantScore = quant ? calcQuantScore(quant.steps)       : null
      const totalScore = calcTotalScore(quantScore, qualScore)

      result.push({
        id: `promo-${promo.tier_promotion_id}`,
        type: '승급신청',
        ...TYPE_STYLE['승급신청'],
        name: emp.employee_name,
        grade,
        ...gradeStyle(grade),
        desc: `누적 포인트 ${promo.tier_accumulated_point}점`,
        date: shortDate(promo.created_at?.slice(0, 10).replace(/-/g, '.')),
        detail: {
          avatar: emp.employee_name[0],
          dept: team?.team ?? '-',
          evalType: EVAL_TYPE_LABEL['승급신청'],
          quantScore: quantScore != null ? quantScore.toFixed(1) : '-',
          qualScore:  qualScore  != null ? qualScore.toFixed(1)  : '-',
          totalScore,
          quantDiff: '', qualDiff: '', totalDiff: '',
          aiTags: qual ? extractAiTags(qual.categories) : [],
          dataTrust: qual ? `${(qual.nlpConfidence * 100).toFixed(0)}%` : '-',
          comment: qual?.aiAnalysis ?? '코멘트 없음',
          commentDate: promo.created_at?.slice(0, 10).replace(/-/g, '.') ?? '-',
          objection: false,
        },
      })
    }

    // 3. 이의신청
    for (const appeal of appealData) {
      const emp  = empData.find(e => e.employee_id === appeal.employee_id)
      if (!emp) continue
      const team = teamData.find(t => t.id === emp.team_id)
      const qual = qualData.find(q => q.employee_id === emp.employee_id)

      const grade  = emp.employee_current_tier ?? scoreToGrade(appeal.scores.composite)
      const aiTags = qual
        ? extractAiTags(qual.categories).slice(0, 3).concat(['재검토요청'])
        : [appeal.reason, '재검토요청'].filter(Boolean)

      result.push({
        id: `appeal-${appeal.id}`,
        type: '이의신청',
        ...TYPE_STYLE['이의신청'],
        name: emp.employee_name,
        grade,
        ...gradeStyle(grade),
        desc: appeal.reason || appeal.quarter,
        date: shortDate(appeal.submittedDate),
        detail: {
          avatar: emp.employee_name[0],
          dept: team?.team ?? '-',
          evalType: EVAL_TYPE_LABEL['이의신청'],
          quantScore: appeal.scores.quantitative.toFixed(1),
          qualScore:  appeal.scores.qualitative.toFixed(1),
          totalScore: appeal.scores.composite.toFixed(1),
          quantDiff: '', qualDiff: '', totalDiff: '',
          aiTags,
          dataTrust: qual ? `${(qual.nlpConfidence * 100).toFixed(0)}%` : '-',
          comment: appeal.content || '내용 없음',
          commentDate: appeal.submittedDate || '-',
          objection: true,
        },
      })
    }

    approvalList.value = result
    if (result.length > 0) selectedId.value = result[0].id
  } catch (e) {
    console.error(e)
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
})

// ── computed ──────────────────────────────────────────────────────
const filteredList = computed(() => {
  if (activeTab.value === '전체') return approvalList.value
  return approvalList.value.filter(item => item.type === activeTab.value)
})

const selectedItem = computed(() =>
  approvalList.value.find(item => item.id === selectedId.value)
)

// ── 액션 핸들러 ───────────────────────────────────────────────────
function handleApprove() { alert(`${selectedItem.value.name} 승인 완료`) }
function handleReject()  { alert(`${selectedItem.value.name} 반려`) }
function handleHold()    { alert(`${selectedItem.value.name} 보류`) }
</script>

<template>
  <div class="hrm-approval">
    <div v-if="loading" class="hrm-approval__loading">불러오는 중...</div>
    <div v-else-if="error" class="hrm-approval__error">{{ error }}</div>
    <template v-else>
      <HRMApprovalBanner :count="approvalList.length" />

      <div class="hrm-approval__content">
        <HRMApprovalList
          :list="filteredList"
          :total="approvalList.length"
          :tabs="tabs"
          :active-tab="activeTab"
          :selected-id="selectedId"
          @tab-change="activeTab = $event"
          @select="selectedId = $event"
        />
        <HRMApprovalDetail
          v-if="selectedItem"
          :item="selectedItem"
          @approve="handleApprove"
          @reject="handleReject"
          @hold="handleHold"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.hrm-approval {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 28px;
  background: var(--color-bg-app);
  overflow: auto;
  min-height: 0;
}
.hrm-approval__loading { color: #a89ed8; font-size: var(--font-size-base); }
.hrm-approval__error   { color: var(--color-danger); font-size: var(--font-size-base); }
.hrm-approval__content { display: flex; gap: 16px; align-items: flex-start; flex: 1; min-height: 0; }
</style>
