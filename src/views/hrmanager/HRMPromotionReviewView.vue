<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseStatCard        from '@/components/common/base/display/BaseStatCard.vue'
import HRMPromotionList    from '@/components/hr/hrmanager/promotion-review/HRMPromotionList.vue'
import HRMPromotionDetail  from '@/components/hr/hrmanager/promotion-review/HRMPromotionDetail.vue'
import { BaseConfirmModal, BaseToast } from '@/components/common/base/overlay'
import promotionApi from '@/services/hrmanager/promotionApi.js'

const AVATAR_TONE = { S: 'gold', A: 'purple', B: 'green', C: 'green' }

const STATUS_LABEL = {
  UNDER_REVIEW:              '검토 대기',
  CONFIRMATION_OF_PROMOTION: '승급 확정',
  TIER_APPLIED:              '적용 완료',
  SUSPENSION:                '보류',
}

function mapCandidate(item) {
  return {
    id:                   item.tierPromotionId,
    employeeId:           item.employeeId,
    name:                 item.employeeName,
    avatar:               (item.employeeName ?? '?')[0],
    avatarTone:           AVATAR_TONE[item.targetTier] ?? 'purple',
    currentTier:          item.currentTier,
    targetTier:           item.targetTier,
    tierBadge:            item.targetTier,
    tierAccumulatedPoint: item.tierAccumulatedPoint,
    targetPromotionPoint: item.targetPromotionPoint,
    rawStatus:            item.tierPromoStatus,
    statusLabel:          STATUS_LABEL[item.tierPromoStatus] ?? item.tierPromoStatus,
    meta:                 `${item.tierAccumulatedPoint ?? 0} / ${item.targetPromotionPoint ?? 0} pt`,
    statusDate:           item.tierPromoStatus === 'UNDER_REVIEW' ? '검토 대기' : STATUS_LABEL[item.tierPromoStatus],
    tierReviewedAt:       item.tierReviewedAt ?? null,
    reviewComment:        '',
  }
}

const loading    = ref(true)
const error      = ref(null)
const summary    = ref(null)
const candidates = ref([])
const selectedId = ref(null)
const details    = ref({})
const missionsByEmployee = ref({})
const missionLoadingEmployeeId = ref(null)

const selectedItem = computed(() => {
  const base = candidates.value.find(c => c.id === selectedId.value)
  if (!base) return null
  const detail = details.value[base.id]
  return detail ? { ...base, ...detail } : base
})

const selectedMissions = computed(() => {
  const employeeId = selectedItem.value?.employeeId
  return employeeId ? (missionsByEmployee.value[employeeId] ?? []) : []
})

const isMissionLoading = computed(() =>
  selectedItem.value?.employeeId != null
  && missionLoadingEmployeeId.value === selectedItem.value.employeeId
)

const sTierCount = computed(() => candidates.value.filter(c => c.targetTier === 'S').length)
const aTierCount = computed(() => candidates.value.filter(c => c.targetTier === 'A').length)
const readyToApplyCount = computed(() =>
  candidates.value.filter(c => c.rawStatus === 'CONFIRMATION_OF_PROMOTION').length
)

function toNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function missionTypeLabel(type) {
  return {
    HIGH_DIFFICULTY_WORK: '고난도 작업',
    KMS_CONTRIBUTION: 'KMS 기여',
    AI_SCORE: 'AI 점수',
  }[type] ?? type ?? '-'
}

function mapMission(mission) {
  return {
    id: mission.missionProgressId ?? mission.missionTemplateId,
    missionTemplateId: mission.missionTemplateId ?? null,
    title: mission.missionName ?? '-',
    missionType: mission.missionType ?? '',
    missionTypeLabel: missionTypeLabel(mission.missionType),
    upgradeToTier: mission.upgradeToTier ?? '',
    currentValue: toNumber(mission.currentValue),
    conditionValue: Math.max(toNumber(mission.conditionValue), 1),
    progressRate: Math.min(Math.max(toNumber(mission.progressRate), 0), 100),
    rewardPoint: toNumber(mission.rewardPoint),
    status: mission.status ?? 'IN_PROGRESS',
    completed: mission.status === 'COMPLETED',
    completedAt: mission.completedAt ?? null,
  }
}

async function load() {
  loading.value = true
  error.value = null
  try {
    const [summaryRes, candidatesRes] = await Promise.all([
      promotionApi.getSummary(),
      promotionApi.getCandidates({ page: 0, size: 200 }),
    ])
    summary.value    = summaryRes.data?.data ?? null
    const items      = candidatesRes.data?.data?.items ?? []
    candidates.value = items.map(mapCandidate)
    selectedId.value = candidates.value[0]?.id ?? null
    const selectedCandidate = candidates.value[0]
    if (selectedCandidate) {
      await Promise.all([
        loadDetail(selectedCandidate.id, true),
        loadUpgradeMissions(selectedCandidate.employeeId, true),
      ])
    }
  } catch (e) {
    console.error(e)
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}

async function loadUpgradeMissions(employeeId, force = false) {
  if (!employeeId || (!force && missionsByEmployee.value[employeeId])) return
  missionLoadingEmployeeId.value = employeeId
  try {
    const res = await promotionApi.getCandidateUpgradeMissions(employeeId)
    missionsByEmployee.value = {
      ...missionsByEmployee.value,
      [employeeId]: (res.data?.data ?? []).map(mapMission),
    }
  } catch (e) {
    console.error(e)
    missionsByEmployee.value = {
      ...missionsByEmployee.value,
      [employeeId]: [],
    }
  } finally {
    if (missionLoadingEmployeeId.value === employeeId) {
      missionLoadingEmployeeId.value = null
    }
  }
}

async function loadDetail(id, force = false) {
  if (!id || (!force && details.value[id])) return
  try {
    const res = await promotionApi.getCandidateDetail(id)
    const d = res.data?.data
    if (!d) return
    details.value = {
      ...details.value,
      [id]: {
        tierAccumulatedPoint: d.tierAccumulatedPoint,
        targetPromotionPoint: d.targetPromotionPoint,
        tierReviewedAt:       d.tierReviewedAt,
      },
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(load)

// 선택 변경 시 상세 로드
function handleSelect(id) {
  selectedId.value = id
  loadDetail(id)
  const candidate = candidates.value.find(c => c.id === id)
  if (candidate?.employeeId) {
    loadUpgradeMissions(candidate.employeeId)
  }
}

async function refreshPromotionData(targetId) {
  await load()
  if (!targetId) return
  const exists = candidates.value.some(c => c.id === targetId)
  selectedId.value = exists ? targetId : (candidates.value[0]?.id ?? null)
  if (selectedId.value) {
    const candidate = candidates.value.find(c => c.id === selectedId.value)
    await Promise.all([
      loadDetail(selectedId.value, true),
      loadUpgradeMissions(candidate?.employeeId, true),
    ])
  }
}

// ── 확인 모달 / 토스트 ─────────────────────────────────────────────
const confirmModal = ref({ show: false, action: null, targetId: null, title: '', message: '', confirmText: '' })
const toast        = ref({ show: false, message: '' })
let toastTimer = null

function showToast(message) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message }
  toastTimer = setTimeout(() => { toast.value.show = false }, 2500)
}

function handleHold({ id }) {
  const candidate = candidates.value.find(c => c.id === id)
  confirmModal.value = {
    show: true,
    action: 'hold',
    targetId: id,
    title: '보류',
    message: `${candidate?.name}님의 승급 심사를 보류하시겠습니까?`,
    confirmText: '보류',
  }
}

function handleConfirm({ id }) {
  const candidate = candidates.value.find(c => c.id === id)
  confirmModal.value = {
    show: true,
    action: 'confirm',
    targetId: id,
    title: '승급 확정',
    message: `${candidate?.name}님을 ${candidate?.currentTier}-Tier에서 ${candidate?.targetTier}-Tier로 승급 확정하시겠습니까?`,
    confirmText: '확정',
  }
}

function handleApplyTier() {
  confirmModal.value = {
    show: true,
    action: 'apply-tier',
    targetId: null,
    title: '티어 반영',
    message: `승급 확정 ${readyToApplyCount.value}건을 실제 직원 티어에 반영하시겠습니까?`,
    confirmText: '반영',
  }
}

async function handleModalConfirm() {
  const { action, targetId } = confirmModal.value
  const candidate = candidates.value.find(c => c.id === targetId)
  try {
    if (action === 'apply-tier') {
      await promotionApi.applyTier()
      confirmModal.value.show = false
      await refreshPromotionData(selectedId.value)
      showToast('확정된 승급 건을 실제 티어에 반영했습니다.')
      return
    }

    const status = action === 'confirm' ? 'CONFIRMATION_OF_PROMOTION' : 'SUSPENSION'
    await promotionApi.updateStatus(targetId, status)
    confirmModal.value.show = false
    await refreshPromotionData(targetId)
    showToast(action === 'confirm'
      ? `${candidate?.name}님 승급이 확정되었습니다.`
      : `${candidate?.name}님이 보류 처리되었습니다.`
    )
  } catch (e) {
    console.error(e)
    showToast('처리 중 오류가 발생했습니다.')
  }
}
</script>

<template>
  <section class="promo-view">
    <div v-if="loading" class="promo-view__loading">불러오는 중...</div>
    <div v-else-if="error" class="promo-view__error">{{ error }}</div>

    <template v-else>
      <!-- 지표 카드 -->
      <section class="promo-view__metrics">
        <BaseStatCard
          label="전체 심사 대상"
          :value="`${summary?.totalCandidates ?? 0}명`"
          tone="primary"
        />
        <BaseStatCard
          label="S-Tier 대상"
          :value="`${sTierCount}명`"
          tone="primary"
        />
        <BaseStatCard
          label="A-Tier 대상"
          :value="`${aTierCount}명`"
          tone="primary"
        />
        <BaseStatCard
          label="승급 확정"
          :value="`${summary?.confirmedCount ?? 0}명`"
          :delta="`승급률 ${summary?.promotionRate?.toFixed(1) ?? 0}%`"
          tone="success"
        />
      </section>

      <div class="promo-view__toolbar">
        <div class="promo-view__toolbar-copy">
          <p class="promo-view__toolbar-title">승급 확정 후 실제 티어 반영</p>
          <p class="promo-view__toolbar-description">
            현재 실제 반영 대기 건수는 {{ readyToApplyCount }}건입니다.
          </p>
        </div>
        <button
          class="promo-view__apply-btn"
          :disabled="readyToApplyCount === 0"
          @click="handleApplyTier"
        >
          티어 반영
        </button>
      </div>

      <!-- 목록 + 상세 -->
      <div class="promo-view__content">
        <HRMPromotionList
          :list="candidates"
          :selected-id="selectedId"
          @select="handleSelect"
        />
        <HRMPromotionDetail
          v-if="selectedItem"
          :item="selectedItem"
          :missions="selectedMissions"
          :missions-loading="isMissionLoading"
          @hold="handleHold"
          @confirm="handleConfirm"
        />
        <div v-else class="promo-view__empty">대상자를 선택하세요.</div>
      </div>
    </template>
  </section>

  <BaseConfirmModal
    v-if="confirmModal.show"
    :title="confirmModal.title"
    :confirm-text="confirmModal.confirmText"
    cancel-text="취소"
    width="400px"
    @cancel="confirmModal.show = false"
    @close="confirmModal.show = false"
    @confirm="handleModalConfirm"
  >
    <p class="promo-confirm-message">{{ confirmModal.message }}</p>
  </BaseConfirmModal>

  <BaseToast :show="toast.show" :message="toast.message" />
</template>

<style scoped>
.promo-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 28px;
  background: var(--color-bg-app);
  overflow: auto;
  min-height: 0;
}

.promo-view__loading,
.promo-view__error {
  padding: 60px;
  text-align: center;
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
}

.promo-view__error { color: var(--color-danger); }

.promo-view__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.promo-view__content {
  display: grid;
  grid-template-columns: minmax(270px, 0.72fr) minmax(0, 1.6fr);
  gap: 18px;
  align-items: stretch;
  flex: 1;
  min-height: 0;
}

.promo-view__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 18px;
  background: #f8f7ff;
}

.promo-view__toolbar-copy {
  display: grid;
  gap: 4px;
}

.promo-view__toolbar-title {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

.promo-view__toolbar-description {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.promo-view__apply-btn {
  height: 40px;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  background: var(--color-primary-600);
  color: var(--color-white);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  white-space: nowrap;
}

.promo-view__apply-btn:disabled {
  opacity: 0.45;
  cursor: default;
}

.promo-view__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 24px;
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
}

.promo-confirm-message {
  font-size: var(--font-size-base);
  color: var(--color-primary-800);
  line-height: 1.6;
  padding: 8px 0;
}
</style>
