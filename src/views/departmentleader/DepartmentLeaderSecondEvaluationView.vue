<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { BaseToast } from '@/components/common/base/overlay'
import DepartmentLeaderEvalMemberListPanel from '@/components/hr/departmentleader/second-evaluation/DepartmentLeaderEvalMemberListPanel.vue'
import DepartmentLeaderEvalFormPanel from '@/components/hr/departmentleader/second-evaluation/DepartmentLeaderEvalFormPanel.vue'
import {
  fetchDlTargets,
  fetchDlEvaluationDetail,
  updateDlEvaluation,
} from '@/services/departmentleader/evaluationApi'

const members = ref([])
const selectedMember = ref(null)
const evalPeriodId = ref(null)
const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null

const totalCount = computed(() => members.value.length)
const submittedCount = computed(() => members.value.filter((m) => m.status === 'submitted').length)
const progressPercent = computed(() => (totalCount.value > 0 ? (submittedCount.value / totalCount.value) * 100 : 0))
const isSubmitted = computed(() => selectedMember.value?.status === 'submitted')

const AVATAR_COLORS = ['#5f50d6', '#269063', '#c08b00', '#b03060', '#2070b0', '#806030']

function avatarColor(name) {
  let hash = 0
  for (const ch of name ?? '') hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

function mapStatus(apiStatus) {
  if (apiStatus === 'SUBMITTED' || apiStatus === 'CONFIRMED') return 'submitted'
  if (apiStatus === 'DRAFT') return 'in_progress'
  return 'not_started'
}

function mapTarget(t) {
  return {
    id: t.evaluateeId,
    name: t.employeeName,
    avatar: (t.employeeName ?? '?')[0],
    avatarColor: avatarColor(t.employeeName),
    tier: t.employeeTier ?? '—',
    code: '',
    team: '',
    experience: '',
    status: mapStatus(t.status),
    statusDate: '—',
    secondEvaluationDraft: t.evalComment ?? '',
    firstEvaluationSummary: null,
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
    const { evalPeriodId: pid, targets } = res.data.data
    evalPeriodId.value = pid
    members.value = targets.map(mapTarget)
    if (members.value.length > 0) {
      await handleSelect(members.value[0])
    }
  } catch {
    showToast('평가 대상 목록을 불러오지 못했습니다.', 'error')
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
    }
    members.value[idx] = updated
    if (selectedMember.value?.id === member.id) {
      selectedMember.value = updated
    }
  } catch {
    // 1차 평가 상세가 없으면 summary null 유지 (v-if로 처리)
  }
}

async function handleSave(draftText) {
  if (!selectedMember.value || !evalPeriodId.value) return
  try {
    await updateDlEvaluation(selectedMember.value.id, {
      status: 'DRAFT',
      evaluationPeriodId: evalPeriodId.value,
      evalComment: draftText,
      inputMethod: 'TEXT',
    })
    const idx = members.value.findIndex((m) => m.id === selectedMember.value.id)
    const updated = { ...members.value[idx], secondEvaluationDraft: draftText, status: 'in_progress' }
    members.value[idx] = updated
    selectedMember.value = updated
    showToast('임시저장 되었습니다.')
  } catch {
    showToast('임시저장에 실패했습니다.', 'error')
  }
}

async function handleSubmit(draftText) {
  if (!selectedMember.value || !evalPeriodId.value) return
  if (isSubmitted.value) return
  try {
    await updateDlEvaluation(selectedMember.value.id, {
      status: 'SUBMITTED',
      evaluationPeriodId: evalPeriodId.value,
      evalComment: draftText,
      inputMethod: 'TEXT',
    })
    const idx = members.value.findIndex((m) => m.id === selectedMember.value.id)
    const updated = { ...members.value[idx], secondEvaluationDraft: draftText, status: 'submitted' }
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

onMounted(loadTargets)
onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <section class="dl-eval-view">
    <!-- Progress bar -->
    <div class="dl-eval-view__progress-bar">
      <span class="dl-eval-view__progress-label">평가 진행률</span>
      <div class="dl-eval-view__bar-track">
        <div class="dl-eval-view__bar-fill" :style="{ width: progressPercent + '%' }" />
      </div>
      <span class="dl-eval-view__progress-count">{{ submittedCount }} / {{ totalCount }}명 완료</span>
    </div>

    <!-- Content -->
    <div class="dl-eval-view__content">
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
    <BaseToast :show="toast.show" :message="toast.message" :type="toast.type" />
  </section>
</template>

<style scoped>
.dl-eval-view {
  width: 100%;
  min-width: 0;
  padding: 20px 28px 28px;
  background: var(--color-bg-app);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Progress bar */
.dl-eval-view__progress-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  background: var(--color-bg-surface);
}

.dl-eval-view__progress-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.dl-eval-view__bar-track {
  flex: 1;
  height: 10px;
  border-radius: 99px;
  background: var(--color-border-soft);
  overflow: hidden;
}

.dl-eval-view__bar-fill {
  height: 100%;
  border-radius: 99px;
  background: var(--color-primary-600);
  transition: width 0.4s ease;
}

.dl-eval-view__progress-count {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
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

@media (max-width: 900px) {
  .dl-eval-view__content {
    grid-template-columns: 1fr;
  }
}
</style>
