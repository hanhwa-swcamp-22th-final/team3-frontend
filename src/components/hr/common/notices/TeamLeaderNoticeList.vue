<script setup>
import { computed, ref, watch } from 'vue'

const emit = defineEmits(['select-notice'])

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  selectedId: {
    type: Number,
    default: null,
  },
  pageSize: {
    type: Number,
    default: 3,
  },
})

const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.items.length / props.pageSize)))
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return props.items.slice(start, start + props.pageSize)
})

watch(
  () => [props.items.length, props.pageSize],
  () => {
    currentPage.value = 1
  }
)

function selectNotice(noticeId) {
  emit('select-notice', noticeId)
}

function goToPage(page) {
  currentPage.value = page

  const firstItem = paginatedItems.value[0]
  if (firstItem) {
    emit('select-notice', firstItem.id)
  }
}
</script>

<template>
  <section class="notice-list">
    <article
      v-for="item in paginatedItems"
      :key="item.id"
      class="notice-card"
      :class="{ 'notice-card--selected': item.id === selectedId }"
      @click="selectNotice(item.id)"
    >
      <div class="notice-card__top">
        <div class="notice-card__badges">
          <span v-if="item.pin" class="notice-card__badge notice-card__badge--pin">PIN</span>
          <span
            class="notice-card__badge"
            :class="item.status === '예약' ? 'notice-card__badge--reserve' : 'notice-card__badge--live'"
          >
            {{ item.status }}
          </span>
        </div>
        <span class="notice-card__views">{{ item.views }}</span>
      </div>

      <h2 class="notice-card__title">{{ item.title }}</h2>
      <p class="notice-card__summary">{{ item.summary }}</p>

      <div class="notice-card__meta">
        <span>{{ item.author }}</span>
        <span>{{ item.schedule }}</span>
        <span>{{ item.target }}</span>
      </div>
    </article>

    <footer v-if="totalPages > 1" class="notice-list__pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        class="notice-list__page"
        :class="{ 'notice-list__page--active': page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </footer>
  </section>
</template>

<style scoped>
.notice-list {
  display: grid;
  gap: 14px;
  min-height: 640px;
  padding: 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 0 0 20px 20px;
  background: var(--color-bg-surface);
  align-content: start;
}

.notice-card {
  padding: 18px 18px 16px;
  border: 2px solid #ede9ff;
  border-radius: 18px;
  background: #fff;
  cursor: pointer;
}

.notice-card--selected {
  border-color: #c8bcff;
  background: #f9f7ff;
}

.notice-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.notice-card__badges {
  display: flex;
  gap: 8px;
}

.notice-card__badge {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.notice-card__badge--pin {
  background: #f1efff;
  color: #7569e0;
}

.notice-card__badge--live {
  background: #e9fbf6;
  color: #18a98e;
}

.notice-card__badge--reserve {
  background: #fff6da;
  color: #d39b00;
}

.notice-card__views {
  color: var(--color-primary-300);
  font-size: 14px;
  font-weight: 700;
}

.notice-card__title {
  margin-top: 14px;
  font-size: 22px;
  color: var(--color-primary-800);
}

.notice-card__summary {
  margin-top: 10px;
  color: var(--color-primary-300);
  line-height: 1.6;
}

.notice-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  color: #9a93ca;
  font-size: 13px;
  font-weight: 700;
}

.notice-list__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 6px;
}

.notice-list__page {
  width: 34px;
  height: 34px;
  border: 1px solid #ddd7ff;
  border-radius: 10px;
  background: #fff;
  color: var(--color-primary-500);
  font-weight: 700;
  cursor: pointer;
}

.notice-list__page--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-600);
  color: #fff;
}
</style>
