<script setup>
import { computed } from 'vue'

const props = defineProps({
  equipment: { type: Object, default: null },
})

const emit = defineEmits(['paramChange'])

const eIdx = computed(() => {
  if (!props.equipment) return 0
  const e = props.equipment
  return (e.availability / 100) * (e.quality_rate / 100) * (e.performance_rate / 100)
})

// 시뮬레이션: 정상(+0.04) / 현재 / 저하(-0.12) 기준 점수
const simScore = (targetEIdx) => {
  if (!props.equipment) return 0
  // 단순 선형 환산: e_idx 0.80 → 70점, 1.00 → 90점 (기준)
  return Math.round(70 + (targetEIdx - 0.80) * 100)
}

const simNormal   = computed(() => ({ eidx: (eIdx.value + 0.04).toFixed(2), score: simScore(eIdx.value + 0.04), label: `현재+${((eIdx.value + 0.04 - eIdx.value) * 100).toFixed(1)}%` }))
const simCurrent  = computed(() => ({ eidx: eIdx.value.toFixed(2),          score: simScore(eIdx.value),         label: '기준값' }))
const simWarning  = computed(() => ({ eidx: props.equipment?.e_idx_threshold?.toFixed(2) ?? '0.80', score: simScore(props.equipment?.e_idx_threshold ?? 0.80), label: '경고수준' }))

const PARAMS = [
  { key: 'base_production',   label: '기준 생산량 (E_exp)', unit: '개/일', type: 'number' },
  { key: 'base_speed_factor', label: '기준 속도 계수',      unit: '',       type: 'number' },
  { key: 'min_correction',    label: '보정 하한값',          unit: '',       type: 'number' },
  { key: 'max_correction',    label: '보정 상한값',          unit: '',       type: 'number' },
  { key: 'update_cycle',      label: '갱신 주기',            unit: '',       type: 'select' },
  { key: 'anomaly_threshold', label: '이상 감지 임계',       unit: '%',      type: 'number' },
]

const UPDATE_CYCLE_OPTIONS = ['실시간', '1시간']
</script>

<template>
  <div class="section" v-if="equipment">
    <!-- 타이틀 -->
    <div class="section-title">
      ⚙️ {{ equipment.code }} — {{ equipment.name }} E_idx 설정
    </div>

    <!-- 공식 박스 (어두운) -->
    <div class="formula-box">
      <div class="formula-box__label">E_idx 산출 공식</div>
      <div class="formula-box__formula">
        E_idx = (가동시간 / 계획시간) × (품질합격 / 총생산) × (실제속도 / 기준속도)
      </div>
      <div class="formula-box__divider"></div>
      <div class="formula-box__metrics">
        <div class="metric">
          <span class="metric__label">가용성</span>
          <span class="metric__value">{{ equipment.availability }}%</span>
        </div>
        <div class="metric metric--border">
          <span class="metric__label">품질률</span>
          <span class="metric__value metric__value--yellow">{{ equipment.quality_rate }}%</span>
        </div>
        <div class="metric">
          <span class="metric__label">성능률</span>
          <span class="metric__value metric__value--purple">{{ equipment.performance_rate }}%</span>
        </div>
      </div>
      <div class="formula-box__result">
        현재 E_idx = {{ (equipment.availability/100).toFixed(2) }} × {{ (equipment.quality_rate/100).toFixed(2) }} × {{ (equipment.performance_rate/100).toFixed(2) }} = {{ eIdx.toFixed(3) }} ≈ {{ eIdx.toFixed(2) }}
      </div>
    </div>

    <!-- 파라미터 설정 -->
    <div class="param-section">
      <div class="param-section__title">파라미터 설정</div>
      <div class="param-grid">
        <div
          v-for="p in PARAMS"
          :key="p.key"
          class="param-row"
        >
          <span class="param-row__label">{{ p.label }}</span>
          <div class="param-row__input-wrap">
            <select
              v-if="p.type === 'select'"
              class="param-row__input"
              :value="equipment.params[p.key]"
              @change="emit('paramChange', p.key, $event.target.value)"
            >
              <option v-for="o in UPDATE_CYCLE_OPTIONS" :key="o" :value="o">{{ o }}</option>
            </select>
            <template v-else>
              <input
                class="param-row__input"
                type="number"
                :value="equipment.params[p.key]"
                @change="emit('paramChange', p.key, parseFloat($event.target.value))"
              />
              <span v-if="p.unit" class="param-row__unit">{{ p.unit }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 시뮬레이션 -->
    <div class="sim-box">
      <div class="sim-box__title">📊 현재 파라미터 기준 시뮬레이션</div>
      <div class="sim-cards">
        <div class="sim-card">
          <span class="sim-card__label">E_idx 정상({{ simNormal.eidx }})</span>
          <span class="sim-card__score sim-card__score--green">{{ simNormal.score }}점</span>
          <span class="sim-card__sub">{{ simNormal.label }}</span>
        </div>
        <div class="sim-card">
          <span class="sim-card__label">E_idx 현재({{ simCurrent.eidx }})</span>
          <span class="sim-card__score sim-card__score--purple">{{ simCurrent.score }}점</span>
          <span class="sim-card__sub">{{ simCurrent.label }}</span>
        </div>
        <div class="sim-card">
          <span class="sim-card__label">E_idx 저하({{ simWarning.eidx }})</span>
          <span class="sim-card__score sim-card__score--red">{{ simWarning.score }}점</span>
          <span class="sim-card__sub">{{ simWarning.label }}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="section section--empty" v-else>
    <span>설비를 선택하세요</span>
  </div>
</template>

<style scoped>
.section {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 20px;
  flex: 1;

  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.section--empty {
  align-items: center;
  justify-content: center;
  color: var(--color-primary-300);
  font-size: 13px;
}

.section-title {
  font-size: 12px;
  font-weight: 900;
  color: var(--color-primary-300);
}

/* 공식 박스 */
.formula-box {
  background: var(--color-primary-800);
  border-radius: var(--radius-sm);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.formula-box__label {
  font-size: 10px;
  color: var(--color-text-on-dark);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.formula-box__formula {
  font-family: var(--font-family-mono);
  font-size: 13px;
  color: var(--tier-s);
}

.formula-box__divider {
  border-top: 1px solid var(--color-border-on-dark);
}

.formula-box__metrics {
  display: flex;
}

.metric {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
}

.metric--border {
  border-left: 1px solid var(--color-border-on-dark);
  border-right: 1px solid var(--color-border-on-dark);
}

.metric__label {
  font-size: 10px;
  color: var(--color-text-on-dark);
}

.metric__value {
  font-family: var(--font-family-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--color-white);
}

.metric__value--yellow { color: var(--tier-b); }
.metric__value--purple { color: var(--color-primary-600); }

.formula-box__result {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--tier-s);
  text-align: center;
}

/* 파라미터 */
.param-section__title {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
  margin-bottom: 8px;
}

.param-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.param-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 34px;
  border-bottom: 1px solid var(--color-border-muted);
  padding: 0 4px;
}

.param-row__label {
  font-size: 12px;
  color: var(--color-primary-300);
}

.param-row__input-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.param-row__input {
  font-family: var(--font-family-mono);
  font-size: 12px;
  color: #7A6FA8;
  border: 1.5px solid #E0DCFF;
  border-radius: 4px;
  background: transparent;
  outline: none;
  height: 26px;
  padding: 0 6px;
  width: 80px;
  text-align: right;
}

.param-row__input:focus {
  border-color: var(--color-primary-600);
}

.param-row__unit {
  font-size: 11px;
  color: var(--color-primary-300);
}

/* 시뮬레이션 */
.sim-box {
  background: var(--color-bg-app);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-xs);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sim-box__title {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.sim-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.sim-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.sim-card__label {
  font-size: 10px;
  color: var(--color-primary-300);
  text-align: center;
}

.sim-card__score {
  font-family: var(--font-family-mono);
  font-size: 20px;
  font-weight: 700;
}

.sim-card__score--green  { color: #00BF95; }
.sim-card__score--purple { color: var(--color-primary-600); }
.sim-card__score--red    { color: var(--color-danger); }

.sim-card__sub {
  font-size: 10px;
  color: var(--color-primary-300);
}
</style>
