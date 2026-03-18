<script setup>
import { ref, onMounted } from 'vue'

const animated = ref(false)
onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { animated.value = true })
  })
})

defineProps({
  missions: {
    type: Array,
    required: true,
    // [{ title, points, current, target, icon }]
  },
})
</script>

<template>
  <div class="missions">
    <h3 class="missions__title">S+ 승급 미션 리스트</h3>

    <div class="missions__list">
      <div v-for="(m, i) in missions" :key="i" class="missions__card">
        <div class="missions__card-header">
          <span class="missions__icon">{{ m.icon }}</span>
          <div class="missions__card-info">
            <span class="missions__card-title">{{ m.title }}</span>
            <span class="missions__card-points">+{{ m.points }}</span>
          </div>
          <span class="missions__card-progress-text">{{ m.current }}/{{ m.target }}</span>
        </div>
        <div class="missions__bar-track">
          <div
            class="missions__bar-fill"
            :style="{ width: animated ? (m.current / m.target) * 100 + '%' : '0%', transitionDelay: i * 0.15 + 's' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.missions {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 20px;
}

.missions__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary-800);
  margin: 0 0 16px;
}

.missions__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.missions__card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.missions__card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.missions__icon {
  width: 32px;
  height: 32px;
  background: var(--color-primary-100);
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.missions__card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.missions__card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary-800);
}

.missions__card-points {
  font-size: 11px;
  color: var(--tier-s);
  font-weight: 600;
}

.missions__card-progress-text {
  font-size: 12px;
  color: #9992b8;
  font-weight: 500;
}

.missions__bar-track {
  height: 8px;
  background: var(--color-primary-100);
  border-radius: 4px;
  overflow: hidden;
}

.missions__bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--tier-b), var(--tier-s));
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.missions__bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.35) 50%,
    transparent 100%
  );
  animation: shimmer 2s ease-in-out 0.8s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  60% { left: 100%; }
  100% { left: 100%; }
}
</style>
