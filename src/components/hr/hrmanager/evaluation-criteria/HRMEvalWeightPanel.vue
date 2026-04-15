<script setup>
import { computed } from 'vue'

const CATEGORY_LABELS = {
  PRODUCTIVITY: '생산 목표 달성',
  EQUIPMENT_RESPONSE: '설비 가동/정비 대응',
  PROCESS_INNOVATION: '공정 개선/혁신',
  KNOWLEDGE_SHARING: '지식 공유/교육',
}

const CATEGORY_ORDER = [
  'PRODUCTIVITY',
  'EQUIPMENT_RESPONSE',
  'PROCESS_INNOVATION',
  'KNOWLEDGE_SHARING',
]

const props = defineProps({
  weights: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:weights'])

const rows = computed(() =>
  CATEGORY_ORDER.map((categoryCode) => ({
    categoryCode,
    label: CATEGORY_LABELS[categoryCode],
    sa:
      props.weights.find(
        (item) => item.tierGroup === 'SA' && item.categoryCode === categoryCode,
      )?.weightPercent ?? 0,
    bc:
      props.weights.find(
        (item) => item.tierGroup === 'BC' && item.categoryCode === categoryCode,
      )?.weightPercent ?? 0,
  })),
)

const totals = computed(() =>
  props.weights.reduce(
    (acc, item) => {
      acc[item.tierGroup] = (acc[item.tierGroup] || 0) + Number(item.weightPercent || 0)
      return acc
    },
    { SA: 0, BC: 0 },
  ),
)

function updateWeight(tierGroup, categoryCode, value) {
  const nextValue = Number(value)
  const updated = props.weights.map((item) =>
    item.tierGroup === tierGroup && item.categoryCode === categoryCode
      ? { ...item, weightPercent: nextValue }
      : item,
  )
  emit('update:weights', updated)
}
</script>

<template>
  <article class="eval-weight-card">
    <p class="eval-weight-card__title">직급군별 평가 비중</p>

    <div class="eval-weight-card__summary">
      <span :class="['eval-weight-card__summary-chip', { 'is-error': totals.SA !== 100 }]">
        S/A 합계 {{ totals.SA }}%
      </span>
      <span :class="['eval-weight-card__summary-chip', { 'is-error': totals.BC !== 100 }]">
        B/C 합계 {{ totals.BC }}%
      </span>
    </div>

    <table class="eval-weight-card__table">
      <thead>
        <tr>
          <th>항목</th>
          <th>S/A</th>
          <th>B/C</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.categoryCode">
          <td>{{ row.label }}</td>
          <td>
            <input
              class="eval-weight-card__input"
              type="number"
              min="0"
              max="100"
              :disabled="loading"
              :value="row.sa"
              @input="updateWeight('SA', row.categoryCode, $event.target.value)"
            />
          </td>
          <td>
            <input
              class="eval-weight-card__input"
              type="number"
              min="0"
              max="100"
              :disabled="loading"
              :value="row.bc"
              @input="updateWeight('BC', row.categoryCode, $event.target.value)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </article>
</template>

<style scoped>
.eval-weight-card {
  padding: 24px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.eval-weight-card__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
}
.eval-weight-card__summary {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.eval-weight-card__summary-chip {
  padding: 6px 10px;
  border-radius: 8px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}
.eval-weight-card__summary-chip.is-error {
  background: #fdecec;
  color: var(--color-danger);
}
.eval-weight-card__table {
  width: 100%;
  border-collapse: collapse;
}
.eval-weight-card__table th,
.eval-weight-card__table td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--color-border-default);
  text-align: left;
  font-size: var(--font-size-sm);
}
.eval-weight-card__table th {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
}
.eval-weight-card__input {
  width: 72px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  background: var(--color-bg-app);
  color: var(--color-primary-900);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}
</style>
