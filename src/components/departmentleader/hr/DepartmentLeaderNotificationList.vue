<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  items:   { type: Array,  default: () => [] },
  filters: { type: Array,  default: () => [] },
  pageSize: { type: Number, default: 6 },
})

const activeFilter = ref('all')
const currentPage  = ref(1)

const filtered = computed(() => {
  const f = props.filters.find((f) => f.key === activeFilter.value)
  if (!f || !f.categoryKey) return props.items
  return props.items.filter((item) => item.category === f.categoryKey)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / props.pageSize)))
const paged = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return filtered.value.slice(start, start + props.pageSize)
})

watch(activeFilter, () => { currentPage.value = 1 })

function countFor(f) {
  if (!f.categoryKey) return props.items.length
  return props.items.filter((item) => item.category === f.categoryKey).length
}
</script>

<template>
  <section class="notif-list-panel">
    <!-- Filter tabs -->
    <div class="notif-list-panel__tabs">
      <button
        v-for="f in filters"
        :key="f.key"
        class="notif-list-panel__tab"
        :class="{ 'notif-list-panel__tab--active': activeFilter === f.key }"
        type="button"
        @click="activeFilter = f.key"
      >
        {{ f.label }}<span class="notif-list-panel__tab-count">({{ countFor(f) }})</span>
      </button>
    </div>

    <!-- Items -->
    <ul class="notif-list-panel__list">
      <li
        v-for="item in paged"
        :key="item.id"
        class="notif-item"
        :class="`notif-item--${item.tone}`"
      >
        <div class="notif-item__body">
          <div class="notif-item__tags">
            <span class="notif-item__tag notif-item__tag--category">{{ item.categoryLabel }}</span>
            <span class="notif-item__tag notif-item__tag--status">
              {{ item.unread ? '미확인' : '확인됨' }}
            </span>
          </div>
          <strong class="notif-item__title">{{ item.title }}</strong>
          <p class="notif-item__desc">{{ item.description }}</p>
        </div>
        <div class="notif-item__side">
          <span class="notif-item__time">{{ item.time }}</span>
          <button
            type="button"
            class="notif-item__action"
            :class="{ 'notif-item__action--primary': item.tone === 'fault' || (item.tone === 'warn' && item.unread) }"
          >
            {{ item.actionLabel }}
          </button>
        </div>
      </li>
    </ul>

    <!-- Pagination -->
    <footer v-if="totalPages > 1" class="notif-list-panel__pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        class="notif-list-panel__page"
        :class="{ 'notif-list-panel__page--active': page === currentPage }"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
    </footer>
  </section>
</template>

<style scoped>
/* Panel */
.notif-list-panel {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
  overflow: hidden;
}

/* Tabs */
.notif-list-panel__tabs {
  display: flex;
  gap: 20px;
  padding: 18px 22px 0;
  border-bottom: 1px solid #ece8ff;
}

.notif-list-panel__tab {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  padding: 0 2px;
  border: none;
  border-bottom: 3px solid transparent;
  background: transparent;
  font-size: 14px;
  font-weight: 700;
  color: #a7a1d8;
  cursor: pointer;
  margin-bottom: -1px;
}

.notif-list-panel__tab--active {
  color: var(--color-primary-700);
  border-bottom-color: var(--color-primary-600);
}

.notif-list-panel__tab-count {
  font-size: 13px;
  font-weight: 600;
}

/* List */
.notif-list-panel__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
  margin: 0;
}

/* Item base */
.notif-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border: 2px solid transparent;
  border-radius: 14px;
  background: #fff;
}

/* Tone border colors */
.notif-item--fault   { border-color: #ff5072; }
.notif-item--warn    { border-color: #f4c54b; }
.notif-item--success { border-color: #20c9a7; }
.notif-item--info    { border-color: #6557dd; }
.notif-item--neutral { border-color: var(--color-border-default); }

/* Body */
.notif-item__body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.notif-item__tags {
  display: flex;
  align-items: center;
  gap: 6px;
}

.notif-item__tag {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

/* Tag color per tone */
.notif-item--fault   .notif-item__tag { background: #fff0f4; color: #db294d; }
.notif-item--warn    .notif-item__tag { background: #fff7dd; color: #c28b00; }
.notif-item--success .notif-item__tag { background: #e9fbf6; color: #15967d; }
.notif-item--info    .notif-item__tag { background: #f1efff; color: #6557dd; }
.notif-item--neutral .notif-item__tag { background: #f3f3f5; color: #888; }

.notif-item__title {
  font-size: 15px;
  color: var(--color-primary-800);
}

.notif-item__desc {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* Side */
.notif-item__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.notif-item__time {
  font-size: 12px;
  color: #b1abd9;
  white-space: nowrap;
}

.notif-item__action {
  min-width: 68px;
  height: 34px;
  padding: 0 16px;
  border: 1px solid #e2dbff;
  border-radius: 8px;
  background: #fff;
  color: var(--color-primary-600);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.notif-item__action--primary {
  border: none;
  background: #f3294f;
  color: #fff;
}

.notif-item--warn .notif-item__action--primary {
  background: var(--color-primary-600);
}

/* Pagination */
.notif-list-panel__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 4px 20px 16px;
}

.notif-list-panel__page {
  width: 32px;
  height: 32px;
  border: 1px solid #e2dbff;
  border-radius: 8px;
  background: #fff;
  color: var(--color-primary-500);
  font-weight: 700;
  cursor: pointer;
}

.notif-list-panel__page--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-600);
  color: #fff;
}

@media (max-width: 720px) {
  .notif-item {
    flex-direction: column;
    align-items: stretch;
  }
  .notif-item__side {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
