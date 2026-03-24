<script setup>
defineProps({
  count: { type: Number, required: true },
  daysLeft: { type: Number, default: 3 },
})

</script>

<template>
  <div class="hrm-banner">
    <p class="hrm-banner__text">
      ⏰ 검토 대기 중인 이의신청이 {{ count }}건 있습니다 — 월말 고과 확정까지 D-{{ daysLeft }}
    </p>
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
.hrm-banner__text { font-size: var(--font-size-sm); color: #a07000; }
</style>
