<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { BaseFilterTabs, BaseProgressBar } from '@/components/common/base'
import { BaseToast } from '@/components/common/base/overlay'
import ReviewerAppealDetailPanel from '@/components/hr/common/appeal/ReviewerAppealDetailPanel.vue'
import ReviewerAppealListPanel from '@/components/hr/common/appeal/ReviewerAppealListPanel.vue'
import DepartmentLeaderEvalMemberListPanel from '@/components/hr/departmentleader/second-evaluation/DepartmentLeaderEvalMemberListPanel.vue'
import DepartmentLeaderEvalFormPanel from '@/components/hr/departmentleader/second-evaluation/DepartmentLeaderEvalFormPanel.vue'
import { approveDlAppeal, fetchDlAppealDetail, fetchDlAppeals, fetchDlTargets, fetchDlEvaluationDetail, rejectDlAppeal, updateDlEvaluation } from '@/services/departmentleader/evaluationApi'
import { formatEvaluationPeriodLabel } from '@/utils/evaluationPeriod'
import { formatMemberMeta } from '@/utils/hrListFormat'
import { mapStatus, statusToLabel } from '@/utils/evaluationStatus'

const members = ref([])
const selectedMember = ref(null)
const evalPeriodId = ref(null)
const periodInfo = ref(null)
const toast = ref({ show: false, message: '', type: 'success' })
const activeTab = ref('evaluation')
const appealSummaries = ref([])
const selectedAppealId = ref(null)
const selectedAppealDetail = ref(null)
const appealActionLoading = ref(false)
const appealReviewing = ref(false)
const appealDraftMember = ref(null)
const APPEAL_TYPE_LABEL = {
  SCORE_ERRORS: '점수 오류',
  MISSING_ITEMS: '평가 항목 누락',
  EVALUATION_PROCEDURES: '평가 절차 이의',
  OTHERS: '기타',
}
const APPEAL_STATUS_LABEL = {
  SUBMITTED: '제출',
  RECEIVING: '접수',
  REVIEWING: '검토중',
  COMPLETED: '완료',
}
const REVIEW_RESULT_LABEL = {
  ACKNOWLEDGE: '인용',
  ACKNOWLEDGE_IN_PART: '일부 인용',
  DISMISS: '기각',
}

function unwrap(response) {
  return response.data?.data ?? response.data
}

function formatShortDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

function formatScore(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? `${numeric.toFixed(1)}점` : '-'
}

function formatPeriodText(evalYear, evalSequence) {
  return formatEvaluationPeriodLabel(
    { evalYear, evalSequence },
    { fallback: '평가기간 미지정' },
  )
}

function mapAppealSummary(appeal) {
  return {
    appealId: appeal.appealId,
    appealEmployeeId: appeal.appealEmployeeId,
    evaluationPeriodId: appeal.evaluationPeriodId,
    employeeName: appeal.employeeName ?? '-',
    employeeCode: appeal.employeeCode ?? '',
    departmentName: appeal.departmentName ?? '',
    teamName: appeal.teamName ?? '',
    title: appeal.title ?? '제목 없음',
    content: appeal.content ?? '내용이 없습니다.',
    status: appeal.status ?? 'RECEIVING',
    statusLabel: APPEAL_STATUS_LABEL[appeal.status] ?? (appeal.status ?? '-'),
    appealTypeLabel: APPEAL_TYPE_LABEL[appeal.appealType] ?? (appeal.appealType ?? '-'),
    filedAtLabel: formatShortDate(appeal.filedAt),
    quantScoreLabel: '-',
    firstScoreLabel: formatScore(appeal.firstScore),
    secondScoreLabel: formatScore(appeal.secondScore),
    finalScoreLabel: formatScore(appeal.finalScore),
    periodLabel: formatPeriodText(appeal.evalYear, appeal.evalSequence),
    firstStageComment: '',
    secondStageComment: '',
  }
}

function mapAppealDetail(appeal) {
  if (!appeal) return null
  return {
    appealId: appeal.appealId,
    appealEmployeeId: appeal.appealEmployeeId,
    evaluationPeriodId: appeal.evaluationPeriodId,
    employeeName: appeal.employeeName ?? '-',
    employeeCode: appeal.employeeCode ?? '',
    departmentName: appeal.departmentName ?? '',
    teamName: appeal.teamName ?? '',
    title: appeal.title ?? '제목 없음',
    content: appeal.content ?? '내용이 없습니다.',
    status: appeal.status ?? 'RECEIVING',
    statusLabel: APPEAL_STATUS_LABEL[appeal.status] ?? (appeal.status ?? '-'),
    appealTypeLabel: APPEAL_TYPE_LABEL[appeal.appealType] ?? (appeal.appealType ?? '-'),
    reviewResultLabel: REVIEW_RESULT_LABEL[appeal.reviewResult] ?? '미처리',
    filedAtLabel: formatShortDate(appeal.filedAt),
    reviewedAtLabel: formatShortDate(appeal.reviewedAt),
    quantScoreLabel: '-',
    firstScoreLabel: formatScore(appeal.firstScore),
    secondScoreLabel: formatScore(appeal.secondScore),
    finalScoreLabel: formatScore(appeal.finalScore),
    periodLabel: formatPeriodText(appeal.evalYear, appeal.evalSequence),
    firstStageComment: appeal.firstStageComment ?? '',
    secondStageComment: appeal.secondStageComment ?? '',
  }
}

const periodLabel = computed(() => {
  if (!periodInfo.value?.evalYear) return null
  const label = formatEvaluationPeriodLabel(periodInfo.value, { fallback: null })
  return label ? `${label} 평가` : null
})
const isClosedPeriod = computed(() => Boolean(periodInfo.value?.status) && periodInfo.value.status !== 'IN_PROGRESS')
let toastTimer = null

const totalCount = computed(() => members.value.length)
const submittedCount = computed(() => members.value.filter((m) => m.status === 'submitted').length)
const progressPercent = computed(() => (totalCount.value > 0 ? (submittedCount.value / totalCount.value) * 100 : 0))
const isSubmitted = computed(() => isClosedPeriod.value || selectedMember.value?.status === 'submitted')
const evaluationPendingCount = computed(() => (isClosedPeriod.value ? 0 : members.value.filter((m) => m.status !== 'submitted').length))
const modeTabs = computed(() => [
  { key: 'evaluation', label: '평가 관리', count: evaluationPendingCount.value },
  { key: 'appeal', label: '이의신청', count: appealSummaries.value.length },
])

const AVATAR_COLORS = ['#5f50d6', '#269063', '#c08b00', '#b03060', '#2070b0', '#806030']

function avatarColor(name) {
  let hash = 0
  for (const ch of name ?? '') hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

function mapTarget(t) {
  const status = mapStatus(t.status)
  return {
    id: t.evaluateeId,
    evaluationPeriodId: t.evaluationPeriodId,
    name: t.employeeName,
    avatar: (t.employeeName ?? '?')[0],
    avatarColor: avatarColor(t.employeeName),
    tier: t.employeeTier ?? '—',
    code: t.employeeCode ?? '',
    departmentName: t.departmentName ?? '',
    team: t.teamName ?? '',
    meta: formatMemberMeta(t.employeeCode ?? '', t.departmentName ?? '', t.teamName ?? ''),
    experience: '',
    status,
    statusDate: statusToLabel(status, t.status),
    secondEvaluationDraft: t.evalComment ?? '',
    firstEvaluationSummary: null,
    expectedScore: t.secondStageScore ?? null,
  }
}

function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 2500)
}

async function loadTargets() {
  try {
    const res = await fetchDlTargets()
    const data = unwrap(res)
    evalPeriodId.value = data.evalPeriodId
    periodInfo.value = {
      evalYear: data.evalYear,
      evalSequence: data.evalSequence,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
    }
    members.value = data.targets.map(mapTarget)
    if (members.value.length > 0) {
      await handleSelect(members.value[0])
    }
  } catch {
    showToast('평가 대상 목록을 불러오지 못했습니다.', 'error')
  }
}

async function loadAppeals() {
  try {
    const res = await fetchDlAppeals(evalPeriodId.value)
    const appeals = (unwrap(res) ?? []).map(mapAppealSummary)
    appealSummaries.value = appeals
    if (appeals.length) {
      await handleSelectAppeal(appeals[0].appealId)
    }
  } catch {
    showToast('이의신청 목록을 불러오지 못했습니다.', 'error')
  }
}

async function handleSelect(member) {
  selectedMember.value = { ...member }
  if (member.firstEvaluationSummary != null) return

  try {
    const res = await fetchDlEvaluationDetail(member.id, evalPeriodId.value)
    const detail = res.data.data
    const idx = members.value.findIndex((m) => m.id === member.id)
    if (idx === -1) return
    const updated = {
      ...members.value[idx],
      firstEvaluationSummary: {
        quantitativeScore: null,
        qualitativeScore: detail.firstStageScore ?? null,
        compositeScore: null,
        qualitativeComment: detail.evalComment ?? '',
      },
      expectedScore: members.value[idx].expectedScore ?? null,
    }
    members.value[idx] = updated
    if (selectedMember.value?.id === member.id) {
      selectedMember.value = updated
    }
  } catch {
    // 1차 평가 상세가 없으면 summary null 유지 (v-if로 처리)
  }
}

async function handleSelectAppeal(appealId) {
  appealReviewing.value = false
  appealDraftMember.value = null
  selectedAppealId.value = appealId
  const summary = appealSummaries.value.find((item) => item.appealId === appealId)
  if (summary) {
    selectedAppealDetail.value = { ...summary }
  }
  try {
    const res = await fetchDlAppealDetail(appealId)
    selectedAppealDetail.value = {
      ...(summary ?? {}),
      ...mapAppealDetail(unwrap(res)),
    }
  } catch {
    selectedAppealDetail.value = null
    showToast('이의신청 상세를 불러오지 못했습니다.', 'error')
  }
}

function buildAppealDraftMember(detail, firstEvaluationSummary) {
  return {
    id: detail.appealEmployeeId,
    evaluationPeriodId: detail.evaluationPeriodId,
    name: detail.employeeName,
    code: detail.employeeCode ?? '',
    departmentName: detail.departmentName ?? '',
    team: detail.teamName ?? '',
    secondEvaluationDraft: detail.secondStageComment || '',
    firstEvaluationSummary,
    expectedScore: null,
  }
}

async function handleStartAppealReview() {
  const detail = selectedAppealDetail.value
  if (!detail?.appealEmployeeId || !detail.evaluationPeriodId) return
  try {
    const res = await fetchDlEvaluationDetail(detail.appealEmployeeId, detail.evaluationPeriodId)
    const evaluationDetail = unwrap(res)
    appealDraftMember.value = buildAppealDraftMember(detail, {
      quantitativeScore: null,
      qualitativeScore: evaluationDetail.firstStageScore ?? null,
      compositeScore: null,
      qualitativeComment: evaluationDetail.evalComment ?? detail.firstStageComment ?? '',
    })
  } catch {
    appealDraftMember.value = buildAppealDraftMember(detail, {
      quantitativeScore: null,
      qualitativeScore: null,
      compositeScore: null,
      qualitativeComment: detail.firstStageComment || '',
    })
  }
  appealReviewing.value = true
}

const selectedAppealInfo = computed(() => {
  const detail = selectedAppealDetail.value
  if (!detail) return null
  return {
    periodLabel: detail.periodLabel,
    typeLabel: detail.appealTypeLabel,
    title: detail.title,
    content: detail.content,
  }
})

async function handleApproveAppeal(payload) {
  if (!selectedAppealId.value || !appealDraftMember.value) return
  try {
    appealActionLoading.value = true
    await updateDlEvaluation(appealDraftMember.value.id, {
      status: 'SUBMITTED',
      evaluationPeriodId: appealDraftMember.value.evaluationPeriodId,
      evalComment: payload?.draftText ?? appealDraftMember.value.secondEvaluationDraft ?? '',
      inputMethod: payload?.inputMethod ?? 'TEXT',
    })
    await approveDlAppeal(selectedAppealId.value, {})
    const appeals = (unwrap(await fetchDlAppeals(evalPeriodId.value)) ?? []).map(mapAppealSummary)
    appealSummaries.value = appeals
    selectedAppealDetail.value = null
    appealDraftMember.value = null
    appealReviewing.value = false
    selectedAppealId.value = appeals[0]?.appealId ?? null
    if (selectedAppealId.value) {
      await handleSelectAppeal(selectedAppealId.value)
    }
    showToast('이의신청을 인용 완료 처리했습니다.')
  } catch {
    showToast('이의신청 처리에 실패했습니다.', 'error')
  } finally {
    appealActionLoading.value = false
  }
}

async function handleRejectAppeal() {
  if (!selectedAppealId.value) return
  try {
    appealActionLoading.value = true
    await rejectDlAppeal(selectedAppealId.value, { reason: '부서장 단계에서 일부 인용으로 종료되었습니다.' })
    const appeals = (unwrap(await fetchDlAppeals(evalPeriodId.value)) ?? []).map(mapAppealSummary)
    appealSummaries.value = appeals
    selectedAppealDetail.value = null
    appealDraftMember.value = null
    appealReviewing.value = false
    selectedAppealId.value = appeals[0]?.appealId ?? null
    if (selectedAppealId.value) {
      await handleSelectAppeal(selectedAppealId.value)
    }
    showToast('이의신청을 일부 인용으로 종료했습니다.')
  } catch {
    showToast('이의신청 처리에 실패했습니다.', 'error')
  } finally {
    appealActionLoading.value = false
  }
}

async function handleSave(payload) {
  if (!selectedMember.value) return
  if (isClosedPeriod.value) {
    showToast('마감된 평가기간은 수정할 수 없습니다.', 'error')
    return
  }
  const draftText = payload?.draftText ?? ''
  const inputMethod = payload?.inputMethod ?? 'TEXT'
  try {
    await updateDlEvaluation(selectedMember.value.id, {
      status: 'DRAFT',
      evaluationPeriodId: selectedMember.value.evaluationPeriodId,
      evalComment: draftText,
      inputMethod,
    })
    const idx = members.value.findIndex((m) => m.id === selectedMember.value.id)
    const updated = { ...members.value[idx], secondEvaluationDraft: draftText, status: 'in_progress', statusDate: statusToLabel('in_progress', 'DRAFT') }
    members.value[idx] = updated
    selectedMember.value = updated
    showToast('임시저장 되었습니다.')
  } catch {
    showToast('임시저장에 실패했습니다.', 'error')
  }
}

async function handleSubmit(payload) {
  if (!selectedMember.value) return
  if (isSubmitted.value) return
  if (isClosedPeriod.value) {
    showToast('마감된 평가기간은 제출할 수 없습니다.', 'error')
    return
  }
  const draftText = payload?.draftText ?? ''
  const inputMethod = payload?.inputMethod ?? 'TEXT'
  try {
    await updateDlEvaluation(selectedMember.value.id, {
      status: 'SUBMITTED',
      evaluationPeriodId: selectedMember.value.evaluationPeriodId,
      evalComment: draftText,
      inputMethod,
    })
    const idx = members.value.findIndex((m) => m.id === selectedMember.value.id)
    const updated = { ...members.value[idx], secondEvaluationDraft: draftText, status: 'submitted', statusDate: statusToLabel('submitted', 'SUBMITTED') }
    members.value[idx] = updated
    selectedMember.value = updated
    showToast('최종 제출 완료되었습니다.')
  } catch (e) {
    const errCode = e?.response?.data?.errorCode
    if (errCode === 'CONFLICT_008') {
      const idx = members.value.findIndex((m) => m.id === selectedMember.value.id)
      const updated = { ...members.value[idx], status: 'submitted' }
      members.value[idx] = updated
      selectedMember.value = updated
    } else {
      showToast('제출에 실패했습니다.', 'error')
    }
  }
}

onMounted(async () => {
  await loadTargets()
  await loadAppeals()
})
onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <section class="dl-eval-view">
    <BaseFilterTabs
      v-model="activeTab"
      :items="modeTabs"
      variant="underline"
      size="md"
      :show-count="true"
      class="dl-eval-view__tabs"
    />

    <div v-if="activeTab === 'evaluation'" class="dl-eval-view__content">
      <section class="dl-eval-view__progress-card dl-eval-view__progress-card--full">
        <div v-if="isClosedPeriod" class="dl-eval-view__closed-notice">
          이 평가 기간은 마감되었습니다. 조회만 가능합니다.
        </div>
        <div class="dl-eval-view__progress-copy">
          <div>
            <p class="dl-eval-view__progress-eyebrow">{{ isClosedPeriod ? '확정 현황' : '제출 완료 현황' }}</p>
            <strong class="dl-eval-view__progress-title">
              {{ submittedCount }} / {{ totalCount }}명 {{ isClosedPeriod ? '확정' : '제출 완료' }}
            </strong>
          </div>
          <div v-if="periodLabel" class="dl-eval-view__period-info">
            <span class="dl-eval-view__period-badge">{{ periodLabel }}</span>
            <span class="dl-eval-view__period-dates">
              {{ periodInfo.startDate }} ~ {{ periodInfo.endDate }}
            </span>
          </div>
        </div>
        <BaseProgressBar
          :value="progressPercent"
          tone="success"
          size="md"
          label="평가 제출 진행률"
        />
      </section>

      <DepartmentLeaderEvalMemberListPanel
        :members="members"
        :selected-id="selectedMember?.id ?? null"
        @select="handleSelect($event)"
      />
      <DepartmentLeaderEvalFormPanel
        :member="selectedMember"
        :readonly="isSubmitted"
        @save="handleSave"
        @submit="handleSubmit"
      />
    </div>

    <div v-else class="dl-eval-view__appeal-content">
      <ReviewerAppealListPanel
        :appeals="appealSummaries"
        :selected-id="selectedAppealId"
        role-label="DL"
        @select="handleSelectAppeal"
      />
      <DepartmentLeaderEvalFormPanel
        v-if="appealReviewing"
        :member="appealDraftMember"
        :appeal-info="selectedAppealInfo"
        :readonly="false"
        progress-label="이의신청 검토 작성 현황"
        submit-label="검토 제출"
        @save="handleSaveAppealDraft"
        @submit="handleApproveAppeal"
      />
      <ReviewerAppealDetailPanel
        v-else
        :detail="selectedAppealDetail"
        role-label="DL"
        action-mode="dl"
        :loading="appealActionLoading"
        @review="handleStartAppealReview"
        @reject="handleRejectAppeal"
      />
    </div>
    <BaseToast :show="toast.show" :message="toast.message" :type="toast.type" />
  </section>
</template>

<style scoped>
.dl-eval-view {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: calc(100vh - 80px);
  padding: 12px 10px;
  background: var(--color-bg-app);
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
}

/* Progress card */
.dl-eval-view__progress-card {
  display: grid;
  gap: 10px;
  padding: 14px 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
}

.dl-eval-view__progress-card--full {
  grid-column: 1 / -1;
  margin-bottom: 12px;
}

.dl-eval-view__closed-notice {
  padding: 10px 14px;
  background: #fefce8;
  border: 1px solid #fde68a;
  border-radius: 10px;
  font-size: var(--font-size-xs-plus);
  color: #92400e;
}

.dl-eval-view__tabs {
  align-self: flex-start;
  margin-bottom: 12px;
  width: auto;
  padding: 6px;
  border: 1px solid #ece8ff;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #faf8ff 100%);
}

.dl-eval-view__tabs :deep(.base-filter-tabs) {
  gap: 8px;
  border-bottom: none;
}

.dl-eval-view__tabs :deep(.base-filter-tabs__item) {
  height: 40px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  color: #9c93c9;
  font-weight: var(--font-weight-bold);
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.dl-eval-view__tabs :deep(.base-filter-tabs__item--active) {
  color: var(--color-primary-700);
  border-color: #ddd1ff;
  background: #f3edff;
}

.dl-eval-view__tabs :deep(.base-filter-tabs__count) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(108, 86, 219, 0.12);
  color: var(--color-primary-600);
  font-size: var(--font-size-xs);
  font-weight: 800;
}

.dl-eval-view__tabs :deep(.base-filter-tabs__item--active .base-filter-tabs__count) {
  background: var(--color-primary-600);
  color: #fff;
}

.dl-eval-view__tabs :deep(.base-filter-tabs__item:nth-child(2)) {
  color: #c24157;
}

.dl-eval-view__tabs :deep(.base-filter-tabs__item:nth-child(2) .base-filter-tabs__count) {
  background: rgba(194, 65, 87, 0.12);
  color: #c24157;
}

.dl-eval-view__tabs :deep(.base-filter-tabs__item:nth-child(2).base-filter-tabs__item--active) {
  color: #a61d38;
  border-color: rgba(232, 137, 152, 0.5);
  background: #fff1f3;
}

.dl-eval-view__tabs :deep(.base-filter-tabs__item:nth-child(2).base-filter-tabs__item--active .base-filter-tabs__count) {
  background: #c24157;
  color: #fff;
}

.dl-eval-view__tabs :deep(.base-filter-tabs__item:nth-child(2).base-filter-tabs__item--active .base-filter-tabs__count) {
  background: #c24157;
  color: #fff;
}

.dl-eval-view__progress-copy {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.dl-eval-view__progress-eyebrow {
  margin: 0 0 4px;
  color: var(--color-primary-500);
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-semibold);
}

.dl-eval-view__progress-title {
  color: var(--color-primary-800);
  font-size: var(--font-size-base-plus);
  font-weight: var(--font-weight-bold);
}

.dl-eval-view__period-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.dl-eval-view__period-badge {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.dl-eval-view__period-dates {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  white-space: nowrap;
}

/* Content grid */
.dl-eval-view__content {
  display: grid;
  grid-template-columns: minmax(270px, 0.72fr) minmax(0, 1.6fr);
  gap: 18px;
  align-items: stretch;
  min-height: 0;
}

.dl-eval-view__appeal-content {
  display: grid;
  grid-template-columns: minmax(270px, 0.72fr) minmax(0, 1.6fr);
  gap: 18px;
  align-items: stretch;
  min-height: 0;
}

@media (max-width: 900px) {
  .dl-eval-view__content {
    grid-template-columns: 1fr;
  }

  .dl-eval-view__appeal-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .dl-eval-view {
    padding: 12px;
    height: auto;
    min-height: calc(100vh - 80px);
    overflow: auto;
  }

  .dl-eval-view__progress-copy {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
async function handleSaveAppealDraft(payload) {
  if (!appealDraftMember.value) return
  try {
    await updateDlEvaluation(appealDraftMember.value.id, {
      status: 'DRAFT',
      evaluationPeriodId: appealDraftMember.value.evaluationPeriodId,
      evalComment: payload?.draftText ?? appealDraftMember.value.secondEvaluationDraft ?? '',
      inputMethod: payload?.inputMethod ?? 'TEXT',
    })
    appealDraftMember.value = {
      ...appealDraftMember.value,
      secondEvaluationDraft: payload?.draftText ?? '',
    }
    showToast('검토 초안을 임시저장했습니다.')
  } catch {
    showToast('검토 초안 저장에 실패했습니다.', 'error')
  }
}

function handleCloseAppealReview() {
  appealReviewing.value = false
  appealDraftMember.value = null
}
