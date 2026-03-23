<script setup>
import { computed } from 'vue'
import { BaseFilterTabs } from '@/components/common/base'

const props = defineProps({
  trend: {
    type: Object,
    required: true,
  },
  filters: {
    type: Array,
    default: () => [],
  },
  activeFilter: {
    type: String,
    default: 'all',
  },
})

const emit = defineEmits(['change-filter'])

const width = 640
const height = 220
const paddingX = 0
const paddingY = 20
const innerWidth = width - paddingX * 2
const innerHeight = height - paddingY * 2
const ticks = [1.0, 0.5, 0]

const lines = computed(() => {
  return props.trend.series.map((series) => {
    const points = series.values.map((value, index) => {
      const x = paddingX + (innerWidth / (props.trend.labels.length - 1)) * index
      const y = paddingY + innerHeight - innerHeight * value
      return `${x},${y}`
    })

    return {
      ...series,
      points: points.join(' '),
      lastPoint: points.at(-1),
    }
  })
})
</script>

<template>
  <article class="trend-panel">
    <div class="trend-panel__head">
      <p class="trend-panel__eyebrow">설비별 E_IDX 24시간 트렌드</p>

      <BaseFilterTabs
        class="trend-panel__filters"
        :items="filters"
        :model-value="activeFilter"
        size="sm"
        @change="emit('change-filter', $event)"
      />
    </div>

    <div class="trend-panel__chart-wrap">
      <div class="trend-panel__y-axis">
        <span v-for="tick in ticks" :key="tick">{{ tick.toFixed(1) }}</span>
      </div>

      <div class="trend-panel__chart">
        <div class="trend-panel__grid">
          <span v-for="tick in ticks" :key="`grid-${tick}`"></span>
        </div>

        <svg
          :viewBox="`0 0 ${width} ${height}`"
          preserveAspectRatio="none"
          class="trend-panel__svg"
          aria-hidden="true"
        >
          <polyline
            v-for="line in lines"
            :key="line.id"
            :points="line.points"
            fill="none"
            :class="`trend-panel__line trend-panel__line--${line.tone}`"
          />
          <circle
            v-for="line in lines"
            :key="`${line.id}-last`"
            :cx="line.lastPoint.split(',')[0]"
            :cy="line.lastPoint.split(',')[1]"
            r="4.5"
            :class="`trend-panel__dot trend-panel__dot--${line.tone}`"
          />
        </svg>

        <div class="trend-panel__x-axis">
          <span v-for="label in trend.labels" :key="label">{{ label }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.trend-panel {
  display: grid;
  gap: 18px;
  padding: 16px 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  background: var(--color-bg-surface);
}

.trend-panel__head {
  display: grid;
  gap: 12px;
}

.trend-panel__eyebrow {
  font-size: var(--font-size-xs-plus);
  font-weight: 700;
  color: var(--color-primary-300);
}

.trend-panel__chart-wrap {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 10px;
}

.trend-panel__y-axis {
  display: grid;
  justify-items: end;
  align-items: stretch;
  color: var(--color-primary-200);
  font-size: var(--font-size-xs-plus);
}

.trend-panel__chart {
  position: relative;
  min-height: 260px;
}

.trend-panel__grid {
  position: absolute;
  inset: 20px 0 32px;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
}

.trend-panel__grid span {
  border-top: 1px dashed #ece7ff;
}

.trend-panel__svg {
  width: 100%;
  height: 220px;
}

.trend-panel__line {
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.trend-panel__line--mint,
.trend-panel__dot--mint {
  stroke: #18b9a7;
  fill: #18b9a7;
}

.trend-panel__line--primary,
.trend-panel__dot--primary {
  stroke: var(--color-primary-600);
  fill: var(--color-primary-600);
}

.trend-panel__line--warning,
.trend-panel__dot--warning {
  stroke: #f0b539;
  fill: #f0b539;
}

.trend-panel__line--danger,
.trend-panel__dot--danger {
  stroke: #ef4f74;
  fill: #ef4f74;
}

.trend-panel__x-axis {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  margin-top: -6px;
  color: var(--color-primary-200);
  font-size: var(--font-size-xs-plus);
  text-align: center;
}

.trend-panel__x-axis span:first-child {
  justify-self: start;
  text-align: left;
}

.trend-panel__x-axis span:last-child {
  justify-self: end;
  text-align: right;
}
</style>
