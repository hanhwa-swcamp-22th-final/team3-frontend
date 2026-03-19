<script setup>
import { ref, computed, onMounted } from 'vue'
import { API_BASE, AI_TAG_LIMIT, TYPE_STYLE, GRADE_STYLE, EVAL_TYPE_LABEL, scoreToGrade } from '@/constants'
import HRMApprovalBanner  from '@/components/hr/hrmanager/evaluation-approval/HRMApprovalBanner.vue'
import HRMApprovalList    from '@/components/hr/hrmanager/evaluation-approval/HRMApprovalList.vue'
import HRMApprovalDetail  from '@/components/hr/hrmanager/evaluation-approval/HRMApprovalDetail.vue'
import BaseConfirmModal   from '@/components/common/base/overlay/BaseConfirmModal.vue'

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
const approvalList   = ref([])
const heldList       = ref([])
const processedList  = ref([])
const loading        = ref(true)
const error          = ref(null)
const activeTab      = ref('대기중')
const tabs           = ['대기중', '보류', '처리 완료']
const selectedId     = ref(null)

const PROCESSED_STATUS_STYLE = {
  approve: { label: '승인', bg: '#d1fae5', color: '#065f46' },
  reject:  { label: '반려', bg: '#fee2e2', color: '#991b1b' },
  hold:    { label: '보류', bg: '#fef3c7', color: '#92400e' },
}

// ── 데이터 로딩 ───────────────────────────────────────────────────
onMounted(async () => {
  try {
    const fetchJson = url => fetch(url).then(r => r.json())
    const [empData, qualData, teamData, appealData] = await Promise.all([
      fetchJson(`${API_BASE}/employees`),
      fetchJson(`${API_BASE}/qualitativeEval`),
      fetchJson(`${API_BASE}/teamStats`),
      fetchJson(`${API_BASE}/appealForms`),
    ])

    // processStatus === 2 : HRM 검토 대기 중인 이의신청만
    const pending = appealData.filter(a => a.processStatus === 2)
    const result  = []

    for (const appeal of pending) {
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
          quarter: appeal.quarter,
          reason: appeal.reason || '사유 없음',
          content: appeal.content || '내용 없음',
          attachments: appeal.attachments ?? [],
          quantScore: appeal.scores.quantitative.toFixed(1),
          qualScore:  appeal.scores.qualitative.toFixed(1),
          totalScore: appeal.scores.composite.toFixed(1),
          aiTags,
          dataTrust: qual ? `${(qual.nlpConfidence * 100).toFixed(0)}%` : '-',
          aiAnalysis: qual?.aiAnalysis ?? '',
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
  if (activeTab.value === '처리 완료') return processedList.value
  if (activeTab.value === '보류')      return heldList.value
  return approvalList.value
})

const selectedItem = computed(() =>
  approvalList.value.find(item => item.id === selectedId.value) ??
  heldList.value.find(item => item.id === selectedId.value) ??
  processedList.value.find(item => item.id === selectedId.value)
)

const isSelectedProcessed = computed(() =>
  processedList.value.some(item => item.id === selectedId.value)
)

const isSelectedHeld = computed(() =>
  heldList.value.some(item => item.id === selectedId.value)
)

const isConfirmDisabled = computed(() =>
  confirmModal.value.action !== 'approve' && !confirmReason.value.trim()
)

// ── 확인 모달 / 토스트 상태 ───────────────────────────────────────
const confirmModal  = ref({ show: false, action: null, title: '', message: '', confirmText: '' })
const confirmReason = ref('')
const toast         = ref({ show: false, message: '' })
let toastTimer = null

const ACTION_CONFIG = {
  approve: { title: '최종 승인', message: '해당 평가를 최종 승인하시겠습니까?',  confirmText: '승인', toastMsg: '승인되었습니다.' },
  reject:  { title: '반려',     message: '해당 평가를 반려 처리하시겠습니까?',  confirmText: '반려', toastMsg: '반려되었습니다.' },
  hold:    { title: '보류',     message: '해당 평가를 보류 처리하시겠습니까?',  confirmText: '보류', toastMsg: '보류되었습니다.' },
}

// ── 액션 핸들러 ───────────────────────────────────────────────────
function handleApprove() { openConfirm('approve') }
function handleReject()  { openConfirm('reject') }
function handleHold()    { openConfirm('hold') }

function openConfirm(action) {
  const cfg = ACTION_CONFIG[action]
  confirmReason.value = ''
  confirmModal.value = {
    show: true, action,
    title: cfg.title,
    message: `${selectedItem.value.name}님 — ${cfg.message}`,
    confirmText: cfg.confirmText,
  }
}

function handleConfirm() {
  const { action } = confirmModal.value
  const name  = selectedItem.value.name
  const style = PROCESSED_STATUS_STYLE[action]

  // source 목록을 추가 전에 먼저 확정
  const sourceList = heldList.value.some(i => i.id === selectedId.value)
    ? heldList.value
    : approvalList.value

  if (action === 'hold') {
    heldList.value.unshift({
      ...selectedItem.value,
      processedStatus: 'hold',
      processedLabel:  style.label,
      processedBg:     style.bg,
      processedColor:  style.color,
      processedReason: confirmReason.value.trim() || null,
    })
  } else {
    processedList.value.unshift({
      ...selectedItem.value,
      processedStatus: action,
      processedLabel:  style.label,
      processedBg:     style.bg,
      processedColor:  style.color,
      processedReason: confirmReason.value.trim() || null,
    })
  }

  confirmModal.value.show = false
  removeAndSelectNext(sourceList)
  showToast(`${name}님의 평가가 ${ACTION_CONFIG[action].toastMsg}`)
}

function removeAndSelectNext(sourceList) {
  const idx  = sourceList.findIndex(i => i.id === selectedId.value)
  sourceList.splice(idx, 1)
  const next = sourceList[idx] ?? sourceList[idx - 1]
  selectedId.value = next?.id ?? null
}

function showToast(message) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message }
  toastTimer = setTimeout(() => { toast.value.show = false }, 2500)
}
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
          :pending-count="approvalList.length"
          :held-count="heldList.length"
          :processed-count="processedList.length"
          :tabs="tabs"
          :active-tab="activeTab"
          :selected-id="selectedId"
          @tab-change="tab => { activeTab = tab; selectedId = filteredList[0]?.id ?? null }"
          @select="selectedId = $event"
        />
        <HRMApprovalDetail
          v-if="selectedItem"
          :item="selectedItem"
          :readonly="isSelectedProcessed"
          :held="isSelectedHeld"
          @approve="handleApprove"
          @reject="handleReject"
          @hold="handleHold"
        />
      </div>
    </template>
  </div>

  <!-- 확인 모달 -->
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
    <div v-if="confirmModal.action !== 'approve'" class="hrm-confirm-reason">
      <label class="hrm-confirm-reason__label">
        처리 사유 <span class="hrm-confirm-reason__required">*필수</span>
      </label>
      <textarea
        v-model="confirmReason"
        class="hrm-confirm-reason__input"
        placeholder="사유를 입력해주세요"
        rows="3"
      />
    </div>
  </BaseConfirmModal>

  <!-- 토스트 -->
  <Transition name="hrm-toast">
    <div v-if="toast.show" class="hrm-toast">
      <span class="hrm-toast__icon">✓</span>
      {{ toast.message }}
    </div>
  </Transition>
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

.hrm-toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  background: var(--color-primary-700);
  color: #fff;
  border-radius: 10px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  box-shadow: 0 8px 24px rgba(20, 15, 60, 0.2);
  pointer-events: none;
}
.hrm-toast__icon {
  width: 20px;
  height: 20px;
  background: rgba(255,255,255,0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.hrm-toast-enter-active,
.hrm-toast-leave-active { transition: all 0.25s ease; }
.hrm-toast-enter-from   { opacity: 0; transform: translateY(12px); }
.hrm-toast-leave-to     { opacity: 0; transform: translateY(12px); }
</style>
