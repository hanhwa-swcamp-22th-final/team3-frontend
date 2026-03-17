<script setup>
defineProps({
  counts: { type: Object, required: true },
})
</script>

<template>
  <div class="koc">
    <div class="koc__card">
      <span class="koc__label">전체 문서 수</span>
      <span class="koc__number koc__number--primary">{{ counts.total }}</span>
      <span class="koc__sub">{{ counts.totalSub }}</span>
    </div>
    <div class="koc__card">
      <span class="koc__label">승인 완료</span>
      <span class="koc__number koc__number--primary">{{ counts.approved }}</span>
      <span class="koc__sub">{{ counts.approvedSub }}</span>
    </div>
    <div class="koc__card">
      <span class="koc__label">승인 대기</span>
      <span class="koc__number koc__number--warning">{{ counts.pending }}</span>
      <span class="koc__sub">{{ counts.pendingSub }}</span>
    </div>
    <div class="koc__card">
      <span class="koc__label">임시 저장</span>
      <span class="koc__number koc__number--primary">{{ counts.draft }}</span>
      <span class="koc__sub">{{ counts.draftSub }}</span>
    </div>
  </div>
</template>

<style scoped>
.koc {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.koc__card {
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.koc__label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.koc__number {
  font-size: 36px;
  font-weight: 800;
  font-family: 'Inter', var(--font-family-base);
  line-height: 1.2;
}

.koc__number--primary {
  color: var(--color-primary-800);
}

.koc__number--warning {
  color: #D4A017;
}

.koc__sub {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
