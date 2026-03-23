<script setup>
import { computed, ref, watch } from 'vue'
import { BaseFilterTabs } from '@/components/common/base'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  activeFilter: {
    type: String,
    default: 'all',
  },
  selectedId: {
    type: Number,
    default: null,
  },
  filters: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['change-filter', 'select-item'])
const currentPage = ref(1)
const pageSize = 5

const totalPages = computed(() => Math.max(1, Math.ceil(props.items.length / pageSize)))
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return props.items.slice(start, start + pageSize)
})

watch(() => props.activeFilter, () => {
  currentPage.value = 1
})

watch(() => props.items.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

function setPage(page) {
  currentPage.value = page
}

function typeClass(type) {
  return type === '수정' ? 'queue__type--edit' : 'queue__type--new'
}
</script>

<template>
  <section class="queue">
    <div class="queue__head">
      <div>
        <p class="queue__eyebrow">문서 승인 대기 목록</p>
        <h2>승인 대기 목록</h2>
      </div>
      <span class="queue__count">{{ filters.find((item) => item.key === 'all')?.count ?? items.length }}건</span>
    </div>

    <BaseFilterTabs
      class="queue__tabs"
      :items="filters"
      :model-value="activeFilter"
      variant="underline"
      show-count
      @change="emit('change-filter', $event)"
    />

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
          <span class="queue__type" :class="typeClass(item.type)">{{ item.type }}</span>
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
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
  padding: 18px;
  display: grid;
  gap: 16px;
  min-width: 0;
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
  font-size: var(--font-size-xl);
  color: var(--color-primary-800);
}

.queue__count {
  font-size: var(--font-size-xs-plus);
  font-weight: 700;
  color: var(--color-text-muted);
}

.queue__list {
  display: grid;
  gap: 10px;
}

.queue__item {
  width: 100%;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 14px 16px;
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
  gap: 10px;
}

.queue__item strong {
  font-size: var(--font-size-md-plus);
  color: var(--color-primary-800);
}

.queue__item p {
  margin-top: 8px;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.queue__type {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: var(--font-size-xs);
  font-weight: 800;
}

.queue__type--new {
  background: #e8fbf7;
  color: #10a58b;
}

.queue__type--edit {
  background: #efeaff;
  color: var(--color-primary-700);
}

.queue__empty {
  min-height: 180px;
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
}

.queue__page {
  width: 36px;
  height: 36px;
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

