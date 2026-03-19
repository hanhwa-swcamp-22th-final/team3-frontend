<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { API_BASE } from '@/constants'
import BaseStatCard        from '@/components/common/base/display/BaseStatCard.vue'
import HRMPromotionList    from '@/components/hr/hrmanager/promotion-review/HRMPromotionList.vue'
import HRMPromotionDetail  from '@/components/hr/hrmanager/promotion-review/HRMPromotionDetail.vue'
import BaseConfirmModal    from '@/components/common/base/overlay/BaseConfirmModal.vue'

const loading    = ref(true)
const summary    = ref(null)
const candidates = ref([])
const activeTab  = ref('전체')
const selectedId = ref(null)

const tabs = computed(() => {
  const sTierCount = candidates.value.filter(c => c.targetTier === 'S').length
  const aTierCount = candidates.value.filter(c => c.targetTier === 'A').length
  return [`전체(${candidates.value.length})`, `S-Tier(${sTierCount})`, `A-Tier(${aTierCount})`]
})

const filteredList = computed(() => {
  if (activeTab.value.startsWith('전체')) return candidates.value
  if (activeTab.value.startsWith('S-Tier')) return candidates.value.filter(c => c.targetTier === 'S')
  if (activeTab.value.startsWith('A-Tier')) return candidates.value.filter(c => c.targetTier === 'A')
  return candidates.value
})

const selectedItem = computed(() =>
  candidates.value.find(c => c.id === selectedId.value)
)

async function fetchJson(url) {
  const res = await fetch(url)
  return res.json()
}

onMounted(async () => {
  try {
    const [summaryData, candidatesData] = await Promise.all([
      fetchJson(`${API_BASE}/promotionSummary`),
      fetchJson(`${API_BASE}/promotionCandidates`),
    ])
    summary.value    = summaryData[0] ?? null
    candidates.value = candidatesData
    if (candidatesData.length > 0) selectedId.value = candidatesData[0].id
  } catch (e) {
    console.error('승급심사 데이터 로딩 실패:', e)
  } finally {
    loading.value = false
  }
})

// ── 확인 모달 / 토스트 ────────────────────────────────────────────
const confirmModal   = ref({ show: false, action: null, targetId: null, title: '', message: '', confirmText: '' })
const confirmOpinion = ref('')
const isConfirmDisabled = computed(() => !confirmOpinion.value.trim())
const toast          = ref({ show: false, message: '' })
let toastTimer = null

watch(() => confirmModal.value.show, show => { if (!show) confirmOpinion.value = '' })

function openConfirm(action, id) {
  const candidate = candidates.value.find(c => c.id === id)
  const { name, currentTier, targetTier } = candidate
  const config = {
    hold:    { title: '보류',     message: `${name}님의 승급 심사를 보류하시겠습니까?`,  confirmText: '보류' },
    confirm: { title: '승급 확정', message: `${name}님을 ${currentTier}-Tier에서 ${targetTier}-Tier로 승급 확정하시겠습니까?`, confirmText: '확정' },
  }[action]
  confirmModal.value = { show: true, action, targetId: id, ...config }
}

function handleModalConfirm() {
  const { action, targetId } = confirmModal.value
  const candidate = candidates.value.find(c => c.id === targetId)
  const name = candidate?.name
  if (candidate) candidate.processedStatus = action
  confirmModal.value.show = false
  const msg = action === 'confirm' ? `${name}님 승급이 확정되었습니다.` : `${name}님이 보류 처리되었습니다.`
  showToast(msg)
}

function showToast(message) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message }
  toastTimer = setTimeout(() => { toast.value.show = false }, 2500)
}

function handleHold(id)    { openConfirm('hold', id) }
function handleConfirm(id) { openConfirm('confirm', id) }
</script>

<template>
  <section class="promo-view">
    <div v-if="loading" class="promo-view__loading">불러오는 중...</div>

    <template v-else>
      <!-- 지표 카드 -->
      <section class="promo-view__metrics" v-if="summary">
        <BaseStatCard
          label="S-TIER 심사대상"
          :value="`${summary.sTierCount}명`"
          :delta="`▲${summary.sTierDelta} 전분기비`"
          tone="primary"
        />
        <BaseStatCard
          label="A-TIER 심사대상"
          :value="`${summary.aTierCount}명`"
          :delta="`▲${summary.aTierDelta}`"
          tone="primary"
        />
        <BaseStatCard
          label="이번분기 승급확정"
          :value="`${summary.confirmedCount}명`"
          tone="success"
        />
        <BaseStatCard
          label="승급률"
          :value="`${summary.promotionRate}%`"
          :delta="`전분기 ${summary.prevPromotionRate}%`"
          tone="success"
        />
      </section>

      <!-- 목록 + 상세 -->
      <div class="promo-view__content">
        <HRMPromotionList
          :list="filteredList"
          :tabs="tabs"
          :active-tab="activeTab"
          :selected-id="selectedId"
          @tab-change="activeTab = $event"
          @select="selectedId = $event"
          @confirm="handleConfirm"
        />
        <HRMPromotionDetail
          v-if="selectedItem"
          :item="selectedItem"
          @hold="handleHold"
          @confirm="handleConfirm"
        />
      </div>
    </template>
  </section>

  <BaseConfirmModal
    v-if="confirmModal.show"
    :title="confirmModal.title"
    :confirm-text="confirmModal.confirmText"
    :confirm-disabled="isConfirmDisabled"
    cancel-text="취소"
    width="420px"
    @cancel="confirmModal.show = false"
    @close="confirmModal.show = false"
    @confirm="handleModalConfirm"
  >
    <p class="promo-confirm-message">{{ confirmModal.message }}</p>
    <div class="promo-opinion-wrap">
      <label class="promo-opinion-label">심사의견 <span class="promo-opinion-required">*</span></label>
      <textarea
        v-model="confirmOpinion"
        class="promo-opinion-textarea"
        placeholder="심사의견을 입력하세요 (필수)"
        rows="3"
      />
    </div>
  </BaseConfirmModal>

  <Transition name="promo-toast">
    <div v-if="toast.show" class="promo-toast">
      <span class="promo-toast__icon">✓</span>
      {{ toast.message }}
    </div>
  </Transition>
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
.promo-view__loading {
  padding: 60px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
}
.promo-view__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.promo-view__content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex: 1;
  min-height: 0;
}

.promo-confirm-message {
  font-size: var(--font-size-base);
  color: var(--color-primary-800);
  line-height: 1.6;
  padding: 8px 0;
}
.promo-opinion-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}
.promo-opinion-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
}
.promo-opinion-required {
  color: var(--color-danger);
}
.promo-opinion-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  font-size: var(--font-size-sm);
  color: var(--color-primary-800);
  background: var(--color-bg-app);
  resize: none;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.promo-opinion-textarea:focus {
  outline: none;
  border-color: var(--color-border-default);
}

.promo-toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  background: var(--color-mint-500);
  color: #fff;
  border-radius: 10px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  box-shadow: 0 8px 24px rgba(20, 15, 60, 0.2);
  pointer-events: none;
}
.promo-toast__icon {
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
.promo-toast-enter-active,
.promo-toast-leave-active { transition: all 0.25s ease; }
.promo-toast-enter-from   { opacity: 0; transform: translateY(12px); }
.promo-toast-leave-to     { opacity: 0; transform: translateY(12px); }
</style>
