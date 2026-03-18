<script setup>
const props = defineProps({
  preset:       { type: Object, default: null },
  activePreset: { type: Object, default: null },
})

const emit = defineEmits(['save'])

const maxWeight = (weights) => Math.max(...weights.map(w => w.value))
</script>

<template>
  <div v-if="preset" class="detail-panel">

    <!-- 패널 타이틀 -->
    <span class="panel-title">{{ preset.icon }} {{ preset.name }} 프리셋 — 세부 파라미터</span>

    <!-- Block 1: 제품 복잡도 기준 -->
    <div class="block">
      <span class="block-title">📦 제품 복잡도 기준</span>

      <!-- 헤더 -->
      <div class="table-header">
        <span class="col-stage">단계</span>
        <span class="col-process">공정수</span>
        <span class="col-tolerance">허용공차</span>
        <span class="col-weight">난이도가중</span>
      </div>

      <!-- 데이터 행 -->
      <div v-for="row in preset.complexity" :key="row.stage" class="table-row">
        <span class="col-stage stage-label">{{ row.stage }}</span>
        <span class="col-process">{{ row.processes }}</span>
        <span class="col-tolerance">{{ row.tolerance }}</span>
        <span class="col-weight">{{ row.weight }}</span>
      </div>
    </div>

    <!-- Block 2: 정량 평가 가중치 -->
    <div class="block">
      <span class="block-title">⚖️ 정량 평가 가중치</span>

      <div v-for="w in preset.weights" :key="w.label" class="weight-row">
        <span class="weight-label">{{ w.label }}</span>
        <div class="weight-bar-wrap">
          <div
            class="weight-bar-fill"
            :style="{ width: (w.value / maxWeight(preset.weights) * 100) + '%' }"
          />
        </div>
        <span class="weight-value">{{ w.value.toFixed(2) }}</span>
      </div>

      <span class="weight-sum">Σ = 1.00</span>
    </div>

    <!-- Block 3: Tier 승급 기준점 -->
    <div class="block">
      <div class="tier-header">
        <span class="block-title">🏆 Tier 승급 기준점</span>
        <div class="tier-actions">
          <span class="badge-applied">현재 적용: {{ activePreset?.name ?? '—' }}</span>
          <button class="btn-save" @click="emit('save')">프리셋 저장</button>
        </div>
      </div>

      <div v-for="t in preset.tiers" :key="t.tier" class="tier-row">
        <span class="tier-badge" :style="{ background: t.bg, color: t.color }">
          {{ t.tier }}-Tier
        </span>
        <span class="tier-desc">{{ t.score }} {{ t.desc }}</span>
      </div>
    </div>

  </div>
</template>

<style scoped>
.detail-panel {
  flex: 1;
  min-width: 0;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 12px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  box-sizing: border-box;
}

/* 패널 타이틀 */
.panel-title {
  font-size: 12px;
  font-weight: 900;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

/* 공통 블록 */
.block {
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  padding: 17px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.block-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

/* ── Block 1: 복잡도 테이블 ── */
.table-header,
.table-row {
  display: flex;
  align-items: center;
  height: 34px;
  border-bottom: 1.5px solid var(--color-border-row);
}

.table-header span {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.table-row span {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.stage-label {
  color: var(--color-primary-600) !important;
  font-family: 'JetBrains Mono', monospace;
}

.col-stage     { width: 140px; flex-shrink: 0; padding-left: 12px; }
.col-process   { flex: 1; }
.col-tolerance { flex: 1; }
.col-weight    { width: 100px; flex-shrink: 0; }

/* ── Block 2: 가중치 ── */
.weight-row {
  display: flex;
  align-items: center;
  height: 32px;
  border-bottom: 1.5px solid var(--color-border-row);
  gap: 8px;
}

.weight-label {
  width: 80px;
  flex-shrink: 0;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.weight-bar-wrap {
  flex: 1;
  height: 4px;
  background: var(--color-border-default);
  border-radius: 2px;
}

.weight-bar-fill {
  height: 100%;
  background: var(--color-primary-600);
  border-radius: 2px;
}

.weight-value {
  width: 36px;
  text-align: right;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.weight-sum {
  font-size: 12px;
  font-weight: 700;
  color: var(--tier-s);
  text-align: right;
  margin-top: 8px;
}

/* ── Block 3: Tier ── */
.tier-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.tier-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-applied {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-equip-active);
  background: var(--color-equip-active-bg);
  border-radius: 4px;
  padding: 4px 12px;
}

.btn-save {
  height: 37px;
  padding: 0 18px;
  background: var(--color-primary-600);
  border: 1.5px solid var(--color-primary-500);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-bg-surface);
  font-family: var(--font-family-base);
  cursor: pointer;
}

.btn-save:hover { background: var(--color-primary-700); }

.tier-row {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 32px;
  border-bottom: 1.5px solid var(--color-border-row);
}

.tier-badge {
  width: 50px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.tier-desc {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-secondary);
}
</style>
