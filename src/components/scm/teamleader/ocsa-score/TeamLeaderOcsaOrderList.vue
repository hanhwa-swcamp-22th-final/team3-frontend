<script setup>
import { computed, ref, watch } from 'vue'
import { BaseFilterTabs } from '@/components/common/base'

const emit = defineEmits(['select-order', 'change-filter'])

const props = defineProps({
  filters: {
    type: Array,
    default: () => [],
  },
  activeFilter: {
    type: String,
    default: 'all',
  },
  orders: {
    type: Array,
    default: () => [],
  },
  selectedId: {
    type: Number,
    default: null,
  },
  pageSize: {
    type: Number,
    default: 6,
  },
})

const currentPage = ref(1)
const searchKeyword = ref('')

const searchedOrders = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return props.orders
  return props.orders.filter((order) => {
    return [order.code, order.title].some((value) => value.toLowerCase().includes(keyword))
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(searchedOrders.value.length / props.pageSize)))
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return searchedOrders.value.slice(start, start + props.pageSize)
})

watch(
  () => [props.orders, props.pageSize, searchKeyword.value],
  () => {
    currentPage.value = 1
  },
  { deep: true }
)

watch(
  () => props.selectedId,
  (selectedId) => {
    if (!selectedId) return
    const selectedIndex = searchedOrders.value.findIndex((order) => order.id === selectedId)
    if (selectedIndex === -1) return
    currentPage.value = Math.floor(selectedIndex / props.pageSize) + 1
  },
  { immediate: true }
)

function changePage(page) {
  currentPage.value = page
  const firstOrder = paginatedOrders.value[0]
  if (firstOrder) {
    emit('select-order', firstOrder.id)
  }
}
</script>

<template>
  <section class="ocsa-order-list">
    <header class="ocsa-order-list__header">
      <p class="ocsa-order-list__eyebrow">주문별 난이도 목록</p>
      <BaseFilterTabs
        class="ocsa-order-list__filters"
        :items="filters"
        :model-value="activeFilter"
        size="sm"
        @change="emit('change-filter', $event)"
      />
      <input
        v-model="searchKeyword"
        class="ocsa-order-list__search"
        type="text"
        placeholder="주문번호 / 품목명 검색"
      />
    </header>

    <div class="ocsa-order-list__body">
      <button
        v-for="order in paginatedOrders"
        :key="order.id"
        type="button"
        class="ocsa-order-list__card"
        :class="{
          'ocsa-order-list__card--selected': order.id === selectedId,
          [`ocsa-order-list__card--${order.gradeTone}`]: true,
        }"
        @click="emit('select-order', order.id)"
      >
        <div class="ocsa-order-list__card-top">
          <span class="ocsa-order-list__code">{{ order.code }}</span>
          <div class="ocsa-order-list__badges">
            <span class="ocsa-order-list__grade" :class="`ocsa-order-list__grade--${order.gradeTone}`">{{ order.grade }}</span>
            <span class="ocsa-order-list__deadline">{{ order.deadline }}</span>
          </div>
        </div>
        <strong class="ocsa-order-list__title">{{ order.title }}</strong>
      </button>

      <div v-if="!paginatedOrders.length" class="ocsa-order-list__empty">
        조건에 맞는 주문이 없습니다.
      </div>
    </div>

    <footer class="ocsa-order-list__pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        class="ocsa-order-list__page"
        :class="{ 'ocsa-order-list__page--active': page === currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
    </footer>
  </section>
</template>

<style scoped>
.ocsa-order-list {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 14px;
  min-height: 100%;
  padding: 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 22px;
  background: var(--color-bg-surface);
}

.ocsa-order-list__eyebrow {
  font-size: var(--font-size-sm);
  font-weight: 800;
  color: var(--color-primary-600);
}

.ocsa-order-list__filters {
  margin-top: 12px;
}

.ocsa-order-list__search {
  width: 100%;
  height: 40px;
  margin-top: 12px;
  padding: 0 14px;
  border: 1px solid var(--color-border-default);
  border-radius: 10px;
  outline: none;
}

.ocsa-order-list__body {
  display: grid;
  align-content: start;
  gap: 10px;
  min-height: 0;
}

.ocsa-order-list__card {
  display: grid;
  gap: 10px;
  min-height: 72px;
  padding: 14px 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  background: #fff;
  text-align: left;
  cursor: pointer;
}

.ocsa-order-list__card--selected {
  background: #f7f4ff;
  box-shadow: inset 0 0 0 1px var(--color-primary-500);
}

.ocsa-order-list__card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.ocsa-order-list__code {
  font-size: var(--font-size-xs-plus);
  font-weight: 800;
  color: var(--color-primary-300);
}

.ocsa-order-list__badges {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ocsa-order-list__grade,
.ocsa-order-list__deadline {
  font-size: var(--font-size-xs);
  font-weight: 800;
}

.ocsa-order-list__grade {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  color: #fff;
}

.ocsa-order-list__grade--danger { background: #ef476f; }
.ocsa-order-list__grade--warning { background: #f2b53c; color: #5c4300; }
.ocsa-order-list__grade--primary { background: #7468e2; }
.ocsa-order-list__grade--success { background: #18c3aa; }

.ocsa-order-list__deadline {
  color: var(--color-primary-300);
}

.ocsa-order-list__title {
  font-size: var(--font-size-base-plus);
  color: var(--color-primary-800);
}

.ocsa-order-list__empty {
  display: grid;
  place-items: center;
  min-height: 180px;
  border: 1px dashed var(--color-border-default);
  border-radius: 14px;
  color: var(--color-text-muted);
}

.ocsa-order-list__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: auto;
}

.ocsa-order-list__page {
  width: 34px;
  height: 34px;
  border: 1px solid var(--color-border-default);
  border-radius: 10px;
  background: #fff;
  color: var(--color-primary-500);
  font-weight: 700;
  cursor: pointer;
}

.ocsa-order-list__page--active {
  background: var(--color-primary-600);
  border-color: var(--color-primary-600);
  color: #fff;
}
</style>

