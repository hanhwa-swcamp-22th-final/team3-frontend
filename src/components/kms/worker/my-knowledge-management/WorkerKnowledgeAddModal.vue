<script setup>
import { ref, onMounted } from 'vue'
import { BaseFormModal } from '@/components/common/base'
import { ARTICLE_CATEGORY_OPTIONS } from '@/constants'
import knowledgeArticleApi from '@/services/knowledgeArticleApi'

const emit = defineEmits(['close', 'submit', 'saveDraft'])

const title       = ref('')
const category    = ref('')
const equipmentId = ref(null)
const content     = ref('')

const equipmentList = ref([])
const errorMessage = ref('')
const equipmentLoadFailed = ref(false)

onMounted(async () => {
  try {
    const res = await knowledgeArticleApi.getEquipments()
    equipmentList.value = res.data.data ?? []
    equipmentLoadFailed.value = equipmentList.value.length === 0
    if (equipmentLoadFailed.value) {
      errorMessage.value = '설비 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
    }
  } catch (e) {
    console.error('[KMS] 설비 목록 로드 실패:', e)
    equipmentLoadFailed.value = true
    errorMessage.value = '설비 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  }
})

function getData() {
  return {
    title:       title.value,
    category:    category.value,
    equipmentId: equipmentId.value || null,
    content:     content.value,
  }
}

function handleSubmit() {
  if (!equipmentId.value) {
    errorMessage.value = '설비를 선택해야 등록할 수 있습니다.'
    return
  }
  errorMessage.value = ''
  emit('submit', getData())
}

function handleSaveDraft() {
  errorMessage.value = ''
  emit('saveDraft', getData())
}
</script>

<template>
  <BaseFormModal
    title="지식 작성"
    eyebrow="Knowledge Writer"
    width="560px"
    cancelText="취소"
    draftText="임시 저장"
    confirmText="등록"
    showDraftButton
    @close="emit('close')"
    @cancel="emit('close')"
    @draft="handleSaveDraft"
    @confirm="handleSubmit"
  >
    <div class="ka__form">
      <!-- Title + Category -->
      <div class="ka__row ka__row--two">
        <div class="ka__field">
          <label class="ka__label">제목</label>
          <input
            v-model="title"
            class="ka__input"
            type="text"
            placeholder="문서 제목을 입력하세요 (1~50자)"
          />
        </div>
        <div class="ka__field">
          <label class="ka__label">카테고리</label>
          <select v-model="category" class="ka__select">
            <option value="" disabled hidden></option>
            <option v-for="opt in ARTICLE_CATEGORY_OPTIONS" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Equipment -->
      <div class="ka__row">
        <div class="ka__field">
          <label class="ka__label">설비</label>
          <select v-model="equipmentId" class="ka__select" :disabled="equipmentLoadFailed">
            <option :value="null" disabled hidden></option>
            <option
              v-for="eq in equipmentList"
              :key="eq.equipmentId ?? eq.id"
              :value="eq.equipmentId ?? eq.id"
            >
              {{ eq.equipmentName ?? eq.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Content -->
      <div class="ka__row">
        <div class="ka__field">
          <div class="ka__label-row">
            <label class="ka__label">본문</label>
            <button class="ka__voice-btn">음성으로 작성</button>
          </div>
          <p class="ka__hint">음성 인식으로 본문을 빠르게 작성할 수 있습니다.</p>
          <textarea
            v-model="content"
            class="ka__textarea ka__textarea--lg"
            placeholder="작업 조건, 문제 원인, 해결 방법을 정리하세요 (최소 50자)"
            rows="6"
          ></textarea>
        </div>
      </div>
    </div>
    <p v-if="errorMessage" class="ka__error">{{ errorMessage }}</p>
  </BaseFormModal>
</template>

<style scoped>
.ka__form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.ka__row--two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.ka__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ka__label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.ka__label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ka__input,
.ka__select {
  padding: 10px 14px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text-default);
  background: var(--color-bg-surface);
  outline: none;
  transition: border-color 0.15s;
}

.ka__input:focus,
.ka__select:focus,
.ka__textarea:focus {
  border-color: var(--color-primary-300);
}

.ka__input::placeholder {
  color: var(--color-text-muted);
}

.ka__textarea {
  padding: 12px 14px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text-default);
  resize: none;
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
}

.ka__textarea::placeholder {
  color: var(--color-text-muted);
}

.ka__textarea--lg {
  min-height: 140px;
}

.ka__voice-btn {
  padding: 5px 14px;
  border: 1px solid var(--color-primary-300);
  border-radius: var(--radius-xs);
  background: var(--color-bg-surface);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary-700);
  cursor: pointer;
  transition: all 0.15s;
}

.ka__voice-btn:hover {
  background: var(--color-primary-100);
}

.ka__hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
}

.ka__error {
  margin: 0;
  font-size: 12px;
  color: var(--color-danger);
}
</style>
