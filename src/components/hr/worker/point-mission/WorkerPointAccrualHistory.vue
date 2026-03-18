<script setup>
import { ref, computed } from 'vue'
import { BaseFilterTabs, BaseDataTable } from '@/components/common/base'
import { POINT_CATEGORY_STYLES as categoryStyles } from '@/constants'

const props = defineProps({
  history: {
    type: Array,
    required: true,
    // [{ date, category, description, points }]
  },
})

const tabs = ['전체', '작업완료', 'AI평가', 'KMS']
const activeTab = ref('전체')

const filteredHistory = computed(() => {
  if (activeTab.value === '전체') return props.history
  return props.history.filter((h) => h.category === activeTab.value)
})

const columns = [
  { key: 'date', label: '날짜' },
  { key: 'category', label: '구분' },
  { key: 'description', label: '내용' },
  { key: 'points', label: '포인트' },
]

function badgeStyle(category) {
  const s = categoryStyles[category] || { bg: '#f0eeff', color: '#2D1F6E' }
  return { background: s.bg, color: s.color }
}
</script>

<template>
  <div class="history">
    <div class="history__header">
      <span class="history__icon">📋</span>
      <h3 class="history__title">포인트 적립 내역</h3>
    </div>

    <BaseFilterTabs
      v-model="activeTab"
      :items="tabs"
      variant="underline"
    />

    <BaseDataTable
      :columns="columns"
      :rows="filteredHistory"
      :page-size="10"
      empty-message="적립 내역이 없습니다."
    >
      <template #cell-date="{ row }">
        <span class="history__date">{{ row.date }}</span>
      </template>
      <template #cell-category="{ row }">
        <span class="history__badge" :style="badgeStyle(row.category)">
          {{ row.category }}
        </span>
      </template>
      <template #cell-points="{ row }">
        <span class="history__points">+{{ row.points }}</span>
      </template>
    </BaseDataTable>
  </div>
</template>

<style scoped>
.history {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 24px;
}

.history__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.history__icon {
  font-size: 18px;
}

.history__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0;
}

.history__date {
  font-weight: 600;
  color: var(--color-text-strong);
  white-space: nowrap;
}

.history__badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: var(--radius-2xs);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.history__points {
  font-weight: 700;
  color: var(--tier-s);
  white-space: nowrap;
}
</style>
