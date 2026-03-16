<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  notices: { type: Array, required: true },
  selectedId: { type: Number, default: null },
})

const emit = defineEmits(['select'])

const categories = ['전체', '긴급', '교육', '점검']
const activeCategory = ref('전체')
const authorFilter = ref('HRM 전체')
const authorOptions = ['HRM 전체']

const filteredNotices = computed(() => {
  if (activeCategory.value === '전체') return props.notices
  return props.notices.filter((n) => n.category === activeCategory.value)
})
</script>

<template>
  <div class="nl">
    <div class="nl__header">
      <h3 class="nl__title">공지 목록</h3>
      <span class="nl__count">총 {{ notices.length }}건</span>
    </div>

    <!-- Category tabs -->
    <div class="nl__filters">
      <div class="nl__tabs">
        <button
          v-for="cat in categories"
          :key="cat"
          class="nl__tab"
          :class="{ 'nl__tab--active': activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
      <div class="nl__author">
        <span class="nl__author-label">작성자:</span>
        <select v-model="authorFilter" class="nl__author-select">
          <option v-for="opt in authorOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
    </div>

    <!-- Notice cards -->
    <div class="nl__list">
      <div
        v-for="notice in filteredNotices"
        :key="notice.id"
        class="nl__card"
        :class="{ 'nl__card--selected': selectedId === notice.id }"
        @click="emit('select', notice.id)"
      >
        <div class="nl__card-top">
          <div class="nl__card-badges">
            <span v-if="notice.pinned" class="nl__badge nl__badge--pin">PIN</span>
            <span class="nl__badge" :class="'nl__badge--' + notice.status">
              {{ notice.statusLabel }}
            </span>
          </div>
          <span class="nl__card-views">조회 {{ notice.views }}</span>
        </div>
        <h4 class="nl__card-title">{{ notice.title }}</h4>
        <p class="nl__card-preview">{{ notice.preview }}</p>
        <div class="nl__card-meta">
          <span>작성자 {{ notice.author }}</span>
          <span>{{ notice.date }}</span>
          <span v-if="notice.target">대상: {{ notice.target }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nl {
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nl__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.nl__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0;
}

.nl__count {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* ── Filters ────────────────────────────────────────────── */
.nl__filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.nl__tabs {
  display: flex;
  gap: 6px;
}

.nl__tab {
  padding: 6px 14px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  background: #ffffff;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-default);
  cursor: pointer;
}

.nl__tab--active {
  background: var(--color-primary-800);
  color: #ffffff;
  border-color: var(--color-primary-800);
}

.nl__author {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.nl__author-select {
  border: none;
  background: none;
  font-size: 12px;
  color: var(--color-text-muted);
  cursor: pointer;
}

/* ── Cards ──────────────────────────────────────────────── */
.nl__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nl__card {
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nl__card:hover {
  border-color: var(--color-primary-300);
}

.nl__card--selected {
  background: var(--color-primary-100);
  border-left: 4px solid var(--color-primary-700);
  padding-left: 17px;
}

.nl__card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.nl__card-badges {
  display: flex;
  gap: 6px;
}

.nl__badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.nl__badge--pin {
  background: var(--color-primary-200);
  color: var(--color-primary-800);
}

.nl__badge--active {
  background: #dcfce7;
  color: #166534;
}

.nl__badge--scheduled {
  background: #fef3c7;
  color: #92400e;
}

.nl__card-views {
  font-size: 12px;
  color: var(--color-text-muted);
}

.nl__card-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0 0 6px;
  line-height: 1.4;
}

.nl__card-preview {
  font-size: 13px;
  color: var(--color-text-default);
  line-height: 1.6;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.nl__card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.nl__card-meta span:not(:last-child)::after {
  content: '';
  margin-left: 8px;
}
</style>
