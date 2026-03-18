<script setup>
defineProps({
  tierS: { type: Number, default: 0 },
  tierA: { type: Number, default: 0 },
  tierB: { type: Number, default: 0 },
  processLabel: { type: String, default: '' },
  processPercent: { type: Number, default: 0 },
})
</script>

<template>
  <section class="tier-dist-card">
    <h3 class="tier-dist-card__title">Tier 분포</h3>

    <div class="tier-dist-card__numbers">
      <div class="tier-num tier-num--s">
        <span class="tier-num__value">{{ tierS }}</span>
        <span class="tier-num__label">S</span>
      </div>
      <div class="tier-num tier-num--a">
        <span class="tier-num__value">{{ tierA }}</span>
        <span class="tier-num__label">A</span>
      </div>
      <div class="tier-num tier-num--b">
        <span class="tier-num__value">{{ tierB }}</span>
        <span class="tier-num__label">B</span>
      </div>
    </div>

    <div class="tier-dist-card__process">
      <p class="process-label">{{ processLabel }}</p>
      <div class="process-bar">
        <div class="process-bar__fill" :style="{ width: processPercent + '%' }" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.tier-dist-card {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tier-dist-card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

.tier-dist-card__numbers {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 12px;
}

.tier-num {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.tier-num__value {
  font-size: var(--font-size-display);
  font-weight: var(--font-weight-bold);
  line-height: 1;
}

.tier-num__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
}

.tier-num--s .tier-num__value { color: var(--tier-s); }
.tier-num--a .tier-num__value { color: var(--tier-a); }
.tier-num--b .tier-num__value { color: var(--tier-b); }

.tier-dist-card__process {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.process-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.process-bar {
  height: 8px;
  width: 100%;
  border-radius: 999px;
  background: var(--color-neutral-200);
  overflow: hidden;
}

.process-bar__fill {
  height: 100%;
  border-radius: 999px;
  background: var(--color-mint-500);
  transition: width 0.6s ease;
}
</style>
