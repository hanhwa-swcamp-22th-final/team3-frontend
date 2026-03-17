<script setup>
import { ref, watch, computed } from 'vue'
import { CATEGORY_STYLE } from '@/mocks/admin/keyword/keywordData.js'

const CATEGORY_OPTIONS = Object.keys(CATEGORY_STYLE)

const props = defineProps({
  isOpen:  { type: Boolean, default: false },
  keyword: { type: Object,  default: null  },
})

const emit = defineEmits(['close', 'save'])

const EMPTY_FORM = () => ({
  keyword:     '',
  category:    CATEGORY_OPTIONS[0],
  description: '',
  weight:      1.0,
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
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
      <div class="modal">

        <!-- 헤더 -->
        <div class="modal-header">
          <span class="modal-title">{{ isEditMode ? '키워드 수정' : '키워드 등록' }}</span>
          <button class="btn-close" @click="emit('close')">✕</button>
        </div>

        <div class="modal-divider" />

        <!-- 바디 -->
        <div class="modal-body">

          <!-- 키워드명 -->
          <div class="field">
            <label>키워드명</label>
            <input v-model="form.keyword" placeholder="예: 티칭, 오버홀..." />
          </div>

          <!-- 역량 카테고리 -->
          <div class="field">
            <label>역량 카테고리</label>
            <select v-model="form.category">
              <option v-for="c in CATEGORY_OPTIONS" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <!-- 설명 -->
          <div class="field">
            <label>설명</label>
            <textarea v-model="form.description" placeholder="키워드에 대한 간략한 설명 입력" />
          </div>

          <!-- 가중치 -->
          <div class="field">
            <label>가중치 (1.0 ~ 2.0)</label>
            <input v-model.number="form.weight" type="number" min="1.0" max="2.0" step="0.1" placeholder="예: 1.5" style="width: 200px;" />
          </div>

        </div>

        <!-- 푸터 -->
        <div class="modal-footer">
          <button class="btn-cancel" @click="emit('close')">취소</button>
          <button class="btn-submit" @click="handleSave">{{ isEditMode ? '수정 완료' : '등록 완료' }}</button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(45, 31, 110, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  font-family: var(--font-family-base);
}

.modal {
  width: 480px;
  background: var(--color-bg-surface);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(45, 31, 110, 0.2);
  display: flex;
  flex-direction: column;
}

/* 헤더 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 22px;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary-800);
}

.btn-close {
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  font-size: 18px;
  color: #7a6fa8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-divider {
  height: 1px;
  background: var(--color-border-default);
  margin: 0 24px;
}

/* 바디 */
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
}

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
  border-radius: 6px;
  font-size: 13px;
  color: var(--color-primary-800);
  font-family: var(--font-family-base);
  outline: none;
  box-sizing: border-box;
}

input::placeholder { color: #a89ed8; }
input:focus, select:focus { border-color: var(--color-primary-600); }

textarea {
  height: 60px;
  padding: 10px 12px;
  background: var(--color-bg-surface);
  border: 2px solid var(--color-border-default);
  border-radius: 6px;
  font-size: 13px;
  color: var(--color-primary-800);
  font-family: var(--font-family-base);
  outline: none;
  resize: none;
  box-sizing: border-box;
  width: 100%;
}

textarea::placeholder { color: #a89ed8; }
textarea:focus { border-color: var(--color-primary-600); }

/* 푸터 */
.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 0 24px 24px;
}

.btn-cancel {
  flex: 1;
  height: 36px;
  background: var(--color-primary-100);
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-600);
  font-family: var(--font-family-base);
  cursor: pointer;
}

.btn-cancel:hover { background: var(--color-border-default); }

.btn-submit {
  flex: 1;
  height: 36px;
  background: var(--color-primary-600);
  border: 1px solid var(--color-primary-500);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-bg-surface);
  font-family: var(--font-family-base);
  cursor: pointer;
}

.btn-submit:hover { background: var(--color-primary-700); }
</style>
