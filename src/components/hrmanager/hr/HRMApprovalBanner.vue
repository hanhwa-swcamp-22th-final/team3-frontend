<script setup>
defineProps({
  count: { type: Number, required: true },
  daysLeft: { type: Number, default: 3 },
})
defineEmits(['bulk-review'])
</script>

<template>
  <div class="hrm-banner">
    <p class="hrm-banner__text">
      ⏰ 승인 대기 중인 평가가 {{ count }}건 있습니다 — 월말 고과 확정까지 D-{{ daysLeft }}
    </p>
    <button class="hrm-banner__btn" @click="$emit('bulk-review')">일괄 검토</button>
  </div>
</template>

<style scoped>
.hrm-banner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 20px; height: 56px;
  background: var(--color-warning-soft);
  border-left: 3px solid var(--tier-b);
  border-radius: 8px; flex-shrink: 0;
}
.hrm-banner__text { font-size: 13px; color: #a07000; }
.hrm-banner__btn {
  height: 34px; padding: 0 14px; font-size: 11px; font-weight: 700;
  color: #7a6fa8;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 4px; cursor: pointer;
}
.hrm-banner__btn:hover { background: var(--color-primary-100); }
</style>
