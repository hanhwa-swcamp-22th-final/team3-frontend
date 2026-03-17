<script setup>
defineProps({
  cards: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="knowledge-header">
    <article v-for="card in cards" :key="card.key" class="knowledge-header__card">
      <p class="knowledge-header__label">{{ card.label }}</p>
      <strong class="knowledge-header__value">{{ card.value }}</strong>
      <p class="knowledge-header__helper">{{ card.helper }}</p>
    </article>
  </section>
</template>

<style scoped>
.knowledge-header {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.knowledge-header__card {
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  background: var(--color-bg-surface);
  padding: 20px 24px;
  display: grid;
  gap: 6px;
}

.knowledge-header__label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.knowledge-header__value {
  font-size: 42px;
  line-height: 1;
  color: var(--color-primary-800);
}

.knowledge-header__helper {
  font-size: 13px;
  color: var(--color-text-muted);
}

@media (max-width: 980px) {
  .knowledge-header {
    grid-template-columns: 1fr;
  }
}
</style>
