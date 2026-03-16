<script setup>
defineProps({
  preset:   { type: Object, default: null },
  activeId: { type: Number, default: null },
})
const emit = defineEmits(['save'])

const TIER_STYLE = {
  S: { color: '#007A60', bg: '#E3FBEF' },
  A: { color: '#5B4FCF', bg: '#F0EEFF' },
  B: { color: '#A07000', bg: '#FFF8E0' },
  C: { color: '#C0103E', bg: '#FFECF1' },
}
</script>

<template>
  <div class="detail-panel">
    <div v-if="!preset" class="empty">산업군을 선택하세요</div>
    <template v-else>

      <!-- 패널 타이틀 -->
      <div class="panel-title">⚙️ {{ preset.name }} 프리셋 — 세부 파라미터</div>

      <!-- 1. 제품 복잡도 기준 -->
      <div class="section">
        <div class="section-title">📦 제품 복잡도 기준</div>
        <div class="table-wrap">
          <div class="table-header">
            <span class="col-stage">단계</span>
            <span class="col-process">공정수</span>
            <span class="col-tolerance">허용공차</span>
            <span class="col-weight">난이도가중</span>
          </div>
          <div
            v-for="row in preset.complexity"
            :key="row.stage"
            class="table-row"
          >
            <span class="col-stage stage-code">{{ row.label }}</span>
            <span class="col-process">{{ row.processes }}</span>
            <span class="col-tolerance">{{ row.tolerance }}</span>
            <span class="col-weight">{{ row.weight }}</span>
          </div>
        </div>
      </div>

      <!-- 2. 정량 평가 가중치 -->
      <div class="section">
        <div class="section-title">⚖️ 정량 평가 가중치</div>
        <div class="weight-table">
          <div
            v-for="w in preset.weights"
            :key="w.name"
            class="weight-row"
          >
            <span class="weight-name">{{ w.name }}</span>
            <div class="weight-bar-wrap">
              <div class="weight-bar-bg">
                <div class="weight-bar-fill" :style="{ width: (w.value * 100) + '%' }"></div>
              </div>
              <span class="weight-value">{{ w.value.toFixed(2) }}</span>
            </div>
          </div>
          <div class="weight-sum">Σ = 1.00</div>
        </div>
      </div>

      <!-- 3. Tier 승급 기준점 -->
      <div class="section">
        <div class="section-title-row">
          <span class="section-title">🏆 Tier 승급 기준점</span>
          <!-- 저장 버튼 & 적용 뱃지 -->
          <div class="save-area">
            <span v-if="activeId === preset.id" class="badge-active">현재 적용: {{ preset.name }}</span>
            <button class="btn-save" @click="emit('save', preset.id)">프리셋 저장</button>
          </div>
        </div>
        <div class="tier-table">
          <div
            v-for="t in preset.tierThresholds"
            :key="t.tier"
            class="tier-row"
          >
            <span
              class="tier-badge"
              :style="{ color: TIER_STYLE[t.tier].color, background: TIER_STYLE[t.tier].bg }"
            >{{ t.tier }}-Tier</span>
            <span class="tier-desc">{{ t.score }} {{ t.desc }}</span>
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
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  min-width: 0;
}

.empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #A89ED8;
}

.panel-title {
  font-size: 12px;
  font-weight: 900;
  color: #7A6FA8;
  flex-shrink: 0;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #FAFBFF;
  border: 1.5px solid var(--color-border-default, #E0DCFF);
  border-radius: 8px;
  padding: 17px;
}

.section-title {
  font-size: 11px;
  font-weight: 700;
  color: #7A6FA8;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 복잡도 테이블 */
.table-wrap {
  display: flex;
  flex-direction: column;
}

.table-header,
.table-row {
  display: flex;
  align-items: center;
  height: 34px;
  border-bottom: 1.5px solid #EEEBFF;
}

.table-header {
  background: #fff;
  font-size: 11px;
  font-weight: 700;
  color: #7A6FA8;
}

.table-row {
  font-size: 11px;
  color: #7A6FA8;
}

.table-row:last-child {
  border-bottom: none;
}

.col-stage    { width: 110px; padding-left: 12px; }
.col-process  { flex: 1; }
.col-tolerance{ flex: 1; }
.col-weight   { width: 80px; text-align: right; padding-right: 8px; }

.stage-code {
  color: var(--color-primary-600, #5B4FCF);
  font-family: 'JetBrains Mono', monospace;
}

/* 가중치 */
.weight-table {
  display: flex;
  flex-direction: column;
}

.weight-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  border-bottom: 1.5px solid #EEEBFF;
}

.weight-row:last-of-type {
  border-bottom: none;
}

.weight-name {
  font-size: 11px;
  color: #7A6FA8;
  min-width: 80px;
}

.weight-bar-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weight-bar-bg {
  width: 80px;
  height: 4px;
  background: #E0DCFF;
  border-radius: 2px;
  overflow: hidden;
}

.weight-bar-fill {
  height: 100%;
  background: var(--color-primary-600, #5B4FCF);
  border-radius: 2px;
}

.weight-value {
  font-size: 11px;
  font-weight: 700;
  color: #7A6FA8;
  width: 30px;
  text-align: right;
}

.weight-sum {
  font-size: 12px;
  font-weight: 700;
  color: #00BF95;
  text-align: right;
  padding-top: 6px;
}

/* Tier 테이블 */
.tier-table {
  display: flex;
  flex-direction: column;
}

.tier-row {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 32px;
  border-bottom: 1.5px solid #EEEBFF;
}

.tier-row:last-child {
  border-bottom: none;
}

.tier-badge {
  padding: 3px 7px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  min-width: 50px;
  text-align: center;
}

.tier-desc {
  font-size: 12px;
  font-weight: 700;
  color: #7A6FA8;
}

/* 저장 영역 */
.save-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-active {
  padding: 5px 12px;
  background: #E3FBEF;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #007A60;
}

.btn-save {
  height: 37px;
  padding: 0 20px;
  background: var(--color-primary-600, #5B4FCF);
  border: 1.5px solid #7F75DB;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
}

.btn-save:hover {
  background: #4A3FB0;
}
</style>
