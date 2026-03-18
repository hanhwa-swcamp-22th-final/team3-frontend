<script setup>
import { ref, computed } from 'vue'
import { POSITIONS, POSITION_MAP } from '@/mocks/hrmanager/organization.js'

const props = defineProps({
  allEmployees: { type: Array, required: true },
  initialName:        { type: String,  default: '' },
  initialDescription: { type: String,  default: '' },
  initialMemberIds:   { type: Array,   default: () => [] },
  editMode:           { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'submit'])

const name        = ref(props.initialName)
const description = ref(props.initialDescription)
const selected    = ref([...props.initialMemberIds])

const tierFilter  = ref('')
const posFilter   = ref('')
const nameSearch  = ref('')

const TIERS = ['S', 'A', 'B', 'C']

function positionOf(emp) {
  return POSITION_MAP[emp.employee_id] ?? { position: '사원', dept: '기타' }
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
    if (tierFilter.value && emp.employee_current_tier !== tierFilter.value) return false
    const { position } = positionOf(emp)
    if (posFilter.value && position !== posFilter.value) return false
    if (nameSearch.value && !emp.employee_name.includes(nameSearch.value)) return false
    return true
  })
})

function toggleSelect(emp) {
  const idx = selected.value.indexOf(emp.employee_id)
  if (idx === -1) selected.value.push(emp.employee_id)
  else            selected.value.splice(idx, 1)
}

function isSelected(emp) {
  return selected.value.includes(emp.employee_id)
}

const selectedEmployees = computed(() =>
  props.allEmployees.filter(e => selected.value.includes(e.employee_id))
)

function handleSubmit() {
  if (!name.value.trim()) return
  emit('submit', {
    name:        name.value.trim(),
    description: description.value.trim(),
    memberIds:   [...selected.value],
  })
}
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <h2 class="modal__title">{{ editMode ? '팀 편집' : '팀 추가' }}</h2>

      <div class="modal__body">
        <!-- 좌측: 팀 정보 -->
        <div class="modal__left">
          <label class="modal__label">팀명 <span class="modal__required">*</span></label>
          <input
            v-model="name"
            class="modal__input"
            placeholder="예: 정밀가공1팀"
            maxlength="30"
          />

          <label class="modal__label">설명</label>
          <textarea
            v-model="description"
            class="modal__textarea"
            rows="4"
          />

          <label class="modal__label">선택된 팀원</label>
          <div class="selected-box">
            <span v-if="selectedEmployees.length === 0" class="selected-box__empty">
              팀원을 선택해 주세요
            </span>
            <div v-else class="selected-tags">
              <span
                v-for="emp in selectedEmployees"
                :key="emp.employee_id"
                class="selected-tag"
                @click="toggleSelect(emp)"
              >
                {{ emp.employee_name }}
                <span class="selected-tag__tier"
                  :style="{ background: tierColor(emp.employee_current_tier), color: tierTextColor(emp.employee_current_tier) }"
                >{{ emp.employee_current_tier }}</span>
                <span class="selected-tag__remove">×</span>
              </span>
            </div>
          </div>
        </div>

        <!-- 우측: 인력 풀 -->
        <div class="modal__right">
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
              :key="emp.employee_id"
              class="pool-item"
              :class="{ 'pool-item--selected': isSelected(emp) }"
              @click="toggleSelect(emp)"
            >
              <div class="pool-item__avatar"
                :style="{ background: tierColor(emp.employee_current_tier) }"
              >{{ emp.employee_name[0] }}</div>
              <div class="pool-item__info">
                <div class="pool-item__row1">
                  <span class="pool-item__name">{{ emp.employee_name }}</span>
                  <span class="pool-item__tier"
                    :style="{ background: tierColor(emp.employee_current_tier), color: tierTextColor(emp.employee_current_tier) }"
                  >{{ emp.employee_current_tier }}</span>
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

      <div class="modal__actions">
        <button class="modal__btn modal__btn--cancel" @click="$emit('close')">취소</button>
        <button
          class="modal__btn modal__btn--submit"
          :disabled="!name.trim()"
          @click="handleSubmit"
        >{{ editMode ? '저장' : '팀 추가' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.35);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
}
.modal {
  background: var(--color-bg-surface);
  border-radius: 16px;
  padding: 32px 36px;
  width: 820px; max-height: 90vh;
  display: flex; flex-direction: column; gap: 16px;
  box-shadow: 0 8px 40px rgba(0,0,0,.18);
}
.modal__title {
  font-size: var(--font-size-lg); font-weight: var(--font-weight-extrabold);
  color: var(--color-primary-800);
}
.modal__body {
  display: flex; gap: 28px; flex: 1; min-height: 0;
}

/* 좌측 */
.modal__left {
  flex: 0 0 320px;
  display: flex; flex-direction: column; gap: 8px;
}
.modal__label {
  font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
  margin-top: 4px;
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
.modal__textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  font-size: var(--font-size-sm); color: var(--color-primary-800);
  background: var(--color-bg-app);
  resize: none; box-sizing: border-box;
  font-family: inherit;
}
.modal__textarea:focus { outline: none; border-color: var(--color-primary-400); }

.selected-box {
  flex: 1;
  min-height: 100px;
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
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 8px;
  background: var(--color-primary-100);
  border-radius: 20px;
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); color: var(--color-primary-800);
  cursor: pointer;
}
.selected-tag__tier {
  display: inline-flex; align-items: center; justify-content: center;
  width: 16px; height: 16px; border-radius: 50%;
  font-size: var(--font-size-2xs); font-weight: var(--font-weight-extrabold);
}
.selected-tag__remove { font-size: var(--font-size-xs); color: #a89ed8; }

/* 우측 */
.modal__right {
  flex: 1; display: flex; flex-direction: column; gap: 10px;
  min-height: 0;
}
.modal__section-title {
  font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-primary-800);
}
.pool__filters {
  display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
}
.pool__select {
  height: 32px; padding: 0 10px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  font-size: var(--font-size-xs); color: var(--color-primary-600);
  background: var(--color-bg-app); cursor: pointer;
}
.pool__search-wrap {
  flex: 1; display: flex; align-items: center;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px; padding: 0 10px;
  background: var(--color-bg-app);
  height: 32px;
}
.pool__search-icon { font-size: var(--font-size-xs); color: #a89ed8; margin-right: 4px; }
.pool__search {
  border: none; outline: none; background: transparent;
  font-size: var(--font-size-xs); width: 100%; color: var(--color-primary-800);
}
.pool__list {
  flex: 1; overflow-y: auto;
  display: flex; flex-direction: column; gap: 6px;
  padding-right: 4px;
}
.pool__empty {
  font-size: var(--font-size-xs); color: #a89ed8;
  text-align: center; padding: 24px 0;
}
.pool-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px; cursor: pointer;
  background: var(--color-bg-app);
  transition: border-color .15s;
}
.pool-item:hover { border-color: var(--color-primary-300); }
.pool-item--selected { border-color: var(--color-primary-600); background: var(--color-primary-100); }
.pool-item__avatar {
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-size-sm); font-weight: var(--font-weight-extrabold); color: var(--color-white);
  flex-shrink: 0;
}
.pool-item__info { flex: 1; }
.pool-item__row1 { display: flex; align-items: center; gap: 6px; }
.pool-item__name { font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-primary-800); }
.pool-item__tier {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%;
  font-size: var(--font-size-2xs); font-weight: var(--font-weight-extrabold);
}
.pool-item__sub { font-size: var(--font-size-xs); color: #7a6fa8; margin-top: 1px; }
.pool-item__check {
  font-size: var(--font-size-base); font-weight: var(--font-weight-extrabold); color: var(--color-primary-600);
}

.modal__actions {
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 4px;
}
.modal__btn {
  height: 40px; padding: 0 24px;
  border-radius: 8px; font-size: var(--font-size-base); font-weight: var(--font-weight-bold);
  cursor: pointer; border: none;
}
.modal__btn--cancel {
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  color: var(--color-primary-600);
}
.modal__btn--submit {
  background: var(--color-primary-600);
  color: var(--color-white);
}
.modal__btn--submit:disabled { opacity: .5; cursor: not-allowed; }
</style>
