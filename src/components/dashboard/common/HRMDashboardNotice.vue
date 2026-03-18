<script setup>
defineProps({
  badge: String,
  title: String,
  description: String,
})
</script>

<template>
  <section class="notice">
    <span class="notice__badge">{{ badge }}</span>
    <h1 class="notice__title">{{ title }}</h1>
    <p class="notice__description">{{ description }}</p>
  </section>
</template>

<style scoped>
.notice {
  padding: 22px;
  border: 1px solid var(--color-mint-200);
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(174, 236, 227, 0.65) 0%, rgba(232, 251, 247, 0.9) 100%);
}
.notice__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 104px;
  height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(24, 195, 170, 0.16);
  color: var(--color-info);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
}
.notice__title {
  margin-top: 16px;
  font-size: var(--font-size-lg);
  color: var(--color-primary-800);
}
.notice__description {
  margin-top: 12px;
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-primary-500);
}
</style>
