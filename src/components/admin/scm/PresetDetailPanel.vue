<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  preset:       { type: Object, default: null },
  activePreset: { type: Object, default: null },
})

const emit = defineEmits(['save'])

const maxWeight = (weights) => Math.max(...weights.map(w => w.value))

const isCustom = computed(() => props.preset?.id === 'custom')

const INDUSTRY_OPTIONS = ['반도체', '디스플레이', '배터리', '자동차', '기타', '커스텀']

const EMPTY_CUSTOM = () => ({
  industry:   '반도체',
  v1: '',
  v2: '',
  v3: '',
  v4: '',
  alpha:      '',
  start_date: '',
})

const customForm = ref(EMPTY_CUSTOM())

watch(isCustom, (val) => { if (val) customForm.value = EMPTY_CUSTOM() })

const vWeightSum = computed(() => {
  const sum = [customForm.value.v1, customForm.value.v2, customForm.value.v3, customForm.value.v4]
    .map(v => parseFloat(v) || 0)
    .reduce((a, b) => a + b, 0)
  return Math.round(sum * 100) / 100
})

const isSumValid = computed(() => vWeightSum.value === 1.0)

const handleCustomSave = () => {
  emit('save', { ...customForm.value })
}
</script>

<template>
  <div v-if="preset" class="detail-panel">

    <!-- 패널 타이틀 -->
    <span class="panel-title">{{ preset.icon }} {{ preset.name }} 프리셋 — 세부 파라미터</span>

    <!-- ── 커스텀 프리셋 폼 ── -->
    <template v-if="isCustom">

      <!-- OCSA Block 1: 산업군 + 기본 설정 -->
      <div class="block">
        <span class="block-title">🏭 OCSA 기본 설정</span>
        <div class="ocsa-grid">
          <div class="ocsa-field ocsa-field--full">
            <label class="ocsa-label">산업군 프리셋</label>
            <select v-model="customForm.industry" class="ocsa-input">
              <option v-for="opt in INDUSTRY_OPTIONS" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
          <div class="ocsa-field">
            <label class="ocsa-label">적용 시작일</label>
            <input v-model="customForm.start_date" type="date" class="ocsa-input" />
          </div>
        </div>
      </div>

      <!-- OCSA Block 2: V1~V4 가중치 -->
      <div class="block">
        <div class="block-title-row">
          <span class="block-title">⚖️ 변수 가중치 (V1~V4)</span>
          <span class="sum-badge" :class="isSumValid ? 'sum-badge--ok' : 'sum-badge--warn'">
            Σ = {{ vWeightSum.toFixed(2) }} {{ isSumValid ? '✓' : '≠ 1.0' }}
          </span>
        </div>
        <div class="ocsa-grid">
          <div class="ocsa-field">
            <label class="ocsa-label">V1 공정 복잡도</label>
            <input v-model="customForm.v1" type="number" min="0" max="1" step="0.01" placeholder="예: 0.30" class="ocsa-input" />
          </div>
          <div class="ocsa-field">
            <label class="ocsa-label">V2 품질 정밀도</label>
            <input v-model="customForm.v2" type="number" min="0" max="1" step="0.01" placeholder="예: 0.40" class="ocsa-input" />
          </div>
          <div class="ocsa-field">
            <label class="ocsa-label">V3 역량 요구도</label>
            <input v-model="customForm.v3" type="number" min="0" max="1" step="0.01" placeholder="예: 0.20" class="ocsa-input" />
          </div>
          <div class="ocsa-field">
            <label class="ocsa-label">V4 시공간 긴급도</label>
            <input v-model="customForm.v4" type="number" min="0" max="1" step="0.01" placeholder="예: 0.10" class="ocsa-input" />
          </div>
        </div>
      </div>

      <!-- OCSA Block 3: 신규성 가중치 -->
      <div class="block">
        <span class="block-title">✨ 신규성 가중치 (α)</span>
        <div class="ocsa-grid">
          <div class="ocsa-field">
            <label class="ocsa-label">α (0.0 ~ 0.5)</label>
            <input v-model="customForm.alpha" type="number" min="0" max="0.5" step="0.01" placeholder="예: 0.10" class="ocsa-input" />
          </div>
          <div class="ocsa-field">
            <label class="ocsa-label">초도 주문 가산점</label>
            <span class="ocsa-calc">{{ customForm.alpha ? `+${(parseFloat(customForm.alpha)*100).toFixed(0)}점` : '—' }}</span>
          </div>
        </div>
      </div>

      <!-- 저장 버튼 -->
      <div class="custom-footer">
        <span class="custom-footer__desc">V1+V2+V3+V4 합계가 1.0이어야 저장됩니다.</span>
        <button class="btn-save" :disabled="!isSumValid" @click="handleCustomSave">커스텀 저장</button>
      </div>

    </template>

    <!-- ── 기존 산업군 프리셋 (읽기 전용) ── -->
    <template v-else>

      <!-- Block 1: 제품 복잡도 기준 -->
      <div class="block">
        <span class="block-title">📦 제품 복잡도 기준</span>
        <div class="table-header">
          <span class="col-stage">단계</span>
          <span class="col-process">공정수</span>
          <span class="col-tolerance">허용공차</span>
          <span class="col-weight">난이도가중</span>
        </div>
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
            <div class="weight-bar-fill" :style="{ width: (w.value / maxWeight(preset.weights) * 100) + '%' }" />
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
          <span class="tier-badge" :style="{ background: t.bg, color: t.color }">{{ t.tier }}-Tier</span>
          <span class="tier-desc">{{ t.score }} {{ t.desc }}</span>
        </div>
      </div>

    </template>

  </div>
</template>

<style scoped>
.detail-panel {
  flex: 1;
  min-width: 0;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-base);
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
  border-radius: var(--radius-xs);
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
  font-family: var(--font-family-mono);
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

/* ── OCSA 커스텀 폼 ── */
.ocsa-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
  margin-top: 4px;
}

.ocsa-field--full { grid-column: 1 / -1; }

.ocsa-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ocsa-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.ocsa-input {
  height: 36px;
  padding: 0 10px;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  font-size: 12px;
  color: var(--color-primary-800);
  outline: none;
  box-sizing: border-box;
}

.ocsa-input:focus { border-color: var(--color-primary-600); }

.ocsa-calc {
  font-family: var(--font-family-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-600);
  padding-top: 6px;
}

.block-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.block-title-row .block-title { margin-bottom: 0; }

.sum-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
}

.sum-badge--ok   { background: var(--color-equip-active-bg);  color: var(--color-equip-active); }
.sum-badge--warn { background: var(--color-warning-soft);      color: var(--color-warning); }

.custom-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 4px;
}

.custom-footer__desc {
  font-size: 11px;
  color: var(--color-text-placeholder);
  flex: 1;
}

.btn-save:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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
