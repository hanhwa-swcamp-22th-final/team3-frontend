<script setup>
import { ref, watch, computed } from 'vue'
import { BaseFormModal } from '@/components/common/base'
import { CATEGORY_STYLE } from '@/mocks/admin/keyword/keywordData.js'

const CATEGORY_OPTIONS = Object.keys(CATEGORY_STYLE)

const props = defineProps({
  isOpen:  { type: Boolean, default: false },
  keyword: { type: Object,  default: null  },
})

const emit = defineEmits(['close', 'save'])

const EMPTY_FORM = () => ({
  keyword:     '',
  category:    '',
  description: '',
  weight:      null,
})

const form = ref(EMPTY_FORM())

watch(() => props.isOpen, (val) => {
  if (!val) return
  form.value = props.keyword ? { ...props.keyword } : EMPTY_FORM()
})

const isEditMode = computed(() => !!props.keyword)

const handleSave = () => {
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
        <input v-model="form.keyword" placeholder="예: 티칭, 오버홀..." />
      </div>

      <div class="field">
        <label>역량 카테고리</label>
        <select v-model="form.category" :class="{ 'select-placeholder': !form.category }">
          <option value="" disabled>카테고리 선택</option>
          <option v-for="c in CATEGORY_OPTIONS" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="field">
        <label>설명</label>
        <textarea v-model="form.description" placeholder="키워드에 대한 간략한 설명 입력" />
      </div>

      <div class="field">
        <label>가중치 (1.0 ~ 2.0)</label>
        <input v-model.number="form.weight" type="number" min="1.0" max="2.0" step="0.1" placeholder="예: 1.5" style="width: 200px;" />
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
</style>
