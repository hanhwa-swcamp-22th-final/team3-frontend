<script setup>
defineProps({
  request: { type: Object, required: true },
})

const emit = defineEmits(['close', 'accept'])
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="ma">
      <!-- Header -->
      <div class="ma__header">
        <h2 class="ma__title">매칭 신청 수락</h2>
        <p class="ma__desc">
          해당 멘토링 신청을 수락하면 진행중 매칭으로 전환되고, 신청자에게 즉시 수락 알림이 전달됩니다.
          매칭 범위와 가용 시간을 확인해 주세요.
        </p>
      </div>

      <!-- Mentee Profile -->
      <div class="ma__profile">
        <div class="ma__profile-left">
          <span class="ma__avatar" :style="{ background: request.avatarColor }">
            {{ request.initial }}
          </span>
          <div class="ma__profile-info">
            <span class="ma__profile-name">{{ request.name }}</span>
            <span class="ma__profile-msg">{{ request.message }}</span>
          </div>
        </div>
        <span class="ma__badge">매칭 신청</span>
      </div>

      <!-- Info Row -->
      <div class="ma__info">
        <div class="ma__info-col">
          <span class="ma__info-label">요청 분야</span>
          <span class="ma__info-value">{{ request.field }}</span>
        </div>
        <div class="ma__info-divider"></div>
        <div class="ma__info-col">
          <span class="ma__info-label">희망 기간</span>
          <span class="ma__info-value">{{ request.period }}</span>
        </div>
        <div class="ma__info-divider"></div>
        <div class="ma__info-col">
          <span class="ma__info-label">우선도</span>
          <span class="ma__info-value">{{ request.priority }}</span>
        </div>
      </div>

      <!-- Reason -->
      <div class="ma__section">
        <span class="ma__section-label">신청 사유</span>
        <p class="ma__section-text">{{ request.reason }}</p>
      </div>

      <!-- Management Memo -->
      <div class="ma__section ma__section--memo">
        <span class="ma__section-label">관리 메모</span>
        <p class="ma__section-text">{{ request.managementMemo }}</p>
      </div>

      <!-- Actions -->
      <div class="ma__actions">
        <button class="ma__btn ma__btn--cancel" @click="emit('close')">취소</button>
        <button class="ma__btn ma__btn--accept" @click="emit('accept', request)">수락</button>
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

.ma {
  background: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  padding: 32px;
  width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.ma__header {
  margin-bottom: 4px;
}

.ma__title {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text-strong);
  margin: 0 0 8px;
}

.ma__desc {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

/* ── Profile ───────────────────────────────────────────── */
.ma__profile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 16px 20px;
}

.ma__profile-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ma__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--color-white);
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ma__profile-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ma__profile-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.ma__profile-msg {
  font-size: 12px;
  color: var(--color-text-muted);
}

.ma__badge {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-2xs);
  background: var(--color-primary-200);
  color: var(--color-primary-800);
}

/* ── Info ───────────────────────────────────────────────── */
.ma__info {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 16px 0;
}

.ma__info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 20px;
}

.ma__info-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.ma__info-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.ma__info-divider {
  width: 1px;
  height: 36px;
  background: var(--color-border-default);
}

/* ── Sections ──────────────────────────────────────────── */
.ma__section {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 16px 18px;
}

.ma__section--memo {
  background: var(--color-neutral-50, #FAFBFF);
}

.ma__section-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.ma__section-text {
  font-size: 14px;
  color: var(--color-text-default);
  line-height: 1.7;
  margin: 8px 0 0;
}

/* ── Actions ───────────────────────────────────────────── */
.ma__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.ma__btn {
  padding: 10px 28px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.ma__btn--cancel {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  color: var(--color-text-default);
}

.ma__btn--accept {
  background: var(--color-primary-800);
  border: none;
  color: var(--color-white);
}
</style>
