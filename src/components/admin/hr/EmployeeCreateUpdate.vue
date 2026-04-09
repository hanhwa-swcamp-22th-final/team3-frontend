<script setup>
import { ref, watch } from 'vue'
import { BaseFormModal } from '@/components/common/base'

const props = defineProps(['isOpen', 'employee'])
const emit  = defineEmits(['close', 'save'])

// ── 백엔드 EmployeeCreateRequest 기반 폼 초기값 ──
const EMPTY_FORM = {
  employeeName:             '',
  employeeEmail:            '',
  employeePhone:            '',
  employeeAddress:          '',
  employeeEmergencyContact: '',
  employeePassword:         '',
  employeeRole:             'WORKER',
  employeeStatus:           'ACTIVE',
  employeeTier:             'C',
  hireDate:                 '',
  // ── 역량 점수 (EmployeeSkillUpdateRequest 기반) ──
  equipmentResponse:  0,   // 설비 대응
  technicalTransfer:  0,   // 기술 전수
  innovationProposal: 0,   // 혁신 제안
  safetyCompliance:   0,   // 안전 준수
  qualityManagement:  0,   // 품질 관리
  productivity:       0,   // 생산성
}

const form = ref({ ...EMPTY_FORM })

// ── 수정 모드 초기값: 모든 필드 빈 상태 (사용자가 입력한 항목만 전송) ──
const EDIT_FORM = {
  employeeName:             '',
  employeeEmail:            '',
  employeePhone:            '',
  employeeAddress:          '',
  employeeEmergencyContact: '',
  employeePassword:         '',
  employeeRole:             '',
  employeeStatus:           '',
  employeeTier:             '',
  hireDate:                 '',
  equipmentResponse:        0,
  technicalTransfer:        0,
  innovationProposal:       0,
  safetyCompliance:         0,
  qualityManagement:        0,
  productivity:             0,
}

// ── watch: isOpen이 true가 될 때마다 폼 초기화 ──
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.employee) {
      // 수정 모드: 빈 폼 + employeeId만 전달
      form.value = { ...EDIT_FORM, ...props.employee }
    } else {
      // 등록 모드: 기본값 세팅
      form.value = { ...EMPTY_FORM }
    }
  }
})

// ── 셀렉트 옵션 (백엔드 enum 기반) ──
const roleOptions = [
  { value: 'WORKER', label: 'Worker' },
  { value: 'TL',     label: 'Team Leader' },
  { value: 'DL',     label: 'Dept. Leader' },
  { value: 'HRM',    label: 'HR Manager' },
  { value: 'ADMIN',  label: 'Admin' },
]

const statusOptions = [
  { value: 'ACTIVE',    label: '재직' },
  { value: 'ON_LEAVE',  label: '휴직' },
  { value: 'RESIGNED',  label: '퇴직' },
]

const tierOptions = [
  { value: 'S', label: 'S' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
]

// ── 역량 점수 항목 (SkillCategory enum 기반, 2열 3행) ──
const scoreColumns = [
  [
    { key: 'equipmentResponse',  label: '설비 대응' },
    { key: 'innovationProposal', label: '혁신 제안' },
    { key: 'qualityManagement',  label: '품질 관리' },
  ],
  [
    { key: 'technicalTransfer',  label: '기술 전수' },
    { key: 'safetyCompliance',   label: '안전 준수' },
    { key: 'productivity',       label: '생산성' },
  ],
]

const barWidth = (val) => `${Math.min(Math.max(Number(val) || 0, 0), 100)}%`

// ── 유효성 검사 + 저장 ──
const handleSave = () => {
  // 등록 모드: 필수 필드 검증
  if (!props.employee) {
    if (!form.value.employeeName.trim())    return alert('이름을 입력해주세요.')
    if (!form.value.employeeEmail.trim())   return alert('이메일을 입력해주세요.')
    if (!form.value.employeePhone.trim())   return alert('전화번호를 입력해주세요.')
    if (!form.value.employeeAddress.trim()) return alert('주소를 입력해주세요.')
    if (!form.value.employeeEmergencyContact.trim()) return alert('비상연락처를 입력해주세요.')
    if (!form.value.employeePassword.trim()) return alert('비밀번호를 입력해주세요.')
    if (!form.value.hireDate)               return alert('입사일을 입력해주세요.')
  }
  // 수정 모드: 모든 필드 선택 (빈 문자열은 null로 변환하여 백엔드에서 무시)

  emit('save', { ...form.value })
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <BaseFormModal
      v-if="isOpen"
      :title="employee ? '사원 정보 수정' : '사원 등록'"
      width="688px"
      @close="emit('close')"
    >

        <!-- ① 기본 정보 ───────────────────────────── -->
        <p class="section-label">{{ employee ? '기본 정보 수정' : '기본 정보 입력' }}</p>

        <div class="form-grid">

          <!-- 이름 -->
          <div class="field">
            <label class="field-label">이름 <span v-if="!employee" class="required">*</span></label>
            <input
              v-model="form.employeeName"
              class="field-input"
              type="text"
              placeholder="홍길동"
            />
          </div>

          <!-- 이메일 -->
          <div class="field">
            <label class="field-label">이메일 <span v-if="!employee" class="required">*</span></label>
            <input
              v-model="form.employeeEmail"
              class="field-input"
              type="email"
              placeholder="example@company.com"
            />
          </div>

          <!-- 전화번호 -->
          <div class="field">
            <label class="field-label">전화번호 <span v-if="!employee" class="required">*</span></label>
            <input
              v-model="form.employeePhone"
              class="field-input"
              type="tel"
              placeholder="010-1234-5678"
            />
          </div>

          <!-- 비상연락처 -->
          <div class="field">
            <label class="field-label">비상연락처 <span v-if="!employee" class="required">*</span></label>
            <input
              v-model="form.employeeEmergencyContact"
              class="field-input"
              type="tel"
              placeholder="010-9876-5432"
            />
          </div>

          <!-- 주소 -->
          <div class="field full-width">
            <label class="field-label">주소 <span v-if="!employee" class="required">*</span></label>
            <input
              v-model="form.employeeAddress"
              class="field-input"
              type="text"
              placeholder="서울특별시 강남구 ..."
            />
          </div>

          <!-- 비밀번호 (등록 시 필수, 수정 시 선택) -->
          <div class="field full-width">
            <label class="field-label">
              비밀번호
              <span v-if="!employee" class="required">*</span>
              <span v-else class="field-hint">(변경 시에만 입력)</span>
            </label>
            <input
              v-model="form.employeePassword"
              class="field-input"
              type="password"
              :placeholder="employee ? '변경하지 않으려면 비워두세요' : '비밀번호 입력'"
            />
          </div>

        </div>

        <!-- ② 근무 정보 ───────────────────────────── -->
        <p class="section-label">근무 정보</p>

        <div class="form-grid">

          <!-- 직급 -->
          <div class="field">
            <label class="field-label">직급 <span v-if="!employee" class="required">*</span></label>
            <select v-model="form.employeeRole" class="field-input">
              <option value="">선택 안함</option>
              <option
                v-for="opt in roleOptions"
                :key="opt.value"
                :value="opt.value"
              >{{ opt.label }}</option>
            </select>
          </div>

          <!-- 상태 -->
          <div class="field">
            <label class="field-label">상태 <span v-if="!employee" class="required">*</span></label>
            <select v-model="form.employeeStatus" class="field-input">
              <option value="">선택 안함</option>
              <option
                v-for="opt in statusOptions"
                :key="opt.value"
                :value="opt.value"
              >{{ opt.label }}</option>
            </select>
          </div>

          <!-- 등급 -->
          <div class="field">
            <label class="field-label">등급 <span v-if="!employee" class="required">*</span></label>
            <select v-model="form.employeeTier" class="field-input">
              <option value="">선택 안함</option>
              <option
                v-for="opt in tierOptions"
                :key="opt.value"
                :value="opt.value"
              >{{ opt.label }}</option>
            </select>
          </div>

          <!-- 입사일 -->
          <div class="field">
            <label class="field-label">입사일 <span v-if="!employee" class="required">*</span></label>
            <input
              v-model="form.hireDate"
              class="field-input"
              type="date"
            />
          </div>

        </div>

        <!-- ③ 역량 점수 (EmployeeSkillUpdateRequest 기반) ── -->
        <p class="section-label">역량 점수 입력</p>

        <div class="score-warning">
          초기 등록 시 기본 점수를 입력합니다. 등록 후 별도로 수정할 수 있습니다.
        </div>

        <div class="score-grid">
          <div v-for="col in scoreColumns" :key="col[0].key" class="score-col">
            <div v-for="item in col" :key="item.key" class="score-item">
              <div class="score-header">
                <span class="score-label">{{ item.label }}</span>
                <input
                  v-model.number="form[item.key]"
                  class="score-input"
                  type="number"
                  min="0"
                  max="100"
                />
              </div>
              <div class="score-track">
                <div class="score-fill" :style="{ width: barWidth(form[item.key]) }"></div>
              </div>
            </div>
          </div>
        </div>

      <template #footer>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" @click="emit('close')">취소</button>
          <button type="button" class="btn btn-save" @click="handleSave">
            {{ employee ? '수정 완료' : '등록 완료' }}
          </button>
        </div>
      </template>

    </BaseFormModal>
  </Teleport>
</template>

<style scoped>

/* ── 섹션 레이블 ──────────────────────────────── */
.section-label {
  font-size: 9px;
  font-weight: 700;
  color: var(--color-primary-300);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;
}

/* ── 2열 폼 그리드 ──────────────────────────────── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* ── 개별 필드 ──────────────────────────────────── */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field.full-width {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 11px;
  color: var(--color-text-muted);
  line-height: 1;
}

.field-hint {
  font-size: 10px;
  color: var(--color-text-muted);
  opacity: 0.7;
}

/* 입력 공통 */
.field-input {
  box-sizing: border-box;
  width: 100%;
  height: 39px;
  padding: 9px 12px;
  background: var(--color-bg-surface);
  border: 3px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  font-size: 12px;
  color: var(--color-primary-800);
  outline: none;
  font-family: inherit;
}

.field-input:focus {
  border-color: var(--color-primary-600);
}

.required { color: var(--color-danger); }

/* ── 경고 박스 ──────────────────────────────────── */
.score-warning {
  box-sizing: border-box;
  padding: 10px 17px;
  background: var(--color-warning-soft);
  border-left: 3px solid var(--tier-b);
  border-radius: 4px;
  font-size: 11px;
  color: var(--color-warning);
  line-height: 1.4;
}

/* ── 역량 점수 그리드 (2열) ─────────────────────── */
.score-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 14px;
}

.score-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.score-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.score-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.score-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.score-input {
  width: 44px;
  height: 20px;
  padding: 0 4px;
  border: 1px solid var(--color-border-default);
  border-radius: 3px;
  font-size: 11px;
  font-family: var(--font-family-mono);
  color: var(--color-primary-600);
  text-align: right;
  outline: none;
  background: transparent;
}

.score-input:focus {
  border-color: var(--color-primary-600);
  background: var(--color-primary-100);
}

.score-track {
  width: 100%;
  height: 4px;
  background: var(--color-border-default);
  border-radius: 2px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: var(--color-primary-600);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* ── 버튼 행 ──────────────────────────────────── */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.btn {
  box-sizing: border-box;
  height: 27px;
  padding: 0 20px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.btn-cancel {
  background: var(--color-danger);
  border: 3px solid var(--color-danger);
  color: var(--color-text-inverse);
}

.btn-save {
  background: var(--color-primary-600);
  border: 3px solid var(--color-primary-500);
  color: var(--color-text-inverse);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
