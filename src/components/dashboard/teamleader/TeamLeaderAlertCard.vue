<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="alert-card" :class="`alert-card--${item.tone}`">
    <p class="alert-card__category">{{ item.category }}</p>
    <strong class="alert-card__title">{{ item.title }}</strong>
    <p class="alert-card__description">{{ item.description }}</p>
    <span class="alert-card__time">{{ item.time }}</span>
  </article>
</template>

<style scoped>
.alert-card {
  display: grid;
  gap: 8px;
  min-height: 112px;
  padding: 14px 14px 12px;
  border: 1px solid var(--color-border-soft);
  border-left-width: 4px;
  border-radius: 16px;
  background: #fcfbff;
}

.alert-card--mint {
  border-left-color: var(--color-mint-500);
}

.alert-card--primary {
  border-left-color: var(--color-primary-600);
}

.alert-card__category {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.alert-card__title {
  font-size: 15px;
  line-height: 1.35;
  color: var(--color-primary-800);
}

.alert-card__description {
  font-size: 13px;
  line-height: 1.4;
  color: var(--color-text-default);
}

.alert-card__time {
  margin-top: auto;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
}
</style>
