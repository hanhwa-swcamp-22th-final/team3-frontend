<script setup>
defineEmits(['openAddModal'])
</script>

<template>
  <div class="kmh">
    <span class="kmh__title">📚 내가 작성한 지식 관리</span>
    <button class="kmh__btn" @click="$emit('openAddModal')">새 지식 작성</button>
  </div>
</template>

<style scoped>
.kmh {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kmh__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.kmh__btn {
  padding: 10px 24px;
  background: var(--color-primary-800);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.kmh__btn:hover {
  background: var(--color-primary-700);
}
</style>
