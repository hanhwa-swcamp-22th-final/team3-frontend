<script setup>
defineProps({
  history: {
    type: Array,
    default: () => [],
    // [{ tier, score, date }]
  },
})

function tierStyle(tier) {
  const map = {
    S: { bg: '#E3FBEF', color: '#00BF95' },
    A: { bg: '#F0EEFF', color: '#5B4FCF' },
    B: { bg: '#FFF8E1', color: '#C08B00' },
    C: { bg: '#FDE8ED', color: '#EF476F' },
  }
  return map[tier] ?? { bg: '#f0f0f0', color: '#999' }
}
</script>

<template>
  <div class="tier-timeline">
    <p class="tier-timeline__label">📈 Tier 성장 히스토리</p>
    <div class="tier-timeline__track">
      <template v-for="(item, i) in history" :key="i">
        <div class="tier-timeline__node">
          <span
            class="tier-timeline__badge"
            :style="{ background: tierStyle(item.tier).bg, color: tierStyle(item.tier).color }"
          >
            {{ item.tier }}
          </span>
          <span class="tier-timeline__score" :style="{ color: tierStyle(item.tier).color }">
            {{ item.score }}
          </span>
          <span class="tier-timeline__date">{{ item.date }}</span>
        </div>
        <div v-if="i < history.length - 1" class="tier-timeline__line" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.tier-timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tier-timeline__label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.tier-timeline__track {
  display: flex;
  align-items: center;
  gap: 0;
}

.tier-timeline__node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.tier-timeline__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 800;
}

.tier-timeline__score {
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
}

.tier-timeline__date {
  font-size: 11px;
  color: var(--color-text-muted);
}

.tier-timeline__line {
  flex: 1;
  height: 2px;
  background: var(--color-border-default);
  margin-bottom: 28px;
  min-width: 24px;
}
</style>
