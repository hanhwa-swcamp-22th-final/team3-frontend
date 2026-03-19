<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  skills: {
    type: Array,
    required: true,
    // [{ label, value }]
  },
})

const size = 200
const cx = size / 2
const cy = size / 2
const maxR = 70
const levels = 4

function polarToXY(angle, radius) {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  }
}

const angleStep = computed(() => 360 / props.skills.length)

const gridPaths = computed(() => {
  return Array.from({ length: levels }, (_, lvl) => {
    const r = (maxR / levels) * (lvl + 1)
    const points = props.skills.map((_, i) => {
      const p = polarToXY(i * angleStep.value, r)
      return `${p.x},${p.y}`
    })
    return `M${points.join('L')}Z`
  })
})

const axisLines = computed(() => {
  return props.skills.map((_, i) => {
    const p = polarToXY(i * angleStep.value, maxR)
    return { x1: cx, y1: cy, x2: p.x, y2: p.y }
  })
})

const animated = ref(false)
onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { animated.value = true })
  })
})

const dataPath = computed(() => {
  const points = props.skills.map((s, i) => {
    const r = (s.value / 100) * maxR
    const p = polarToXY(i * angleStep.value, r)
    return `${p.x},${p.y}`
  })
  return `M${points.join('L')}Z`
})

const dataPoints = computed(() => {
  return props.skills.map((s, i) => {
    const r = (s.value / 100) * maxR
    return polarToXY(i * angleStep.value, r)
  })
})

const labelPositions = computed(() => {
  return props.skills.map((s, i) => {
    const p = polarToXY(i * angleStep.value, maxR + 18)
    return { ...p, label: s.label }
  })
})
</script>

<template>
  <div class="radar">
    <h3 class="radar__title">스킬 레이더</h3>
    <div class="radar__content">
      <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="radar__svg">
        <!-- Grid -->
        <path
          v-for="(d, i) in gridPaths"
          :key="'g' + i"
          :d="d"
          fill="none"
          stroke="#E0DCFF"
          stroke-width="1"
        />
        <!-- Axes -->
        <line
          v-for="(l, i) in axisLines"
          :key="'a' + i"
          :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2"
          stroke="#E0DCFF"
          stroke-width="1"
        />
        <!-- Data area -->
        <path
          :d="dataPath"
          fill="rgba(91, 79, 207, 0.2)"
          stroke="#5B4FCF"
          stroke-width="2"
          class="radar__data-area"
          :class="{ 'radar__data-area--visible': animated }"
        />
        <!-- Data points -->
        <circle
          v-for="(p, i) in dataPoints"
          :key="'p' + i"
          :cx="p.x" :cy="p.y"
          r="3"
          fill="#5B4FCF"
          class="radar__data-point"
          :class="{ 'radar__data-point--visible': animated }"
        />
        <!-- Labels -->
        <text
          v-for="(lp, i) in labelPositions"
          :key="'l' + i"
          :x="lp.x" :y="lp.y"
          text-anchor="middle"
          dominant-baseline="central"
          class="radar__label"
        >
          {{ lp.label }}
        </text>
      </svg>

      <ul class="radar__list">
        <li v-for="s in skills" :key="s.label" class="radar__list-item">
          <span class="radar__list-label">{{ s.label }}</span>
          <div class="radar__list-bar-track">
            <div
              class="radar__list-bar-fill"
              :style="{ width: animated ? s.value + '%' : '0%' }"
            ></div>
          </div>
          <span class="radar__list-value">{{ s.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.radar {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 12px 20px 20px;
}

.radar__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary-800);
  margin: 0 0 24px;
}

.radar__content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.radar__svg {
  flex-shrink: 0;
}

.radar__data-area {
  transform-origin: 100px 100px;
  transform: scale(0);
  opacity: 0;
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}

.radar__data-area--visible {
  transform: scale(1);
  opacity: 1;
}

.radar__data-point {
  transform-origin: 100px 100px;
  transform: scale(0);
  opacity: 0;
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, opacity 0.4s ease 0.15s;
}

.radar__data-point--visible {
  transform: scale(1);
  opacity: 1;
}

.radar__label {
  font-size: 8px;
  fill: #7a72a0;
}

.radar__list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radar__list-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radar__list-label {
  font-size: 12px;
  color: #5a5280;
  width: 72px;
  flex-shrink: 0;
}

.radar__list-bar-track {
  flex: 1;
  height: 8px;
  background: var(--color-primary-100);
  border-radius: 4px;
  overflow: hidden;
}

.radar__list-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-600), var(--tier-s));
  border-radius: 4px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.radar__list-value {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-800);
  width: 28px;
  text-align: right;
}
</style>
