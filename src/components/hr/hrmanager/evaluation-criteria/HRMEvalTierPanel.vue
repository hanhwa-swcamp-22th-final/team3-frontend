<script setup>
const TIER_ORDER = ['S', 'A', 'B', 'C']
const TIER_LABELS = {
  S: 'S 승급 기준점',
  A: 'A 승급 기준점',
  B: 'B 승급 기준점',
  C: 'C 기준점',
}

const props = defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:items'])

function findValue(tier) {
  return props.items.find((item) => item.tier === tier)?.tierConfigPromotionPoint ?? 0
}

function updatePoint(tier, value) {
  const updated = props.items.map((item) =>
    item.tier === tier
      ? { ...item, tierConfigPromotionPoint: Number(value) }
      : item,
  )
  emit('update:items', updated)
}
</script>

<template>
  <article class="eval-tier-card">
    <p class="eval-tier-card__title">Tier 승급 기준점</p>

    <div
      v-for="tier in TIER_ORDER"
      :key="tier"
      class="eval-tier-card__item"
    >
      <span class="eval-tier-card__badge" :class="`eval-tier-card__badge--${tier.toLowerCase()}`">
        {{ tier }}
      </span>
      <span class="eval-tier-card__label">{{ TIER_LABELS[tier] }}</span>
      <input
        class="eval-tier-card__input"
        type="number"
        min="0"
        max="100"
        :disabled="loading"
        :value="findValue(tier)"
        @input="updatePoint(tier, $event.target.value)"
      />
    </div>

    <p class="eval-tier-card__note">월간 확정 점수 기준으로 승급 판단에 사용됩니다.</p>
  </article>
</template>

<style scoped>
.eval-tier-card {
  padding: 24px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.eval-tier-card__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
  margin-bottom: 4px;
}
.eval-tier-card__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  background: var(--color-bg-app);
}
.eval-tier-card__badge {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: 900;
  flex-shrink: 0;
  color: var(--color-white);
}
.eval-tier-card__badge--s { background: var(--tier-s); }
.eval-tier-card__badge--a { background: var(--tier-a); }
.eval-tier-card__badge--b { background: var(--tier-b); color: #1a1000; }
.eval-tier-card__badge--c { background: var(--tier-c); }
.eval-tier-card__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
  flex: 1;
}
.eval-tier-card__input {
  width: 72px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  text-align: center;
  color: var(--color-primary-800);
  background: var(--color-bg-surface);
}
.eval-tier-card__note {
  font-size: var(--font-size-xs);
  color: var(--color-mint-500);
  background: #e3fbef;
  padding: 10px 14px;
  border-radius: 8px;
  margin-top: 4px;
}
</style>
