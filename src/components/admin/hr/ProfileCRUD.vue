<script setup>
import { ref, watch } from 'vue'
import employeeApi from '@/services/employeeApi.js'

// Kiosk KeypadModal 패턴 그대로
// isOpen: 모달 열림/닫힘 / employee: null=등록, object=수정
const props = defineProps(['isOpen', 'employee'])
const emit  = defineEmits(['close', 'save'])

const isSubmitting = ref(false)

// EMPTY_FORM을 별도로 두는 이유 →
// watch에서 { ...EMPTY_FORM }으로 매번 새 객체를 만들어야 이전 입력값이 남지 않음
const EMPTY_FORM = {
  employee_code:          '',
  employee_name:          '',
  employee_email:         '',
  employee_role:          'worker',
  employee_line:          '',
  employee_equipment:     '',
  hire_date:              '',
  employee_certifications:'',
  employee_notes:         '',
}

const form = ref({ ...EMPTY_FORM })

// ── watch (KeypadModal 패턴) ─────────────────────────
// props.isOpen이 true가 될 때마다 폼 초기화
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.employee) {
      // 수정 모드: 기존 데이터로 폼 채우기
      form.value = {
        ...EMPTY_FORM,
        ...props.employee,
        hire_date: props.employee.created_at?.substring(0, 10) ?? '',
      }
    } else {
      // 등록 모드: 폼 완전 초기화
      form.value = { ...EMPTY_FORM }
    }
  }
})

// ── handleSave (수업 패턴: try-catch-finally) ────────
const handleSave = async () => {
  if (!form.value.employee_name.trim()) return alert('이름을 입력해주세요.')
  if (!form.value.employee_code.trim()) return alert('사원번호를 입력해주세요.')

  isSubmitting.value = true
  try {
    const payload = { ...form.value, updated_at: new Date().toISOString() }

    if (props.employee) {
      // 수정 모드
      await employeeApi.update(props.employee.id, payload)
    } else {
      // 등록 모드: 자동 세팅값 추가
      payload.created_at       = form.value.hire_date
        ? new Date(form.value.hire_date).toISOString()
        : new Date().toISOString()
      payload.employee_status  = '재직'
      payload.login_fail_count = 0
      payload.is_locked        = false
      payload.mfa_enabled      = false
      payload.last_login_at    = null
      await employeeApi.create(payload)
    }
    emit('save')   // 부모에게 목록 새로고침 요청
    emit('close')  // 모달 닫기
  } catch (e) {
    console.error('저장 실패:', e)
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return dateStr.substring(0, 10).replace(/-/g, '.')
}
</script>

<template>
  <!-- Kiosk KeypadModal 패턴: Teleport → body 직하에 렌더링 -->
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-box">

        <!-- 헤더 -->
        <div class="modal-header">
          <h2 class="modal-title">
            {{ employee ? '테크니션 수정' : '테크니션 등록' }}
          </h2>
          <button type="button" class="btn-close" @click="$emit('close')">✕</button>
        </div>

        <!-- 폼 (AdminMenuManagement 패턴: @submit.prevent) -->
        <form @submit.prevent="handleSave" class="modal-body">

          <!-- 기본 정보 -->
          <section class="form-section">
            <h3 class="section-title">기본 정보</h3>

            <div class="form-row">
              <label>이름 <span class="required">*</span></label>
              <input v-model="form.employee_name" type="text" placeholder="홍길동" />
            </div>
            <div class="form-row">
              <label>사원번호 <span class="required">*</span></label>
              <input v-model="form.employee_code" type="text" placeholder="EMP-001" />
            </div>
            <div class="form-row">
              <label>이메일</label>
              <input v-model="form.employee_email" type="email" placeholder="name@seto.com" />
            </div>
            <div class="form-row">
              <label>역할</label>
              <select v-model="form.employee_role">
                <option value="worker">Worker</option>
                <option value="TL">Team Leader</option>
                <option value="DL">Dept. Leader</option>
                <option value="HRM">HR Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="form-row">
              <label>라인</label>
              <input v-model="form.employee_line" type="text" placeholder="A라인" />
            </div>
            <div class="form-row">
              <label>담당 설비</label>
              <input v-model="form.employee_equipment" type="text" placeholder="CNC-01" />
            </div>
            <div class="form-row">
              <label>입사일</label>
              <input v-model="form.hire_date" type="date" />
            </div>
          </section>

          <!-- 기타 -->
          <section class="form-section">
            <h3 class="section-title">기타</h3>

            <div class="form-row">
              <label>자격증</label>
              <input v-model="form.employee_certifications" type="text" placeholder="기사 자격증 등" />
            </div>
            <div class="form-row">
              <label>메모</label>
              <textarea v-model="form.employee_notes" rows="3" placeholder="특이사항 입력"></textarea>
            </div>
            <div v-if="employee" class="form-row">
              <label>최근 수정</label>
              <span class="read-only">{{ formatDate(employee.updated_at) }}</span>
            </div>
          </section>

          <!-- 버튼 -->
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" @click="$emit('close')">취소</button>
            <button type="submit" class="btn btn-save" :disabled="isSubmitting">
              {{ isSubmitting ? '저장 중…' : '저장' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: #FFFFFF;
  border-radius: 14px;
  width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(17, 24, 39, 0.18);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #E0DCFF;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #2D1F6E;
}

.btn-close {
  background: none;
  border: none;
  font-size: 16px;
  color: #A89ED8;
  cursor: pointer;
}

.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section { display: flex; flex-direction: column; gap: 12px; }

.section-title {
  font-size: 10px;
  font-weight: 700;
  color: #A89ED8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-row label {
  font-size: 11px;
  font-weight: 600;
  color: #7A6FA8;
}

.form-row input,
.form-row select,
.form-row textarea {
  height: 36px;
  padding: 0 10px;
  border: 1px solid #E0DCFF;
  border-radius: 6px;
  font-size: 12px;
  color: #2D1F6E;
  outline: none;
}

.form-row textarea {
  height: auto;
  padding: 8px 10px;
  resize: vertical;
}

.form-row input:focus,
.form-row select:focus,
.form-row textarea:focus {
  border-color: #5B4FCF;
}

.required { color: #EF476F; }

.read-only {
  font-size: 12px;
  color: #7A6FA8;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
}

.btn {
  height: 36px;
  padding: 0 20px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border: none;
}

.btn-cancel {
  background: #F0EEFF;
  color: #5B4FCF;
}

.btn-save {
  background: #5B4FCF;
  color: #FFFFFF;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
