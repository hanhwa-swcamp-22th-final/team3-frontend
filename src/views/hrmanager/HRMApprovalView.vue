<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { TYPE_STYLE } from '@/constants'
import { BaseProgressBar } from '@/components/common/base'
import BaseFilterTabs from '@/components/common/base/navigation/BaseFilterTabs.vue'
import HRMApprovalBanner from '@/components/hr/hrmanager/evaluation-approval/HRMApprovalBanner.vue'
import HRMApprovalList from '@/components/hr/hrmanager/evaluation-approval/HRMApprovalList.vue'
import HRMApprovalDetail from '@/components/hr/hrmanager/evaluation-approval/HRMApprovalDetail.vue'
import { BaseConfirmModal, BaseToast } from '@/components/common/base/overlay'
import hrApprovalApi from '@/services/hrApprovalApi.js'

function shortDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return '-'
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return '-'
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

function formatPercent(done, total) {
  if (!total) return 0
  return Math.round((done / total) * 100)
}

const AVATAR_TONES = ['purple', 'green', 'gold']

const approvalMode = ref('evaluation')

const STATUS_BADGE_STYLE = {
  RECEIVING: { label: '접수', bg: '#eef2ff', color: '#4f46e5' },
  REVIEWING: { label: '보류', bg: '#fef3c7', color: '#92400e' },
  COMPLETED: { label: '완료', bg: '#dcfce7', color: '#166534' },
}

const REVIEW_RESULT_STYLE = {
  ACKNOWLEDGE: { label: '승인', bg: '#d1fae5', color: '#065f46' },
  ACKNOWLEDGE_IN_PART: { label: '부분 인정', bg: '#e0f2fe', color: '#0c4a6e' },
  DISMISS: { label: '반려', bg: '#fee2e2', color: '#991b1b' },
}

const EVALUATION_STATUS_STYLE = {
  NO_INPUT: { label: '미작성', bg: '#f3f4f6', color: '#6b7280' },
  DRAFT: { label: '작성중', bg: '#ede9fe', color: '#6d28d9' },
  SUBMITTED: { label: '검토 대기', bg: '#dbeafe', color: '#1d4ed8' },
  CONFIRMED: { label: '확정 완료', bg: '#d1fae5', color: '#065f46' },
}

function getAppealStatusBadge(status) {
  return STATUS_BADGE_STYLE[status] ?? { label: status ?? '-', bg: '#f3f4f6', color: '#6b7280' }
}

function getAppealProcessedBadge(reviewResult, status) {
  if (status === 'REVIEWING') {
    return { label: '보류', bg: '#fef3c7', color: '#92400e' }
  }
  return REVIEW_RESULT_STYLE[reviewResult] ?? { label: '처리 완료', bg: '#e5e7eb', color: '#4b5563' }
}

function getEvaluationBadge(status) {
  return EVALUATION_STATUS_STYLE[status] ?? { label: status ?? '-', bg: '#f3f4f6', color: '#6b7280' }
}

function normalizeEvaluationLevel(level) {
  const numeric = Number(level)
  if (!Number.isNaN(numeric)) return numeric

  const matched = String(level ?? '').match(/\d+/)
  return matched ? Number(matched[0]) : null
}

function defaultAppealDetail(summary) {
  return {
    avatar: summary.employeeName?.[0] ?? '?',
    dept: '-',
    evalType: '이의신청',
    quarter: '-',
    reason: summary.title || '사유 없음',
    content: '내용 없음',
    attachments: [],
    quantScore: '-',
    qualScore: '-',
    totalScore: '-',
    quantDiff: '',
    qualDiff: '',
    totalDiff: '',
    aiTags: [],
    dataTrust: '-',
    aiAnalysis: '',
    inputMethod: 'TEXT',
  }
}

function defaultEvaluationDetail(summary) {
  return {
    avatar: summary.employeeName?.[0] ?? '?',
    dept: summary.employeeTier ?? '-',
    evalType: '평가 승인',
    quarter: `${summary.evaluationLevel ?? 2}차 평가`,
    reason: summary.inputMethod ?? 'TEXT',
    content: '내용 없음',
    attachments: [],
    quantScore: '-',
    qualScore: summary.score != null ? summary.score.toFixed(1) : '-',
    totalScore: summary.score != null ? summary.score.toFixed(1) : '-',
    quantDiff: '',
    qualDiff: '',
    totalDiff: '',
    aiTags: [],
    dataTrust: '-',
    aiAnalysis: '',
    inputMethod: summary.inputMethod ?? 'TEXT',
    firstStageScore: null,
    firstStageComment: '',
    secondStageScore: null,
    secondStageComment: '',
  }
}

function mapAppealSummaryToItem(summary) {
  const typeStyle = TYPE_STYLE['이의신청']
  const statusBadge = getAppealStatusBadge(summary.status)
  const processedBadge = getAppealProcessedBadge(summary.reviewResult, summary.status)

  return {
    id: `appeal-${summary.appealId}`,
    appealId: summary.appealId,
    rawStatus: summary.status,
    type: '이의신청',
    typeBg: typeStyle.bg,
    typeColor: typeStyle.color,
    name: summary.employeeName,
    grade: statusBadge.label,
    gradeBg: statusBadge.bg,
    gradeColor: statusBadge.color,
    desc: summary.title || '제목 없음',
    date: shortDate(summary.filedAt),
    processedLabel: summary.status === 'COMPLETED' || summary.status === 'REVIEWING' ? processedBadge.label : null,
    processedBg: processedBadge.bg,
    processedColor: processedBadge.color,
    processedReason: null,
    detail: defaultAppealDetail(summary),
  }
}

function mapEvaluationSummaryToItem(summary, index) {
  const badge = getEvaluationBadge(summary.status)
  const frontendStatus = summary.status === 'CONFIRMED' ? 'submitted' : 'in_progress'
  return {
    id: `evaluation-${summary.evalId}`,
    evalId: summary.evalId,
    evaluateeId: summary.evaluateeId,
    evaluationPeriodId: summary.evaluationPeriodId,
    rawStatus: summary.status,
    type: '평가승인',
    typeBg: '#ece8ff',
    typeColor: '#6a4cd8',
    name: summary.employeeName,
    avatar: (summary.employeeName ?? '?')[0],
    avatarTone: AVATAR_TONES[index % AVATAR_TONES.length],
    tier: summary.employeeTier ?? '',
    team: summary.teamName ?? '',
    department: summary.departmentName ?? '',
    meta: [summary.departmentName, summary.teamName].filter(Boolean).join(' > ') || `${summary.evaluationLevel ?? 2}차 평가`,
    status: frontendStatus,
    statusLabel: summary.status === 'CONFIRMED' ? '확정 완료' : '검토 대기',
    statusDate: summary.status === 'CONFIRMED' ? '확정 완료' : '검토 대기',
    grade: summary.employeeTier ?? '-',
    gradeBg: '#f5f3ff',
    gradeColor: '#6d28d9',
    desc: `${summary.evaluationLevel ?? 2}차 평가 ${badge.label}`,
    date: `${summary.evaluationLevel ?? 2}차`,
    processedLabel: summary.status === 'CONFIRMED' ? '확정 완료' : null,
    processedBg: '#d1fae5',
    processedColor: '#065f46',
    processedReason: null,
    detail: defaultEvaluationDetail(summary),
  }
}

function mergeAppealDetail(item, detail) {
  return {
    ...item,
    detail: {
      ...item.detail,
      avatar: detail.employeeName?.[0] ?? item.detail.avatar,
      quarter: formatDate(detail.filedAt),
      reason: detail.title || '사유 없음',
      content: detail.content || '내용 없음',
    },
  }
}

function mergeEvaluationDetail(item, detail) {
  return {
    ...item,
    evaluateeId: detail.evaluateeId,
    evaluationPeriodId: detail.evaluationPeriodId,
    detail: {
      ...item.detail,
      avatar: detail.employeeName?.[0] ?? item.detail.avatar,
      dept: detail.employeeTier ?? '-',
      quarter: `${detail.evaluationLevel ?? 2}차 평가`,
      content: detail.evalComment || '내용 없음',
      qualScore: detail.score != null ? detail.score.toFixed(1) : '-',
      totalScore: detail.score != null ? detail.score.toFixed(1) : '-',
      firstStageScore: detail.firstStageScore != null ? detail.firstStageScore.toFixed(1) : '-',
      firstStageComment: detail.firstStageComment || '',
      secondStageScore: detail.secondStageScore != null ? detail.secondStageScore.toFixed(1) : '-',
      secondStageComment: detail.secondStageComment || '',
    },
  }
}

const loading = ref(true)
const error = ref(null)

const appealPendingList = ref([])
const appealHeldList = ref([])
const appealProcessedList = ref([])
const appealActiveTab = ref('대기중')
const appealTabs = ['대기중', '보류', '처리 완료']
const selectedAppealId = ref(null)
const appealDetails = ref({})
const appealPendingTotalCount = ref(0)
const appealHeldTotalCount = ref(0)
const appealProcessedTotalCount = ref(0)

const evaluationPendingList = ref([])
const evaluationProcessedList = ref([])
const evaluationAllList = computed(() => [...evaluationPendingList.value, ...evaluationProcessedList.value])
const selectedEvaluationId = ref(null)
const evaluationDetails = ref({})
const evaluationPendingTotalCount = ref(0)
const evaluationProcessedTotalCount = ref(0)
const evaluationPeriodSummary = ref(null)

const confirmModal = ref({ show: false, action: null, title: '', message: '', confirmText: '' })
const confirmReason = ref('')
const evaluationConfirmComment = ref('')
const toast = ref({ show: false, message: '' })
let toastTimer = null

const filteredList = computed(() => {
  if (approvalMode.value === 'appeal') {
    return [...appealPendingList.value, ...appealHeldList.value, ...appealProcessedList.value]
  }
  return evaluationAllList.value
})

const selectedItem = computed(() => {
  if (approvalMode.value === 'appeal') {
    return appealPendingList.value.find(item => item.id === selectedAppealId.value)
      ?? appealHeldList.value.find(item => item.id === selectedAppealId.value)
      ?? appealProcessedList.value.find(item => item.id === selectedAppealId.value)
  }

  return evaluationAllList.value.find(item => item.id === selectedEvaluationId.value)
})

const isSelectedProcessed = computed(() => {
  if (approvalMode.value === 'appeal') {
    return appealProcessedList.value.some(item => item.id === selectedAppealId.value)
  }
  return evaluationProcessedList.value.some(item => item.id === selectedEvaluationId.value)  // CONFIRMED 상태
})

const isSelectedHeld = computed(() =>
  approvalMode.value === 'appeal' && appealHeldList.value.some(item => item.id === selectedAppealId.value)
)

const bannerLabel = computed(() => approvalMode.value === 'appeal' ? '이의신청' : '평가')
const evaluationTotalCount = computed(() => evaluationPendingTotalCount.value + evaluationProcessedTotalCount.value)
const evaluationProgressPercent = computed(() => formatPercent(evaluationProcessedTotalCount.value, evaluationTotalCount.value))
const modeTabs = computed(() => [
  { key: 'evaluation', label: '평가 승인', count: evaluationPendingTotalCount.value },
  { key: 'appeal', label: '이의신청 승인', count: appealPendingTotalCount.value },
])

const isConfirmDisabled = computed(() => {
  if (approvalMode.value === 'evaluation') return false
  return confirmModal.value.action !== 'approve' && confirmReason.value.trim().length < 10
})

async function loadAppeals() {
  const status = appealActiveTab.value === '보류'
    ? 'REVIEWING'
    : appealActiveTab.value === '처리 완료'
      ? 'COMPLETED'
      : 'RECEIVING'

  const response = await hrApprovalApi.getAppeals({ page: 0, size: 100, status })
  const content = response.data?.data?.content ?? []
  const totalCount = response.data?.data?.totalCount ?? 0
  const mapped = content.map(mapAppealSummaryToItem)
  if (status === 'RECEIVING') {
    appealPendingList.value = mapped
    appealPendingTotalCount.value = totalCount
  } else if (status === 'REVIEWING') {
    appealHeldList.value = mapped
    appealHeldTotalCount.value = totalCount
  } else {
    appealProcessedList.value = mapped
    appealProcessedTotalCount.value = totalCount
  }
  selectedAppealId.value = mapped[0]?.id ?? null
}

async function loadEvaluations() {
      const [pendingResponse, processedResponse, periodResponse] = await Promise.all([
    hrApprovalApi.getEvaluationApprovals({ page: 0, size: 200, status: 'SUBMITTED' }),
    hrApprovalApi.getEvaluationApprovals({ page: 0, size: 200, status: 'CONFIRMED' }),
    hrApprovalApi.getEvaluationPeriods({ status: 'IN_PROGRESS', page: 0, size: 1 }),
  ])

  const pendingContent = pendingResponse.data?.data?.content ?? []
  const processedContent = processedResponse.data?.data?.content ?? []
  evaluationPeriodSummary.value = periodResponse.data?.data?.content?.[0] ?? null

  evaluationPendingList.value = pendingContent
    .filter(item => normalizeEvaluationLevel(item.evaluationLevel) === 2)
    .map((item, i) => mapEvaluationSummaryToItem(item, i))

  evaluationProcessedList.value = processedContent
    .filter(item => normalizeEvaluationLevel(item.evaluationLevel) === 3)
    .map((item, i) => mapEvaluationSummaryToItem(item, i))

  evaluationPendingTotalCount.value = evaluationPendingList.value.length
  evaluationProcessedTotalCount.value = evaluationProcessedList.value.length
  selectedEvaluationId.value = evaluationPendingList.value[0]?.id ?? evaluationProcessedList.value[0]?.id ?? null
}

async function loadCurrentMode() {
  loading.value = true
  error.value = null
  try {
    if (approvalMode.value === 'appeal') {
      await loadAppeals()
    } else {
      await loadEvaluations()
    }
  } catch (e) {
    console.error(e)
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}

async function loadAppealDetail(itemId) {
  const appealId = Number(String(itemId).replace('appeal-', ''))
  if (!appealId || appealDetails.value[appealId]) return

  const response = await hrApprovalApi.getAppealById(appealId)
  const detail = response.data?.data
  if (!detail) return
  appealDetails.value = { ...appealDetails.value, [appealId]: detail }
  const mergeIntoList = (list) => list.map(item => item.appealId === appealId ? mergeAppealDetail(item, detail) : item)
  appealPendingList.value = mergeIntoList(appealPendingList.value)
  appealHeldList.value = mergeIntoList(appealHeldList.value)
  appealProcessedList.value = mergeIntoList(appealProcessedList.value)
}

async function loadEvaluationDetail(itemId) {
  const evalId = Number(String(itemId).replace('evaluation-', ''))
  if (!evalId || evaluationDetails.value[evalId]) return

  const response = await hrApprovalApi.getEvaluationApprovalDetail(evalId)
  const detail = response.data?.data
  if (!detail) return
  evaluationDetails.value = { ...evaluationDetails.value, [evalId]: detail }
  const mergeIntoList = (list) => list.map(item => item.evalId === evalId ? mergeEvaluationDetail(item, detail) : item)
  evaluationPendingList.value = mergeIntoList(evaluationPendingList.value)
  evaluationProcessedList.value = mergeIntoList(evaluationProcessedList.value)
}

onMounted(loadCurrentMode)

watch(approvalMode, () => {
  loadCurrentMode()
})

watch(selectedAppealId, (newId) => {
  if (approvalMode.value === 'appeal' && newId) {
    loadAppealDetail(newId)
  }
})

watch(selectedEvaluationId, (newId) => {
  if (approvalMode.value === 'evaluation' && newId) {
    loadEvaluationDetail(newId)
  }
})

function showToast(message) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message }
  toastTimer = setTimeout(() => { toast.value.show = false }, 2500)
}

function handleApprove(comment = '') {
  if (!selectedItem.value) return
  const isEvaluation = approvalMode.value === 'evaluation'
  confirmReason.value = ''
  if (isEvaluation) evaluationConfirmComment.value = typeof comment === 'string' ? comment : (comment?.value ?? '')
  confirmModal.value = {
    show: true,
    action: 'approve',
    title: isEvaluation ? '최종 확정' : '최종 승인',
    message: `${selectedItem.value.name}님 — ${isEvaluation ? '해당 평가를 최종 확정하시겠습니까?' : '해당 평가를 최종 승인하시겠습니까?'}`,
    confirmText: isEvaluation ? '확정' : '승인',
  }
}

function handleReject() {
  confirmReason.value = ''
  confirmModal.value = {
    show: true,
    action: 'reject',
    title: '반려',
    message: `${selectedItem.value.name}님 — 해당 평가를 반려 처리하시겠습니까?`,
    confirmText: '반려',
  }
}

function handleHold() {
  confirmReason.value = ''
  confirmModal.value = {
    show: true,
    action: 'hold',
    title: '보류',
    message: `${selectedItem.value.name}님 — 해당 평가를 보류 처리하시겠습니까?`,
    confirmText: '보류',
  }
}

function handleInnerTabChange(tab) {
  appealActiveTab.value = tab
  loadAppeals()
}

async function handleConfirm() {
  if (!selectedItem.value) return

  try {
    if (approvalMode.value === 'evaluation') {
      await hrApprovalApi.confirmEvaluation(selectedItem.value.evaluateeId, {
        evaluationPeriodId: selectedItem.value.evaluationPeriodId,
        evalComment: evaluationConfirmComment.value || selectedItem.value.detail.content,
        inputMethod: selectedItem.value.detail.inputMethod ?? 'TEXT',
      })
      confirmModal.value.show = false
      await loadEvaluations()
      showToast(`${selectedItem.value.name}님의 평가가 최종 확정되었습니다.`)
      return
    }

    const action = confirmModal.value.action
    const payload = action === 'hold'
      ? {
          status: 'REVIEWING',
          reviewResult: null,
          modifiedScore: null,
          reason: confirmReason.value.trim(),
        }
      : {
          status: 'COMPLETED',
          reviewResult: action === 'reject' ? 'DISMISS' : 'ACKNOWLEDGE',
          modifiedScore: null,
          reason: action === 'approve' ? null : confirmReason.value.trim(),
        }

    const targetName = selectedItem.value.name
    await hrApprovalApi.updateAppealStatus(selectedItem.value.appealId, payload)
    confirmModal.value.show = false
    confirmReason.value = ''
    await loadAppeals()
    showToast(`${targetName}님의 평가가 ${action === 'approve' ? '승인되었습니다.' : action === 'reject' ? '반려되었습니다.' : '보류되었습니다.'}`)
  } catch (e) {
    console.error(e)
    showToast('처리 중 오류가 발생했습니다.')
  }
}
</script>

<template>
  <div class="hrm-approval">
    <BaseFilterTabs
      class="hrm-approval__mode-tabs"
      :items="modeTabs"
      :model-value="approvalMode"
      variant="chip"
      :show-count="true"
      @change="approvalMode = $event"
    />

    <div v-if="loading" class="hrm-approval__loading">불러오는 중...</div>
    <div v-else-if="error" class="hrm-approval__error">{{ error }}</div>
    <template v-else>
      <section v-if="approvalMode === 'evaluation'" class="hrm-approval__progress-card">
        <div class="hrm-approval__progress-copy">
          <div>
            <p class="hrm-approval__progress-eyebrow">제출 완료 현황</p>
            <strong class="hrm-approval__progress-title">
              {{ evaluationProcessedTotalCount }} / {{ evaluationTotalCount }}명 제출 완료
            </strong>
          </div>
          <div class="hrm-approval__progress-side">
            <span class="hrm-approval__progress-period-chip">
              {{ evaluationPeriodSummary?.evalYear ?? '-' }}년 {{ evaluationPeriodSummary?.evalSequence ?? '-' }}차 평가
            </span>
            <span class="hrm-approval__progress-range">
              {{ formatDate(evaluationPeriodSummary?.startDate) }} - {{ formatDate(evaluationPeriodSummary?.endDate) }}
            </span>
          </div>
        </div>
        <BaseProgressBar
          :value="evaluationProgressPercent"
          tone="success"
          size="md"
          label="평가 제출 진행률"
        />
      </section>
      <section v-else class="hrm-approval__progress-card">
        <div class="hrm-approval__progress-copy">
          <div>
            <p class="hrm-approval__progress-eyebrow">이의신청 현황</p>
            <strong class="hrm-approval__progress-title">
              {{ appealPendingTotalCount }} / {{ appealPendingTotalCount + appealHeldTotalCount + appealProcessedTotalCount }}건 검토 대기
            </strong>
          </div>
          <div class="hrm-approval__progress-side">
            <span class="hrm-approval__progress-period-chip">이의신청 승인</span>
            <span class="hrm-approval__progress-range">
              보류 {{ appealHeldTotalCount }}건 · 처리 완료 {{ appealProcessedTotalCount }}건
            </span>
          </div>
        </div>
        <BaseProgressBar
          :value="formatPercent(appealProcessedTotalCount, appealPendingTotalCount + appealHeldTotalCount + appealProcessedTotalCount)"
          tone="success"
          size="md"
          label="이의신청 처리 진행률"
        />
      </section>

      <div class="hrm-approval__content" :class="{ 'hrm-approval__content--evaluation': approvalMode === 'evaluation' || approvalMode === 'appeal' }">
        <HRMApprovalList
          :list="filteredList"
          :pending-count="approvalMode === 'appeal' ? appealPendingTotalCount : evaluationPendingTotalCount"
          :held-count="appealHeldTotalCount"
          :processed-count="approvalMode === 'appeal' ? appealProcessedTotalCount : evaluationProcessedTotalCount"
          :tabs="approvalMode === 'appeal' ? [] : []"
          :active-tab="''"
          :selected-id="approvalMode === 'appeal' ? selectedAppealId : selectedEvaluationId"
          :pending-label="approvalMode === 'appeal' ? '이의신청 승인 대기' : '평가 승인 대기'"
          :held-label="'보류'"
          :processed-label="approvalMode === 'appeal' ? '처리 완료' : '확정 완료'"
          :empty-text="approvalMode === 'appeal' ? '승인 대기 이의신청이 없습니다.' : '확정 대기 평가가 없습니다.'"
          :mode="approvalMode"
          @select="approvalMode === 'appeal' ? selectedAppealId = $event : selectedEvaluationId = $event"
        />
        <HRMApprovalDetail
          v-if="selectedItem"
          :item="selectedItem"
          :mode="approvalMode"
          :readonly="isSelectedProcessed"
          :held="isSelectedHeld"
          @approve="handleApprove"
          @reject="handleReject"
          @hold="handleHold"
        />
      </div>
    </template>
  </div>

  <BaseConfirmModal
    v-if="confirmModal.show"
    :title="confirmModal.title"
    :confirm-text="confirmModal.confirmText"
    :confirm-disabled="isConfirmDisabled"
    cancel-text="취소"
    width="440px"
    @cancel="confirmModal.show = false; confirmReason = ''"
    @close="confirmModal.show = false; confirmReason = ''"
    @confirm="handleConfirm"
  >
    <p class="hrm-confirm-message">{{ confirmModal.message }}</p>
    <div v-if="approvalMode === 'appeal' && confirmModal.action !== 'approve'" class="hrm-confirm-reason">
      <label class="hrm-confirm-reason__label">
        처리 사유 <span class="hrm-confirm-reason__required">*필수</span>
      </label>
      <textarea
        v-model="confirmReason"
        class="hrm-confirm-reason__input"
        placeholder="사유를 10자 이상 입력해주세요"
        rows="3"
      />
    </div>
  </BaseConfirmModal>

  <BaseToast :show="toast.show" :message="toast.message" />
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

.hrm-approval__mode-tabs {
  align-self: flex-start;
}

.hrm-approval__mode-tabs :deep(.base-filter-tabs__count) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(106, 76, 216, 0.12);
  color: inherit;
  font-size: 11px;
  font-weight: 800;
}

.hrm-approval__mode-tabs :deep(.base-filter-tabs__item:nth-child(2)) {
  border-color: #f3c3cb;
  color: #c24157;
  background: #fff5f6;
}

.hrm-approval__mode-tabs :deep(.base-filter-tabs__item:nth-child(2) .base-filter-tabs__count) {
  background: rgba(194, 65, 87, 0.12);
  color: #c24157;
}

.hrm-approval__mode-tabs :deep(.base-filter-tabs__item:nth-child(2).base-filter-tabs__item--active) {
  background: #ffe7eb;
  border-color: #e88998;
  color: #a61d38;
}

.hrm-approval__mode-tabs :deep(.base-filter-tabs__item:nth-child(2).base-filter-tabs__item--active .base-filter-tabs__count) {
  background: #c24157;
  color: #fff;
}

.hrm-approval__loading { color: #a89ed8; font-size: var(--font-size-base); }
.hrm-approval__error { color: var(--color-danger); font-size: var(--font-size-base); }
.hrm-approval__content { display: flex; gap: 16px; align-items: flex-start; flex: 1; min-height: 0; }
.hrm-approval__content--evaluation {
  display: grid;
  grid-template-columns: minmax(270px, 0.72fr) minmax(0, 1.6fr);
  gap: 18px;
  align-items: stretch;
  min-height: 0;
}

.hrm-approval__progress-card {
  display: grid;
  gap: 10px;
  padding: 14px 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
}

.hrm-approval__progress-copy {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.hrm-approval__progress-eyebrow {
  margin: 0 0 4px;
  color: var(--color-primary-500);
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-semibold);
}

.hrm-approval__progress-title {
  color: var(--color-primary-800);
  font-size: var(--font-size-base-plus);
  font-weight: var(--font-weight-bold);
}

.hrm-approval__progress-side {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.hrm-approval__progress-period-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 14px;
  border-radius: 999px;
  background: #f1edff;
  color: #6c56db;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.hrm-approval__progress-range {
  font-size: var(--font-size-sm);
  color: #8d82d8;
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.hrm-approval__progress-card {
  display: grid;
  gap: 10px;
  padding: 14px 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
}

.hrm-approval__progress-copy {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.hrm-approval__progress-eyebrow {
  margin: 0 0 4px;
  color: var(--color-primary-500);
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-semibold);
}

.hrm-approval__progress-title {
  color: var(--color-primary-800);
  font-size: var(--font-size-base-plus);
  font-weight: var(--font-weight-bold);
}

.hrm-approval__progress-side {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.hrm-approval__progress-period-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 14px;
  border-radius: 999px;
  background: #f1edff;
  color: #6c56db;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.hrm-approval__progress-range {
  font-size: var(--font-size-sm);
  color: #8d82d8;
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.hrm-confirm-message {
  font-size: var(--font-size-base);
  color: var(--color-primary-800);
  line-height: 1.6;
  padding: 8px 0;
}

.hrm-confirm-reason { display: flex; flex-direction: column; gap: 6px; }
.hrm-confirm-reason__label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}
.hrm-confirm-reason__required { color: var(--color-danger); margin-left: 4px; }
.hrm-confirm-reason__input {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  font-size: var(--font-size-sm);
  color: var(--color-primary-800);
  background: var(--color-bg-app);
  resize: none;
  line-height: 1.5;
  box-sizing: border-box;
  font-family: inherit;
}
.hrm-confirm-reason__input:focus {
  outline: none;
  border-color: var(--color-primary-600);
}
</style>
