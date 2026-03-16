<script setup>
defineProps({
  equipment: { type: Object, default: null },
})

const paramLabels = {
  base_production:   '기준 생산량',
  base_speed_factor: '기준 속도 계수',
  min_correction:    '최소 보정값',
  max_correction:    '최대 보정값',
  update_cycle:      '갱신 주기',
  anomaly_threshold: '이상 임계값',
}
</script>

<template>
  <div class="detail-panel">
    <div v-if="!equipment" class="empty">설비를 선택하세요</div>
    <template v-else>

      <!-- OEE 지표 -->
      <div class="section">
        <div class="section-title">📊 OEE 지표</div>
        <div class="oee-grid">
          <div class="oee-card">
            <span class="oee-label">가동률</span>
            <span class="oee-value">{{ equipment.availability }}%</span>
          </div>
          <div class="oee-card">
            <span class="oee-label">품질률</span>
            <span class="oee-value">{{ equipment.quality_rate }}%</span>
          </div>
          <div class="oee-card">
            <span class="oee-label">성능률</span>
            <span class="oee-value">{{ equipment.performance_rate }}%</span>
          </div>
          <div class="oee-card">
            <span class="oee-label">E_idx 임계값</span>
            <span class="oee-value">{{ equipment.e_idx_threshold }}</span>
          </div>
        </div>
      </div>

      <!-- 파라미터 -->
      <div class="section">
        <div class="section-title">⚙️ 보정 파라미터</div>
        <div class="param-table">
          <div
            v-for="(val, key) in equipment.params"
            :key="key"
            class="param-row"
          >
            <span class="param-label">{{ paramLabels[key] ?? key }}</span>
            <span class="param-value">{{ val }}</span>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<style scoped>
.detail-panel {
  flex: 1;
  background: #fff;
  border: 1.5px solid var(--color-border-default, #E0DCFF);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #A89ED8;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 11px;
  font-weight: 700;
  color: #7A6FA8;
}

.oee-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.oee-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #FAFBFF;
  border: 1.5px solid var(--color-border-default, #E0DCFF);
  border-radius: 8px;
}

.oee-label {
  font-size: 10px;
  color: #A89ED8;
}

.oee-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary-800, #2D1F6E);
}

.param-table {
  background: #FAFBFF;
  border: 1.5px solid var(--color-border-default, #E0DCFF);
  border-radius: 8px;
  overflow: hidden;
}

.param-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 36px;
  border-bottom: 1.5px solid var(--color-border-soft, #EEEBFF);
}

.param-row:last-child {
  border-bottom: none;
}

.param-label {
  font-size: 11px;
  color: #7A6FA8;
}

.param-value {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-primary-600, #5B4FCF);
  font-family: 'JetBrains Mono', monospace;
}
</style>
