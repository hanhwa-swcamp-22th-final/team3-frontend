<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  percent: {
    type: String,
    required: true,
  },
  count: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    default: 'primary',
  },
  icon: {
    type: String,
    default: '●',
  },
})
</script>

<template>
  <article class="line-card" :class="`line-card--${tone}`">
    <p class="line-card__label">{{ title }}</p>
    <div class="line-card__row">
      <span class="line-card__icon">{{ icon }}</span>
      <strong class="line-card__percent">{{ percent }}</strong>
    </div>
    <p class="line-card__count">{{ count }}</p>
  </article>
</template>

<style scoped>
.line-card {
  display: grid;
  gap: 12px;
  min-height: 132px;
  padding: 18px 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  background: var(--color-bg-surface);
}

.line-card__label {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary-700);
}

.line-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.line-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 700;
  background: var(--color-primary-100);
}

.line-card__percent {
  font-size: 36px;
  line-height: 1;
}

.line-card__count {
  font-size: 13px;
  color: var(--color-text-muted);
}

.line-card--mint .line-card__percent {
  color: var(--color-mint-500);
}

.line-card--primary .line-card__percent {
  color: var(--color-primary-600);
}

.line-card--warning .line-card__percent {
  color: var(--color-warning);
}

.line-card--danger .line-card__percent {
  color: var(--color-danger);
}
</style>
