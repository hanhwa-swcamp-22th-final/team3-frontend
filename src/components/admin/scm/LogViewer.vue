<script setup>
import { LEVEL_STYLE } from '@/mocks/admin/record/logData.js'

defineProps({
  logs: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="log-viewer">
    <div
      v-for="log in logs"
      :key="log.id"
      class="log-row"
    >
      <span class="log-time">{{ log.time }}</span>
      <span
        class="log-level"
        :style="{
          background: LEVEL_STYLE[log.level].bg,
          color:      LEVEL_STYLE[log.level].color,
        }"
      >{{ log.level }}</span>
      <span class="log-message">{{ log.message }}</span>
    </div>

    <div v-if="logs.length === 0" class="log-empty">표시할 로그가 없습니다.</div>
  </div>
</template>

<style scoped>
.log-viewer {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: var(--color-bg-terminal);
  border-radius: var(--radius-xs);
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  gap: 0;
  font-family: var(--font-family-mono);
}

.log-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  height: 20px;
  flex-shrink: 0;
}

.log-time {
  font-size: 11px;
  font-weight: 400;
  color: var(--color-log-time);
  width: 93px;
  flex-shrink: 0;
}

.log-level {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 3px;
  flex-shrink: 0;
  line-height: 18px;
}

.log-message {
  font-size: 11px;
  font-weight: 400;
  color: var(--color-log-message);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.log-empty {
  font-size: 12px;
  color: var(--color-primary-600);
  text-align: center;
  padding: 40px 0;
}
</style>
