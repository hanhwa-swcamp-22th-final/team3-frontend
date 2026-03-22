<script setup>
import { ref } from 'vue'
import { GROUP_COLORS } from '@/mocks/hrmanager/organization.js'
import BaseFormModal from '@/components/common/base/overlay/BaseFormModal.vue'

const props = defineProps({
  editMode:           { type: Boolean, default: false },
  initialName:        { type: String,  default: '' },
  initialDescription: { type: String,  default: '' },
  initialColor:       { type: String,  default: '' },
})
const emit = defineEmits(['close', 'submit'])

const name        = ref(props.initialName)
const description = ref(props.initialDescription)
const color       = ref(props.initialColor || GROUP_COLORS[0])

function handleSubmit() {
  if (!name.value.trim()) return
  emit('submit', {
    name:        name.value.trim(),
    description: description.value.trim(),
    color:       color.value,
  })
}
</script>

<template>
  <BaseFormModal
    :title="editMode ? '그룹 편집' : '그룹 추가'"
    :confirmText="editMode ? '저장' : '추가'"
    :confirmDisabled="!name.trim()"
    width="460px"
    @confirm="handleSubmit"
    @cancel="$emit('close')"
    @close="$emit('close')"
  >
    <div class="modal__form">
    <label class="modal__label">그룹명 <span class="modal__required">*</span></label>
    <input
      v-model="name"
      class="modal__input"
      placeholder="예: 생산본부"
      maxlength="30"
    />

    <label class="modal__label">설명</label>
    <textarea
      v-model="description"
      class="modal__textarea"
      rows="4"
    />

    <label class="modal__label">그룹 색상</label>
    <div class="modal__colors">
      <button
        v-for="c in GROUP_COLORS"
        :key="c"
        class="color-dot"
        :class="{ 'color-dot--active': color === c }"
        :style="{ background: c }"
        @click="color = c"
      />
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

</style>
