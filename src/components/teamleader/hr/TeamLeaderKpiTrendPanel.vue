<script setup>
defineProps({
  panel: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="trend-panel">
    <header class="trend-panel__header">
      <h2 class="trend-panel__title">{{ panel.title }}</h2>
    </header>

    <div class="trend-panel__steps">
      <article v-for="item in panel.steps" :key="item.step" class="trend-panel__step">
        <div class="trend-panel__step-index">{{ item.step }}</div>
        <div class="trend-panel__step-card">
          <div>
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
          </div>
          <span>{{ item.value }}</span>
        </div>
      </article>
    </div>

    <section class="trend-panel__chart-card">
      <p class="trend-panel__section-title">{{ panel.chartTitle }}</p>
      <div class="trend-panel__chart">
        <div class="trend-panel__chart-line"></div>
      </div>
      <p class="trend-panel__chart-meta">{{ panel.chartMeta }}</p>
    </section>

    <section class="trend-panel__benchmark-card">
      <p class="trend-panel__section-title">{{ panel.benchmarkTitle }}</p>
      <div class="trend-panel__benchmark-grid">
        <article v-for="item in panel.benchmarkItems" :key="item.label" class="trend-panel__benchmark-item">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <em>{{ item.delta }}</em>
        </article>
      </div>
    </section>
  </section>
</template>

<style scoped>
.trend-panel {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid #ddd7ff;
  border-radius: 20px;
  background: #fff;
}

.trend-panel__title {
  font-size: 18px;
  color: var(--color-primary-800);
}

.trend-panel__steps {
  display: grid;
  gap: 10px;
}

.trend-panel__step {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 10px;
  align-items: start;
}

.trend-panel__step-index {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6557dd;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.trend-panel__step:last-child .trend-panel__step-index {
  background: #20c9a7;
}

.trend-panel__step-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid #e4deff;
  border-radius: 12px;
  background: #fff;
}

.trend-panel__step-card strong {
  color: var(--color-primary-800);
}

.trend-panel__step-card p {
  color: #8d85c0;
  font-size: 13px;
}

.trend-panel__step-card span {
  display: flex;
  justify-items: flex-end;
  color: #6b5de0;
  font-weight: 800;
}

.trend-panel__chart-card,
.trend-panel__benchmark-card {
  padding: 14px;
  border: 1px solid #e4deff;
  border-radius: 14px;
  background: #fbfaff;
}

.trend-panel__section-title {
  font-size: 13px;
  font-weight: 800;
  color: #8d85c0;
}

.trend-panel__chart {
  position: relative;
  height: 90px;
  margin-top: 12px;
  border-radius: 12px;
  background: linear-gradient(180deg, #fff 0%, #faf7ff 100%);
  overflow: hidden;
}

.trend-panel__chart-line {
  position: absolute;
  left: 10%;
  right: 10%;
  top: 52%;
  height: 2px;
  background: #f1b640;
  transform: rotate(-6deg);
  transform-origin: left center;
}

.trend-panel__chart-meta {
  margin-top: 10px;
  color: #aaa2d4;
  font-size: 12px;
}

.trend-panel__benchmark-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.trend-panel__benchmark-item {
  display: grid;
  gap: 4px;
  padding: 10px;
  border-radius: 12px;
  background: #fff;
  text-align: center;
}

.trend-panel__benchmark-item span {
  color: #aaa2d4;
  font-size: 12px;
  font-weight: 700;
}

.trend-panel__benchmark-item strong {
  color: var(--color-primary-800);
  font-size: 28px;
  line-height: 1;
}

.trend-panel__benchmark-item em {
  color: #20c9a7;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
}
</style>
