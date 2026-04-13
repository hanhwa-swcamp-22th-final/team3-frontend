<script setup>
import { computed, ref, watch } from 'vue'
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  selectedId: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['select-item'])
const currentPage = ref(1)
const pageSize = 5

const totalPages = computed(() => Math.max(1, Math.ceil(props.items.length / pageSize)))
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return props.items.slice(start, start + pageSize)
})

watch(() => props.items.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

function setPage(page) {
  currentPage.value = page
}

</script>

<template>
  <section class="queue">
    <div class="queue__head">
      <div>
        <p class="queue__eyebrow">문서 승인 대기 목록</p>
        <h2>승인 대기 목록</h2>
      </div>
      <span class="queue__count">{{ items.length }}건</span>
    </div>

    <div class="queue__list">
      <button
        v-for="item in pagedItems"
        :key="item.id"
        type="button"
        class="queue__item"
        :class="{ 'queue__item--active': selectedId === item.id }"
        @click="emit('select-item', item.id)"
      >
        <div class="queue__item-top">
          <strong>{{ item.title }}</strong>
        </div>
        <p>{{ item.author }} · {{ item.date }}</p>
      </button>

      <div v-if="items.length === 0" class="queue__empty">현재 조건에 맞는 승인 문서가 없습니다.</div>
    </div>

    <div v-if="items.length > 0" class="queue__pagination">
      <button
        v-for="page in pageNumbers"
        :key="page"
        type="button"
        class="queue__page"
        :class="{ 'queue__page--active': currentPage === page }"
        @click="setPage(page)"
      >
        {{ page }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.queue {
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  background: var(--color-bg-surface);
  padding: 16px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 12px;
  min-width: 0;
  box-sizing: border-box;
}

.queue__head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
}

.queue__eyebrow {
  font-size: var(--font-size-xs-plus);
  font-weight: 700;
  color: var(--color-primary-300);
}

.queue__head h2 {
  margin-top: 6px;
  font-size: var(--font-size-lg-plus);
  color: var(--color-primary-800);
}

.queue__count {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--color-primary-100);
  font-size: var(--font-size-xs-plus);
  font-weight: 700;
  color: var(--color-primary-700);
  white-space: nowrap;
}

.queue__list {
  display: grid;
  align-content: start;
  gap: 8px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.queue__item {
  width: 100%;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 12px 14px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.queue__item--active {
  border-color: var(--color-primary-400);
  background: #f8f6ff;
  box-shadow: inset 0 0 0 1px rgba(91, 80, 214, 0.12);
}

.queue__item-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.queue__item strong {
  font-size: var(--font-size-md);
  color: var(--color-primary-800);
}

.queue__item p {
  margin-top: 6px;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.queue__empty {
  min-height: 140px;
  display: grid;
  place-items: center;
  border: 1px dashed var(--color-border-default);
  border-radius: 14px;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.queue__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding-top: 4px;
  flex-shrink: 0;
}

.queue__page {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--color-border-default);
  background: #fff;
  color: var(--color-text-default);
  font-size: var(--font-size-sm);
  font-weight: 700;
  cursor: pointer;
}

.queue__page--active {
  border-color: var(--color-primary-700);
  background: var(--color-primary-700);
  color: #fff;
}
</style>

