<script setup>
defineProps({
  total: { type: Number, default: 0 },
  inProgress: { type: Number, default: 0 },
  done: { type: Number, default: 0 },
})
</script>

<template>
  <div class="jc">
    <div class="jc__card">
      <span class="jc__label">배정 작업</span>
      <span class="jc__value">{{ total }}<span class="jc__unit">건</span></span>
    </div>
    <div class="jc__card">
      <span class="jc__label jc__label--progress">진행중</span>
      <span class="jc__value jc__value--progress">{{ inProgress }}<span class="jc__unit">건</span></span>
    </div>
    <div class="jc__card">
      <span class="jc__label jc__label--done">완료</span>
      <span class="jc__value jc__value--done">{{ done }}<span class="jc__unit">건</span></span>
    </div>
  </div>
</template>

<style scoped>
.jc {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.jc__card {
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.jc__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.jc__label--progress {
  color: var(--color-primary-700);
}

.jc__label--done {
  color: var(--color-text-muted);
}

.jc__value {
  font-size: 40px;
  font-weight: 800;
  color: var(--color-text-strong);
  line-height: 1;
}

.jc__value--progress {
  color: var(--color-primary-700);
}

.jc__value--done {
  color: var(--color-text-muted);
}

.jc__unit {
  font-size: 20px;
  font-weight: 700;
  margin-left: 2px;
}
</style>
