<script setup>
import { ref, onMounted } from 'vue'
import { tierColor, tierBgColor as tierBg, tierBarColor as barColor } from '@/constants'

const animated = ref(false)
onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { animated.value = true })
  })
})

defineProps({
  milestones: {
    type: Array,
    required: true,
    // [{ tier, label, date, score }]
  },
  chartData: {
    type: Array,
    required: true,
    // [{ period, value, tier }]
  },
})
</script>

<template>
  <div class="tier-history">
    <h3 class="tier-history__title">티어 성장 히스토리</h3>

    <!-- Milestones -->
    <div class="tier-history__milestones">
      <div
        v-for="(m, i) in milestones"
        :key="i"
        class="tier-history__milestone"
      >
        <span
          class="tier-history__badge"
          :style="{ background: tierBg(m.tier), color: tierColor(m.tier) }"
        >
          {{ m.tier }}
        </span>
        <div class="tier-history__info">
          <span class="tier-history__date">{{ m.date }}</span>
          <span class="tier-history__label">{{ m.label }}</span>
        </div>
        <span
          class="tier-history__score"
          :style="{ color: tierColor(m.tier) }"
        >
          {{ m.score }}
        </span>
      </div>
    </div>

    <!-- Histogram -->
    <div class="tier-history__chart">
      <div
        v-for="(d, i) in chartData"
        :key="i"
        class="tier-history__bar-col"
      >
        <div
          class="tier-history__bar"
          :style="{
            height: animated ? d.value + '%' : '0%',
            background: barColor(d.tier),
            transitionDelay: i * 0.1 + 's',
          }"
        ></div>
        <span class="tier-history__bar-label">{{ d.period }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tier-history {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.tier-history__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary-800);
  margin: 0 0 20px;
}

/* Milestones */
.tier-history__milestones {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.tier-history__milestone {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tier-history__badge {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  flex-shrink: 0;
}

.tier-history__info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.tier-history__date {
  font-size: 11px;
  color: #9992b8;
  line-height: 1.3;
}

.tier-history__label {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary-800);
  line-height: 1.4;
}

.tier-history__score {
  font-size: 28px;
  font-weight: 800;
}

/* Histogram */
.tier-history__chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 100px;
  margin-top: auto;
  padding-top: 16px;
}

.tier-history__bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}

.tier-history__bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  min-height: 6px;
  transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.tier-history__bar-label {
  font-size: 11px;
  color: #9992b8;
  margin-top: 6px;
  white-space: nowrap;
}
</style>
