<script setup>
import { ref, onMounted } from 'vue'
import { BaseFormModal } from '@/components/common/base'
import { ARTICLE_CATEGORY_OPTIONS } from '@/constants'
import knowledgeArticleApi from '@/services/knowledgeArticleApi'

const props = defineProps({
  article: { type: Object, required: true },
})

const emit = defineEmits(['close', 'submit', 'saveDraft'])

// 백엔드 enum 값으로 초기화 (categoryEnum, equipmentId는 뷰에서 매핑 시 추가)
const title       = ref(props.article.title ?? '')
const category    = ref(props.article.categoryEnum ?? '')
const equipmentId = ref(props.article.equipmentId ?? null)
const content     = ref(props.article.content ?? '')

const equipmentList = ref([])

onMounted(async () => {
  try {
    const res = await knowledgeArticleApi.getEquipments()
    equipmentList.value = res.data.data ?? []
  } catch (e) {
    console.error('[KMS] 설비 목록 로드 실패:', e)
  }
})

function getData() {
  return {
    id:          props.article.id,
    title:       title.value,
    category:    category.value,
    equipmentId: equipmentId.value || null,
    content:     content.value,
  }
}

function handleSubmit() {
  emit('submit', getData())
}

function handleSaveDraft() {
  emit('saveDraft', getData())
}
</script>

<template>
  <BaseFormModal
    title="지식 수정"
    eyebrow="Knowledge Editor"
    width="560px"
    cancelText="취소"
    draftText="임시 저장"
    confirmText="수정 완료"
    showDraftButton
    @close="emit('close')"
    @cancel="emit('close')"
    @draft="handleSaveDraft"
    @confirm="handleSubmit"
  >
    <div class="ke__form">
      <!-- Title + Category -->
      <div class="ke__row ke__row--two">
        <div class="ke__field">
          <label class="ke__label">제목</label>
          <input
            v-model="title"
            class="ke__input"
            type="text"
            placeholder="문서 제목을 입력하세요"
          />
        </div>
        <div class="ke__field">
          <label class="ke__label">카테고리</label>
          <select v-model="category" class="ke__select">
            <option value="" disabled hidden></option>
            <option v-for="opt in ARTICLE_CATEGORY_OPTIONS" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Equipment -->
      <div class="ke__row">
        <div class="ke__field">
          <label class="ke__label">설비</label>
          <select v-model="equipmentId" class="ke__select">
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
      <div class="ke__row">
        <div class="ke__field">
          <label class="ke__label">본문</label>
          <textarea
            v-model="content"
            class="ke__textarea ke__textarea--lg"
            placeholder="작업 조건, 문제 원인, 해결 방법을 정리하세요"
            rows="6"
          ></textarea>
        </div>
      </div>
    </div>
  </BaseFormModal>
</template>

<style scoped>
.ke__form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.ke__row--two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.ke__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ke__label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.ke__input,
.ke__select {
  padding: 10px 14px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text-default);
  background: var(--color-bg-surface);
  outline: none;
  transition: border-color 0.15s;
}

.ke__input:focus,
.ke__select:focus,
.ke__textarea:focus {
  border-color: var(--color-primary-300);
}

.ke__input::placeholder {
  color: var(--color-text-muted);
}

.ke__textarea {
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

.ke__textarea::placeholder {
  color: var(--color-text-muted);
}

.ke__textarea--lg {
  min-height: 140px;
}
</style>
