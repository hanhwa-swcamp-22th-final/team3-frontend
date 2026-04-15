<script setup>
import { BaseEmptyState } from '@/components/common/base'

defineProps({
  eyebrow: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  totalLabel: {
    type: String,
    required: true,
  },
  searchPlaceholder: {
    type: String,
    default: '이름으로 검색',
  },
  searchValue: {
    type: String,
    default: '',
  },
  searchAriaLabel: {
    type: String,
    default: '목록 검색',
  },
  emptyTitle: {
    type: String,
    required: true,
  },
  emptyDescription: {
    type: String,
    required: true,
  },
  hasItems: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:searchValue'])
</script>

<template>
  <section class="unified-list-panel">
    <div class="unified-list-panel__header">
      <div>
        <p class="unified-list-panel__eyebrow">{{ eyebrow }}</p>
        <h3 class="unified-list-panel__title">{{ title }}</h3>
      </div>
      <span class="unified-list-panel__total">{{ totalLabel }}</span>
    </div>

    <div v-if="$slots.filters" class="unified-list-panel__filters">
      <slot name="filters" />
    </div>

    <label class="unified-list-panel__search" :aria-label="searchAriaLabel">
      <span class="unified-list-panel__search-icon" aria-hidden="true">⌕</span>
      <input
        :value="searchValue"
        type="text"
        class="unified-list-panel__search-input"
        :placeholder="searchPlaceholder"
        @input="emit('update:searchValue', $event.target.value)"
      />
    </label>

    <div v-if="hasItems" class="unified-list-panel__list">
      <slot />
    </div>

    <BaseEmptyState
      v-else
      icon="⌕"
      :title="emptyTitle"
      :description="emptyDescription"
      class="unified-list-panel__empty"
    />

    <div v-if="$slots.pagination" class="unified-list-panel__pagination">
      <slot name="pagination" />
    </div>
  </section>
</template>

<style scoped>
.unified-list-panel {
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr) auto;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  height: 100%;
  min-height: 600px;
  overflow: hidden;
  box-sizing: border-box;
}

.unified-list-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.unified-list-panel__eyebrow {
  margin: 0 0 4px;
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
}

.unified-list-panel__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

.unified-list-panel__total {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

.unified-list-panel__filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.unified-list-panel__search {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  background: var(--color-bg-surface-muted);
}

.unified-list-panel__search-icon {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-base-plus);
}

.unified-list-panel__search-input {
  width: 100%;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: var(--font-size-sm);
  color: var(--color-primary-800);
}

.unified-list-panel__search-input::placeholder {
  color: var(--color-text-muted);
}

.unified-list-panel__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.unified-list-panel__empty {
  align-self: center;
}

.unified-list-panel__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 34px;
}

@media (max-width: 720px) {
  .unified-list-panel {
    padding: 16px;
  }

  .unified-list-panel__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .unified-list-panel__filters,
  .unified-list-panel__pagination {
    flex-wrap: wrap;
  }
}
</style>
