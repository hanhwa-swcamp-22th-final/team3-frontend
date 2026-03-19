<script setup>
import BaseFilterTabs from '@/components/common/base/navigation/BaseFilterTabs.vue'

defineProps({
  list:           { type: Array,  required: true },
  pendingCount:   { type: Number, required: true },
  heldCount:      { type: Number, default: 0 },
  processedCount: { type: Number, default: 0 },
  tabs:           { type: Array,  required: true },
  activeTab:      { type: String, required: true },
  selectedId:     { default: null },
})
defineEmits(['tab-change', 'select'])
</script>

<template>
  <article class="hrm-panel">
    <p class="hrm-panel__header">
      <template v-if="activeTab === '처리 완료'">✅ 처리 완료 ({{ processedCount }}건)</template>
      <template v-else-if="activeTab === '보류'">⏳ 보류 ({{ heldCount }}건)</template>
      <template v-else>📋 이의신청 검토 대기 ({{ pendingCount }}건)</template>
    </p>

    <BaseFilterTabs
      :items="tabs"
      :modelValue="activeTab"
      variant="underline"
      @change="$emit('tab-change', $event)"
    />

    <div class="hrm-list">
      <div v-if="list.length === 0" class="hrm-list__empty">
        승인 대기 내역이 없습니다.
      </div>
      <div
        v-for="item in list"
        :key="item.id"
        class="hrm-list-item"
        :class="{ 'hrm-list-item--selected': selectedId === item.id }"
        @click="$emit('select', item.id)"
      >
        <div class="hrm-list-item__info">
          <div class="hrm-list-item__row1">
            <span class="hrm-badge" :style="{ background: item.typeBg, color: item.typeColor }">{{ item.type }}</span>
            <span class="hrm-list-item__name">{{ item.name }}</span>
            <span class="hrm-grade" :style="{ background: item.gradeBg, color: item.gradeColor }">{{ item.grade }}</span>
            <span v-if="item.processedLabel" class="hrm-processed-badge" :style="{ background: item.processedBg, color: item.processedColor }">{{ item.processedLabel }}</span>
          </div>
          <p class="hrm-list-item__desc">{{ item.desc }}</p>
          <p class="hrm-list-item__date">{{ item.date }}</p>
        </div>
        <div class="hrm-list-item__check" :class="{ 'hrm-list-item__check--filled': selectedId === item.id }"></div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.hrm-panel {
  width: 460px; flex-shrink: 0;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 12px; padding: 20px;
}
.hrm-panel__header {
  font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: #a89ed8;
  letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 16px;
}


:deep(.base-filter-tabs) { margin-bottom: 12px; }

.hrm-list { display: flex; flex-direction: column; gap: 8px; }
.hrm-list__empty { padding: 32px 0; text-align: center; font-size: var(--font-size-sm); color: #a89ed8; }

.hrm-list-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px;
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: 6px; cursor: pointer;
}
.hrm-list-item:hover { border-color: var(--color-border-strong); }
.hrm-list-item--selected { border-color: var(--color-primary-600); background: var(--color-primary-100); }
.hrm-list-item__info { display: flex; flex-direction: column; gap: 2px; }
.hrm-list-item__row1 { display: flex; align-items: center; gap: 6px; }
.hrm-list-item__name { font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-primary-800); }
.hrm-list-item__desc { font-size: var(--font-size-sm); color: #7a6fa8; }
.hrm-list-item__date { font-size: var(--font-size-2xs); color: #a89ed8; }

.hrm-badge {
  display: inline-flex; align-items: center; height: 14px; padding: 0 7px;
  border-radius: 3px; font-size: var(--font-size-2xs); font-weight: 900; white-space: nowrap;
}
.hrm-grade {
  display: inline-flex; align-items: center; height: 14px; padding: 0 7px;
  border-radius: 3px; font-size: var(--font-size-2xs); font-weight: 900;
}

.hrm-list-item__check {
  width: 14px; height: 14px; border: 1.5px solid var(--color-border-strong);
  border-radius: 7px; flex-shrink: 0;
}
.hrm-list-item__check--filled { background: var(--color-primary-600); border-color: var(--color-primary-600); }

.hrm-processed-badge {
  display: inline-flex; align-items: center; height: 14px; padding: 0 7px;
  border-radius: 3px; font-size: var(--font-size-2xs); font-weight: 900;
}
</style>
