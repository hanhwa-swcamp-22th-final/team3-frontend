<script setup>
import { ref, watch, computed } from 'vue'
import { BaseFormModal } from '@/components/common/base'
import {
  STATUS_OPTIONS,
  PROCESS_TYPE_OPTIONS,
  DUST_CLASS_OPTIONS,
} from '@/mocks/admin/facility/facilityData.js'

const LINE_INPUT_OPTIONS = ['1라인', '2라인', '3라인']

const props = defineProps({
  isOpen:   { type: Boolean, default: false },
  facility: { type: Object,  default: null  },
})

const emit = defineEmits(['close', 'save'])

const EMPTY_FORM = () => ({
  equipment_code:   '',
  equipment_name:   '',
  equipment_line:   '1라인',
  process_type:     '정밀가공',
  equipment_status: '운영중',
  install_date:     '',
  manager:          '',
  warranty_months:  '',
  env: {
    temperature:     '',
    humidity:        '',
    dust_class:      'Class B',
    vibration_limit: '',
    voltage_range:   '',
    memo:            '',
  },
  aging: {
    t_life_months: '',
    aging_factor:  '',
    last_overhaul: '',
    pm_cycle_days: '',
  },
})

const form = ref(EMPTY_FORM())

watch(() => props.isOpen, (val) => {
  if (!val) return
  form.value = props.facility
    ? {
        ...props.facility,
        env:   { ...props.facility.env },
        aging: { ...props.facility.aging },
      }
    : EMPTY_FORM()
})

const expectedUsage = computed(() => {
  const tLife  = parseFloat(form.value.aging.t_life_months)
  const factor = parseFloat(form.value.aging.aging_factor)
  if (!tLife || !factor) return '—'
  return Math.round(factor * 100) + '%'
})

const remainingLife = computed(() => {
  const tLife  = parseFloat(form.value.aging.t_life_months)
  const factor = parseFloat(form.value.aging.aging_factor)
  if (!tLife || !factor) return '—'
  return Math.round(tLife * factor) + '개월'
})

const maintenanceRisk = computed(() => {
  const factor = parseFloat(form.value.aging.aging_factor)
  if (!factor) return '—'
  if (factor >= 0.90) return '낮음'
  if (factor >= 0.75) return '중간'
  return '높음'
})

const isEditMode = computed(() => !!props.facility)

const handleSave = () => {
  emit('save', { ...form.value })
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <BaseFormModal
      v-if="isOpen"
      :title="isEditMode ? '설비 수정' : '설비 등록'"
      width="1100px"
      :confirm-text="isEditMode ? '수정 저장' : '설비 등록'"
      cancel-text="취소"
      @close="emit('close')"
      @cancel="emit('close')"
      @confirm="handleSave"
    >
      <div class="modal-body">

        <!-- 좌측 -->
        <div class="modal-left">

          <!-- Section 1: 기본 설비 정보 -->
          <div class="section">
            <div class="section-header">
              <span class="section-title">기본 설비 정보</span>
              <span class="badge-required">필수</span>
            </div>
            <div class="field-grid">
              <div class="field">
                <label>설비 ID</label>
                <input v-model="form.equipment_code" placeholder="예: MCH-03" />
              </div>
              <div class="field">
                <label>설비명</label>
                <input v-model="form.equipment_name" placeholder="예: 5축 머시닝센터" />
              </div>
              <div class="field">
                <label>라인</label>
                <select v-model="form.equipment_line">
                  <option v-for="l in LINE_INPUT_OPTIONS" :key="l" :value="l">{{ l }}</option>
                </select>
              </div>
              <div class="field">
                <label>공정 유형</label>
                <select v-model="form.process_type">
                  <option v-for="p in PROCESS_TYPE_OPTIONS" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>
              <div class="field">
                <label>설비 상태</label>
                <select v-model="form.equipment_status">
                  <option v-for="s in STATUS_OPTIONS" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
              <div class="field">
                <label>설치일</label>
                <input v-model="form.install_date" type="date" />
              </div>
              <div class="field">
                <label>관리 책임자</label>
                <input v-model="form.manager" placeholder="예: 김정비 매니저" />
              </div>
              <div class="field">
                <label>SAT 보증기간</label>
                <input v-model="form.warranty_months" placeholder="예: 24개월" />
              </div>
            </div>
          </div>

          <!-- Section 2: 설비 작업 환경 기준 -->
          <div class="section">
            <div class="section-header">
              <span class="section-title">설비 작업 환경 기준</span>
              <span class="badge-required">환경값</span>
            </div>
            <div class="field-grid field-grid--3">
              <div class="field">
                <label>온도</label>
                <input v-model="form.env.temperature" placeholder="예: 23°C" />
              </div>
              <div class="field">
                <label>습도</label>
                <input v-model="form.env.humidity" placeholder="예: 45%" />
              </div>
              <div class="field">
                <label>분진 등급</label>
                <select v-model="form.env.dust_class">
                  <option v-for="d in DUST_CLASS_OPTIONS" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>
            </div>
            <div class="field-grid">
              <div class="field">
                <label>진동 허용치</label>
                <input v-model="form.env.vibration_limit" placeholder="예: 0.8 mm/s" />
              </div>
              <div class="field">
                <label>전압 안정 범위</label>
                <input v-model="form.env.voltage_range" placeholder="예: 380V ±5%" />
              </div>
            </div>
            <div class="field field--full">
              <label>작업 환경 메모</label>
              <textarea
                v-model="form.env.memo"
                placeholder="예: 야간 교대 시 냉각수 온도 편차가 커서 22~24°C 범위 유지 필요"
              />
            </div>
          </div>

        </div>

        <!-- 우측 -->
        <div class="modal-right">

          <!-- Section 3: 노후도 등록 정보 -->
          <div class="section">
            <div class="section-header">
              <span class="section-title">노후도 등록 정보</span>
              <span class="badge-required">보정값</span>
            </div>
            <div class="field-grid field-grid--1">
              <div class="field">
                <label>T_life</label>
                <input v-model="form.aging.t_life_months" placeholder="예: 72개월" />
              </div>
              <div class="field">
                <label>노후도 계수 초기값</label>
                <input v-model="form.aging.aging_factor" placeholder="예: 0.92" />
              </div>
              <div class="field">
                <label>최근 오버홀 일자</label>
                <input v-model="form.aging.last_overhaul" type="date" />
              </div>
              <div class="field">
                <label>예방보전 주기</label>
                <input v-model="form.aging.pm_cycle_days" placeholder="예: 30일" />
              </div>
            </div>

            <!-- 계산 카드 -->
            <div class="calc-cards">
              <div class="calc-card">
                <span class="calc-label">예상 사용률</span>
                <span class="calc-value">{{ expectedUsage }}</span>
              </div>
              <div class="calc-card">
                <span class="calc-label">잔여 수명 추정</span>
                <span class="calc-value">{{ remainingLife }}</span>
              </div>
              <div class="calc-card">
                <span class="calc-label">정비 위험도</span>
                <span class="calc-value">{{ maintenanceRisk }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <template #footer>
        <div class="modal-footer">
          <span class="footer-desc">설비 기본 정보와 함께 노후도 계수, 작업 환경 기준을 동시에 등록해 초기 보정값까지 한번에 설정합니다.</span>
          <div class="footer-actions">
            <button class="btn-cancel" @click="emit('close')">취소</button>
            <button class="btn-submit" @click="handleSave">
              {{ isEditMode ? '수정 저장' : '설비 등록' }}
            </button>
          </div>
        </div>
      </template>
    </BaseFormModal>
  </Teleport>
</template>

<style scoped>
.modal-body {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.modal-left  { flex: 1; display: flex; flex-direction: column; gap: 16px; }
.modal-right { width: 400px; flex-shrink: 0; }

.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 17px 17px 12px;
  background: linear-gradient(180deg, rgba(240, 238, 255, 0.42) 0%, rgba(255, 255, 255, 0) 100%);
  border: 3px solid var(--color-border-default);
  border-radius: var(--radius-md);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
}

.section-title {
  font-size: 13px;
  font-weight: 900;
  color: var(--color-primary-800);
}

.badge-required {
  padding: 3px 8px;
  background: var(--color-mint-100);
  border-radius: 999px;
  font-size: 10px;
  font-weight: 900;
  color: var(--color-success-text);
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
}

.field-grid--3 { grid-template-columns: 1fr 1fr 1fr; }
.field-grid--1 { grid-template-columns: 1fr; }

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field--full { grid-column: 1 / -1; }

label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-800);
}

input,
select {
  height: 40px;
  padding: 0 12px;
  background: var(--color-bg-surface);
  border: 3px solid var(--color-border-default);
  border-radius: var(--radius-xs);
  font-size: 13px;
  color: var(--color-primary-800);
  outline: none;
  box-sizing: border-box;
}

input::placeholder { color: var(--color-text-placeholder); }
input:focus, select:focus { border-color: var(--color-primary-600); }

textarea {
  padding: 12px;
  background: var(--color-bg-surface);
  border: 3px solid var(--color-border-default);
  border-radius: var(--radius-xs);
  font-size: 13px;
  color: var(--color-primary-800);
  outline: none;
  resize: none;
  height: 72px;
  box-sizing: border-box;
  width: 100%;
}

textarea::placeholder { color: var(--color-text-placeholder); }
textarea:focus { border-color: var(--color-primary-600); }

.calc-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-top: 4px;
}

.calc-card {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 13px 15px 8px;
  background: var(--color-bg-surface);
  border: 3px solid var(--color-border-default);
  border-radius: var(--radius-sm);
}

.calc-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text-placeholder);
}

.calc-value {
  font-size: 13px;
  font-weight: 900;
  color: var(--color-primary-800);
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 16px;
}

.footer-desc {
  font-size: 11px;
  color: var(--color-text-secondary);
  flex: 1;
}

.footer-actions {
  display: flex;
  gap: 10px;
}

.btn-cancel {
  height: 36px;
  padding: 0 18px;
  background: var(--color-bg-surface);
  border: 3px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.btn-cancel:hover { background: var(--color-primary-100); color: var(--color-primary-600); }

.btn-submit {
  height: 36px;
  padding: 0 18px;
  background: var(--color-primary-600);
  border: 3px solid var(--color-primary-500);
  border-radius: var(--radius-2xs);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-bg-surface);
  cursor: pointer;
}

.btn-submit:hover { background: var(--color-primary-700); }
</style>
