<script setup>
import { BaseConfirmModal } from '@/components/common/base'

const props = defineProps({
  request: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <BaseConfirmModal
    eyebrow="Mentoring Review"
    :title="request.name"
    width="620px"
    cancel-text="닫기"
    confirm-text="검토 완료"
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
  </BaseConfirmModal>
</template>

<style scoped>
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

@media (max-width: 720px) {
  .mentoring-modal__meta {
    grid-template-columns: 1fr;
  }
}
</style>
