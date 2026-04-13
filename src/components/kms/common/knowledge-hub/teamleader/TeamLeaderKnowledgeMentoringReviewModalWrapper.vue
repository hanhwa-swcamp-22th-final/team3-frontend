<script setup>
import { BaseConfirmModal } from '@/components/common/base'

const props = defineProps({
  request: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  eyebrow: {
    type: String,
    default: 'Mentoring Review',
  },
  confirmText: {
    type: String,
    default: '검토 완료',
  },
  showRejectButton: {
    type: Boolean,
    default: false,
  },
  rejectText: {
    type: String,
    default: '거절',
  },
})

const emit = defineEmits(['close', 'confirm', 'reject'])
</script>

<template>
  <BaseConfirmModal
    :eyebrow="eyebrow"
    :title="title || request.name"
    width="620px"
    cancel-text="닫기"
    :confirm-text="confirmText"
    @close="emit('close')"
    @cancel="emit('close')"
    @confirm="emit('confirm', request)"
  >
    <div class="mentoring-modal__meta">
      <div>
        <span>요청자</span>
        <strong>{{ request.requestedBy }}</strong>
      </div>
      <div>
        <span>요청 시각</span>
        <strong>{{ request.requestedAt }}</strong>
      </div>
      <div>
        <span>우선순위</span>
        <strong>{{ request.priority }}</strong>
      </div>
    </div>

    <article class="mentoring-modal__section">
      <h3>요청 사유</h3>
      <p>{{ request.reason }}</p>
    </article>

    <article class="mentoring-modal__section">
      <h3>상세 내용</h3>
      <p>{{ request.details }}</p>
    </article>

    <template #footer>
      <div class="mentoring-modal__actions">
        <button type="button" class="mentoring-modal__ghost" @click="emit('close')">닫기</button>
        <button
          v-if="showRejectButton"
          type="button"
          class="mentoring-modal__danger"
          @click="emit('reject', request)"
        >
          {{ rejectText }}
        </button>
        <button type="button" class="mentoring-modal__primary" @click="emit('confirm', request)">
          {{ confirmText }}
        </button>
      </div>
    </template>
  </BaseConfirmModal>
</template>

<style scoped>
.mentoring-modal__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}

.mentoring-modal__meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.mentoring-modal__meta div,
.mentoring-modal__section {
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 16px;
}

.mentoring-modal__meta span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.mentoring-modal__meta strong,
.mentoring-modal__section h3 {
  display: block;
  margin-top: 6px;
  color: var(--color-primary-800);
}

.mentoring-modal__section p {
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-default);
}

.mentoring-modal__ghost,
.mentoring-modal__danger,
.mentoring-modal__primary {
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.mentoring-modal__ghost {
  border: 1px solid var(--color-border-default);
  background: #fff;
  color: var(--color-text-default);
}

.mentoring-modal__danger {
  border: 1px solid #f1b4b9;
  background: #fff5f6;
  color: #d63c4f;
}

.mentoring-modal__primary {
  border: none;
  background: var(--color-primary-700);
  color: #fff;
}

@media (max-width: 720px) {
  .mentoring-modal__meta {
    grid-template-columns: 1fr;
  }
}
</style>
