<script setup>
import { ref } from 'vue'

const props = defineProps({
  defaults: { type: Object, required: true },
})

const emit = defineEmits(['close', 'submit'])

const field = ref(props.defaults.field)
const period = ref(props.defaults.period)
const frequency = ref(props.defaults.frequency)
const purpose = ref(props.defaults.purpose)
const requestDetails = ref(props.defaults.requestDetails)
const operatingMemo = ref(props.defaults.operatingMemo)

function handleSubmit() {
  emit('submit', {
    field: field.value,
    period: period.value,
    frequency: frequency.value,
    purpose: purpose.value,
    requestDetails: requestDetails.value,
    operatingMemo: operatingMemo.value,
  })
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="mq">
      <!-- Header -->
      <div class="mq__header">
        <h2 class="mq__title">매칭 신청</h2>
        <p class="mq__desc">
          선택한 멘토에게 학습 목적과 희망 운영 조건을 전달합니다. 신청 후 수락되면 진행중 멘토링으로
          전환되고 TL / GL에게 공유됩니다.
        </p>
      </div>

      <!-- My Profile -->
      <div class="mq__profile">
        <span class="mq__avatar" :style="{ background: defaults.myAvatarColor }">
          {{ defaults.myInitial }}
        </span>
        <div class="mq__profile-info">
          <span class="mq__profile-name">{{ defaults.myName }}</span>
          <span class="mq__profile-title">{{ defaults.myTitle }}</span>
        </div>
      </div>

      <!-- Info Row -->
      <div class="mq__info">
        <div class="mq__info-col">
          <span class="mq__info-label">신청 분야</span>
          <span class="mq__info-value">{{ field }}</span>
        </div>
        <div class="mq__info-divider"></div>
        <div class="mq__info-col">
          <span class="mq__info-label">희망 기간</span>
          <span class="mq__info-value">{{ period }}</span>
        </div>
        <div class="mq__info-divider"></div>
        <div class="mq__info-col">
          <span class="mq__info-label">희망 빈도</span>
          <span class="mq__info-value">{{ frequency }}</span>
        </div>
      </div>

      <!-- Purpose -->
      <div class="mq__section">
        <span class="mq__section-label">학습 목적</span>
        <textarea v-model="purpose" class="mq__textarea" rows="3"></textarea>
      </div>

      <!-- Request Details -->
      <div class="mq__section">
        <span class="mq__section-label">희망 요청 내용</span>
        <textarea v-model="requestDetails" class="mq__textarea" rows="3"></textarea>
      </div>

      <!-- Operating Memo -->
      <div class="mq__section mq__section--memo">
        <span class="mq__section-label">운영 메모</span>
        <textarea v-model="operatingMemo" class="mq__textarea" rows="2"></textarea>
      </div>

      <!-- Actions -->
      <div class="mq__actions">
        <button class="mq__btn mq__btn--cancel" @click="emit('close')">취소</button>
        <button class="mq__btn mq__btn--submit" @click="handleSubmit">신청 보내기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow: hidden;
}

.mq {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.mq__header {
  margin-bottom: 4px;
}

.mq__title {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text-strong);
  margin: 0 0 8px;
}

.mq__desc {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

/* ── Profile ───────────────────────────────────────────── */
.mq__profile {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  padding: 16px 20px;
}

.mq__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mq__profile-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mq__profile-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.mq__profile-title {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* ── Info ───────────────────────────────────────────────── */
.mq__info {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  padding: 16px 0;
}

.mq__info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 20px;
}

.mq__info-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.mq__info-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.mq__info-divider {
  width: 1px;
  height: 36px;
  background: var(--color-border-default);
}

/* ── Sections ──────────────────────────────────────────── */
.mq__section {
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  padding: 16px 18px;
}

.mq__section--memo {
  background: var(--color-neutral-50, #FAFBFF);
}

.mq__section-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.mq__textarea {
  width: 100%;
  margin-top: 8px;
  border: none;
  font-size: 14px;
  color: var(--color-text-default);
  line-height: 1.7;
  resize: vertical;
  font-family: inherit;
  background: transparent;
}

.mq__textarea:focus {
  outline: none;
}

/* ── Actions ───────────────────────────────────────────── */
.mq__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.mq__btn {
  padding: 10px 28px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.mq__btn--cancel {
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  color: var(--color-text-default);
}

.mq__btn--submit {
  background: var(--color-primary-800);
  border: none;
  color: #ffffff;
}
</style>
