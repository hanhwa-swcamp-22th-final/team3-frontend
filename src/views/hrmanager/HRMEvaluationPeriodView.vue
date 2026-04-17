<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  fetchEvaluationPeriods,
  createEvaluationPeriod,
  updateEvaluationPeriod,
  closeEvaluationPeriod,
  confirmEvaluationPeriod,
  deleteEvaluationPeriod,
  fetchActiveAlgorithmVersionId,
} from '@/services/hrmanager/evaluationPeriodApi'
import { formatEvaluationPeriodLabel } from '@/utils/evaluationPeriod'

// ── 상태 ──────────────────────────────────────────────
const periods = ref([])
const isLoading = ref(false)
const actionLoading = ref(false) // 삭제/마감/확정 등 개별 액션 로딩
const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null

// 모달
const modalMode = ref('') // 'create' | 'edit'
const modalOpen = ref(false)
const submitting = ref(false)

const CURRENT_YEAR = new Date().getFullYear()
const CURRENT_MONTH = new Date().getMonth() + 1

const emptyForm = () => ({
  _year: CURRENT_YEAR,
  _month: CURRENT_MONTH,
  evalSequence: 1,
  startDate: '',
  endDate: '',
})
const form = ref(emptyForm())
const editingPeriodId = ref(null)

// ── 필터 ──────────────────────────────────────────────
const filterYear = ref('')
const filterStatus = ref('')

const STATUS_LABEL = { IN_PROGRESS: '진행중', CLOSING: '마감', CONFIRMED: '확정' }
const STATUS_CLASS = {
  IN_PROGRESS: 'period-table__badge--inprogress',
  CLOSING: 'period-table__badge--closing',
  CONFIRMED: 'period-table__badge--confirmed',
}

const STATUS_DESCRIPTION = {
  IN_PROGRESS: '평가 입력이 진행 중인 기간',
  CLOSING: '입력이 마감되고 확정을 기다리는 기간',
  CONFIRMED: '결과가 최종 확정된 기간',
}

// ── API 호출 ──────────────────────────────────────────
async function loadPeriods() {
  isLoading.value = true
  try {
    const params = {}
    if (filterYear.value) params.year = filterYear.value
    if (filterStatus.value) params.status = filterStatus.value
    const res = await fetchEvaluationPeriods(params)
    periods.value = res.data.data.content ?? []
  } catch {
    showToast('평가기간 목록을 불러오지 못했습니다.', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadPeriods)

// ── 토스트 ────────────────────────────────────────────
function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 2500)
}

// ── 모달 ──────────────────────────────────────────────
function openCreate() {
  form.value = emptyForm()
  editingPeriodId.value = null
  modalMode.value = 'create'
  modalOpen.value = true
}

function openEdit(period) {
  form.value = {
    algorithmVersionId: period.algorithmVersionId ?? 1,
    evalYear: period.evalYear,
    evalSequence: period.evalSequence,
    startDate: period.startDate,
    endDate: period.endDate,
  }
  editingPeriodId.value = period.evalPeriodId
  modalMode.value = 'edit'
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

// ── 저장 ──────────────────────────────────────────────
async function handleSave() {
  if (!form.value.startDate || !form.value.endDate) {
    showToast('시작일과 종료일을 입력해주세요.', 'error')
    return
  }
  if (form.value.startDate > form.value.endDate) {
    showToast('종료일은 시작일 이후여야 합니다.', 'error')
    return
  }

  submitting.value = true
  try {
    if (modalMode.value === 'create') {
      const algorithmVersionId = await fetchActiveAlgorithmVersionId()
      const evalYear = form.value._year * 100 + form.value._month
      await createEvaluationPeriod({ ...form.value, evalYear, algorithmVersionId })
      showToast('평가기간이 생성되었습니다.')
    } else {
      await updateEvaluationPeriod(editingPeriodId.value, form.value)
      showToast('평가기간이 수정되었습니다.')
    }
    closeModal()
  } catch (e) {
    const msg = e.response?.data?.message ?? '저장에 실패했습니다.'
    showToast(msg, 'error')
    closeModal()
  } finally {
    submitting.value = false
    await loadPeriods()
  }
}

// ── 마감 / 확정 / 삭제 ───────────────────────────────
async function handleClose(period) {
  if (!confirm(`"${formatPeriodLabel(period)}" 평가기간을 마감하시겠습니까?`)) return
  actionLoading.value = true
  try {
    await closeEvaluationPeriod(period.evalPeriodId)
    showToast('평가기간이 마감되었습니다.')
    await loadPeriods()
  } catch (e) {
    const msg = e.response?.data?.message ?? '마감에 실패했습니다.'
    showToast(msg, 'error')
  } finally {
    actionLoading.value = false
  }
}

async function handleConfirm(period) {
  if (!confirm(`"${formatPeriodLabel(period)}" 평가기간을 확정하시겠습니까?`)) return
  actionLoading.value = true
  try {
    await confirmEvaluationPeriod(period.evalPeriodId)
    showToast('평가기간이 확정되었습니다.')
    await loadPeriods()
  } catch (e) {
    const msg = e.response?.data?.message ?? '확정에 실패했습니다.'
    showToast(msg, 'error')
  } finally {
    actionLoading.value = false
  }
}

async function handleDelete(period) {
  if (!confirm(`"${formatPeriodLabel(period)}" 평가기간과 관련 평가내역을 삭제하시겠습니까?`)) return
  actionLoading.value = true
  try {
    await deleteEvaluationPeriod(period.evalPeriodId)
    showToast('평가기간이 삭제되었습니다.')
    await loadPeriods()
  } catch (e) {
    const msg = e.response?.data?.message ?? '삭제에 실패했습니다.'
    showToast(msg, 'error')
  } finally {
    actionLoading.value = false
  }
}

// ── 날짜 범위 (선택한 연도+월 기준) ──────────────────
const dateMin = computed(() => {
  const m = String(form.value._month).padStart(2, '0')
  return `${form.value._year}-${m}-01`
})
const dateMax = computed(() => {
  const lastDay = new Date(form.value._year, form.value._month, 0).getDate()
  const m = String(form.value._month).padStart(2, '0')
  return `${form.value._year}-${m}-${lastDay}`
})

// 필터용 연도 옵션
const yearOptions = computed(() => {
  const cur = new Date().getFullYear()
  return [cur - 1, cur, cur + 1]
})

const totalCount = computed(() => periods.value.length)
const inProgressCount = computed(() => periods.value.filter((p) => p.status === 'IN_PROGRESS').length)
const closingCount = computed(() => periods.value.filter((p) => p.status === 'CLOSING').length)
const confirmedCount = computed(() => periods.value.filter((p) => p.status === 'CONFIRMED').length)

function formatPeriodLabel(period) {
  return formatEvaluationPeriodLabel(period, { fallback: '-' })
}

function formatDateRange(period) {
  return `${period.startDate} ~ ${period.endDate}`
}

function getDurationDays(period) {
  if (!period.startDate || !period.endDate) return '-'
  const start = new Date(period.startDate)
  const end = new Date(period.endDate)
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
  return Number.isNaN(diff) ? '-' : `${diff}일`
}
</script>

<template>
  <section class="period-view">
    <div class="period-view__header">
      <div>
        <p class="period-view__eyebrow">평가 기간 관리</p>
        <h2 class="period-view__title">평가기간 설정</h2>
        <p class="period-view__subtitle">
          진행중, 마감, 확정 상태를 확인하고 필요한 기간만 바로 조치할 수 있습니다.
        </p>
      </div>
    </div>

    <div class="period-panel">
      <div class="period-panel__toolbar">
        <div class="period-panel__filters">
          <label class="period-panel__filter">
            <span class="period-panel__filter-label">연도</span>
            <select class="period-view__select" v-model="filterYear" @change="loadPeriods">
              <option value="">전체 연도</option>
              <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}년</option>
            </select>
          </label>
          <label class="period-panel__filter">
            <span class="period-panel__filter-label">상태</span>
            <select class="period-view__select" v-model="filterStatus" @change="loadPeriods">
              <option value="">전체 상태</option>
              <option value="IN_PROGRESS">진행중</option>
              <option value="CLOSING">마감</option>
              <option value="CONFIRMED">확정</option>
            </select>
          </label>
          <button class="period-view__btn period-view__btn--outline period-panel__refresh" @click="loadPeriods">
            새로고침
          </button>
        </div>
        <div class="period-panel__actions">
          <button class="period-view__btn period-view__btn--primary" @click="openCreate">
            + 평가기간 생성
          </button>
        </div>
      </div>

      <div class="period-panel__meta">
        <span class="period-panel__result">총 {{ totalCount }}개 · 진행중 {{ inProgressCount }} · 마감 {{ closingCount }} · 확정 {{ confirmedCount }}</span>
        <span class="period-panel__hint">현재 필요한 평가기간만 간결하게 관리할 수 있도록 정리된 목록입니다.</span>
      </div>

      <div class="period-view__table-wrap">
        <table class="period-table" v-if="!isLoading && !actionLoading">
          <thead class="period-table__head">
            <tr>
              <th>평가기간</th>
              <th>운영 기간</th>
              <th>기간 길이</th>
              <th>상태</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="periods.length === 0">
              <td colspan="5" class="period-table__empty">
                <strong>등록된 평가기간이 없습니다.</strong>
                <span>새 평가기간을 생성하면 이 영역에 상태와 작업 흐름이 표시됩니다.</span>
              </td>
            </tr>
            <tr v-for="p in periods" :key="p.evalPeriodId" class="period-table__row">
              <td class="period-table__period-cell">
                <strong class="period-table__period-title">{{ formatPeriodLabel(p) }}</strong>
                <span class="period-table__period-subtitle">평가 기간</span>
              </td>
              <td class="period-table__range">{{ formatDateRange(p) }}</td>
              <td>{{ getDurationDays(p) }}</td>
              <td>
                <span class="period-table__badge" :class="STATUS_CLASS[p.status]">
                  {{ STATUS_LABEL[p.status] ?? p.status }}
                </span>
                <p class="period-table__status-note">{{ STATUS_DESCRIPTION[p.status] }}</p>
              </td>
              <td class="period-table__actions">
                <button
                  v-if="p.status === 'IN_PROGRESS'"
                  class="period-table__action-btn period-table__action-btn--edit"
                  :disabled="actionLoading"
                  @click="openEdit(p)"
                >기간 수정</button>
                <button
                  v-if="p.status === 'IN_PROGRESS'"
                  class="period-table__action-btn period-table__action-btn--close"
                  :disabled="actionLoading"
                  @click="handleClose(p)"
                >마감 처리</button>
                <button
                  v-if="p.status === 'CLOSING'"
                  class="period-table__action-btn period-table__action-btn--confirm"
                  :disabled="actionLoading"
                  @click="handleConfirm(p)"
                >최종 확정</button>
                <span v-if="p.status === 'CONFIRMED'" class="period-table__done">완료된 평가기간</span>
                <button
                  class="period-table__action-btn period-table__action-btn--delete"
                  :disabled="actionLoading"
                  @click="handleDelete(p)"
                >삭제</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="isLoading || actionLoading" class="period-view__loading">
          <span class="period-view__spinner"></span>
          {{ isLoading ? '목록을 불러오는 중...' : '처리 중...' }}
        </div>
      </div>
    </div>

    <div v-if="modalOpen" class="period-modal__overlay" @click.self="closeModal">
      <div class="period-modal">
        <div class="period-modal__header">
          <h3 class="period-modal__title">{{ modalMode === 'create' ? '평가기간 생성' : '평가기간 수정' }}</h3>
          <button class="period-modal__close" @click="closeModal">✕</button>
        </div>

        <div class="period-modal__body">
          <div class="period-modal__row" v-if="modalMode === 'create'">
            <label class="period-modal__label">평가 연도 / 월</label>
            <div class="period-modal__row-inline">
              <select class="period-modal__input" v-model.number="form._year">
                <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}년</option>
              </select>
              <select class="period-modal__input" v-model.number="form._month">
                <option v-for="m in 12" :key="m" :value="m">{{ m }}월</option>
              </select>
            </div>
          </div>

          <div class="period-modal__row" v-if="modalMode === 'create'">
            <label class="period-modal__label">차수</label>
            <select class="period-modal__input" v-model.number="form.evalSequence">
              <option v-for="w in 5" :key="w" :value="w">{{ w }}차</option>
            </select>
          </div>

          <div class="period-modal__row">
            <label class="period-modal__label">시작일</label>
            <input type="date" class="period-modal__input" v-model="form.startDate"
              :min="dateMin" :max="dateMax" />
          </div>

          <div class="period-modal__row">
            <label class="period-modal__label">종료일</label>
            <input type="date" class="period-modal__input" v-model="form.endDate"
              :min="form.startDate || dateMin" :max="dateMax" />
          </div>

          <div class="period-modal__notice">
            저장 후 진행중 상태에서는 기간 수정과 마감이 가능하고, 마감 이후에는 최종 확정만 가능합니다.
          </div>
        </div>

        <div class="period-modal__footer">
          <button class="period-view__btn period-view__btn--outline" @click="closeModal">취소</button>
          <button
            class="period-view__btn period-view__btn--primary"
            @click="handleSave"
            :disabled="submitting"
          >
            {{ submitting ? '저장 중...' : '저장' }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="toast.show"
      class="period-view__toast"
      :class="`period-view__toast--${toast.type}`"
    >
      {{ toast.message }}
    </div>
  </section>
</template>

<style scoped>
.period-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px;
  background: var(--color-bg-app);
  overflow: auto;
  min-height: 0;
  position: relative;
}

.period-view__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.period-view__eyebrow {
  margin: 0 0 4px;
  color: var(--color-primary-500);
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-semibold);
}

.period-view__title {
  margin: 0;
  color: var(--color-primary-800);
  font-size: 32px;
  font-weight: var(--font-weight-bold);
  line-height: 1.15;
}

.period-view__subtitle {
  margin: 8px 0 0;
  max-width: 680px;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

.period-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  border-radius: 22px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.04);
}

.period-panel__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}

.period-panel__filters {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.period-panel__filter {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.period-panel__filter-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
}

.period-panel__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.period-panel__refresh {
  align-self: flex-end;
}

.period-panel__meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding: 0 6px;
}

.period-panel__result {
  color: var(--color-primary-800);
  font-size: var(--font-size-sm);
  font-weight: 700;
}

.period-panel__hint {
  color: var(--color-text-muted);
  font-size: 12px;
}

.period-view__select {
  min-width: 144px;
  height: 42px;
  padding: 0 14px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 10px;
  font-size: var(--font-size-sm);
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  cursor: pointer;
}

.period-view__btn {
  height: 42px;
  padding: 0 20px;
  border-radius: 10px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  border: none;
}

.period-view__btn--primary {
  background: var(--color-primary-600);
  color: var(--color-white);
}

.period-view__btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.period-view__btn--outline {
  background: var(--color-bg-surface);
  color: var(--color-primary-600);
  border: 1.5px solid var(--color-primary-300);
}

.period-view__table-wrap {
  flex: 1;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  overflow: hidden;
  background: var(--color-bg-surface);
}

.period-table {
  width: 100%;
  border-collapse: collapse;
}

.period-table__head th {
  padding: 16px 18px;
  background: var(--color-bg-subtle, #f8f9fb);
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  text-align: left;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--color-border-default);
}

.period-table__row td {
  padding: 18px;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border-subtle, #f0f1f5);
  vertical-align: middle;
}

.period-table__row:hover td {
  background: rgba(111, 90, 220, 0.02);
}

.period-table__row:last-child td {
  border-bottom: none;
}

.period-table__empty {
  text-align: center;
  padding: 64px 24px;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.period-table__empty strong,
.period-table__empty span {
  display: block;
}

.period-table__empty strong {
  margin-bottom: 8px;
  color: var(--color-primary-800);
  font-size: 16px;
}

.period-table__period-cell {
  min-width: 200px;
}

.period-table__period-title {
  display: block;
  margin-bottom: 4px;
  font-size: 15px;
  font-weight: 800;
  color: var(--color-primary-900, #231a58);
}

.period-table__period-subtitle {
  display: block;
  color: var(--color-text-muted);
  font-size: 12px;
}

.period-table__range {
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
}

.period-table__badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.period-table__badge--inprogress {
  background: #e8f4ff;
  color: #1a6abf;
}

.period-table__badge--closing {
  background: #fff3e0;
  color: #b45309;
}

.period-table__badge--confirmed {
  background: #eefbf6;
  color: #1d7f5f;
}

.period-table__status-note {
  margin: 8px 0 0;
  color: var(--color-text-muted);
  font-size: 12px;
  line-height: 1.5;
}

.period-table__actions {
  min-width: 200px;
}

.period-table__actions > * {
  margin-right: 8px;
  margin-bottom: 6px;
  vertical-align: middle;
}

.period-table__actions > *:last-child {
  margin-right: 0;
}

.period-table__actions .period-table__done {
  display: inline-block;
  margin-bottom: 0;
}

.period-table__action-btn {
  height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border: none;
}

.period-table__action-btn--edit {
  background: var(--color-bg-subtle, #f0f1f5);
  color: var(--color-text-primary);
}

.period-table__action-btn--close {
  background: #fff3e0;
  color: #b45309;
}

.period-table__action-btn--confirm {
  background: var(--color-primary-600);
  color: var(--color-white);
}

.period-table__action-btn--delete {
  background: #fff0f0;
  color: #c0392b;
}

.period-table__action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.period-table__done {
  font-size: 12px;
  color: #1d7f5f;
  font-weight: 700;
}

.period-view__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  padding: 72px 24px;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.period-view__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border-default);
  border-top-color: var(--color-primary-500);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 모달 */
.period-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.period-modal {
  background: var(--color-bg-surface);
  border-radius: 16px;
  width: 420px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
}

.period-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.period-modal__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

.period-modal__close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: 0;
  line-height: 1;
}

.period-modal__body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px 24px;
}

.period-modal__row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.period-modal__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

.period-modal__hint {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 12px;
  line-height: 1.5;
}

.period-modal__input {
  height: 40px;
  padding: 0 12px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: var(--color-bg-app);
}

.period-modal__input:focus {
  outline: none;
  border-color: var(--color-primary-400);
}

.period-modal__row-inline {
  display: flex;
  gap: 8px;
}

.period-modal__row-inline .period-modal__input {
  flex: 1;
}

.period-modal__static {
  height: 40px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  background: var(--color-bg-subtle, #f8f9fb);
}

.period-modal__notice {
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(111, 90, 220, 0.06);
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.period-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 24px 20px;
}

/* 토스트 */
.period-view__toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  z-index: 2000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.period-view__toast--success {
  background: #eefbf6;
  color: #1d7f5f;
}

.period-view__toast--error {
  background: #fff0f0;
  color: #c0392b;
}

@media (max-width: 1080px) {
  .period-panel__toolbar,
  .period-panel__meta {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 768px) {
  .period-view {
    padding: 18px;
  }

  .period-view__title {
    font-size: 26px;
  }

  .period-view__table-wrap {
    overflow: auto;
  }

  .period-table {
    min-width: 760px;
  }

  .period-modal {
    width: calc(100vw - 24px);
  }
}
</style>
