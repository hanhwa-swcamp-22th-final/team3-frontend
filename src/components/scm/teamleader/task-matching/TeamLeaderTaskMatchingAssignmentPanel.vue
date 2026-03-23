<script setup>
import { computed, ref, watch } from 'vue'
import { BaseFilterTabs, BaseStatCardGrid } from '@/components/common/base'

const props = defineProps({
  orders: { type: Array, default: () => [] },
  selectedOrder: { type: Object, default: () => null },
  selectedOrderId: { type: Number, default: null },
  assignmentStats: { type: Object, default: () => ({}) },
  candidates: { type: Array, default: () => [] },
  assignedCandidateId: { type: Number, default: null },
})

const emit = defineEmits(['select-order', 'assign-candidate', 'confirm-assignment'])

const strategy = ref('optimal')
const confirmTarget = ref(null)
const orderPage = ref(1)
const candidatePage = ref(1)
const orderPageSize = 4
const candidatePageSize = 4
const strategyOptions = [
  { key: 'optimal', label: '최적형 배정' },
  { key: 'challenge', label: '도전형 배정' },
]

const summaryCards = computed(() => [
  { label: '오늘 배정', value: props.assignmentStats.assignedToday ?? '-', tone: 'primary' },
  { label: '정확도', value: props.assignmentStats.accuracy ?? '-', tone: 'success' },
  { label: '재배정', value: props.assignmentStats.reassigned ?? '-', tone: 'warning' },
  { label: '미배정', value: props.assignmentStats.unassigned ?? '-', tone: 'danger' },
])

function candidateToneClass(tone) {
  return `candidate-card--${tone}`
}

const displayedCandidates = computed(() => {
  const list = [...props.candidates]
  if (strategy.value === 'optimal') {
    return list.sort((a, b) => Number(b.fit.replace('%', '')) - Number(a.fit.replace('%', '')))
  }

  return list.sort((a, b) => {
    const fitGap = Number(a.fit.replace('%', '')) - Number(b.fit.replace('%', ''))
    if (Math.abs(fitGap) > 12) return fitGap
    return a.score - b.score
  })
})

const orderTotalPages = computed(() => Math.max(1, Math.ceil(props.orders.length / orderPageSize)))
const candidateTotalPages = computed(() => Math.max(1, Math.ceil(displayedCandidates.value.length / candidatePageSize)))

const pagedOrders = computed(() => {
  const start = (orderPage.value - 1) * orderPageSize
  return props.orders.slice(start, start + orderPageSize)
})

const pagedCandidates = computed(() => {
  const start = (candidatePage.value - 1) * candidatePageSize
  return displayedCandidates.value.slice(start, start + candidatePageSize)
})

const orderPageNumbers = computed(() => Array.from({ length: orderTotalPages.value }, (_, index) => index + 1))
const candidatePageNumbers = computed(() => Array.from({ length: candidateTotalPages.value }, (_, index) => index + 1))

watch(() => props.orders.length, () => {
  if (orderPage.value > orderTotalPages.value) orderPage.value = orderTotalPages.value
})

watch(displayedCandidates, () => {
  candidatePage.value = 1
})

watch(() => props.selectedOrderId, () => {
  const index = props.orders.findIndex((item) => item.id === props.selectedOrderId)
  if (index >= 0) {
    orderPage.value = Math.floor(index / orderPageSize) + 1
  }
})

function openConfirm(candidate) {
  emit('assign-candidate', candidate.id)
  confirmTarget.value = candidate
}

function closeConfirm() {
  confirmTarget.value = null
}

function confirmAssignment() {
  if (!props.selectedOrder || !confirmTarget.value) return
  emit('confirm-assignment', {
    orderId: props.selectedOrder.id,
    candidateId: confirmTarget.value.id,
  })
  confirmTarget.value = null
}
</script>

<template>
  <section class="assignment-panel">
    <section class="assignment-panel__column assignment-panel__column--orders">
      <div class="assignment-panel__head">
        <p class="assignment-panel__eyebrow">대기 주문</p>
        <h3>미배정 주문 ({{ orders.length }}건)</h3>
      </div>
      <div class="assignment-panel__order-list-shell">
        <div class="assignment-panel__order-list">
          <button
            v-for="order in pagedOrders"
            :key="order.id"
            type="button"
            class="assignment-order"
            :class="{ 'assignment-order--active': selectedOrderId === order.id }"
            @click="emit('select-order', order.id)"
          >
            <div class="assignment-order__top">
              <span>{{ order.code }}</span>
              <span>{{ order.difficulty }}</span>
            </div>
            <strong>{{ order.title }}</strong>
            <div class="assignment-order__bottom">
              <span>{{ order.deadline }}</span>
              <span>{{ order.line }}</span>
            </div>
          </button>
          <div v-if="pagedOrders.length === 0" class="assignment-panel__empty">
            미배정 주문이 없습니다.
          </div>
        </div>
        <div class="assignment-panel__pagination-slot">
          <div v-if="orderTotalPages > 1" class="assignment-panel__pagination">
            <button
              v-for="page in orderPageNumbers"
              :key="`order-${page}`"
              type="button"
              class="assignment-panel__page-button"
              :class="{ 'assignment-panel__page-button--active': page === orderPage }"
              @click="orderPage = page"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="assignment-panel__column assignment-panel__column--candidates">
      <div class="assignment-panel__head">
        <p class="assignment-panel__eyebrow">선택 주문</p>
        <h3>후보 리스트 및 배정</h3>
      </div>

      <BaseFilterTabs
        class="assignment-panel__strategy"
        :items="strategyOptions"
        :model-value="strategy"
        @change="strategy = $event"
      />

      <BaseStatCardGrid :cards="summaryCards" class="assignment-panel__stats" />

      <div class="assignment-panel__candidate-list-shell">
        <div class="assignment-panel__candidate-list">
          <article
            v-for="candidate in pagedCandidates"
            :key="candidate.id"
            class="candidate-card"
            :class="[
              candidateToneClass(candidate.tone),
              { 'candidate-card--active': assignedCandidateId === candidate.id },
            ]"
          >
            <div class="candidate-card__main">
              <div class="candidate-card__left">
                <span class="candidate-card__avatar">{{ candidate.initial }}</span>
                <div>
                  <div class="candidate-card__row">
                    <strong>{{ candidate.name }}</strong>
                    <span>{{ candidate.tier }}</span>
                  </div>
                  <p>{{ candidate.line }}</p>
                </div>
              </div>
              <div class="candidate-card__action">
                <div class="candidate-card__right">
                  <strong>{{ candidate.score }}</strong>
                  <span>{{ candidate.fit }}</span>
                </div>
                <button type="button" class="candidate-card__assign" @click="openConfirm(candidate)">주문 배정</button>
              </div>
            </div>
          </article>
          <div v-if="pagedCandidates.length === 0" class="assignment-panel__empty">
            표시할 후보가 없습니다.
          </div>
        </div>
        <div class="assignment-panel__pagination-slot">
          <div v-if="candidateTotalPages > 1" class="assignment-panel__pagination">
            <button
              v-for="page in candidatePageNumbers"
              :key="`candidate-${page}`"
              type="button"
              class="assignment-panel__page-button"
              :class="{ 'assignment-panel__page-button--active': page === candidatePage }"
              @click="candidatePage = page"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </section>

  <div v-if="confirmTarget && selectedOrder" class="assignment-confirm-backdrop" @click.self="closeConfirm">
    <div class="assignment-confirm-modal">
      <p class="assignment-panel__eyebrow">배정 확인</p>
      <h3>{{ selectedOrder.code }} 주문을 배정하시겠습니까?</h3>
      <p class="assignment-confirm-modal__copy">
        {{ confirmTarget.name }} · {{ confirmTarget.tier }} · 적합도 {{ confirmTarget.fit }}
      </p>
      <div class="assignment-confirm-modal__actions">
        <button type="button" class="assignment-confirm-modal__button assignment-confirm-modal__button--ghost" @click="closeConfirm">취소</button>
        <button type="button" class="assignment-confirm-modal__button" @click="confirmAssignment">배정 확정</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.assignment-panel { display: grid; grid-template-columns: minmax(320px, 0.95fr) minmax(0, 1.35fr); gap: 16px; height: 100%; min-height: 0; }
.assignment-panel__column { border: 1px solid var(--color-border-default); border-radius: 20px; background: var(--color-bg-surface); padding: 16px; display: grid; grid-template-rows: auto auto auto minmax(0, 1fr); gap: 14px; align-content: start; min-height: 0; overflow: hidden; box-sizing: border-box; }
.assignment-panel__head h3 { margin-top: 6px; font-size: var(--font-size-lg-plus); color: var(--color-primary-800); }
.assignment-panel__eyebrow { font-size: var(--font-size-xs-plus); font-weight: 700; color: var(--color-primary-300); }
.assignment-panel__column--orders { grid-template-rows: auto minmax(0, 1fr); }
.assignment-panel__column--candidates { grid-template-rows: auto auto auto minmax(0, 1fr); }
.assignment-panel__order-list-shell, .assignment-panel__candidate-list-shell { display: grid; grid-template-rows: minmax(0, 1fr) 34px; gap: 12px; min-height: 0; }
.assignment-panel__order-list, .assignment-panel__candidate-list { display: grid; align-content: start; gap: 12px; min-height: 0; overflow-y: auto; padding-right: 4px; }
.assignment-order, .candidate-card { border: 1px solid var(--color-border-default); border-radius: 16px; background: #fff; }
.assignment-order { padding: 14px 16px; text-align: left; display: grid; gap: 10px; cursor: pointer; }
.assignment-order--active, .candidate-card--active { box-shadow: inset 0 0 0 1px rgba(91, 80, 214, 0.16); background: #f8f6ff; }
.assignment-order__top, .assignment-order__bottom, .candidate-card__row, .candidate-card__left, .candidate-card__right, .candidate-card__main { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.assignment-order strong, .candidate-card strong { color: var(--color-primary-800); }
.assignment-order__top span, .assignment-order__bottom span, .candidate-card p, .candidate-card__row span, .assignment-confirm-modal__copy, .assignment-panel__empty { font-size: var(--font-size-xs-plus); color: var(--color-text-muted); }
.candidate-card { padding: 14px 16px; }
.candidate-card__left { justify-content: flex-start; }
.candidate-card__avatar { width: 38px; height: 38px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; background: var(--color-primary-700); }
.candidate-card__action { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.candidate-card__right { display: grid; justify-items: end; gap: 4px; }
.candidate-card__right strong { font-size: var(--font-size-display-sm); }
.candidate-card__assign { height: 38px; padding: 0 14px; border: none; border-radius: 12px; background: var(--color-primary-700); color: #fff; font-size: var(--font-size-sm); font-weight: 800; white-space: nowrap; cursor: pointer; }
.candidate-card--mint .candidate-card__right strong { color: #18b9a7; } .candidate-card--primary .candidate-card__right strong { color: var(--color-primary-600); } .candidate-card--green .candidate-card__right strong { color: #24966b; } .candidate-card--gold .candidate-card__right strong { color: #c78c00; } .candidate-card--danger .candidate-card__right strong { color: #ef4f74; } .candidate-card--soft .candidate-card__right strong { color: #9b93c7; }
.assignment-panel__empty { min-height: 100%; border: 1px dashed var(--color-border-default); border-radius: 16px; display: grid; place-items: center; background: #fbfaff; }
.assignment-panel__pagination-slot { display: grid; align-items: end; flex-shrink: 0; }
.assignment-panel__pagination { display: flex; justify-content: center; gap: 8px; min-height: 34px; }
.assignment-panel__page-button { width: 34px; height: 34px; border: 1px solid var(--color-border-default); border-radius: 10px; background: #fff; color: var(--color-text-default); font-size: var(--font-size-sm); font-weight: 700; cursor: pointer; }
.assignment-panel__page-button--active { border-color: var(--color-primary-700); background: var(--color-primary-700); color: #fff; }
.assignment-confirm-backdrop { position: fixed; inset: 0; background: rgba(18, 20, 38, 0.48); display: grid; place-items: center; padding: 20px; z-index: 40; }
.assignment-confirm-modal { width: min(440px, 100%); border-radius: 22px; border: 1px solid var(--color-border-default); background: #fff; padding: 22px; display: grid; gap: 14px; box-shadow: 0 22px 60px rgba(19, 22, 48, 0.18); }
.assignment-confirm-modal h3 { font-size: var(--font-size-lg-plus); color: var(--color-primary-800); }
.assignment-confirm-modal__actions { display: flex; justify-content: flex-end; gap: 10px; }
.assignment-confirm-modal__button { height: 42px; padding: 0 16px; border: none; border-radius: 12px; background: var(--color-primary-700); color: #fff; font-size: var(--font-size-base); font-weight: 800; cursor: pointer; }
.assignment-confirm-modal__button--ghost { border: 1px solid var(--color-border-default); background: #fff; color: var(--color-text-default); }
@media (max-width: 1280px) { .assignment-panel { grid-template-columns: 1fr; } .assignment-panel__stats :deep(.base-stat-card-grid) { grid-template-columns: 1fr; } .candidate-card__main, .candidate-card__action { align-items: flex-start; } }
@media (max-width: 860px) { .candidate-card__main { flex-direction: column; } .candidate-card__action { width: 100%; justify-content: space-between; margin-left: 0; } }
</style>

