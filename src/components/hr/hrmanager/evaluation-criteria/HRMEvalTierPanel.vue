<script setup>
const props = defineProps({
  thresholds: { type: Object, default: () => ({ S: 90, A: 75, B: 60 }) },
})

const emit = defineEmits(['update:thresholds'])

function updateThreshold(tier, value) {
  emit('update:thresholds', { ...props.thresholds, [tier]: Number(value) })
}
</script>

<template>
  <article class="eval-tier-card">
    <p class="eval-tier-card__title">🏆 TIER 승급 기준점</p>

    <div class="eval-tier-card__item">
      <span class="eval-tier-card__badge eval-tier-card__badge--s">S</span>
      <span class="eval-tier-card__label">S-Tier</span>
      <input
        type="number" min="1" max="100"
        :value="thresholds.S"
        @input="updateThreshold('S', $event.target.value)"
        class="eval-tier-card__input"
      />
      <span class="eval-tier-card__desc">점 이상 · 최상위 숙련 등급</span>
    </div>

    <div class="eval-tier-card__item">
      <span class="eval-tier-card__badge eval-tier-card__badge--a">A</span>
      <span class="eval-tier-card__label">A-Tier</span>
      <input
        type="number" min="1" max="100"
        :value="thresholds.A"
        @input="updateThreshold('A', $event.target.value)"
        class="eval-tier-card__input"
      />
      <span class="eval-tier-card__desc">점 이상 · 우수 숙련 등급</span>
    </div>

    <div class="eval-tier-card__item">
      <span class="eval-tier-card__badge eval-tier-card__badge--b">B</span>
      <span class="eval-tier-card__label">B-Tier</span>
      <input
        type="number" min="1" max="100"
        :value="thresholds.B"
        @input="updateThreshold('B', $event.target.value)"
        class="eval-tier-card__input"
      />
      <span class="eval-tier-card__desc">점 이상 · 기준 숙련 등급</span>
    </div>

    <div class="eval-tier-card__item eval-tier-card__item--disabled">
      <span class="eval-tier-card__badge eval-tier-card__badge--c">C</span>
      <span class="eval-tier-card__label">C-Tier</span>
      <span class="eval-tier-card__auto">{{ thresholds.B - 1 }}점 미만 자동</span>
      <span class="eval-tier-card__desc">신입/개선 필요</span>
    </div>

    <p class="eval-tier-card__note">✓ 기준점 변경 시 다음 평가 사이클부터 적용됩니다</p>
  </article>
</template>

<style scoped>
.eval-tier-card {
  padding: 24px;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
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
  border-radius: 10px;
  background: var(--color-bg-app);
}
.eval-tier-card__item--disabled { opacity: 0.5; }

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
  width: 48px;
  flex-shrink: 0;
}
.eval-tier-card__input {
  width: 52px;
  padding: 4px 8px;
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  text-align: center;
  color: var(--color-primary-800);
  background: var(--color-bg-surface);
}
.eval-tier-card__auto {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
.eval-tier-card__desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-left: auto;
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
