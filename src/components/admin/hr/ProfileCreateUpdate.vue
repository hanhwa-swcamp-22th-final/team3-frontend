<script setup>
import { ref, computed, watch } from 'vue'

// Kiosk KeypadModal 패턴: isOpen=열림여부 / employee=null→등록, object→수정
const props = defineProps(['isOpen', 'employee'])
const emit  = defineEmits(['close', 'save'])

// EMPTY_FORM: watch에서 { ...EMPTY_FORM }으로 매번 새 객체를 만들어야 이전 입력값이 남지 않음
const EMPTY_FORM = {
  employee_name:           '',
  employee_code:           '',
  employee_line:           '',
  employee_role:           'worker',
  hire_date:               '',
  employee_equipment:      '',
  employee_certifications: '',
  employee_notes:          '',
  score_precision:         0,   // 정밀도
  score_speed:             0,   // 작업속도
  score_equipment_mastery: 0,   // 설비숙련
  score_collaboration:     0,   // 협업
  score_problem_solving:   0,   // 문제해결
  score_safety:            0,   // 안전준수
}

const form = ref({ ...EMPTY_FORM })

// ── watch (KeypadModal 패턴): isOpen이 true가 될 때마다 폼 초기화 ──
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

// ── 역량 점수 항목 (Figma: 2열 3행) ──────────────────
// 왼쪽 열: 정밀도 / 설비숙련 / 문제해결
// 오른쪽 열: 작업속도 / 협업 / 안전준수
const scoreColumns = [
  [
    { key: 'score_precision',         label: '정밀도' },
    { key: 'score_equipment_mastery', label: '설비숙련' },
    { key: 'score_problem_solving',   label: '문제해결' },
  ],
  [
    { key: 'score_speed',             label: '작업속도' },
    { key: 'score_collaboration',     label: '협업' },
    { key: 'score_safety',            label: '안전준수' },
  ],
]

// 0~100 사이 값을 % 문자열로 변환 (바 너비 계산용)
const barWidth = (val) => `${Math.min(Math.max(Number(val) || 0, 0), 100)}%`

// ── 최근 수정 이력 (updated_at / created_at 기반) ───
const historyLines = computed(() => {
  if (!props.employee) return []
  const lines = []
  if (props.employee.updated_at) {
    const d = props.employee.updated_at.substring(0, 10).replace(/-/g, '.')
    lines.push(`${d} · HR담당 · 정보 수정`)
  }
  if (props.employee.created_at) {
    const d = props.employee.created_at.substring(0, 10).replace(/-/g, '.')
    lines.push(`${d} · 시스템 · 1분기 Tier 자동 갱신`)
    lines.push(`${d} · HR담당 · 초기 등록`)
  }
  return lines
})

// ── handleSave (수업 패턴: try-catch-finally) ─────────
const handleSave = () => {
  if (!form.value.employee_name.trim()) return alert('이름을 입력해주세요.')
  if (!form.value.employee_code.trim()) return alert('사원번호를 입력해주세요.')
  if (!form.value.employee_line.trim()) return alert('소속라인을 입력해주세요.')

  emit('save', { ...form.value })
  emit('close')
}
</script>

<template>
  <!-- Kiosk KeypadModal 패턴: Teleport → body 직하에 렌더링 -->
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">

      <!-- modal-box: Figma 688px × 739px, padding 27px, gap 13px -->
      <form class="modal-box" @submit.prevent="handleSave">

        <!-- ① 기본 정보 수정 ───────────────────────────── -->
        <p class="section-label">✏️ {{ employee ? '기본 정보 수정' : '기본 정보 입력' }}</p>

        <div class="form-grid">

          <!-- 이름* -->
          <div class="field">
            <label class="field-label">이름 <span class="required">*</span></label>
            <input
              v-model="form.employee_name"
              class="field-input"
              type="text"
              placeholder="홍길동"
            />
          </div>

          <!-- 사원번호 (수정 시 readonly) -->
          <div class="field">
            <label class="field-label">사원번호 <span v-if="!employee" class="required">*</span></label>
            <input
              v-model="form.employee_code"
              class="field-input"
              :class="{ 'field-input--readonly': !!employee }"
              type="text"
              placeholder="EMP-001"
              :readonly="!!employee"
            />
          </div>

          <!-- 소속라인* -->
          <div class="field">
            <label class="field-label">소속라인 <span class="required">*</span></label>
            <input
              v-model="form.employee_line"
              class="field-input"
              type="text"
              placeholder="정밀가공 1라인"
            />
          </div>

          <!-- 직급* (= 시스템 역할) -->
          <div class="field">
            <label class="field-label">직급 <span class="required">*</span></label>
            <select v-model="form.employee_role" class="field-input">
              <option value="worker">Worker</option>
              <option value="TL">Team Leader</option>
              <option value="DL">Dept. Leader</option>
              <option value="HRM">HR Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <!-- 입사일* -->
          <div class="field">
            <label class="field-label">입사일 <span class="required">*</span></label>
            <input
              v-model="form.hire_date"
              class="field-input"
              type="date"
            />
          </div>

          <!-- 담당설비 -->
          <div class="field">
            <label class="field-label">담당설비</label>
            <input
              v-model="form.employee_equipment"
              class="field-input"
              type="text"
              placeholder="MCH-01"
            />
          </div>

        </div>

        <!-- ② 역량 점수 수동 조정 ─────────────────────── -->
        <p class="section-label">🎓 역량 점수 수동 조정</p>

        <!-- 경고 박스 (Figma: #FFF8E0, border-left #FFD166) -->
        <div class="score-warning">
          ⚠️ AI 정성 평가 점수는 자동 산출됩니다. 초기 등록 또는 오류 정정 시에만 수동 입력
        </div>

        <!-- 점수 바 2열 3행 -->
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

        <!-- ③ 추가 정보 ──────────────────────────────── -->
        <p class="section-label">📝 추가 정보</p>

        <div class="form-grid">
          <div class="field">
            <label class="field-label">자격증</label>
            <textarea
              v-model="form.employee_certifications"
              class="field-textarea"
              placeholder="기사 자격증 등"
            ></textarea>
          </div>
          <div class="field">
            <label class="field-label">특기사항</label>
            <textarea
              v-model="form.employee_notes"
              class="field-textarea"
              placeholder="특이사항 입력"
            ></textarea>
          </div>
        </div>

        <!-- ④ 최근 수정 이력 (수정 모드에서만 표시) ──── -->
        <div v-if="employee" class="history-box">
          <p class="history-title">📅 최근 수정 이력</p>
          <p v-for="(line, i) in historyLines" :key="i" class="history-line">{{ line }}</p>
        </div>

        <!-- ⑤ 버튼 행 ──────────────────────────────────── -->
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" @click="$emit('close')">취소</button>
          <button type="button" class="btn btn-temp" :disabled="isSubmitting">임시 저장</button>
          <button type="submit" class="btn btn-save" :disabled="isSubmitting">
            {{ isSubmitting ? '저장 중…' : '저장 완료' }}
          </button>
        </div>

      </form>
    </div>
  </Teleport>
</template>

<style scoped>
/* ── 오버레이 ───────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* ── 모달 박스 (Figma: 688px, padding 27px, gap 13px) ─ */
.modal-box {
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding: 27px;
  width: 688px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--color-bg-surface);
  border: 3px solid var(--color-border-default);
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-card);
}

/* ── 섹션 레이블 (Figma: 9px, uppercase, #A89ED8) ──── */
.section-label {
  font-size: 9px;
  font-weight: 700;
  color: var(--color-primary-300);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;
}

/* ── 2열 폼 그리드 ──────────────────────────────────── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* ── 개별 필드 ──────────────────────────────────────── */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 11px;
  color: var(--color-text-muted);
  line-height: 1;
}

/* 입력 공통 (Figma: height 39px, border 3px #E0DCFF, radius 6px, padding 9px 12px) */
.field-input,
.field-textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 9px 12px;
  background: var(--color-bg-surface);
  border: 3px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  font-size: 12px;
  color: var(--color-primary-800);
  outline: none;
  font-family: inherit;
}

.field-input {
  height: 39px;
}

.field-input:focus,
.field-textarea:focus {
  border-color: var(--color-primary-600);
}

/* 사원번호 읽기전용 (Figma: background #F5F5F5) */
.field-input--readonly {
  background: var(--color-neutral-100);
  cursor: default;
}

.field-textarea {
  height: 50px;
  resize: vertical;
}

.required { color: var(--color-danger); }

/* ── 경고 박스 (Figma: #FFF8E0, border-left 3px #FFD166) */
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

/* ── 역량 점수 그리드 (2열) ─────────────────────────── */
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

/* 점수 항목 1개 (라벨+값 행 + 바) */
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

/* 점수 수동 입력 (Figma: 숫자값, #5B4FCF) */
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

/* 진행 바 (Figma: track #E0DCFF, fill #5B4FCF, height ~4px) */
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

/* ── 최근 수정 이력 (Figma: #FAFBFF, border 3px #E0DCFF, radius 8px) */
.history-box {
  box-sizing: border-box;
  padding: 17px;
  background: var(--color-bg-app);
  border: 3px solid var(--color-border-default);
  border-radius: var(--radius-xs);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-primary-300);
  margin-bottom: 4px;
}

.history-line {
  font-size: 11px;
  color: var(--color-primary-300);
  line-height: 1.7;
}

/* ── 버튼 행 (Figma: justify-content flex-end, gap 8px) */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 공통 버튼 (Figma: height 27px, border-radius 4px, font 11px bold) */
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

/* 취소 (Figma: background var(--color-danger), border 3px var(--color-danger)) */
.btn-cancel {
  background: var(--color-danger);
  border: 3px solid var(--color-danger);
  color: var(--color-text-inverse);
}

/* 임시 저장 (Figma: background #FFFFFF, border 3px #E0DCFF) */
.btn-temp {
  background: var(--color-bg-surface);
  border: 3px solid var(--color-border-default);
  color: var(--color-text-muted);
}

/* 저장 완료 (Figma: background #5B4FCF, border 3px #7F75DB) */
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
