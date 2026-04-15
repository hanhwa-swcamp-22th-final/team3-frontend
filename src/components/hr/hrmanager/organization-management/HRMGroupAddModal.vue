<script setup>
import { computed, ref } from 'vue'
import { DEPARTMENT_GROUP_COLORS } from '@/constants'
import BaseFormModal from '@/components/common/base/overlay/BaseFormModal.vue'

const props = defineProps({
  editMode:           { type: Boolean, default: false },
  initialName:        { type: String,  default: '' },
  initialColor:       { type: String,  default: '' },
  allEmployees:       { type: Array,   default: () => [] },
  initialMemberIds:   { type: Array,   default: () => [] },
})
const emit = defineEmits(['close', 'submit'])

const name        = ref(props.initialName)
const color       = ref(props.initialColor || DEPARTMENT_GROUP_COLORS[0])
const selected    = ref([...props.initialMemberIds])
const tierFilter  = ref('')
const posFilter   = ref('')
const nameSearch  = ref('')

const TIERS = ['S', 'A', 'B', 'C']
const ROLE_LABELS = { WORKER: '사원', TL: '팀장', DL: '부서장', HRM: 'HR 매니저', ADMIN: '관리자' }
const POSITIONS = Object.values(ROLE_LABELS)

function employeeId(emp) {
  return emp.employeeId ?? emp.employee_id
}

function employeeName(emp) {
  return emp.name ?? emp.employeeName ?? emp.employee_name ?? ''
}

function employeeTier(emp) {
  return emp.currentTier ?? emp.employeeCurrentTier ?? emp.employee_current_tier
}

function positionOf(emp) {
  const departmentName = emp.departmentName ?? emp.department_name ?? ''
  const teamName = emp.teamName ?? emp.team_name ?? ''
  return {
    position: ROLE_LABELS[emp.role] ?? emp.role ?? '사원',
    dept: departmentName && teamName && departmentName !== teamName
      ? `${departmentName} · ${teamName}`
      : departmentName || teamName || '기타',
  }
}

function tierColor(tier) {
  const map = { S: 'var(--tier-s)', A: 'var(--tier-a)', B: 'var(--tier-b)', C: 'var(--tier-c)' }
  return map[tier] ?? '#aaa'
}

function tierTextColor(tier) {
  return tier === 'B' ? '#1a1000' : 'var(--color-white)'
}

const poolEmployees = computed(() => {
  return props.allEmployees.filter(emp => {
    if (!employeeId(emp)) return false
    if (emp.role !== 'WORKER') return false
    if (tierFilter.value && employeeTier(emp) !== tierFilter.value) return false
    const { position } = positionOf(emp)
    if (posFilter.value && position !== posFilter.value) return false
    if (nameSearch.value && !employeeName(emp).includes(nameSearch.value)) return false
    return true
  })
})

const selectedEmployees = computed(() =>
  props.allEmployees.filter(emp => selected.value.includes(employeeId(emp)))
)

function toggleSelect(emp) {
  const id = employeeId(emp)
  const idx = selected.value.indexOf(id)
  if (idx === -1) selected.value.push(id)
  else selected.value.splice(idx, 1)
}

function isSelected(emp) {
  return selected.value.includes(employeeId(emp))
}

function handleSubmit() {
  if (!name.value.trim()) return
  emit('submit', {
    name:        name.value.trim(),
    color:       color.value,
    memberIds:   [...selected.value],
  })
}
</script>

<template>
  <BaseFormModal
    :title="editMode ? '그룹 편집' : '그룹 추가'"
    :confirmText="editMode ? '저장' : '추가'"
    :confirmDisabled="!name.trim()"
    :width="editMode ? '820px' : '460px'"
    @confirm="handleSubmit"
    @cancel="$emit('close')"
    @close="$emit('close')"
  >
    <div :class="editMode ? 'modal__body' : 'modal__form'">
      <div class="modal__left">
        <label class="modal__label">그룹명 <span class="modal__required">*</span></label>
        <input
          v-model="name"
          class="modal__input"
          placeholder="예: 생산본부"
          maxlength="30"
        />

        <label class="modal__label">그룹 색상</label>
        <div class="modal__colors">
          <button
            v-for="c in DEPARTMENT_GROUP_COLORS"
            :key="c"
            class="color-dot"
            :class="{ 'color-dot--active': color === c }"
            :style="{ background: c }"
            @click="color = c"
          />
        </div>

        <template v-if="editMode">
          <label class="modal__label">부서원</label>
          <div class="selected-box">
            <span v-if="selectedEmployees.length === 0" class="selected-box__empty">
              인력 풀에서 추가할 직원을 선택해 주세요
            </span>
            <div v-else class="selected-tags">
              <span
                v-for="emp in selectedEmployees"
                :key="employeeId(emp)"
                class="selected-tag"
                @click="toggleSelect(emp)"
              >
                {{ employeeName(emp) }}
                <span class="selected-tag__tier"
                  :style="{ background: tierColor(employeeTier(emp)), color: tierTextColor(employeeTier(emp)) }"
                >{{ employeeTier(emp) }}</span>
                <span class="selected-tag__remove">×</span>
              </span>
            </div>
          </div>
        </template>
      </div>

      <div v-if="editMode" class="modal__right">
        <p class="modal__section-title">인력 풀</p>

        <div class="pool__filters">
          <select v-model="tierFilter" class="pool__select">
            <option value="">전체 Tier</option>
            <option v-for="t in TIERS" :key="t" :value="t">Tier {{ t }}</option>
          </select>
          <select v-model="posFilter" class="pool__select">
            <option value="">전체 직위</option>
            <option v-for="p in POSITIONS" :key="p" :value="p">{{ p }}</option>
          </select>
          <div class="pool__search-wrap">
            <span class="pool__search-icon">&#128269;</span>
            <input v-model="nameSearch" class="pool__search" placeholder="이름 검색" />
          </div>
        </div>

        <div class="pool__list">
          <div
            v-for="emp in poolEmployees"
            :key="employeeId(emp)"
            class="pool-item"
            :class="{ 'pool-item--selected': isSelected(emp) }"
            @click="toggleSelect(emp)"
          >
            <div class="pool-item__avatar"
              :style="{ background: tierColor(employeeTier(emp)) }"
            >{{ employeeName(emp)[0] }}</div>
            <div class="pool-item__info">
              <div class="pool-item__row1">
                <span class="pool-item__name">{{ employeeName(emp) }}</span>
                <span class="pool-item__tier"
                  :style="{ background: tierColor(employeeTier(emp)), color: tierTextColor(employeeTier(emp)) }"
                >{{ employeeTier(emp) }}</span>
              </div>
              <p class="pool-item__sub">
                {{ positionOf(emp).position }}·{{ positionOf(emp).dept }}
              </p>
            </div>
            <div v-if="isSelected(emp)" class="pool-item__check">✓</div>
          </div>
          <div v-if="poolEmployees.length === 0" class="pool__empty">검색 결과가 없습니다.</div>
        </div>
      </div>
    </div>
  </BaseFormModal>
</template>

<style scoped>
.modal__form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.modal__body {
  display: flex;
  gap: 28px;
  min-height: 0;
}
.modal__left {
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.modal__right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.modal__label {
  font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
  margin-top: 6px;
}
.modal__required { color: var(--color-danger); }
.modal__input {
  width: 100%; height: 42px;
  padding: 0 14px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  font-size: var(--font-size-sm); color: var(--color-primary-800);
  background: var(--color-bg-app);
  box-sizing: border-box;
}
.modal__input:focus { outline: none; border-color: var(--color-primary-400); }
.modal__colors {
  display: flex; gap: 10px; flex-wrap: wrap;
  margin-top: 4px;
}
.color-dot {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2.5px solid transparent;
  cursor: pointer; flex-shrink: 0;
  transition: border-color .15s;
}
.color-dot--active { border-color: var(--color-primary-800); }

.selected-box {
  flex: 1;
  min-height: 120px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  padding: 10px 14px;
  background: var(--color-bg-app);
}
.selected-box__empty {
  font-size: var(--font-size-xs); color: #a89ed8;
  display: flex; align-items: center; justify-content: center;
  height: 100%;
}
.selected-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.selected-tag {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 8px;
  border-radius: 999px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  font-size: var(--font-size-xs);
  color: var(--color-primary-800);
  cursor: pointer;
}
.selected-tag__tier {
  padding: 2px 5px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: var(--font-weight-bold);
}
.selected-tag__remove {
  color: var(--color-danger);
  font-weight: var(--font-weight-bold);
}
.modal__section-title {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}
.pool__filters {
  display: flex;
  gap: 8px;
}
.pool__select, .pool__search {
  height: 36px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  background: var(--color-bg-app);
  color: var(--color-primary-800);
  font-size: var(--font-size-xs);
}
.pool__select {
  padding: 0 10px;
}
.pool__search-wrap {
  position: relative;
  flex: 1;
}
.pool__search {
  width: 100%;
  padding: 0 12px 0 30px;
  box-sizing: border-box;
}
.pool__search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: var(--color-primary-400);
}
.pool__list {
  flex: 1;
  min-height: 330px;
  max-height: 430px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;
}
.pool-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 10px;
  background: var(--color-bg-app);
  cursor: pointer;
}
.pool-item--selected {
  border-color: var(--color-primary-500);
  background: var(--color-primary-50);
}
.pool-item__avatar {
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-white);
  font-weight: var(--font-weight-bold);
}
.pool-item__info { flex: 1; min-width: 0; }
.pool-item__row1 {
  display: flex; align-items: center; gap: 6px;
}
.pool-item__name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}
.pool-item__tier {
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: var(--font-weight-bold);
}
.pool-item__sub {
  margin: 2px 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-primary-500);
}
.pool-item__check {
  color: var(--color-primary-700);
  font-weight: var(--font-weight-bold);
}
.pool__empty {
  padding: 40px 0;
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-primary-400);
}

</style>
