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
    <article
      v-for="(card, index) in cards"
      :key="card.label || index"
      class="knowledge-header__card"
    >
      <div class="knowledge-header__label">
        {{ card.label }}
      </div>

      <div class="knowledge-header__value-row">
        <strong class="knowledge-header__value">
          {{ card.value }}
        </strong>
      </div>

      <div
        v-if="card.helper"
        class="knowledge-header__helper"
        :class="{
          'knowledge-header__helper--positive': card.tone === 'success',
          'knowledge-header__helper--negative': card.tone === 'danger',
        }"
      >
        {{ card.helper }}
      </div>
    </article>
  </section>
</template>

<style scoped>
.knowledge-header {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  width: 100%;
  align-self: stretch;
}

.knowledge-header__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 80px;
  padding: 15px 17px 10px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  box-shadow: 0 6px 18px rgba(45, 31, 110, 0.04);
}

.knowledge-header__label {
  width: 100%;
  min-height: 12px;
  font-family: var(--font-family-base);
  font-size: var(--font-size-2xs);
  line-height: 12px;
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.02em;
  color: var(--color-text-placeholder);
}

.knowledge-header__value-row {
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-height: 30px;
  margin-top: 9px;
}

.knowledge-header__value {
  font-family: var(--font-family-num);
  font-size: var(--font-size-display-sm);
  line-height: 30px;
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.03em;
  color: var(--color-primary-800);
}

.knowledge-header__helper {
  width: 100%;
  min-height: 13px;
  margin-top: 6px;
  font-family: var(--font-family-base);
  font-size: var(--font-size-xs);
  line-height: 13px;
  font-weight: var(--font-weight-regular);
  color: var(--color-text-muted);
}

.knowledge-header__helper--positive {
  color: var(--tier-s);
}

.knowledge-header__helper--negative {
  color: var(--color-danger-text);
}

@media (max-width: 980px) {
  .knowledge-header {
    grid-template-columns: 1fr;
  }
}
</style>
