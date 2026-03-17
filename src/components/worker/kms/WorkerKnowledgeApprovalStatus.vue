<script setup>
defineProps({
  status: { type: Object, required: true },
})
</script>

<template>
  <div class="kas">
    <span class="kas__subtitle">승인 상태</span>
    <h3 class="kas__title">승인/반려 현황</h3>

    <div class="kas__grid">
      <div class="kas__item kas__item--approved">
        <span class="kas__item-label">승인 완료</span>
        <span class="kas__item-count">{{ status.approved }}</span>
      </div>
      <div class="kas__item kas__item--pending">
        <span class="kas__item-label">승인 대기</span>
        <span class="kas__item-count">{{ status.pending }}</span>
      </div>
      <div class="kas__item kas__item--rejected">
        <span class="kas__item-label">반려</span>
        <span class="kas__item-count">{{ status.rejected }}</span>
      </div>
      <div class="kas__item kas__item--draft">
        <span class="kas__item-label">임시 저장</span>
        <span class="kas__item-count">{{ status.draft }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kas {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kas__subtitle {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary-700);
}

.kas__title {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text-strong);
  margin: 0;
}

.kas__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.kas__item {
  border-radius: var(--radius-base);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kas__item--approved {
  background: var(--color-status-approved-bg);
}

.kas__item--pending {
  background: var(--color-status-pending-bg);
}

.kas__item--rejected {
  background: var(--color-status-rejected-bg);
}

.kas__item--draft {
  background: var(--color-primary-100);
}

.kas__item-label {
  font-size: 12px;
  font-weight: 600;
}

.kas__item--approved .kas__item-label {
  color: var(--color-status-approved);
}

.kas__item--pending .kas__item-label {
  color: var(--color-status-pending);
}

.kas__item--rejected .kas__item-label {
  color: var(--color-status-rejected);
}

.kas__item--draft .kas__item-label {
  color: var(--color-primary-700);
}

.kas__item-count {
  font-size: 28px;
  font-weight: 800;
  font-family: var(--font-family-num);
  line-height: 1.2;
}

.kas__item--approved .kas__item-count {
  color: var(--color-status-approved);
}

.kas__item--pending .kas__item-count {
  color: var(--color-status-pending);
}

.kas__item--rejected .kas__item-count {
  color: var(--color-status-rejected);
}

.kas__item--draft .kas__item-count {
  color: var(--color-primary-700);
}
</style>
