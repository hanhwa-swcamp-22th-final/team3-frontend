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

const selectedItem = computed(() => {
  const base = candidates.value.find(c => c.id === selectedId.value)
  if (!base) return null
  const detail = details.value[base.id]
  return detail ? { ...base, ...detail } : base
})

const sTierCount = computed(() => candidates.value.filter(c => c.targetTier === 'S').length)
const aTierCount = computed(() => candidates.value.filter(c => c.targetTier === 'A').length)

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
  } catch (e) {
    console.error(e)
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}

async function loadDetail(id) {
  if (!id || details.value[id]) return
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

async function handleModalConfirm() {
  const { action, targetId } = confirmModal.value
  const candidate = candidates.value.find(c => c.id === targetId)
  const status = action === 'confirm' ? 'CONFIRMATION_OF_PROMOTION' : 'SUSPENSION'
  try {
    await promotionApi.updateStatus(targetId, status)
    confirmModal.value.show = false
    // 로컬 상태 업데이트
    candidates.value = candidates.value.map(c =>
      c.id === targetId ? { ...c, rawStatus: status, statusLabel: STATUS_LABEL[status] } : c
    )
    details.value = { ...details.value, [targetId]: undefined }
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
