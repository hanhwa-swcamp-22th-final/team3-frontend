<script setup>
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
            :style="{ width: (m.current / m.target) * 100 + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.missions {
  background: #ffffff;
  border: 1px solid #E0DCFF;
  border-radius: 16px;
  padding: 20px;
}

.missions__title {
  font-size: 14px;
  font-weight: 700;
  color: #2D1F6E;
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
  background: #F0EEFF;
  border-radius: 8px;
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
  color: #2D1F6E;
}

.missions__card-points {
  font-size: 11px;
  color: #00BF95;
  font-weight: 600;
}

.missions__card-progress-text {
  font-size: 12px;
  color: #9992b8;
  font-weight: 500;
}

.missions__bar-track {
  height: 8px;
  background: #F0EEFF;
  border-radius: 4px;
  overflow: hidden;
}

.missions__bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD166, #00BF95);
  border-radius: 4px;
  transition: width 0.3s;
}
</style>
