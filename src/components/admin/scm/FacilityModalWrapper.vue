<script setup>
import { computed, ref, watch } from 'vue'
import { BaseFormModal } from '@/components/common/base'

const STATUS_OPTIONS = [
  { value: 'OPERATING', label: '가동 중' },
  { value: 'STOPPED', label: '중지' },
  { value: 'UNDER_INSPECTION', label: '점검 중' },
  { value: 'DISPOSED', label: '폐기' },
]

const GRADE_OPTIONS = ['S', 'A', 'B', 'C'].map((grade) => ({ value: grade, label: grade }))

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  facility: { type: Object, default: null },
  lineOptions: { type: Array, default: () => [] },
  processOptions: { type: Array, default: () => [] },
  environmentOptions: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'save'])

const EMPTY_FORM = () => ({
  equipmentId: null,
  factoryLineName: '',
  equipmentProcessId: '',
  environmentStandardId: '',
  equipmentCode: '',
  equipmentName: '',
  equipmentStatus: 'OPERATING',
  equipmentGrade: 'B',
  currentEquipmentGrade: '',
  equipmentDescription: '',
  equipmentInstallDate: '',
  equipmentWarrantyMonth: '',
  equipmentDesignLifeMonths: '',
  equipmentWearCoefficient: '',
  equipmentStandardPerformanceRate: 98,
  equipmentBaselineErrorRate: 0,
})

const form = ref(EMPTY_FORM())

const isEditMode = computed(() => !!props.facility?.equipmentId)
const selectableLineOptions = computed(() =>
  props.lineOptions.filter((line) => line.value !== 'ALL')
)
const filteredProcessOptions = computed(() =>
  props.processOptions.filter(
    (process) => !form.value.factoryLineName || process.factoryLineName === form.value.factoryLineName
  )
)
const isConfirmDisabled = computed(
  () =>
    !form.value.factoryLineName ||
    !form.value.equipmentProcessId ||
    !form.value.environmentStandardId ||
    !form.value.equipmentCode.trim() ||
    !form.value.equipmentName.trim() ||
    form.value.equipmentWarrantyMonth === '' ||
    form.value.equipmentDesignLifeMonths === '' ||
    form.value.equipmentWearCoefficient === ''
)

watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) return

    form.value = props.facility
      ? {
          ...EMPTY_FORM(),
          ...props.facility,
          factoryLineName: props.facility.factoryLineName ?? '',
          equipmentProcessId: props.facility.equipmentProcessId ?? '',
          environmentStandardId: props.facility.environmentStandardId ?? '',
          equipmentInstallDate: props.facility.equipmentInstallDate?.slice(0, 10) ?? '',
          equipmentWarrantyMonth: props.facility.equipmentWarrantyMonth ?? '',
          equipmentDesignLifeMonths: props.facility.equipmentDesignLifeMonths ?? '',
          equipmentWearCoefficient: props.facility.equipmentWearCoefficient ?? '',
        }
      : EMPTY_FORM()
  }
)

watch(
  () => form.value.factoryLineName,
  (lineName) => {
    if (!lineName) {
      form.value.equipmentProcessId = ''
      return
    }

    const selectedProcess = props.processOptions.find(
      (process) => process.value === form.value.equipmentProcessId
    )
    if (selectedProcess && selectedProcess.factoryLineName === lineName) return

    form.value.equipmentProcessId = ''
  }
)

function handleSave() {
  if (isConfirmDisabled.value) return
  emit('save', { ...form.value })
}
</script>

<template>
  <Teleport to="body">
    <BaseFormModal
      v-if="isOpen"
      :title="isEditMode ? '설비 수정' : '설비 등록'"
      width="920px"
      :confirm-text="isEditMode ? '수정 저장' : '설비 등록'"
      cancel-text="취소"
      :confirm-disabled="isConfirmDisabled"
      @close="emit('close')"
      @cancel="emit('close')"
      @confirm="handleSave"
    >
      <div class="modal-body">
        <div class="section">
          <div class="section-header">
            <span class="section-title">기본 설비 정보</span>
            <span class="badge-required">필수</span>
          </div>
          <div class="field-grid">
            <div class="field">
              <label>설비 Code</label>
              <input v-model="form.equipmentCode" placeholder="예: MCH-03" />
            </div>
            <div class="field">
              <label>설비명</label>
              <input v-model="form.equipmentName" placeholder="예: 5축 머시닝 센터" />
            </div>
            <div class="field">
              <label>라인</label>
              <select v-model="form.factoryLineName">
                <option value="" disabled>라인 선택</option>
                <option
                  v-for="line in selectableLineOptions"
                  :key="line.value"
                  :value="line.value"
                >
                  {{ line.label }}
                </option>
              </select>
            </div>
            <div class="field">
              <label>공정</label>
              <select v-model="form.equipmentProcessId" :disabled="!form.factoryLineName">
                <option value="" disabled>
                  {{ form.factoryLineName ? '공정 선택' : '라인을 먼저 선택하세요' }}
                </option>
                <option
                  v-for="process in filteredProcessOptions"
                  :key="process.value"
                  :value="process.value"
                >
                  {{ process.label }}
                </option>
              </select>
            </div>
            <div class="field">
              <label>환경 기준</label>
              <select v-model="form.environmentStandardId">
                <option value="" disabled>환경 기준 선택</option>
                <option
                  v-for="environment in environmentOptions"
                  :key="environment.value"
                  :value="environment.value"
                >
                  {{ environment.label }}
                </option>
              </select>
            </div>
            <div class="field">
              <label>설비 상태</label>
              <select v-model="form.equipmentStatus">
                <option v-for="status in STATUS_OPTIONS" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </div>
            <div class="field">
              <label>설치일</label>
              <input v-model="form.equipmentInstallDate" type="date" />
            </div>
            <div class="field">
              <label>초기 등급</label>
              <select v-model="form.equipmentGrade">
                <option v-for="grade in GRADE_OPTIONS" :key="grade.value" :value="grade.value">
                  {{ grade.label }}
                </option>
              </select>
            </div>
            <div v-if="isEditMode" class="field">
              <label>현재 등급</label>
              <input :value="form.currentEquipmentGrade ?? form.equipmentGrade ?? '-'" disabled />
            </div>
          </div>
          <div class="field field--full">
            <label>설비 설명</label>
            <textarea
              v-model="form.equipmentDescription"
              placeholder="설비 특징이나 운영 메모를 입력하세요."
            />
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <span class="section-title">노후화 파라미터</span>
            <span class="badge-required">필수</span>
          </div>
          <div class="field-grid">
            <div class="field">
              <label>보증 기간(개월)</label>
              <input v-model.number="form.equipmentWarrantyMonth" type="number" min="0" />
            </div>
            <div class="field">
              <label>설계 수명(개월)</label>
              <input v-model.number="form.equipmentDesignLifeMonths" type="number" min="0" />
            </div>
            <div class="field">
              <label>마모 계수</label>
              <input v-model.number="form.equipmentWearCoefficient" type="number" min="0" step="0.0001" />
            </div>
          </div>
        </div>

        <div v-if="!isEditMode" class="section">
          <div class="section-header">
            <span class="section-title">초기 기준 성능</span>
            <span class="badge-required">등록 시 필요</span>
          </div>
          <div class="field-grid">
            <div class="field">
              <label>기준 성능률</label>
              <input
                v-model.number="form.equipmentStandardPerformanceRate"
                type="number"
                min="0"
                step="0.01"
              />
            </div>
            <div class="field">
              <label>기준 오차율</label>
              <input
                v-model.number="form.equipmentBaselineErrorRate"
                type="number"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>
    </BaseFormModal>
  </Teleport>
</template>

<style scoped>
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 17px;
  background: linear-gradient(180deg, rgba(240, 238, 255, 0.42) 0%, rgba(255, 255, 255, 0) 100%);
  border: 3px solid var(--color-border-default);
  border-radius: var(--radius-md);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
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

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field--full {
  grid-column: 1 / -1;
}

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

input::placeholder {
  color: var(--color-text-placeholder);
}

input:focus,
select:focus {
  border-color: var(--color-primary-600);
}

textarea {
  width: 100%;
  height: 72px;
  padding: 12px;
  background: var(--color-bg-surface);
  border: 3px solid var(--color-border-default);
  border-radius: var(--radius-xs);
  font-size: 13px;
  color: var(--color-primary-800);
  outline: none;
  resize: none;
  box-sizing: border-box;
}

textarea::placeholder {
  color: var(--color-text-placeholder);
}

textarea:focus {
  border-color: var(--color-primary-600);
}
</style>