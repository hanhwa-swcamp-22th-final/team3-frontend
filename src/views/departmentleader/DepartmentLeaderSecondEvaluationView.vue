<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { BaseProgressBar } from '@/components/common/base'
import { BaseToast } from '@/components/common/base/overlay'
import DepartmentLeaderEvalMemberListPanel from '@/components/hr/departmentleader/second-evaluation/DepartmentLeaderEvalMemberListPanel.vue'
import DepartmentLeaderEvalFormPanel from '@/components/hr/departmentleader/second-evaluation/DepartmentLeaderEvalFormPanel.vue'
import { fetchDlTargets, fetchDlEvaluationDetail, updateDlEvaluation } from '@/services/departmentleader/evaluationApi'

const members = ref([])
const selectedMember = ref(null)
const evalPeriodId = ref(null)
const periodInfo = ref(null)
const toast = ref({ show: false, message: '', type: 'success' })

const periodLabel = computed(() => {
  if (!periodInfo.value?.evalYear) return null
  const raw = String(periodInfo.value.evalYear)
  const year = raw.slice(0, 4)
  const month = raw.length >= 6 ? String(parseInt(raw.slice(4), 10)) : null
  const seq = periodInfo.value.evalSequence
  return month
    ? `${year}년 ${month}월 ${seq}차 평가`
    : `${year}년 ${seq}차 평가`
})
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
    evaluationPeriodId: t.evaluationPeriodId,
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
    const data = res.data.data
    evalPeriodId.value = data.evalPeriodId
    periodInfo.value = {
      evalYear: data.evalYear,
      evalSequence: data.evalSequence,
      startDate: data.startDate,
      endDate: data.endDate,
    }
    members.value = data.targets.map(mapTarget)
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
  if (!selectedMember.value) return
  try {
    await updateDlEvaluation(selectedMember.value.id, {
      status: 'DRAFT',
      evaluationPeriodId: selectedMember.value.evaluationPeriodId,
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
  if (!selectedMember.value) return
  if (isSubmitted.value) return
  try {
    await updateDlEvaluation(selectedMember.value.id, {
      status: 'SUBMITTED',
      evaluationPeriodId: selectedMember.value.evaluationPeriodId,
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
    <!-- Progress card -->
    <section class="dl-eval-view__progress-card">
      <div class="dl-eval-view__progress-copy">
        <div>
          <p class="dl-eval-view__progress-eyebrow">제출 완료 현황</p>
          <strong class="dl-eval-view__progress-title">
            {{ submittedCount }} / {{ totalCount }}명 제출 완료
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
  margin-bottom: 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
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

@media (max-width: 900px) {
  .dl-eval-view__content {
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
