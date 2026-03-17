<script setup>
const props = defineProps({
  request: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <div class="mentoring-modal">
    <div class="mentoring-modal__backdrop" @click="emit('close')"></div>
    <section class="mentoring-modal__dialog">
      <div class="mentoring-modal__head">
        <div>
          <p class="mentoring-modal__eyebrow">Mentoring Review</p>
          <h2>{{ request.name }}</h2>
        </div>
        <button type="button" class="mentoring-modal__close" @click="emit('close')">×</button>
      </div>

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

      <div class="mentoring-modal__actions">
        <button type="button" class="mentoring-modal__ghost" @click="emit('close')">닫기</button>
        <button type="button" class="mentoring-modal__primary" @click="emit('confirm', request)">검토 완료</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.mentoring-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
}

.mentoring-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(14, 12, 31, 0.48);
}

.mentoring-modal__dialog {
  position: relative;
  width: min(620px, calc(100vw - 32px));
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border-radius: 22px;
  background: #fff;
  padding: 24px;
  display: grid;
  gap: 18px;
  box-shadow: 0 30px 80px rgba(20, 15, 60, 0.24);
}

.mentoring-modal__head,
.mentoring-modal__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.mentoring-modal__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.mentoring-modal__head h2 {
  margin-top: 6px;
  font-size: 28px;
  color: var(--color-primary-800);
}

.mentoring-modal__close {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #f4f2ff;
  color: var(--color-primary-700);
  font-size: 24px;
  cursor: pointer;
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
