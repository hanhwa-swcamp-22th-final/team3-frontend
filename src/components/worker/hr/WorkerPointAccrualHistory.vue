<script setup>
import { ref, computed } from 'vue'
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

    <div class="history__tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="history__tab"
        :class="{ 'history__tab--active': activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <table class="history__table">
      <thead>
        <tr>
          <th>날짜</th>
          <th>구분</th>
          <th>내용</th>
          <th>포인트</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in filteredHistory" :key="row.id">
          <td class="history__date">{{ row.date }}</td>
          <td>
            <span class="history__badge" :style="badgeStyle(row.category)">
              {{ row.category }}
            </span>
          </td>
          <td class="history__desc">{{ row.description }}</td>
          <td class="history__points">+{{ row.points }}</td>
        </tr>
      </tbody>
    </table>
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

.history__tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--color-border-muted);
}

.history__tab {
  padding: 8px 16px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.history__tab--active {
  color: var(--color-primary-800);
  font-weight: 700;
  border-bottom-color: var(--color-primary-800);
}

.history__table {
  width: 100%;
  border-collapse: collapse;
}

.history__table th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  padding: 8px 4px;
  border-bottom: 1px solid var(--color-border-default);
}

.history__table td {
  padding: 14px 4px;
  border-bottom: 1px solid var(--color-border-muted);
  font-size: 14px;
  color: var(--color-text-default);
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

.history__desc {
  color: var(--color-text-default);
}

.history__points {
  font-weight: 700;
  color: var(--tier-s);
  white-space: nowrap;
}
</style>
