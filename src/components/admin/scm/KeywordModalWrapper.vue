<script setup>
import { ref, watch, computed } from 'vue'
import { BaseFormModal } from '@/components/common/base'

const CATEGORY_OPTIONS = [
  { value: 'TECHNICAL_COMPETENCE', label: '기술역량' },
  { value: 'LEADERSHIP',          label: '리더십' },
  { value: 'SAFETY',              label: '안전' },
  { value: 'INNOVATION',          label: '혁신' },
  { value: 'COLLABORATION',       label: '협업' },
  { value: 'OTHERS',              label: '기타' },
]

const props = defineProps({
  isOpen:  { type: Boolean, default: false },
  keyword: { type: Object,  default: null  },
})

const emit = defineEmits(['close', 'save'])

const EMPTY_FORM = () => ({
  domainKeyword:             '',
  domainKeywordDescription:  '',
  domainCompetencyCategory:  '',
  domainBaseScore:           null,
  domainWeight:              null,
  domainIsActive:            true,
})

const form = ref(EMPTY_FORM())

watch(() => props.isOpen, (val) => {
  if (!val) return
  form.value = props.keyword ? { ...props.keyword } : EMPTY_FORM()
})

const isEditMode = computed(() => !!props.keyword)

const canSave = computed(() => {
  const f = form.value
  return f.domainKeyword.trim().length >= 2
    && f.domainCompetencyCategory
    && f.domainBaseScore != null && f.domainBaseScore >= 0.1 && f.domainBaseScore <= 10.0
    && f.domainWeight != null && f.domainWeight >= 1.0 && f.domainWeight <= 5.0
})

const handleSave = () => {
  if (!canSave.value) return
  emit('save', { ...form.value })
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <BaseFormModal
      v-if="isOpen"
      :title="isEditMode ? '키워드 수정' : '키워드 등록'"
      width="480px"
      :confirm-text="isEditMode ? '수정 완료' : '등록 완료'"
      cancel-text="취소"
      @close="emit('close')"
      @cancel="emit('close')"
      @confirm="handleSave"
    >
      <div class="field">
        <label>키워드명</label>
        <input v-model="form.domainKeyword" placeholder="예: 티칭, 오버홀..." />
      </div>

      <div class="field">
        <label>역량 카테고리</label>
        <select v-model="form.domainCompetencyCategory" :class="{ 'select-placeholder': !form.domainCompetencyCategory }">
          <option value="" disabled>카테고리 선택</option>
          <option v-for="c in CATEGORY_OPTIONS" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>
      </div>

      <div class="field">
        <label>설명</label>
        <textarea v-model="form.domainKeywordDescription" placeholder="키워드에 대한 간략한 설명 입력" />
      </div>

      <div class="field-row">
        <div class="field">
          <label>기본 점수 (0.1 ~ 10.0)</label>
          <input v-model.number="form.domainBaseScore" type="number" min="0.1" max="10.0" step="0.1" placeholder="예: 5.0" />
        </div>
        <div class="field">
          <label>가중치 (1.0 ~ 5.0)</label>
          <input v-model.number="form.domainWeight" type="number" min="1.0" max="5.0" step="0.1" placeholder="예: 1.5" />
        </div>
      </div>

      <div class="field">
        <label class="checkbox-label">
          <input type="checkbox" v-model="form.domainIsActive" />
          <span>활성 상태</span>
        </label>
      </div>
    </BaseFormModal>
  </Teleport>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-800);
}

input,
select {
  height: 36px;
  padding: 0 12px;
  background: var(--color-bg-surface);
  border: 2px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  font-size: 13px;
  color: var(--color-primary-800);
  outline: none;
  box-sizing: border-box;
}

input::placeholder { color: var(--color-text-placeholder); }
input:focus, select:focus { border-color: var(--color-primary-600); }
select.select-placeholder { color: var(--color-text-placeholder); }

textarea {
  height: 60px;
  padding: 10px 12px;
  background: var(--color-bg-surface);
  border: 2px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  font-size: 13px;
  color: var(--color-primary-800);
  outline: none;
  resize: none;
  box-sizing: border-box;
  width: 100%;
}

textarea::placeholder { color: var(--color-text-placeholder); }
textarea:focus { border-color: var(--color-primary-600); }

.field-row {
  display: flex;
  gap: 12px;
}

.field-row .field { flex: 1; }

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary-600);
  cursor: pointer;
}

.checkbox-label span {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary-800);
}
</style>
