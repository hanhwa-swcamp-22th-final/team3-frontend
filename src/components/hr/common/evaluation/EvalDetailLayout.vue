<script setup>
import { BaseEmptyState } from '@/components/common/base'
import AiEvaluationFormPanel from '@/components/hr/common/evaluation/AiEvaluationFormPanel.vue'

defineProps({
  panelProps: {
    type: Object,
    default: () => ({}),
  },
  empty: {
    type: Boolean,
    default: false,
  },
  emptyTitle: {
    type: String,
    default: '대상을 선택하세요.',
  },
  emptyDescription: {
    type: String,
    default: '좌측 목록에서 대상을 선택하면 상세 내용이 표시됩니다.',
  },
  emptyIcon: {
    type: String,
    default: '✋',
  },
})
</script>

<template>
  <AiEvaluationFormPanel
    v-if="!empty"
    class="unified-detail-panel"
    v-bind="panelProps"
  >
    <template v-if="$slots.summary" #summary>
      <slot name="summary" />
    </template>

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </AiEvaluationFormPanel>

  <section v-else class="unified-detail-panel unified-detail-panel--empty">
    <BaseEmptyState
      :icon="emptyIcon"
      :title="emptyTitle"
      :description="emptyDescription"
    />
  </section>
</template>

<style scoped>
.unified-detail-panel {
  overflow-y: auto;
  min-height: 600px;
  max-height: calc(100vh - 200px);
}

.unified-detail-panel--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  box-sizing: border-box;
}
</style>
