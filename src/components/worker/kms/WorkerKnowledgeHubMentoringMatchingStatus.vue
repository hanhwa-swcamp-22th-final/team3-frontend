<script setup>
defineProps({
  ongoingMentoring: { type: Array, required: true },
  mentoringRequests: { type: Array, required: true },
})

const emit = defineEmits(['accept', 'request'])
</script>

<template>
  <div class="mm">
    <span class="mm__label">🤝 멘토링 매칭 현황</span>

    <!-- Ongoing Mentoring -->
    <div class="mm__section">
      <span class="mm__section-title">진행중인 멘토링</span>
      <div class="mm__ongoing">
        <div v-for="match in ongoingMentoring" :key="match.id" class="mm__match">
          <div class="mm__match-pair">
            <span class="mm__avatar" :style="{ background: match.mentorColor }">
              {{ match.mentorInitial }}
            </span>
            <span class="mm__arrow">→</span>
            <span class="mm__avatar" :style="{ background: match.menteeColor }">
              {{ match.menteeInitial }}
            </span>
          </div>
          <span class="mm__field-badge">{{ match.field }}</span>
          <span class="mm__status-badge">{{ match.status }}</span>
        </div>
      </div>
    </div>

    <!-- Matching Requests -->
    <div v-if="mentoringRequests.length" class="mm__section">
      <span class="mm__section-title">매칭 신청</span>
      <div class="mm__requests">
        <div v-for="req in mentoringRequests" :key="req.id" class="mm__request">
          <span class="mm__avatar" :style="{ background: req.avatarColor }">
            {{ req.initial }}
          </span>
          <span class="mm__request-text">{{ req.name }} · {{ req.message }}</span>
          <button class="mm__accept-btn" @click="emit('accept', req)">확인</button>
        </div>
      </div>
    </div>

    <!-- Request Button -->
    <button class="mm__request-btn" @click="emit('request')">
      멘토링 매칭 신청하기 +
    </button>
  </div>
</template>

<style scoped>
.mm {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mm__label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.mm__section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mm__section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
}

/* ── Ongoing ───────────────────────────────────────────── */
.mm__ongoing {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mm__match {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 14px 16px;
}

.mm__match-pair {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mm__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--color-white);
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mm__arrow {
  font-size: 14px;
  color: var(--color-text-muted);
}

.mm__field-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-2xs);
  background: var(--color-primary-200);
  color: var(--color-primary-800);
}

.mm__status-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-2xs);
  background: #dcfce7;
  color: #166534;
}

/* ── Requests ──────────────────────────────────────────── */
.mm__requests {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mm__request {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FFFDE7;
  border-radius: var(--radius-base);
  padding: 14px 16px;
}

.mm__request-text {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-default);
}

.mm__accept-btn {
  padding: 6px 16px;
  border: none;
  border-radius: var(--radius-xs);
  background: var(--color-primary-700);
  color: var(--color-white);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
}

.mm__accept-btn:hover {
  background: var(--color-primary-800);
}

/* ── Request Button ────────────────────────────────────── */
.mm__request-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-primary-700);
  color: var(--color-white);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.mm__request-btn:hover {
  background: var(--color-primary-800);
}
</style>
