<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  selectedRowKey: {
    type: [String, Number],
    default: null,
  },
  emptyMessage: {
    type: String,
    default: '데이터가 없습니다.',
  },
})

const emit = defineEmits(['click-row', 'click-action', 'change-page'])

const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.rows.length / props.pageSize)))
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return props.rows.slice(start, start + props.pageSize)
})

watch(
  () => [props.rows.length, props.pageSize],
  () => {
    currentPage.value = 1
  }
)

watch(
  () => props.selectedRowKey,
  (selectedRowKey) => {
    if (!selectedRowKey) return
    const selectedIndex = props.rows.findIndex((row) => row[props.rowKey] === selectedRowKey)
    if (selectedIndex === -1) return
    currentPage.value = Math.floor(selectedIndex / props.pageSize) + 1
  },
  { immediate: true }
)

function goToPage(page) {
  currentPage.value = page
  emit('change-page', page)
}

function handleRowClick(row) {
  emit('click-row', row)
}

function handleActionClick(payload) {
  emit('click-action', payload)
}

function columnSlotName(key) {
  return `cell-${key}`
}
</script>

<template>
  <div class="base-data-table">
    <div class="base-data-table__wrap">
      <table class="base-data-table__table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody v-if="paginatedRows.length > 0">
          <tr
            v-for="row in paginatedRows"
            :key="row[rowKey]"
            class="base-data-table__row"
            :class="{ 'base-data-table__row--selected': row[rowKey] === selectedRowKey }"
            @click="handleRowClick(row)"
          >
            <td v-for="column in columns" :key="column.key">
              <slot
                :name="columnSlotName(column.key)"
                :row="row"
                :column="column"
                :emit-action="handleActionClick"
              >
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="paginatedRows.length === 0" class="base-data-table__empty">
        {{ emptyMessage }}
      </div>
    </div>

    <footer v-if="totalPages > 1" class="base-data-table__pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        class="base-data-table__page"
        :class="{ 'base-data-table__page--active': page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </footer>
  </div>
</template>

<style scoped>
.base-data-table__wrap {
  overflow-x: auto;
}

.base-data-table__table {
  width: 100%;
  border-collapse: collapse;
}

.base-data-table__table th,
.base-data-table__table td {
  padding: 12px 10px;
  border-bottom: 1px solid #eeeaff;
  white-space: nowrap;
  font-size: var(--font-size-base);
  text-align: left;
}

.base-data-table__table th {
  color: #a8a0d7;
  font-size: var(--font-size-xs-plus);
  font-weight: 800;
  background: #f5f2ff;
  padding-top: 11px;
  padding-bottom: 11px;
}

.base-data-table__row {
  cursor: pointer;
  transition: background-color 0.18s ease, box-shadow 0.18s ease;
}

.base-data-table__row--selected td {
  background: #f6f3ff;
}

.base-data-table__row--selected td:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.base-data-table__row--selected td:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.base-data-table__empty {
  padding: 24px 16px;
  text-align: center;
  color: var(--color-text-muted);
}

.base-data-table__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
}

.base-data-table__page {
  width: 34px;
  height: 34px;
  border: 1px solid #ddd7ff;
  border-radius: 10px;
  background: #fff;
  color: var(--color-primary-500);
  font-weight: 700;
  cursor: pointer;
}

.base-data-table__page--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-600);
  color: #fff;
}
</style>
