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
          <div class="trend-panel__step-copy">
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
    </section>

    <section class="trend-panel__benchmark-card">
      <p class="trend-panel__section-title">{{ panel.benchmarkTitle }}</p>
      <div class="trend-panel__benchmark-grid">
        <article v-for="item in panel.benchmarkItems" :key="item.label" class="trend-panel__benchmark-item">
          <span class="trend-panel__benchmark-label">{{ item.label }}</span>
          <div class="trend-panel__benchmark-value-wrap">
            <strong>{{ item.value }}</strong>
            <em>{{ item.delta }}</em>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<style scoped>
.trend-panel {
  display: grid;
  gap: 14px;
  height: 100%;
  min-height: 0;
  padding: 18px;
  border: 1px solid #ddd7ff;
  border-radius: 20px;
  background: #fff;
  overflow: auto;
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
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
  padding: 10px 14px;
  border: 1px solid #e4deff;
  border-radius: 12px;
  background: #fff;
}

.trend-panel__step-copy {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.trend-panel__step-card strong {
  color: var(--color-primary-800);
  flex-shrink: 0;
}

.trend-panel__step-card p {
  margin: 0;
  color: #8d85c0;
  font-size: 13px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trend-panel__step-card span {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  color: #6b5de0;
  font-weight: 800;
}

@media (max-width: 720px) {
  .trend-panel__step-card,
  .trend-panel__step-copy {
    align-items: flex-start;
  }

  .trend-panel__step-copy {
    flex-direction: column;
    gap: 4px;
  }

  .trend-panel__step-card p {
    white-space: normal;
  }
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
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  background: #fff;
}

.trend-panel__benchmark-label {
  margin: 0;
  color: #aaa2d4;
  font-size: 12px;
  font-weight: 700;
}

.trend-panel__benchmark-value-wrap {
  display: grid;
  justify-items: end;
  gap: 4px;
  text-align: right;
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

@media (max-width: 720px) {
  .trend-panel__benchmark-item {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .trend-panel__benchmark-value-wrap {
    justify-items: start;
    text-align: left;
  }
}
</style>
